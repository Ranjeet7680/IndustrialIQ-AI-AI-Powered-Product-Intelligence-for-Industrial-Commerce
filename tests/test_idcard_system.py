"""
Tests for Digital ID Card & QR Verification System.
"""

import os
import sys
import pytest
from fastapi.testclient import TestClient

sys.path.append(os.path.dirname(os.path.dirname(os.path.abspath(__file__))))

from backend.main import app

client = TestClient(app)


def test_get_team_badges():
    """Verify pre-seeded team badges."""
    response = client.get("/api/idcard/team-members")
    assert response.status_code == 200
    data = response.json()
    assert data["status"] == "success"
    assert len(data["badges"]) >= 3
    
    # Check Team Leader Ranjeet Kumar
    leader = next((b for b in data["badges"] if b["name"] == "Ranjeet Kumar"), None)
    assert leader is not None
    assert leader["role"] == "Team Leader & Lead Architect"
    assert leader["clearance_level"] == "Level 4 - Master Admin"


def test_generate_badge():
    """Test generating a new digital ID badge with QR payload."""
    payload = {
        "name": "Alex Industrial",
        "role": "Plant Safety Inspector",
        "organization": "IndustrialIQ Enterprise",
        "department": "Facility Safety",
        "clearance_level": "Level 3 - Lead Engineer",
        "blood_group": "B+"
    }
    response = client.post("/api/idcard/generate", json=payload)
    assert response.status_code == 200
    data = response.json()
    assert data["status"] == "success"
    badge = data["badge"]
    assert "IIQ-2026-" in badge["badge_id"]
    assert badge["name"] == "Alex Industrial"
    assert "verification_hash" in badge
    assert "qr_payload" in badge


def test_verify_badge():
    """Test verifying a badge ID."""
    response = client.get("/api/idcard/verify/IIQ-2026-8801")
    assert response.status_code == 200
    data = response.json()
    assert data["status"] == "VERIFIED"
    assert data["is_valid"] is True
    assert data["badge"]["name"] == "Ranjeet Kumar"


def test_scan_qr_code():
    """Test scanning a QR code payload at a gate terminal."""
    scan_req = {
        "qr_payload": "IIQ_VERIFY|IIQ-2026-8801|Ranjeet Kumar|Level 4|a4f91b7e8801",
        "terminal_location": "Main Facility Gate 01"
    }
    response = client.post("/api/idcard/scan", json=scan_req)
    assert response.status_code == 200
    data = response.json()
    assert data["status"] == "ACCESS_GRANTED"
    assert data["is_valid"] is True
    assert "scan_log" in data
    assert data["scan_log"]["badge_id"] == "IIQ-2026-8801"


def test_scan_audit_logs():
    """Test retrieving scan audit logs."""
    response = client.get("/api/idcard/logs")
    assert response.status_code == 200
    data = response.json()
    assert data["status"] == "success"
    assert len(data["logs"]) > 0
