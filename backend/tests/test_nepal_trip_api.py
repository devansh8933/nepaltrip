"""Backend API tests for Nepal Trip — includes admin auth on GET /api/leads."""
import os
import uuid
import pytest
import requests

BASE_URL = os.environ.get("REACT_APP_BACKEND_URL").rstrip("/")
API = f"{BASE_URL}/api"
ADMIN_TOKEN = "N-lwBYKgl0F2aE95jJeQoBoqL-tS0Gblp-IERvYaTk0"
ADMIN_HEADERS = {"X-Admin-Token": ADMIN_TOKEN}


@pytest.fixture(scope="session")
def client():
    s = requests.Session()
    s.headers.update({"Content-Type": "application/json"})
    return s


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
        data = r.json()
        assert data.get("status") == "ok"
        assert "ts" in data


# --------- Leads — POST remains public ---------
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
        assert "id" in data and isinstance(data["id"], str)
        assert data["name"] == payload["name"]
        assert data["category"] == "service"
        assert data["slug"] == "tour-operator"

        # Persistence check using admin token
        lst = client.get(f"{API}/leads", params={"category": "service"}, headers=ADMIN_HEADERS)
        assert lst.status_code == 200
        items = lst.json()
        assert any(it.get("id") == data["id"] for it in items)

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
        data = r.json()
        assert data["category"] == "package"

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


# --------- Leads — GET admin-only ---------
class TestLeadsGetAdminAuth:
    def test_get_leads_no_header_returns_401(self, client):
        r = client.get(f"{API}/leads")
        assert r.status_code == 401, r.text
        assert "admin" in r.text.lower() or "token" in r.text.lower()

    def test_get_leads_wrong_token_returns_401(self, client):
        r = client.get(f"{API}/leads", headers={"X-Admin-Token": "definitely-wrong"})
        assert r.status_code == 401

    def test_get_leads_empty_token_returns_401(self, client):
        r = client.get(f"{API}/leads", headers={"X-Admin-Token": ""})
        assert r.status_code == 401

    def test_get_leads_correct_token_returns_list(self, client):
        r = client.get(f"{API}/leads", headers=ADMIN_HEADERS)
        assert r.status_code == 200, r.text
        items = r.json()
        assert isinstance(items, list)
        for it in items[:5]:
            assert "_id" not in it
            assert "id" in it
            assert "category" in it

    def test_get_leads_category_filter_with_token(self, client):
        r = client.get(f"{API}/leads", params={"category": "service"}, headers=ADMIN_HEADERS)
        assert r.status_code == 200
        items = r.json()
        for it in items:
            assert it.get("category") == "service"

    def test_get_leads_package_filter_with_token(self, client):
        r = client.get(f"{API}/leads", params={"category": "package"}, headers=ADMIN_HEADERS)
        assert r.status_code == 200
        for it in r.json():
            assert it.get("category") == "package"


# --------- Static files (robots, sitemap) ---------
class TestStaticSEO:
    def test_robots_txt_reachable(self):
        r = requests.get(f"{BASE_URL}/robots.txt")
        assert r.status_code == 200, r.text
        assert len(r.text.strip()) > 0
        assert "User-agent" in r.text

    def test_sitemap_xml_reachable(self):
        r = requests.get(f"{BASE_URL}/sitemap.xml")
        assert r.status_code == 200
        assert len(r.text.strip()) > 0
        assert "<urlset" in r.text or "<sitemapindex" in r.text
