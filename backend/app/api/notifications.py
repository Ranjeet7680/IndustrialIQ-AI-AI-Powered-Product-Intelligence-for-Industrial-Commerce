from fastapi import APIRouter, Depends
from sqlalchemy.orm import Session
from backend.app.core.database import get_db
from backend.app.models.models import Notification

router = APIRouter(prefix="/notifications", tags=["Notifications"])

@router.get("")
def get_notifications(db: Session = Depends(get_db)):
    notes = db.query(Notification).order_by(Notification.created_at.desc()).all()
    return notes

@router.post("/{notification_id}/read")
def mark_notification_read(notification_id: int, db: Session = Depends(get_db)):
    note = db.query(Notification).filter(Notification.id == notification_id).first()
    if note:
        note.is_read = True
        db.commit()
    return {"status": "success"}
