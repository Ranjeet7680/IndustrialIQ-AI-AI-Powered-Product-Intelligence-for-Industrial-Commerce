"use client";

import React, { useState, useEffect } from 'react';
import { Search, X, Package, Factory, ShoppingBag, FileText, ArrowRight } from 'lucide-react';

interface CommandPaletteProps {
  isOpen: boolean;
  onClose: () => void;
  onSelectTab: (tab: string) => void;
}

export default function CommandPalette({ isOpen, onClose, onSelectTab }: CommandPaletteProps) {
  const [query, setQuery] = useState('');

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if ((e.ctrlKey || e.metaKey) && e.key === 'k') {
        e.preventDefault();
        if (isOpen) onClose();
        else {
          // Open signal handled in parent
        }
      }
      if (e.key === 'Escape' && isOpen) {
        onClose();
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isOpen, onClose]);

  if (!isOpen) return null;

  const mockItems = [
    { type: 'pipeline', title: 'Catalog Intelligence & Enrichment Engine (Unilog 252 Delivery)', category: 'Enrichment Pipeline', target: 'enrichment' },
    { type: 'pipeline', title: 'Single-Item Raw Description Normalization Sandbox', category: 'Enrichment Pipeline', target: 'enrichment' },
    { type: 'product', title: 'Grundfos CR 32-4 Vertical Multistage Pump', category: 'Pumps', target: 'search' },
    { type: 'product', title: 'KSB Movitec High Pressure Inline Pump', category: 'Pumps', target: 'search' },
    { type: 'supplier', title: 'Grundfos Pumps India Ltd', category: 'Supplier (Verified)', target: 'suppliers' },
    { type: 'supplier', title: 'Siemens Industrial Automation', category: 'Supplier (Verified)', target: 'suppliers' },
    { type: 'order', title: 'PO-2026-8849 (Centrifugal Pumps)', category: 'Purchase Order', target: 'orders' },
    { type: 'report', title: 'Q3 Industrial Procurement Risk Report', category: 'Reports', target: 'reports' }
  ];

  const filtered = query
    ? mockItems.filter(i => i.title.toLowerCase().includes(query.toLowerCase()) || i.category.toLowerCase().includes(query.toLowerCase()))
    : mockItems;

  const handleSelect = (target: string) => {
    onSelectTab(target);
    onClose();
  };

  return (
    <div className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50 flex items-start justify-center pt-24 px-4 font-body-md">
      <div className="bg-surface-container-lowest border border-outline-variant rounded-xl shadow-2xl w-full max-w-2xl overflow-hidden animate-in fade-in zoom-in-95 duration-150">
        <div className="flex items-center px-4 border-b border-outline-variant">
          <Search size={18} className="text-on-surface-variant mr-3" />
          <input
            autoFocus
            type="text"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Type a command or search products, suppliers, orders..."
            className="w-full py-4 bg-transparent outline-none text-sm text-on-surface placeholder:text-on-surface-variant/60"
          />
          <button onClick={onClose} className="p-1 hover:bg-surface-container rounded text-on-surface-variant">
            <X size={18} />
          </button>
        </div>

        <div className="p-2 max-h-80 overflow-y-auto">
          {filtered.length === 0 ? (
            <div className="p-8 text-center text-sm text-on-surface-variant">
              No matching entity found for "{query}".
            </div>
          ) : (
            <div className="space-y-1">
              {filtered.map((item, idx) => (
                <button
                  key={idx}
                  onClick={() => handleSelect(item.target)}
                  className="w-full flex items-center justify-between p-3 rounded hover:bg-surface-container-low transition-colors text-left group"
                >
                  <div className="flex items-center gap-3">
                    {item.type === 'product' && <Package size={16} className="text-secondary" />}
                    {item.type === 'supplier' && <Factory size={16} className="text-purple-600" />}
                    {item.type === 'order' && <ShoppingBag size={16} className="text-green-600" />}
                    {item.type === 'report' && <FileText size={16} className="text-amber-600" />}
                    <div>
                      <div className="font-medium text-sm text-on-surface group-hover:text-secondary transition-colors">{item.title}</div>
                      <div className="text-[11px] text-on-surface-variant font-data-mono">{item.category}</div>
                    </div>
                  </div>
                  <ArrowRight size={14} className="text-on-surface-variant opacity-0 group-hover:opacity-100 transition-opacity" />
                </button>
              ))}
            </div>
          )}
        </div>

        <div className="bg-surface-container p-2 px-4 border-t border-outline-variant flex justify-between items-center text-[11px] text-on-surface-variant">
          <span>Navigate with ⬆⬇ and press Enter</span>
          <kbd className="px-1.5 py-0.5 bg-surface border rounded font-data-mono">ESC to close</kbd>
        </div>
      </div>
    </div>
  );
}
