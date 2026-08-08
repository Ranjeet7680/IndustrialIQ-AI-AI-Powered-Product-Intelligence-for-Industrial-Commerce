import {
  MOCK_PRODUCTS,
  MOCK_SUPPLIERS,
  MOCK_ORDERS,
  MOCK_PROCUREMENT_REQUESTS,
  MOCK_QUOTES
} from './mockData';

const API_BASE = 'http://localhost:8000/api';

export async function fetchApi(endpoint: string, options: RequestInit = {}) {
  try {
    const controller = new AbortController();
    const id = setTimeout(() => controller.abort(), 1200); // 1.2s timeout fallback
    const res = await fetch(`${API_BASE}${endpoint}`, {
      headers: {
        'Content-Type': 'application/json',
        ...options.headers,
      },
      signal: controller.signal,
      ...options,
    });
    clearTimeout(id);
    if (!res.ok) {
      throw new Error(`API error: ${res.status}`);
    }
    return await res.json();
  } catch (err) {
    // Return null to trigger graceful mock fallback
    return null;
  }
}

export async function getProducts(params?: Record<string, string>) {
  const data = await fetchApi('/products');
  if (data && Array.isArray(data) && data.length > 0) return data;
  
  let result = [...MOCK_PRODUCTS];
  if (params?.category) {
    result = result.filter(p => p.category.toLowerCase() === params.category.toLowerCase());
  }
  if (params?.material) {
    result = result.filter(p => p.material.toLowerCase() === params.material.toLowerCase());
  }
  return result;
}

export async function searchProducts(q: string) {
  const data = await fetchApi(`/products/search?q=${encodeURIComponent(q)}`);
  if (data && Array.isArray(data) && data.length > 0) return data;

  const query = q.toLowerCase().trim();
  if (!query) return MOCK_PRODUCTS;

  return MOCK_PRODUCTS.filter(p =>
    p.name.toLowerCase().includes(query) ||
    p.category.toLowerCase().includes(query) ||
    p.material.toLowerCase().includes(query) ||
    p.supplier_name.toLowerCase().includes(query) ||
    p.description.toLowerCase().includes(query)
  );
}

export async function getProductIntelligence(id: number) {
  const data = await fetchApi(`/products/${id}/intelligence`);
  if (data) return data;
  const prod = MOCK_PRODUCTS.find(p => p.id === id) || MOCK_PRODUCTS[0];
  return {
    product: prod,
    ai_score: prod.ai_score,
    score_breakdown: {
      quality: prod.quality_score,
      reliability: prod.reliability_score,
      value: prod.value_score,
      supplier: 94,
      availability: 90,
      spec_match: 95,
      price_competitiveness: 88
    },
    recommendation_summary: "High AI Match. Optimal specifications for industrial heavy duty applications."
  };
}

export async function getSuppliers() {
  const data = await fetchApi('/suppliers');
  if (data && Array.isArray(data) && data.length > 0) return data;
  return MOCK_SUPPLIERS;
}

export async function getDashboardKPIs() {
  const data = await fetchApi('/analytics/kpis');
  if (data) return data;
  return {
    total_products: 500,
    active_suppliers: 10,
    open_rfqs: 12,
    total_spend: 34500000,
    ai_savings: 4200000,
    avg_quality_score: 96.8
  };
}

export async function getProcurementSpend() {
  const data = await fetchApi('/analytics/procurement-spend');
  if (data) return data;
  return [
    { month: 'Jan', spend: 2400000, demand: 2100000 },
    { month: 'Feb', spend: 3100000, demand: 2900000 },
    { month: 'Mar', spend: 2800000, demand: 2700000 },
    { month: 'Apr', spend: 4200000, demand: 3900000 },
    { month: 'May', spend: 3800000, demand: 3600000 },
    { month: 'Jun', spend: 5100000, demand: 4800000 }
  ];
}

export async function getPriceTrends() {
  const data = await fetchApi('/analytics/price-trends');
  if (data) return data;
  return [
    { month: 'Jan', pumps: 240000, valves: 85000 },
    { month: 'Feb', pumps: 242000, valves: 86500 },
    { month: 'Mar', pumps: 239000, valves: 84000 },
    { month: 'Apr', pumps: 245000, valves: 88000 },
    { month: 'May', pumps: 248000, valves: 89500 },
    { month: 'Jun', pumps: 251000, valves: 91000 }
  ];
}

export async function sendCopilotChat(message: string) {
  const data = await fetchApi('/copilot/chat', {
    method: 'POST',
    body: JSON.stringify({ message }),
  });
  if (data) return data;

  return {
    reply: `I analyzed your request "${message}". Based on our 500-SKU Industrial catalog, I found 14 optimal candidate products with average AI Quality Score of 96.5%.`,
    action: "RECOMMENDATION",
    tools_used: ["search_products", "calculate_ai_score"]
  };
}

export async function createProcurementRequest(data: { product_id: number; quantity: number; budget: number }) {
  const res = await fetchApi('/procurement', {
    method: 'POST',
    body: JSON.stringify(data),
  });
  if (res) return res;
  return { id: Math.floor(Math.random() * 1000), status: "Created", ...data };
}

export async function getProcurementRequests() {
  const data = await fetchApi('/procurement');
  if (data && Array.isArray(data) && data.length > 0) return data;
  return MOCK_PROCUREMENT_REQUESTS;
}

export async function getQuotations(reqId: number) {
  const data = await fetchApi(`/procurement/${reqId}/quotes`);
  if (data && Array.isArray(data) && data.length > 0) return data;
  return MOCK_QUOTES;
}

export async function approveQuote(reqId: number, quoteId: number) {
  const res = await fetchApi(`/procurement/${reqId}/approve/${quoteId}`, {
    method: 'POST',
  });
  if (res) return res;
  return { message: "Quotation Approved & Purchase Order Created", po_number: "PO-2026-9901" };
}

export async function getOrders() {
  const data = await fetchApi('/orders');
  if (data && Array.isArray(data) && data.length > 0) return data;
  return MOCK_ORDERS;
}

export async function toggleFavorite(productId: number) {
  const res = await fetchApi(`/favorites/${productId}`, {
    method: 'POST',
  });
  if (res) return res;
  return { message: "Favorite Toggled" };
}

export async function generateReport(type: string) {
  const res = await fetchApi(`/reports/generate?report_type=${encodeURIComponent(type)}`, {
    method: 'POST',
  });
  if (res) return res;
  return { message: "Report Generated", type };
}
