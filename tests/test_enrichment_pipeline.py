"""
Unit and Integration Tests for Unilog Catalog Intelligence & Enrichment Pipeline.
"""

import os
import sys
import pytest
import pandas as pd
from fastapi.testclient import TestClient

sys.path.append(os.path.dirname(os.path.dirname(os.path.abspath(__file__))))

from backend.main import app
from backend.app.enrichment.pipeline import EnrichmentPipeline
from backend.app.enrichment.constants import (
    DELIVERY_COLUMNS_252,
    DECIMAL_TO_FRACTION_MAP,
    UOM_STANDARDIZATION_MAP,
    CANONICAL_MANUFACTURERS_AND_BRANDS
)

client = TestClient(app)
pipeline = EnrichmentPipeline()


def test_delivery_columns_252_count():
    """Verify strictly 252 static headers in exact format."""
    assert len(DELIVERY_COLUMNS_252) == 252
    assert DELIVERY_COLUMNS_252[0] == "MFR URL"
    assert DELIVERY_COLUMNS_252[6] == "PART_NUMBER"
    assert DELIVERY_COLUMNS_252[11] == "Mfg_Part_Num"
    assert DELIVERY_COLUMNS_252[17] == "MANUFACTURER_NAME"
    assert DELIVERY_COLUMNS_252[18] == "BRAND_NAME"
    assert DELIVERY_COLUMNS_252[22] == "Classpath"
    assert DELIVERY_COLUMNS_252[23] == "MOBILE_DESC"
    assert DELIVERY_COLUMNS_252[24] == "INVOICE_DESC"
    assert DELIVERY_COLUMNS_252[25] == "SHORT_DESC"
    assert DELIVERY_COLUMNS_252[26] == "LONG_DESC1"
    assert DELIVERY_COLUMNS_252[27] == "RETAIL_DESC"
    assert DELIVERY_COLUMNS_252[224] == "Product Image"
    assert DELIVERY_COLUMNS_252[251] == "Actual Image (Yes/No)"


def test_decimal_to_fraction_conversions():
    """Test 63 exact fraction lookup mappings and whole-number hyphenation."""
    assert pipeline.decimal_to_inch_fraction(0.5) == "1/2"
    assert pipeline.decimal_to_inch_fraction(0.25) == "1/4"
    assert pipeline.decimal_to_inch_fraction(0.75) == "3/4"
    assert pipeline.decimal_to_inch_fraction(0.125) == "1/8"
    assert pipeline.decimal_to_inch_fraction(0.0625) == "1/16"
    assert pipeline.decimal_to_inch_fraction(0.03125) == "1/32"
    assert pipeline.decimal_to_inch_fraction(0.015625) == "1/64"
    assert pipeline.decimal_to_inch_fraction(50.25) == "50-1/4"
    assert pipeline.decimal_to_inch_fraction(33.4375) == "33-7/16"
    assert pipeline.decimal_to_inch_fraction(23.875) == "23-7/8"
    assert pipeline.decimal_to_inch_fraction(22.625) == "22-5/8"
    assert pipeline.decimal_to_inch_fraction(50.1875) == "50-3/16"
    assert pipeline.decimal_to_inch_fraction(24.0) == "24"


def test_uom_standardization():
    """Test UOM mapping to master abbreviations with space before unit."""
    assert pipeline.standardize_uom("inches") == "in"
    assert pipeline.standardize_uom("IN.") == "in"
    assert pipeline.standardize_uom("volts") == "V"
    assert pipeline.standardize_uom("Amps") == "A"
    assert pipeline.standardize_uom("Dba") == "dBA"
    assert pipeline.standardize_uom("feet") == "ft"
    assert pipeline.standardize_uom("psi") == "psi"


