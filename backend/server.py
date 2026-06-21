from dotenv import load_dotenv
from pathlib import Path
ROOT_DIR = Path(__file__).parent
load_dotenv(ROOT_DIR / '.env')

from fastapi import FastAPI, APIRouter, HTTPException, Depends, Request
from fastapi.security import HTTPBearer, HTTPAuthorizationCredentials
from starlette.middleware.cors import CORSMiddleware
from motor.motor_asyncio import AsyncIOMotorClient
import os
import logging
import bcrypt
import jwt
from pydantic import BaseModel, Field, ConfigDict
from typing import List, Optional, Literal
import uuid
from datetime import datetime, timezone, timedelta


# ---------- Config ----------
mongo_url = os.environ['MONGO_URL']
client = AsyncIOMotorClient(mongo_url)
db = client[os.environ['DB_NAME']]
JWT_SECRET = os.environ['JWT_SECRET']
JWT_ALG = "HS256"
JWT_TTL_DAYS = 7
ADMIN_EMAIL = os.environ.get('ADMIN_EMAIL', '').lower().strip()
ADMIN_PASSWORD = os.environ.get('ADMIN_PASSWORD', '')

app = FastAPI(title="Nepal Trip API")
api_router = APIRouter(prefix="/api")
bearer = HTTPBearer(auto_error=False)

logging.basicConfig(level=logging.INFO, format='%(asctime)s - %(name)s - %(levelname)s - %(message)s')
logger = logging.getLogger(__name__)


# ---------- Auth helpers ----------
def hash_password(password: str) -> str:
    return bcrypt.hashpw(password.encode("utf-8"), bcrypt.gensalt()).decode("utf-8")


def verify_password(plain: str, hashed: str) -> bool:
    try:
        return bcrypt.checkpw(plain.encode("utf-8"), hashed.encode("utf-8"))
    except Exception:
        return False


def create_token(user_id: str, email: str) -> str:
    payload = {
        "sub": user_id,
        "email": email,
        "role": "admin",
        "exp": datetime.now(timezone.utc) + timedelta(days=JWT_TTL_DAYS),
        "iat": datetime.now(timezone.utc),
    }
    return jwt.encode(payload, JWT_SECRET, algorithm=JWT_ALG)


async def get_current_admin(creds: Optional[HTTPAuthorizationCredentials] = Depends(bearer)) -> dict:
    if creds is None or not creds.credentials:
        raise HTTPException(status_code=401, detail="Not authenticated")
    try:
        payload = jwt.decode(creds.credentials, JWT_SECRET, algorithms=[JWT_ALG])
    except jwt.ExpiredSignatureError:
        raise HTTPException(status_code=401, detail="Token expired")
    except jwt.InvalidTokenError:
        raise HTTPException(status_code=401, detail="Invalid token")

    if payload.get("role") != "admin":
        raise HTTPException(status_code=403, detail="Admin access required")
    user = await db.users.find_one({"id": payload.get("sub")}, {"_id": 0, "password_hash": 0})
    if not user:
        raise HTTPException(status_code=401, detail="User not found")
    return user


# ---------- Models ----------
class Lead(BaseModel):
    model_config = ConfigDict(extra="ignore")
    id: str = Field(default_factory=lambda: str(uuid.uuid4()))
    name: str
    email: str
    mobile: str
    description: Optional[str] = ""
    subject: str
    category: str = "general"   # general | service | package
    slug: Optional[str] = None
    status: Literal["new", "in_progress", "closed"] = "new"
    notes: str = ""
    created_at: datetime = Field(default_factory=lambda: datetime.now(timezone.utc))


class LeadCreate(BaseModel):
    name: str
    email: str
    mobile: str
    description: Optional[str] = ""
    subject: str
    category: str = "general"
    slug: Optional[str] = None


class LeadUpdate(BaseModel):
    status: Optional[Literal["new", "in_progress", "closed"]] = None
    notes: Optional[str] = None


class LoginRequest(BaseModel):
    email: str
    password: str


class LoginResponse(BaseModel):
    token: str
    user: dict


class AdminUserCreate(BaseModel):
    email: str
    password: str
    name: Optional[str] = "Admin"


class AdminPasswordUpdate(BaseModel):
    password: str


# ---------- Routes: Public ----------
@api_router.get("/")
async def root():
    return {"message": "Nepal Trip API is running", "company": "Nepal Trip"}


