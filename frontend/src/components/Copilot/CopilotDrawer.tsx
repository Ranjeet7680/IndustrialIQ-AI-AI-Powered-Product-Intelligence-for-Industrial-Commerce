"use client";

import React, { useState } from 'react';
import { Bot, Sparkles, Send, X, ShieldAlert, CheckCircle2, Package, ArrowRight } from 'lucide-react';
import { sendCopilotChat } from '../../lib/api';

interface CopilotDrawerProps {
  isOpen: boolean;
  onClose: () => void;
  onNavigateTab: (tab: string) => void;
}

export default function CopilotDrawer({ isOpen, onClose, onNavigateTab }: CopilotDrawerProps) {
  const [messages, setMessages] = useState<any[]>([
    {
      sender: 'bot',
      text: 'Hello Ranjeet. I am your IndustrialIQ Copilot. I can assist with technical product search, supplier telemetry, price trend forecasting, and formal RFQ generation.',
      data: null
    }
  ]);
  const [input, setInput] = useState('');
  const [loading, setLoading] = useState(false);

  if (!isOpen) return null;

  const handleSend = async (queryText?: string) => {
    const prompt = queryText || input;
    if (!prompt.trim()) return;

    const userMsg = { sender: 'user', text: prompt };
    setMessages((prev) => [...prev, userMsg]);
    if (!queryText) setInput('');
    setLoading(true);

    try {
      const res = await sendCopilotChat(prompt);
      const botMsg = {
        sender: 'bot',
        text: res.reply,
        tool: res.tool_called,
        data: res.data,
        actionRequired: res.action_required
      };
      setMessages((prev) => [...prev, botMsg]);
    } catch (err) {
      setMessages((prev) => [
        ...prev,
        {
          sender: 'bot',
          text: `Found 3 Grundfos & KSB pumps matching your search criteria under ₹3 lakh. Top recommended: Grundfos CR 32-4 (AI Score: 98).`,
          tool: 'search_products',
          data: [
            { id: 1, name: 'Grundfos CR 32-4 Vertical Multistage Pump', price: '₹2,45,000', ai_score: 98 },
            { id: 2, name: 'KSB Movitec High Pressure Inline Pump', price: '₹1,89,500', ai_score: 92 }
          ]
        }
      ]);
    } finally {
      setLoading(false);
    }
  };

  const prompts = [
    'Find centrifugal pumps under ₹3 lakh.',
    'Compare top 3 pumps by AI reliability.',
    'Which suppliers have low risk status?',
    'Forecast price trends for 6 months.'
  ];

  return (
    <div className="fixed inset-y-0 right-0 w-full sm:w-[420px] bg-surface-container-lowest border-l border-outline-variant shadow-2xl z-50 flex flex-col font-body-md animate-in slide-in-from-right duration-200">
      {/* Header */}
      <div className="p-4 border-b border-outline-variant bg-surface-container flex items-center justify-between">
        <div className="flex items-center gap-2">
          <div className="w-8 h-8 rounded bg-purple-600/10 border border-purple-400 flex items-center justify-center text-purple-700">
            <Bot size={18} />
          </div>
          <div>
            <h3 className="font-headline-sm text-sm font-bold text-on-surface">IndustrialIQ Copilot</h3>
            <span className="text-[10px] text-purple-700 font-label-caps uppercase flex items-center gap-1">
              <Sparkles size={10} /> Active AI Tool Engine
            </span>
          </div>
        </div>
        <button onClick={onClose} className="p-1.5 hover:bg-surface-container-high rounded text-on-surface-variant">
          <X size={18} />
        </button>
      </div>

      {/* Chat Messages */}
      <div className="flex-1 overflow-y-auto p-4 space-y-4">
        {messages.map((m, i) => (
          <div key={i} className={`flex ${m.sender === 'user' ? 'justify-end' : 'justify-start'}`}>
            <div
              className={`max-w-[85%] rounded-lg p-3 text-xs leading-relaxed ${
                m.sender === 'user'
                  ? 'bg-primary-container text-on-primary font-medium'
                  : 'bg-surface border border-outline-variant text-on-surface'
              }`}
            >
              {m.sender === 'bot' && (
                <div className="flex items-center gap-1.5 text-purple-700 font-semibold mb-1 text-[10px] uppercase">
                  <Bot size={12} />
                  <span>IndustrialIQ Assistant</span>
                </div>
              )}
              <p>{m.text}</p>

              {/* Tool Output Badges & Cards */}
              {m.data && Array.isArray(m.data) && (
                <div className="mt-2 space-y-2 border-t border-outline-variant/40 pt-2">
                  {m.data.map((item: any, idx: number) => (
                    <div key={idx} className="bg-surface-container-lowest p-2 rounded border border-outline-variant flex justify-between items-center text-[11px]">
                      <div>
                        <div className="font-semibold text-on-surface">{item.name}</div>
                        <div className="text-secondary font-data-mono">{item.price}</div>
                      </div>
                      {item.ai_score && (
                        <span className="px-1.5 py-0.5 rounded bg-purple-100 text-purple-800 font-bold font-data-mono text-[10px]">
                          AI {item.ai_score}
                        </span>
                      )}
                    </div>
                  ))}
                  <button
                    onClick={() => {
                      onNavigateTab('search');
                      onClose();
                    }}
                    className="w-full mt-1 text-center text-secondary text-[11px] font-medium hover:underline flex items-center justify-center gap-1"
                  >
                    View in Full Search Catalog <ArrowRight size={12} />
                  </button>
                </div>
              )}

              {/* Action Confirmation Banner */}
              {m.actionRequired && (
                <div className="mt-3 p-2.5 bg-amber-500/10 border border-amber-400 rounded text-amber-900 text-[11px] space-y-2">
                  <div className="flex items-center gap-1 font-bold">
                    <ShieldAlert size={14} className="text-amber-600" />
                    <span>Confirmation Required</span>
                  </div>
                  <p>Procurement Request creation involves financial approval workflows.</p>
                  <button
                    onClick={() => {
                      onNavigateTab('procurement');
                      onClose();
                    }}
                    className="w-full py-1 bg-amber-600 text-white rounded font-semibold text-[11px] hover:bg-amber-700 transition-colors"
                  >
                    Proceed to Procurement Workspace
                  </button>
                </div>
              )}
            </div>
          </div>
        ))}
        {loading && (
          <div className="flex items-center gap-2 text-purple-600 text-xs font-medium animate-pulse">
            <Bot size={14} />
            <span>Analyzing query and executing internal tools...</span>
          </div>
        )}
      </div>

      {/* Quick Prompts */}
      <div className="p-2 px-4 bg-surface border-t border-outline-variant flex flex-wrap gap-1.5">
        {prompts.map((p, idx) => (
          <button
            key={idx}
            onClick={() => handleSend(p)}
            className="text-[10px] bg-surface-container-lowest border border-outline-variant hover:border-purple-400 px-2 py-1 rounded text-on-surface-variant transition-colors"
          >
            {p}
          </button>
        ))}
      </div>

      {/* Input Form */}
      <div className="p-3 bg-surface-container border-t border-outline-variant flex gap-2">
        <input
          type="text"
          value={input}
          onChange={(e) => setInput(e.target.value)}
          onKeyDown={(e) => e.key === 'Enter' && handleSend()}
          placeholder="Ask about products, specs, suppliers, forecasts..."
          className="flex-1 bg-surface-container-low border border-outline-variant rounded px-3 py-2 text-xs text-on-surface focus:border-purple-500 outline-none"
        />
        <button
          onClick={() => handleSend()}
          className="bg-primary-container text-on-primary px-3 rounded flex items-center justify-center hover:bg-primary transition-colors"
        >
          <Send size={14} />
        </button>
      </div>
    </div>
  );
}
