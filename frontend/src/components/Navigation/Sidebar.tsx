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
      items: [
        { id: 'dashboard', label: 'Overview', icon: LayoutDashboard },
        { id: 'enrichment', label: 'Catalog Enrichment', icon: Sparkles, badge: 'UNILOG', badgeColor: 'bg-violet-500/20 text-violet-300 border-violet-500/30' },
        { id: 'id-card', label: 'Digital ID Badge', icon: QrCode, badge: 'QR', badgeColor: 'bg-emerald-500/20 text-emerald-300 border-emerald-500/30' },
        { id: 'wiki', label: 'Docs & Wiki', icon: BookOpen, badge: 'DOCS', badgeColor: 'bg-cyan-500/20 text-cyan-300 border-cyan-500/30' }
      ]
    },
    {
      title: 'Discovery & Procurement',
      items: [
        { id: 'search', label: 'AI Search', icon: Search, badge: 'AI', badgeColor: 'bg-purple-500/20 text-purple-300 border-purple-500/30' },
        { id: 'product-intel', label: 'Product Intel', icon: TrendingUp },
        { id: 'recommendations', label: 'Recommendations', icon: Sparkles },
        { id: 'compare', label: 'Comparison', icon: ArrowRightLeft },
        { id: 'procurement', label: 'Procurement', icon: ShoppingCart },
        { id: 'orders', label: 'Orders', icon: PackageCheck }
      ]
    },
    {
      title: 'Operations & Systems',
      items: [
        { id: 'suppliers', label: 'Suppliers', icon: Factory },
        { id: 'favorites', label: 'Favorites', icon: Heart },
        { id: 'analytics', label: 'Analytics', icon: BarChart3 },
        { id: 'reports', label: 'Reports', icon: FileText },
        { id: '3d-facility', label: '3D Network', icon: Box, badge: '3D', badgeColor: 'bg-blue-500/20 text-blue-300 border-blue-500/30' },
        { id: 'copilot', label: 'Copilot', icon: Bot },
        { id: 'admin', label: 'Admin Suite', icon: ShieldCheck },
        { id: 'profile', label: 'Profile', icon: User },
        { id: 'help', label: 'Help & Support', icon: HelpCircle }
      ]
    }
  ];

  return (
    <>
      {/* Mobile Backdrop Overlay */}
      {isMobileOpen && (
        <div
          onClick={onCloseMobile}
          className="fixed inset-0 bg-black/60 backdrop-blur-sm z-40 md:hidden animate-in fade-in duration-200"
        />
      )}

      {/* Sidebar Container */}
      <aside
        className={`fixed left-0 top-0 h-full bg-surface-container-lowest border-r border-outline-variant/40 flex flex-col z-50 font-body-md text-on-surface transition-all duration-300 shadow-2xl md:shadow-xl ${
          isMobileOpen ? 'translate-x-0 w-[260px]' : '-translate-x-full md:translate-x-0'
        } ${isCollapsed ? 'md:w-[72px]' : 'md:w-[260px]'}`}
      >
        {/* Header with Logo & Toggle Button */}
        <div className="p-4 border-b border-outline-variant/30 flex items-center justify-between bg-surface-container-low">
          <div
            className="flex items-center gap-3 cursor-pointer overflow-hidden group"
            onClick={() => {
              setCurrentTab('landing');
              if (onCloseMobile) onCloseMobile();
            }}
          >
            <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-violet-600 to-indigo-600 flex items-center justify-center text-white font-bold shadow-md shrink-0 group-hover:scale-105 transition-transform">
              <Factory size={20} />
            </div>
            {(!isCollapsed || isMobileOpen) && (
              <div className="transition-opacity duration-300">
                <h1 className="text-base font-extrabold text-on-surface tracking-tight whitespace-nowrap">
                  IndustrialIQ
                </h1>
                <p className="text-[9px] text-violet-400 font-mono uppercase tracking-widest font-bold whitespace-nowrap">
                  Enterprise AI
                </p>
              </div>
            )}
          </div>

          {/* Desktop Collapse & Mobile Close Buttons */}
          <div className="flex items-center gap-1">
            <button
              onClick={onToggleCollapse}
              className="hidden md:flex p-1.5 rounded-lg bg-surface-container hover:bg-surface-container-high text-on-surface-variant hover:text-on-surface transition-colors"
              title={isCollapsed ? "Expand Sidebar" : "Collapse Sidebar"}
            >
              {isCollapsed ? <ChevronRight size={17} /> : <ChevronLeft size={17} />}
            </button>

            {onCloseMobile && (
              <button
                onClick={onCloseMobile}
                className="md:hidden p-1.5 rounded-lg text-on-surface-variant hover:bg-surface-container-high"
              >
                <X size={20} />
              </button>
            )}
          </div>
        </div>

        {/* Navigation Items Organized by Section */}
        <nav className="flex-1 overflow-y-auto no-scrollbar py-3 px-2 space-y-4">
          {navSections.map((sec, sIdx) => (
            <div key={sIdx} className="space-y-1">
              {(!isCollapsed || isMobileOpen) && (
                <p className="px-3 text-[10px] uppercase tracking-wider font-bold text-on-surface-variant/70 mb-1.5">
                  {sec.title}
                </p>
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
                    } py-2 rounded-xl transition-all duration-150 text-left font-medium group relative ${
                      isActive
                        ? 'bg-violet-600 text-white shadow-md font-bold'
                        : 'text-on-surface-variant hover:bg-surface-container hover:text-on-surface'
                    }`}
                  >
                    <div className="flex items-center gap-2.5">
                      <Icon
                        size={18}
                        className={`${
                          isActive ? 'text-white' : 'text-on-surface-variant group-hover:text-violet-400 group-hover:scale-110'
                        } transition-all`}
                      />
                      {(!isCollapsed || isMobileOpen) && (
                        <span className="text-xs whitespace-nowrap">{item.label}</span>
                      )}
                    </div>

                    {(!isCollapsed || isMobileOpen) && item.badge && (
                      <span
                        className={`text-[9px] font-mono font-bold px-1.5 py-0.5 rounded-full uppercase border ${
                          isActive
                            ? 'bg-white/20 text-white border-white/40'
                            : (item as any).badgeColor || 'bg-violet-500/20 text-violet-300 border-violet-500/30'
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
        <div className="p-2 border-t border-outline-variant/30 bg-surface-container-low space-y-1">
          <button
            onClick={() => {
              setCurrentTab('settings');
              if (onCloseMobile) onCloseMobile();
            }}
            title={isCollapsed && !isMobileOpen ? "Settings" : undefined}
            className={`w-full flex items-center ${
              isCollapsed && !isMobileOpen ? 'justify-center px-0' : 'px-3'
            } py-1.5 rounded-xl transition-colors text-xs font-medium ${
              currentTab === 'settings'
                ? 'bg-violet-600 text-white font-bold'
                : 'text-on-surface-variant hover:bg-surface-container hover:text-on-surface'
            }`}
          >
            <Settings size={17} />
            {(!isCollapsed || isMobileOpen) && <span className="ml-2.5">Settings</span>}
          </button>

          <button
            onClick={() => {
              setCurrentTab('landing');
              if (onCloseMobile) onCloseMobile();
            }}
            title={isCollapsed && !isMobileOpen ? "Landing Page" : undefined}
            className={`w-full flex items-center ${
              isCollapsed && !isMobileOpen ? 'justify-center px-0' : 'px-3'
            } py-1.5 rounded-xl transition-colors text-xs font-medium ${
              currentTab === 'landing'
                ? 'bg-violet-600 text-white font-bold'
                : 'text-on-surface-variant hover:bg-surface-container hover:text-on-surface'
            }`}
          >
            <HelpCircle size={17} />
            {(!isCollapsed || isMobileOpen) && <span className="ml-2.5">Landing Intro</span>}
          </button>
        </div>
      </aside>
    </>
  );
}