@api_router.get("/health")
async def health():
    return {"status": "ok", "ts": datetime.now(timezone.utc).isoformat()}


@api_router.post("/leads", response_model=Lead)
async def create_lead(payload: LeadCreate):
    lead = Lead(**payload.model_dump())
    doc = lead.model_dump()
    doc['created_at'] = doc['created_at'].isoformat()
    await db.leads.insert_one(doc)
    return lead


# ---------- Routes: Auth ----------
@api_router.post("/auth/login", response_model=LoginResponse)
async def login(payload: LoginRequest):
    email = (payload.email or "").lower().strip()
    user = await db.users.find_one({"email": email})
    if not user or not verify_password(payload.password, user.get("password_hash", "")):
        raise HTTPException(status_code=401, detail="Invalid email or password")
    token = create_token(user["id"], user["email"])
    return {
        "token": token,
        "user": {"id": user["id"], "email": user["email"], "name": user.get("name", "Admin"), "role": user.get("role", "admin")},
    }


@api_router.get("/auth/me")
async def me(current: dict = Depends(get_current_admin)):
    return current


# ---------- Routes: Admin ----------
@api_router.get("/admin/leads", response_model=List[Lead])
async def list_leads(
    category: Optional[str] = None,
    status: Optional[str] = None,
    search: Optional[str] = None,
    limit: int = 500,
    current: dict = Depends(get_current_admin),
):
    query = {}
    if category and category != "all":
        query["category"] = category
    if status and status != "all":
        query["status"] = status
    if search:
        query["$or"] = [
            {"name": {"$regex": search, "$options": "i"}},
            {"email": {"$regex": search, "$options": "i"}},
            {"mobile": {"$regex": search, "$options": "i"}},
            {"subject": {"$regex": search, "$options": "i"}},
        ]
    cursor = db.leads.find(query, {"_id": 0}).sort("created_at", -1).limit(limit)
    items = await cursor.to_list(limit)
    for it in items:
        if "status" not in it:
            it["status"] = "new"
        if "notes" not in it:
            it["notes"] = ""
        if isinstance(it.get('created_at'), str):
            try:
                it['created_at'] = datetime.fromisoformat(it['created_at'])
            except Exception:
                pass
    return items


@api_router.get("/admin/leads/stats")
async def leads_stats(current: dict = Depends(get_current_admin)):
    total = await db.leads.count_documents({})
    new_count = await db.leads.count_documents({"status": {"$in": ["new", None]}})
    in_progress = await db.leads.count_documents({"status": "in_progress"})
    closed = await db.leads.count_documents({"status": "closed"})
    # by category
    by_category = {}
    for c in ["general", "service", "package"]:
        by_category[c] = await db.leads.count_documents({"category": c})
    # by subject (top sources)
    pipeline = [
        {"$group": {"_id": {"subject": "$subject", "category": "$category", "slug": "$slug"}, "count": {"$sum": 1}}},
        {"$sort": {"count": -1}},
        {"$limit": 20},
    ]
    by_subject = []
    async for row in db.leads.aggregate(pipeline):
        by_subject.append({
            "subject": row["_id"].get("subject"),
            "category": row["_id"].get("category"),
            "slug": row["_id"].get("slug"),
            "count": row["count"],
        })
    return {
        "total": total,
        "new": new_count,
        "in_progress": in_progress,
        "closed": closed,
        "by_category": by_category,
        "by_subject": by_subject,
    }


@api_router.patch("/admin/leads/{lead_id}", response_model=Lead)
async def update_lead(lead_id: str, payload: LeadUpdate, current: dict = Depends(get_current_admin)):
    update = {k: v for k, v in payload.model_dump(exclude_unset=True).items() if v is not None}
    if not update:
        raise HTTPException(status_code=400, detail="Nothing to update")
    result = await db.leads.find_one_and_update(
        {"id": lead_id},
        {"$set": update},
        return_document=True,
        projection={"_id": 0},
    )
    if not result:
        raise HTTPException(status_code=404, detail="Lead not found")
    if "status" not in result:
        result["status"] = "new"
    if "notes" not in result:
        result["notes"] = ""
    if isinstance(result.get("created_at"), str):
        try:
            result["created_at"] = datetime.fromisoformat(result["created_at"])
        except Exception:
            pass
    return result


