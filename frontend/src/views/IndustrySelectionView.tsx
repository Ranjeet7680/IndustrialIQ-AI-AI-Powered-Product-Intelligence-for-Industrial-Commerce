"use client";

import React, { useState } from 'react';
import {
  PrecisionManufacturing,
  Car,
  Zap,
  Flame,
  HardHat,
  Plane,
  Cpu,
  Bot,
  Building2,
  Mountain,
  Check
} from 'lucide-react';

interface IndustrySelectionViewProps {
  onContinue: (industry: string) => void;
  onSkip: () => void;
}

export default function IndustrySelectionView({ onContinue, onSkip }: IndustrySelectionViewProps) {
  const [selected, setSelected] = useState<string>('Manufacturing');

  const sectors = [
    { id: 'Manufacturing', title: 'Manufacturing', icon: PrecisionManufacturing, desc: 'Supply chain optimization, yield analysis, and predictive maintenance.' },
    { id: 'Automotive', title: 'Automotive', icon: Car, desc: 'Just-in-time inventory tracking, part provenance, and tier-supplier management.' },
    { id: 'Energy', title: 'Energy', icon: Zap, desc: 'Grid analytics, renewable forecasting, and asset lifecycle management.' },
    { id: 'Oil & Gas', title: 'Oil & Gas', icon: Flame, desc: 'Exploration data models, pipeline monitoring, and safety compliance.' },
    { id: 'Construction', title: 'Construction', icon: HardHat, desc: 'Material procurement forecasting, site logistics, and heavy equipment utilization.' },
    { id: 'Aerospace', title: 'Aerospace', icon: Plane, desc: 'High-precision tolerance tracking and regulatory documentation.' },
    { id: 'Electronics', title: 'Electronics', icon: Cpu, desc: 'Semiconductor supply chain mapping and cleanroom data integration.' },
    { id: 'Automation', title: 'Automation', icon: Bot, desc: 'Robotics performance telemetry, PLC integration, and autonomous systems.' },
    { id: 'Infrastructure', title: 'Infrastructure', icon: Building2, desc: 'Structural health monitoring and long-term asset management.' },
    { id: 'Mining', title: 'Mining', icon: Mountain, desc: 'Extraction yield modeling, fleet telematics, and environmental impact.' }
  ];

  return (
    <div className="min-h-screen bg-surface text-on-surface flex flex-col items-center justify-center p-6 font-body-md">
      <div className="max-w-6xl w-full">
        {/* Header Section */}
        <div className="text-center mb-10">
          <h1 className="font-display-lg text-display-lg text-primary font-bold mb-3">Built for Every Industrial Sector</h1>
          <p className="font-body-md text-body-md text-on-surface-variant max-w-2xl mx-auto">
            Select your primary operating environment to customize InduIntel's data models, AI recommendations, and compliance tracking specifically for your industry's standards.
          </p>
        </div>

        {/* Bento Grid Layout */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-4">
          {sectors.map((sec) => {
            const Icon = sec.icon;
            const isSelected = selected === sec.id;
            return (
              <button
                key={sec.id}
                onClick={() => setSelected(sec.id)}
                className={`p-5 rounded-lg border text-left transition-all flex flex-col justify-between group h-full relative ${
                  isSelected
                    ? 'bg-surface-container-lowest border-secondary-container ring-2 ring-secondary-container/30 shadow-md'
                    : 'bg-surface-container-lowest border-surface-variant hover:border-secondary hover:-translate-y-0.5'
                }`}
              >
                {isSelected && (
                  <div className="absolute top-3 right-3 w-5 h-5 rounded-full bg-secondary-container text-white flex items-center justify-center">
                    <Check size={12} />
                  </div>
                )}
                <div>
                  <div className="mb-3 text-secondary group-hover:scale-110 transition-transform">
                    <Icon size={28} />
                  </div>
                  <h3 className="font-headline-sm text-base font-bold text-primary mb-1.5">{sec.title}</h3>
                  <p className="font-body-sm text-xs text-on-surface-variant leading-relaxed">{sec.desc}</p>
                </div>
              </button>
            );
          })}
        </div>

        {/* Action Bar */}
        <div className="mt-10 flex justify-between items-center border-t border-surface-variant pt-6">
          <button onClick={onSkip} className="font-body-md text-sm text-on-surface-variant hover:text-primary transition-colors font-medium">
            Skip for now
          </button>
          <button
            onClick={() => onContinue(selected)}
            className="bg-secondary text-on-secondary px-6 py-2.5 rounded font-medium text-sm hover:bg-secondary/90 transition-colors shadow-md"
          >
            Continue Setup ({selected})
          </button>
        </div>
      </div>
    </div>
  );
}
