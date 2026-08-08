"use client";

import React from 'react';
import { Sparkles, ArrowRight, CheckCircle2, Search, Factory, ShoppingCart, Shield, Bot, Send } from 'lucide-react';

interface LandingViewProps {
  onGetStarted: () => void;
  onSignIn: () => void;
}

export default function LandingView({ onGetStarted, onSignIn }: LandingViewProps) {
  return (
    <div className="min-h-screen bg-surface-container-lowest text-on-surface font-body-md">
      {/* Top Header */}
      <header className="fixed top-0 left-0 right-0 z-50 bg-surface-container-lowest/90 backdrop-blur-md border-b border-outline-variant h-16 flex justify-between items-center px-6">
        <div className="flex items-center gap-8">
          <div className="flex items-center gap-2 cursor-pointer" onClick={onGetStarted}>
            <Factory className="text-secondary-container" size={24} />
            <span className="font-headline-sm text-headline-sm text-on-surface font-bold tracking-tight">IndustrialIQ AI</span>
          </div>
          <nav className="hidden md:flex items-center gap-6 text-sm text-on-surface-variant font-medium">
            <button onClick={onGetStarted} className="hover:text-on-surface transition-colors">Platform</button>
            <button onClick={onGetStarted} className="hover:text-on-surface transition-colors">Solutions</button>
            <button onClick={onGetStarted} className="hover:text-on-surface transition-colors">Resources</button>
          </nav>
        </div>
        <div className="flex items-center gap-4 text-sm">
          <button onClick={onSignIn} className="text-on-surface-variant hover:text-on-surface font-medium">Sign In</button>
          <button
            onClick={onGetStarted}
            className="bg-primary-container text-on-primary px-4 py-2 rounded font-medium hover:bg-primary transition-colors"
          >
            Get Started
          </button>
        </div>
      </header>

      {/* Main Content */}
      <main className="pt-16">
        {/* Hero Section */}
        <section className="max-w-7xl mx-auto px-6 py-20 md:py-28 grid md:grid-cols-2 gap-12 items-center">
          <div className="space-y-6">
            <div className="inline-flex items-center gap-2 px-3 py-1 bg-surface-container rounded-full border border-outline-variant">
              <Bot size={16} className="text-secondary-container" />
              <span className="font-label-caps text-label-caps text-on-surface-variant uppercase tracking-wider text-[11px]">
                Enterprise AI Intelligence
              </span>
            </div>
            <h1 className="font-display-lg text-display-lg md:text-5xl text-on-surface font-bold leading-tight">
              AI-Powered Product Intelligence for Industrial Commerce
            </h1>
            <p className="font-body-md text-body-md text-on-surface-variant text-base md:text-lg max-w-xl">
              Discover, evaluate, compare, and procure industrial products with AI-powered intelligence. Streamline your supply chain with precision data.
            </p>
            <div className="flex gap-4 pt-2">
              <button
                onClick={onGetStarted}
                className="bg-primary-container text-on-primary px-6 py-3 rounded font-medium hover:bg-primary transition-colors flex items-center gap-2"
              >
                Start Free <ArrowRight size={18} />
              </button>
              <button
                onClick={onSignIn}
                className="border border-outline-variant text-on-surface px-6 py-3 rounded font-medium hover:bg-surface-container transition-colors"
              >
                Book Demo
              </button>
            </div>
          </div>

          {/* Dashboard Preview Mockup */}
          <div className="relative">
            <div className="absolute inset-0 bg-secondary-container opacity-10 blur-3xl rounded-full" />
            <div className="relative bg-surface-container-lowest border border-outline-variant rounded-xl overflow-hidden shadow-xl">
              <div className="border-b border-outline-variant bg-surface-container px-4 py-2.5 flex items-center gap-2">
                <div className="w-3 h-3 rounded-full bg-outline-variant" />
                <div className="w-3 h-3 rounded-full bg-outline-variant" />
                <div className="w-3 h-3 rounded-full bg-outline-variant" />
                <span className="text-xs text-on-surface-variant font-data-mono ml-2">industrialiq.ai/dashboard</span>
              </div>
              <div className="p-6 space-y-4">
                <div className="flex justify-between items-end pb-4 border-b border-outline-variant">
                  <div>
                    <h3 className="font-headline-sm text-headline-sm text-on-surface font-bold">Procurement Analysis</h3>
                    <p className="text-on-surface-variant font-label-caps text-label-caps uppercase text-[10px] mt-1">Centrifugal Pumps Q3</p>
                  </div>
                  <div className="text-right">
                    <span className="text-secondary-container font-headline-md text-headline-md font-bold block">94/100</span>
                    <span className="font-label-caps text-label-caps text-on-surface-variant uppercase text-[10px]">AI Confidence Score</span>
                  </div>
                </div>
                <div className="space-y-3">
                  <div className="flex items-center justify-between p-3 bg-surface rounded border border-outline-variant text-xs">
                    <div className="flex items-center gap-3">
                      <Factory size={18} className="text-on-surface-variant" />
                      <span className="font-data-mono">Grundfos Pumps India</span>
                    </div>
                    <span className="text-secondary-container font-data-mono font-bold">Optimal</span>
                  </div>
                  <div className="flex items-center justify-between p-3 bg-surface rounded border border-outline-variant text-xs">
                    <div className="flex items-center gap-3">
                      <Factory size={18} className="text-on-surface-variant" />
                      <span className="font-data-mono">KSB Pumps & Valves</span>
                    </div>
                    <span className="text-on-surface-variant font-data-mono">Review</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Feature Bento Grid */}
        <section className="bg-surface-container-low py-20 border-y border-outline-variant">
          <div className="max-w-7xl mx-auto px-6">
            <div className="mb-12 text-center max-w-2xl mx-auto">
              <h2 className="font-headline-md text-headline-md text-on-surface font-bold mb-2">Industrial Intelligence Engine</h2>
              <p className="text-on-surface-variant text-sm">Four pillars of AI-driven supply chain optimization.</p>
            </div>
            <div className="grid md:grid-cols-4 gap-6">
              <div className="bg-surface-container-lowest p-6 rounded-lg border border-outline-variant flex flex-col justify-between">
                <div>
                  <Search className="text-secondary-container mb-4" size={28} />
                  <h3 className="font-headline-sm text-base font-bold text-on-surface mb-2">Discovery</h3>
                  <p className="text-on-surface-variant text-xs leading-relaxed">Semantic search across millions of industrial SKUs and technical specifications.</p>
                </div>
              </div>

              <div className="bg-surface-container-lowest p-6 rounded-lg border border-purple-500/40 ai-glow-purple flex flex-col justify-between">
                <div>
                  <div className="flex justify-between items-start mb-4">
                    <Sparkles className="text-purple-600" size={28} />
                    <span className="font-label-caps text-[10px] text-purple-700 bg-purple-100 px-2 py-0.5 rounded uppercase font-bold">AI Powered</span>
                  </div>
                  <h3 className="font-headline-sm text-base font-bold text-on-surface mb-2">Explainable Score</h3>
                  <p className="text-on-surface-variant text-xs leading-relaxed">7-factor weighted confidence scoring based on historical quality and market telemetry.</p>
                </div>
              </div>

              <div className="bg-surface-container-lowest p-6 rounded-lg border border-outline-variant flex flex-col justify-between">
                <div>
                  <Shield className="text-secondary-container mb-4" size={28} />
                  <h3 className="font-headline-sm text-base font-bold text-on-surface mb-2">Supplier Risk</h3>
                  <p className="text-on-surface-variant text-xs leading-relaxed">Deep analytics on supplier reliability, defect rates, and geopolitical footprint.</p>
                </div>
              </div>

              <div className="bg-surface-container-lowest p-6 rounded-lg border border-outline-variant flex flex-col justify-between">
                <div>
                  <ShoppingCart className="text-secondary-container mb-4" size={28} />
                  <h3 className="font-headline-sm text-base font-bold text-on-surface mb-2">Smart Procurement</h3>
                  <p className="text-on-surface-variant text-xs leading-relaxed">Automate quote requests, quotation comparisons, and PO generation.</p>
                </div>
              </div>
            </div>
          </div>
        </section>
      </main>

      {/* Footer */}
      <footer className="bg-surface border-t border-outline-variant py-12">
        <div className="max-w-7xl mx-auto px-6 flex justify-between items-center text-xs text-on-surface-variant">
          <p>© 2026 IndustrialIQ AI. All rights reserved.</p>
          <div className="flex gap-4">
            <button onClick={onGetStarted} className="hover:text-on-surface">Platform</button>
            <button onClick={onGetStarted} className="hover:text-on-surface">Privacy</button>
            <button onClick={onGetStarted} className="hover:text-on-surface">Terms</button>
          </div>
        </div>
      </footer>
    </div>
  );
}
