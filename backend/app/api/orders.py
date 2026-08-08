from typing import List
from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from backend.app.core.database import get_db
from backend.app.models.models import PurchaseOrder, OrderItem, Product
from backend.app.schemas.schemas import PurchaseOrderSchema

router = APIRouter(prefix="/orders", tags=["Orders"])

@router.get("", response_model=List[PurchaseOrderSchema])
def get_orders(db: Session = Depends(get_db)):
    return db.query(PurchaseOrder).all()

@router.get("/{order_id}")
def get_order_detail(order_id: int, db: Session = Depends(get_db)):
    order = db.query(PurchaseOrder).filter(PurchaseOrder.id == order_id).first()
    if not order:
        raise HTTPException(status_code=404, detail="Order not found")
    
    items = db.query(OrderItem).filter(OrderItem.purchase_order_id == order.id).all()
    items_detail = []
    for item in items:
        prod = db.query(Product).filter(Product.id == item.product_id).first()
        items_detail.append({
            "id": item.id,
            "product_id": item.product_id,
            "product_name": prod.name if prod else "Industrial Item",
            "sku": prod.sku if prod else "SKU-UNK",
            "quantity": item.quantity,
            "unit_price": item.unit_price,
            "total_price": item.total_price
        })

    return {
        "id": order.id,
        "order_number": order.order_number,
        "total_amount": order.total_amount,
        "status": order.status,
        "payment_status": order.payment_status,
        "delivery_status": order.delivery_status,
        "created_at": order.created_at.strftime("%Y-%m-%d %H:%M"),
        "expected_delivery": order.expected_delivery.strftime("%Y-%m-%d"),
        "items": items_detail,
        "timeline": [
            {"step": "Order Created", "completed": True, "time": order.created_at.strftime("%b %d, %H:%M")},
            {"step": "Payment Verified", "completed": order.payment_status == "Paid", "time": "Verified"},
            {"step": "Supplier Processing", "completed": order.status in ["Ordered", "Processing", "Shipped", "Delivered"], "time": "Active"},
            {"step": "Shipped / In Transit", "completed": order.delivery_status in ["In Transit", "Delivered"], "time": "En Route"},
            {"step": "Delivered", "completed": order.delivery_status == "Delivered", "time": "Pending"}
        ]
    }
