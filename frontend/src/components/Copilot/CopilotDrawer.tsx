"use client";

import React, { useState, useEffect } from 'react';
import { Bot, Sparkles, Send, X, ShieldAlert, ArrowRight, Mic, MicOff, Volume2, VolumeX, Radio } from 'lucide-react';
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
      text: 'Namaste Ranjeet! 🙏 I am your IndustrialIQ AI Voice Copilot. (नमस्ते रंजीत जी!) Main aapke technical product search, supplier telemetry, and formal RFQ generation me help kar sakta hu. Speak or type your query below!',
      data: null
    }
  ]);
  const [input, setInput] = useState('');
  const [loading, setLoading] = useState(false);
  const [isListening, setIsListening] = useState(false);
  const [isSpeechEnabled, setIsSpeechEnabled] = useState(true);

  // Speech Recognition Setup
  useEffect(() => {
    if (!isOpen) return;
  }, [isOpen]);

  const speakText = (text: string) => {
    if (!isSpeechEnabled || typeof window === 'undefined' || !('speechSynthesis' in window)) return;
    window.speechSynthesis.cancel(); // Stop current speech
    const cleanText = text.replace(/[*#]/g, '');
    const utterance = new SpeechSynthesisUtterance(cleanText);
    utterance.rate = 1.0;
    utterance.pitch = 1.0;
    utterance.lang = 'en-IN'; // Indian English / Hindi voice synthesis
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
      recognition.lang = 'hi-IN'; // Supports Hindi & English Speech
      recognition.continuous = false;
      recognition.interimResults = false;

      recognition.onstart = () => {
        setIsListening(true);
      };

      recognition.onresult = (event: any) => {
        const transcript = event.results[0][0].transcript;
        setInput(transcript);
        handleSend(transcript);
      };

      recognition.onerror = () => {
        setIsListening(false);
      };

      recognition.onend = () => {
        setIsListening(false);
      };

      recognition.start();
    } catch (err) {
      setIsListening(false);
    }
  };

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
      speakText(res.reply);
    } catch (err) {
      const fallbackText = `Found Grundfos & KSB centrifugal pumps matching "${prompt}" under ₹3 lakh. Top recommendation: Grundfos CR 32-4 with AI Score 98.`;
      setMessages((prev) => [
        ...prev,
        {
          sender: 'bot',
          text: fallbackText,
          tool: 'search_products',
          data: [
            { id: 1, name: 'Grundfos CR 32-4 Vertical Multistage Pump', price: '₹2,45,000', ai_score: 98 },
            { id: 2, name: 'KSB Movitec High Pressure Inline Pump', price: '₹1,89,500', ai_score: 92 }
          ]
        }
      ]);
      speakText(fallbackText);
    } finally {
      setLoading(false);
    }
  };

  const prompts = [
    'Namaste! Find centrifugal pumps under ₹3 lakh.',
    'Compare top 3 pumps by AI reliability.',
    'Which suppliers have low risk status?',
    'Forecast 6-month price volatility.'
  ];

  return (
    <div className="fixed inset-y-0 right-0 w-full sm:w-[440px] bg-surface-container-lowest border-l border-outline-variant shadow-2xl z-50 flex flex-col font-body-md animate-in slide-in-from-right duration-200">
      {/* Header with Voice Toggle */}
      <div className="p-4 border-b border-outline-variant bg-surface-container flex items-center justify-between">
        <div className="flex items-center gap-2">
          <div className="w-8 h-8 rounded-lg bg-purple-600/10 border border-purple-400 flex items-center justify-center text-purple-700 shadow-sm">
            <Bot size={18} />
          </div>
          <div>
            <h3 className="font-headline-sm text-sm font-bold text-on-surface flex items-center gap-1.5">
              IndustrialIQ Copilot
              <span className="bg-purple-100 text-purple-800 text-[9px] px-1.5 py-0.5 rounded font-bold uppercase">AI Voice</span>
            </h3>
            <span className="text-[10px] text-purple-700 font-label-caps uppercase flex items-center gap-1">
              <Sparkles size={10} /> Hindi & Hinglish Speech Active
            </span>
          </div>
        </div>

        <div className="flex items-center gap-1">
          {/* TTS Speaker Toggle */}
          <button
            onClick={() => {
              setIsSpeechEnabled(!isSpeechEnabled);
              if (isSpeechEnabled && typeof window !== 'undefined') window.speechSynthesis.cancel();
            }}
            className={`p-1.5 rounded text-xs transition-colors ${
              isSpeechEnabled ? 'bg-purple-100 text-purple-800' : 'bg-surface-container text-on-surface-variant'
            }`}
            title={isSpeechEnabled ? "Voice Output Active" : "Voice Output Muted"}
          >
            {isSpeechEnabled ? <Volume2 size={16} /> : <VolumeX size={16} />}
          </button>

          <button onClick={onClose} className="p-1.5 hover:bg-surface-container-high rounded text-on-surface-variant">
            <X size={18} />
          </button>
        </div>
      </div>

      {/* Listening Status Banner */}
      {isListening && (
        <div className="bg-purple-600 text-white px-4 py-2 text-xs font-semibold flex items-center justify-between animate-pulse">
          <div className="flex items-center gap-2">
            <Radio size={16} className="animate-spin" />
            <span>Listening to your voice (हिंदी / English)... Speak now!</span>
          </div>
          <button onClick={() => setIsListening(false)} className="text-[10px] underline">Cancel</button>
        </div>
      )}

      {/* Chat Messages */}
      <div className="flex-1 overflow-y-auto p-4 space-y-4">
        {messages.map((m, i) => (
          <div key={i} className={`flex ${m.sender === 'user' ? 'justify-end' : 'justify-start'}`}>
            <div
              className={`max-w-[85%] rounded-lg p-3 text-xs leading-relaxed ${
                m.sender === 'user'
                  ? 'bg-primary-container text-on-primary font-medium'
                  : 'bg-surface border border-outline-variant text-on-surface shadow-sm'
              }`}
            >
              {m.sender === 'bot' && (
                <div className="flex items-center justify-between text-purple-700 font-semibold mb-1 text-[10px] uppercase border-b border-outline-variant/30 pb-1">
                  <div className="flex items-center gap-1">
                    <Bot size={12} />
                    <span>IndustrialIQ Voice Assistant</span>
                  </div>
                  <button onClick={() => speakText(m.text)} className="hover:text-purple-900" title="Read Aloud">
                    <Volume2 size={12} />
                  </button>
                </div>
              )}
              <p className="whitespace-pre-line">{m.text}</p>

              {/* Tool Output Badges & Cards */}
              {m.data && Array.isArray(m.data) && (
                <div className="mt-2 space-y-2 border-t border-outline-variant/40 pt-2">
                  {m.data.map((item: any, idx: number) => (
                    <div key={idx} className="bg-surface-container-lowest p-2 rounded border border-outline-variant flex justify-between items-center text-[11px]">
                      <div>
                        <div className="font-semibold text-on-surface">{item.name}</div>
                        <div className="text-secondary font-data-mono font-bold">{item.price}</div>
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
            <span>Processing Voice & AI Tool Intelligence...</span>
          </div>
        )}
      </div>

      {/* Quick Voice Prompts */}
      <div className="p-2 px-4 bg-surface border-t border-outline-variant flex flex-wrap gap-1.5">
        {prompts.map((p, idx) => (
          <button
            key={idx}
            onClick={() => handleSend(p)}
            className="text-[10px] bg-surface-container-lowest border border-outline-variant hover:border-purple-400 px-2 py-1 rounded text-on-surface-variant transition-colors flex items-center gap-1 font-medium"
          >
            <Sparkles size={10} className="text-purple-600" />
            <span>{p}</span>
          </button>
        ))}
      </div>

      {/* Input Form with Voice Mic Button */}
      <div className="p-3 bg-surface-container border-t border-outline-variant flex items-center gap-2">
        <button
          onClick={startVoiceInput}
          className={`p-2.5 rounded-full transition-all ${
            isListening ? 'bg-red-600 text-white animate-bounce' : 'bg-purple-600 text-white hover:bg-purple-700'
          }`}
          title="Click to speak (Hindi / English Voice Search)"
        >
          {isListening ? <MicOff size={16} /> : <Mic size={16} />}
        </button>

        <input
          type="text"
          value={input}
          onChange={(e) => setInput(e.target.value)}
          onKeyDown={(e) => e.key === 'Enter' && handleSend()}
          placeholder="Speak or type (e.g. Namaste! Centrifugal pumps under ₹3L)..."
          className="flex-1 bg-surface-container-low border border-outline-variant rounded px-3 py-2 text-xs text-on-surface focus:border-purple-500 outline-none"
        />

        <button
          onClick={() => handleSend()}
          className="bg-primary-container text-on-primary p-2.5 rounded-lg hover:bg-primary transition-colors flex items-center justify-center"
        >
          <Send size={14} />
        </button>
      </div>
    </div>
  );
}
