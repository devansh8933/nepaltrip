"""Backend API tests for Nepal Trip — JWT email/password auth + admin leads CRUD."""
import os
import uuid
import pytest
import requests

BASE_URL = os.environ.get("REACT_APP_BACKEND_URL", "https://adventure-nepal-hub.preview.emergentagent.com").rstrip("/")
API = f"{BASE_URL}/api"
ADMIN_EMAIL = "devanshpandey8933@gmail.com"
ADMIN_PASSWORD = "nepaltrip123"


@pytest.fixture(scope="session")
def client():
    s = requests.Session()
    s.headers.update({"Content-Type": "application/json"})
    return s


@pytest.fixture(scope="session")
def admin_token(client):
    r = client.post(f"{API}/auth/login", json={"email": ADMIN_EMAIL, "password": ADMIN_PASSWORD})
    assert r.status_code == 200, f"Admin login failed: {r.status_code} {r.text}"
    data = r.json()
    assert "token" in data
    return data["token"]


@pytest.fixture(scope="session")
def auth_headers(admin_token):
    return {"Authorization": f"Bearer {admin_token}"}


# --------- Health & root ---------
class TestRoot:
    def test_root_returns_welcome(self, client):
        r = client.get(f"{API}/")
        assert r.status_code == 200
        data = r.json()
        assert data.get("message") == "Nepal Trip API is running"
        assert data.get("company") == "Nepal Trip"

    def test_health_ok(self, client):
        r = client.get(f"{API}/health")
        assert r.status_code == 200
        assert r.json().get("status") == "ok"


# --------- Auth ---------
class TestAuth:
    def test_login_success(self, client):
        r = client.post(f"{API}/auth/login", json={"email": ADMIN_EMAIL, "password": ADMIN_PASSWORD})
        assert r.status_code == 200, r.text
        data = r.json()
        assert "token" in data and isinstance(data["token"], str) and len(data["token"]) > 20
        assert "user" in data
        assert data["user"]["email"] == ADMIN_EMAIL
        assert data["user"].get("role") == "admin"

    def test_login_wrong_password(self, client):
        r = client.post(f"{API}/auth/login", json={"email": ADMIN_EMAIL, "password": "wrongpass"})
        assert r.status_code == 401
        assert "Invalid email or password" in r.text

    def test_login_unknown_email(self, client):
        r = client.post(f"{API}/auth/login", json={"email": "nobody@example.com", "password": "x"})
        assert r.status_code == 401

    def test_login_email_case_insensitive(self, client):
        r = client.post(f"{API}/auth/login", json={"email": ADMIN_EMAIL.upper(), "password": ADMIN_PASSWORD})
        assert r.status_code == 200

    def test_me_without_token_returns_401(self, client):
        r = requests.get(f"{API}/auth/me")
        assert r.status_code == 401

    def test_me_with_token_returns_user(self, client, auth_headers):
        r = requests.get(f"{API}/auth/me", headers=auth_headers)
        assert r.status_code == 200, r.text
        u = r.json()
        assert u["email"] == ADMIN_EMAIL
        assert "password_hash" not in u
        assert "_id" not in u

    def test_me_with_invalid_token_returns_401(self, client):
        r = requests.get(f"{API}/auth/me", headers={"Authorization": "Bearer not-a-real-token"})
        assert r.status_code == 401


