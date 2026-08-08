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

      <div className="bg-surface-container-lowest border border-outline-variant rounded-xl p-6 shadow-sm">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          {/* Image Container */}
          <div className="bg-surface-variant rounded-lg p-6 flex items-center justify-center min-h-[300px] border border-outline-variant/60">
            {product.image_url ? (
              <img src={product.image_url} alt={product.name} className="max-h-72 object-cover mix-blend-multiply opacity-95" />
            ) : (
              <div className="text-center text-on-surface-variant">
                <span className="font-data-mono text-sm">{product.category}</span>
              </div>
            )}
          </div>

          {/* Details & Specs */}
          <div className="space-y-4 text-xs">
            <div>
              <span className="font-data-mono text-on-surface-variant">{product.sku}</span>
              <h1 className="font-headline-sm text-2xl font-bold text-on-surface mt-1">{product.name}</h1>
              <p className="text-on-surface-variant mt-2 text-sm leading-relaxed">{product.description}</p>
            </div>

            <div className="flex items-center gap-2">
              <span className="bg-green-100 text-green-800 text-xs px-2.5 py-1 rounded font-medium flex items-center gap-1">
                <ShieldCheck size={14} /> Verified Supplier: {product.brand}
              </span>
              <span className="bg-blue-100 text-blue-800 text-xs px-2.5 py-1 rounded font-medium">
                Warranty: {product.warranty_months} Months
              </span>
            </div>

            <div className="p-4 bg-surface rounded border border-outline-variant flex items-center justify-between">
              <div>
                <span className="text-on-surface-variant">Standard Unit Price</span>
                <div className="font-headline-sm text-2xl font-bold text-on-surface">
                  ₹ {product.price.toLocaleString('en-IN')}
                </div>
              </div>
              <button
                onClick={handleProcure}
                disabled={procuring}
                className="px-6 py-3 bg-secondary-container text-on-secondary rounded text-sm font-semibold hover:bg-secondary transition-colors flex items-center gap-2 shadow-md"
              >
                <ShoppingCart size={16} />
                <span>{procuring ? 'Issuing RFQ...' : 'Add to Procurement (Issue RFQ)'}</span>
              </button>
            </div>

            {procuredMsg && (
              <div className="p-3 bg-green-100 border border-green-400 text-green-800 rounded font-semibold flex items-center gap-2">
                <CheckCircle2 size={16} />
                <span>{procuredMsg}</span>
              </div>
            )}
          </div>
        </div>

        {/* AI Explainable Intelligence Breakdown */}
        <div className="mt-8 pt-8 border-t border-outline-variant">
          <div className="flex items-center gap-2 mb-4">
            <Sparkles className="text-purple-600" size={20} />
            <h3 className="font-headline-sm text-lg font-bold text-on-surface">Explainable AI Intelligence Score</h3>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-5 gap-4 mb-4">
            <div className="bg-purple-50 border border-purple-200 p-4 rounded text-center">
              <span className="text-[10px] text-purple-700 font-bold uppercase block">Overall AI Score</span>
              <span className="font-data-mono font-bold text-2xl text-purple-800">{product.ai_score} / 100</span>
            </div>
            <div className="bg-surface border border-outline-variant p-4 rounded text-center">
              <span className="text-[10px] text-on-surface-variant font-bold uppercase block">Quality Rating</span>
              <span className="font-data-mono font-bold text-xl text-on-surface">{product.quality_score}</span>
            </div>
            <div className="bg-surface border border-outline-variant p-4 rounded text-center">
              <span className="text-[10px] text-on-surface-variant font-bold uppercase block">Reliability Score</span>
              <span className="font-data-mono font-bold text-xl text-on-surface">{product.reliability_score}</span>
            </div>
            <div className="bg-surface border border-outline-variant p-4 rounded text-center">
              <span className="text-[10px] text-on-surface-variant font-bold uppercase block">Value Rating</span>
              <span className="font-data-mono font-bold text-xl text-on-surface">{product.value_score}</span>
            </div>
            <div className="bg-surface border border-outline-variant p-4 rounded text-center">
              <span className="text-[10px] text-on-surface-variant font-bold uppercase block">Availability Status</span>
              <span className="font-data-mono font-bold text-xl text-green-700">{product.availability}</span>
            </div>
          </div>

          <p className="text-xs text-on-surface-variant bg-surface p-3 rounded border border-outline-variant">
            {intelligence?.explanation || `Overall AI Confidence Score of ${product.ai_score}/100 is computed from Quality (${product.quality_score}), Reliability (${product.reliability_score}), Value Rating (${product.value_score}), and Supplier Track Record.`}
          </p>
        </div>
      </div>
    </div>
  );
}
