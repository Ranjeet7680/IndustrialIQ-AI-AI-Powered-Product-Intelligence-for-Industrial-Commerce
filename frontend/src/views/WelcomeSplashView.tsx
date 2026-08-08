"use client";

import React from 'react';
import { Bot, ArrowRight, ShieldCheck, Factory, PrecisionManufacturing, LocalShipping, Architecture } from 'lucide-react';

interface WelcomeSplashViewProps {
  onGetStarted: () => void;
  onSignIn: () => void;
}

export default function WelcomeSplashView({ onGetStarted, onSignIn }: WelcomeSplashViewProps) {
  return (
    <div className="relative min-h-screen bg-primary-container text-on-primary flex flex-col font-body-md overflow-hidden">
      {/* Background Image with Overlay */}
      <div className="absolute inset-0 z-0 industrial-bg opacity-90" />

      {/* Top Navigation */}
      <nav className="relative z-10 flex justify-between items-center px-8 py-6 w-full">
        <div className="flex items-center gap-3">
          <Bot className="text-secondary-fixed text-3xl" size={32} />
          <span className="font-headline-md text-headline-md text-on-primary font-bold">IndustrialIQ AI</span>
        </div>
        <div className="hidden md:flex gap-6 items-center">
          <button onClick={onGetStarted} className="text-body-sm text-on-primary-container hover:text-on-primary transition-colors">Solutions</button>
          <button onClick={onGetStarted} className="text-body-sm text-on-primary-container hover:text-on-primary transition-colors">Platform</button>
          <button onClick={onGetStarted} className="text-body-sm text-on-primary-container hover:text-on-primary transition-colors">Resources</button>
        </div>
      </nav>

      {/* Main Content */}
      <main className="relative z-10 flex-grow flex flex-col justify-center items-center px-4 text-center">
        <div className="max-w-4xl mx-auto space-y-8">
          {/* AI Badge */}
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full border border-secondary/30 bg-secondary/10 backdrop-blur-md mb-2">
            <ShieldCheck size={16} className="text-secondary-fixed" />
            <span className="font-label-caps text-label-caps text-secondary-fixed tracking-wider uppercase">Enterprise Grade AI</span>
          </div>

          {/* Headline */}
          <h1 className="font-display-lg text-display-lg md:text-5xl lg:text-6xl text-on-primary leading-tight font-bold tracking-tight">
            Intelligence for Every <br />
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-secondary-fixed to-tertiary-fixed-dim">
              Industrial Decision.
            </span>
          </h1>

          {/* Subheadline */}
          <p className="font-body-md text-body-md md:text-lg text-on-primary-container max-w-2xl mx-auto leading-relaxed">
            AI-powered product intelligence for smarter industrial commerce. Process complex datasets, optimize procurement, and drive operational efficiency with clarity.
          </p>

          {/* CTAs */}
          <div className="flex flex-col sm:flex-row gap-4 justify-center pt-6">
            <button
              onClick={onGetStarted}
              className="bg-secondary text-on-primary font-label-caps text-label-caps px-8 py-4 rounded hover:bg-secondary/90 transition-all flex items-center justify-center gap-2 font-bold shadow-lg"
            >
              Get Started
              <ArrowRight size={18} />
            </button>
            <button
              onClick={onSignIn}
              className="bg-transparent border border-outline-variant text-on-primary font-label-caps text-label-caps px-8 py-4 rounded hover:bg-on-primary-fixed-variant/20 transition-all font-semibold"
            >
              Sign In
            </button>
          </div>
        </div>
      </main>

      {/* Trusted By Footer */}
      <footer className="relative z-10 w-full py-10 border-t border-outline-variant/20 bg-primary-container/60 backdrop-blur-md mt-auto">
        <div className="max-w-6xl mx-auto px-6 text-center">
          <p className="font-label-caps text-label-caps text-on-primary-container mb-6 uppercase tracking-widest text-[11px]">
            Trusted by modern industrial teams
          </p>
          <div className="flex flex-wrap justify-center items-center gap-8 md:gap-16 opacity-70">
            <div className="flex items-center gap-2"><Factory size={22} /><span className="font-bold text-sm">AeroSteel</span></div>
            <div className="flex items-center gap-2"><PrecisionManufacturing size={22} /><span className="font-bold text-sm">TechMach</span></div>
            <div className="flex items-center gap-2"><LocalShipping size={22} /><span className="font-bold text-sm">GlobalLogis</span></div>
            <div className="flex items-center gap-2"><Architecture size={22} /><span className="font-bold text-sm">BuildCorp</span></div>
          </div>
        </div>
      </footer>
    </div>
  );
}
