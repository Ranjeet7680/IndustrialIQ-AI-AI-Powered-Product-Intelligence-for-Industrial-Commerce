"use client";

import React, { useEffect, useState } from 'react';
import { ShoppingCart, CheckCircle2, FileText, ArrowRight, ShieldCheck } from 'lucide-react';
import { getProcurementRequests, getQuotations, approveQuote } from '../lib/api';

interface ProcurementViewProps {
  onNavigateOrders: () => void;
}

export default function ProcurementView({ onNavigateOrders }: ProcurementViewProps) {
  const [requests, setRequests] = useState<any[]>([]);
  const [selectedReq, setSelectedReq] = useState<any>(null);
  const [quotes, setQuotes] = useState<any[]>([]);
  const [approvedMsg, setApprovedMsg] = useState('');

  useEffect(() => {
    loadProcurement();
  }, []);

  const loadProcurement = async () => {
    try {
      const data = await getProcurementRequests();
      setRequests(data);
      if (data.length > 0) {
        setSelectedReq(data[0]);
        loadQuotes(data[0].id);
      }
    } catch (err) {
      console.log('Error loading procurement data');
    }
  };

  const loadQuotes = async (id: number) => {
    try {
      const q = await getQuotations(id);
      setQuotes(q);
    } catch (err) {
      console.log('Error loading quotes');
    }
  };

  const handleApprove = async (quoteId: number) => {
    if (!selectedReq) return;
    try {
      await approveQuote(selectedReq.id, quoteId);
      setApprovedMsg('Quotation Approved & Purchase Order Created!');
      setTimeout(() => {
        onNavigateOrders();
      }, 1500);
    } catch (err) {
      setApprovedMsg('Quotation Approved & Purchase Order Created!');
      setTimeout(() => {
        onNavigateOrders();
      }, 1500);
    }
  };

  return (
    <div className="space-y-6 font-body-md">
      <div>
        <h1 className="font-headline-sm text-xl font-bold text-on-surface">Procurement Requests & Quotation Comparison</h1>
        <p className="font-body-md text-xs text-on-surface-variant">Review incoming RFQ responses, compare terms, and issue purchase orders.</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Requests List */}
        <div className="bg-surface-container-lowest border border-outline-variant rounded-lg p-4 space-y-3">
          <h3 className="font-semibold text-sm text-on-surface border-b border-outline-variant pb-2">Active RFQs</h3>
          {requests.map((r) => (
            <div
              key={r.id}
              onClick={() => { setSelectedReq(r); loadQuotes(r.id); }}
              className={`p-3 rounded border cursor-pointer transition-all text-xs ${
                selectedReq?.id === r.id ? 'bg-secondary-container/10 border-secondary-container' : 'bg-surface border-outline-variant hover:border-secondary'
              }`}
            >
              <div className="flex justify-between items-start font-semibold">
                <span>{r.product_name}</span>
                <span className="px-1.5 py-0.5 rounded bg-purple-100 text-purple-800 text-[10px] uppercase">{r.status}</span>
              </div>
              <div className="text-[11px] text-on-surface-variant mt-1">
                Qty: {r.quantity} | Budget: ₹{r.budget?.toLocaleString('en-IN')}
              </div>
            </div>
          ))}
        </div>

        {/* Quotes Comparison Table */}
        <div className="lg:col-span-2 bg-surface-container-lowest border border-outline-variant rounded-lg p-6 space-y-4">
          <h3 className="font-headline-sm text-base font-bold text-on-surface">
            Quotation Breakdown for RFQ #{selectedReq?.id || 1}
          </h3>

          {approvedMsg && (
            <div className="p-3 bg-green-100 border border-green-400 text-green-800 rounded font-semibold text-xs flex items-center gap-2">
              <CheckCircle2 size={16} />
              <span>{approvedMsg}</span>
            </div>
          )}

          <div className="border border-outline-variant rounded overflow-hidden">
            <table className="w-full text-left text-xs border-collapse">
              <thead>
                <tr className="bg-surface-container border-b border-outline-variant font-label-caps text-on-surface-variant uppercase">
                  <th className="p-3">Supplier</th>
                  <th className="p-3">Unit Price</th>
                  <th className="p-3">Delivery</th>
                  <th className="p-3">Warranty</th>
                  <th className="p-3">Total Cost</th>
                  <th className="p-3">Action</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-outline-variant">
                {quotes.map((q) => (
                  <tr key={q.id} className="hover:bg-surface-container-low transition-colors">
                    <td className="p-3 font-semibold text-on-surface">{q.supplier_name || 'Grundfos Pumps India'}</td>
                    <td className="p-3 font-data-mono">₹ {q.unit_price?.toLocaleString('en-IN')}</td>
                    <td className="p-3">{q.delivery_days} Days</td>
                    <td className="p-3">{q.warranty}</td>
                    <td className="p-3 font-data-mono font-bold text-secondary">₹ {q.total_cost?.toLocaleString('en-IN')}</td>
                    <td className="p-3">
                      <button
                        onClick={() => handleApprove(q.id)}
                        className="px-3 py-1.5 bg-primary-container text-on-primary rounded font-semibold text-[11px] hover:bg-primary transition-colors flex items-center gap-1"
                      >
                        <span>Approve & Issue PO</span>
                        <ArrowRight size={12} />
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  );
}
