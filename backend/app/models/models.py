import datetime
from sqlalchemy import (
    Column, Integer, String, Float, Boolean, DateTime, ForeignKey, Text, JSON
)
from sqlalchemy.orm import relationship
from backend.app.core.database import Base

class Organization(Base):
    __tablename__ = "organizations"

    id = Column(Integer, primary_key=True, index=True)
    name = Column(String, index=True, nullable=False)
    industry = Column(String, default="Heavy Manufacturing")
    company_size = Column(String, default="500-1000")
    country = Column(String, default="India")
    procurement_volume = Column(String, default="₹50L - ₹2Cr")
    created_at = Column(DateTime, default=datetime.datetime.utcnow)

    users = relationship("User", back_populates="organization")
    procurement_requests = relationship("ProcurementRequest", back_populates="organization")

class User(Base):
    __tablename__ = "users"

    id = Column(Integer, primary_key=True, index=True)
    name = Column(String, nullable=False)
    email = Column(String, unique=True, index=True, nullable=False)
    password_hash = Column(String, nullable=False)
    role = Column(String, default="Procurement Manager") # User, Procurement Manager, Analyst, Org Admin, Platform Admin
    organization_id = Column(Integer, ForeignKey("organizations.id"), nullable=True)
    avatar_url = Column(String, nullable=True)
    is_verified = Column(Boolean, default=True)
    is_active = Column(Boolean, default=True)
    created_at = Column(DateTime, default=datetime.datetime.utcnow)
    updated_at = Column(DateTime, default=datetime.datetime.utcnow, onupdate=datetime.datetime.utcnow)
    last_login = Column(DateTime, default=datetime.datetime.utcnow)

    organization = relationship("Organization", back_populates="users")
    favorites = relationship("Favorite", back_populates="user")
    notifications = relationship("Notification", back_populates="user")

class Supplier(Base):
    __tablename__ = "suppliers"

    id = Column(Integer, primary_key=True, index=True)
    name = Column(String, index=True, nullable=False)
    location = Column(String, default="Mumbai, India")
    country = Column(String, default="India")
    description = Column(Text, nullable=True)
    rating = Column(Float, default=4.5)
    quality_score = Column(Float, default=92.0)
    delivery_score = Column(Float, default=94.0)
    price_score = Column(Float, default=88.0)
    reliability_score = Column(Float, default=95.0)
    risk_score = Column(String, default="Low") # Low, Medium, High
    ai_score = Column(Float, default=93.5)
    verification_status = Column(String, default="Verified") # Verified, Pending, Standard
    certifications = Column(String, default="ISO 9001, CE, ASME")
    years_in_business = Column(Integer, default=12)
    response_time_hours = Column(Float, default=4.0)

    products = relationship("Product", back_populates="supplier")
    performances = relationship("SupplierPerformance", back_populates="supplier")
    quotations = relationship("Quotation", back_populates="supplier")

class Product(Base):
    __tablename__ = "products"

    id = Column(Integer, primary_key=True, index=True)
    sku = Column(String, unique=True, index=True, nullable=False)
    name = Column(String, index=True, nullable=False)
    brand = Column(String, index=True, nullable=False)
    category = Column(String, index=True, nullable=False) # Pumps, Valves, Motors, Bearings, Compressors, etc.
    sub_category = Column(String, nullable=True)
    industry = Column(String, index=True, default="Heavy Manufacturing")
    description = Column(Text, nullable=True)
    material = Column(String, default="Stainless Steel 316")
    application = Column(String, default="High Pressure Industrial Fluid Handling")
    price = Column(Float, nullable=False)
    currency = Column(String, default="INR")
    stock_quantity = Column(Integer, default=150)
    availability = Column(String, default="In Stock")
    rating = Column(Float, default=4.8)
    review_count = Column(Integer, default=42)
    warranty_months = Column(Integer, default=24)
    certification = Column(String, default="ISO 9001, CE, DIN 2576")
    supplier_id = Column(Integer, ForeignKey("suppliers.id"))
    
    # Sub-scores and Overall AI score
    quality_score = Column(Float, default=94.0)
    reliability_score = Column(Float, default=91.0)
    value_score = Column(Float, default=89.0)
    ai_score = Column(Float, default=92.0)
    image_url = Column(String, nullable=True)

    created_at = Column(DateTime, default=datetime.datetime.utcnow)
    updated_at = Column(DateTime, default=datetime.datetime.utcnow, onupdate=datetime.datetime.utcnow)

    supplier = relationship("Supplier", back_populates="products")
    specifications = relationship("ProductSpecification", back_populates="product", cascade="all, delete-orphan")
    prices = relationship("ProductPrice", back_populates="product", cascade="all, delete-orphan")
    reviews = relationship("ProductReview", back_populates="product", cascade="all, delete-orphan")
    demand_history = relationship("DemandHistory", back_populates="product", cascade="all, delete-orphan")

