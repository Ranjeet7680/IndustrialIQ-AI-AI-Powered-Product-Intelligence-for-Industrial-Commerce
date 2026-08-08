import sys
import os
sys.path.append(os.path.dirname(os.path.dirname(os.path.abspath(__file__))))

import pytest
from fastapi.testclient import TestClient
from backend.main import app
from backend.app.ml.scoring import compute_product_ai_score
from backend.app.ml.semantic_search import parse_natural_language_query

client = TestClient(app)

def test_root_endpoint():
    response = client.get("/")
    assert response.status_code == 200
    data = response.json()
    assert data["title"] == "IndustrialIQ AI"
    assert data["status"] == "Online"

def test_products_endpoint():
    response = client.get("/api/products")
    assert response.status_code == 200
    data = response.json()
    assert isinstance(data, list)
    assert len(data) > 0

def test_product_search():
    response = client.get("/api/products/search?q=centrifugal+pump")
    assert response.status_code == 200
    data = response.json()
    assert isinstance(data, list)

def test_suppliers_endpoint():
    response = client.get("/api/suppliers")
    assert response.status_code == 200
    data = response.json()
    assert isinstance(data, list)

def test_analytics_kpis():
    response = client.get("/api/analytics/kpis")
    assert response.status_code == 200
    data = response.json()
    assert "products_analyzed" in data
    assert "ai_recommendations" in data

def test_copilot_chat():
    response = client.post("/api/copilot/chat", json={"message": "Find centrifugal pumps under 3 lakh"})
    assert response.status_code == 200
    data = response.json()
    assert "reply" in data
    assert "tool_called" in data

def test_scoring_engine():
    res = compute_product_ai_score(
        quality_score=95.0,
        reliability_score=92.0,
        value_score=90.0,
        supplier_score=94.0,
        availability_status="In Stock",
        price=200000.0,
        market_average=220000.0
    )
    assert 0 <= res["ai_score"] <= 100
    assert "Quality" in res["explanation"]

def test_nl_query_parser():
    parsed = parse_natural_language_query("Find stainless steel pumps under 3 lakh")
    assert parsed["category"] == "Pumps"
    assert parsed["material"] == "Stainless Steel"
    assert parsed["max_price"] == 300000.0
