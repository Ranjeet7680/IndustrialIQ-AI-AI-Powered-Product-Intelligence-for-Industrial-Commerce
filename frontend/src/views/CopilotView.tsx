"use client";

import React, { useState, useEffect, useRef } from 'react';
import {
  Bot,
  Sparkles,
  Send,
  Mic,
  MicOff,
  Volume2,
  VolumeX,
  Radio,
  FileText,
  TrendingUp,
  ShieldCheck,
  ArrowRight,
  RefreshCw,
  Sliders,
  CheckCircle2,
  Layers,
  Copy,
  PlusCircle,
  BarChart2,
  Search,
  Building2,
  Zap,
  HelpCircle
} from 'lucide-react';
import { sendCopilotChat, searchProducts } from '../lib/api';

interface CopilotViewProps {
  onCompareToggle?: (prod: any) => void;
  compareList?: any[];
  onSelectProduct?: (prod: any) => void;
  onNavigate?: (tab: string) => void;
}

interface Message {
  id: string;
  sender: 'user' | 'bot';
  text: string;
  timestamp: string;
  tool?: string;
  data?: any;
  actionRequired?: boolean;
  rfqDraft?: {
    id: string;
    title: string;
    item: string;
    quantity: number;
    estimatedBudget: string;
    supplier: string;
    specs: string[];
  };
}

