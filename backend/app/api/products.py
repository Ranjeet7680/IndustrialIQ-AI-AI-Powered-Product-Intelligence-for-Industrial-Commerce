from typing import Optional, List
from fastapi import APIRouter, Depends, HTTPException, Query
from sqlalchemy.orm import Session
from backend.app.core.database import get_db
from backend.app.models.models import Product, ProductSpecification, ProductPrice, Supplier
from backend.app.schemas.schemas import ProductSchema, AIIntelligenceScoreBreakdown
from backend.app.ml.scoring import compute_product_ai_score
from backend.app.ml.semantic_search import parse_natural_language_query, rank_products_semantically

router = APIRouter(prefix="/products", tags=["Products"])

@router.get("", response_model=List[ProductSchema])
def get_products(
    category: Optional[str] = None,
    material: Optional[str] = None,
    min_price: Optional[float] = None,
    max_price: Optional[float] = None,
    supplier_id: Optional[int] = None,
    limit: int = 50,
    db: Session = Depends(get_db)
):
    query = db.query(Product)
    if category:
        query = query.filter(Product.category.ilike(f"%{category}%"))
    if material:
        query = query.filter(Product.material.ilike(f"%{material}%"))
    if min_price is not None:
        query = query.filter(Product.price >= min_price)
    if max_price is not None:
        query = query.filter(Product.price <= max_price)
    if supplier_id:
        query = query.filter(Product.supplier_id == supplier_id)

    return query.limit(limit).all()

@router.get("/search", response_model=List[ProductSchema])
def search_products(q: str = Query(..., description="Natural language search query"), db: Session = Depends(get_db)):
    parsed = parse_natural_language_query(q)
    all_products = db.query(Product).all()
    ranked = rank_products_semantically(all_products, parsed)
    return ranked

@router.get("/{product_id}", response_model=ProductSchema)
def get_product(product_id: int, db: Session = Depends(get_db)):
    product = db.query(Product).filter(Product.id == product_id).first()
    if not product:
        raise HTTPException(status_code=404, detail="Product not found")
    return product

@router.get("/{product_id}/intelligence", response_model=AIIntelligenceScoreBreakdown)
def get_product_intelligence(product_id: int, db: Session = Depends(get_db)):
    product = db.query(Product).filter(Product.id == product_id).first()
    if not product:
        raise HTTPException(status_code=404, detail="Product not found")
    
    supplier = db.query(Supplier).filter(Supplier.id == product.supplier_id).first()
    sup_score = supplier.quality_score if supplier else 90.0
    
    breakdown = compute_product_ai_score(
        quality_score=product.quality_score,
        reliability_score=product.reliability_score,
        value_score=product.value_score,
        supplier_score=sup_score,
        availability_status=product.availability,
        price=product.price
    )
    
    return {
        "product_id": product.id,
        **breakdown
    }

@router.get("/{product_id}/prices")
def get_product_prices(product_id: int, db: Session = Depends(get_db)):
    prices = db.query(ProductPrice).filter(ProductPrice.product_id == product_id).order_by(ProductPrice.date.asc()).all()
    return [
        {
            "id": p.id,
            "date": p.date.strftime("%Y-%m-%d"),
            "unit_price": p.unit_price,
            "market_average": p.market_average
        }
        for p in prices
    ]

@router.get("/{product_id}/recommendations", response_model=List[ProductSchema])
def get_product_recommendations(product_id: int, db: Session = Depends(get_db)):
    product = db.query(Product).filter(Product.id == product_id).first()
    if not product:
        return []
    
    similar = db.query(Product).filter(
        Product.category == product.category,
        Product.id != product.id
    ).limit(5).all()
    return similar
