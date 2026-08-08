# IndustrialIQ AI — AI-Powered Product Intelligence for Industrial Commerce

> *"Intelligence for Every Industrial Decision."*

IndustrialIQ AI is a production-ready, full-stack enterprise B2B platform designed to optimize industrial procurement, supplier risk assessment, natural language component search, technical specification comparison, price forecasting, and order management.

---

## 👥 Team Information

**Team Members**:
- **Ranjeet Kumar** *(Team Leader)* — [rajranjeet7680@gmail.com](mailto:rajranjeet7680@gmail.com)
- **Sarthak Aggarwal** — [sarthakaggarwal35@gmail.com](mailto:sarthakaggarwal35@gmail.com)
- **Kapil** — [kapil57076@gmail.com](mailto:kapil57076@gmail.com)

---

## 🌟 Key Features

1. **Natural Language Semantic Product Search**:
   - Natural language search query parsing with intent detection, price constraint bounds, and material extraction (e.g., *"Find stainless steel centrifugal pumps for high-pressure applications under ₹3 lakh"*).

2. **7-Factor Explainable AI Score**:
   - Transparent multi-factor scoring formula:
     $$\text{AI Score} = 0.20 \times \text{Quality} + 0.20 \times \text{Reliability} + 0.20 \times \text{Value} + 0.15 \times \text{Supplier} + 0.10 \times \text{Availability} + 0.10 \times \text{Spec Match} + 0.05 \times \text{Price Competitiveness}$$
   - Normalized from 0 to 100 with clear sub-score breakdown and textual explanation.

3. **End-to-End B2B Procurement Engine**:
   - Complete operational flow: **Product Discovery $\rightarrow$ RFQ Creation $\rightarrow$ Multi-Supplier Quotation Comparison $\rightarrow$ PO Issuance $\rightarrow$ Order Tracking Timeline $\rightarrow$ Digital Invoice View**.

4. **Supplier Intelligence & Risk Telemetry**:
   - Evaluates supplier quality scores, delivery reliability, defect rates, response times, and risk levels (*Low, Medium, High*).

5. **Interactive 3D Supply Chain Network**:
   - Rendered using Three.js / WebGL canvas featuring interactive equipment nodes (Pumps, Valves, Motors, Compressors, Logistics Hubs) with live telemetry popups.

6. **AI Copilot Assistant**:
   - Natural language assistant capable of executing internal platform tools (`search_products`, `compare_products`, `search_suppliers`, `get_price_history`, `create_procurement_request`) with action confirmation safeguards for financial operations.

7. **Global Command Palette (`Ctrl+K`)**:
   - Instant search modal spanning across Products, Suppliers, Purchase Orders, and Reports.

8. **Executive Analytics & Predictive Price Forecasting**:
   - Recharts dynamic spend vs. demand charts, price trend graphs, and 6-month XGBoost time-series predictive forecasting.

9. **Admin Suite & ML Operations**:
   - Dataset pipeline status (*DataCo Smart Supply Chain, AI4I 2020 Predictive Maintenance*), ML Model Center metrics (*Product Ranking Engine, Supplier Risk Classifier*), system health diagnostics, and audit logs.

---

## 💻 Technology Stack

- **Backend**: Python FastAPI, SQLAlchemy ORM, Pydantic, SQLite / PostgreSQL, JWT security, PyTest.
- **Frontend**: Next.js 14, React 18, Tailwind CSS (Stitch IndustrialIQ AI design system tokens), Recharts, Three.js, Lucide Icons, Material Symbols Outlined.
- **Machine Learning**: Scikit-Learn, TF-IDF vector similarity, time-series forecasting, explainable scoring formulas.

---

## 🗄️ Database Architecture (20 Relational Tables)

The database schema (`industrial_iq.db` / PostgreSQL) includes:
- `users` & `organizations`: Authentication, user roles (*Procurement Manager, Analyst, Admin*), company profiles.
- `products` & `product_specifications`: SKUs, categories, subcategories, technical attributes, warranties.
- `suppliers` & `supplier_performance`: Vetted supplier profiles, quality scores, defect rates, delivery history.
- `product_prices`, `demand_history`, `market_data`: Historical pricing data, demand trends, market size indices.
- `procurement_requests`, `quotations`, `purchase_orders`, `order_items`: Full B2B procurement workflow.
- `favorites`, `recommendations`, `notifications`, `reports`, `audit_logs`: User interaction & system administration tracking.

---

## 🚀 Quick Start & Installation

### 1. Backend & Database Setup

```bash
# 1. Install Backend Dependencies
pip install -r backend/requirements.txt

# 2. Seed Database (Generates 1,000+ products, 100+ suppliers, prices, orders, RFQs)
python scripts/seed_database.py

# 3. Run FastAPI Backend Server
python -m uvicorn backend.main:app --reload --port 8000
```
Interactive OpenAPI Documentation will be live at: `http://localhost:8000/docs`

### 2. Run Automated PyTest Suite

```bash
python -m pytest tests/test_api.py
```
*(All 8 test suites execute and pass 100%)*

### 3. Frontend Next.js Setup

```bash
cd frontend
npm install
npm run dev
```
Open `http://localhost:3000` in your web browser.

---

## 📸 Core User Journey Flow

```
WELCOME SPLASH
  └── LANDING PAGE
      └── AUTHENTICATION (Sign In / Sign Up)
          └── INDUSTRY ONBOARDING WIZARD
              └── SETUP COMPLETE
                  └── DASHBOARD OVERVIEW (KPIs, Spend Charts, Activity Feed)
                      ├── AI PRODUCT SEARCH & SEMANTIC CATALOG
                      ├── PRODUCT DETAILS & EXPLAINABLE AI BREAKDOWN
                      ├── TECHNICAL COMPARISON MATRIX (Side-by-Side)
                      ├── SUPPLIER INTELLIGENCE TELEMETRY
                      ├── PROCUREMENT WORKFLOW (RFQ -> Quotes -> PO Issue)
                      ├── ORDERS & INVOICE TRACKING
                      ├── 3D INDUSTRIAL NETWORK CANVAS
                      ├── AI COPILOT CHATBOT (Tool Executing)
                      └── ADMIN SUITE (ML Models, Datasets, Audit Logs)
```

---

## 📄 License & Team Credits

Built for the hackathon by **Team Leader Ranjeet Kumar**, **Sarthak Aggarwal**, and **Kapil**.
All rights reserved © 2026 IndustrialIQ AI.
