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
import ThreeFacility from '../components/3D/ThreeFacility';

export default function Home() {
  const [currentTab, setCurrentTab] = useState<string>('dashboard');
  const [industry, setIndustry] = useState<string>('Heavy Manufacturing');
  const [selectedProduct, setSelectedProduct] = useState<any>(null);
  const [compareList, setCompareList] = useState<any[]>([]);
  const [isCompareModalOpen, setIsCompareModalOpen] = useState<boolean>(false);
  const [isCopilotOpen, setIsCopilotOpen] = useState<boolean>(false);
  const [isCommandPaletteOpen, setIsCommandPaletteOpen] = useState<boolean>(false);

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
    <div className="bg-surface text-on-surface font-body-md min-h-screen flex overflow-hidden">
      {/* Sidebar Component */}
      <Sidebar currentTab={currentTab} setCurrentTab={setCurrentTab} />

      {/* Main App Canvas */}
      <main className="ml-[260px] flex-1 flex flex-col h-screen overflow-hidden">
        {/* Top Navbar */}
        <TopNavbar
          onOpenSearch={() => setIsCommandPaletteOpen(true)}
          onToggleCopilot={() => setIsCopilotOpen(!isCopilotOpen)}
          currentTab={currentTab}
          setCurrentTab={setCurrentTab}
        />

        {/* Content Canvas */}
        <div className="flex-1 overflow-y-auto mt-16 p-6 md:p-8 bg-surface">
          <div className="max-w-[1600px] mx-auto">
            {currentTab === 'dashboard' && (
              <DashboardView onNavigate={(tab) => setCurrentTab(tab)} />
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

            {currentTab === '3d-facility' && <ThreeFacility />}

            {currentTab === 'admin' && <AdminView />}

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