class ProductSpecification(Base):
    __tablename__ = "product_specifications"

    id = Column(Integer, primary_key=True, index=True)
    product_id = Column(Integer, ForeignKey("products.id"))
    specification_name = Column(String, nullable=False)
    specification_value = Column(String, nullable=False)
    unit = Column(String, nullable=True)

    product = relationship("Product", back_populates="specifications")

class ProductPrice(Base):
    __tablename__ = "product_prices"

    id = Column(Integer, primary_key=True, index=True)
    product_id = Column(Integer, ForeignKey("products.id"))
    supplier_id = Column(Integer, ForeignKey("suppliers.id"))
    date = Column(DateTime, default=datetime.datetime.utcnow)
    unit_price = Column(Float, nullable=False)
    currency = Column(String, default="INR")
    shipping_cost = Column(Float, default=2500.0)
    discount = Column(Float, default=0.0)
    market_average = Column(Float, nullable=True)

    product = relationship("Product", back_populates="prices")

class ProductReview(Base):
    __tablename__ = "product_reviews"

    id = Column(Integer, primary_key=True, index=True)
    product_id = Column(Integer, ForeignKey("products.id"))
    user_id = Column(Integer, ForeignKey("users.id"))
    rating = Column(Float, default=5.0)
    review = Column(Text)
    verified_purchase = Column(Boolean, default=True)
    created_at = Column(DateTime, default=datetime.datetime.utcnow)

    product = relationship("Product", back_populates="reviews")

class ProcurementRequest(Base):
    __tablename__ = "procurement_requests"

    id = Column(Integer, primary_key=True, index=True)
    organization_id = Column(Integer, ForeignKey("organizations.id"))
    user_id = Column(Integer, ForeignKey("users.id"))
    product_id = Column(Integer, ForeignKey("products.id"))
    quantity = Column(Integer, default=10)
    budget = Column(Float, default=250000.0)
    required_date = Column(DateTime, default=lambda: datetime.datetime.utcnow() + datetime.timedelta(days=14))
    preferred_supplier_id = Column(Integer, ForeignKey("suppliers.id"), nullable=True)
    specifications = Column(Text, nullable=True)
    status = Column(String, default="Draft") # Draft, Submitted, Quote Requested, Quote Received, Approved, Ordered, Completed

    created_at = Column(DateTime, default=datetime.datetime.utcnow)

    organization = relationship("Organization", back_populates="procurement_requests")
    quotations = relationship("Quotation", back_populates="procurement_request")
    purchase_orders = relationship("PurchaseOrder", back_populates="procurement_request")

class Quotation(Base):
    __tablename__ = "quotations"

    id = Column(Integer, primary_key=True, index=True)
    procurement_request_id = Column(Integer, ForeignKey("procurement_requests.id"))
    supplier_id = Column(Integer, ForeignKey("suppliers.id"))
    unit_price = Column(Float, nullable=False)
    quantity = Column(Integer, nullable=False)
    shipping_cost = Column(Float, default=5000.0)
    tax = Column(Float, default=18.0) # GST %
    discount = Column(Float, default=5.0) # %
    delivery_days = Column(Integer, default=7)
    warranty = Column(String, default="24 Months")
    total_cost = Column(Float, nullable=False)
    status = Column(String, default="Received") # Received, Under Review, Approved, Rejected

    created_at = Column(DateTime, default=datetime.datetime.utcnow)

    procurement_request = relationship("ProcurementRequest", back_populates="quotations")
    supplier = relationship("Supplier", back_populates="quotations")

class PurchaseOrder(Base):
    __tablename__ = "purchase_orders"

    id = Column(Integer, primary_key=True, index=True)
    procurement_request_id = Column(Integer, ForeignKey("procurement_requests.id"))
    quotation_id = Column(Integer, ForeignKey("quotations.id"), nullable=True)
    order_number = Column(String, unique=True, index=True, nullable=False)
    total_amount = Column(Float, nullable=False)
    status = Column(String, default="Ordered") # Ordered, Processing, Shipped, Delivered, Completed, Cancelled
    payment_status = Column(String, default="Pending") # Pending, Paid, Partially Paid
    delivery_status = Column(String, default="In Transit") # Preparing, In Transit, Delivered
    expected_delivery = Column(DateTime, default=lambda: datetime.datetime.utcnow() + datetime.timedelta(days=7))
    created_at = Column(DateTime, default=datetime.datetime.utcnow)

    procurement_request = relationship("ProcurementRequest", back_populates="purchase_orders")
    items = relationship("OrderItem", back_populates="purchase_order")

