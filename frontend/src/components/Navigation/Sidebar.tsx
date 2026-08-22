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
  const navItems = [
    { id: 'dashboard', label: 'Overview', icon: LayoutDashboard },
    { id: 'enrichment', label: 'Catalog Enrichment', icon: Sparkles, badge: 'UNILOG' },
    { id: 'id-card', label: 'Digital ID Badge', icon: QrCode, badge: 'QR' },
    { id: 'wiki', label: 'Docs & Wiki', icon: BookOpen, badge: 'DOCS' },
    { id: 'search', label: 'AI Search', icon: Search, badge: 'AI' },
    { id: 'product-intel', label: 'Product Intel', icon: TrendingUp },
    { id: 'recommendations', label: 'Recommendations', icon: Sparkles },
    { id: 'compare', label: 'Comparison', icon: ArrowRightLeft },
    { id: 'procurement', label: 'Procurement', icon: ShoppingCart },
    { id: 'orders', label: 'Orders', icon: PackageCheck },
    { id: 'suppliers', label: 'Suppliers', icon: Factory },
    { id: 'favorites', label: 'Favorites', icon: Heart },
    { id: 'analytics', label: 'Analytics', icon: BarChart3 },
    { id: 'reports', label: 'Reports', icon: FileText },
    { id: '3d-facility', label: '3D Network', icon: Box, badge: '3D' },
    { id: 'copilot', label: 'Copilot', icon: Bot },
    { id: 'admin', label: 'Admin Suite', icon: ShieldCheck },
    { id: 'profile', label: 'Profile', icon: User },
    { id: 'help', label: 'Help & Support', icon: HelpCircle }
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
        className={`fixed left-0 top-0 h-full bg-primary-container border-r border-outline-variant/30 flex flex-col z-50 font-body-md text-on-primary-container transition-all duration-300 shadow-2xl md:shadow-xl ${
          isMobileOpen ? 'translate-x-0 w-[260px]' : '-translate-x-full md:translate-x-0'
        } ${isCollapsed ? 'md:w-[72px]' : 'md:w-[260px]'}`}
      >
        {/* Header with Logo & Toggle Button */}
        <div className="p-4 border-b border-outline-variant/20 flex items-center justify-between">
          <div
            className="flex items-center gap-3 cursor-pointer overflow-hidden"
            onClick={() => {
              setCurrentTab('landing');
              if (onCloseMobile) onCloseMobile();
            }}
          >
            <div className="w-9 h-9 rounded-lg bg-secondary-container flex items-center justify-center text-on-primary font-bold shadow-md shrink-0">
              <Factory size={22} />
            </div>
            {(!isCollapsed || isMobileOpen) && (
              <div className="transition-opacity duration-300">
                <h1 className="font-headline-sm text-base font-bold text-on-primary-fixed tracking-tight whitespace-nowrap">
                  IndustrialIQ
                </h1>
                <p className="font-label-caps text-[9px] text-on-primary-container uppercase tracking-wider whitespace-nowrap">
                  Enterprise AI
                </p>
              </div>
            )}
          </div>

          {/* Desktop Collapse & Mobile Close Buttons */}
          <div className="flex items-center gap-1">
            <button
              onClick={onToggleCollapse}
              className="hidden md:flex p-1.5 rounded-lg bg-surface-container-high/10 text-on-primary-container hover:bg-secondary-container/30 hover:text-on-primary transition-colors"
              title={isCollapsed ? "Expand Sidebar" : "Collapse Sidebar"}
            >
              {isCollapsed ? <ChevronRight size={18} /> : <ChevronLeft size={18} />}
            </button>

            {onCloseMobile && (
              <button
                onClick={onCloseMobile}
                className="md:hidden p-1.5 rounded-lg text-on-primary-container hover:bg-surface-container-high/20"
              >
                <X size={20} />
              </button>
            )}
          </div>
        </div>

        {/* Navigation Items (No Scrollbar) */}
        <nav className="flex-1 overflow-y-auto no-scrollbar py-3 px-2 space-y-1">
          {navItems.map((item) => {
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
                  isCollapsed && !isMobileOpen ? 'justify-center px-0' : 'justify-between px-3.5'
                } py-2.5 rounded-lg transition-all duration-150 text-left font-medium group relative ${
                  isActive
                    ? 'bg-secondary-container/20 text-secondary-fixed border-l-4 border-secondary-container shadow-inner'
                    : 'text-on-primary-container hover:bg-on-primary-fixed-variant/10 hover:text-on-primary-fixed'
                }`}
              >
                <div className="flex items-center gap-3">
                  <Icon size={19} className={`${isActive ? 'text-secondary-fixed' : 'group-hover:scale-110'} transition-transform`} />
                  {(!isCollapsed || isMobileOpen) && (
                    <span className="text-xs font-semibold whitespace-nowrap">{item.label}</span>
                  )}
                </div>

                {(!isCollapsed || isMobileOpen) && item.badge && (
                  <span className="text-[9px] font-bold px-1.5 py-0.5 rounded bg-purple-500/20 text-purple-300 uppercase">
                    {item.badge}
                  </span>
                )}
              </button>
            );
          })}
        </nav>

        {/* Footer Settings & Help */}
        <div className="p-2 border-t border-outline-variant/20 space-y-1">
          <button
            onClick={() => {
              setCurrentTab('settings');
              if (onCloseMobile) onCloseMobile();
            }}
            title={isCollapsed && !isMobileOpen ? "Settings" : undefined}
            className={`w-full flex items-center ${
              isCollapsed && !isMobileOpen ? 'justify-center px-0' : 'px-3.5'
            } py-2 rounded-lg transition-colors text-xs font-medium ${
              currentTab === 'settings' ? 'text-secondary-fixed bg-secondary-container/20' : 'hover:bg-on-primary-fixed-variant/10'
            }`}
          >
            <Settings size={18} />
            {(!isCollapsed || isMobileOpen) && <span className="ml-3">Settings</span>}
          </button>

          <button
            onClick={() => {
              setCurrentTab('landing');
              if (onCloseMobile) onCloseMobile();
            }}
            title={isCollapsed && !isMobileOpen ? "Landing / Intro" : undefined}
            className={`w-full flex items-center ${
              isCollapsed && !isMobileOpen ? 'justify-center px-0' : 'px-3.5'
            } py-2 rounded-lg transition-colors text-xs font-medium hover:bg-on-primary-fixed-variant/10 text-on-primary-container`}
          >
            <HelpCircle size={18} />
            {(!isCollapsed || isMobileOpen) && <span className="ml-3">Landing / Intro</span>}
          </button>
        </div>
      </aside>
    </>
  );
}