@api_router.delete("/admin/leads/{lead_id}")
async def delete_lead(lead_id: str, current: dict = Depends(get_current_admin)):
    res = await db.leads.delete_one({"id": lead_id})
    if res.deleted_count == 0:
        raise HTTPException(status_code=404, detail="Lead not found")
    return {"ok": True}


# ---------- Routes: Admin user management ----------
@api_router.get("/admin/users")
async def list_admin_users(current: dict = Depends(get_current_admin)):
    cursor = db.users.find({}, {"_id": 0, "password_hash": 0}).sort("created_at", 1)
    return await cursor.to_list(100)


@api_router.post("/admin/users", status_code=201)
async def create_admin_user(payload: AdminUserCreate, current: dict = Depends(get_current_admin)):
    email = (payload.email or "").lower().strip()
    if not email or "@" not in email:
        raise HTTPException(status_code=400, detail="Valid email required")
    if not payload.password or len(payload.password) < 6:
        raise HTTPException(status_code=400, detail="Password must be at least 6 characters")
    existing = await db.users.find_one({"email": email})
    if existing:
        raise HTTPException(status_code=409, detail="An admin with this email already exists")
    user = {
        "id": str(uuid.uuid4()),
        "email": email,
        "password_hash": hash_password(payload.password),
        "name": payload.name or "Admin",
        "role": "admin",
        "created_at": datetime.now(timezone.utc).isoformat(),
    }
    await db.users.insert_one(user)
    return {"id": user["id"], "email": user["email"], "name": user["name"], "role": user["role"], "created_at": user["created_at"]}


@api_router.patch("/admin/users/{user_id}/password")
async def reset_admin_password(user_id: str, payload: AdminPasswordUpdate, current: dict = Depends(get_current_admin)):
    if not payload.password or len(payload.password) < 6:
        raise HTTPException(status_code=400, detail="Password must be at least 6 characters")
    target = await db.users.find_one({"id": user_id})
    if not target:
        raise HTTPException(status_code=404, detail="User not found")
    await db.users.update_one({"id": user_id}, {"$set": {"password_hash": hash_password(payload.password)}})
    return {"ok": True}


@api_router.delete("/admin/users/{user_id}")
async def delete_admin_user(user_id: str, current: dict = Depends(get_current_admin)):
    if user_id == current.get("id"):
        raise HTTPException(status_code=400, detail="You cannot delete your own account")
    total = await db.users.count_documents({})
    if total <= 1:
        raise HTTPException(status_code=400, detail="Cannot delete the last admin account")
    res = await db.users.delete_one({"id": user_id})
    if res.deleted_count == 0:
        raise HTTPException(status_code=404, detail="User not found")
    return {"ok": True}


# ---------- Startup ----------
@app.on_event("startup")
async def on_startup():
    if not ADMIN_EMAIL or not ADMIN_PASSWORD:
        logger.warning("ADMIN_EMAIL / ADMIN_PASSWORD not set; admin will not be seeded")
        return
    existing = await db.users.find_one({"email": ADMIN_EMAIL})
    if existing is None:
        await db.users.insert_one({
            "id": str(uuid.uuid4()),
            "email": ADMIN_EMAIL,
            "password_hash": hash_password(ADMIN_PASSWORD),
            "name": "Admin",
            "role": "admin",
            "created_at": datetime.now(timezone.utc).isoformat(),
        })
        logger.info(f"Seeded admin {ADMIN_EMAIL}")
    elif not verify_password(ADMIN_PASSWORD, existing.get("password_hash", "")):
        await db.users.update_one(
            {"email": ADMIN_EMAIL},
            {"$set": {"password_hash": hash_password(ADMIN_PASSWORD)}},
        )
        logger.info(f"Updated admin password for {ADMIN_EMAIL}")
    try:
        await db.users.create_index("email", unique=True)
        await db.leads.create_index("created_at")
    except Exception as e:
        logger.warning(f"Index creation: {e}")


app.include_router(api_router)
app.add_middleware(
    CORSMiddleware,
    allow_credentials=True,
    allow_origins=os.environ.get('CORS_ORIGINS', '*').split(','),
    allow_methods=["*"],
    allow_headers=["*"],
)


@app.on_event("shutdown")
async def shutdown_db_client():
    client.close()
