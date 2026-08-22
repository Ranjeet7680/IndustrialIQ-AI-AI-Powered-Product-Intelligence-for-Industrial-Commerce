"use client";

import React, { useState } from 'react';
import {
  User,
  Building2,
  Mail,
  Phone,
  MapPin,
  ShieldCheck,
  Key,
  CreditCard,
  Bell,
  Clock,
  CheckCircle2,
  Edit3,
  Save,
  Lock,
  ExternalLink,
  Award,
  Sliders,
  Sparkles,
  Download,
  Copy,
  Plus
} from 'lucide-react';

interface ProfileViewProps {
  onNavigate?: (tab: string) => void;
}

export default function ProfileView({ onNavigate }: ProfileViewProps) {
  const [isEditing, setIsEditing] = useState(false);
  const [activeTab, setActiveTab] = useState<'profile' | 'security' | 'integrations' | 'billing'>('profile');

  const [userInfo, setUserInfo] = useState({
    name: 'Ranjeet Singh',
    role: 'Chief Procurement Officer & Enterprise Admin',
    email: 'ranjeet.singh@industrialiq.ai',
    phone: '+91 98765 43210',
    organization: 'Tata Industrial Heavy Industries Ltd.',
    industry: 'Heavy Manufacturing & Petrochemical',
    gstNumber: '27AAAAA0000A1Z5',
    address: 'Plot 42, Industrial Automation Corridor, MIDC Bhosari, Pune, Maharashtra - 411026',
    membership: 'Enterprise Pro AI Tier',
    memberSince: 'March 2024'
  });

  const [apiKeyCopied, setApiKeyCopied] = useState(false);

  const handleCopyApiKey = () => {
    navigator.clipboard.writeText('iiq_live_998421_enterprise_secret_a7f92026');
    setApiKeyCopied(true);
    setTimeout(() => setApiKeyCopied(false), 2000);
  };

  return (
    <div className="space-y-6 max-w-[1400px] mx-auto font-body-md">
      {/* Top Banner Header Card */}
      <div className="bg-surface-container-high/40 border border-outline-variant/60 rounded-2xl p-6 shadow-sm relative overflow-hidden">
        <div className="absolute right-0 top-0 bottom-0 w-1/3 bg-gradient-to-l from-primary-container/20 to-transparent pointer-events-none" />

        <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 relative z-10">
          <div className="flex items-center gap-5">
            <div className="w-20 h-20 rounded-2xl bg-gradient-to-tr from-purple-700 via-primary-container to-secondary-container flex items-center justify-center text-on-primary font-bold text-2xl shadow-lg border border-outline-variant/40 shrink-0 relative">
              <User size={38} />
              <span className="absolute bottom-1 right-1 w-4 h-4 rounded-full bg-emerald-500 border-2 border-surface" />
            </div>

            <div className="space-y-1">
              <div className="flex items-center gap-2 flex-wrap">
                <h1 className="font-headline-sm text-2xl font-bold text-on-surface">{userInfo.name}</h1>
                <span className="bg-purple-500/10 text-purple-700 dark:text-purple-300 text-xs px-2.5 py-0.5 rounded-full font-bold border border-purple-500/30">
                  {userInfo.membership}
                </span>
                <span className="bg-emerald-500/10 text-emerald-700 dark:text-emerald-400 text-xs px-2.5 py-0.5 rounded-full font-bold border border-emerald-500/30 flex items-center gap-1">
                  <ShieldCheck size={13} /> Verified Buyer Tier-1
                </span>
              </div>
              <p className="text-xs text-on-surface-variant font-medium">{userInfo.role}</p>
              <p className="text-[11px] text-on-surface-variant/80 flex items-center gap-2">
                <span>{userInfo.organization}</span> • <span>{userInfo.industry}</span>
              </p>
            </div>
          </div>

          <div className="flex items-center gap-3">
            <button
              onClick={() => setIsEditing(!isEditing)}
              className="px-4 py-2 bg-surface-container-high hover:bg-surface-container-highest text-on-surface rounded-xl text-xs font-semibold transition-colors flex items-center gap-2 border border-outline-variant/50"
            >
              {isEditing ? <Save size={15} /> : <Edit3 size={15} />}
              <span>{isEditing ? 'Save Changes' : 'Edit Profile'}</span>
            </button>

            {onNavigate && (
              <button
                onClick={() => onNavigate('settings')}
                className="px-4 py-2 bg-primary-container hover:bg-primary text-on-primary rounded-xl text-xs font-semibold transition-colors flex items-center gap-2 shadow-sm"
              >
                <Sliders size={15} />
                <span>System Settings</span>
              </button>
            )}
          </div>
        </div>
      </div>

      {/* Navigation Sub-Tabs */}
      <div className="flex border-b border-outline-variant/60 gap-4 text-xs font-semibold overflow-x-auto no-scrollbar">
        <button
          onClick={() => setActiveTab('profile')}
          className={`pb-3 px-2 border-b-2 transition-colors flex items-center gap-2 whitespace-nowrap ${
            activeTab === 'profile'
              ? 'border-secondary-container text-secondary-fixed font-bold'
              : 'border-transparent text-on-surface-variant hover:text-on-surface'
          }`}
        >
          <User size={15} /> Personal & Organization Info
        </button>

        <button
          onClick={() => setActiveTab('security')}
          className={`pb-3 px-2 border-b-2 transition-colors flex items-center gap-2 whitespace-nowrap ${
            activeTab === 'security'
              ? 'border-secondary-container text-secondary-fixed font-bold'
              : 'border-transparent text-on-surface-variant hover:text-on-surface'
          }`}
        >
          <Lock size={15} /> Security & API Keys
        </button>

        <button
          onClick={() => setActiveTab('integrations')}
          className={`pb-3 px-2 border-b-2 transition-colors flex items-center gap-2 whitespace-nowrap ${
            activeTab === 'integrations'
              ? 'border-secondary-container text-secondary-fixed font-bold'
              : 'border-transparent text-on-surface-variant hover:text-on-surface'
          }`}
        >
          <Key size={15} /> ERP & System Integrations
        </button>

        <button
          onClick={() => setActiveTab('billing')}
          className={`pb-3 px-2 border-b-2 transition-colors flex items-center gap-2 whitespace-nowrap ${
            activeTab === 'billing'
              ? 'border-secondary-container text-secondary-fixed font-bold'
              : 'border-transparent text-on-surface-variant hover:text-on-surface'
          }`}
        >
          <CreditCard size={15} /> Plan & Enterprise Billing
        </button>
      </div>

      {/* Main Tab Content */}
      {activeTab === 'profile' && (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Main User Info Form (2 Cols) */}
          <div className="lg:col-span-2 bg-surface border border-outline-variant/50 rounded-2xl p-6 shadow-sm space-y-6">
            <h3 className="font-headline-sm text-sm font-bold text-on-surface border-b border-outline-variant/40 pb-3 flex items-center gap-2">
              <User size={16} className="text-secondary" /> Account Details & Contact Information
            </h3>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="text-[11px] font-semibold text-on-surface-variant block mb-1">Full Name</label>
                <input
                  type="text"
                  disabled={!isEditing}
                  value={userInfo.name}
                  onChange={(e) => setUserInfo({ ...userInfo, name: e.target.value })}
                  className="w-full bg-surface-container-low border border-outline-variant/60 rounded-lg px-3 py-2 text-xs text-on-surface outline-none focus:border-secondary disabled:opacity-80"
                />
              </div>

              <div>
                <label className="text-[11px] font-semibold text-on-surface-variant block mb-1">Work Email</label>
                <input
                  type="email"
                  disabled={!isEditing}
                  value={userInfo.email}
                  onChange={(e) => setUserInfo({ ...userInfo, email: e.target.value })}
                  className="w-full bg-surface-container-low border border-outline-variant/60 rounded-lg px-3 py-2 text-xs text-on-surface outline-none focus:border-secondary disabled:opacity-80"
                />
              </div>

              <div>
                <label className="text-[11px] font-semibold text-on-surface-variant block mb-1">Phone Number</label>
                <input
                  type="text"
                  disabled={!isEditing}
                  value={userInfo.phone}
                  onChange={(e) => setUserInfo({ ...userInfo, phone: e.target.value })}
                  className="w-full bg-surface-container-low border border-outline-variant/60 rounded-lg px-3 py-2 text-xs text-on-surface outline-none focus:border-secondary disabled:opacity-80"
                />
              </div>

              <div>
                <label className="text-[11px] font-semibold text-on-surface-variant block mb-1">Role / Job Title</label>
                <input
                  type="text"
                  disabled={!isEditing}
                  value={userInfo.role}
                  onChange={(e) => setUserInfo({ ...userInfo, role: e.target.value })}
                  className="w-full bg-surface-container-low border border-outline-variant/60 rounded-lg px-3 py-2 text-xs text-on-surface outline-none focus:border-secondary disabled:opacity-80"
                />
              </div>
            </div>

            <h3 className="font-headline-sm text-sm font-bold text-on-surface border-b border-outline-variant/40 pb-3 pt-2 flex items-center gap-2">
              <Building2 size={16} className="text-secondary" /> Enterprise Organization & GST Compliance
            </h3>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="text-[11px] font-semibold text-on-surface-variant block mb-1">Organization Name</label>
                <input
                  type="text"
                  disabled={!isEditing}
                  value={userInfo.organization}
                  onChange={(e) => setUserInfo({ ...userInfo, organization: e.target.value })}
                  className="w-full bg-surface-container-low border border-outline-variant/60 rounded-lg px-3 py-2 text-xs text-on-surface outline-none focus:border-secondary disabled:opacity-80"
                />
              </div>

              <div>
                <label className="text-[11px] font-semibold text-on-surface-variant block mb-1">GSTIN Tax Registration</label>
                <input
                  type="text"
                  disabled={!isEditing}
                  value={userInfo.gstNumber}
                  onChange={(e) => setUserInfo({ ...userInfo, gstNumber: e.target.value })}
                  className="w-full bg-surface-container-low border border-outline-variant/60 rounded-lg px-3 py-2 text-xs font-data-mono text-on-surface outline-none focus:border-secondary disabled:opacity-80"
                />
              </div>

              <div className="sm:col-span-2">
                <label className="text-[11px] font-semibold text-on-surface-variant block mb-1">Registered Factory / Delivery Address</label>
                <textarea
                  rows={2}
                  disabled={!isEditing}
                  value={userInfo.address}
                  onChange={(e) => setUserInfo({ ...userInfo, address: e.target.value })}
                  className="w-full bg-surface-container-low border border-outline-variant/60 rounded-lg px-3 py-2 text-xs text-on-surface outline-none focus:border-secondary disabled:opacity-80"
                />
              </div>
            </div>
          </div>

          {/* Right Sidebar Widget (1 Col) */}
          <div className="space-y-6">
            {/* Account Activity Summary */}
            <div className="bg-surface border border-outline-variant/50 rounded-2xl p-5 shadow-sm space-y-4">
              <h3 className="font-headline-sm text-sm font-bold text-on-surface flex items-center gap-2">
                <Clock size={16} className="text-secondary" /> Procurement Stats & Activity
              </h3>

              <div className="space-y-3 text-xs">
                <div className="flex justify-between py-2 border-b border-outline-variant/30">
                  <span className="text-on-surface-variant">Approved RFQs:</span>
                  <span className="font-semibold text-emerald-600 font-data-mono">42 RFQs</span>
                </div>
                <div className="flex justify-between py-2 border-b border-outline-variant/30">
                  <span className="text-on-surface-variant">Total Spend Evaluated:</span>
                  <span className="font-semibold text-secondary-fixed font-data-mono">₹3.45 Crore</span>
                </div>
                <div className="flex justify-between py-2 border-b border-outline-variant/30">
                  <span className="text-on-surface-variant">AI Savings Achieved:</span>
                  <span className="font-semibold text-purple-600 dark:text-purple-400 font-data-mono">₹42.0 Lakh (12.1%)</span>
                </div>
                <div className="flex justify-between py-2 border-b border-outline-variant/30">
                  <span className="text-on-surface-variant">Active Vetted Suppliers:</span>
                  <span className="font-semibold text-on-surface">10 Preferred</span>
                </div>
              </div>
            </div>

            {/* Support Quick Link */}
            <div className="bg-gradient-to-br from-purple-900/20 to-primary-container/20 border border-purple-500/30 rounded-2xl p-5 shadow-sm space-y-3">
              <div className="flex items-center gap-2 text-purple-700 dark:text-purple-300 font-bold text-xs">
                <Sparkles size={16} /> Enterprise Support SLA
              </div>
              <p className="text-xs text-on-surface-variant leading-relaxed">
                You have 24/7 Priority Concierge & Dedicated Technical AI Specialist support assigned to your account.
              </p>
              {onNavigate && (
                <button
                  onClick={() => onNavigate('help')}
                  className="w-full py-2 bg-purple-600 hover:bg-purple-700 text-white font-bold rounded-xl transition-colors text-xs flex items-center justify-center gap-1.5 shadow-sm"
                >
                  Visit Help & Support Center
                </button>
              )}
            </div>
          </div>
        </div>
      )}

      {/* Security & API Keys Tab */}
      {activeTab === 'security' && (
        <div className="bg-surface border border-outline-variant/50 rounded-2xl p-6 shadow-sm space-y-6 max-w-3xl">
          <h3 className="font-headline-sm text-sm font-bold text-on-surface flex items-center gap-2">
            <Lock size={16} className="text-secondary" /> Enterprise Security & Authentication
          </h3>

          <div className="space-y-4 text-xs">
            <div className="flex items-center justify-between p-3.5 bg-surface-container-low rounded-xl border border-outline-variant/50">
              <div>
                <div className="font-semibold text-on-surface">Two-Factor Authentication (2FA)</div>
                <div className="text-on-surface-variant text-[11px]">Hardware Token & Authenticator App active</div>
              </div>
              <span className="px-2.5 py-1 rounded-full bg-emerald-500/20 text-emerald-700 dark:text-emerald-400 font-bold text-[10px]">
                ENABLED
              </span>
            </div>

            <div className="flex items-center justify-between p-3.5 bg-surface-container-low rounded-xl border border-outline-variant/50">
              <div>
                <div className="font-semibold text-on-surface">SAML 2.0 Single Sign-On (SSO)</div>
                <div className="text-on-surface-variant text-[11px]">Mapped to Okta / Azure Active Directory</div>
              </div>
              <span className="px-2.5 py-1 rounded-full bg-emerald-500/20 text-emerald-700 dark:text-emerald-400 font-bold text-[10px]">
                ACTIVE
              </span>
            </div>
          </div>

          <h3 className="font-headline-sm text-sm font-bold text-on-surface border-t border-outline-variant/40 pt-4 flex items-center gap-2">
            <Key size={16} className="text-secondary" /> Enterprise API Secret Keys
          </h3>

          <div className="p-4 bg-surface-container-lowest border border-purple-500/30 rounded-xl space-y-3">
            <div className="flex justify-between items-center text-xs">
              <span className="font-semibold text-on-surface">Live Production API Key</span>
              <button
                onClick={handleCopyApiKey}
                className="flex items-center gap-1 text-[11px] bg-purple-500/20 text-purple-700 dark:text-purple-300 px-2.5 py-1 rounded hover:bg-purple-500/30 transition-colors font-medium"
              >
                <Copy size={12} />
                <span>{apiKeyCopied ? 'Copied to Clipboard!' : 'Copy Key'}</span>
              </button>
            </div>
            <div className="font-data-mono text-xs text-on-surface bg-surface-container p-2.5 rounded border border-outline-variant/60">
              iiq_live_998421_enterprise_secret_a7f92026
            </div>
          </div>
        </div>
      )}

      {/* Integrations Tab */}
      {activeTab === 'integrations' && (
        <div className="bg-surface border border-outline-variant/50 rounded-2xl p-6 shadow-sm space-y-4 max-w-4xl">
          <h3 className="font-headline-sm text-sm font-bold text-on-surface flex items-center gap-2">
            <Key size={16} className="text-secondary" /> Connected ERP & Supply Chain Connectors
          </h3>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div className="p-4 bg-surface-container-low rounded-xl border border-outline-variant/60 flex items-start justify-between">
              <div>
                <div className="font-semibold text-xs text-on-surface">SAP S/4HANA ERP Connector</div>
                <div className="text-[11px] text-on-surface-variant mt-0.5">Bi-directional PO sync & inventory levels</div>
                <span className="inline-block mt-2 text-[10px] text-emerald-600 font-bold bg-emerald-500/10 px-2 py-0.5 rounded">
                  Connected & Synced
                </span>
              </div>
              <CheckCircle2 size={18} className="text-emerald-500" />
            </div>

            <div className="p-4 bg-surface-container-low rounded-xl border border-outline-variant/60 flex items-start justify-between">
              <div>
                <div className="font-semibold text-xs text-on-surface">Siemens MindSphere IoT</div>
                <div className="text-[11px] text-on-surface-variant mt-0.5">Live sensor telemetry & motor vibration feeds</div>
                <span className="inline-block mt-2 text-[10px] text-emerald-600 font-bold bg-emerald-500/10 px-2 py-0.5 rounded">
                  Connected & Synced
                </span>
              </div>
              <CheckCircle2 size={18} className="text-emerald-500" />
            </div>

            <div className="p-4 bg-surface-container-low rounded-xl border border-outline-variant/60 flex items-start justify-between opacity-80">
              <div>
                <div className="font-semibold text-xs text-on-surface">Oracle SCM Cloud</div>
                <div className="text-[11px] text-on-surface-variant mt-0.5">Automated RFQ supplier portal sync</div>
                <span className="inline-block mt-2 text-[10px] text-on-surface-variant bg-surface-container px-2 py-0.5 rounded">
                  Available to Connect
                </span>
              </div>
              <button className="px-2.5 py-1 bg-primary-container text-on-primary text-[10px] rounded font-semibold">
                Connect
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Billing Tab */}
      {activeTab === 'billing' && (
        <div className="bg-surface border border-outline-variant/50 rounded-2xl p-6 shadow-sm space-y-4 max-w-3xl text-xs">
          <h3 className="font-headline-sm text-sm font-bold text-on-surface flex items-center gap-2">
            <CreditCard size={16} className="text-secondary" /> Subscription & Invoicing
          </h3>

          <div className="p-4 bg-surface-container-low rounded-xl border border-outline-variant/60 flex justify-between items-center">
            <div>
              <div className="font-bold text-sm text-on-surface">Enterprise Pro Tier Plan</div>
              <div className="text-on-surface-variant text-xs mt-0.5">Includes Unlimited AI Search, 3D Facility Twin, & Voice Copilot</div>
            </div>
            <span className="px-3 py-1 bg-purple-600 text-white font-bold rounded-lg text-xs">
              Active Plan
            </span>
          </div>
        </div>
      )}
    </div>
  );
}