# --------- Public POST /api/leads ---------
class TestLeadsPost:
    def test_create_lead_service_public(self, client):
        payload = {
            "name": "TEST_Service User",
            "email": f"test_{uuid.uuid4().hex[:6]}@example.com",
            "mobile": "+919580261255",
            "description": "Want tour-operator details",
            "subject": "Tour Operator",
            "category": "service",
            "slug": "tour-operator",
        }
        r = client.post(f"{API}/leads", json=payload)
        assert r.status_code == 200, r.text
        data = r.json()
        assert "id" in data
        assert data["category"] == "service"
        assert data["slug"] == "tour-operator"
        return data["id"]

    def test_create_lead_package_public(self, client):
        payload = {
            "name": "TEST_Package User",
            "email": f"pkg_{uuid.uuid4().hex[:6]}@example.com",
            "mobile": "+919999999999",
            "description": "Kathmandu plan",
            "subject": "Kathmandu Tours",
            "category": "package",
            "slug": "kathmandu",
        }
        r = client.post(f"{API}/leads", json=payload)
        assert r.status_code == 200
        assert r.json()["category"] == "package"

    def test_create_lead_general_default(self, client):
        payload = {
            "name": "TEST_General User",
            "email": f"gen_{uuid.uuid4().hex[:6]}@example.com",
            "mobile": "+910000000000",
            "subject": "General Enquiry",
        }
        r = client.post(f"{API}/leads", json=payload)
        assert r.status_code == 200
        assert r.json()["category"] == "general"

    def test_create_lead_missing_required_returns_422(self, client):
        r = client.post(f"{API}/leads", json={"mobile": "12345"})
        assert r.status_code == 422


# --------- Admin GET /api/admin/leads ---------
class TestAdminLeadsList:
    def test_list_without_auth_returns_401(self):
        r = requests.get(f"{API}/admin/leads")
        assert r.status_code == 401

    def test_list_with_invalid_token_returns_401(self):
        r = requests.get(f"{API}/admin/leads", headers={"Authorization": "Bearer bad-token"})
        assert r.status_code == 401

    def test_list_with_auth_returns_list(self, auth_headers):
        r = requests.get(f"{API}/admin/leads", headers=auth_headers)
        assert r.status_code == 200, r.text
        items = r.json()
        assert isinstance(items, list)
        for it in items[:5]:
            assert "_id" not in it
            assert "id" in it
            assert "category" in it

    def test_list_category_filter_service(self, auth_headers):
        r = requests.get(f"{API}/admin/leads", headers=auth_headers, params={"category": "service"})
        assert r.status_code == 200
        for it in r.json():
            assert it.get("category") == "service"

    def test_list_category_filter_package(self, auth_headers):
        r = requests.get(f"{API}/admin/leads", headers=auth_headers, params={"category": "package"})
        assert r.status_code == 200
        for it in r.json():
            assert it.get("category") == "package"

    def test_list_status_filter_new(self, auth_headers):
        r = requests.get(f"{API}/admin/leads", headers=auth_headers, params={"status": "new"})
        assert r.status_code == 200
        for it in r.json():
            assert it.get("status") == "new"

    def test_list_search_filter(self, client, auth_headers):
        # seed a known lead
        marker = f"SEARCHME{uuid.uuid4().hex[:6]}"
        client.post(f"{API}/leads", json={
            "name": f"TEST_{marker}",
            "email": f"{marker.lower()}@example.com",
            "mobile": "+910000000001",
            "subject": "General",
        })
        r = requests.get(f"{API}/admin/leads", headers=auth_headers, params={"search": marker})
        assert r.status_code == 200
        items = r.json()
        assert any(marker in it.get("name", "") for it in items)


# --------- Admin stats ---------
class TestAdminLeadsStats:
    def test_stats_no_auth_401(self):
        r = requests.get(f"{API}/admin/leads/stats")
        assert r.status_code == 401

    def test_stats_with_auth(self, auth_headers):
        r = requests.get(f"{API}/admin/leads/stats", headers=auth_headers)
        assert r.status_code == 200, r.text
        d = r.json()
        for k in ("total", "new", "in_progress", "closed", "by_category", "by_subject"):
            assert k in d
        for c in ("general", "service", "package"):
            assert c in d["by_category"]
        assert isinstance(d["by_subject"], list)