def test_brand_canonicalization():
    """Test resolution of messy supplier strings to canonical entities with legal symbols."""
    # Test Freud / Diablo
    res_freud = pipeline.resolve_brand_and_manufacturer(
        mfg_part_num="DCB518ASTS06G",
        part_desc="DCB518ASTS06G Diablo 1/2\"x18\" - Sanding Belt 6pc",
        part_manuf="Freud Inc (2435)",
        e1_brand="-- Unbranded --",
        unilog_brand="-- No Unilog Brand --",
        dib_brand="-- No DIB Brand --"
    )
    assert res_freud["mfr_name"] == "Freud America, Inc."
    assert "Diablo" in res_freud["brand_name"]
    assert "®" in res_freud["brand_name"]

    # Test 3M / Jam Industrial
    res_3m = pipeline.resolve_brand_and_manufacturer(
        mfg_part_num="3MABR-7100075678",
        part_desc="3M 775L Stikit Film P150 - Cubitron II 50 Disc/Box",
        part_manuf="Jam Industrial Supply LLC (JAMIN)",
        e1_brand="-- Unbranded --",
        unilog_brand="-- No Unilog Brand --",
        dib_brand="-- No DIB Brand --"
    )
    assert res_3m["mfr_name"] == "3M Company"
    assert "3M" in res_3m["brand_name"]


def test_ground_truth_row_enrichment():
    """Test ground truth dishwasher row PDSH4816AF."""
    raw = {
        "Mfg_Part_Num": "PDSH4816AF",
        "Part_Desc": "PDSH4816AF Dishwasher SS - Display Only",
        "E1_Brand": "-- Unbranded --",
        "Unilog_Brand": "-- No Unilog Brand --",
        "DIB_Brand": "-- No DIB Brand --",
        "Part_Manuf": "Appliance Dealers Cooperative (APPDE)"
    }
    enriched = pipeline.process_row(raw, 0)
    
    assert len(enriched) == 252
    assert enriched["MANUFACTURER_NAME"] == "Rheem Manufacturing"
    assert "FRIGIDAIRE" in enriched["BRAND_NAME"]
    assert enriched["Classpath"] == "Appliances & Consumer Electronics>Kitchen Appliances>Built-In Dishwashers"
    assert len(enriched["INVOICE_DESC"]) <= 40
    assert enriched["INVOICE_DESC"].isupper()
    assert 60 <= len(enriched["MOBILE_DESC"]) <= 85
    assert enriched["Product Image"] == "FRIGIDAIRE_PDSH4816AF.jpg"
    assert enriched["Specification Sheet"] == "FRIGIDAIRE_PDSH4816AF_Specification_Sheet.pdf"
    assert enriched["Actual Image (Yes/No)"] == "Yes"


def test_api_single_item_enrichment():
    """Test /api/enrichment/enrich-single endpoint."""
    payload = {
        "mfg_part_num": "PDSH4816AF",
        "part_desc": "PDSH4816AF Dishwasher SS - Display Only",
        "part_manuf": "Appliance Dealers Cooperative (APPDE)",
        "e1_brand": "-- Unbranded --",
        "unilog_brand": "-- No Unilog Brand --",
        "dib_brand": "-- No DIB Brand --"
    }
    response = client.post("/api/enrichment/enrich-single", json=payload)
    assert response.status_code == 200
    data = response.json()
    assert data["status"] == "success"
    assert "delivery_record" in data
    assert len(data["delivery_record"]) == 252
    assert "pipeline_steps" in data
    assert len(data["pipeline_steps"]) == 8
    assert data["validation"]["invoice_desc_valid"] is True


def test_api_stats():
    """Test /api/enrichment/stats endpoint."""
    response = client.get("/api/enrichment/stats")
    assert response.status_code == 200
    data = response.json()
    assert data["total_static_headers"] == 252
    assert data["uom_compliance_rate"] == "100.0%"


def test_api_reference_vocabularies():
    """Test /api/enrichment/reference-vocabularies endpoint."""
    response = client.get("/api/enrichment/reference-vocabularies")
    assert response.status_code == 200
    data = response.json()
    assert data["total_columns"] == 252
    assert len(data["decimal_fractions"]) == 63
    assert len(data["registered_brands"]) > 0
