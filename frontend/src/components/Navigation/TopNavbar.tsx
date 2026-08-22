"use client";

import React, { useState } from 'react';
import { Search, Bot, Bell, HelpCircle, User, Sparkles, X, CheckCircle2, AlertTriangle, Menu, Mic } from 'lucide-react';

interface TopNavbarProps {
  onOpenSearch: () => void;
  onToggleCopilot: () => void;
  currentTab: string;
  setCurrentTab: (tab: string) => void;
  isCollapsed: boolean;
  onToggleCollapse: () => void;
  onToggleMobileMenu?: () => void;
}

export default function TopNavbar({
  onOpenSearch,
  onToggleCopilot,
  currentTab,
  setCurrentTab,
  isCollapsed,
  onToggleCollapse,
  onToggleMobileMenu
}: TopNavbarProps) {
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
    <header
      className={`fixed top-0 right-0 h-16 bg-surface border-b border-outline-variant flex justify-between items-center px-4 md:px-6 z-30 font-body-md transition-all duration-300 w-full ${
        isCollapsed ? 'md:w-[calc(100%-72px)]' : 'md:w-[calc(100%-260px)]'
      }`}
    >
      {/* Sidebar Toggle & Global Voice Search */}
      <div className="flex items-center gap-2 md:gap-3 flex-1 max-w-md">
        {/* Mobile Menu Button */}
        <button
          onClick={onToggleMobileMenu}
          className="md:hidden p-2 text-on-surface-variant hover:bg-surface-container-low rounded-lg transition-colors"
          title="Open Menu"
        >
          <Menu size={20} />
        </button>

        {/* Desktop Collapse Toggle Button */}
        <button
          onClick={onToggleCollapse}
          className="hidden md:flex p-2 text-on-surface-variant hover:bg-surface-container-low rounded-lg transition-colors"
          title={isCollapsed ? "Expand Sidebar" : "Collapse Sidebar"}
        >
          <Menu size={20} />
        </button>

        <div className="flex items-center gap-1.5 w-full">
          <button
            onClick={onOpenSearch}
            className="flex-1 flex items-center justify-between px-3 py-2 bg-surface-container-low border border-outline-variant rounded hover:border-secondary transition-all text-xs text-on-surface-variant group"
          >
            <div className="flex items-center gap-2">
              <Search size={16} className="text-on-surface-variant group-hover:text-secondary shrink-0" />
              <span className="hidden sm:inline">Search products, suppliers, orders (Ctrl+K)</span>
              <span className="sm:hidden">Search...</span>
            </div>
            <kbd className="hidden sm:inline-block px-1.5 py-0.5 text-[10px] font-data-mono bg-surface border border-outline-variant rounded">Ctrl+K</kbd>
          </button>

          {/* Voice Search Mic Button */}
          <button
            onClick={onToggleCopilot}
            className="p-2 bg-purple-600 text-white rounded hover:bg-purple-700 transition-colors shadow-sm shrink-0"
            title="AI Voice Search (Speak in Hindi/English)"
          >
            <Mic size={16} />
          </button>
        </div>
      </div>

      {/* Screen Title */}
      <div className="hidden xl:block text-center px-4">
        <h2 className="font-headline-sm text-sm font-bold text-on-surface capitalize truncate">
          {currentTab.replace('-', ' ')}
        </h2>
      </div>

      {/* Actions */}
      <div className="flex items-center gap-2 md:gap-3 relative shrink-0">
        <button
          onClick={onToggleCopilot}
          className="flex items-center gap-1.5 px-2.5 md:px-3 py-1.5 rounded-full bg-purple-500/10 text-purple-700 border border-purple-300 hover:bg-purple-500/20 transition-all text-xs font-semibold"
          title="Open AI Voice Copilot"
        >
          <Sparkles size={14} className="text-purple-600 animate-pulse" />
          <span className="hidden sm:inline">AI Voice Copilot</span>
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
            <div className="absolute right-0 mt-2 w-72 sm:w-80 bg-surface-container-lowest border border-outline-variant rounded-lg shadow-xl p-4 z-50">
              <div className="flex items-center justify-between border-b border-outline-variant pb-2 mb-3">
                <h4 className="font-semibold text-sm">Notifications</h4>
                <button onClick={markAllRead} className="text-[11px] text-secondary hover:underline">Mark all read</button>
              </div>
              <div className="space-y-3 max-h-64 overflow-y-auto">
                {notifications.map((n) => (
                  <div key={n.id} className={`p-2.5 rounded border text-xs ${n.read ? 'bg-surface opacity-75' : 'bg-surface-container-low border-secondary/30'}`}>
                    <div className="flex items-center gap-2 font-semibold mb-1 text-on-surface">
                      {n.type === 'warning' ? <AlertTriangle size={14} className="text-amber-500 shrink-0" /> : <CheckCircle2 size={14} className="text-green-600 shrink-0" />}
                      <span>{n.title}</span>
                    </div>
                    <p className="text-on-surface-variant">{n.msg}</p>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>

        <button
          onClick={() => setCurrentTab('help')}
          className="hidden sm:block p-2 text-on-surface-variant hover:bg-surface-container-low rounded-full"
          title="Help & Support Center"
        >
          <HelpCircle size={18} />
        </button>

        {/* User Profile */}
        <button
          onClick={() => setCurrentTab('profile')}
          className="flex items-center gap-2 pl-2 pr-3 py-1 bg-primary-container text-on-primary rounded hover:bg-primary transition-colors text-xs"
          title="View Profile"
        >
          <User size={16} />
          <span className="font-medium hidden md:inline">Ranjeet</span>
        </button>
      </div>
    </header>
  );
}
