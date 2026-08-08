"use client";

import React from 'react';
import { CheckCircle2, Sparkles, Factory, BadgeCheck, ArrowRight, Bot } from 'lucide-react';

interface SetupCompleteViewProps {
  industry: string;
  onEnterDashboard: () => void;
}

export default function SetupCompleteView({ industry, onEnterDashboard }: SetupCompleteViewProps) {
  return (
    <div className="bg-background text-on-surface min-h-screen flex items-center justify-center p-6 font-body-md">
      <main className="w-full max-w-2xl bg-surface-container-lowest border border-outline-variant rounded-lg p-8 shadow-sm relative overflow-hidden">
        {/* AI Top Accent Border */}
        <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-purple-500 via-secondary-container to-cyan-400" />

        <div className="flex flex-col items-center text-center">
          {/* Success Icon */}
          <div className="relative flex items-center justify-center w-20 h-20 mb-6">
            <div className="absolute inset-0 bg-secondary-container/10 rounded-full animate-ping" />
            <div className="bg-secondary-container text-on-secondary rounded-full p-4 z-10 flex items-center justify-center shadow-lg">
              <CheckCircle2 size={40} />
            </div>
            <Sparkles className="absolute -top-1 -right-1 text-tertiary-fixed-dim text-purple-600" size={20} />
          </div>

          {/* Headline */}
          <h1 className="font-display-lg text-headline-md sm:text-display-lg font-bold text-on-surface mb-2 tracking-tight">
            Your IndustrialIQ Workspace Is Ready
          </h1>
          <p className="font-body-md text-sm text-on-surface-variant mb-8 max-w-lg">
            We've synthesized your profile to configure a high-density, analytical environment tailored to your operational parameters.
          </p>

          {/* Summary Section */}
          <div className="w-full grid grid-cols-1 sm:grid-cols-2 gap-4 mb-8 text-left text-xs">
            <div className="bg-surface-container-low border border-outline-variant rounded p-4 flex flex-col gap-2">
              <span className="font-label-caps uppercase text-[10px] text-on-surface-variant font-bold">Operational Context</span>
              <div className="flex items-center gap-2">
                <Factory size={18} className="text-secondary" />
                <div>
                  <div className="text-on-surface-variant">Industry</div>
                  <div className="font-bold text-on-surface">{industry}</div>
                </div>
              </div>
              <div className="w-full h-px bg-outline-variant/50 my-1" />
              <div className="flex items-center gap-2">
                <BadgeCheck size={18} className="text-secondary" />
                <div>
                  <div className="text-on-surface-variant">Role</div>
                  <div className="font-bold text-on-surface">Procurement Director</div>
                </div>
              </div>
            </div>

            <div className="bg-surface-container-low border border-outline-variant rounded p-4 flex flex-col gap-2">
              <span className="font-label-caps uppercase text-[10px] text-on-surface-variant font-bold">Primary Objectives</span>
              <ul className="space-y-1.5 mt-1 text-on-surface">
                <li className="flex items-center gap-2">
                  <span className="w-1.5 h-1.5 rounded-full bg-secondary-container" />
                  <span>Reduce Supply Chain Volatility</span>
                </li>
                <li className="flex items-center gap-2">
                  <span className="w-1.5 h-1.5 rounded-full bg-secondary-container" />
                  <span>Optimize Raw Material Costs</span>
                </li>
                <li className="flex items-center gap-2">
                  <span className="w-1.5 h-1.5 rounded-full bg-secondary-container" />
                  <span>Supplier Risk Mitigation</span>
                </li>
              </ul>
            </div>
          </div>

          {/* CTA */}
          <button
            onClick={onEnterDashboard}
            className="bg-primary-container text-on-primary border border-transparent rounded px-8 py-3 font-semibold text-sm flex items-center justify-center gap-2 hover:bg-primary transition-all shadow-md group w-full sm:w-auto"
          >
            <span>Enter Dashboard</span>
            <ArrowRight size={16} className="group-hover:translate-x-1 transition-transform" />
          </button>

          <div className="mt-4 flex items-center gap-1.5 justify-center opacity-70 text-[11px] font-data-mono text-on-surface-variant">
            <Bot size={14} className="text-primary" />
            <span>Workspace dynamically calibrated by InduIntel AI</span>
          </div>
        </div>
      </main>
    </div>
  );
}
