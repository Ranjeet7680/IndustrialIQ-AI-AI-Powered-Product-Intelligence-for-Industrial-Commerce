"use client";

import React, { useEffect, useState } from 'react';
import { Sparkles, ArrowUpRight, ArrowDownRight, Minus, PlusCircle, CheckCircle2, Receipt, TrendingUp, BarChart2 } from 'lucide-react';
import { ResponsiveContainer, ComposedChart, Line, Bar, XAxis, YAxis, Tooltip, CartesianGrid, AreaChart, Area } from 'recharts';
import { getDashboardKPIs, getProcurementSpend, getPriceTrends } from '../lib/api';

interface DashboardViewProps {
  onNavigate: (tab: string) => void;
}

export default function DashboardView({ onNavigate }: DashboardViewProps) {
  const [kpis, setKpis] = useState<any>({
    products_analyzed: 12480,
    ai_recommendations: 328,
    procurement_opps: '₹24.8L',
    potential_savings: '₹8.4L',
    active_suppliers: 184,
    open_orders: 42
  });

  const [spendData, setSpendData] = useState<any[]>([
    { month: 'Jan', spend: 14.2, demand: 12.0 },
    { month: 'Feb', spend: 18.5, demand: 15.4 },
    { month: 'Mar', spend: 22.1, demand: 21.0 },
    { month: 'Apr', spend: 19.8, demand: 18.2 },
    { month: 'May', spend: 26.4, demand: 24.8 },
    { month: 'Jun', spend: 24.8, demand: 23.5 }
  ]);

  const [trendData, setTrendData] = useState<any[]>([
    { month: 'Jan', pumps: 240, valves: 45 },
    { month: 'Feb', pumps: 242, valves: 46 },
    { month: 'Mar', pumps: 239, valves: 47 },
    { month: 'Apr', pumps: 245, valves: 48 },
    { month: 'May', pumps: 248, valves: 48.5 },
    { month: 'Jun', pumps: 245, valves: 48.5 }
  ]);

  useEffect(() => {
    async function loadData() {
      try {
        const k = await getDashboardKPIs();
        if (k) setKpis(k);
        const s = await getProcurementSpend();
        if (s && Array.isArray(s)) setSpendData(s);
        const t = await getPriceTrends();
        if (t && Array.isArray(t)) setTrendData(t);
      } catch (err) {
        console.log('Using default mock analytics data.');
      }
    }
    loadData();
  }, []);

  return (
    <div className="space-y-8 font-body-md">
      {/* Header */}
      <div>
        <h1 className="font-display-lg text-headline-md md:text-display-lg text-on-surface font-bold">Good morning, Ranjeet.</h1>
        <p className="font-body-md text-sm text-on-surface-variant">Here's what's happening across your industrial commerce workspace.</p>
      </div>

      {/* AI Insight Card */}
      <div className="bg-surface-container-lowest border border-outline-variant rounded-lg p-6 ai-glow-purple relative overflow-hidden flex flex-col sm:flex-row items-start justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 mb-2">
            <Sparkles className="text-purple-600" size={18} />
            <span className="font-label-caps text-xs font-bold text-purple-700 uppercase">AI Intelligence Brief</span>
          </div>
          <p className="font-headline-sm text-base font-semibold text-on-surface">
            3 products in your procurement pipeline have experienced price increases this week.
          </p>
        </div>
        <button
          onClick={() => onNavigate('search')}
          className="px-4 py-2 bg-primary-container text-on-primary border border-primary-container rounded text-xs font-medium hover:bg-primary transition-colors shrink-0"
        >
          View Products
        </button>
      </div>

      {/* KPI Grid */}
      <div className="grid grid-cols-2 md:grid-cols-3 xl:grid-cols-6 gap-4">
        <div className="bg-surface-container-lowest border border-outline-variant rounded-lg p-4">
          <div className="text-on-surface-variant font-label-caps text-[10px] uppercase font-bold mb-1">Products Analyzed</div>
          <div className="font-headline-md text-xl font-bold text-on-surface">{(kpis?.products_analyzed ?? 12480).toLocaleString()}</div>
          <div className="mt-2 text-green-600 font-data-mono text-xs flex items-center gap-1">
            <ArrowUpRight size={14} /> 4.2%
          </div>
        </div>

        <div className="bg-surface-container-lowest border border-outline-variant rounded-lg p-4">
          <div className="text-on-surface-variant font-label-caps text-[10px] uppercase font-bold mb-1">AI Recommendations</div>
          <div className="font-headline-md text-xl font-bold text-on-surface">{kpis?.ai_recommendations ?? 328}</div>
          <div className="mt-2 text-green-600 font-data-mono text-xs flex items-center gap-1">
            <ArrowUpRight size={14} /> 12%
          </div>
        </div>

        <div className="bg-surface-container-lowest border border-outline-variant rounded-lg p-4">
          <div className="text-on-surface-variant font-label-caps text-[10px] uppercase font-bold mb-1">Procurement Opps</div>
          <div className="font-headline-md text-xl font-bold text-on-surface">{kpis?.procurement_opps ?? '₹24.8L'}</div>
          <div className="mt-2 text-on-surface-variant font-data-mono text-xs flex items-center gap-1">
            <Minus size={14} /> 0%
          </div>
        </div>

        <div className="bg-surface-container-lowest border border-outline-variant rounded-lg p-4">
          <div className="text-on-surface-variant font-label-caps text-[10px] uppercase font-bold mb-1">Potential Savings</div>
          <div className="font-headline-md text-xl font-bold text-on-surface">{kpis?.potential_savings ?? '₹8.4L'}</div>
          <div className="mt-2 text-green-600 font-data-mono text-xs flex items-center gap-1">
            <ArrowUpRight size={14} /> 2.1%
          </div>
        </div>

        <div className="bg-surface-container-lowest border border-outline-variant rounded-lg p-4">
          <div className="text-on-surface-variant font-label-caps text-[10px] uppercase font-bold mb-1">Active Suppliers</div>
          <div className="font-headline-md text-xl font-bold text-on-surface">{kpis?.active_suppliers ?? 184}</div>
          <div className="mt-2 text-red-600 font-data-mono text-xs flex items-center gap-1">
            <ArrowDownRight size={14} /> 1.5%
          </div>
        </div>

        <div className="bg-surface-container-lowest border border-outline-variant rounded-lg p-4">
          <div className="text-on-surface-variant font-label-caps text-[10px] uppercase font-bold mb-1">Open Orders</div>
          <div className="font-headline-md text-xl font-bold text-on-surface">{kpis?.open_orders ?? 42}</div>
          <div className="mt-2 text-on-surface-variant font-data-mono text-xs flex items-center gap-1">
            <Minus size={14} /> 0%
          </div>
        </div>
      </div>

      {/* Main Charts & Activity Section */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Main Chart Area */}
        <div className="lg:col-span-2 space-y-6">
          <div className="bg-surface-container-lowest border border-outline-variant rounded-lg p-6 h-[400px] flex flex-col">
            <div className="flex justify-between items-center mb-6">
              <h3 className="font-headline-sm text-base font-bold text-on-surface">Procurement Spend vs Demand (₹ Lakhs)</h3>
              <div className="flex gap-2 text-xs">
                <button className="px-2.5 py-1 text-on-surface bg-surface-container-low border border-outline-variant rounded">1M</button>
                <button className="px-2.5 py-1 text-on-primary bg-primary-container border border-primary-container rounded">6M</button>
                <button className="px-2.5 py-1 text-on-surface bg-surface-container-low border border-outline-variant rounded">1Y</button>
              </div>
            </div>
            <div className="flex-1 w-full">
              <ResponsiveContainer width="100%" height="100%">
                <ComposedChart data={spendData}>
                  <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#e4e2e4" />
                  <XAxis dataKey="month" stroke="#76777d" fontSize={12} />
                  <YAxis stroke="#76777d" fontSize={12} />
                  <Tooltip />
                  <Bar dataKey="spend" fill="#2170e4" radius={[4, 4, 0, 0]} name="Spend (₹L)" />
                  <Line type="monotone" dataKey="demand" stroke="#a855f7" strokeWidth={3} name="Demand (Index)" />
                </ComposedChart>
              </ResponsiveContainer>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="bg-surface-container-lowest border border-outline-variant rounded-lg p-6 h-[300px] flex flex-col">
              <h3 className="font-headline-sm text-base font-bold text-on-surface mb-4">Price Volatility Index</h3>
              <div className="flex-1 w-full">
                <ResponsiveContainer width="100%" height="100%">
                  <AreaChart data={trendData}>
                    <CartesianGrid strokeDasharray="3 3" stroke="#e4e2e4" />
                    <XAxis dataKey="month" fontSize={11} stroke="#76777d" />
                    <YAxis fontSize={11} stroke="#76777d" />
                    <Tooltip />
                    <Area type="monotone" dataKey="pumps" stroke="#2170e4" fill="#2170e4" fillOpacity={0.15} name="Pumps" />
                  </AreaChart>
                </ResponsiveContainer>
              </div>
            </div>

            <div className="bg-surface-container-lowest border border-outline-variant rounded-lg p-6 h-[300px] flex flex-col justify-between">
              <h3 className="font-headline-sm text-base font-bold text-on-surface mb-2">Supplier Reliability Breakdown</h3>
              <div className="space-y-3 text-xs">
                <div>
                  <div className="flex justify-between font-semibold mb-1">
                    <span>On-Time Delivery Rate</span>
                    <span className="text-green-600 font-data-mono">98.2%</span>
                  </div>
                  <div className="w-full h-2 bg-surface-container rounded-full overflow-hidden">
                    <div className="h-full bg-green-600 w-[98%]" />
                  </div>
                </div>
                <div>
                  <div className="flex justify-between font-semibold mb-1">
                    <span>Defect-Free Inspection Rate</span>
                    <span className="text-purple-600 font-data-mono">99.4%</span>
                  </div>
                  <div className="w-full h-2 bg-surface-container rounded-full overflow-hidden">
                    <div className="h-full bg-purple-600 w-[99%]" />
                  </div>
                </div>
                <div>
                  <div className="flex justify-between font-semibold mb-1">
                    <span>Average RFQ Response Time</span>
                    <span className="text-secondary font-data-mono">2.5 Hours</span>
                  </div>
                  <div className="w-full h-2 bg-surface-container rounded-full overflow-hidden">
                    <div className="h-full bg-secondary-container w-[92%]" />
                  </div>
                </div>
              </div>
              <button
                onClick={() => onNavigate('suppliers')}
                className="w-full py-2 bg-surface border border-outline-variant rounded text-xs font-semibold hover:bg-surface-container-low transition-colors mt-2"
              >
                Explore All Vetted Suppliers
              </button>
            </div>
          </div>
        </div>

        {/* Activity Timeline */}
        <div className="bg-surface-container-lowest border border-outline-variant rounded-lg p-6 flex flex-col h-full">
          <h3 className="font-headline-sm text-base font-bold text-on-surface mb-6">Recent Activity</h3>
          <div className="relative flex-1">
            <div className="absolute left-[11px] top-2 bottom-2 w-px bg-outline-variant/50" />
            <div className="space-y-6 text-xs">
              <div className="relative pl-8">
                <div className="absolute left-0 top-0.5 w-6 h-6 rounded-full bg-secondary-container/20 border border-secondary flex items-center justify-center">
                  <PlusCircle size={14} className="text-secondary" />
                </div>
                <p className="text-on-surface">New product catalog added for <strong>Industrial Valves</strong>.</p>
                <p className="font-data-mono text-[10px] text-on-surface-variant mt-1">10:45 AM, Today</p>
              </div>

              <div className="relative pl-8">
                <div className="absolute left-0 top-0.5 w-6 h-6 rounded-full bg-green-100 border border-green-600 flex items-center justify-center">
                  <CheckCircle2 size={14} className="text-green-700" />
                </div>
                <p className="text-on-surface">Supplier <strong>TechFlow Eng</strong> verified.</p>
                <p className="font-data-mono text-[10px] text-on-surface-variant mt-1">09:12 AM, Today</p>
              </div>

              <div className="relative pl-8">
                <div className="absolute left-0 top-0.5 w-6 h-6 rounded-full bg-surface-container-high border border-outline flex items-center justify-center">
                  <Receipt size={14} className="text-on-surface-variant" />
                </div>
                <p className="text-on-surface">PO #4928 generated for <strong>Reliance Steel</strong>.</p>
                <p className="font-data-mono text-[10px] text-on-surface-variant mt-1">Yesterday</p>
              </div>

              <div className="relative pl-8">
                <div className="absolute left-0 top-0.5 w-6 h-6 rounded-full bg-purple-100 border border-purple-500 flex items-center justify-center">
                  <Sparkles size={14} className="text-purple-700" />
                </div>
                <p className="text-on-surface">AI identified 15% savings opportunity on bulk order.</p>
                <p className="font-data-mono text-[10px] text-on-surface-variant mt-1">Yesterday</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
