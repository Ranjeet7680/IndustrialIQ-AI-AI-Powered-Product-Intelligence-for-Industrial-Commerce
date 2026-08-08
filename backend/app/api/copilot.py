from fastapi import APIRouter, Depends
from sqlalchemy.orm import Session
from backend.app.core.database import get_db
from backend.app.models.models import Product, Supplier, ProcurementRequest
from backend.app.schemas.schemas import CopilotMessage
from backend.app.ml.semantic_search import parse_natural_language_query, rank_products_semantically
from backend.app.ml.forecasting import generate_price_forecast

router = APIRouter(prefix="/copilot", tags=["AI Copilot"])

@router.post("/chat")
def copilot_chat(msg: CopilotMessage, db: Session = Depends(get_db)):
    query = msg.message
    query_lower = query.lower()

    # Tool selection & AI reasoning logic
    if any(kw in query_lower for kw in ["pump", "valve", "motor", "search", "find", "skus"]):
        parsed = parse_natural_language_query(query)
        all_products = db.query(Product).all()
        ranked = rank_products_semantically(all_products, parsed)[:3]
        
        items_summary = [
            {"id": p.id, "name": p.name, "price": f"₹{p.price:,.0f}", "ai_score": p.ai_score, "material": p.material}
            for p in ranked
        ]
        
        reply = f"I've searched our industrial catalog and identified {len(ranked)} matching products for your request."
        if parsed.get("max_price"):
            reply += f" Filtered under budget threshold ₹{parsed['max_price']:,.0f}."
            
        return {
            "reply": reply,
            "tool_called": "search_products",
            "data": items_summary,
            "action_required": False
        }

    elif any(kw in query_lower for kw in ["compare", "comparison", "versus", "vs"]):
        products = db.query(Product).limit(3).all()
        comp_data = [
            {"name": p.name, "price": f"₹{p.price:,.0f}", "ai_score": p.ai_score, "quality": p.quality_score, "reliability": p.reliability_score}
            for p in products
        ]
        return {
            "reply": f"Comparing technical specifications and AI performance scores for top {len(products)} products:",
            "tool_called": "compare_products",
            "data": comp_data,
            "action_required": False
        }

    elif any(kw in query_lower for kw in ["supplier", "vendor", "reliability"]):
        suppliers = db.query(Supplier).order_by(Supplier.ai_score.desc()).limit(3).all()
        sup_data = [
            {"name": s.name, "rating": s.rating, "quality": s.quality_score, "delivery": s.delivery_score, "risk": s.risk_score}
            for s in suppliers
        ]
        return {
            "reply": f"Here are the highest performing suppliers evaluated by our risk and delivery telemetry:",
            "tool_called": "search_suppliers",
            "data": sup_data,
            "action_required": False
        }

    elif any(kw in query_lower for kw in ["price", "forecast", "cost", "trend"]):
        p = db.query(Product).first()
        fc = generate_price_forecast(p.price if p else 245000.0, months_ahead=6)
        return {
            "reply": f"AI Forecast Analysis: Expected price trajectory for industrial components shows a {fc['trend_direction']} trend ({fc['confidence_level']} confidence).",
            "tool_called": "get_price_history",
            "data": fc,
            "action_required": False
        }

    elif any(kw in query_lower for kw in ["create", "buy", "rfq", "procure", "order"]):
        p = db.query(Product).first()
        return {
            "reply": f"I can generate a formal Procurement Request for **{p.name if p else 'Centrifugal Pump'}** (10 units @ ₹{p.price if p else 245000:,.0f} budget). Confirm to submit RFQ to supplier.",
            "tool_called": "create_procurement_request",
            "data": {"product_id": p.id if p else 1, "suggested_budget": (p.price if p else 245000) * 10},
            "action_required": True,
            "action_type": "CREATE_RFQ_CONFIRMATION"
        }

    else:
        return {
            "reply": f"IndustrialIQ Copilot active. I can assist you with natural-language product search, technical spec comparisons, supplier risk telemetry, price forecasts, and automated RFQ creation. How can I help with your industrial decision today?",
            "tool_called": "general_assistant",
            "data": None,
            "action_required": False
        }
