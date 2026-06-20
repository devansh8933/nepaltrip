"""Backend API tests for Nepal Trip"""
import os
import uuid
import pytest
import requests

BASE_URL = os.environ.get("REACT_APP_BACKEND_URL", "https://adventure-nepal-hub.preview.emergentagent.com").rstrip("/")
API = f"{BASE_URL}/api"


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


# --------- Leads CRUD ---------
class TestLeads:
    def test_create_lead_service(self, client):
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
        assert data["email"] == payload["email"]
        assert data["category"] == "service"
        assert data["slug"] == "tour-operator"

        # Persistence check
        lst = client.get(f"{API}/leads", params={"category": "service"})
        assert lst.status_code == 200
        items = lst.json()
        assert any(it.get("id") == data["id"] for it in items)

    def test_create_lead_package(self, client):
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
        assert data["slug"] == "kathmandu"

        lst = client.get(f"{API}/leads", params={"category": "package"}).json()
        assert any(it.get("id") == data["id"] for it in lst)

    def test_create_lead_general_default(self, client):
        # category defaults to 'general' when not provided
        payload = {
            "name": "TEST_General User",
            "email": f"gen_{uuid.uuid4().hex[:6]}@example.com",
            "mobile": "+910000000000",
            "subject": "General Enquiry",
        }
        r = client.post(f"{API}/leads", json=payload)
        assert r.status_code == 200
        data = r.json()
        assert data["category"] == "general"
        assert data.get("description") == ""

    def test_create_lead_explicit_general(self, client):
        payload = {
            "name": "TEST_Explicit General",
            "email": f"egen_{uuid.uuid4().hex[:6]}@example.com",
            "mobile": "+910000000001",
            "description": "Need help",
            "subject": "General Enquiry",
            "category": "general",
        }
        r = client.post(f"{API}/leads", json=payload)
        assert r.status_code == 200
        data = r.json()
        assert data["category"] == "general"

    def test_list_leads_returns_list(self, client):
        r = client.get(f"{API}/leads")
        assert r.status_code == 200
        items = r.json()
        assert isinstance(items, list)
        # ensure no mongo _id leaks
        for it in items[:5]:
            assert "_id" not in it

    def test_list_leads_category_filter(self, client):
        r = client.get(f"{API}/leads", params={"category": "service"})
        assert r.status_code == 200
        items = r.json()
        assert isinstance(items, list)
        # All returned items should be category=service
        for it in items:
            assert it.get("category") == "service"

    def test_create_lead_missing_required_returns_422(self, client):
        # missing name & email & subject
        r = client.post(f"{API}/leads", json={"mobile": "12345"})
        assert r.status_code == 422
