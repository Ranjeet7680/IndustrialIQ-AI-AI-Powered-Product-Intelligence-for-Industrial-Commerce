"use client";

import React, { useState } from 'react';
import {
  Sparkles,
  ArrowRight,
  CheckCircle2,
  Search,
  Factory,
  ShoppingCart,
  Shield,
  Bot,
  Box,
  FileText,
  Building2,
  TrendingUp,
  Cpu,
  Layers,
  X,
  BookOpen,
  Download,
  ExternalLink,
  ShieldCheck,
  Zap
} from 'lucide-react';

interface LandingViewProps {
  onGetStarted: () => void;
  onSignIn: () => void;
}

export default function LandingView({ onGetStarted, onSignIn }: LandingViewProps) {
  const [activeTabSection, setActiveTabSection] = useState<'hero' | 'platform' | 'solutions' | 'resources'>('hero');
  const [selectedResourceModal, setSelectedResourceModal] = useState<any>(null);

  const scrollToSection = (sectionId: string) => {
    const el = document.getElementById(sectionId);
    if (el) {
      el.scrollIntoView({ behavior: 'smooth' });
    }
  };

  const solutions = [
    {
      id: 'heavy-mfg',
      title: 'Heavy Manufacturing & Capital Equipment',
      icon: Factory,
      desc: 'Optimize procurement for high-load multi-stage pumps, 150kW IE4 motors, and industrial valve stacks with 98% AI accuracy.',
      stats: '14.2% Average Cost Reduction'
    },
    {
      id: 'oil-gas',
      title: 'Oil & Gas & Chemical Processing',
      icon: ShieldCheck,
      desc: 'Source API 6D Trunnion valves, SS 316 chemical dosing pumps, and explosion-proof telemetry with ISO 9001 compliance.',
      stats: 'Zero SLA Delivery Delays'
    },
    {
      id: 'automotive',
      title: 'Automotive & Precision Robotics',
      icon: Cpu,
      desc: 'Procure 6-axis robotic arms, servo drives, and high-precision spherical bearings with real-time supplier risk telemetry.',
      stats: '99.4% Spec Compliance'
    },
    {
      id: 'energy',
      title: 'Energy & Utilities Generation',
      icon: Zap,
      desc: 'Streamline heavy transformer spares, rotary screw compressors, and smart grid SCADA controllers.',
      stats: '24/7 Priority SLA'
    }
  ];

  const resources = [
    {
      id: 'whitepaper-1',
      title: '2026 Enterprise Industrial AI Procurement Whitepaper',
      category: 'Research Report',
      desc: 'How explainable 7-factor AI confidence scoring eliminates supplier default risks across 500+ SKUs.',
      downloadUrl: '#'
    },
    {
      id: 'casestudy-1',
      title: 'Case Study: Tata Heavy Industries Reduces RFQ SLA by 68%',
      category: 'Case Study',
      desc: 'Automating multi-vendor quotation comparison and purchase order generation.',
      downloadUrl: '#'
    },
    {
      id: 'guide-1',
      title: 'Multimodal Hindi & Hinglish Speech AI Integration Guide',
      category: 'Technical Specs',
      desc: 'Connecting voice search telemetry to enterprise SAP S/4HANA ERP workflows.',
      downloadUrl: '#'
    }
  ];

  return (
    <div className="min-h-screen bg-surface-container-lowest text-on-surface font-body-md">
      {/* Top Header Navbar */}
      <header className="fixed top-0 left-0 right-0 z-50 bg-surface-container-lowest/90 backdrop-blur-md border-b border-outline-variant h-16 flex justify-between items-center px-6">
        <div className="flex items-center gap-8">
          <div className="flex items-center gap-2 cursor-pointer" onClick={onGetStarted}>
            <Factory className="text-secondary-container" size={24} />
            <span className="font-headline-sm text-headline-sm text-on-surface font-bold tracking-tight">
              IndustrialIQ AI
            </span>
          </div>

          <nav className="hidden md:flex items-center gap-6 text-sm text-on-surface-variant font-medium">
            <button onClick={() => scrollToSection('platform')} className="hover:text-on-surface transition-colors">
              Platform
            </button>
            <button onClick={() => scrollToSection('solutions')} className="hover:text-on-surface transition-colors">
              Solutions
            </button>
            <button onClick={() => scrollToSection('resources')} className="hover:text-on-surface transition-colors">
              Resources
            </button>
          </nav>
        </div>

        <div className="flex items-center gap-4 text-sm">
          <button onClick={onSignIn} className="text-on-surface-variant hover:text-on-surface font-medium">
            Sign In
          </button>
          <button
            onClick={onGetStarted}
            className="bg-primary-container text-on-primary px-4 py-2 rounded font-medium hover:bg-primary transition-colors shadow-md"
          >
            Enter Platform
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
                className="bg-primary-container text-on-primary px-6 py-3 rounded font-medium hover:bg-primary transition-colors flex items-center gap-2 shadow-lg"
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

        {/* PLATFORM SECTION */}
        <section id="platform" className="bg-surface-container-low py-20 border-t border-outline-variant">
          <div className="max-w-7xl mx-auto px-6 space-y-12">
            <div className="text-center max-w-2xl mx-auto space-y-3">
              <span className="text-xs font-bold text-purple-600 uppercase tracking-widest bg-purple-100 px-3 py-1 rounded-full">
                Core Architecture
              </span>
              <h2 className="font-headline-md text-3xl font-bold text-on-surface">
                The IndustrialIQ AI Platform
              </h2>
              <p className="text-on-surface-variant text-sm">
                Next-generation 500-SKU catalog intelligence, 3D facility digital twins, and voice-assisted RFQs.
              </p>
            </div>

            <div className="grid md:grid-cols-4 gap-6">
              <div className="bg-surface-container-lowest p-6 rounded-2xl border border-outline-variant shadow-sm space-y-4">
                <Search className="text-secondary-container" size={32} />
                <h3 className="font-bold text-base text-on-surface">Semantic AI Search</h3>
                <p className="text-on-surface-variant text-xs leading-relaxed">
                  Query across 500+ industrial SKUs by pressure, flow rate, RPM, and material compliance.
                </p>
              </div>

              <div className="bg-surface-container-lowest p-6 rounded-2xl border border-purple-500/40 shadow-sm space-y-4">
                <Bot className="text-purple-600" size={32} />
                <h3 className="font-bold text-base text-on-surface">Multimodal Voice Copilot</h3>
                <p className="text-on-surface-variant text-xs leading-relaxed">
                  Hands-free Hindi & English speech assistant for technical spec matching and automatic RFQ drafts.
                </p>
              </div>

              <div className="bg-surface-container-lowest p-6 rounded-2xl border border-outline-variant shadow-sm space-y-4">
                <Box className="text-blue-600" size={32} />
                <h3 className="font-bold text-base text-on-surface">3D Facility Twin</h3>
                <p className="text-on-surface-variant text-xs leading-relaxed">
                  Interactive 3D network with Thermal Heatmap, Power Pulse, and Risk Audit visualization modes.
                </p>
              </div>

              <div className="bg-surface-container-lowest p-6 rounded-2xl border border-outline-variant shadow-sm space-y-4">
                <FileText className="text-emerald-600" size={32} />
                <h3 className="font-bold text-base text-on-surface">Automated RFQ & PO Desk</h3>
                <p className="text-on-surface-variant text-xs leading-relaxed">
                  Generate vendor-ready RFQ drafts, compare multi-supplier quotations, and create POs instantly.
                </p>
              </div>
            </div>
          </div>
        </section>

        {/* SOLUTIONS SECTION */}
        <section id="solutions" className="py-20 bg-surface-container-lowest border-t border-outline-variant">
          <div className="max-w-7xl mx-auto px-6 space-y-12">
            <div className="text-center max-w-2xl mx-auto space-y-3">
              <span className="text-xs font-bold text-blue-600 uppercase tracking-widest bg-blue-100 px-3 py-1 rounded-full">
                Industry Solutions
              </span>
              <h2 className="font-headline-md text-3xl font-bold text-on-surface">
                Tailored Solutions for Industrial Sectors
              </h2>
              <p className="text-on-surface-variant text-sm">
                Engineered for heavy manufacturing, chemical processing, automotive, and power utilities.
              </p>
            </div>

            <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6">
              {solutions.map((sol) => {
                const Icon = sol.icon;
                return (
                  <div
                    key={sol.id}
                    className="p-6 bg-surface border border-outline-variant rounded-2xl shadow-sm hover:border-secondary transition-all space-y-4 flex flex-col justify-between"
                  >
                    <div className="space-y-3">
                      <div className="w-12 h-12 rounded-xl bg-primary-container/10 text-primary flex items-center justify-center">
                        <Icon size={24} />
                      </div>
                      <h3 className="font-bold text-sm text-on-surface">{sol.title}</h3>
                      <p className="text-xs text-on-surface-variant leading-relaxed">{sol.desc}</p>
                    </div>

                    <div className="pt-3 border-t border-outline-variant/40 text-[11px] font-bold text-emerald-600 font-data-mono">
                      {sol.stats}
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </section>

        {/* RESOURCES SECTION */}
        <section id="resources" className="py-20 bg-surface-container-low border-t border-outline-variant">
          <div className="max-w-7xl mx-auto px-6 space-y-12">
            <div className="text-center max-w-2xl mx-auto space-y-3">
              <span className="text-xs font-bold text-emerald-600 uppercase tracking-widest bg-emerald-100 px-3 py-1 rounded-full">
                Knowledge & Research
              </span>
              <h2 className="font-headline-md text-3xl font-bold text-on-surface">
                Industrial Intelligence Resources
              </h2>
              <p className="text-on-surface-variant text-sm">
                Explore whitepapers, customer case studies, and technical API documentation.
              </p>
            </div>

            <div className="grid md:grid-cols-3 gap-6">
              {resources.map((res) => (
                <div
                  key={res.id}
                  className="bg-surface-container-lowest p-6 rounded-2xl border border-outline-variant shadow-sm space-y-4 flex flex-col justify-between"
                >
                  <div className="space-y-3">
                    <span className="text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded bg-purple-100 text-purple-800">
                      {res.category}
                    </span>
                    <h3 className="font-bold text-sm text-on-surface">{res.title}</h3>
                    <p className="text-xs text-on-surface-variant leading-relaxed">{res.desc}</p>
                  </div>

                  <button
                    onClick={() => setSelectedResourceModal(res)}
                    className="w-full py-2.5 bg-surface-container hover:bg-surface-container-high text-on-surface font-semibold text-xs rounded-xl transition-colors flex items-center justify-center gap-1.5"
                  >
                    <BookOpen size={14} /> View Resource Details
                  </button>
                </div>
              ))}
            </div>
          </div>
        </section>
      </main>

      {/* Resource Modal Viewer */}
      {selectedResourceModal && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-surface-container-lowest border border-outline-variant rounded-2xl p-6 max-w-lg w-full shadow-2xl space-y-4 animate-in fade-in zoom-in duration-200">
            <div className="flex justify-between items-start border-b border-outline-variant pb-3">
              <div>
                <span className="text-[10px] font-bold uppercase text-purple-700 bg-purple-100 px-2 py-0.5 rounded">
                  {selectedResourceModal.category}
                </span>
                <h3 className="font-bold text-base text-on-surface mt-1">{selectedResourceModal.title}</h3>
              </div>
              <button
                onClick={() => setSelectedResourceModal(null)}
                className="p-1 text-on-surface-variant hover:text-on-surface font-bold"
              >
                <X size={18} />
              </button>
            </div>

            <p className="text-xs text-on-surface-variant leading-relaxed">
              {selectedResourceModal.desc}
            </p>

            <div className="p-3 bg-surface-container rounded-xl border border-outline-variant/60 text-xs text-on-surface-variant space-y-1 font-data-mono">
              <div>Format: PDF & Interactive Telemetry</div>
              <div>Published: August 2026 • IndustrialIQ Research</div>
            </div>

            <div className="flex justify-end gap-3 pt-2">
              <button
                onClick={() => setSelectedResourceModal(null)}
                className="px-4 py-2 bg-surface-container hover:bg-surface-container-high rounded-xl text-xs font-semibold"
              >
                Close
              </button>
              <button
                onClick={() => {
                  alert(`Downloading ${selectedResourceModal.title}...`);
                  setSelectedResourceModal(null);
                }}
                className="px-4 py-2 bg-primary-container text-on-primary font-bold rounded-xl text-xs flex items-center gap-1.5"
              >
                <Download size={14} /> Download PDF
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Footer */}
      <footer className="bg-surface border-t border-outline-variant py-12">
        <div className="max-w-7xl mx-auto px-6 flex flex-col md:flex-row justify-between items-center text-xs text-on-surface-variant gap-4">
          <p>© 2026 IndustrialIQ AI. All rights reserved.</p>
          <div className="flex gap-6">
            <button onClick={() => scrollToSection('platform')} className="hover:text-on-surface">Platform</button>
            <button onClick={() => scrollToSection('solutions')} className="hover:text-on-surface">Solutions</button>
            <button onClick={() => scrollToSection('resources')} className="hover:text-on-surface">Resources</button>
          </div>
        </div>
      </footer>
    </div>
  );
}