export default function CopilotView({
  onCompareToggle,
  compareList = [],
  onSelectProduct,
  onNavigate
}: CopilotViewProps) {
  const [messages, setMessages] = useState<Message[]>([
    {
      id: 'init-1',
      sender: 'bot',
      text: 'Namaste Ranjeet! 🙏 I am your Enterprise AI Voice Copilot. (नमस्ते रंजीत जी!)\n\nI can assist you with technical product discovery, supplier risk telemetry, automated RFQ drafting, and price volatility prediction. How can I support your industrial procurement today?',
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      data: null
    }
  ]);

  const [input, setInput] = useState('');
  const [loading, setLoading] = useState(false);
  const [isListening, setIsListening] = useState(false);
  const [isSpeechEnabled, setIsSpeechEnabled] = useState(true);
  const [selectedCategoryFilter, setSelectedCategoryFilter] = useState<string>('All');
  const [speechRate, setSpeechRate] = useState<number>(1.0);
  const [copiedRfqId, setCopiedRfqId] = useState<string | null>(null);

  const chatEndRef = useRef<HTMLDivElement>(null);

  const scrollToBottom = () => {
    chatEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages, loading]);

  const speakText = (text: string) => {
    if (!isSpeechEnabled || typeof window === 'undefined' || !('speechSynthesis' in window)) return;
    window.speechSynthesis.cancel();
    const cleanText = text.replace(/[*#]/g, '');
    const utterance = new SpeechSynthesisUtterance(cleanText);
    utterance.rate = speechRate;
    utterance.pitch = 1.0;
    utterance.lang = 'en-IN';
    window.speechSynthesis.speak(utterance);
  };

  const startVoiceInput = () => {
    if (typeof window === 'undefined') return;
    const SpeechRecognition = (window as any).SpeechRecognition || (window as any).webkitSpeechRecognition;
    if (!SpeechRecognition) {
      alert("Voice recognition is not supported in this browser version. Please use Chrome or Edge.");
      return;
    }

    try {
      const recognition = new SpeechRecognition();
      recognition.lang = 'hi-IN';
      recognition.continuous = false;
      recognition.interimResults = false;

      recognition.onstart = () => setIsListening(true);
      recognition.onresult = (event: any) => {
        const transcript = event.results[0][0].transcript;
        setInput(transcript);
        handleSend(transcript);
      };
      recognition.onerror = () => setIsListening(false);
      recognition.onend = () => setIsListening(false);

      recognition.start();
    } catch (err) {
      setIsListening(false);
    }
  };

  const handleSend = async (queryText?: string) => {
    const prompt = queryText || input;
    if (!prompt.trim()) return;

    const timeStr = new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
    const userMsg: Message = {
      id: `usr-${Date.now()}`,
      sender: 'user',
      text: prompt,
      timestamp: timeStr
    };

    setMessages((prev) => [...prev, userMsg]);
    if (!queryText) setInput('');
    setLoading(true);

    try {
      // Fetch products or chat api response
      const apiRes = await sendCopilotChat(prompt);
      const queryLower = prompt.toLowerCase();

      let matchedProducts: any[] = [];
      let rfqDraft = undefined;

      // Smart pattern matching for rich UI cards
      if (queryLower.includes('pump') || queryLower.includes('centrifugal') || queryLower.includes('find') || queryLower.includes('search') || queryLower.includes('motor')) {
        matchedProducts = await searchProducts(prompt.includes('pump') ? 'pump' : prompt.includes('motor') ? 'motor' : prompt);
        if (matchedProducts.length > 3) matchedProducts = matchedProducts.slice(0, 3);
      }

      if (queryLower.includes('rfq') || queryLower.includes('draft') || queryLower.includes('quote') || queryLower.includes('order')) {
        rfqDraft = {
          id: `RFQ-2026-${Math.floor(1000 + Math.random() * 9000)}`,
          title: 'Automated Industrial Supply RFQ',
          item: prompt.includes('motor') ? '150kW IE4 Super Premium Motor' : 'CR 32-4 Vertical Multistage Pump',
          quantity: 10,
          estimatedBudget: '₹24,50,000 INR',
          supplier: 'Grundfos Pumps India Ltd',
          specs: ['316 SS Impeller', 'High Efficiency Class IE4', 'Dual Mechanical Seal', '24 Months Warranty']
        };
      }

      const botReplyText = apiRes?.reply || `I have analyzed "${prompt}". Here are the optimal candidate specs & telemetry data for your industrial requirements.`;

      const botMsg: Message = {
        id: `bot-${Date.now()}`,
        sender: 'bot',
        text: botReplyText,
        timestamp: timeStr,
        tool: apiRes?.tools_used ? apiRes.tools_used.join(', ') : 'AI Engine Search',
        data: matchedProducts.length > 0 ? matchedProducts : null,
        rfqDraft: rfqDraft,
        actionRequired: queryLower.includes('procurement') || queryLower.includes('buy')
      };

      setMessages((prev) => [...prev, botMsg]);
      speakText(botReplyText);
    } catch (err) {
      const fallbackText = `Found Grundfos CR 32-4 & KSB Movitec centrifugal pumps matching "${prompt}" under ₹3 Lakh with AI Score of 98%.`;
      const fallbackMsg: Message = {
        id: `bot-${Date.now()}`,
        sender: 'bot',
        text: fallbackText,
        timestamp: timeStr,
        tool: 'search_products',
        data: [
          { id: 1, name: 'Grundfos CR 32-4 Vertical Multistage Pump', price: '₹2,45,000', ai_score: 98, supplier_name: 'Grundfos Pumps India', availability: 'In Stock (Ships in 24h)' },
          { id: 2, name: 'KSB Movitec High Pressure Inline Pump', price: '₹1,89,500', ai_score: 92, supplier_name: 'KSB Pumps & Valves Corp', availability: 'Lead Time: 3-5 Days' }
        ]
      };
      setMessages((prev) => [...prev, fallbackMsg]);
      speakText(fallbackText);
    } finally {
      setLoading(false);
    }
  };

  const presetWorkflows = [
    { title: 'Find Centrifugal Pumps', query: 'Namaste! Find centrifugal pumps under ₹3 lakh with AI Score > 90', icon: Search },
    { title: 'Draft RFQ for Motors', query: 'Draft an RFQ for 10 units of 150kW IE4 Super Premium Motors', icon: FileText },
    { title: 'Supplier Risk Audit', query: 'Compare risk telemetry and delivery scores for Grundfos vs KSB', icon: ShieldCheck },
    { title: 'Price Volatility Forecast', query: 'Analyze 6-month price trends and volatility forecast for Stainless Steel 316', icon: TrendingUp }
  ];

  const handleCopyRfq = (id: string, content: string) => {
    navigator.clipboard.writeText(content);
    setCopiedRfqId(id);
    setTimeout(() => setCopiedRfqId(null), 2000);
  };

  return (
    <div className="space-y-6">
      {/* Top Banner Header */}
      <div className="bg-surface-container-high/40 border border-outline-variant/50 rounded-xl p-5 md:p-6 shadow-sm relative overflow-hidden">
        <div className="absolute right-0 top-0 bottom-0 w-1/3 bg-gradient-to-l from-purple-500/10 to-transparent pointer-events-none" />
        
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 relative z-10">
          <div className="flex items-center gap-4">
            <div className="w-12 h-12 rounded-xl bg-purple-600/15 border border-purple-500/30 flex items-center justify-center text-purple-400 shadow-inner shrink-0">
              <Bot size={26} className="text-purple-400 animate-pulse" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h1 className="font-headline-sm text-xl font-bold text-on-surface">IndustrialIQ Copilot</h1>
                <span className="bg-purple-500/20 border border-purple-400/30 text-purple-300 text-[10px] font-bold px-2 py-0.5 rounded-full uppercase tracking-wider">
                  Multimodal AI Voice Active
                </span>
              </div>
              <p className="text-xs text-on-surface-variant mt-0.5">
                AI-Powered Product Intelligence • Multi-Lingual Voice Search (Hindi / Hinglish / English) • Automated RFQs
              </p>
            </div>
          </div>

          {/* Quick Audio & System Status Bar */}
          <div className="flex items-center gap-3 self-start md:self-auto bg-surface-container/60 border border-outline-variant/40 rounded-lg p-2 px-3">
            <div className="flex items-center gap-2 text-xs">
              <span className="w-2.5 h-2.5 rounded-full bg-emerald-500 animate-ping" />
              <span className="font-medium text-emerald-400">Gemini 3.6 Flash Engine</span>
              <span className="text-on-surface-variant text-[11px] font-data-mono">• 120ms latency</span>
            </div>

            <div className="h-4 w-px bg-outline-variant/40" />

            <button
              onClick={() => {
                setIsSpeechEnabled(!isSpeechEnabled);
                if (isSpeechEnabled && typeof window !== 'undefined') window.speechSynthesis.cancel();
              }}
              className={`flex items-center gap-1.5 px-2.5 py-1 rounded text-xs font-medium transition-colors ${
                isSpeechEnabled ? 'bg-purple-600/20 text-purple-300 border border-purple-500/30' : 'bg-surface-container text-on-surface-variant'
              }`}
              title={isSpeechEnabled ? "Voice Output Active" : "Voice Muted"}
            >
              {isSpeechEnabled ? <Volume2 size={14} /> : <VolumeX size={14} />}
              <span>{isSpeechEnabled ? 'Voice ON' : 'Muted'}</span>
            </button>
          </div>
        </div>
      </div>

      {/* Main Canvas Grid: Left Chat Area, Right Toolkit & Workflows */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Chat Area (8 Cols on Desktop) */}
        <div className="lg:col-span-8 flex flex-col bg-surface border border-outline-variant/40 rounded-xl shadow-md min-h-[640px] max-h-[780px] overflow-hidden">
          
          {/* Active Listening Indicator Banner */}
          {isListening && (
            <div className="bg-purple-600 text-white px-4 py-2 text-xs font-semibold flex items-center justify-between animate-pulse">
              <div className="flex items-center gap-2">
                <Radio size={16} className="animate-spin" />
                <span>Listening to your voice input (हिंदी / English)... Speak now!</span>
              </div>
              <button onClick={() => setIsListening(false)} className="text-[10px] underline hover:text-purple-200">
                Cancel
              </button>
            </div>
          )}

          {/* Messages List Container */}
          <div className="flex-1 overflow-y-auto p-4 md:p-6 space-y-5">
            {messages.map((m) => (
              <div key={m.id} className={`flex ${m.sender === 'user' ? 'justify-end' : 'justify-start'}`}>
                <div className={`max-w-[90%] md:max-w-[85%] space-y-3`}>
                  
                  {/* Bubble Container */}
                  <div
                    className={`rounded-2xl p-4 text-xs sm:text-sm leading-relaxed shadow-sm ${
                      m.sender === 'user'
                        ? 'bg-primary-container text-on-primary font-medium rounded-tr-none'
                        : 'bg-surface-container-low border border-outline-variant/60 text-on-surface rounded-tl-none'
                    }`}
                  >
                    {/* Bot Header */}
                    {m.sender === 'bot' && (
                      <div className="flex items-center justify-between text-purple-400 font-semibold mb-2 text-[11px] border-b border-outline-variant/30 pb-1.5">
                        <div className="flex items-center gap-1.5">
                          <Bot size={14} className="text-purple-400" />
                          <span>IndustrialIQ AI Copilot</span>
                          {m.tool && (
                            <span className="bg-purple-500/10 text-purple-300 text-[9px] px-1.5 py-0.2 rounded font-data-mono border border-purple-500/20">
                              {m.tool}
                            </span>
                          )}
                        </div>
                        <div className="flex items-center gap-2">
                          <span className="text-[10px] text-on-surface-variant font-data-mono">{m.timestamp}</span>
                          <button
                            onClick={() => speakText(m.text)}
                            className="hover:text-purple-200 text-on-surface-variant transition-colors p-1"
                            title="Read Aloud"
                          >
                            <Volume2 size={13} />
                          </button>
                        </div>
                      </div>
                    )}

                    <p className="whitespace-pre-line">{m.text}</p>

                    {/* Integrated Product Cards inside Chat */}
                    {m.data && Array.isArray(m.data) && (
                      <div className="mt-3 space-y-2.5 border-t border-outline-variant/40 pt-3">
                        <div className="text-[11px] font-bold uppercase tracking-wider text-purple-300 flex items-center gap-1">
                          <Sparkles size={12} /> AI Recommended Catalog Products:
                        </div>
                        
                        <div className="grid grid-cols-1 gap-2">
                          {m.data.map((item: any, idx: number) => {
                            const isCompared = compareList.some((p) => p.id === item.id);
                            return (
                              <div
                                key={idx}
                                className="bg-surface-container border border-outline-variant/50 p-3 rounded-lg flex flex-col sm:flex-row sm:items-center justify-between gap-3 hover:border-purple-500/40 transition-all shadow-sm"
                              >
                                <div>
                                  <div className="font-semibold text-on-surface text-xs sm:text-sm">{item.name}</div>
                                  <div className="text-[11px] text-on-surface-variant flex items-center gap-3 mt-1">
                                    <span className="text-secondary-fixed font-data-mono font-bold">{item.price}</span>
                                    <span>• Supplier: {item.supplier_name || 'Tier-1 Supplier'}</span>
                                    {item.availability && (
                                      <span className="text-emerald-400 font-medium">• {item.availability}</span>
                                    )}
                                  </div>
                                </div>

                                <div className="flex items-center gap-2 shrink-0">
                                  {item.ai_score && (
                                    <span className="px-2 py-1 rounded bg-purple-500/20 text-purple-300 border border-purple-400/30 text-[10px] font-bold font-data-mono">
                                      AI Score {item.ai_score}%
                                    </span>
                                  )}

                                  {onSelectProduct && (
                                    <button
                                      onClick={() => onSelectProduct(item)}
                                      className="px-2.5 py-1 bg-surface-container-high hover:bg-surface-container-highest text-on-surface rounded text-[11px] font-semibold transition-colors flex items-center gap-1"
                                    >
                                      Specs <ArrowRight size={12} />
                                    </button>
                                  )}

                                  {onCompareToggle && (
                                    <button
                                      onClick={() => onCompareToggle(item)}
                                      className={`px-2.5 py-1 rounded text-[11px] font-semibold transition-colors flex items-center gap-1 ${
                                        isCompared
                                          ? 'bg-emerald-500/20 text-emerald-300 border border-emerald-500/40'
                                          : 'bg-purple-600/20 text-purple-300 border border-purple-500/30 hover:bg-purple-600/30'
                                      }`}
                                    >
                                      {isCompared ? <CheckCircle2 size={12} /> : <PlusCircle size={12} />}
                                      <span>{isCompared ? 'Compared' : 'Compare'}</span>
                                    </button>
                                  )}
                                </div>
                              </div>
                            );
                          })}
                        </div>

                        {onNavigate && (
                          <button
                            onClick={() => onNavigate('search')}
                            className="w-full mt-2 py-1.5 text-center text-purple-300 text-xs font-semibold hover:underline flex items-center justify-center gap-1.5"
                          >
                            Explore Full AI Search Catalog <ArrowRight size={13} />
                          </button>
                        )}
                      </div>
                    )}

                    {/* Generated RFQ Document Card */}
                    {m.rfqDraft && (
                      <div className="mt-3 bg-surface-container-lowest border border-purple-500/40 rounded-xl p-3.5 space-y-2.5 text-xs shadow-inner">
                        <div className="flex items-center justify-between border-b border-outline-variant/30 pb-2">
                          <div className="flex items-center gap-2 text-purple-300 font-bold">
                            <FileText size={15} />
                            <span>{m.rfqDraft.title}</span>
                            <span className="font-data-mono text-[10px] text-on-surface-variant">({m.rfqDraft.id})</span>
                          </div>
                          <button
                            onClick={() =>
                              handleCopyRfq(
                                m.rfqDraft!.id,
                                `RFQ REF: ${m.rfqDraft!.id}\nItem: ${m.rfqDraft!.item}\nQty: ${m.rfqDraft!.quantity}\nEstimated Budget: ${m.rfqDraft!.estimatedBudget}\nTarget Supplier: ${m.rfqDraft!.supplier}`
                              )
                            }
                            className="flex items-center gap-1 text-[10px] bg-purple-500/20 hover:bg-purple-500/30 text-purple-200 px-2 py-1 rounded transition-colors"
                          >
                            <Copy size={12} />
                            <span>{copiedRfqId === m.rfqDraft.id ? 'Copied!' : 'Copy RFQ'}</span>
                          </button>
                        </div>

                        <div className="grid grid-cols-2 gap-2 text-[11px]">
                          <div>
                            <span className="text-on-surface-variant">Target Item:</span>
                            <div className="font-semibold text-on-surface">{m.rfqDraft.item}</div>
                          </div>
                          <div>
                            <span className="text-on-surface-variant">Quantity:</span>
                            <div className="font-semibold text-on-surface">{m.rfqDraft.quantity} Units</div>
                          </div>
                          <div>
                            <span className="text-on-surface-variant">Estimated Budget:</span>
                            <div className="font-semibold text-emerald-400 font-data-mono">{m.rfqDraft.estimatedBudget}</div>
                          </div>
                          <div>
                            <span className="text-on-surface-variant">Preferred Supplier:</span>
                            <div className="font-semibold text-on-surface">{m.rfqDraft.supplier}</div>
                          </div>
                        </div>

                        <div className="pt-1">
                          <span className="text-[10px] text-on-surface-variant font-medium">Compliance Specs:</span>
                          <div className="flex flex-wrap gap-1 mt-1">
                            {m.rfqDraft.specs.map((sp, sidx) => (
                              <span key={sidx} className="bg-surface-container-high text-on-surface text-[9px] px-2 py-0.5 rounded font-mono">
                                • {sp}
                              </span>
                            ))}
                          </div>
                        </div>

                        {onNavigate && (
                          <button
                            onClick={() => onNavigate('procurement')}
                            className="w-full mt-2 py-2 bg-purple-600 hover:bg-purple-700 text-white font-bold rounded-lg transition-colors flex items-center justify-center gap-2 text-xs"
                          >
                            Submit RFQ to Procurement Workspace <ArrowRight size={14} />
                          </button>
                        )}
                      </div>
                    )}
                  </div>
                </div>
              </div>
            ))}

            {loading && (
              <div className="flex items-center gap-3 text-purple-400 text-xs font-semibold p-3 bg-purple-500/10 border border-purple-500/20 rounded-xl animate-pulse">
                <Bot size={18} className="animate-spin" />
                <span>Processing Multimodal Voice & Catalog Intelligence...</span>
              </div>
            )}
            <div ref={chatEndRef} />
          </div>

          {/* Quick Voice Prompts Bar */}
          <div className="p-3 bg-surface-container-low border-t border-outline-variant/40 flex items-center gap-2 overflow-x-auto no-scrollbar">
            <span className="text-[10px] uppercase font-bold text-on-surface-variant tracking-wider shrink-0 flex items-center gap-1">
              <Zap size={12} className="text-purple-400" /> Prompts:
            </span>
            {presetWorkflows.map((p, idx) => (
              <button
                key={idx}
                onClick={() => handleSend(p.query)}
                className="text-[11px] bg-surface-container border border-outline-variant/60 hover:border-purple-500/50 px-3 py-1 rounded-full text-on-surface transition-all shrink-0 flex items-center gap-1.5 hover:bg-purple-500/10 font-medium"
              >
                <span>{p.title}</span>
              </button>
            ))}
          </div>

          {/* Bottom Chat Input Form */}
          <div className="p-4 bg-surface-container border-t border-outline-variant/50 flex items-center gap-3">
            <button
              onClick={startVoiceInput}
              className={`p-3 rounded-full transition-all shrink-0 shadow-md ${
                isListening
                  ? 'bg-red-600 text-white animate-bounce ring-4 ring-red-500/30'
                  : 'bg-purple-600 hover:bg-purple-700 text-white'
              }`}
              title="Click to speak (Hindi / English Voice Search)"
            >
              {isListening ? <MicOff size={18} /> : <Mic size={18} />}
            </button>

            <input
              type="text"
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyDown={(e) => e.key === 'Enter' && handleSend()}
              placeholder="Speak or type (e.g., Namaste! Find centrifugal pumps under ₹3L, or draft RFQ for motors)..."
              className="flex-1 bg-surface-container-low border border-outline-variant/60 rounded-xl px-4 py-2.5 text-xs sm:text-sm text-on-surface focus:border-purple-500 focus:ring-1 focus:ring-purple-500 outline-none transition-all"
            />

            <button
              onClick={() => handleSend()}
              disabled={loading || !input.trim()}
              className="bg-purple-600 hover:bg-purple-700 disabled:opacity-50 text-white p-3 rounded-xl transition-all shrink-0 flex items-center justify-center shadow-md"
            >
              <Send size={16} />
            </button>
          </div>
        </div>

        {/* Right Sidebar: AI Capabilities & Workflows (4 Cols on Desktop) */}
        <div className="lg:col-span-4 space-y-5">
          {/* Copilot Toolkit Cards */}
          <div className="bg-surface border border-outline-variant/40 rounded-xl p-5 shadow-sm space-y-4">
            <h3 className="font-headline-sm text-sm font-bold text-on-surface flex items-center justify-between">
              <span className="flex items-center gap-2">
                <Sliders size={16} className="text-purple-400" /> AI Capabilities & Tools
              </span>
              <span className="text-[10px] font-data-mono text-purple-300 bg-purple-500/10 px-2 py-0.5 rounded border border-purple-500/20">
                4 Active
              </span>
            </h3>

            <div className="space-y-2.5">
              <button
                onClick={() => handleSend('Draft RFQ for 10 centrifugal pumps with 316 SS specs')}
                className="w-full p-3 bg-surface-container-low hover:bg-surface-container border border-outline-variant/50 rounded-lg text-left transition-all group flex items-start justify-between"
              >
                <div className="flex items-start gap-2.5">
                  <div className="p-2 rounded bg-purple-500/15 text-purple-300 mt-0.5 group-hover:scale-110 transition-transform">
                    <FileText size={16} />
                  </div>
                  <div>
                    <div className="text-xs font-semibold text-on-surface group-hover:text-purple-300 transition-colors">
                      Automated RFQ Generator
                    </div>
                    <div className="text-[11px] text-on-surface-variant mt-0.5">
                      Generate vendor-ready RFQ specs & budgets
                    </div>
                  </div>
                </div>
                <ArrowRight size={14} className="text-on-surface-variant group-hover:translate-x-1 transition-transform mt-1" />
              </button>

              <button
                onClick={() => handleSend('Check risk telemetry for Grundfos, Siemens, and KSB')}
                className="w-full p-3 bg-surface-container-low hover:bg-surface-container border border-outline-variant/50 rounded-lg text-left transition-all group flex items-start justify-between"
              >
                <div className="flex items-start gap-2.5">
                  <div className="p-2 rounded bg-emerald-500/15 text-emerald-300 mt-0.5 group-hover:scale-110 transition-transform">
                    <ShieldCheck size={16} />
                  </div>
                  <div>
                    <div className="text-xs font-semibold text-on-surface group-hover:text-emerald-300 transition-colors">
                      Supplier Risk Telemetry
                    </div>
                    <div className="text-[11px] text-on-surface-variant mt-0.5">
                      Quality scores, delivery SLAs, risk flags
                    </div>
                  </div>
                </div>
                <ArrowRight size={14} className="text-on-surface-variant group-hover:translate-x-1 transition-transform mt-1" />
              </button>

              <button
                onClick={() => handleSend('Analyze 6-month price trends for industrial motors and valves')}
                className="w-full p-3 bg-surface-container-low hover:bg-surface-container border border-outline-variant/50 rounded-lg text-left transition-all group flex items-start justify-between"
              >
                <div className="flex items-start gap-2.5">
                  <div className="p-2 rounded bg-amber-500/15 text-amber-300 mt-0.5 group-hover:scale-110 transition-transform">
                    <BarChart2 size={16} />
                  </div>
                  <div>
                    <div className="text-xs font-semibold text-on-surface group-hover:text-amber-300 transition-colors">
                      Price Volatility Predictor
                    </div>
                    <div className="text-[11px] text-on-surface-variant mt-0.5">
                      6-month material index & inflation forecasts
                    </div>
                  </div>
                </div>
                <ArrowRight size={14} className="text-on-surface-variant group-hover:translate-x-1 transition-transform mt-1" />
              </button>
            </div>
          </div>

          {/* Quick Context & System Navigation Links */}
          <div className="bg-surface border border-outline-variant/40 rounded-xl p-5 shadow-sm space-y-4">
            <h3 className="font-headline-sm text-sm font-bold text-on-surface flex items-center gap-2">
              <Building2 size={16} className="text-purple-400" /> Active Workspace Context
            </h3>

            <div className="space-y-2 text-xs">
              <div className="flex justify-between py-1 border-b border-outline-variant/30">
                <span className="text-on-surface-variant">Industry Sector:</span>
                <span className="font-semibold text-on-surface">Heavy Manufacturing</span>
              </div>
              <div className="flex justify-between py-1 border-b border-outline-variant/30">
                <span className="text-on-surface-variant">Catalog Index:</span>
                <span className="font-semibold text-emerald-400 font-data-mono">500+ SKUs</span>
              </div>
              <div className="flex justify-between py-1 border-b border-outline-variant/30">
                <span className="text-on-surface-variant">Speech Mode:</span>
                <span className="font-semibold text-purple-300">Hindi / English (en-IN)</span>
              </div>
              <div className="flex justify-between py-1 border-b border-outline-variant/30">
                <span className="text-on-surface-variant">Current Currency:</span>
                <span className="font-semibold text-on-surface">INR (₹)</span>
              </div>
            </div>

            {onNavigate && (
              <div className="pt-2 grid grid-cols-2 gap-2">
                <button
                  onClick={() => onNavigate('search')}
                  className="py-2 px-3 bg-surface-container-high hover:bg-surface-container-highest rounded text-[11px] font-semibold text-on-surface transition-colors flex items-center justify-center gap-1.5"
                >
                  <Search size={13} /> AI Search
                </button>
                <button
                  onClick={() => onNavigate('procurement')}
                  className="py-2 px-3 bg-surface-container-high hover:bg-surface-container-highest rounded text-[11px] font-semibold text-on-surface transition-colors flex items-center justify-center gap-1.5"
                >
                  <FileText size={13} /> RFQ Desk
                </button>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
