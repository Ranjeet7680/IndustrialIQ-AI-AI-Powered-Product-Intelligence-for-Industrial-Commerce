from typing import Optional, List
from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from backend.app.core.database import get_db
from backend.app.models.models import Supplier, SupplierPerformance
from backend.app.schemas.schemas import SupplierSchema

router = APIRouter(prefix="/suppliers", tags=["Suppliers"])

@router.get("", response_model=List[SupplierSchema])
def get_suppliers(
    risk_score: Optional[str] = None,
    verification_status: Optional[str] = None,
    db: Session = Depends(get_db)
):
    query = db.query(Supplier)
    if risk_score:
        query = query.filter(Supplier.risk_score == risk_score)
    if verification_status:
        query = query.filter(Supplier.verification_status == verification_status)
    return query.all()

@router.get("/{supplier_id}", response_model=SupplierSchema)
def get_supplier(supplier_id: int, db: Session = Depends(get_db)):
    supplier = db.query(Supplier).filter(Supplier.id == supplier_id).first()
    if not supplier:
        raise HTTPException(status_code=404, detail="Supplier not found")
    return supplier

@router.get("/{supplier_id}/performance")
def get_supplier_performance(supplier_id: int, db: Session = Depends(get_db)):
    performances = db.query(SupplierPerformance).filter(SupplierPerformance.supplier_id == supplier_id).order_by(SupplierPerformance.date.asc()).all()
    return [
        {
            "id": p.id,
            "date": p.date.strftime("%Y-%m-%d"),
            "orders": p.orders,
            "on_time_delivery_rate": p.on_time_delivery_rate,
            "defect_rate": p.defect_rate,
            "average_delivery_days": p.average_delivery_days,
            "response_time": p.response_time,
            "customer_rating": p.customer_rating,
            "quality_score": p.quality_score,
            "performance_score": p.performance_score
        }
        for p in performances
    ]
