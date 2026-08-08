"use client";

import React, { useEffect, useState } from 'react';
import { Factory, ShieldCheck, AlertTriangle, Star, CheckCircle } from 'lucide-react';
import { getSuppliers } from '../lib/api';

export default function SuppliersView() {
  const [suppliers, setSuppliers] = useState<any[]>([]);

  useEffect(() => {
    async function load() {
      try {
        const data = await getSuppliers();
        setSuppliers(data);
      } catch (err) {
        console.log('Error fetching suppliers');
      }
    }
    load();
  }, []);

  return (
    <div className="space-y-6 font-body-md">
      <div>
        <h1 className="font-headline-sm text-xl font-bold text-on-surface">Supplier Intelligence & Risk Telemetry</h1>
        <p className="font-body-md text-xs text-on-surface-variant">Monitor supplier quality, delivery performance, and geopolitical risk factors.</p>
      </div>

      <div className="bg-surface-container-lowest border border-outline-variant rounded-lg overflow-hidden shadow-sm">
        <table className="w-full text-left text-xs border-collapse">
          <thead>
            <tr className="bg-surface-container border-b border-outline-variant font-label-caps text-on-surface-variant uppercase">
              <th className="p-3">Supplier Name</th>
              <th className="p-3">Location</th>
              <th className="p-3">AI Score</th>
              <th className="p-3">Quality</th>
              <th className="p-3">On-Time Delivery</th>
              <th className="p-3">Risk Level</th>
              <th className="p-3">Status</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-outline-variant">
            {suppliers.map((s) => (
              <tr key={s.id} className="hover:bg-surface-container-low transition-colors">
                <td className="p-3 font-semibold text-on-surface flex items-center gap-2">
                  <Factory size={16} className="text-secondary" />
                  <span>{s.name}</span>
                </td>
                <td className="p-3 text-on-surface-variant">{s.location}</td>
                <td className="p-3 font-data-mono font-bold text-purple-700">{s.ai_score}</td>
                <td className="p-3 font-data-mono">{s.quality_score}%</td>
                <td className="p-3 font-data-mono text-green-700">{s.delivery_score}%</td>
                <td className="p-3">
                  <span className={`px-2 py-0.5 rounded font-bold text-[10px] ${s.risk_score === 'Low' ? 'bg-green-100 text-green-800' : 'bg-amber-100 text-amber-800'}`}>
                    {s.risk_score} Risk
                  </span>
                </td>
                <td className="p-3">
                  <span className="flex items-center gap-1 text-green-700 font-medium text-[11px]">
                    <ShieldCheck size={14} /> {s.verification_status}
                  </span>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
