# Deploying Nepal Trip

This is a full-stack app with three pieces that all need hosting:

| Piece     | Path           | Recommended Host                     |
|-----------|----------------|--------------------------------------|
| Frontend  | `/frontend`    | Vercel (config provided below)       |
| Backend   | `/backend`     | Railway / Render / Fly.io / Emergent |
| Database  | MongoDB        | MongoDB Atlas (free tier)            |

> Vercel cannot host the FastAPI backend with its long-lived MongoDB connection as a standard project. The frontend is fully Vercel-ready; the backend must live elsewhere. Emergent's one-click deployment hosts all three together.

---

## 1. Deploy the frontend to Vercel

In the Vercel dashboard → **Add New… → Project**:

1. Import your GitHub repository.
2. **Root Directory** → `frontend`
3. Framework should auto-detect as **Create React App**.
4. Vercel will pick up `frontend/vercel.json`:
   - Install command: `yarn install --frozen-lockfile`
   - Build command: `yarn build`
   - Output directory: `build`
   - SPA rewrite to `/index.html`
5. Add the environment variable:
   - `REACT_APP_BACKEND_URL` = the public URL of your deployed backend (e.g. `https://nepaltrip-api.up.railway.app`). **No trailing slash.**
6. Click **Deploy**.

### Why the original deploy failed
Your original error was a peer-dep conflict between `date-fns@4` and `react-day-picker@8`. The provided `frontend/.npmrc` (`legacy-peer-deps=true`) plus `installCommand: yarn install` in `vercel.json` resolves this on Vercel.

---

## 2. Deploy the backend (FastAPI) to Railway / Render

Both work — Railway is the fastest path.

**Railway**:
1. Sign up at https://railway.app, **New Project → Deploy from GitHub repo**.
2. Set **Root Directory** to `backend`.
3. Add a `Procfile` in `backend/` (already included):
   ```
   web: uvicorn server:app --host 0.0.0.0 --port $PORT
   ```
4. Set environment variables:
   - `MONGO_URL` → your MongoDB Atlas connection string
   - `DB_NAME` → e.g. `nepaltrip`
   - `CORS_ORIGINS` → your Vercel frontend domain (e.g. `https://nepaltrip.vercel.app`)
   - `JWT_SECRET` → a 64-char random hex (`python -c "import secrets;print(secrets.token_hex(32))"`)
   - `ADMIN_EMAIL` → `devanshpandey8933@gmail.com`
   - `ADMIN_PASSWORD` → `nepaltrip123`
5. Railway will give you a URL like `https://nepaltrip-api.up.railway.app`. Use this as `REACT_APP_BACKEND_URL` in Vercel.

---

## 3. Set up MongoDB Atlas (free)

1. Create a free cluster at https://www.mongodb.com/cloud/atlas
2. Network Access → **Allow access from anywhere** (0.0.0.0/0) for the initial deploy, then tighten.
3. Database Access → create a user.
4. Copy the SRV connection string and set as `MONGO_URL` on Railway. Example:
   `mongodb+srv://user:pass@cluster0.mongodb.net/?retryWrites=true&w=majority`

---

## Local dev quick reference

```bash
# Backend
cd backend
pip install -r requirements.txt
uvicorn server:app --reload --port 8001

# Frontend
cd frontend
yarn install
yarn start
```
