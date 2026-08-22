"use client";

import React, { useState } from 'react';
import {
  HelpCircle,
  Search,
  BookOpen,
  MessageSquare,
  Bot,
  FileText,
  ShieldCheck,
  CheckCircle2,
  ChevronDown,
  ChevronUp,
  Send,
  Sparkles,
  PhoneCall,
  Mail,
  Zap,
  Box,
  Layers,
  ArrowRight,
  ExternalLink
} from 'lucide-react';

interface HelpViewProps {
  onNavigate?: (tab: string) => void;
}

export default function HelpView({ onNavigate }: HelpViewProps) {
  const [searchQuery, setSearchQuery] = useState('');
  const [expandedFaq, setExpandedFaq] = useState<number | null>(0);
  const [ticketSubject, setTicketSubject] = useState('');
  const [ticketMsg, setTicketMsg] = useState('');
  const [ticketSubmitted, setTicketSubmitted] = useState(false);

  const faqs = [
    {
      question: 'How does the IndustrialIQ AI Confidence Score work?',
      answer: 'Our 7-factor explainable AI algorithm evaluates quality historical data, supplier delivery SLAs, spec compliance, material grades, warranty period, market price alignment, and customer reviews to assign a weighted score from 0-100%.'
    },
    {
      question: 'How do I activate speech input in Hindi or Hinglish for AI Voice Copilot?',
      answer: 'Click the Microphone icon in the top navbar or inside the Copilot page. Speak naturally in Hindi or English (e.g. "Namaste! Centrifugal pumps under 3 lakh find karo"). Ensure microphone permissions are allowed in Chrome or Edge.'
    },
    {
      question: 'How do I create and export a formal Purchase Request or RFQ?',
      answer: 'You can ask Copilot to "Draft an RFQ for 10 units of 150kW IE4 Motors", or navigate to the Procurement tab and click "+ Create Request". You can export generated RFQs as vendor-ready PDF or copy them directly.'
    },
    {
      question: 'How do I interact with the 3D Network Facility Digital Twin?',
      answer: 'Open the 3D Network tab. Click and drag your mouse to rotate the 3D grid 360°, scroll to zoom in/out, and toggle between Heatmap, Power Pulse, and Risk Audit views. Click any equipment model to view live sensor telemetry.'
    },
    {
      question: 'What integrations are supported for ERP systems like SAP or Oracle?',
      answer: 'IndustrialIQ supports REST API and Webhook connectors for SAP S/4HANA, Oracle SCM, and Siemens MindSphere IoT. Access API keys from Profile > Security & API Keys.'
    }
  ];

  const handleTicketSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!ticketSubject || !ticketMsg) return;
    setTicketSubmitted(true);
    setTimeout(() => {
      setTicketSubmitted(false);
      setTicketSubject('');
      setTicketMsg('');
    }, 4000);
  };

  const filteredFaqs = faqs.filter(
    (f) =>
      f.question.toLowerCase().includes(searchQuery.toLowerCase()) ||
      f.answer.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className="space-y-8 max-w-[1400px] mx-auto font-body-md">
      {/* Search Header Banner */}
      <div className="bg-gradient-to-r from-purple-900/40 via-surface-container-high/60 to-primary-container/40 border border-outline-variant/60 rounded-3xl p-8 shadow-sm text-center relative overflow-hidden">
        <div className="max-w-2xl mx-auto space-y-4 relative z-10">
          <div className="inline-flex items-center gap-2 px-3 py-1 bg-purple-500/20 text-purple-700 dark:text-purple-300 rounded-full border border-purple-500/30 text-xs font-bold uppercase tracking-wider">
            <HelpCircle size={14} /> Help & Support Center
          </div>

          <h1 className="font-headline-sm text-2xl md:text-3xl font-extrabold text-on-surface">
            How can we assist your industrial procurement today?
          </h1>

          {/* Search Input Bar */}
          <div className="relative max-w-xl mx-auto">
            <Search size={18} className="absolute left-4 top-1/2 -translate-y-1/2 text-on-surface-variant" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search guides, RFQ help, 3D facility, AI voice assistant setup..."
              className="w-full bg-surface border border-outline-variant/80 rounded-2xl pl-11 pr-4 py-3.5 text-xs sm:text-sm text-on-surface focus:border-purple-500 focus:ring-2 focus:ring-purple-500/20 outline-none transition-all shadow-md"
            />
          </div>
        </div>
      </div>

      {/* Quick Category Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-4">
        <div
          onClick={() => setSearchQuery('Copilot')}
          className="bg-surface border border-outline-variant/50 hover:border-purple-500/50 p-5 rounded-2xl cursor-pointer transition-all shadow-sm group hover:-translate-y-1"
        >
          <div className="w-10 h-10 rounded-xl bg-purple-500/15 text-purple-600 dark:text-purple-400 flex items-center justify-center mb-3 group-hover:scale-110 transition-transform">
            <Bot size={22} />
          </div>
          <h3 className="font-bold text-sm text-on-surface group-hover:text-purple-600 dark:group-hover:text-purple-400 transition-colors">
            AI Voice Copilot
          </h3>
          <p className="text-xs text-on-surface-variant mt-1">Hindi/English speech setup & prompt guides</p>
        </div>

        <div
          onClick={() => setSearchQuery('3D')}
          className="bg-surface border border-outline-variant/50 hover:border-blue-500/50 p-5 rounded-2xl cursor-pointer transition-all shadow-sm group hover:-translate-y-1"
        >
          <div className="w-10 h-10 rounded-xl bg-blue-500/15 text-blue-600 dark:text-blue-400 flex items-center justify-center mb-3 group-hover:scale-110 transition-transform">
            <Box size={22} />
          </div>
          <h3 className="font-bold text-sm text-on-surface group-hover:text-blue-600 dark:group-hover:text-blue-400 transition-colors">
            3D Facility Twin
          </h3>
          <p className="text-xs text-on-surface-variant mt-1">Interactive node navigation & heatmap modes</p>
        </div>

        <div
          onClick={() => setSearchQuery('RFQ')}
          className="bg-surface border border-outline-variant/50 hover:border-emerald-500/50 p-5 rounded-2xl cursor-pointer transition-all shadow-sm group hover:-translate-y-1"
        >
          <div className="w-10 h-10 rounded-xl bg-emerald-500/15 text-emerald-600 dark:text-emerald-400 flex items-center justify-center mb-3 group-hover:scale-110 transition-transform">
            <FileText size={22} />
          </div>
          <h3 className="font-bold text-sm text-on-surface group-hover:text-emerald-600 dark:group-hover:text-emerald-400 transition-colors">
            RFQ & Procurement
          </h3>
          <p className="text-xs text-on-surface-variant mt-1">Multi-vendor quote comparison & PO generation</p>
        </div>

        <div
          onClick={() => setSearchQuery('API')}
          className="bg-surface border border-outline-variant/50 hover:border-amber-500/50 p-5 rounded-2xl cursor-pointer transition-all shadow-sm group hover:-translate-y-1"
        >
          <div className="w-10 h-10 rounded-xl bg-amber-500/15 text-amber-600 dark:text-amber-400 flex items-center justify-center mb-3 group-hover:scale-110 transition-transform">
            <Zap size={22} />
          </div>
          <h3 className="font-bold text-sm text-on-surface group-hover:text-amber-600 dark:group-hover:text-amber-400 transition-colors">
            ERP API Integration
          </h3>
          <p className="text-xs text-on-surface-variant mt-1">SAP, Oracle & Siemens MindSphere setup</p>
        </div>
      </div>

      {/* Main Grid: Left FAQs, Right Ticket & Telemetry */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        {/* FAQs Section (7 Cols) */}
        <div className="lg:col-span-7 space-y-4">
          <h2 className="font-headline-sm text-lg font-bold text-on-surface flex items-center gap-2">
            <BookOpen size={20} className="text-purple-600" /> Frequently Asked Questions
          </h2>

          <div className="space-y-3">
            {filteredFaqs.length > 0 ? (
              filteredFaqs.map((faq, idx) => {
                const isOpen = expandedFaq === idx;
                return (
                  <div
                    key={idx}
                    className="bg-surface border border-outline-variant/50 rounded-2xl overflow-hidden transition-all shadow-sm"
                  >
                    <button
                      onClick={() => setExpandedFaq(isOpen ? null : idx)}
                      className="w-full p-4 text-left font-semibold text-xs sm:text-sm text-on-surface flex items-center justify-between gap-4 hover:bg-surface-container-low transition-colors"
                    >
                      <span>{faq.question}</span>
                      {isOpen ? (
                        <ChevronUp size={18} className="text-purple-600 shrink-0" />
                      ) : (
                        <ChevronDown size={18} className="text-on-surface-variant shrink-0" />
                      )}
                    </button>

                    {isOpen && (
                      <div className="p-4 pt-0 text-xs text-on-surface-variant border-t border-outline-variant/30 leading-relaxed bg-surface-container-lowest">
                        {faq.answer}
                      </div>
                    )}
                  </div>
                );
              })
            ) : (
              <div className="p-8 text-center bg-surface border border-outline-variant/50 rounded-2xl text-xs text-on-surface-variant">
                No matching articles found for "{searchQuery}". Please submit a ticket below!
              </div>
            )}
          </div>
        </div>

        {/* Live Support Ticket & Telemetry (5 Cols) */}
        <div className="lg:col-span-5 space-y-6">
          {/* Submit Support Ticket Form */}
          <div className="bg-surface border border-outline-variant/50 rounded-2xl p-6 shadow-sm space-y-4">
            <h3 className="font-headline-sm text-sm font-bold text-on-surface flex items-center gap-2">
              <MessageSquare size={16} className="text-purple-600" /> Submit Priority Support Ticket
            </h3>

            {ticketSubmitted ? (
              <div className="p-4 bg-emerald-500/10 border border-emerald-500/30 rounded-xl text-emerald-700 dark:text-emerald-300 text-xs space-y-1">
                <div className="font-bold flex items-center gap-1.5">
                  <CheckCircle2 size={16} /> Ticket Submitted Successfully!
                </div>
                <p className="text-[11px]">Ticket #IIQ-8891 assigned. Concierge SLA: Response within 15 mins.</p>
              </div>
            ) : (
              <form onSubmit={handleTicketSubmit} className="space-y-3 text-xs">
                <div>
                  <label className="font-semibold text-on-surface-variant block mb-1">Subject</label>
                  <input
                    type="text"
                    required
                    value={ticketSubject}
                    onChange={(e) => setTicketSubject(e.target.value)}
                    placeholder="e.g., API key authorization error"
                    className="w-full bg-surface-container-low border border-outline-variant/60 rounded-xl px-3 py-2 text-on-surface outline-none focus:border-purple-500"
                  />
                </div>

                <div>
                  <label className="font-semibold text-on-surface-variant block mb-1">Issue Description</label>
                  <textarea
                    rows={3}
                    required
                    value={ticketMsg}
                    onChange={(e) => setTicketMsg(e.target.value)}
                    placeholder="Describe your request or technical query..."
                    className="w-full bg-surface-container-low border border-outline-variant/60 rounded-xl px-3 py-2 text-on-surface outline-none focus:border-purple-500"
                  />
                </div>

                <button
                  type="submit"
                  className="w-full py-2.5 bg-purple-600 hover:bg-purple-700 text-white font-bold rounded-xl transition-colors flex items-center justify-center gap-2 text-xs shadow-md"
                >
                  <Send size={14} /> Send Ticket to Concierge Support
                </button>
              </form>
            )}
          </div>

          {/* Platform Status Telemetry */}
          <div className="bg-surface border border-outline-variant/50 rounded-2xl p-5 shadow-sm space-y-3 text-xs">
            <h4 className="font-bold text-on-surface flex items-center justify-between">
              <span>System Operational Status</span>
              <span className="text-[10px] text-emerald-600 dark:text-emerald-400 font-mono font-bold flex items-center gap-1">
                <span className="w-2 h-2 rounded-full bg-emerald-500 animate-ping" /> 100% Operational
              </span>
            </h4>

            <div className="space-y-2 text-[11px]">
              <div className="flex justify-between py-1 border-b border-outline-variant/30">
                <span className="text-on-surface-variant">Gemini 3.6 AI Engine API:</span>
                <span className="font-semibold text-emerald-600">Operational (120ms)</span>
              </div>
              <div className="flex justify-between py-1 border-b border-outline-variant/30">
                <span className="text-on-surface-variant">Vercel Edge Network:</span>
                <span className="font-semibold text-emerald-600">Operational (45ms)</span>
              </div>
              <div className="flex justify-between py-1 border-b border-outline-variant/30">
                <span className="text-on-surface-variant">3D Telemetry WebGL Engine:</span>
                <span className="font-semibold text-emerald-600">Operational (60 FPS)</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
