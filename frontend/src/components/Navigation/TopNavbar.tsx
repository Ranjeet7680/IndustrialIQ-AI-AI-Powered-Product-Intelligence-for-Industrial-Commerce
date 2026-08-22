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
  ShieldCheck,
  Zap
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
    'dashboard': { label: 'Overview & Analytics', badge: 'LIVE TELEMETRY', color: 'bg-indigo-500/20 text-indigo-300 border-indigo-500/40' },
    'enrichment': { label: 'Catalog Intelligence & Enrichment', badge: 'UNILOG 252 COLS', color: 'bg-violet-500/20 text-violet-300 border-violet-500/40 shadow-[0_0_10px_rgba(139,92,246,0.3)]' },
    'id-card': { label: 'Digital ID & QR Access Badges', badge: 'QR VERIFIED', color: 'bg-emerald-500/20 text-emerald-300 border-emerald-500/40 shadow-[0_0_10px_rgba(16,185,129,0.3)]' },
    'wiki': { label: 'Technical Documentation & Wiki', badge: 'WIKI HUB', color: 'bg-cyan-500/20 text-cyan-300 border-cyan-500/40 shadow-[0_0_10px_rgba(6,182,212,0.3)]' },
    'docs': { label: 'Technical Documentation & Wiki', badge: 'WIKI HUB', color: 'bg-cyan-500/20 text-cyan-300 border-cyan-500/40' },
    'search': { label: 'AI Semantic Product Search', badge: 'SEMANTIC AI', color: 'bg-purple-500/20 text-purple-300 border-purple-500/40' },
    'product-intel': { label: 'Product Intelligence & Market Trends' },
    'recommendations': { label: 'Predictive Recommendations' },
    'compare': { label: 'Component Comparison Matrix' },
    'procurement': { label: 'Procurement & RFQ Engine' },
    'orders': { label: 'Purchase Orders & Logistics' },
    'suppliers': { label: 'Supplier Intelligence & Risk Index' },
    'favorites': { label: 'Saved Products & Watchlist' },
    'analytics': { label: 'Executive Spend Analytics' },
    'reports': { label: 'Audit & Compliance Reports' },
    '3d-facility': { label: '3D Network Facility Twin', badge: 'WEBGL 3D', color: 'bg-blue-500/20 text-blue-300 border-blue-500/40' },
    'copilot': { label: 'AI Voice & NLP Copilot' },
    'admin': { label: 'Admin Suite & ML Operations' },
    'profile': { label: 'Personnel Profile & Security' },
    'help': { label: 'Help & Knowledge Center' }
  };

  const currentTabInfo = tabLabels[currentTab] || { label: currentTab.replace('-', ' ') };

  return (
    <header
      className={`fixed top-0 right-0 h-16 bg-[#090d16]/90 backdrop-blur-xl border-b border-violet-500/20 flex justify-between items-center px-3 sm:px-5 z-30 font-body-md transition-all duration-300 w-full shadow-lg ${
        isCollapsed ? 'md:w-[calc(100%-76px)]' : 'md:w-[calc(100%-265px)]'
      }`}
    >
      <style>{`
        @keyframes pulse-mic {
          0%, 100% { box-shadow: 0 0 10px rgba(6,182,212,0.5); }
          50% { box-shadow: 0 0 20px rgba(6,182,212,0.9); }
        }
        .mic-pulse {
          animation: pulse-mic 2s infinite;
        }
      `}</style>

      {/* Left: Mobile Toggle, Desktop Toggle, and Global Search */}
      <div className="flex items-center gap-2 md:gap-3 flex-1 max-w-xl">
        {/* Mobile Menu Button */}
        <button
          onClick={onToggleMobileMenu}
          className="md:hidden p-2 text-slate-300 hover:text-white hover:bg-slate-800/80 rounded-xl transition-colors shrink-0"
          title="Open Menu"
        >
          <Menu size={20} />
        </button>

        {/* Desktop Collapse Toggle Button */}
        <button
          onClick={onToggleCollapse}
          className="hidden md:flex p-2 text-slate-300 hover:text-white hover:bg-slate-800/80 rounded-xl transition-colors shrink-0"
          title={isCollapsed ? "Expand Sidebar" : "Collapse Sidebar"}
        >
          <Menu size={20} />
        </button>

        {/* Search & Voice Capsule Bar */}
        <div className="flex items-center gap-1.5 w-full max-w-md">
          <button
            onClick={onOpenSearch}
            className="flex-1 flex items-center justify-between px-3.5 py-2 bg-slate-900/90 hover:bg-slate-800/90 border border-violet-500/30 hover:border-violet-400 rounded-xl transition-all text-xs text-slate-300 group shadow-inner hover:shadow-[0_0_15px_rgba(139,92,246,0.2)]"
          >
            <div className="flex items-center gap-2 truncate">
              <Search size={15} className="text-violet-400 group-hover:text-cyan-300 shrink-0 transition-colors" />
              <span className="hidden sm:inline font-medium text-slate-300">Search products, suppliers, orders…</span>
              <span className="sm:hidden font-medium text-slate-300">Search…</span>
            </div>
            <kbd className="hidden sm:inline-flex items-center px-1.5 py-0.5 text-[10px] font-mono bg-slate-800 border border-slate-700 rounded-md text-violet-300 shadow-sm">
              Ctrl+K
            </kbd>
          </button>

          {/* Voice Search Mic Button */}
          <button
            onClick={onToggleCopilot}
            className="p-2 bg-gradient-to-r from-violet-600 via-indigo-600 to-cyan-500 hover:from-violet-500 hover:to-cyan-400 text-white rounded-xl transition-all shadow-md shrink-0 hover:scale-105 mic-pulse"
            title="AI Voice Assistant (Hindi / English)"
          >
            <Mic size={16} />
          </button>
        </div>
      </div>

      {/* Middle: Active Screen Breadcrumb */}
      <div className="hidden lg:flex items-center gap-2 px-3">
        <span className="text-[11px] font-bold text-slate-400">IndustrialIQ</span>
        <ChevronRight size={13} className="text-slate-600" />
        <span className="text-xs font-extrabold text-white truncate max-w-[200px]">
          {currentTabInfo.label}
        </span>
        {currentTabInfo.badge && (
          <span className={`px-2.5 py-0.5 rounded-full text-[9px] font-mono font-bold border ${currentTabInfo.color}`}>
            {currentTabInfo.badge}
          </span>
        )}
      </div>

      {/* Right: Quick Action Pills, Notifications & Profile */}
      <div className="flex items-center gap-1.5 sm:gap-2 relative shrink-0">
        {/* Quick Nav Shortcuts */}
        <button
          onClick={() => setCurrentTab('enrichment')}
          className={`hidden xl:flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-bold transition-all border ${
            currentTab === 'enrichment'
              ? 'bg-violet-600 text-white border-violet-400 shadow-[0_0_15px_rgba(139,92,246,0.5)]'
              : 'bg-slate-900/80 text-violet-300 hover:text-white hover:bg-violet-600/30 border-violet-500/30'
          }`}
          title="Catalog Enrichment Pipeline"
        >
          <Sparkles size={13} className="text-violet-400" />
          <span>Enrichment</span>
        </button>

        <button
          onClick={() => setCurrentTab('id-card')}
          className={`hidden xl:flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-bold transition-all border ${
            currentTab === 'id-card'
              ? 'bg-emerald-600 text-white border-emerald-400 shadow-[0_0_15px_rgba(16,185,129,0.5)]'
              : 'bg-slate-900/80 text-emerald-300 hover:text-white hover:bg-emerald-600/30 border-emerald-500/30'
          }`}
          title="Digital ID Badge System"
        >
          <QrCode size={13} className="text-emerald-400" />
          <span>ID Card</span>
        </button>

        <button
          onClick={() => setCurrentTab('wiki')}
          className={`hidden xl:flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-bold transition-all border ${
            currentTab === 'wiki'
              ? 'bg-cyan-600 text-white border-cyan-400 shadow-[0_0_15px_rgba(6,182,212,0.5)]'
              : 'bg-slate-900/80 text-cyan-300 hover:text-white hover:bg-cyan-600/30 border-cyan-500/30'
          }`}
          title="System Wiki & Docs"
        >
          <BookOpen size={13} className="text-cyan-400" />
          <span>Wiki</span>
        </button>

        {/* AI Voice Copilot Button */}
        <button
          onClick={onToggleCopilot}
          className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-gradient-to-r from-violet-600 via-indigo-600 to-cyan-500 hover:from-violet-500 hover:to-cyan-400 text-white transition-all text-xs font-bold shadow-[0_0_15px_rgba(139,92,246,0.4)] hover:scale-105"
          title="Open AI Voice Copilot"
        >
          <Bot size={15} className="text-white animate-pulse" />
          <span className="hidden sm:inline">AI Copilot</span>
        </button>

        {/* Notifications Tray */}
        <div className="relative">
          <button
            onClick={() => setShowNotifications(!showNotifications)}
            className="p-2 text-slate-300 hover:text-white hover:bg-slate-800/80 rounded-xl transition-colors relative"
            title="Notifications"
          >
            <Bell size={18} />
            {unreadCount > 0 && (
              <span className="absolute top-1.5 right-1.5 w-2 h-2 rounded-full bg-cyan-400 animate-ping" />
            )}
          </button>

          {/* Notifications Dropdown */}
          {showNotifications && (
            <div className="absolute right-0 mt-2 w-72 sm:w-80 bg-[#0f172a] border border-violet-500/40 rounded-2xl shadow-2xl p-4 z-50 animate-fade-in text-slate-200">
              <div className="flex items-center justify-between border-b border-slate-800 pb-2 mb-3">
                <div className="flex items-center gap-1.5">
                  <h4 className="font-bold text-xs text-white">Notifications</h4>
                  {unreadCount > 0 && (
                    <span className="px-1.5 py-0.2 rounded-full text-[9px] font-bold bg-violet-600 text-white">
                      {unreadCount}
                    </span>
                  )}
                </div>
                <button onClick={markAllRead} className="text-[10px] text-cyan-400 font-semibold hover:underline">
                  Mark all read
                </button>
              </div>

              <div className="space-y-2 max-h-64 overflow-y-auto">
                {notifications.map((n) => (
                  <div
                    key={n.id}
                    className={`p-2.5 rounded-xl border text-xs transition-all ${
                      n.read ? 'bg-slate-900/60 border-slate-800 opacity-75' : 'bg-slate-800/80 border-violet-500/40'
                    }`}
                  >
                    <div className="flex items-center justify-between font-bold mb-1 text-white">
                      <div className="flex items-center gap-1.5">
                        {n.type === 'warning' ? (
                          <AlertTriangle size={14} className="text-amber-400 shrink-0" />
                        ) : (
                          <CheckCircle2 size={14} className="text-emerald-400 shrink-0" />
                        )}
                        <span className="text-[11px] truncate">{n.title}</span>
                      </div>
                      <span className="text-[9px] text-slate-400 font-mono">{n.time}</span>
                    </div>
                    <p className="text-[10px] text-slate-400 leading-tight">{n.msg}</p>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>

        {/* User Profile Capsule */}
        <button
          onClick={() => setCurrentTab('profile')}
          className="flex items-center gap-2 pl-1.5 pr-2.5 py-1 bg-slate-900 hover:bg-slate-800 border border-violet-500/30 hover:border-violet-400 rounded-xl transition-all text-xs font-semibold text-white shadow-sm"
          title="Personnel Profile"
        >
          <div className="w-6 h-6 rounded-lg bg-gradient-to-br from-violet-600 via-indigo-500 to-cyan-400 text-white flex items-center justify-center font-bold text-[11px] shadow-[0_0_10px_rgba(139,92,246,0.6)]">
            R
          </div>
          <span className="hidden md:inline font-bold text-slate-200">Ranjeet</span>
        </button>
      </div>
    </header>
  );
}
