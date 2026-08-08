"use client";

import React, { useState } from 'react';
import { ShieldCheck, Users, Database, Cpu, Activity, FileText, CheckCircle2, RefreshCw } from 'lucide-react';

export default function AdminView() {
  const [activeTab, setActiveTab] = useState<'datasets' | 'models' | 'health' | 'audit'>('datasets');

  const datasets = [
    { name: 'DataCo Smart Supply Chain', records: '180,519', quality: 98.4, status: 'Active', updated: 'Today' },
    { name: 'AI4I 2020 Predictive Maintenance', records: '10,000', quality: 99.1, status: 'Active', updated: 'Yesterday' },
    { name: 'Industrial SKUs & Pricing Catalog', records: '10,450', quality: 96.8, status: 'Active', updated: '2 hours ago' }
  ];

  const models = [
    { name: 'Product Ranking Hybrid Engine', version: 'v2.4', accuracy: '96.4%', latency: '14ms', status: 'Active' },
    { name: 'Supplier Risk Classifier (XGBoost)', version: 'v1.8', accuracy: '94.2%', latency: '8ms', status: 'Active' },
    { name: 'Price Volatility Time-Series Forecaster', version: 'v3.1', accuracy: '89.0%', latency: '22ms', status: 'Active' }
  ];

  const auditLogs = [
    { time: '10:45 AM', user: 'Ranjeet (Procurement Mgr)', action: 'CREATE_PROCUREMENT_REQUEST', target: 'RFQ #1024' },
    { time: '09:30 AM', user: 'Priya Sharma (Analyst)', action: 'EXPORT_REPORT', target: 'Supplier Risk Report' },
    { time: 'Yesterday', user: 'System Worker', action: 'ML_MODEL_REHEAT', target: 'Hybrid Recommendation Model' }
  ];

  return (
    <div className="space-y-6 font-body-md">
      <div>
        <h1 className="font-headline-sm text-xl font-bold text-on-surface">Platform Administration & ML Operations</h1>
        <p className="font-body-md text-xs text-on-surface-variant">Manage datasets, monitor machine learning models, inspect system health, and review audit logs.</p>
      </div>

      {/* Sub navigation */}
      <div className="flex gap-2 border-b border-outline-variant pb-2 text-xs font-semibold">
        <button
          onClick={() => setActiveTab('datasets')}
          className={`px-3 py-1.5 rounded transition-colors flex items-center gap-1.5 ${
            activeTab === 'datasets' ? 'bg-primary-container text-on-primary' : 'text-on-surface-variant hover:bg-surface-container'
          }`}
        >
          <Database size={14} /> Datasets Pipeline
        </button>
        <button
          onClick={() => setActiveTab('models')}
          className={`px-3 py-1.5 rounded transition-colors flex items-center gap-1.5 ${
            activeTab === 'models' ? 'bg-primary-container text-on-primary' : 'text-on-surface-variant hover:bg-surface-container'
          }`}
        >
          <Cpu size={14} /> ML Model Center
        </button>
        <button
          onClick={() => setActiveTab('health')}
          className={`px-3 py-1.5 rounded transition-colors flex items-center gap-1.5 ${
            activeTab === 'health' ? 'bg-primary-container text-on-primary' : 'text-on-surface-variant hover:bg-surface-container'
          }`}
        >
          <Activity size={14} /> System Health
        </button>
        <button
          onClick={() => setActiveTab('audit')}
          className={`px-3 py-1.5 rounded transition-colors flex items-center gap-1.5 ${
            activeTab === 'audit' ? 'bg-primary-container text-on-primary' : 'text-on-surface-variant hover:bg-surface-container'
          }`}
        >
          <FileText size={14} /> Audit Logs
        </button>
      </div>

      {/* Datasets View */}
      {activeTab === 'datasets' && (
        <div className="bg-surface-container-lowest border border-outline-variant rounded-lg overflow-hidden shadow-sm">
          <table className="w-full text-left text-xs border-collapse">
            <thead>
              <tr className="bg-surface-container border-b border-outline-variant font-label-caps text-on-surface-variant uppercase">
                <th className="p-3">Dataset Name</th>
                <th className="p-3">Total Records</th>
                <th className="p-3">Quality Score</th>
                <th className="p-3">Status</th>
                <th className="p-3">Last Updated</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-outline-variant">
              {datasets.map((d, idx) => (
                <tr key={idx} className="hover:bg-surface-container-low transition-colors">
                  <td className="p-3 font-semibold text-on-surface flex items-center gap-2">
                    <Database size={16} className="text-secondary" />
                    <span>{d.name}</span>
                  </td>
                  <td className="p-3 font-data-mono">{d.records}</td>
                  <td className="p-3 font-data-mono font-bold text-green-700">{d.quality}%</td>
                  <td className="p-3 font-medium text-purple-700">{d.status}</td>
                  <td className="p-3 text-on-surface-variant">{d.updated}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {/* ML Models View */}
      {activeTab === 'models' && (
        <div className="bg-surface-container-lowest border border-outline-variant rounded-lg overflow-hidden shadow-sm">
          <table className="w-full text-left text-xs border-collapse">
            <thead>
              <tr className="bg-surface-container border-b border-outline-variant font-label-caps text-on-surface-variant uppercase">
                <th className="p-3">Model Name</th>
                <th className="p-3">Version</th>
                <th className="p-3">Accuracy / F1</th>
                <th className="p-3">Latency</th>
                <th className="p-3">Status</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-outline-variant">
              {models.map((m, idx) => (
                <tr key={idx} className="hover:bg-surface-container-low transition-colors">
                  <td className="p-3 font-semibold text-on-surface flex items-center gap-2">
                    <Cpu size={16} className="text-purple-600" />
                    <span>{m.name}</span>
                  </td>
                  <td className="p-3 font-data-mono">{m.version}</td>
                  <td className="p-3 font-data-mono font-bold text-green-700">{m.accuracy}</td>
                  <td className="p-3 font-data-mono">{m.latency}</td>
                  <td className="p-3 font-medium text-green-700">{m.status}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {/* System Health View */}
      {activeTab === 'health' && (
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-xs">
          <div className="bg-surface-container-lowest border border-outline-variant p-4 rounded-lg">
            <div className="flex items-center gap-2 text-green-700 font-bold mb-2">
              <CheckCircle2 size={16} />
              <span>FastAPI Web Engine</span>
            </div>
            <p className="text-on-surface-variant font-data-mono">Status: Online | Port 8000</p>
          </div>
          <div className="bg-surface-container-lowest border border-outline-variant p-4 rounded-lg">
            <div className="flex items-center gap-2 text-green-700 font-bold mb-2">
              <CheckCircle2 size={16} />
              <span>SQLAlchemy Relational DB</span>
            </div>
            <p className="text-on-surface-variant font-data-mono">Status: Connected | 20 Tables</p>
          </div>
          <div className="bg-surface-container-lowest border border-outline-variant p-4 rounded-lg">
            <div className="flex items-center gap-2 text-green-700 font-bold mb-2">
              <CheckCircle2 size={16} />
              <span>ML Inference Engine</span>
            </div>
            <p className="text-on-surface-variant font-data-mono">Status: Active | Scikit-Learn</p>
          </div>
        </div>
      )}

      {/* Audit Logs View */}
      {activeTab === 'audit' && (
        <div className="bg-surface-container-lowest border border-outline-variant rounded-lg overflow-hidden shadow-sm">
          <table className="w-full text-left text-xs border-collapse">
            <thead>
              <tr className="bg-surface-container border-b border-outline-variant font-label-caps text-on-surface-variant uppercase">
                <th className="p-3">Timestamp</th>
                <th className="p-3">User</th>
                <th className="p-3">Action</th>
                <th className="p-3">Target Entity</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-outline-variant">
              {auditLogs.map((log, idx) => (
                <tr key={idx} className="hover:bg-surface-container-low transition-colors">
                  <td className="p-3 font-data-mono text-on-surface-variant">{log.time}</td>
                  <td className="p-3 font-semibold text-on-surface">{log.user}</td>
                  <td className="p-3 font-data-mono text-purple-700">{log.action}</td>
                  <td className="p-3 text-on-surface-variant">{log.target}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}