# --------- Admin PATCH / DELETE ---------
class TestAdminLeadsMutations:
    def _create_lead(self, client):
        r = client.post(f"{API}/leads", json={
            "name": "TEST_Mutation",
            "email": f"mut_{uuid.uuid4().hex[:6]}@example.com",
            "mobile": "+919000000000",
            "subject": "Tour Operator",
            "category": "service",
            "slug": "tour-operator",
        })
        assert r.status_code == 200
        return r.json()["id"]

    def test_patch_requires_auth(self, client):
        lead_id = self._create_lead(client)
        r = requests.patch(f"{API}/admin/leads/{lead_id}", json={"status": "in_progress"})
        assert r.status_code == 401

    def test_patch_status_and_notes(self, client, auth_headers):
        lead_id = self._create_lead(client)
        r = requests.patch(
            f"{API}/admin/leads/{lead_id}",
            headers=auth_headers,
            json={"status": "in_progress", "notes": "Following up"},
        )
        assert r.status_code == 200, r.text
        d = r.json()
        assert d["status"] == "in_progress"
        assert d["notes"] == "Following up"
        # verify persistence
        g = requests.get(f"{API}/admin/leads", headers=auth_headers, params={"search": "TEST_Mutation"})
        rows = [x for x in g.json() if x["id"] == lead_id]
        assert rows and rows[0]["status"] == "in_progress" and rows[0]["notes"] == "Following up"

    def test_patch_unknown_id_returns_404(self, auth_headers):
        r = requests.patch(
            f"{API}/admin/leads/doesnotexist-{uuid.uuid4()}",
            headers=auth_headers,
            json={"status": "closed"},
        )
        assert r.status_code == 404

    def test_delete_requires_auth(self, client):
        lead_id = self._create_lead(client)
        r = requests.delete(f"{API}/admin/leads/{lead_id}")
        assert r.status_code == 401

    def test_delete_removes_lead(self, client, auth_headers):
        lead_id = self._create_lead(client)
        r = requests.delete(f"{API}/admin/leads/{lead_id}", headers=auth_headers)
        assert r.status_code == 200
        # GET should no longer include it
        g = requests.get(f"{API}/admin/leads", headers=auth_headers)
        assert g.status_code == 200
        assert not any(it["id"] == lead_id for it in g.json())

    def test_delete_unknown_id_404(self, auth_headers):
        r = requests.delete(f"{API}/admin/leads/does-not-exist", headers=auth_headers)
        assert r.status_code == 404


# --------- Old endpoint removed ---------
class TestOldEndpointRemoved:
    def test_get_old_leads_not_available(self):
        r = requests.get(f"{API}/leads")
        # Must NOT be 200 — endpoint replaced by /api/admin/leads
        assert r.status_code in (401, 404, 405), f"Expected 401/404/405 but got {r.status_code}: {r.text}"


# --------- End-to-end public → admin ---------
class TestEndToEnd:
    def test_public_submission_appears_in_admin_service_tab(self, client, auth_headers):
        marker = f"E2E{uuid.uuid4().hex[:6]}"
        r = client.post(f"{API}/leads", json={
            "name": f"TEST_{marker}",
            "email": f"{marker.lower()}@example.com",
            "mobile": "+919876543210",
            "description": "Need tour operator",
            "subject": "Tour Operator",
            "category": "service",
            "slug": "tour-operator",
        })
        assert r.status_code == 200
        new_id = r.json()["id"]

        g = requests.get(f"{API}/admin/leads", headers=auth_headers, params={"category": "service"})
        assert g.status_code == 200
        match = [it for it in g.json() if it["id"] == new_id]
        assert match, "Newly created service lead not found in admin list"
        assert match[0]["subject"] == "Tour Operator"
        assert match[0]["slug"] == "tour-operator"


# --------- Static files (robots, sitemap) ---------
class TestStaticSEO:
    def test_robots_txt_reachable(self):
        r = requests.get(f"{BASE_URL}/robots.txt")
        assert r.status_code == 200
        assert "User-agent" in r.text

    def test_sitemap_xml_reachable(self):
        r = requests.get(f"{BASE_URL}/sitemap.xml")
        assert r.status_code == 200
        assert "<urlset" in r.text or "<sitemapindex" in r.text
