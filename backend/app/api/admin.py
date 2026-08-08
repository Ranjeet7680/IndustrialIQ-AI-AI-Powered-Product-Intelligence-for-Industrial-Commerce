from fastapi import APIRouter, Depends
from sqlalchemy.orm import Session
from backend.app.core.database import get_db
from backend.app.models.models import User, Organization, Product, Supplier, AuditLog

router = APIRouter(prefix="/admin", tags=["Admin"])

@router.get("/users")
def get_admin_users(db: Session = Depends(get_db)):
    return db.query(User).all()

@router.get("/organizations")
def get_admin_orgs(db: Session = Depends(get_db)):
    return db.query(Organization).all()

@router.get("/datasets")
def get_admin_datasets():
    return [
        {"name": "DataCo Smart Supply Chain", "records": "180,519", "quality_score": 98.4, "status": "Active", "last_updated": "Today"},
        {"name": "AI4I 2020 Predictive Maintenance", "records": "10,000", "quality_score": 99.1, "status": "Active", "last_updated": "Yesterday"},
        {"name": "Industrial SKUs & Pricing Catalog", "records": "10,450", "quality_score": 96.8, "status": "Active", "last_updated": "2 hours ago"}
    ]

@router.get("/models")
def get_admin_models():
    return [
        {"name": "Product Ranking Hybrid Engine", "version": "v2.4", "accuracy": "96.4%", "f1": 0.94, "latency": "14ms", "status": "Active"},
        {"name": "Supplier Risk Classifier (XGBoost)", "version": "v1.8", "accuracy": "94.2%", "f1": 0.92, "latency": "8ms", "status": "Active"},
        {"name": "Price Volatility Time-Series Forecaster", "version": "v3.1", "rmse": 1420.5, "latency": "22ms", "status": "Active"}
    ]

@router.get("/audit-logs")
def get_admin_audit_logs(db: Session = Depends(get_db)):
    logs = db.query(AuditLog).order_by(AuditLog.created_at.desc()).limit(20).all()
    return logs

@router.get("/system-health")
def get_system_health():
    return {
        "status": "Healthy",
        "api_service": "Online (FastAPI)",
        "database": "Online (SQLAlchemy)",
        "ml_inference": "Active (Scikit-Learn)",
        "vector_search": "Ready",
        "uptime": "99.98%"
    }
