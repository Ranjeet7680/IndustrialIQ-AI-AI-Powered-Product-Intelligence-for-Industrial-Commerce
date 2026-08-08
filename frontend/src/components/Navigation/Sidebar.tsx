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
  Heart
} from 'lucide-react';

interface SidebarProps {
  currentTab: string;
  setCurrentTab: (tab: string) => void;
}

export default function Sidebar({ currentTab, setCurrentTab }: SidebarProps) {
  const navItems = [
    { id: 'dashboard', label: 'Overview', icon: LayoutDashboard },
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
    { id: 'admin', label: 'Admin Suite', icon: ShieldCheck }
  ];

  return (
    <aside className="fixed left-0 top-0 h-full w-[260px] bg-primary-container border-r border-outline-variant/30 flex flex-col z-40 font-body-md text-body-md text-on-primary-container">
      <div className="p-6 border-b border-outline-variant/20 flex items-center gap-3 cursor-pointer" onClick={() => setCurrentTab('landing')}>
        <div className="w-8 h-8 rounded bg-secondary-container flex items-center justify-center text-on-primary font-bold">
          <Factory size={20} />
        </div>
        <div>
          <h1 className="font-headline-sm text-headline-sm font-bold text-on-primary-fixed tracking-tight">IndustrialIQ</h1>
          <p className="font-label-caps text-[10px] text-on-primary-container uppercase tracking-wider">Enterprise AI</p>
        </div>
      </div>

      <nav className="flex-1 overflow-y-auto py-3 px-2 space-y-1">
        {navItems.map((item) => {
          const Icon = item.icon;
          const isActive = currentTab === item.id;
          return (
            <button
              key={item.id}
              onClick={() => setCurrentTab(item.id)}
              className={`w-full flex items-center justify-between px-4 py-2.5 rounded transition-all duration-150 text-left font-medium ${
                isActive
                  ? 'bg-secondary-container/20 text-secondary-fixed border-l-4 border-secondary-container'
                  : 'text-on-primary-container hover:bg-on-primary-fixed-variant/10 hover:text-on-primary-fixed'
              }`}
            >
              <div className="flex items-center gap-3">
                <Icon size={18} />
                <span className="text-sm">{item.label}</span>
              </div>
              {item.badge && (
                <span className="text-[10px] font-bold px-1.5 py-0.5 rounded bg-purple-500/20 text-purple-300 uppercase">
                  {item.badge}
                </span>
              )}
            </button>
          );
        })}
      </nav>

      <div className="p-3 border-t border-outline-variant/20 space-y-1">
        <button
          onClick={() => setCurrentTab('settings')}
          className={`w-full flex items-center gap-3 px-4 py-2 rounded transition-colors text-sm ${
            currentTab === 'settings' ? 'text-secondary-fixed bg-secondary-container/20' : 'hover:bg-on-primary-fixed-variant/10'
          }`}
        >
          <Settings size={18} />
          <span>Settings</span>
        </button>
        <button
          onClick={() => setCurrentTab('landing')}
          className="w-full flex items-center gap-3 px-4 py-2 rounded text-sm hover:bg-on-primary-fixed-variant/10 text-on-primary-container"
        >
          <HelpCircle size={18} />
          <span>Landing / Intro</span>
        </button>
      </div>
    </aside>
  );
}
