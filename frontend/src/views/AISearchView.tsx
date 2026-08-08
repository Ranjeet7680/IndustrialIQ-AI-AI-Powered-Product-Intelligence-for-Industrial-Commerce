"use client";

import React, { useState, useEffect } from 'react';
import { Sparkles, Search, Filter, Check, ArrowRightLeft, Heart, Info, Star, ShieldCheck, ChevronLeft, ChevronRight } from 'lucide-react';
import { getProducts, searchProducts, toggleFavorite } from '../lib/api';

interface AISearchViewProps {
  onCompareToggle: (prod: any) => void;
  compareList: any[];
  onSelectProduct: (prod: any) => void;
}

export default function AISearchView({ onCompareToggle, compareList, onSelectProduct }: AISearchViewProps) {
  const [query, setQuery] = useState('');
  const [products, setProducts] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);
  const [favorites, setFavorites] = useState<number[]>([]);
  const [currentPage, setCurrentPage] = useState<number>(1);
  const itemsPerPage = 24;

  // Filter states
  const [category, setCategory] = useState<string>('');
  const [material, setMaterial] = useState<string>('');

  useEffect(() => {
    loadProducts();
  }, [category, material]);

  const loadProducts = async () => {
    setLoading(true);
    try {
      const params: Record<string, string> = {};
      if (category) params.category = category;
      if (material) params.material = material;
      const res = await getProducts(params);
      setProducts(res || []);
      setCurrentPage(1);
    } catch (err) {
      console.log('Error loading products');
    } fontFinally: {
      setLoading(false);
    }
  };

  const handleSearch = async (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    setLoading(true);
    try {
      const res = await searchProducts(query);
      setProducts(res || []);
      setCurrentPage(1);
    } catch (err) {
      console.log('Search fallback');
    } finally {
      setLoading(false);
    }
  };

  const handleFavoriteClick = async (e: React.MouseEvent, id: number) => {
    e.stopPropagation();
    try {
      await toggleFavorite(id);
      if (favorites.includes(id)) {
        setFavorites(favorites.filter(f => f !== id));
      } else {
        setFavorites([...favorites, id]);
      }
    } catch (err) {
      if (favorites.includes(id)) {
        setFavorites(favorites.filter(f => f !== id));
      } else {
        setFavorites([...favorites, id]);
      }
    }
  };

  // Pagination calculation
  const totalPages = Math.ceil(products.length / itemsPerPage) || 1;
  const paginatedProducts = products.slice((currentPage - 1) * itemsPerPage, currentPage * itemsPerPage);

  return (
    <div className="space-y-6 font-body-md">
      {/* Header & Prompt Input */}
      <div>
        <h2 className="font-headline-md text-headline-md font-bold text-on-surface mb-2">What industrial product are you looking for?</h2>
        <form onSubmit={handleSearch} className="relative w-full max-w-4xl shadow-sm rounded-lg border border-purple-500/30 bg-surface focus-within:border-secondary-container focus-within:ring-2 focus-within:ring-secondary-container/20 transition-all overflow-hidden">
          <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none text-purple-600">
            <Sparkles size={20} />
          </div>
          <input
            type="text"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="e.g. Find stainless steel centrifugal pumps for high-pressure applications under ₹3 lakh."
            className="w-full pl-12 pr-24 py-4 bg-transparent border-none text-sm text-on-surface focus:ring-0 placeholder:text-on-surface-variant/60 outline-none"
          />
          <button
            type="submit"
            className="absolute right-2 top-1/2 -translate-y-1/2 bg-primary-container text-on-primary px-4 py-2 rounded text-xs font-semibold hover:bg-primary transition-colors flex items-center gap-1.5"
          >
            <Search size={14} />
            <span>AI Search</span>
          </button>
        </form>
        <p className="text-xs text-on-surface-variant mt-2 flex items-center gap-1">
          <Info size={14} /> Press <kbd className="px-1 border border-outline-variant rounded bg-surface-container font-data-mono text-[10px]">Enter</kbd> to initiate semantic AI intent matching.
        </p>
      </div>

      <div className="flex flex-col lg:flex-row gap-6">
        {/* Filters Sidebar */}
        <div className="w-full lg:w-64 shrink-0 space-y-6">
          <div className="bg-surface border border-outline-variant rounded-lg p-4 text-xs">
            <div className="flex items-center justify-between mb-4 border-b border-outline-variant pb-2">
              <h3 className="font-label-caps uppercase text-on-surface font-bold">Filters</h3>
              <button
                onClick={() => { setCategory(''); setMaterial(''); setQuery(''); loadProducts(); }}
                className="text-secondary text-xs hover:underline font-semibold"
              >
                Clear All
              </button>
            </div>

            {/* Filter Group: Category */}
            <div className="space-y-2 mb-6 border-b border-outline-variant pb-4">
              <h4 className="font-semibold text-on-surface">Category</h4>
              <label className="flex items-center gap-2 cursor-pointer text-on-surface-variant hover:text-on-surface">
                <input
                  type="radio"
                  name="category"
                  checked={category === ''}
                  onChange={() => setCategory('')}
                  className="text-secondary-container focus:ring-secondary-container"
                />
                <span className="font-medium">All Categories ({products.length})</span>
              </label>
              {['Pumps', 'Valves', 'Motors', 'Bearings', 'Compressors', 'Sensors', 'Controllers', 'Robotics'].map((cat) => (
                <label key={cat} className="flex items-center gap-2 cursor-pointer text-on-surface-variant hover:text-on-surface">
                  <input
                    type="radio"
                    name="category"
                    checked={category === cat}
                    onChange={() => setCategory(cat)}
                    className="text-secondary-container focus:ring-secondary-container"
                  />
                  <span>{cat}</span>
                </label>
              ))}
            </div>

            {/* Filter Group: Material */}
            <div className="space-y-2 mb-6 border-b border-outline-variant pb-4">
              <h4 className="font-semibold text-on-surface">Material Construction</h4>
              {['Stainless Steel 316', 'Cast Iron GG25', 'Carbon Steel A216', 'Aluminum Alloy', 'Titanium Grade 2'].map((mat) => (
                <label key={mat} className="flex items-center gap-2 cursor-pointer text-on-surface-variant hover:text-on-surface">
                  <input
                    type="radio"
                    name="material"
                    checked={material === mat}
                    onChange={() => setMaterial(mat)}
                    className="text-secondary-container focus:ring-secondary-container"
                  />
                  <span>{mat}</span>
                </label>
              ))}
            </div>
          </div>
        </div>

        {/* Results Area */}
        <div className="flex-1 space-y-4">
          <div className="flex justify-between items-center bg-surface-container-lowest border border-outline-variant p-3 rounded-lg">
            <h3 className="font-headline-sm text-sm font-semibold text-on-surface flex items-center gap-2">
              <Sparkles size={16} className="text-purple-600" />
              <span>AI matched {products.length} industrial SKUs</span>
            </h3>
            <div className="text-xs text-on-surface-variant font-data-mono">
              Page {currentPage} of {totalPages}
            </div>
          </div>

          {/* Product Cards Bento Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4">
            {paginatedProducts.map((p) => {
              const isCompared = compareList.some(item => item.id === p.id);
              const isFav = favorites.includes(p.id);

              return (
                <div
                  key={p.id}
                  onClick={() => onSelectProduct(p)}
                  className={`bg-surface-container-lowest border rounded-lg overflow-hidden flex flex-col cursor-pointer transition-all duration-200 hover:-translate-y-1 hover:shadow-md relative ${
                    p.ai_score >= 93 ? 'border-t-2 border-t-purple-500 border-x border-b border-outline-variant' : 'border-outline-variant'
                  }`}
                >
                  {p.ai_score >= 93 && (
                    <div className="absolute top-2 right-2 z-10">
                      <span className="bg-purple-100 text-purple-800 text-[10px] font-bold px-2 py-0.5 rounded-full uppercase tracking-wider flex items-center gap-1 border border-purple-200 shadow-sm">
                        <Sparkles size={10} /> AI Recommended
                      </span>
                    </div>
                  )}

                  <div className="h-40 bg-gradient-to-br from-primary-container to-secondary-container/20 relative flex items-center justify-center p-4">
                    <div className="text-center text-on-primary">
                      <span className="text-xs font-data-mono font-bold block opacity-80">{p.sku}</span>
                      <span className="text-sm font-bold block mt-1">{p.category}</span>
                    </div>
                  </div>

                  <div className="p-4 flex-1 flex flex-col justify-between text-xs space-y-3">
                    <div>
                      <div className="flex justify-between items-start">
                        <p className="font-data-mono text-[10px] text-on-surface-variant">{p.supplier_name}</p>
                        <span className="text-[10px] font-semibold text-purple-700">{p.material}</span>
                      </div>
                      <h4 className="font-semibold text-sm text-on-surface leading-tight mt-1">{p.name}</h4>
                      <p className="text-[11px] text-on-surface-variant mt-1 line-clamp-2">{p.description}</p>
                    </div>

                    <div className="flex items-center gap-2">
                      <span className="bg-green-100 text-green-800 text-[10px] px-2 py-0.5 rounded flex items-center gap-1 font-medium">
                        <ShieldCheck size={12} /> Verified Supplier
                      </span>
                    </div>

                    <div className="pt-2 border-t border-outline-variant flex items-end justify-between">
                      <div>
                        <p className="text-[10px] text-on-surface-variant">Unit Price</p>
                        <p className="font-headline-sm text-base font-bold text-on-surface">₹ {p.price.toLocaleString('en-IN')}</p>
                      </div>
                      <div className="text-right">
                        <span className="font-data-mono font-bold text-lg text-purple-600">{p.ai_score}</span>
                        <span className="text-[9px] uppercase font-bold text-on-surface-variant block">AI Match</span>
                      </div>
                    </div>

                    <div className="flex gap-2 pt-1" onClick={(e) => e.stopPropagation()}>
                      <button
                        onClick={() => onSelectProduct(p)}
                        className="flex-1 bg-secondary-container hover:bg-secondary text-on-secondary py-1.5 px-3 rounded font-semibold text-xs transition-colors shadow-sm"
                      >
                        View Details
                      </button>
                      <button
                        onClick={() => onCompareToggle(p)}
                        className={`p-1.5 rounded border transition-colors ${
                          isCompared ? 'bg-purple-100 border-purple-400 text-purple-800' : 'bg-surface border-outline-variant hover:bg-surface-container-low text-on-surface'
                        }`}
                        title="Compare"
                      >
                        <ArrowRightLeft size={16} />
                      </button>
                      <button
                        onClick={(e) => handleFavoriteClick(e, p.id)}
                        className={`p-1.5 rounded border transition-colors ${
                          isFav ? 'bg-red-50 border-red-300 text-red-600' : 'bg-surface border-outline-variant hover:bg-surface-container-low text-on-surface'
                        }`}
                        title="Favorite"
                      >
                        <Heart size={16} fill={isFav ? 'currentColor' : 'none'} />
                      </button>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>

          {/* Pagination Controls */}
          {totalPages > 1 && (
            <div className="flex justify-between items-center pt-4 border-t border-outline-variant">
              <button
                onClick={() => setCurrentPage(p => Math.max(p - 1, 1))}
                disabled={currentPage === 1}
                className="px-3 py-1.5 bg-surface-container border border-outline-variant rounded text-xs font-semibold text-on-surface disabled:opacity-50 flex items-center gap-1"
              >
                <ChevronLeft size={14} /> Previous
              </button>

              <div className="flex gap-1 text-xs">
                {Array.from({ length: Math.min(totalPages, 7) }, (_, idx) => idx + 1).map((pageNum) => (
                  <button
                    key={pageNum}
                    onClick={() => setCurrentPage(pageNum)}
                    className={`px-3 py-1 rounded font-data-mono font-bold ${
                      currentPage === pageNum ? 'bg-primary-container text-on-primary' : 'bg-surface border border-outline-variant text-on-surface hover:bg-surface-container'
                    }`}
                  >
                    {pageNum}
                  </button>
                ))}
                {totalPages > 7 && <span className="px-2 py-1 text-on-surface-variant">... {totalPages}</span>}
              </div>

              <button
                onClick={() => setCurrentPage(p => Math.min(p + 1, totalPages))}
                disabled={currentPage === totalPages}
                className="px-3 py-1.5 bg-surface-container border border-outline-variant rounded text-xs font-semibold text-on-surface disabled:opacity-50 flex items-center gap-1"
              >
                Next <ChevronRight size={14} />
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
