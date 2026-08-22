"use client";

import React, { useState } from 'react';
import {
  Search,
  Bot,
  Bell,
  HelpCircle,
  User,
  Sparkles,
  X,
  CheckCircle2,
  AlertTriangle,
  Menu,
  Mic,
  QrCode,
  BookOpen,
  ChevronRight,
  ShieldCheck
} from 'lucide-react';

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
    { id: 1, title: '252 Delivery Export Ready', msg: 'Batch of 1,000 SKUs successfully enriched and ready for CSV/XLSX download.', type: 'success', time: '2m ago', read: false },
    { id: 2, title: 'Price Volatility Alert', msg: '3 products in your procurement pipeline experienced price adjustments.', type: 'warning', time: '15m ago', read: false },
    { id: 3, title: 'Digital ID Access Verified', msg: 'Ranjeet Kumar (Team Leader) authenticated at Facility Gate 01.', type: 'success', time: '1h ago', read: true }
  ]);

  const markAllRead = () => {
    setNotifications(notifications.map(n => ({ ...n, read: true })));
  };

  const unreadCount = notifications.filter(n => !n.read).length;

  const tabLabels: Record<string, { label: string; badge?: string; color?: string }> = {
    'dashboard': { label: 'Overview & Telemetry' },
    'enrichment': { label: 'Catalog Intelligence & Enrichment', badge: 'UNILOG 252', color: 'bg-violet-500/15 text-violet-400 border-violet-500/30' },
    'id-card': { label: 'Digital ID & QR Access Badges', badge: 'QR SECURITY', color: 'bg-emerald-500/15 text-emerald-400 border-emerald-500/30' },
    'wiki': { label: 'Technical Documentation & Wiki', badge: 'WIKI HUB', color: 'bg-cyan-500/15 text-cyan-400 border-cyan-500/30' },
    'docs': { label: 'Technical Documentation & Wiki', badge: 'WIKI HUB', color: 'bg-cyan-500/15 text-cyan-400 border-cyan-500/30' },
    'search': { label: 'AI Semantic Product Search', badge: 'AI SEARCH', color: 'bg-purple-500/15 text-purple-400 border-purple-500/30' },
    'product-intel': { label: 'Product Intelligence & Analytics' },
    'recommendations': { label: 'AI Recommendations' },
    'compare': { label: 'Component Comparison Matrix' },
    'procurement': { label: 'Procurement & RFQ Workspace' },
    'orders': { label: 'Purchase Orders & Tracking' },
    'suppliers': { label: 'Supplier Risk & SLA Directory' },
    'favorites': { label: 'Saved Products & Watchlist' },
    'analytics': { label: 'Executive Spend Analytics' },
    'reports': { label: 'Procurement Reports & Audit' },
    '3d-facility': { label: '3D Supply Chain Facility Twin', badge: 'WEBGL 3D', color: 'bg-blue-500/15 text-blue-400 border-blue-500/30' },
    'copilot': { label: 'AI Voice & Text Copilot' },
    'admin': { label: 'Admin Suite & System Diagnostics' },
    'profile': { label: 'Personnel Profile & Security' },
    'help': { label: 'Help & Knowledge Center' }
  };

  const currentTabInfo = tabLabels[currentTab] || { label: currentTab.replace('-', ' ') };

  return (
    <header
      className={`fixed top-0 right-0 h-16 bg-surface/90 backdrop-blur-md border-b border-outline-variant/40 flex justify-between items-center px-3 sm:px-5 z-30 font-body-md transition-all duration-300 w-full shadow-sm ${
        isCollapsed ? 'md:w-[calc(100%-72px)]' : 'md:w-[calc(100%-260px)]'
      }`}
    >
      {/* Left: Mobile Toggle, Desktop Toggle, and Global Search */}
      <div className="flex items-center gap-2 md:gap-3 flex-1 max-w-xl">
        {/* Mobile Menu Button */}
        <button
          onClick={onToggleMobileMenu}
          className="md:hidden p-2 text-on-surface-variant hover:bg-surface-container-high rounded-xl transition-colors shrink-0"
          title="Open Menu"
        >
          <Menu size={20} />
        </button>

        {/* Desktop Collapse Toggle Button */}
        <button
          onClick={onToggleCollapse}
          className="hidden md:flex p-2 text-on-surface-variant hover:bg-surface-container-high rounded-xl transition-colors shrink-0"
          title={isCollapsed ? "Expand Sidebar" : "Collapse Sidebar"}
        >
          <Menu size={20} />
        </button>

        {/* Search & Voice Capsule Bar */}
        <div className="flex items-center gap-1.5 w-full max-w-md">
          <button
            onClick={onOpenSearch}
            className="flex-1 flex items-center justify-between px-3.5 py-2 bg-surface-container-low/90 hover:bg-surface-container border border-outline-variant/50 hover:border-violet-500/60 rounded-xl transition-all text-xs text-on-surface-variant group shadow-inner"
          >
            <div className="flex items-center gap-2 truncate">
              <Search size={15} className="text-on-surface-variant group-hover:text-violet-400 shrink-0 transition-colors" />
              <span className="hidden sm:inline font-medium">Search products, suppliers, orders…</span>
              <span className="sm:hidden font-medium">Search…</span>
            </div>
            <kbd className="hidden sm:inline-flex items-center px-1.5 py-0.5 text-[10px] font-mono bg-surface border border-outline-variant/60 rounded-md text-on-surface-variant shadow-sm">
              Ctrl+K
            </kbd>
          </button>

          {/* Voice Search Mic Button */}
          <button
            onClick={onToggleCopilot}
            className="p-2 bg-gradient-to-r from-violet-600 to-indigo-600 hover:from-violet-500 hover:to-indigo-500 text-white rounded-xl transition-all shadow-sm shrink-0 hover:scale-105"
            title="AI Voice Assistant (Hindi / English)"
          >
            <Mic size={16} />
          </button>
        </div>
      </div>

      {/* Middle: Active Screen Breadcrumb */}
      <div className="hidden lg:flex items-center gap-2 px-3">
        <span className="text-[11px] font-bold text-on-surface-variant">IndustrialIQ</span>
        <ChevronRight size={13} className="text-on-surface-variant/40" />
        <span className="text-xs font-bold text-on-surface truncate max-w-[200px]">
          {currentTabInfo.label}
        </span>
        {currentTabInfo.badge && (
          <span className={`px-2 py-0.5 rounded-full text-[9px] font-mono font-bold border ${currentTabInfo.color}`}>
            {currentTabInfo.badge}
          </span>
        )}
      </div>

      {/* Right: Quick Action Pills, Notifications & Profile */}
      <div className="flex items-center gap-1.5 sm:gap-2 relative shrink-0">
        {/* Quick Nav Shortcuts */}
        <button
          onClick={() => setCurrentTab('enrichment')}
          className={`hidden xl:flex items-center gap-1 px-2.5 py-1 rounded-lg text-xs font-bold transition-all border ${
            currentTab === 'enrichment'
              ? 'bg-violet-500/20 text-violet-400 border-violet-500/50 shadow-sm'
              : 'bg-surface-container-low text-on-surface-variant hover:text-on-surface border-outline-variant/40'
          }`}
          title="Catalog Enrichment Pipeline"
        >
          <Sparkles size={13} className="text-violet-400" />
          <span>Enrichment</span>
        </button>

        <button
          onClick={() => setCurrentTab('id-card')}
          className={`hidden xl:flex items-center gap-1 px-2.5 py-1 rounded-lg text-xs font-bold transition-all border ${
            currentTab === 'id-card'
              ? 'bg-emerald-500/20 text-emerald-400 border-emerald-500/50 shadow-sm'
              : 'bg-surface-container-low text-on-surface-variant hover:text-on-surface border-outline-variant/40'
          }`}
          title="Digital ID Badge System"
        >
          <QrCode size={13} className="text-emerald-400" />
          <span>ID Card</span>
        </button>

        <button
          onClick={() => setCurrentTab('wiki')}
          className={`hidden xl:flex items-center gap-1 px-2.5 py-1 rounded-lg text-xs font-bold transition-all border ${
            currentTab === 'wiki'
              ? 'bg-cyan-500/20 text-cyan-400 border-cyan-500/50 shadow-sm'
              : 'bg-surface-container-low text-on-surface-variant hover:text-on-surface border-outline-variant/40'
          }`}
          title="System Wiki & Docs"
        >
          <BookOpen size={13} className="text-cyan-400" />
          <span>Wiki</span>
        </button>

        {/* AI Voice Copilot Button */}
        <button
          onClick={onToggleCopilot}
          className="flex items-center gap-1.5 px-2.5 sm:px-3 py-1.5 rounded-xl bg-gradient-to-r from-violet-600/15 via-purple-600/15 to-indigo-600/15 text-violet-400 hover:text-violet-300 border border-violet-500/30 hover:border-violet-500/60 transition-all text-xs font-bold shadow-sm"
          title="Open AI Voice Copilot"
        >
          <Bot size={15} className="text-violet-400 animate-pulse" />
          <span className="hidden sm:inline">AI Copilot</span>
        </button>

        {/* Notifications Tray */}
        <div className="relative">
          <button
            onClick={() => setShowNotifications(!showNotifications)}
            className="p-2 text-on-surface-variant hover:text-on-surface hover:bg-surface-container-high rounded-xl transition-colors relative"
            title="Notifications"
          >
            <Bell size={18} />
            {unreadCount > 0 && (
              <span className="absolute top-1.5 right-1.5 w-2 h-2 rounded-full bg-violet-500 animate-ping" />
            )}
          </button>

          {/* Notifications Dropdown */}
          {showNotifications && (
            <div className="absolute right-0 mt-2 w-72 sm:w-80 bg-surface-container-lowest border border-outline-variant/60 rounded-2xl shadow-2xl p-4 z-50 animate-fade-in">
              <div className="flex items-center justify-between border-b border-outline-variant/30 pb-2 mb-3">
                <div className="flex items-center gap-1.5">
                  <h4 className="font-bold text-xs text-on-surface">Notifications</h4>
                  {unreadCount > 0 && (
                    <span className="px-1.5 py-0.2 rounded-full text-[9px] font-bold bg-violet-500 text-white">
                      {unreadCount}
                    </span>
                  )}
                </div>
                <button onClick={markAllRead} className="text-[10px] text-violet-400 font-semibold hover:underline">
                  Mark all read
                </button>
              </div>

              <div className="space-y-2 max-h-64 overflow-y-auto">
                {notifications.map((n) => (
                  <div
                    key={n.id}
                    className={`p-2.5 rounded-xl border text-xs transition-all ${
                      n.read ? 'bg-surface-container/50 border-outline-variant/20 opacity-75' : 'bg-surface-container border-violet-500/30'
                    }`}
                  >
                    <div className="flex items-center justify-between font-bold mb-1 text-on-surface">
                      <div className="flex items-center gap-1.5">
                        {n.type === 'warning' ? (
                          <AlertTriangle size={14} className="text-amber-400 shrink-0" />
                        ) : (
                          <CheckCircle2 size={14} className="text-emerald-400 shrink-0" />
                        )}
                        <span className="text-[11px] truncate">{n.title}</span>
                      </div>
                      <span className="text-[9px] text-on-surface-variant font-mono">{n.time}</span>
                    </div>
                    <p className="text-[10px] text-on-surface-variant leading-tight">{n.msg}</p>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>

        {/* User Profile Capsule */}
        <button
          onClick={() => setCurrentTab('profile')}
          className="flex items-center gap-2 pl-1.5 pr-2.5 py-1 bg-surface-container hover:bg-surface-container-high border border-outline-variant/40 rounded-xl transition-all text-xs font-semibold text-on-surface shadow-sm"
          title="Personnel Profile"
        >
          <div className="w-6 h-6 rounded-lg bg-gradient-to-br from-violet-600 to-indigo-600 text-white flex items-center justify-center font-bold text-[11px] shadow-sm">
            R
          </div>
          <span className="hidden md:inline font-bold">Ranjeet</span>
        </button>
      </div>
    </header>
  );
}
