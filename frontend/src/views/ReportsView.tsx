"use client";

import React, { useState } from 'react';
import { FileText, Download, Sparkles, CheckCircle2 } from 'lucide-react';
import { generateReport } from '../lib/api';

export default function ReportsView() {
  const [reports, setReports] = useState([
    { id: 1, type: 'Executive Summary', status: 'Completed', date: '2026-08-01 10:00', file: 'exec_summary.csv' },
    { id: 2, type: 'Supplier Performance & Risk', status: 'Completed', date: '2026-08-05 14:30', file: 'supplier_risk.csv' },
    { id: 3, type: 'Price Benchmark Analysis', status: 'Completed', date: '2026-08-07 09:15', file: 'price_benchmark.csv' }
  ]);
  const [generating, setGenerating] = useState(false);
  const [selectedType, setSelectedType] = useState('Executive Summary');

  const handleGenerate = async () => {
    setGenerating(true);
    try {
      await generateReport(selectedType);
      const newRep = {
        id: reports.length + 1,
        type: selectedType,
        status: 'Completed',
        date: new Date().toISOString().replace('T', ' ').substring(0, 16),
        file: `${selectedType.toLowerCase().replace(/\s+/g, '_')}.csv`
      };
      setReports([newRep, ...reports]);
    } catch (err) {
      console.log('Generated report offline fallback');
    } finally {
      setGenerating(false);
    }
  };

  const handleDownload = (fileName: string) => {
    const content = "Product Name,Category,Price (INR),AI Score,Supplier,Status\nGrundfos CR 32-4,Pumps,245000,98,Grundfos Pumps India,Optimal\nKSB Movitec Inline,Pumps,189500,92,KSB Pumps & Valves,Standard\n";
    const blob = new Blob([content], { type: 'text/csv' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = fileName;
    a.click();
    URL.revokeObjectURL(url);
  };

  return (
    <div className="space-y-6 font-body-md">
      <div>
        <h1 className="font-headline-sm text-xl font-bold text-on-surface">Reports Center & Data Exports</h1>
        <p className="font-body-md text-xs text-on-surface-variant">Generate executive summaries, procurement savings audits, and supplier compliance reports.</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Report Generator Card */}
        <div className="bg-surface-container-lowest border border-outline-variant rounded-lg p-6 space-y-4">
          <h3 className="font-bold text-sm text-on-surface flex items-center gap-2 border-b border-outline-variant pb-2">
            <Sparkles size={16} className="text-purple-600" />
            <span>Generate New Report</span>
          </h3>

          <div className="space-y-3 text-xs">
            <div>
              <label className="block text-on-surface-variant font-semibold mb-1">Report Template</label>
              <select
                value={selectedType}
                onChange={(e) => setSelectedType(e.target.value)}
                className="w-full p-2 border border-outline-variant rounded bg-surface text-on-surface outline-none"
              >
                <option>Executive Summary</option>
                <option>Supplier Performance & Risk</option>
                <option>Procurement Savings Audit</option>
                <option>Price Benchmark Analysis</option>
              </select>
            </div>

            <button
              onClick={handleGenerate}
              disabled={generating}
              className="w-full py-2.5 bg-primary-container text-on-primary rounded font-semibold text-xs hover:bg-primary transition-colors flex items-center justify-center gap-2 shadow"
            >
              <FileText size={16} />
              <span>{generating ? 'Compiling Analytics...' : 'Generate & Export'}</span>
            </button>
          </div>
        </div>

        {/* Existing Reports List */}
        <div className="lg:col-span-2 bg-surface-container-lowest border border-outline-variant rounded-lg overflow-hidden shadow-sm">
          <table className="w-full text-left text-xs border-collapse">
            <thead>
              <tr className="bg-surface-container border-b border-outline-variant font-label-caps text-on-surface-variant uppercase">
                <th className="p-3">Report Title</th>
                <th className="p-3">Generated Date</th>
                <th className="p-3">Status</th>
                <th className="p-3">Export</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-outline-variant">
              {reports.map((r) => (
                <tr key={r.id} className="hover:bg-surface-container-low transition-colors">
                  <td className="p-3 font-semibold text-on-surface flex items-center gap-2">
                    <FileText size={16} className="text-secondary" />
                    <span>{r.type}</span>
                  </td>
                  <td className="p-3 font-data-mono text-on-surface-variant">{r.date}</td>
                  <td className="p-3 font-medium text-green-700">{r.status}</td>
                  <td className="p-3">
                    <button
                      onClick={() => handleDownload(r.file)}
                      className="px-2.5 py-1 bg-surface border border-outline-variant rounded text-on-surface hover:bg-surface-container-low transition-colors flex items-center gap-1 font-medium"
                    >
                      <Download size={12} />
                      <span>Download CSV</span>
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
