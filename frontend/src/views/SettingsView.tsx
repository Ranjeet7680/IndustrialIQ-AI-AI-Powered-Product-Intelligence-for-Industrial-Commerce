"use client";

import React, { useState } from 'react';
import { Settings, ShieldCheck, Bell, Database, Key, Save, CheckCircle2 } from 'lucide-react';

export default function SettingsView() {
  const [savedMsg, setSavedMsg] = useState('');
  const [orgName, setOrgName] = useState('InduIntel Enterprise Corp');
  const [industry, setIndustry] = useState('Heavy Manufacturing');
  const [apiEndpoint, setApiEndpoint] = useState('https://api.industrialiq.ai/v1');
  const [enableCopilot, setEnableCopilot] = useState(true);
  const [autoApproveLimit, setAutoApproveLimit] = useState(500000);

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    setSavedMsg('Settings Saved Successfully!');
    setTimeout(() => setSavedMsg(''), 3000);
  };

  return (
    <div className="space-y-6 font-body-md max-w-4xl">
      <div>
        <h1 className="font-headline-sm text-xl font-bold text-on-surface">Organization Settings & AI Preferences</h1>
        <p className="font-body-md text-xs text-on-surface-variant">Configure enterprise procurement thresholds, AI Copilot permissions, and API integrations.</p>
      </div>

      {savedMsg && (
        <div className="p-3 bg-green-100 border border-green-400 text-green-800 rounded font-semibold text-xs flex items-center gap-2">
          <CheckCircle2 size={16} />
          <span>{savedMsg}</span>
        </div>
      )}

      <form onSubmit={handleSave} className="space-y-6">
        {/* Organization Info */}
        <div className="bg-surface-container-lowest border border-outline-variant rounded-lg p-6 space-y-4">
          <h3 className="font-bold text-sm text-on-surface flex items-center gap-2 border-b border-outline-variant pb-2">
            <ShieldCheck size={16} className="text-secondary" />
            <span>Organization Profile</span>
          </h3>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-xs">
            <div>
              <label className="block text-on-surface-variant font-semibold mb-1">Company / Organization Name</label>
              <input
                type="text"
                value={orgName}
                onChange={(e) => setOrgName(e.target.value)}
                className="w-full p-2 border border-outline-variant rounded bg-surface text-on-surface outline-none focus:border-secondary"
              />
            </div>
            <div>
              <label className="block text-on-surface-variant font-semibold mb-1">Primary Industry Sector</label>
              <select
                value={industry}
                onChange={(e) => setIndustry(e.target.value)}
                className="w-full p-2 border border-outline-variant rounded bg-surface text-on-surface outline-none focus:border-secondary"
              >
                <option>Heavy Manufacturing</option>
                <option>Automotive</option>
                <option>Energy & Power</option>
                <option>Oil & Gas</option>
                <option>Aerospace</option>
                <option>Chemicals</option>
              </select>
            </div>
          </div>
        </div>

        {/* AI & Copilot Controls */}
        <div className="bg-surface-container-lowest border border-outline-variant rounded-lg p-6 space-y-4">
          <h3 className="font-bold text-sm text-on-surface flex items-center gap-2 border-b border-outline-variant pb-2">
            <Settings size={16} className="text-purple-600" />
            <span>AI Copilot & Procurement Controls</span>
          </h3>

          <div className="space-y-4 text-xs">
            <div className="flex items-center justify-between p-3 bg-surface rounded border border-outline-variant">
              <div>
                <span className="font-bold text-on-surface block">Enable AI Copilot Safeguards</span>
                <span className="text-on-surface-variant text-[11px]">Require human approval before executing Purchase Orders or RFQs.</span>
              </div>
              <input
                type="checkbox"
                checked={enableCopilot}
                onChange={(e) => setEnableCopilot(e.target.checked)}
                className="w-4 h-4 text-purple-600 rounded border-outline-variant focus:ring-purple-500"
              />
            </div>

            <div>
              <label className="block text-on-surface-variant font-semibold mb-1">Auto-Approval Threshold (₹ INR)</label>
              <input
                type="number"
                value={autoApproveLimit}
                onChange={(e) => setAutoApproveLimit(Number(e.target.value))}
                className="w-full p-2 border border-outline-variant rounded bg-surface text-on-surface outline-none font-data-mono focus:border-secondary"
              />
            </div>
          </div>
        </div>

        {/* API Integration */}
        <div className="bg-surface-container-lowest border border-outline-variant rounded-lg p-6 space-y-4">
          <h3 className="font-bold text-sm text-on-surface flex items-center gap-2 border-b border-outline-variant pb-2">
            <Database size={16} className="text-secondary" />
            <span>API Gateway Endpoint</span>
          </h3>

          <div className="text-xs">
            <label className="block text-on-surface-variant font-semibold mb-1">REST API URL</label>
            <input
              type="text"
              value={apiEndpoint}
              onChange={(e) => setApiEndpoint(e.target.value)}
              className="w-full p-2 border border-outline-variant rounded bg-surface text-on-surface outline-none font-data-mono focus:border-secondary"
            />
          </div>
        </div>

        <button
          type="submit"
          className="px-6 py-2.5 bg-primary-container text-on-primary rounded font-semibold text-xs hover:bg-primary transition-colors flex items-center gap-2 shadow"
        >
          <Save size={16} />
          <span>Save Preference Changes</span>
        </button>
      </form>
    </div>
  );
}
