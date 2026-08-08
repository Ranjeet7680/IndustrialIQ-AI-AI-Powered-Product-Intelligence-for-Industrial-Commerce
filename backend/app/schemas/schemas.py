from typing import Optional, List, Any, Dict
from pydantic import BaseModel, EmailStr
from datetime import datetime

# Auth & User Schemas
class UserLogin(BaseModel):
    email: EmailStr
    password: str

class UserRegister(BaseModel):
    name: str
    email: EmailStr
    password: str
    role: Optional[str] = "Procurement Manager"
    organization_name: Optional[str] = "Global Industrial Corp"
    industry: Optional[str] = "Heavy Manufacturing"

class UserResponse(BaseModel):
    id: int
    name: str
    email: str
    role: str
    organization_id: Optional[int]
    is_verified: bool
    is_active: bool

    class Config:
        from_attributes = True

class Token(BaseModel):
    access_token: str
    token_type: str
    user: UserResponse

# Product & Spec Schemas
class SpecificationSchema(BaseModel):
    specification_name: str
    specification_value: str
    unit: Optional[str] = ""

    class Config:
        from_attributes = True

class ProductSchema(BaseModel):
    id: int
    sku: str
    name: str
    brand: str
    category: str
    sub_category: Optional[str] = None
    industry: str
    description: Optional[str] = None
    material: str
    application: str
    price: float
    currency: str
    stock_quantity: int
    availability: str
    rating: float
    review_count: int
    warranty_months: int
    certification: str
    supplier_id: int
    quality_score: float
    reliability_score: float
    value_score: float
    ai_score: float
    image_url: Optional[str] = None
    specifications: List[SpecificationSchema] = []

    class Config:
        from_attributes = True

# Intelligence breakdown response
class AIIntelligenceScoreBreakdown(BaseModel):
    product_id: int
    ai_score: float
    quality_score: float
    reliability_score: float
    value_score: float
    supplier_score: float
    availability_score: float
    spec_match_score: float
    price_competitiveness_score: float
    explanation: str

# Supplier Schema
class SupplierSchema(BaseModel):
    id: int
    name: str
    location: str
    country: str
    rating: float
    quality_score: float
    delivery_score: float
    price_score: float
    reliability_score: float
    risk_score: str
    ai_score: float
    verification_status: str
    certifications: str
    years_in_business: int

    class Config:
        from_attributes = True

# Procurement Request Schemas
class ProcurementRequestCreate(BaseModel):
    product_id: int
    quantity: int
    budget: float
    required_date: Optional[str] = None
    specifications: Optional[str] = ""

class QuotationSchema(BaseModel):
    id: int
    procurement_request_id: int
    supplier_id: int
    supplier_name: Optional[str] = None
    unit_price: float
    quantity: int
    shipping_cost: float
    tax: float
    discount: float
    delivery_days: int
    warranty: str
    total_cost: float
    status: str

    class Config:
        from_attributes = True

class PurchaseOrderSchema(BaseModel):
    id: int
    order_number: str
    procurement_request_id: int
    quotation_id: Optional[int] = None
    total_amount: float
    status: str
    payment_status: str
    delivery_status: str
    expected_delivery: datetime

    class Config:
        from_attributes = True

# Copilot Chat Request
class CopilotMessage(BaseModel):
    message: str
    context: Optional[Dict[str, Any]] = None
