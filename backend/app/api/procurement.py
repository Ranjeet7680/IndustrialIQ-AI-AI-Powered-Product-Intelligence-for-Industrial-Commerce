from typing import List, Optional
from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
import datetime
from backend.app.core.database import get_db
from backend.app.models.models import (
    ProcurementRequest, Quotation, PurchaseOrder, OrderItem, Product, Supplier, User
)
from backend.app.schemas.schemas import ProcurementRequestCreate, QuotationSchema, PurchaseOrderSchema

router = APIRouter(prefix="/procurement", tags=["Procurement"])

@router.post("")
def create_procurement_request(req: ProcurementRequestCreate, db: Session = Depends(get_db)):
    product = db.query(Product).filter(Product.id == req.product_id).first()
    if not product:
        raise HTTPException(status_code=404, detail="Product not found")

    user = db.query(User).first()
    pr = ProcurementRequest(
        organization_id=user.organization_id if user else 1,
        user_id=user.id if user else 1,
        product_id=product.id,
        quantity=req.quantity,
        budget=req.budget,
        preferred_supplier_id=product.supplier_id,
        specifications=req.specifications or product.description,
        status="Quote Requested"
    )
    db.add(pr)
    db.commit()
    db.refresh(pr)

    # Auto-generate a quote from the primary supplier
    unit_price = product.price * 0.95 # 5% bulk discount
    total = (unit_price * req.quantity) * 1.18 # include tax
    quote = Quotation(
        procurement_request_id=pr.id,
        supplier_id=product.supplier_id,
        unit_price=unit_price,
        quantity=req.quantity,
        shipping_cost=5000.0,
        tax=18.0,
        discount=5.0,
        delivery_days=7,
        warranty="24 Months",
        total_cost=round(total + 5000.0, 2),
        status="Received"
    )
    db.add(quote)
    db.commit()

    return {"message": "Procurement Request created successfully", "id": pr.id, "status": pr.status}

@router.get("")
def get_procurement_requests(db: Session = Depends(get_db)):
    requests = db.query(ProcurementRequest).all()
    results = []
    for r in requests:
        prod = db.query(Product).filter(Product.id == r.product_id).first()
        results.append({
            "id": r.id,
            "product_id": r.product_id,
            "product_name": prod.name if prod else "Industrial Component",
            "quantity": r.quantity,
            "budget": r.budget,
            "status": r.status,
            "created_at": r.created_at.strftime("%Y-%m-%d %H:%M")
        })
    return results

@router.get("/{req_id}/quotes", response_model=List[QuotationSchema])
def get_quotes_for_request(req_id: int, db: Session = Depends(get_db)):
    quotes = db.query(Quotation).filter(Quotation.procurement_request_id == req_id).all()
    results = []
    for q in quotes:
        sup = db.query(Supplier).filter(Supplier.id == q.supplier_id).first()
        q_dict = QuotationSchema.from_attributes(q)
        q_dict.supplier_name = sup.name if sup else "Supplier"
        results.append(q_dict)
    return results

@router.post("/{req_id}/approve/{quote_id}", response_model=PurchaseOrderSchema)
def approve_quote_and_create_po(req_id: int, quote_id: int, db: Session = Depends(get_db)):
    pr = db.query(ProcurementRequest).filter(ProcurementRequest.id == req_id).first()
    quote = db.query(Quotation).filter(Quotation.id == quote_id).first()
    
    if not pr or not quote:
        raise HTTPException(status_code=404, detail="Request or Quotation not found")

    pr.status = "Approved"
    quote.status = "Approved"
    
    po_num = f"PO-{datetime.datetime.utcnow().year}-{1000 + pr.id}"
    po = PurchaseOrder(
        procurement_request_id=pr.id,
        quotation_id=quote.id,
        order_number=po_num,
        total_amount=quote.total_cost,
        status="Ordered",
        payment_status="Paid",
        delivery_status="Processing",
        expected_delivery=datetime.datetime.utcnow() + datetime.timedelta(days=quote.delivery_days)
    )
    db.add(po)
    db.commit()
    db.refresh(po)

    # Order item
    item = OrderItem(
        purchase_order_id=po.id,
        product_id=pr.product_id,
        quantity=quote.quantity,
        unit_price=quote.unit_price,
        total_price=quote.unit_price * quote.quantity
    )
    db.add(item)
    db.commit()

    return po
