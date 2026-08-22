"use client";

import React, { useState } from 'react';
import Sidebar from '../components/Navigation/Sidebar';
import TopNavbar from '../components/Navigation/TopNavbar';
import CommandPalette from '../components/Navigation/CommandPalette';
import CopilotDrawer from '../components/Copilot/CopilotDrawer';
import ComparisonModal from '../components/Modals/ComparisonModal';

// Views
import WelcomeSplashView from '../views/WelcomeSplashView';
import LandingView from '../views/LandingView';
import AuthView from '../views/AuthView';
import IndustrySelectionView from '../views/IndustrySelectionView';
import SetupCompleteView from '../views/SetupCompleteView';
import DashboardView from '../views/DashboardView';
import AISearchView from '../views/AISearchView';
import ProductDetailView from '../views/ProductDetailView';
import SuppliersView from '../views/SuppliersView';
import ProcurementView from '../views/ProcurementView';
import OrdersView from '../views/OrdersView';
import AnalyticsView from '../views/AnalyticsView';
import ReportsView from '../views/ReportsView';
import AdminView from '../views/AdminView';
import SettingsView from '../views/SettingsView';
import CopilotView from '../views/CopilotView';
import ProfileView from '../views/ProfileView';
import HelpView from '../views/HelpView';
import CatalogEnrichmentView from '../views/CatalogEnrichmentView';
import DocumentationWikiView from '../views/DocumentationWikiView';
import IDCardSystemView from '../views/IDCardSystemView';
import ThreeFacility from '../components/3D/ThreeFacility';

