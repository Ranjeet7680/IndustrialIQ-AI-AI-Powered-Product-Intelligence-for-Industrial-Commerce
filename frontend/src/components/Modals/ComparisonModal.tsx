"use client";

import React from 'react';
import { X, Check, ArrowRightLeft, ShieldCheck, Zap, Award } from 'lucide-react';

interface ProductCompareItem {
  id: number;
  name: string;
  sku: string;
  brand: string;
  price: number;
  ai_score: number;
  quality_score: number;
  reliability_score: number;
  value_score: number;
  material: string;
  availability: string;
  warranty_months: number;
  rating: float;
}

interface ComparisonModalProps {
  products: ProductCompareItem[];
  isOpen: boolean;
  onClose: () => void;
  onRemove: (id: number) => void;
}

export default function ComparisonModal({ products, isOpen, onClose, onRemove }: ComparisonModalProps) {
  if (!isOpen || products.length === 0) return null;

  const lowestPriceId = [...products].sort((a, b) => a.price - b.price)[0]?.id;
  const bestReliabilityId = [...products].sort((a, b) => b.reliability_score - a.reliability_score)[0]?.id;
  const bestAIScoreId = [...products].sort((a, b) => b.ai_score - a.ai_score)[0]?.id;

  return (
    <div className="fixed inset-0 bg-black/70 backdrop-blur-sm z-50 flex items-center justify-center p-4 font-body-md">
      <div className="bg-surface-container-lowest border border-outline-variant rounded-xl shadow-2xl max-w-5xl w-full max-h-[90vh] flex flex-col overflow-hidden animate-in fade-in zoom-in-95 duration-150">
        {/* Modal Header */}
        <div className="p-4 border-b border-outline-variant flex justify-between items-center bg-surface-container">
          <div className="flex items-center gap-2">
            <ArrowRightLeft className="text-secondary" size={20} />
            <h3 className="font-headline-sm text-lg font-bold text-on-surface">Product Comparison Matrix</h3>
            <span className="text-xs bg-secondary-container/20 text-secondary-fixed px-2 py-0.5 rounded font-data-mono">
              {products.length} Products Selected
            </span>
          </div>
          <button onClick={onClose} className="p-1 hover:bg-surface-container-high rounded text-on-surface-variant">
            <X size={20} />
          </button>
        </div>

        {/* Comparison Table */}
        <div className="flex-1 overflow-x-auto overflow-y-auto p-6">
          <table className="w-full text-left text-xs border-collapse">
            <thead>
              <tr className="border-b border-outline-variant">
                <th className="p-3 w-48 font-label-caps text-on-surface-variant uppercase">Specification</th>
                {products.map((p) => (
                  <th key={p.id} className="p-3 min-w-[200px] align-top bg-surface-container-low border-l border-outline-variant relative">
                    <button
                      onClick={() => onRemove(p.id)}
                      className="absolute top-2 right-2 text-on-surface-variant hover:text-error"
                      title="Remove from comparison"
                    >
                      <X size={14} />
                    </button>
                    <div className="font-bold text-sm text-on-surface pr-5 leading-tight">{p.name}</div>
                    <div className="font-data-mono text-[10px] text-on-surface-variant mt-1">{p.sku}</div>

                    {/* AI Winner Badges */}
                    <div className="mt-2 space-y-1">
                      {p.id === bestAIScoreId && (
                        <span className="inline-flex items-center gap-1 px-1.5 py-0.5 rounded bg-purple-100 text-purple-800 text-[10px] font-bold">
                          <Award size={10} /> Best Overall AI Score
                        </span>
                      )}
                      {p.id === lowestPriceId && (
                        <span className="inline-flex items-center gap-1 px-1.5 py-0.5 rounded bg-green-100 text-green-800 text-[10px] font-bold">
                          <Zap size={10} /> Lowest Unit Cost
                        </span>
                      )}
                      {p.id === bestReliabilityId && (
                        <span className="inline-flex items-center gap-1 px-1.5 py-0.5 rounded bg-blue-100 text-blue-800 text-[10px] font-bold">
                          <ShieldCheck size={10} /> Highest Reliability
                        </span>
                      )}
                    </div>
                  </th>
                ))}
              </tr>
            </thead>
            <tbody className="divide-y divide-outline-variant">
              <tr>
                <td className="p-3 font-semibold text-on-surface-variant">Unit Price</td>
                {products.map((p) => (
                  <td key={p.id} className="p-3 border-l border-outline-variant font-headline-sm text-base font-bold text-on-surface">
                    ₹ {p.price.toLocaleString('en-IN')}
                  </td>
                ))}
              </tr>
              <tr>
                <td className="p-3 font-semibold text-on-surface-variant">AI Intelligence Score</td>
                {products.map((p) => (
                  <td key={p.id} className="p-3 border-l border-outline-variant">
                    <span className="font-data-mono font-bold text-sm text-purple-700 bg-purple-100 px-2 py-0.5 rounded">
                      {p.ai_score} / 100
                    </span>
                  </td>
                ))}
              </tr>
              <tr>
                <td className="p-3 font-semibold text-on-surface-variant">Quality Score</td>
                {products.map((p) => (
                  <td key={p.id} className="p-3 border-l border-outline-variant font-data-mono">{p.quality_score}</td>
                ))}
              </tr>
              <tr>
                <td className="p-3 font-semibold text-on-surface-variant">Reliability Score</td>
                {products.map((p) => (
                  <td key={p.id} className="p-3 border-l border-outline-variant font-data-mono">{p.reliability_score}</td>
                ))}
              </tr>
              <tr>
                <td className="p-3 font-semibold text-on-surface-variant">Material Construction</td>
                {products.map((p) => (
                  <td key={p.id} className="p-3 border-l border-outline-variant">{p.material}</td>
                ))}
              </tr>
              <tr>
                <td className="p-3 font-semibold text-on-surface-variant">Availability Status</td>
                {products.map((p) => (
                  <td key={p.id} className="p-3 border-l border-outline-variant text-green-700 font-medium">{p.availability}</td>
                ))}
              </tr>
              <tr>
                <td className="p-3 font-semibold text-on-surface-variant">Warranty Period</td>
                {products.map((p) => (
                  <td key={p.id} className="p-3 border-l border-outline-variant">{p.warranty_months} Months</td>
                ))}
              </tr>
              <tr>
                <td className="p-3 font-semibold text-on-surface-variant">Customer Rating</td>
                {products.map((p) => (
                  <td key={p.id} className="p-3 border-l border-outline-variant font-bold text-amber-600">★ {p.rating}</td>
                ))}
              </tr>
            </tbody>
          </table>
        </div>

        {/* Footer Actions */}
        <div className="p-4 border-t border-outline-variant bg-surface-container flex justify-between items-center">
          <span className="text-xs text-on-surface-variant">
            Technical specs evaluated by IndustrialIQ AI scoring models.
          </span>
          <button
            onClick={onClose}
            className="px-4 py-2 bg-primary-container text-on-primary rounded text-xs font-semibold hover:bg-primary transition-colors"
          >
            Close Comparison Matrix
          </button>
        </div>
      </div>
    </div>
  );
}
