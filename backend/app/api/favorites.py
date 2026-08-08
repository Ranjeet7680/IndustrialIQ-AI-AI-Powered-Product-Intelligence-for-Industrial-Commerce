from fastapi import APIRouter, Depends
from sqlalchemy.orm import Session
from backend.app.core.database import get_db
from backend.app.models.models import Favorite, Product
from backend.app.schemas.schemas import ProductSchema
from typing import List

router = APIRouter(prefix="/favorites", tags=["Favorites"])

@router.get("", response_model=List[ProductSchema])
def get_user_favorites(db: Session = Depends(get_db)):
    favs = db.query(Favorite).all()
    product_ids = [f.product_id for f in favs]
    products = db.query(Product).filter(Product.id.in_(product_ids)).all() if product_ids else []
    return products

@router.post("/{product_id}")
def toggle_favorite(product_id: int, db: Session = Depends(get_db)):
    fav = db.query(Favorite).filter(Favorite.product_id == product_id).first()
    if fav:
        db.delete(fav)
        db.commit()
        return {"status": "removed", "is_favorite": False}
    else:
        new_fav = Favorite(user_id=1, product_id=product_id)
        db.add(new_fav)
        db.commit()
        return {"status": "added", "is_favorite": True}