export default function Home() {
  const [currentTab, setCurrentTab] = useState<string>('landing');
  const [industry, setIndustry] = useState<string>('Heavy Manufacturing');
  const [selectedProduct, setSelectedProduct] = useState<any>(null);
  const [compareList, setCompareList] = useState<any[]>([]);
  const [isCompareModalOpen, setIsCompareModalOpen] = useState<boolean>(false);
  const [isCopilotOpen, setIsCopilotOpen] = useState<boolean>(false);
  const [isCommandPaletteOpen, setIsCommandPaletteOpen] = useState<boolean>(false);
  const [isSidebarCollapsed, setIsSidebarCollapsed] = useState<boolean>(false);
  const [isMobileOpen, setIsMobileOpen] = useState<boolean>(false);

  // Full-screen standalone views without Sidebar/TopNav
  if (currentTab === 'welcome') {
    return (
      <WelcomeSplashView
        onGetStarted={() => setCurrentTab('onboarding')}
        onSignIn={() => setCurrentTab('auth')}
      />
    );
  }

  if (currentTab === 'landing') {
    return (
      <LandingView
        onGetStarted={() => setCurrentTab('onboarding')}
        onSignIn={() => setCurrentTab('auth')}
      />
    );
  }

  if (currentTab === 'auth') {
    return (
      <AuthView
        onSuccess={() => setCurrentTab('onboarding')}
      />
    );
  }

  if (currentTab === 'onboarding') {
    return (
      <IndustrySelectionView
        onContinue={(ind) => {
          setIndustry(ind);
          setCurrentTab('setup-complete');
        }}
        onSkip={() => setCurrentTab('dashboard')}
      />
    );
  }

  if (currentTab === 'setup-complete') {
    return (
      <SetupCompleteView
        industry={industry}
        onEnterDashboard={() => setCurrentTab('dashboard')}
      />
    );
  }

  const handleCompareToggle = (prod: any) => {
    if (compareList.some(p => p.id === prod.id)) {
      setCompareList(compareList.filter(p => p.id !== prod.id));
    } else {
      if (compareList.length >= 4) {
        alert('You can compare up to 4 products at a time.');
        return;
      }
      const updated = [...compareList, prod];
      setCompareList(updated);
      setIsCompareModalOpen(true);
    }
  };

  const handleRemoveCompare = (id: number) => {
    setCompareList(compareList.filter(p => p.id !== id));
  };

  return (
    <div className="bg-surface text-on-surface font-body-md min-h-screen flex overflow-x-hidden">
      {/* Sidebar Component with Mobile Drawer System */}
      <Sidebar
        currentTab={currentTab}
        setCurrentTab={setCurrentTab}
        isCollapsed={isSidebarCollapsed}
        onToggleCollapse={() => setIsSidebarCollapsed(!isSidebarCollapsed)}
        isMobileOpen={isMobileOpen}
        onCloseMobile={() => setIsMobileOpen(false)}
      />

      {/* Main App Canvas */}
      <main
        className={`flex-1 flex flex-col min-h-screen overflow-x-hidden transition-all duration-300 ml-0 ${
          isSidebarCollapsed ? 'md:ml-[72px]' : 'md:ml-[260px]'
        }`}
      >
        {/* Top Navbar */}
        <TopNavbar
          onOpenSearch={() => setIsCommandPaletteOpen(true)}
          onToggleCopilot={() => setIsCopilotOpen(!isCopilotOpen)}
          currentTab={currentTab}
          setCurrentTab={setCurrentTab}
          isCollapsed={isSidebarCollapsed}
          onToggleCollapse={() => setIsSidebarCollapsed(!isSidebarCollapsed)}
          onToggleMobileMenu={() => setIsMobileOpen(!isMobileOpen)}
        />

        {/* Content Canvas */}
        <div className="flex-1 overflow-y-auto mt-16 p-4 sm:p-6 md:p-8 bg-surface">
          <div className="max-w-[1600px] mx-auto">
            {currentTab === 'dashboard' && (
              <DashboardView onNavigate={(tab) => setCurrentTab(tab)} />
            )}

            {currentTab === 'enrichment' && (
              <CatalogEnrichmentView />
            )}

            {(currentTab === 'search' || currentTab === 'product-intel') && (
              <AISearchView
                onCompareToggle={handleCompareToggle}
                compareList={compareList}
                onSelectProduct={(p) => {
                  setSelectedProduct(p);
                  setCurrentTab('product-detail');
                }}
              />
            )}

            {currentTab === 'product-detail' && (
              <ProductDetailView
                product={selectedProduct}
                onBack={() => setCurrentTab('search')}
                onNavigateProcurement={() => setCurrentTab('procurement')}
              />
            )}

            {currentTab === 'suppliers' && <SuppliersView />}

            {currentTab === 'procurement' && (
              <ProcurementView onNavigateOrders={() => setCurrentTab('orders')} />
            )}

            {currentTab === 'orders' && <OrdersView />}

            {currentTab === 'analytics' && <AnalyticsView />}

            {currentTab === 'reports' && <ReportsView />}

            {currentTab === '3d-facility' && (
              <ThreeFacility onNavigate={(tab) => setCurrentTab(tab)} />
            )}

            {currentTab === 'admin' && <AdminView />}

            {currentTab === 'settings' && <SettingsView />}

            {currentTab === 'copilot' && (
              <CopilotView
                onCompareToggle={handleCompareToggle}
                compareList={compareList}
                onSelectProduct={(p) => {
                  setSelectedProduct(p);
                  setCurrentTab('product-detail');
                }}
                onNavigate={(tab) => setCurrentTab(tab)}
              />
            )}

            {currentTab === 'profile' && (
              <ProfileView onNavigate={(tab) => setCurrentTab(tab)} />
            )}

            {currentTab === 'help' && (
              <HelpView onNavigate={(tab) => setCurrentTab(tab)} />
            )}

            {(currentTab === 'wiki' || currentTab === 'docs') && (
              <DocumentationWikiView />
            )}

            {currentTab === 'id-card' && (
              <IDCardSystemView />
            )}

            {(currentTab === 'recommendations' || currentTab === 'favorites') && (
              <AISearchView
                onCompareToggle={handleCompareToggle}
                compareList={compareList}
                onSelectProduct={(p) => {
                  setSelectedProduct(p);
                  setCurrentTab('product-detail');
                }}
              />
            )}

            {currentTab === 'compare' && (
              <div className="space-y-4">
                <div className="flex justify-between items-center">
                  <h2 className="font-bold text-lg">Product Comparison Workspace</h2>
                  <button
                    onClick={() => setIsCompareModalOpen(true)}
                    className="px-4 py-2 bg-secondary-container text-on-secondary rounded text-xs font-semibold"
                  >
                    Open Comparison Matrix Modal ({compareList.length})
                  </button>
                </div>
                <AISearchView
                  onCompareToggle={handleCompareToggle}
                  compareList={compareList}
                  onSelectProduct={(p) => {
                    setSelectedProduct(p);
                    setCurrentTab('product-detail');
                  }}
                />
              </div>
            )}
          </div>
        </div>
      </main>

      {/* Floating Comparison Modal */}
      <ComparisonModal
        products={compareList}
        isOpen={isCompareModalOpen}
        onClose={() => setIsCompareModalOpen(false)}
        onRemove={handleRemoveCompare}
      />

      {/* AI Copilot Drawer */}
      <CopilotDrawer
        isOpen={isCopilotOpen}
        onClose={() => setIsCopilotOpen(false)}
        onNavigateTab={(tab) => setCurrentTab(tab)}
      />

      {/* Command Palette */}
      <CommandPalette
        isOpen={isCommandPaletteOpen}
        onClose={() => setIsCommandPaletteOpen(false)}
        onSelectTab={(tab) => setCurrentTab(tab)}
      />
    </div>
  );
}
