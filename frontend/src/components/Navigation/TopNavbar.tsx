"use client";

import React, { useState } from 'react';
import { Search, Bot, Bell, HelpCircle, User, Sparkles, X, CheckCircle2, AlertTriangle } from 'lucide-react';

interface TopNavbarProps {
  onOpenSearch: () => void;
  onToggleCopilot: () => void;
  currentTab: string;
  setCurrentTab: (tab: string) => void;
}

export default function TopNavbar({ onOpenSearch, onToggleCopilot, currentTab, setCurrentTab }: TopNavbarProps) {
  const [showNotifications, setShowNotifications] = useState(false);
  const [notifications, setNotifications] = useState([
    { id: 1, title: 'Price Volatility Alert', msg: '3 products in your procurement pipeline experienced price increases.', type: 'warning', read: false },
    { id: 2, title: 'Quote Received', msg: 'Grundfos Pumps India Ltd submitted a quote for PO-2026-8849.', type: 'success', read: false }
  ]);

  const markAllRead = () => {
    setNotifications(notifications.map(n => ({ ...n, read: true })));
  };

  const unreadCount = notifications.filter(n => !n.read).length;

  return (
    <header className="fixed top-0 right-0 w-[calc(100%-260px)] h-16 bg-surface border-b border-outline-variant flex justify-between items-center px-6 z-30 font-body-md">
      {/* Global Search Trigger */}
      <div className="flex items-center gap-4 w-1/3">
        <button
          onClick={onOpenSearch}
          className="w-full flex items-center justify-between px-3 py-2 bg-surface-container-low border border-outline-variant rounded hover:border-secondary transition-all text-sm text-on-surface-variant group"
        >
          <div className="flex items-center gap-2">
            <Search size={16} className="text-on-surface-variant group-hover:text-secondary" />
            <span>Search products, suppliers, orders (Ctrl+K)</span>
          </div>
          <kbd className="px-1.5 py-0.5 text-[10px] font-data-mono bg-surface border border-outline-variant rounded">Ctrl+K</kbd>
        </button>
      </div>

      {/* Screen Title */}
      <div className="hidden lg:block text-center">
        <h2 className="font-headline-sm text-headline-sm font-bold text-on-surface capitalize">
          {currentTab.replace('-', ' ')}
        </h2>
      </div>

      {/* Actions */}
      <div className="flex items-center gap-3 relative">
        <button
          onClick={onToggleCopilot}
          className="flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-purple-500/10 text-purple-700 border border-purple-300 hover:bg-purple-500/20 transition-all text-xs font-semibold"
          title="Open AI Copilot"
        >
          <Sparkles size={14} className="text-purple-600 animate-pulse" />
          <span>AI Copilot</span>
        </button>

        {/* Notifications Button */}
        <div className="relative">
          <button
            onClick={() => setShowNotifications(!showNotifications)}
            className="p-2 text-on-surface-variant hover:bg-surface-container-low rounded-full transition-colors relative"
          >
            <Bell size={18} />
            {unreadCount > 0 && (
              <span className="absolute top-1 right-1 w-2 h-2 rounded-full bg-error animate-ping" />
            )}
          </button>

          {/* Notifications Dropdown */}
          {showNotifications && (
            <div className="absolute right-0 mt-2 w-80 bg-surface-container-lowest border border-outline-variant rounded-lg shadow-xl p-4 z-50">
              <div className="flex items-center justify-between border-b border-outline-variant pb-2 mb-3">
                <h4 className="font-semibold text-sm">Notifications</h4>
                <button onClick={markAllRead} className="text-[11px] text-secondary hover:underline">Mark all read</button>
              </div>
              <div className="space-y-3 max-h-64 overflow-y-auto">
                {notifications.map((n) => (
                  <div key={n.id} className={`p-2.5 rounded border text-xs ${n.read ? 'bg-surface opacity-75' : 'bg-surface-container-low border-secondary/30'}`}>
                    <div className="flex items-center gap-2 font-semibold mb-1 text-on-surface">
                      {n.type === 'warning' ? <AlertTriangle size={14} className="text-amber-500" /> : <CheckCircle2 size={14} className="text-green-600" />}
                      <span>{n.title}</span>
                    </div>
                    <p className="text-on-surface-variant">{n.msg}</p>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>

        <button onClick={() => setCurrentTab('landing')} className="p-2 text-on-surface-variant hover:bg-surface-container-low rounded-full">
          <HelpCircle size={18} />
        </button>

        {/* User Profile */}
        <button
          onClick={() => setCurrentTab('auth')}
          className="flex items-center gap-2 pl-2 pr-3 py-1 bg-primary-container text-on-primary rounded hover:bg-primary transition-colors text-xs"
        >
          <User size={16} />
          <span className="font-medium hidden sm:inline">Ranjeet (Procurement)</span>
        </button>
      </div>
    </header>
  );
}
