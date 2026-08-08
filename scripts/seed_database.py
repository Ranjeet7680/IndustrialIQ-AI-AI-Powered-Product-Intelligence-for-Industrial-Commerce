import os
import sys
import random
import datetime

# Add root directory to python path
sys.path.append(os.path.dirname(os.path.dirname(os.path.abspath(__file__))))

from backend.app.core.database import engine, SessionLocal, Base
from backend.app.core.security import get_password_hash
from backend.app.models.models import (
    User, Organization, Supplier, Product, ProductSpecification, ProductPrice,
    ProductReview, ProcurementRequest, Quotation, PurchaseOrder, OrderItem,
    Favorite, Recommendation, SupplierPerformance, MarketData, DemandHistory,
    Notification, Report, AuditLog
)

def seed_database():
    print("Recreating database tables...")
    Base.metadata.drop_all(bind=engine)
    Base.metadata.create_all(bind=engine)

    db = SessionLocal()
    try:
        print("Seeding Organizations...")
        org1 = Organization(
            name="Reliance Industrial Engineering",
            industry="Heavy Manufacturing",
            company_size="10,000+",
            country="India",
            procurement_volume="₹500Cr+"
        )
        org2 = Organization(
            name="AeroSteel Dynamics",
            industry="Aerospace & Defense",
            company_size="1,000-5,000",
            country="India",
            procurement_volume="₹100Cr+"
        )
        db.add_all([org1, org2])
        db.commit()

        print("Seeding Users...")
        admin = User(
            name="Ranjeet Platform Admin",
            email="admin@industrialiq.ai",
            password_hash=get_password_hash("admin123"),
            role="Platform Admin",
            organization_id=org1.id,
            is_verified=True,
            is_active=True
        )
        proc_mgr = User(
            name="Ranjeet Procurement Manager",
            email="ranjeet@industrialiq.ai",
            password_hash=get_password_hash("password123"),
            role="Procurement Manager",
            organization_id=org1.id,
            is_verified=True,
            is_active=True
        )
        analyst = User(
            name="Priya Sharma (Analyst)",
            email="priya@aerosteel.com",
            password_hash=get_password_hash("password123"),
            role="Analyst",
            organization_id=org2.id,
            is_verified=True,
            is_active=True
        )
        db.add_all([admin, proc_mgr, analyst])
        db.commit()

        print("Seeding Suppliers...")
        suppliers_data = [
            {"name": "Grundfos Pumps India Ltd", "location": "Chennai, India", "country": "India", "rating": 4.9, "quality": 98.0, "delivery": 97.0, "risk": "Low", "ver": "Verified"},
            {"name": "KSB Pumps & Valves Corp", "location": "Pune, India", "country": "India", "rating": 4.8, "quality": 95.0, "delivery": 94.0, "risk": "Low", "ver": "Verified"},
            {"name": "Siemens Industrial Automation", "location": "Mumbai, India", "country": "India", "rating": 4.9, "quality": 99.0, "delivery": 96.0, "risk": "Low", "ver": "Verified"},
            {"name": "ABB Heavy Industries", "location": "Bengaluru, India", "country": "India", "rating": 4.7, "quality": 94.0, "delivery": 92.0, "risk": "Low", "ver": "Verified"},
            {"name": "WILO Mather & Platt Pumps", "location": "Kolhapur, India", "country": "India", "rating": 4.5, "quality": 90.0, "delivery": 89.0, "risk": "Medium", "ver": "Standard"},
            {"name": "SKF Bearings India", "location": "Pune, India", "country": "India", "rating": 4.9, "quality": 98.5, "delivery": 97.5, "risk": "Low", "ver": "Verified"},
            {"name": "Atlas Copco Industrial Compressors", "location": "Pune, India", "country": "India", "rating": 4.8, "quality": 96.0, "delivery": 95.0, "risk": "Low", "ver": "Verified"},
            {"name": "Danfoss Hydraulics & Drives", "location": "Chennai, India", "country": "India", "rating": 4.6, "quality": 92.0, "delivery": 91.0, "risk": "Medium", "ver": "Verified"},
            {"name": "Fanuc Robotics Asia", "location": "Tokyo, Japan", "country": "Japan", "rating": 4.95, "quality": 99.5, "delivery": 98.0, "risk": "Low", "ver": "Verified"},
            {"name": "TechFlow Valve Solutions", "location": "Ahmedabad, India", "country": "India", "rating": 4.3, "quality": 88.0, "delivery": 86.0, "risk": "Medium", "ver": "Standard"}
        ]
        
        suppliers_list = []
        for s in suppliers_data:
            sup = Supplier(
                name=s["name"],
                location=s["location"],
                country=s["country"],
                description=f"Leading industrial equipment supplier specializing in enterprise-grade {s['name'].split()[0]} components.",
                rating=s["rating"],
                quality_score=s["quality"],
                delivery_score=s["delivery"],
                price_score=round(random.uniform(85, 96), 1),
                reliability_score=round((s["quality"] + s["delivery"]) / 2, 1),
                risk_score=s["risk"],
                ai_score=round((s["quality"] * 0.4 + s["delivery"] * 0.4 + 90 * 0.2), 1),
                verification_status=s["ver"],
                certifications="ISO 9001:2015, CE, ASME, DIN",
                years_in_business=random.randint(10, 35),
                response_time_hours=round(random.uniform(1.5, 6.0), 1)
            )
            suppliers_list.append(sup)
        
        db.add_all(suppliers_list)
        db.commit()

        print("Seeding Products & Specifications...")
        product_templates = [
            ("Pumps", "Centrifugal Pumps", "Grundfos CR 32-4 Vertical Multistage Pump", "Grundfos", "Stainless Steel 316", "High Pressure Chemical Transfer", 245000.0, "https://lh3.googleusercontent.com/aida-public/AB6AXuCz4pTxODLwfkYv_txUeZ9iqpW8g6ixt8wF2Z0E0DyiEZ9RQIensln0GIkx-1SXoTOE5TdjEZmMYQhtnTJPViJH12v6gH6uYZGJX0eAnYZ9yFBMIXDfNgdCv5Om5d6sL22-Z6Ffbp71uHeDKXA3y3ZoyeareQ2YMDEmmQ1QhQCEkr98GmGcAS4f8Khx9XqGwillKhan_0Nhpdy2V2P1Ecu9k92DI6o7Qmw3vljzY0ZBuqdueU7hQ4ltQw"),
            ("Pumps", "Inline Pumps", "KSB Movitec High Pressure Inline Pump", "KSB", "Cast Iron GG25", "Water Distribution & HVAC", 189500.0, "https://lh3.googleusercontent.com/aida-public/AB6AXuBsEzTOgsiX_G1MN8rqWbmv9Y5E9prU4co8XoOo3pxM1hrCxbk3VjNTqkHgR3d5zWNP_ihEn1PFYhj-kPLlNkxsfj4EcQ21IQDdNujfBQvy8AifxB_BlSZFA_j30DHfkkXr_tcJOsZ8y3cfuc-TK5ApUtysaqtmTzUbHlf8dSH_2n6H8p1Zbjpe6E4QFQD5oha2cMvEFFAZjl0RhQL32uA2crj8W2KAsjvDh4-zUzKciDXJ-iSiSshEYA"),
            ("Pumps", "Submersible Pumps", "WILO Helix V Stainless Steel Pump", "WILO", "Stainless Steel 304", "Industrial Wastewater Treatment", 215000.0, "https://lh3.googleusercontent.com/aida-public/AB6AXuBdZogkLQHL561SrLEvhr3SREP6j3g2iIUtgiB9TYhW16h3CDlY8pL31JrN8DBcMO5mMFwl3ak27zN-1Sf38q2THdjBEgXZwd4hZF0jUFhst2xrBzTTgHfIk43bNYfEL0w6N2wwMIBnNt18n6_6Gi-ixi9Xi8SWmWPe-MnUk6yKvbe08A6dpH-tAkGwxBsgxkl16wSdHCbkyzEW-qHVPxLh1z1NGmdiCbnOKw5KBDj7ksUhsUwIRqrxLw"),
            ("Valves", "Butterfly Valves", "TechFlow High-Performance Flanged Butterfly Valve", "TechFlow", "Carbon Steel A216", "Steam & Gas Pipeline Control", 48500.0, None),
            ("Motors", "AC Induction Motors", "Siemens 1LE13 75kW 4-Pole AC Motor", "Siemens", "Cast Iron Casing", "Heavy Conveyor & Compressor Drive", 320000.0, None),
            ("Motors", "Servo Motors", "ABB M3BP 110kW Premium Efficiency Motor", "ABB", "Aluminum Alloy", "Automotive Plant Automation", 450000.0, None),
            ("Bearings", "Roller Bearings", "SKF Explorer Tapered Roller Bearing 32220", "SKF", "High-Carbon Chromium Steel", "Heavy Duty Steel Rolling Mills", 12800.0, None),
            ("Compressors", "Screw Compressors", "Atlas Copco GA37 Rotary Screw Compressor", "Atlas Copco", "Heavy Industrial Steel", "Plant Compressed Air Supply", 890000.0, None),
            ("Sensors", "Pressure Transmitters", "Danfoss MBS 3000 Pressure Transmitter", "Danfoss", "Stainless Steel 316L", "Hydraulic Line Pressure Monitoring", 14500.0, None),
            ("Robotics", "Articulated Robots", "Fanuc M-20iD/25 Industrial Robot Arm", "Fanuc", "Precision Aerospace Alloy", "Automated Arc Welding & Material Handling", 2400000.0, None)
        ]

        products_list = []
        sku_counter = 1000
        for cat, sub, name, brand, mat, app, price, img in product_templates:
            supplier = random.choice(suppliers_list)
            sku = f"SKU-IND-{cat[:3].upper()}-{sku_counter}"
            sku_counter += 1
            
            p = Product(
                sku=sku,
                name=name,
                brand=brand,
                category=cat,
                sub_category=sub,
                industry="Heavy Manufacturing",
                description=f"Engineered for heavy industrial operations, the {name} offers maximum thermal stability, low vibration, and extended service life in demanding environments.",
                material=mat,
                application=app,
                price=price,
                currency="INR",
                stock_quantity=random.randint(25, 200),
                availability="In Stock",
                rating=round(random.uniform(4.3, 4.95), 1),
                review_count=random.randint(15, 80),
                warranty_months=random.choice([12, 24, 36]),
                certification="ISO 9001, CE, ASME, DIN 2576",
                supplier_id=supplier.id,
                quality_score=round(random.uniform(90, 99), 1),
                reliability_score=round(random.uniform(88, 98), 1),
                value_score=round(random.uniform(85, 96), 1),
                ai_score=round(random.uniform(88, 98), 1),
                image_url=img
            )
            products_list.append(p)

        db.add_all(products_list)
        db.commit()

        # Add specs for each product
        print("Seeding Product Specifications...")
        spec_samples = [
            ("Flow Rate", "450 m³/h", "m³/h"),
            ("Operating Pressure", "25 Bar", "Bar"),
            ("Power Rating", "45 kW", "kW"),
            ("Max Temperature", "180 °C", "°C"),
            ("Connection Standard", "DN80 Flange", "DIN/ANSI"),
            ("Protection Class", "IP68", "Rating")
        ]
        for prod in products_list:
            for name, val, unit in spec_samples[:4]:
                spec = ProductSpecification(
                    product_id=prod.id,
                    specification_name=name,
                    specification_value=val,
                    unit=unit
                )
                db.add(spec)
        db.commit()

        # Seed Price History & Demand
        print("Seeding Price History & Demand...")
        today = datetime.datetime.utcnow()
        for prod in products_list:
            # 6 months of price history
            for m in range(6, -1, -1):
                hist_date = today - datetime.timedelta(days=30 * m)
                fluc = random.uniform(-0.04, 0.05)
                unit_p = round(prod.price * (1 + fluc), 2)
                price_rec = ProductPrice(
                    product_id=prod.id,
                    supplier_id=prod.supplier_id,
                    date=hist_date,
                    unit_price=unit_p,
                    currency="INR",
                    shipping_cost=3500.0,
                    discount=5.0,
                    market_average=round(unit_p * 1.05, 2)
                )
                demand_rec = DemandHistory(
                    product_id=prod.id,
                    date=hist_date,
                    demand=random.randint(80, 300),
                    orders=random.randint(20, 90)
                )
                db.add(price_rec)
                db.add(demand_rec)
        db.commit()

        # Seed Supplier Performance
        print("Seeding Supplier Performance records...")
        for sup in suppliers_list:
            for m in range(4, -1, -1):
                hist_date = today - datetime.timedelta(days=30 * m)
                sp = SupplierPerformance(
                    supplier_id=sup.id,
                    date=hist_date,
                    orders=random.randint(30, 150),
                    on_time_delivery_rate=round(random.uniform(93.0, 99.5), 1),
                    defect_rate=round(random.uniform(0.1, 1.2), 2),
                    average_delivery_days=round(random.uniform(3.5, 7.0), 1),
                    response_time=round(random.uniform(1.2, 4.5), 1),
                    customer_rating=round(random.uniform(4.5, 4.9), 1),
                    quality_score=round(random.uniform(92.0, 98.5), 1),
                    performance_score=round(random.uniform(91.0, 98.0), 1)
                )
                db.add(sp)
        db.commit()

        # Seed Procurement Request, Quotations, and Purchase Order
        print("Seeding Procurement Workflow & Orders...")
        p1 = products_list[0]
        pr = ProcurementRequest(
            organization_id=org1.id,
            user_id=proc_mgr.id,
            product_id=p1.id,
            quantity=10,
            budget=2500000.0,
            required_date=today + datetime.timedelta(days=14),
            preferred_supplier_id=p1.supplier_id,
            specifications="PN25 rating, SS316 casing, explosion-proof motor connection required.",
            status="Quote Received"
        )
        db.add(pr)
        db.commit()

        q1 = Quotation(
            procurement_request_id=pr.id,
            supplier_id=p1.supplier_id,
            unit_price=235000.0,
            quantity=10,
            shipping_cost=15000.0,
            tax=18.0,
            discount=5.0,
            delivery_days=7,
            warranty="24 Months",
            total_cost=2650000.0,
            status="Approved"
        )
        db.add(q1)
        db.commit()

        po = PurchaseOrder(
            procurement_request_id=pr.id,
            quotation_id=q1.id,
            order_number="PO-2026-8849",
            total_amount=2650000.0,
            status="Processing",
            payment_status="Paid",
            delivery_status="In Transit",
            expected_delivery=today + datetime.timedelta(days=5)
        )
        db.add(po)
        db.commit()

        oi = OrderItem(
            purchase_order_id=po.id,
            product_id=p1.id,
            quantity=10,
            unit_price=235000.0,
            total_price=2350000.0
        )
        db.add(oi)

        # Favorites
        fav = Favorite(user_id=proc_mgr.id, product_id=p1.id)
        db.add(fav)

        # Notifications
        n1 = Notification(
            user_id=proc_mgr.id,
            type="price_alert",
            title="Price Volatility Alert",
            message="3 products in your procurement pipeline experienced price fluctuations this week.",
            severity="warning"
        )
        n2 = Notification(
            user_id=proc_mgr.id,
            type="quote_received",
            title="Supplier Quotation Received",
            message="Grundfos Pumps India Ltd submitted a quote for PO-2026-8849.",
            severity="success"
        )
        db.add_all([n1, n2])

        # Audit Logs
        a1 = AuditLog(
            user_id=proc_mgr.id,
            action="CREATE_PROCUREMENT_REQUEST",
            entity_type="ProcurementRequest",
            entity_id=str(pr.id)
        )
        db.add(a1)

        db.commit()
        print("Database seeded successfully!")

    except Exception as e:
        print(f"Error seeding database: {e}")
        db.rollback()
    finally:
        db.close()

if __name__ == "__main__":
    seed_database()
