"use client";

import React, { useEffect, useState } from 'react';
import { Factory, Sparkles, ShieldCheck, ArrowRight, CheckCircle2, Zap } from 'lucide-react';

interface WelcomeSplashViewProps {
  onGetStarted: () => void;
  onSignIn: () => void;
}

export default function WelcomeSplashView({ onGetStarted, onSignIn }: WelcomeSplashViewProps) {
  const [progress, setProgress] = useState(0);
  const [statusText, setStatusText] = useState("Initializing IndustrialIQ AI Kernel...");
  const [isCompleted, setIsCompleted] = useState(false);

  useEffect(() => {
    const interval = setInterval(() => {
      setProgress((prev) => {
        if (prev >= 100) {
          clearInterval(interval);
          setIsCompleted(true);
          return 100;
        }
        const next = prev + 5;

        if (next >= 25 && next < 55) {
          setStatusText("Connecting 500+ Industrial SKU Telemetry Nodes...");
        } else if (next >= 55 && next < 85) {
          setStatusText("Loading Vetted Supplier Reliability & Risk Matrix...");
        } else if (next >= 85) {
          setStatusText("System Loaded. Welcome to IndustrialIQ AI!");
        }
        return next;
      });
    }, 60);

    return () => clearInterval(interval);
  }, []);

  return (
    <div className="relative min-h-screen bg-[#0d1322] text-white flex flex-col justify-between items-center font-body-md overflow-hidden select-none">
      {/* Background Animated Gradient Glowing Orbs */}
      <div className="absolute top-1/4 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[500px] h-[500px] bg-purple-600/20 rounded-full blur-[120px] pointer-events-none animate-pulse" />
      <div className="absolute bottom-1/4 left-1/3 w-[400px] h-[400px] bg-blue-600/20 rounded-full blur-[100px] pointer-events-none" />

      {/* Top Header */}
      <header className="relative z-10 w-full px-6 py-6 flex justify-between items-center max-w-7xl mx-auto">
        <div className="flex items-center gap-2">
          <div className="w-8 h-8 rounded-lg bg-blue-600 flex items-center justify-center text-white shadow-lg">
            <Factory size={18} />
          </div>
          <span className="font-bold text-sm tracking-wider text-white">INDUSTRIAL<span className="text-blue-400">IQ</span></span>
        </div>
        <div className="flex items-center gap-4 text-xs font-medium">
          <button onClick={onSignIn} className="text-gray-400 hover:text-white transition-colors">Sign In</button>
          <button
            onClick={onGetStarted}
            className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-500 transition-colors font-semibold shadow-md"
          >
            Skip Intro
          </button>
        </div>
      </header>

      {/* Center Amazon-App Style Brand Loading Experience */}
      <main className="relative z-10 flex flex-col items-center justify-center text-center px-6 max-w-2xl mx-auto my-auto space-y-8">
        {/* Animated Brand Logo Icon with Outer Pulse Ring */}
        <div className="relative flex items-center justify-center">
          <div className="absolute inset-0 w-28 h-28 rounded-full border-2 border-purple-500/40 animate-ping" />
          <div className="absolute inset-0 w-28 h-28 rounded-full border-2 border-blue-500/30 animate-spin" style={{ animationDuration: '6s' }} />

          <div className="w-24 h-24 rounded-3xl bg-gradient-to-tr from-blue-700 via-purple-700 to-indigo-900 flex items-center justify-center shadow-2xl border border-white/20 relative z-10">
            <Factory size={48} className="text-white drop-shadow-md" />
            <Sparkles size={20} className="text-cyan-300 absolute top-2 right-2 animate-bounce" />
          </div>
        </div>

        {/* Title & Slogan */}
        <div className="space-y-3">
          <h1 className="text-3xl sm:text-4xl font-extrabold tracking-tight text-white">
            Industrial<span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-400 to-purple-400">IQ AI</span>
          </h1>
          <p className="text-xs sm:text-sm text-gray-400 font-medium tracking-wide uppercase">
            "Intelligence for Every Industrial Decision."
          </p>
        </div>

        {/* Progress Bar Container */}
        <div className="w-full max-w-md space-y-3 pt-4">
          <div className="w-full h-2.5 bg-gray-800/80 rounded-full overflow-hidden border border-white/10 p-0.5 shadow-inner">
            <div
              className="h-full bg-gradient-to-r from-blue-500 via-purple-500 to-cyan-400 rounded-full transition-all duration-150 shadow-md"
              style={{ width: `${progress}%` }}
            />
          </div>

          <div className="flex justify-between items-center text-[11px] font-data-mono text-gray-400">
            <span className="flex items-center gap-1.5 text-blue-300">
              <Zap size={12} className="animate-pulse" />
              <span>{statusText}</span>
            </span>
            <span className="font-bold text-white">{progress}%</span>
          </div>
        </div>

        {/* Action Button once completed */}
        {isCompleted ? (
          <button
            onClick={onGetStarted}
            className="px-8 py-3.5 bg-gradient-to-r from-blue-600 to-purple-600 text-white rounded-xl font-bold text-sm shadow-xl hover:scale-105 transition-all flex items-center gap-2 animate-bounce"
          >
            <span>Enter IndustrialIQ Workspace</span>
            <ArrowRight size={18} />
          </button>
        ) : (
          <div className="flex items-center gap-2 text-xs text-gray-500">
            <ShieldCheck size={14} className="text-green-400" />
            <span>ISO 9001 & Enterprise AI Certified Engine</span>
          </div>
        )}
      </main>

      {/* Bottom Telemetry Footer */}
      <footer className="relative z-10 w-full py-6 text-center text-xs text-gray-500 border-t border-white/5 bg-black/20 backdrop-blur-md">
        <div className="max-w-7xl mx-auto px-6 flex flex-col sm:flex-row justify-between items-center gap-2">
          <span>© 2026 IndustrialIQ AI. All rights reserved.</span>
          <div className="flex items-center gap-4 text-[11px]">
            <span className="text-gray-400">v2.4.0 Production</span>
            <span className="text-green-400 flex items-center gap-1"><span className="w-1.5 h-1.5 rounded-full bg-green-400 animate-ping" /> System Operational</span>
          </div>
        </div>
      </footer>
    </div>
  );
}
