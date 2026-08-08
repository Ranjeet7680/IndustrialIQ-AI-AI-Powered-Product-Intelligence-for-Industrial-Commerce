"use client";

import React, { useEffect, useState } from 'react';
import { PackageCheck, Truck, CheckCircle2, FileText, Printer } from 'lucide-react';
import { getOrders } from '../lib/api';

export default function OrdersView() {
  const [orders, setOrders] = useState<any[]>([]);
  const [selectedOrder, setSelectedOrder] = useState<any>(null);

  useEffect(() => {
    async function load() {
      try {
        const data = await getOrders();
        setOrders(data);
        if (data.length > 0) setSelectedOrder(data[0]);
      } catch (err) {
        console.log('Error loading orders');
      }
    }
    load();
  }, []);

  return (
    <div className="space-y-6 font-body-md">
      <div>
        <h1 className="font-headline-sm text-xl font-bold text-on-surface">Purchase Orders & Logistics Tracking</h1>
        <p className="font-body-md text-xs text-on-surface-variant">Track open order fulfillment, shipment statuses, and digital invoices.</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Orders Table */}
        <div className="lg:col-span-2 bg-surface-container-lowest border border-outline-variant rounded-lg overflow-hidden shadow-sm">
          <table className="w-full text-left text-xs border-collapse">
            <thead>
              <tr className="bg-surface-container border-b border-outline-variant font-label-caps text-on-surface-variant uppercase">
                <th className="p-3">PO Number</th>
                <th className="p-3">Total Amount</th>
                <th className="p-3">Payment</th>
                <th className="p-3">Delivery Status</th>
                <th className="p-3">Action</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-outline-variant">
              {orders.map((o) => (
                <tr key={o.id} className="hover:bg-surface-container-low transition-colors">
                  <td className="p-3 font-semibold text-on-surface flex items-center gap-2">
                    <PackageCheck size={16} className="text-secondary" />
                    <span>{o.order_number}</span>
                  </td>
                  <td className="p-3 font-data-mono font-bold">₹ {o.total_amount?.toLocaleString('en-IN')}</td>
                  <td className="p-3 font-medium text-green-700">{o.payment_status}</td>
                  <td className="p-3 font-medium text-purple-700 flex items-center gap-1">
                    <Truck size={14} /> {o.delivery_status}
                  </td>
                  <td className="p-3">
                    <button
                      onClick={() => setSelectedOrder(o)}
                      className="text-secondary hover:underline font-semibold"
                    >
                      View Invoice
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* Order Details & Invoice Card */}
        {selectedOrder && (
          <div className="bg-surface-container-lowest border border-outline-variant rounded-lg p-6 space-y-4 text-xs">
            <div className="flex justify-between items-center border-b border-outline-variant pb-3">
              <div>
                <h3 className="font-bold text-sm text-on-surface">{selectedOrder.order_number}</h3>
                <p className="text-on-surface-variant font-data-mono text-[10px]">Tax Invoice / Bill of Lading</p>
              </div>
              <button onClick={() => window.print()} className="p-1.5 border border-outline-variant rounded text-on-surface hover:bg-surface">
                <Printer size={16} />
              </button>
            </div>

            <div className="space-y-2">
              <div className="flex justify-between">
                <span className="text-on-surface-variant">Order Total:</span>
                <span className="font-bold font-data-mono">₹ {selectedOrder.total_amount?.toLocaleString('en-IN')}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-on-surface-variant">Payment Status:</span>
                <span className="font-semibold text-green-700">{selectedOrder.payment_status}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-on-surface-variant">Delivery Status:</span>
                <span className="font-semibold text-purple-700">{selectedOrder.delivery_status}</span>
              </div>
            </div>

            {/* Timeline */}
            <div className="pt-4 border-t border-outline-variant space-y-3">
              <h4 className="font-semibold text-on-surface">Logistics Milestone Timeline</h4>
              <div className="space-y-2 border-l-2 border-secondary/40 pl-3">
                <div className="text-[11px]">
                  <div className="font-semibold text-on-surface">PO Confirmed</div>
                  <div className="text-on-surface-variant text-[10px]">Payment Processed via Corporate ERP</div>
                </div>
                <div className="text-[11px]">
                  <div className="font-semibold text-purple-700">In Transit</div>
                  <div className="text-on-surface-variant text-[10px]">En route to Manufacturing Plant #4</div>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