class OrderItem(Base):
    __tablename__ = "order_items"

    id = Column(Integer, primary_key=True, index=True)
    purchase_order_id = Column(Integer, ForeignKey("purchase_orders.id"))
    product_id = Column(Integer, ForeignKey("products.id"))
    quantity = Column(Integer, nullable=False)
    unit_price = Column(Float, nullable=False)
    total_price = Column(Float, nullable=False)

    purchase_order = relationship("PurchaseOrder", back_populates="items")

class Favorite(Base):
    __tablename__ = "favorites"

    id = Column(Integer, primary_key=True, index=True)
    user_id = Column(Integer, ForeignKey("users.id"))
    product_id = Column(Integer, ForeignKey("products.id"))
    created_at = Column(DateTime, default=datetime.datetime.utcnow)

    user = relationship("User", back_populates="favorites")

class Recommendation(Base):
    __tablename__ = "recommendations"

    id = Column(Integer, primary_key=True, index=True)
    user_id = Column(Integer, ForeignKey("users.id"))
    product_id = Column(Integer, ForeignKey("products.id"))
    score = Column(Float, default=95.0)
    reason = Column(Text)
    model_version = Column(String, default="v2.4-hybrid")
    created_at = Column(DateTime, default=datetime.datetime.utcnow)

class SupplierPerformance(Base):
    __tablename__ = "supplier_performance"

    id = Column(Integer, primary_key=True, index=True)
    supplier_id = Column(Integer, ForeignKey("suppliers.id"))
    date = Column(DateTime, default=datetime.datetime.utcnow)
    orders = Column(Integer, default=45)
    on_time_delivery_rate = Column(Float, default=98.2)
    defect_rate = Column(Float, default=0.4)
    average_delivery_days = Column(Float, default=5.2)
    response_time = Column(Float, default=2.5) # hours
    customer_rating = Column(Float, default=4.8)
    quality_score = Column(Float, default=96.0)
    performance_score = Column(Float, default=95.5)

    supplier = relationship("Supplier", back_populates="performances")

class MarketData(Base):
    __tablename__ = "market_data"

    id = Column(Integer, primary_key=True, index=True)
    category = Column(String, index=True)
    industry = Column(String, index=True)
    region = Column(String, default="Asia-Pacific")
    date = Column(DateTime, default=datetime.datetime.utcnow)
    market_size = Column(Float, default=1240.0) # Millions INR
    demand_index = Column(Float, default=118.5)
    growth_rate = Column(Float, default=6.4) # %
    average_price = Column(Float, default=185000.0)

class DemandHistory(Base):
    __tablename__ = "demand_history"

    id = Column(Integer, primary_key=True, index=True)
    product_id = Column(Integer, ForeignKey("products.id"))
    date = Column(DateTime, default=datetime.datetime.utcnow)
    demand = Column(Integer, default=120)
    orders = Column(Integer, default=35)

    product = relationship("Product", back_populates="demand_history")

class Notification(Base):
    __tablename__ = "notifications"

    id = Column(Integer, primary_key=True, index=True)
    user_id = Column(Integer, ForeignKey("users.id"))
    type = Column(String, default="price_alert") # price_change, supplier_risk, order_status, quote_received, procurement_approval, recommendation
    title = Column(String, nullable=False)
    message = Column(Text, nullable=False)
    severity = Column(String, default="info") # info, success, warning, critical
    is_read = Column(Boolean, default=False)
    created_at = Column(DateTime, default=datetime.datetime.utcnow)

    user = relationship("User", back_populates="notifications")

class Report(Base):
    __tablename__ = "reports"

    id = Column(Integer, primary_key=True, index=True)
    user_id = Column(Integer, ForeignKey("users.id"))
    type = Column(String, default="Executive Summary") # Product Intelligence, Supplier Performance, Procurement Savings, Price Analysis
    parameters = Column(JSON, nullable=True)
    file_url = Column(String, nullable=True)
    status = Column(String, default="Completed") # Generating, Completed, Failed
    created_at = Column(DateTime, default=datetime.datetime.utcnow)

class AuditLog(Base):
    __tablename__ = "audit_logs"

    id = Column(Integer, primary_key=True, index=True)
    user_id = Column(Integer, ForeignKey("users.id"), nullable=True)
    action = Column(String, nullable=False)
    entity_type = Column(String, nullable=False)
    entity_id = Column(String, nullable=True)
    ip_address = Column(String, default="127.0.0.1")
    created_at = Column(DateTime, default=datetime.datetime.utcnow)
