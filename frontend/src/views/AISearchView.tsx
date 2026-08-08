"use client";

import React, { useEffect, useState } from 'react';
import { Search, Filter, Sparkles, ArrowRightLeft, ShieldCheck, ShoppingCart, Heart, ChevronLeft, ChevronRight } from 'lucide-react';
import { getProducts } from '../lib/api';

interface AISearchViewProps {
  onCompareToggle: (product: any) => void;
  compareList: any[];
  onSelectProduct: (product: any) => void;
}

const ITEMS_PER_PAGE = 24;

export default function AISearchView({
  onCompareToggle,
  compareList,
  onSelectProduct
}: AISearchViewProps) {
  const [products, setProducts] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);
  const [query, setQuery] = useState('');
  const [category, setCategory] = useState('');
  const [material, setMaterial] = useState('');
  const [favorites, setFavorites] = useState<number[]>([]);
  const [currentPage, setCurrentPage] = useState(1);

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
    } finally {
      setLoading(false);
    }
  };

  const handleSearch = async (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    setLoading(true);
    try {
      const params: Record<string, string> = {};
      if (query) params.query = query;
      if (category) params.category = category;
      if (material) params.material = material;
      const res = await getProducts(params);
      setProducts(res || []);
      setCurrentPage(1);
    } catch (err) {
      console.log('Error executing search');
    } finally {
      setLoading(false);
    }
  };

  const toggleFavorite = (id: number, e: React.MouseEvent) => {
    e.stopPropagation();
    if (favorites.includes(id)) {
      setFavorites(favorites.filter(favId => favId !== id));
    } else {
      setFavorites([...favorites, id]);
    }
  };

  // Pagination logic
  const totalItems = products.length;
  const totalPages = Math.ceil(totalItems / ITEMS_PER_PAGE) || 1;
  const startIndex = (currentPage - 1) * ITEMS_PER_PAGE;
  const endIndex = Math.min(startIndex + ITEMS_PER_PAGE, totalItems);
  const paginatedProducts = products.slice(startIndex, endIndex);

  return (
    <div className="space-y-6 font-body-md">
      {/* Header Banner */}
      <div className="bg-surface-container-lowest border border-outline-variant rounded-xl p-4 sm:p-6 shadow-sm flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div>
          <h1 className="font-headline-sm text-lg sm:text-xl font-bold text-on-surface flex items-center gap-2">
            <Sparkles className="text-purple-600" size={20} />
            <span>AI Product Intelligence Catalog</span>
          </h1>
          <p className="font-body-md text-xs text-on-surface-variant mt-1">
            Semantic search across 500+ verified industrial SKUs, suppliers, and telemetry scores.
          </p>
        </div>
        <div className="flex items-center gap-2 text-xs font-data-mono bg-purple-50 text-purple-800 px-3 py-1.5 rounded-lg border border-purple-200">
          <span className="w-2 h-2 rounded-full bg-purple-600 animate-ping" />
          <span>{products.length} Verified SKUs Active</span>
        </div>
      </div>

      {/* Main Search & Filter Control Panel */}
      <div className="bg-surface-container-lowest border border-outline-variant rounded-xl p-4 space-y-4 shadow-sm">
        <form onSubmit={handleSearch} className="flex flex-col sm:flex-row gap-3">
          <div className="flex-1 relative">
            <Search className="absolute left-3 top-3 text-on-surface-variant" size={18} />
            <input
              type="text"
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder="Search by SKU, technical specification, pump capacity, or supplier name..."
              className="w-full pl-10 pr-4 py-2.5 bg-surface border border-outline-variant rounded-lg text-xs focus:outline-none focus:border-secondary transition-colors"
            />
          </div>
          <button
            type="submit"
            className="px-6 py-2.5 bg-primary-container text-on-primary rounded-lg text-xs font-semibold hover:bg-primary transition-colors flex items-center justify-center gap-2"
          >
            <Search size={16} />
            <span>Run AI Search</span>
          </button>
        </form>

        {/* Dropdown Filters */}
        <div className="flex flex-wrap items-center gap-3 pt-2 border-t border-outline-variant text-xs">
          <div className="flex items-center gap-1.5 text-on-surface-variant font-semibold">
            <Filter size={14} />
            <span>Filters:</span>
          </div>

          <select
            value={category}
            onChange={(e) => setCategory(e.target.value)}
            className="bg-surface border border-outline-variant rounded px-3 py-1.5 text-xs text-on-surface focus:outline-none"
          >
            <option value="">All Categories</option>
            <option value="Pumps">Pumps</option>
            <option value="Valves">Valves</option>
            <option value="Motors">Motors</option>
            <option value="Bearings">Bearings</option>
            <option value="Compressors">Compressors</option>
            <option value="Sensors">Sensors</option>
            <option value="Controllers">Controllers</option>
            <option value="Robotics">Robotics</option>
          </select>

          <select
            value={material}
            onChange={(e) => setMaterial(e.target.value)}
            className="bg-surface border border-outline-variant rounded px-3 py-1.5 text-xs text-on-surface focus:outline-none"
          >
            <option value="">All Materials</option>
            <option value="Stainless Steel 316">Stainless Steel 316</option>
            <option value="Cast Iron GG25">Cast Iron GG25</option>
            <option value="Carbon Steel A216">Carbon Steel A216</option>
            <option value="Aluminum Alloy">Aluminum Alloy</option>
            <option value="Titanium Grade 2">Titanium Grade 2</option>
            <option value="Brass / Bronze">Brass / Bronze</option>
          </select>

          {(category || material || query) && (
            <button
              onClick={() => { setCategory(''); setMaterial(''); setQuery(''); loadProducts(); }}
              className="text-xs text-purple-700 hover:underline font-semibold ml-auto"
            >
              Reset All Filters
            </button>
          )}
        </div>
      </div>

      {/* Catalog Grid View */}
      {loading ? (
        <div className="py-20 text-center space-y-3">
          <div className="w-8 h-8 border-4 border-secondary border-t-transparent rounded-full animate-spin mx-auto" />
          <p className="text-xs font-semibold text-on-surface-variant">Scanning 500+ industrial SKUs with AI scoring engine...</p>
        </div>
      ) : paginatedProducts.length === 0 ? (
        <div className="py-16 text-center bg-surface-container-lowest border border-outline-variant rounded-xl">
          <p className="text-sm font-bold text-on-surface">No matching industrial products found.</p>
          <p className="text-xs text-on-surface-variant mt-1">Try resetting your filter parameters or search term.</p>
        </div>
      ) : (
        <div className="space-y-6">
          <div className="flex justify-between items-center text-xs text-on-surface-variant font-data-mono">
            <span>Showing {startIndex + 1}-{endIndex} of {totalItems} SKUs</span>
            <span>Page {currentPage} of {totalPages}</span>
          </div>

          {/* Product Cards Bento Grid */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
            {paginatedProducts.map((p) => {
              const isCompared = compareList.some(item => item.id === p.id);
              const isFav = favorites.includes(p.id);

              return (
                <div
                  key={p.id}
                  onClick={() => onSelectProduct(p)}
                  className={`bg-surface-container-lowest border rounded-lg overflow-hidden flex flex-col cursor-pointer transition-all duration-200 hover:-translate-y-1 hover:shadow-lg relative ${
                    p.ai_score >= 93 ? 'border-t-2 border-t-purple-500 border-x border-b border-outline-variant' : 'border-outline-variant'
                  }`}
                >
                  {p.ai_score >= 93 && (
                    <div className="absolute top-2 right-2 z-10">
                      <span className="bg-purple-900/90 text-purple-200 backdrop-blur-md text-[10px] font-bold px-2 py-0.5 rounded-full uppercase tracking-wider flex items-center gap-1 border border-purple-400 shadow-sm">
                        <Sparkles size={10} /> AI Recommended
                      </span>
                    </div>
                  )}

                  {/* AI Generated Realistic Photo Header */}
                  <div className="h-44 bg-surface-container-high relative overflow-hidden group">
                    <img
                      src={p.image_url || 'https://images.unsplash.com/photo-1581092160607-ee22621dd758?auto=format&fit=crop&w=600&q=80'}
                      alt={p.name}
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/30 to-transparent p-3 flex flex-col justify-end">
                      <span className="text-[10px] font-data-mono text-white/80 font-bold">{p.sku}</span>
                      <span className="text-xs font-bold text-white tracking-wide">{p.category}</span>
                    </div>
                  </div>

                  <div className="p-4 flex-1 flex flex-col justify-between text-xs space-y-3">
                    <div>
                      <div className="flex justify-between items-start">
                        <p className="font-data-mono text-[10px] text-on-surface-variant truncate max-w-[160px]">{p.supplier_name}</p>
                        <span className="text-[10px] font-semibold text-purple-700">{p.material}</span>
                      </div>
                      <h4 className="font-semibold text-sm text-on-surface leading-tight mt-1 line-clamp-2">{p.name}</h4>
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
                        className="flex-1 py-2 bg-primary-container text-on-primary rounded font-semibold text-xs hover:bg-primary transition-colors flex items-center justify-center gap-1"
                      >
                        <ShoppingCart size={14} />
                        <span>Inspect Product</span>
                      </button>
                      <button
                        onClick={() => onCompareToggle(p)}
                        className={`p-2 border rounded transition-colors ${
                          isCompared ? 'bg-purple-100 border-purple-500 text-purple-800 font-bold' : 'border-outline-variant hover:bg-surface-container'
                        }`}
                        title="Compare Product"
                      >
                        <ArrowRightLeft size={14} />
                      </button>
                      <button
                        onClick={(e) => toggleFavorite(p.id, e)}
                        className={`p-2 border rounded transition-colors ${
                          isFav ? 'bg-red-100 border-red-400 text-red-600' : 'border-outline-variant hover:bg-surface-container'
                        }`}
                        title="Save Favorite"
                      >
                        <Heart size={14} fill={isFav ? "currentColor" : "none"} />
                      </button>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>

          {/* Pagination Bar */}
          {totalPages > 1 && (
            <div className="flex justify-center items-center gap-2 pt-6">
              <button
                onClick={() => setCurrentPage(prev => Math.max(prev - 1, 1))}
                disabled={currentPage === 1}
                className="p-2 border border-outline-variant rounded disabled:opacity-40 hover:bg-surface-container-low transition-colors"
              >
                <ChevronLeft size={16} />
              </button>
              <div className="flex items-center gap-1 max-w-full overflow-x-auto no-scrollbar px-2 py-1">
                {Array.from({ length: totalPages }, (_, idx) => idx + 1).map((page) => (
                  <button
                    key={page}
                    onClick={() => setCurrentPage(page)}
                    className={`w-8 h-8 rounded text-xs font-semibold font-data-mono transition-colors shrink-0 ${
                      currentPage === page
                        ? 'bg-primary-container text-on-primary shadow-sm'
                        : 'bg-surface border border-outline-variant hover:bg-surface-container-low'
                    }`}
                  >
                    {page}
                  </button>
                ))}
              </div>
              <button
                onClick={() => setCurrentPage(prev => Math.min(prev + 1, totalPages))}
                disabled={currentPage === totalPages}
                className="p-2 border border-outline-variant rounded disabled:opacity-40 hover:bg-surface-container-low transition-colors"
              >
                <ChevronRight size={16} />
              </button>
            </div>
          )}
        </div>
      )}
    </div>
  );
}
