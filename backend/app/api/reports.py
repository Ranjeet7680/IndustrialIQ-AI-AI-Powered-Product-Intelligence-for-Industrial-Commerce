from fastapi import APIRouter, Depends
from sqlalchemy.orm import Session
from backend.app.core.database import get_db
from backend.app.models.models import Report

router = APIRouter(prefix="/reports", tags=["Reports"])

@router.get("")
def get_reports(db: Session = Depends(get_db)):
    reports = db.query(Report).all()
    if not reports:
        # Default report items
        return [
            {"id": 1, "type": "Executive Summary", "status": "Completed", "created_at": "2026-08-01 10:00", "file_url": "/reports/exec-summary.pdf"},
            {"id": 2, "type": "Supplier Risk Analysis", "status": "Completed", "created_at": "2026-08-05 14:30", "file_url": "/reports/supplier-risk.pdf"},
            {"id": 3, "type": "Price Benchmark Report", "status": "Completed", "created_at": "2026-08-07 09:15", "file_url": "/reports/price-benchmark.csv"}
        ]
    return reports

@router.post("/generate")
def generate_report(report_type: str = "Executive Summary", db: Session = Depends(get_db)):
    new_rep = Report(
        user_id=1,
        type=report_type,
        status="Completed",
        file_url=f"/reports/{report_type.lower().replace(' ', '_')}.csv"
    )
    db.add(new_rep)
    db.commit()
    db.refresh(new_rep)
    return {"message": "Report generated successfully", "id": new_rep.id, "file_url": new_rep.file_url}
