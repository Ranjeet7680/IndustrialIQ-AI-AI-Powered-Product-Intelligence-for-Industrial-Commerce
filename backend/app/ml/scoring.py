from typing import Dict, Any

def compute_product_ai_score(
    quality_score: float,
    reliability_score: float,
    value_score: float,
    supplier_score: float,
    availability_status: str,
    price: float,
    market_average: float = None,
    requested_specs_match_pct: float = 95.0
) -> Dict[str, Any]:
    """
    Compute explainable AI score normalized from 0 - 100 based on:
    0.20 Quality + 0.20 Reliability + 0.20 Value + 0.15 Supplier + 0.10 Availability + 0.10 Spec Match + 0.05 Price Competitiveness
    """
    # 1. Quality (0-100)
    q_score = max(0.0, min(100.0, quality_score))

    # 2. Reliability (0-100)
    r_score = max(0.0, min(100.0, reliability_score))

    # 3. Value (0-100)
    v_score = max(0.0, min(100.0, value_score))

    # 4. Supplier Score (0-100)
    s_score = max(0.0, min(100.0, supplier_score))

    # 5. Availability Score
    av_map = {
        "In Stock": 98.0,
        "Low Stock": 75.0,
        "Pre-Order": 60.0,
        "Out of Stock": 20.0
    }
    av_score = av_map.get(availability_status, 85.0)

    # 6. Specification Match (0-100)
    sm_score = max(0.0, min(100.0, requested_specs_match_pct))

    # 7. Price Competitiveness Score
    if market_average and market_average > 0:
        ratio = price / market_average
        if ratio <= 0.8:
            pc_score = 98.0
        elif ratio <= 1.0:
            pc_score = 90.0
        elif ratio <= 1.2:
            pc_score = 75.0
        else:
            pc_score = 55.0
    else:
        pc_score = 88.0

    weighted_ai_score = round(
        (0.20 * q_score) +
        (0.20 * r_score) +
        (0.20 * v_score) +
        (0.15 * s_score) +
        (0.10 * av_score) +
        (0.10 * sm_score) +
        (0.05 * pc_score),
        1
    )

    explanation = (
        f"Overall AI Confidence Score of {weighted_ai_score}/100 is computed from Quality ({q_score:.0f}), "
        f"Reliability ({r_score:.0f}), Value Rating ({v_score:.0f}), Supplier Track Record ({s_score:.0f}), "
        f"and Price Competitiveness ({pc_score:.0f})."
    )

    return {
        "ai_score": weighted_ai_score,
        "quality_score": round(q_score, 1),
        "reliability_score": round(r_score, 1),
        "value_score": round(v_score, 1),
        "supplier_score": round(s_score, 1),
        "availability_score": round(av_score, 1),
        "spec_match_score": round(sm_score, 1),
        "price_competitiveness_score": round(pc_score, 1),
        "explanation": explanation
    }
