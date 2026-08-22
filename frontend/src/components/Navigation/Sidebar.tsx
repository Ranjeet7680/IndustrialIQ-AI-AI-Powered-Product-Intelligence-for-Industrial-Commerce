"use client";

import React from 'react';
import {
  LayoutDashboard,
  TrendingUp,
  Search,
  Sparkles,
  ArrowRightLeft,
  ShoppingCart,
  PackageCheck,
  Factory,
  BarChart3,
  FileText,
  Bot,
  Settings,
  HelpCircle,
  ShieldCheck,
  Box,
  Heart,
  User,
  ChevronLeft,
  ChevronRight,
  X,
  BookOpen,
  QrCode
} from 'lucide-react';

interface SidebarProps {
  currentTab: string;
  setCurrentTab: (tab: string) => void;
  isCollapsed: boolean;
  onToggleCollapse: () => void;
  isMobileOpen?: boolean;
  onCloseMobile?: () => void;
}

export default function Sidebar({
  currentTab,
  setCurrentTab,
  isCollapsed,
  onToggleCollapse,
  isMobileOpen = false,
  onCloseMobile
}: SidebarProps) {
  const navSections = [
    {
      title: 'Catalog & Intelligence',
      color: 'text-violet-400',
      dotColor: 'bg-violet-400',
      items: [
        { id: 'dashboard', label: 'Overview', icon: LayoutDashboard },
        { id: 'enrichment', label: 'Catalog Enrichment', icon: Sparkles, badge: 'UNILOG', badgeColor: 'bg-violet-500/25 text-violet-300 border-violet-400/50 shadow-[0_0_10px_rgba(139,92,246,0.3)]' },
        { id: 'id-card', label: 'Digital ID Badge', icon: QrCode, badge: 'QR', badgeColor: 'bg-emerald-500/25 text-emerald-300 border-emerald-400/50 shadow-[0_0_10px_rgba(16,185,129,0.3)]' },
        { id: 'wiki', label: 'Docs & Wiki', icon: BookOpen, badge: 'DOCS', badgeColor: 'bg-cyan-500/25 text-cyan-300 border-cyan-400/50 shadow-[0_0_10px_rgba(6,182,212,0.3)]' }
      ]
    },
    {
      title: 'Discovery & Procurement',
      color: 'text-cyan-400',
      dotColor: 'bg-cyan-400',
      items: [
        { id: 'search', label: 'AI Search', icon: Search, badge: 'AI', badgeColor: 'bg-purple-500/25 text-purple-300 border-purple-400/50' },
        { id: 'product-intel', label: 'Product Intel', icon: TrendingUp },
        { id: 'recommendations', label: 'Recommendations', icon: Sparkles },
        { id: 'compare', label: 'Comparison', icon: ArrowRightLeft },
        { id: 'procurement', label: 'Procurement', icon: ShoppingCart },
        { id: 'orders', label: 'Orders', icon: PackageCheck }
      ]
    },
    {
      title: 'Operations & Systems',
      color: 'text-amber-400',
      dotColor: 'bg-amber-400',
      items: [
        { id: 'suppliers', label: 'Suppliers', icon: Factory },
        { id: 'favorites', label: 'Favorites', icon: Heart },
        { id: 'analytics', label: 'Analytics', icon: BarChart3 },
        { id: 'reports', label: 'Reports', icon: FileText },
        { id: '3d-facility', label: '3D Network', icon: Box, badge: '3D', badgeColor: 'bg-blue-500/25 text-blue-300 border-blue-400/50 shadow-[0_0_10px_rgba(59,130,246,0.3)]' },
        { id: 'copilot', label: 'Copilot', icon: Bot },
        { id: 'admin', label: 'Admin Suite', icon: ShieldCheck },
        { id: 'profile', label: 'Profile', icon: User },
        { id: 'help', label: 'Help & Support', icon: HelpCircle }
      ]
    }
  ];

  return (
    <>
      <style>{`
        @keyframes neon-glow {
          0%, 100% { box-shadow: 0 0 15px rgba(139, 92, 246, 0.45); }
          50% { box-shadow: 0 0 25px rgba(139, 92, 246, 0.7); }
        }
        @keyframes pulse-badge {
          0%, 100% { transform: scale(1); }
          50% { transform: scale(1.05); }
        }
        .animate-neon {
          animation: neon-glow 3s infinite ease-in-out;
        }
        .badge-glow {
          animation: pulse-badge 2s infinite ease-in-out;
        }
      `}</style>

      {/* Mobile Backdrop Overlay */}
      {isMobileOpen && (
        <div
          onClick={onCloseMobile}
          className="fixed inset-0 bg-black/75 backdrop-blur-md z-40 md:hidden transition-opacity"
        />
      )}

      {/* Sidebar Container */}
      <aside
        className={`fixed left-0 top-0 h-full bg-gradient-to-b from-[#090d16] via-[#0d1322] to-[#070a12] border-r border-violet-500/20 flex flex-col z-50 font-body-md text-slate-200 transition-all duration-300 shadow-2xl ${
          isMobileOpen ? 'translate-x-0 w-[265px]' : '-translate-x-full md:translate-x-0'
        } ${isCollapsed ? 'md:w-[76px]' : 'md:w-[265px]'}`}
      >
        {/* Header with Glowing Logo & Toggle Button */}
        <div className="p-4 border-b border-violet-500/15 flex items-center justify-between bg-[#0b101c]">
          <div
            className="flex items-center gap-3 cursor-pointer overflow-hidden group"
            onClick={() => {
              setCurrentTab('landing');
              if (onCloseMobile) onCloseMobile();
            }}
          >
            {/* Glowing Logo Icon */}
            <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-violet-600 via-indigo-500 to-cyan-400 flex items-center justify-center text-white font-black shadow-[0_0_18px_rgba(139,92,246,0.6)] group-hover:scale-105 group-hover:shadow-[0_0_25px_rgba(6,182,212,0.8)] transition-all shrink-0">
              <Factory size={22} className="animate-pulse" />
            </div>

            {(!isCollapsed || isMobileOpen) && (
              <div className="transition-all duration-300">
                <h1 className="text-base font-extrabold text-white tracking-tight whitespace-nowrap bg-gradient-to-r from-white via-slate-100 to-violet-200 bg-clip-text text-transparent">
                  IndustrialIQ
                </h1>
                <p className="text-[9px] text-cyan-400 font-mono uppercase tracking-widest font-bold whitespace-nowrap flex items-center gap-1">
                  <span className="w-1.5 h-1.5 rounded-full bg-cyan-400 animate-ping" />
                  Enterprise AI
                </p>
              </div>
            )}
          </div>

          {/* Desktop Collapse & Mobile Close Buttons */}
          <div className="flex items-center gap-1">
            <button
              onClick={onToggleCollapse}
              className="hidden md:flex p-1.5 rounded-xl bg-slate-800/60 hover:bg-violet-600/30 text-slate-300 hover:text-white border border-slate-700/50 hover:border-violet-500/50 transition-all shadow-sm"
              title={isCollapsed ? "Expand Sidebar" : "Collapse Sidebar"}
            >
              {isCollapsed ? <ChevronRight size={17} /> : <ChevronLeft size={17} />}
            </button>

            {onCloseMobile && (
              <button
                onClick={onCloseMobile}
                className="md:hidden p-1.5 rounded-xl text-slate-300 hover:bg-slate-800"
              >
                <X size={20} />
              </button>
            )}
          </div>
        </div>

        {/* Navigation Items Organized by Section */}
        <nav className="flex-1 overflow-y-auto no-scrollbar py-3 px-2.5 space-y-4">
          {navSections.map((sec, sIdx) => (
            <div key={sIdx} className="space-y-1">
              {(!isCollapsed || isMobileOpen) && (
                <div className="flex items-center gap-1.5 px-3 mb-1.5">
                  <span className={`w-1.5 h-1.5 rounded-full ${sec.dotColor}`} />
                  <p className={`text-[10px] uppercase tracking-wider font-extrabold ${sec.color}`}>
                    {sec.title}
                  </p>
                </div>
              )}

              {sec.items.map((item) => {
                const Icon = item.icon;
                const isActive = currentTab === item.id;
                return (
                  <button
                    key={item.id}
                    onClick={() => {
                      setCurrentTab(item.id);
                      if (onCloseMobile) onCloseMobile();
                    }}
                    title={isCollapsed && !isMobileOpen ? item.label : undefined}
                    className={`w-full flex items-center ${
                      isCollapsed && !isMobileOpen ? 'justify-center px-0' : 'justify-between px-3'
                    } py-2.5 rounded-xl transition-all duration-200 text-left font-medium group relative ${
                      isActive
                        ? 'bg-gradient-to-r from-violet-600 via-indigo-600 to-purple-600 text-white font-bold shadow-[0_0_20px_rgba(139,92,246,0.45)] border-l-4 border-cyan-400 animate-neon'
                        : 'text-slate-300 hover:bg-slate-800/60 hover:text-white hover:translate-x-0.5'
                    }`}
                  >
                    <div className="flex items-center gap-2.5">
                      <Icon
                        size={19}
                        className={`${
                          isActive
                            ? 'text-cyan-300'
                            : 'text-slate-400 group-hover:text-cyan-300 group-hover:scale-110'
                        } transition-all duration-200`}
                      />
                      {(!isCollapsed || isMobileOpen) && (
                        <span className="text-xs whitespace-nowrap">{item.label}</span>
                      )}
                    </div>

                    {(!isCollapsed || isMobileOpen) && item.badge && (
                      <span
                        className={`text-[9px] font-mono font-bold px-2 py-0.5 rounded-full uppercase border transition-all ${
                          isActive
                            ? 'bg-white/20 text-white border-white/40'
                            : `${(item as any).badgeColor} badge-glow`
                        }`}
                      >
                        {item.badge}
                      </span>
                    )}
                  </button>
                );
              })}
            </div>
          ))}
        </nav>

        {/* Footer Settings & Help */}
        <div className="p-2.5 border-t border-violet-500/15 bg-[#090d16] space-y-1">
          <button
            onClick={() => {
              setCurrentTab('settings');
              if (onCloseMobile) onCloseMobile();
            }}
            title={isCollapsed && !isMobileOpen ? "Settings" : undefined}
            className={`w-full flex items-center ${
              isCollapsed && !isMobileOpen ? 'justify-center px-0' : 'px-3'
            } py-2 rounded-xl transition-all text-xs font-medium ${
              currentTab === 'settings'
                ? 'bg-violet-600 text-white font-bold shadow-md'
                : 'text-slate-400 hover:bg-slate-800/60 hover:text-white'
            }`}
          >
            <Settings size={17} className="text-slate-400 hover:text-violet-300" />
            {(!isCollapsed || isMobileOpen) && <span className="ml-2.5">Settings & API</span>}
          </button>

          <button
            onClick={() => {
              setCurrentTab('landing');
              if (onCloseMobile) onCloseMobile();
            }}
            title={isCollapsed && !isMobileOpen ? "Landing Page" : undefined}
            className={`w-full flex items-center ${
              isCollapsed && !isMobileOpen ? 'justify-center px-0' : 'px-3'
            } py-2 rounded-xl transition-all text-xs font-medium ${
              currentTab === 'landing'
                ? 'bg-violet-600 text-white font-bold shadow-md'
                : 'text-slate-400 hover:bg-slate-800/60 hover:text-white'
            }`}
          >
            <HelpCircle size={17} className="text-slate-400 hover:text-cyan-300" />
            {(!isCollapsed || isMobileOpen) && <span className="ml-2.5">Landing Intro</span>}
          </button>
        </div>
      </aside>
    </>
  );
}
