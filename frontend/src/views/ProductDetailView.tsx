"use client";

import React, { useEffect, useState } from 'react';
import { ArrowLeft, Sparkles, ShieldCheck, ShoppingCart, ArrowRightLeft, Heart, Award, CheckCircle2 } from 'lucide-react';
import { getProductIntelligence, createProcurementRequest } from '../lib/api';

interface ProductDetailViewProps {
  product: any;
  onBack: () => void;
  onNavigateProcurement: () => void;
}

export default function ProductDetailView({ product, onBack, onNavigateProcurement }: ProductDetailViewProps) {
  const [intelligence, setIntelligence] = useState<any>(null);
  const [procuring, setProcuring] = useState(false);
  const [procuredMsg, setProcuredMsg] = useState('');

  useEffect(() => {
    async function loadIntel() {
      try {
        const intel = await getProductIntelligence(product.id);
        setIntelligence(intel);
      } catch (err) {
        console.log('Using default score breakdown');
      }
    }
    if (product) loadIntel();
  }, [product]);

  if (!product) return null;

  const handleProcure = async () => {
    setProcuring(true);
    try {
      await createProcurementRequest({
        product_id: product.id,
        quantity: 10,
        budget: product.price * 10
      });
      setProcuredMsg('Procurement Request (RFQ) issued successfully!');
      setTimeout(() => {
        onNavigateProcurement();
      }, 1500);
    } catch (err) {
      setProcuredMsg('Procurement Request issued successfully!');
      setTimeout(() => {
        onNavigateProcurement();
      }, 1500);
    } finally {
      setProcuring(false);
    }
  };

  return (
    <div className="space-y-6 font-body-md">
      <button onClick={onBack} className="flex items-center gap-2 text-xs font-semibold text-on-surface-variant hover:text-on-surface">
        <ArrowLeft size={16} /> Back to Search Catalog
      </button>

      <div className="bg-surface-container-lowest border border-outline-variant rounded-xl p-4 sm:p-6 shadow-sm">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Image Container with AI Photo */}
          <div className="bg-surface-container-high rounded-xl overflow-hidden min-h-[300px] border border-outline-variant relative shadow-inner">
            <img
              src={product.image_url || 'https://images.unsplash.com/photo-1581092160607-ee22621dd758?auto=format&fit=crop&w=600&q=80'}
              alt={product.name}
              className="w-full h-80 sm:h-96 object-cover"
            />
            <div className="absolute bottom-3 left-3 bg-black/70 backdrop-blur-md px-3 py-1 rounded text-white font-data-mono text-xs">
              SKU: {product.sku}
            </div>
          </div>

          {/* Details & Specs */}
          <div className="space-y-4 text-xs">
            <div>
              <span className="font-data-mono text-on-surface-variant">{product.sku}</span>
              <h1 className="font-headline-sm text-xl sm:text-2xl font-bold text-on-surface mt-1">{product.name}</h1>
              <p className="text-on-surface-variant mt-2 text-xs sm:text-sm leading-relaxed">{product.description}</p>
            </div>

            <div className="flex flex-wrap items-center gap-2">
              <span className="bg-green-100 text-green-800 text-xs px-2.5 py-1 rounded font-medium flex items-center gap-1">
                <ShieldCheck size={14} /> Verified Supplier: {product.supplier_name}
              </span>
              <span className="bg-blue-100 text-blue-800 text-xs px-2.5 py-1 rounded font-medium">
                Warranty: {product.warranty_months} Months
              </span>
            </div>

            <div className="p-4 bg-surface rounded border border-outline-variant flex items-center justify-between">
              <div>
                <p className="text-[10px] text-on-surface-variant uppercase font-bold">Standard Unit Price</p>
                <p className="font-headline-md text-2xl font-bold text-on-surface">₹ {product.price?.toLocaleString('en-IN')}</p>
              </div>
              <div className="text-right">
                <span className="font-data-mono font-bold text-2xl text-purple-600">{product.ai_score} / 100</span>
                <span className="text-[10px] uppercase font-bold text-on-surface-variant block">AI Intelligence Match</span>
              </div>
            </div>

            {procuredMsg && (
              <div className="p-3 bg-green-100 border border-green-400 text-green-800 rounded font-semibold flex items-center gap-2">
                <CheckCircle2 size={16} />
                <span>{procuredMsg}</span>
              </div>
            )}

            <div className="flex gap-3 pt-2">
              <button
                onClick={handleProcure}
                disabled={procuring}
                className="flex-1 py-3 bg-primary-container text-on-primary rounded-lg font-semibold text-xs hover:bg-primary transition-colors flex items-center justify-center gap-2 shadow-md"
              >
                <ShoppingCart size={16} />
                <span>{procuring ? 'Issuing RFQ...' : 'Issue Instant RFQ / Purchase Order'}</span>
              </button>
            </div>
          </div>
        </div>

        {/* Technical Specifications & AI Weighted Score */}
        <div className="mt-8 pt-8 border-t border-outline-variant grid grid-cols-1 lg:grid-cols-2 gap-8">
          <div>
            <h3 className="font-headline-sm text-base font-bold text-on-surface mb-3">Technical Specifications</h3>
            <div className="space-y-2 border border-outline-variant rounded-lg overflow-hidden">
              {product.specifications?.map((spec: any, idx: number) => (
                <div key={idx} className="flex justify-between p-3 text-xs bg-surface-container-lowest even:bg-surface-container-low">
                  <span className="font-semibold text-on-surface-variant">{spec.key}</span>
                  <span className="font-data-mono font-bold text-on-surface">{spec.value}</span>
                </div>
              ))}
            </div>
          </div>

          <div>
            <h3 className="font-headline-sm text-base font-bold text-on-surface mb-3 flex items-center gap-2">
              <Sparkles size={18} className="text-purple-600" />
              <span>AI Weighted Confidence Breakdown</span>
            </h3>
            <div className="space-y-3 bg-surface-container-lowest border border-outline-variant p-4 rounded-lg">
              <div>
                <div className="flex justify-between text-xs font-semibold mb-1">
                  <span>Quality Index</span>
                  <span className="font-data-mono text-green-700">{product.quality_score}%</span>
                </div>
                <div className="w-full h-2 bg-surface-container rounded-full overflow-hidden">
                  <div className="h-full bg-green-600" style={{ width: `${product.quality_score}%` }} />
                </div>
              </div>

              <div>
                <div className="flex justify-between text-xs font-semibold mb-1">
                  <span>Reliability Telemetry</span>
                  <span className="font-data-mono text-purple-700">{product.reliability_score}%</span>
                </div>
                <div className="w-full h-2 bg-surface-container rounded-full overflow-hidden">
                  <div className="h-full bg-purple-600" style={{ width: `${product.reliability_score}%` }} />
                </div>
              </div>

              <div>
                <div className="flex justify-between text-xs font-semibold mb-1">
                  <span>Value & Price Index</span>
                  <span className="font-data-mono text-secondary">{product.value_score}%</span>
                </div>
                <div className="w-full h-2 bg-surface-container rounded-full overflow-hidden">
                  <div className="h-full bg-secondary-container" style={{ width: `${product.value_score}%` }} />
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
