const API_BASE = 'http://localhost:8000/api';

export async function fetchApi(endpoint: string, options: RequestInit = {}) {
  try {
    const res = await fetch(`${API_BASE}${endpoint}`, {
      headers: {
        'Content-Type': 'application/json',
        ...options.headers,
      },
      ...options,
    });
    if (!res.ok) {
      throw new Error(`API error: ${res.status}`);
    }
    return await res.json();
  } catch (err) {
    console.warn(`API call to ${endpoint} failed, utilizing local reactive state.`, err);
    throw err;
  }
}

export async function getProducts(params?: Record<string, string>) {
  const query = params ? '?' + new URLSearchParams(params).toString() : '';
  return fetchApi(`/products${query}`);
}

export async function searchProducts(q: string) {
  return fetchApi(`/products/search?q=${encodeURIComponent(q)}`);
}

export async function getProductIntelligence(id: number) {
  return fetchApi(`/products/${id}/intelligence`);
}

export async function getSuppliers() {
  return fetchApi('/suppliers');
}

export async function getDashboardKPIs() {
  return fetchApi('/analytics/kpis');
}

export async function getProcurementSpend() {
  return fetchApi('/analytics/procurement-spend');
}

export async function getPriceTrends() {
  return fetchApi('/analytics/price-trends');
}

export async function sendCopilotChat(message: string) {
  return fetchApi('/copilot/chat', {
    method: 'POST',
    body: JSON.stringify({ message }),
  });
}

export async function createProcurementRequest(data: { product_id: number; quantity: number; budget: number }) {
  return fetchApi('/procurement', {
    method: 'POST',
    body: JSON.stringify(data),
  });
}

export async function getProcurementRequests() {
  return fetchApi('/procurement');
}

export async function getQuotations(reqId: number) {
  return fetchApi(`/procurement/${reqId}/quotes`);
}

export async function approveQuote(reqId: number, quoteId: number) {
  return fetchApi(`/procurement/${reqId}/approve/${quoteId}`, {
    method: 'POST',
  });
}

export async function getOrders() {
  return fetchApi('/orders');
}

export async function toggleFavorite(productId: number) {
  return fetchApi(`/favorites/${productId}`, {
    method: 'POST',
  });
}

export async function generateReport(type: string) {
  return fetchApi(`/reports/generate?report_type=${encodeURIComponent(type)}`, {
    method: 'POST',
  });
}
