"use client";

import React, { useState, useEffect } from 'react';
import {
  ShieldCheck,
  QrCode,
  Scan,
  UserCheck,
  KeyRound,
  Download,
  RotateCw,
  Sparkles,
  CheckCircle2,
  XCircle,
  AlertTriangle,
  Building2,
  BadgePercent,
  Lock,
  Layers,
  History,
  Copy,
  Check
} from 'lucide-react';
import { getTeamBadges, generateDigitalBadge, scanQRCode, getScanLogs } from '../lib/api';

// Zero-dependency mathematical SVG QR Code Matrix Generator
function generateQRMatrix(text: string): boolean[][] {
  const size = 21; // Standard Version 1 QR Matrix size
  const matrix: boolean[][] = Array(size).fill(false).map(() => Array(size).fill(false));

  // Finder patterns at corners (Top-Left, Top-Right, Bottom-Left)
  const placeFinder = (row: number, col: number) => {
    for (let r = 0; r < 7; r++) {
      for (let c = 0; c < 7; c++) {
        if (
          r === 0 || r === 6 || c === 0 || c === 6 ||
          (r >= 2 && r <= 4 && c >= 2 && c <= 4)
        ) {
          matrix[row + r][col + c] = true;
        }
      }
    }
  };

  placeFinder(0, 0);
  placeFinder(0, size - 7);
  placeFinder(size - 7, 0);

  // Timing patterns
  for (let i = 8; i < size - 8; i++) {
    matrix[6][i] = i % 2 === 0;
    matrix[i][6] = i % 2 === 0;
  }

  // Generate deterministic data modules based on text hash
  let hash = 0;
  for (let i = 0; i < text.length; i++) {
    hash = ((hash << 5) - hash) + text.charCodeAt(i);
    hash |= 0;
  }

  for (let r = 0; r < size; r++) {
    for (let c = 0; c < size; c++) {
      // Don't overwrite finders or timing patterns
      if (
        (r < 8 && c < 8) ||
        (r < 8 && c >= size - 8) ||
        (r >= size - 8 && c < 8) ||
        r === 6 || c === 6
      ) {
        continue;
      }
      const val = Math.abs(Math.sin((r * 13 + c * 17 + hash)) * 10000);
      matrix[r][c] = (val % 2) > 0.95;
    }
  }

  return matrix;
}

export default function IDCardSystemView() {
  const [activeTab, setActiveTab] = useState<'card' | 'scanner' | 'logs'>('card');
  const [teamBadges, setTeamBadges] = useState<any[]>([]);
  const [selectedBadge, setSelectedBadge] = useState<any>(null);
  const [isFlipped, setIsFlipped] = useState<boolean>(false);
  const [copiedPayload, setCopiedPayload] = useState<boolean>(false);

  // New badge creation form state
  const [newBadgeForm, setNewBadgeForm] = useState({
    name: '',
    role: 'Procurement Specialist',
    department: 'Quality & Catalog Intelligence',
    organization: 'IndustrialIQ AI / Unilog',
    email: '',
    clearance_level: 'Level 3 - Lead Engineer',
    blood_group: 'O+'
  });

  // Scanner Terminal state
  const [scannerInput, setScannerInput] = useState<string>('');
  const [scannerResult, setScannerResult] = useState<any | null>(null);
  const [isScanning, setIsScanning] = useState<boolean>(false);
  const [terminalLocation, setTerminalLocation] = useState<string>('HQ Facility Gate 01');
  const [scanLogs, setScanLogs] = useState<any[]>([]);

  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    const badges = await getTeamBadges();
    if (badges && badges.length > 0) {
      setTeamBadges(badges);
      setSelectedBadge(badges[0]);
    }
    const logs = await getScanLogs();
    if (logs) setScanLogs(logs);
  };

  const handleCreateBadge = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newBadgeForm.name) return;
    const created = await generateDigitalBadge(newBadgeForm);
    if (created) {
      setTeamBadges([created, ...teamBadges]);
      setSelectedBadge(created);
      alert(`Digital ID Card generated successfully for ${created.name}! Badge ID: ${created.badge_id}`);
      setNewBadgeForm({
        name: '',
        role: 'Procurement Specialist',
        department: 'Quality & Catalog Intelligence',
        organization: 'IndustrialIQ AI / Unilog',
        email: '',
        clearance_level: 'Level 3 - Lead Engineer',
        blood_group: 'O+'
      });
    }
  };

  const handleTriggerScan = async (payloadToScan?: string) => {
    const rawPayload = payloadToScan || scannerInput || selectedBadge?.qr_payload || selectedBadge?.badge_id;
    if (!rawPayload) return;

    setIsScanning(true);
    setTimeout(async () => {
      const res = await scanQRCode(rawPayload, terminalLocation);
      setScannerResult(res);
      setIsScanning(false);
      const updatedLogs = await getScanLogs();
      if (updatedLogs) setScanLogs(updatedLogs);
    }, 600);
  };

  const handleCopyPayload = () => {
    const payload = selectedBadge?.qr_payload || selectedBadge?.badge_id || '';
    navigator.clipboard.writeText(payload);
    setCopiedPayload(true);
    setTimeout(() => setCopiedPayload(false), 2000);
  };

  const qrMatrix = selectedBadge ? generateQRMatrix(selectedBadge.badge_id + selectedBadge.name) : [];

  return (
    <div className="space-y-8 max-w-[1600px] mx-auto font-body-md animate-fade-in text-on-surface">
      {/* Header Banner */}
      <div className="bg-gradient-to-r from-primary-container/40 via-surface-container-high/70 to-secondary-container/40 border border-outline-variant/40 rounded-3xl p-6 sm:p-8 shadow-sm relative overflow-hidden">
        <div className="max-w-3xl space-y-3 relative z-10">
          <div className="inline-flex items-center gap-2 px-3 py-1 bg-primary/20 text-primary rounded-full border border-primary/30 text-xs font-bold uppercase tracking-wider">
            <ShieldCheck size={14} /> Cryptographic Access & Identity System
          </div>
          <h1 className="text-2xl sm:text-4xl font-extrabold tracking-tight text-on-surface">
            Digital ID Card & Real-Time QR Verification System
          </h1>
          <p className="text-xs sm:text-sm text-on-surface-variant leading-relaxed">
            Enterprise-grade digital identification badge generator, holographic verified credentials, dynamic 2D QR matrix generation, and high-security contactless verification terminal.
          </p>
        </div>
      </div>

      {/* Navigation Sub-Tabs */}
      <div className="flex items-center gap-2 border-b border-outline-variant/30 pb-2">
        <button
          onClick={() => setActiveTab('card')}
          className={`px-4 py-2.5 rounded-xl text-xs font-bold transition-all flex items-center gap-2 ${
            activeTab === 'card'
              ? 'bg-primary text-on-primary shadow-md'
              : 'bg-surface-container-high/60 text-on-surface-variant hover:text-on-surface hover:bg-surface-container-highest border border-outline-variant/30'
          }`}
        >
          <QrCode size={16} />
          <span>Digital ID Badge Studio</span>
        </button>

        <button
          onClick={() => setActiveTab('scanner')}
          className={`px-4 py-2.5 rounded-xl text-xs font-bold transition-all flex items-center gap-2 ${
            activeTab === 'scanner'
              ? 'bg-primary text-on-primary shadow-md'
              : 'bg-surface-container-high/60 text-on-surface-variant hover:text-on-surface hover:bg-surface-container-highest border border-outline-variant/30'
          }`}
        >
          <Scan size={16} />
          <span>Live QR Scanner & Gate Verifier</span>
        </button>

        <button
          onClick={() => setActiveTab('logs')}
          className={`px-4 py-2.5 rounded-xl text-xs font-bold transition-all flex items-center gap-2 ${
            activeTab === 'logs'
              ? 'bg-primary text-on-primary shadow-md'
              : 'bg-surface-container-high/60 text-on-surface-variant hover:text-on-surface hover:bg-surface-container-highest border border-outline-variant/30'
          }`}
        >
          <History size={16} />
          <span>Access Audit Telemetry ({scanLogs.length})</span>
        </button>
      </div>

      {/* TAB 1: DIGITAL ID BADGE STUDIO */}
      {activeTab === 'card' && (
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
          {/* Left Column: Preset Badge Selector & Generator Form (5 cols) */}
          <div className="lg:col-span-5 space-y-6">
            {/* Team Badges Quick Switcher */}
            <div className="p-5 rounded-2xl bg-surface-container-low border border-outline-variant/30 space-y-3">
              <h3 className="text-xs font-bold uppercase tracking-wider text-primary flex items-center gap-2">
                <UserCheck size={16} /> Verified Team Member ID Badges
              </h3>
              <div className="space-y-2">
                {teamBadges.map((b) => (
                  <button
                    key={b.badge_id}
                    onClick={() => {
                      setSelectedBadge(b);
                      setIsFlipped(false);
                    }}
                    className={`w-full p-3 rounded-xl border text-left transition-all flex items-center justify-between ${
                      selectedBadge?.badge_id === b.badge_id
                        ? 'bg-primary/15 border-primary text-on-surface shadow-sm'
                        : 'bg-surface-container border-outline-variant/30 text-on-surface-variant hover:bg-surface-container-high'
                    }`}
                  >
                    <div className="flex items-center gap-3">
                      <div className="w-9 h-9 rounded-xl bg-primary/20 text-primary font-black flex items-center justify-center text-sm border border-primary/30 shrink-0">
                        {b.name.charAt(0)}
                      </div>
                      <div>
                        <p className="text-xs font-bold text-on-surface">{b.name}</p>
                        <p className="text-[10px] text-on-surface-variant">{b.role}</p>
                      </div>
                    </div>

                    <div className="text-right">
                      <span className="text-[10px] font-mono font-bold text-primary block">{b.badge_id}</span>
                      <span className="text-[9px] text-emerald-400 font-semibold">{b.clearance_level.split(' - ')[0]}</span>
                    </div>
                  </button>
                ))}
              </div>
            </div>

            {/* Custom ID Card Generator Form */}
            <div className="p-5 rounded-2xl bg-surface-container-low border border-outline-variant/30 space-y-4">
              <h3 className="text-xs font-bold uppercase tracking-wider text-on-surface flex items-center gap-2">
                <KeyRound size={16} className="text-amber-400" /> Issue New Digital Identity Badge
              </h3>

              <form onSubmit={handleCreateBadge} className="space-y-3 text-xs">
                <div>
                  <label className="block font-semibold text-on-surface mb-1">Full Personnel Name</label>
                  <input
                    type="text"
                    required
                    value={newBadgeForm.name}
                    onChange={(e) => setNewBadgeForm({ ...newBadgeForm, name: e.target.value })}
                    placeholder="e.g. John Doe"
                    className="w-full p-2.5 rounded-xl bg-surface-container border border-outline-variant/40 text-on-surface outline-none focus:border-primary"
                  />
                </div>

                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="block font-semibold text-on-surface mb-1">Designation / Role</label>
                    <input
                      type="text"
                      required
                      value={newBadgeForm.role}
                      onChange={(e) => setNewBadgeForm({ ...newBadgeForm, role: e.target.value })}
                      placeholder="e.g. Procurement Lead"
                      className="w-full p-2 rounded-xl bg-surface-container border border-outline-variant/40 text-on-surface outline-none focus:border-primary"
                    />
                  </div>
                  <div>
                    <label className="block font-semibold text-on-surface mb-1">Department</label>
                    <input
                      type="text"
                      value={newBadgeForm.department}
                      onChange={(e) => setNewBadgeForm({ ...newBadgeForm, department: e.target.value })}
                      placeholder="e.g. Quality Engineering"
                      className="w-full p-2 rounded-xl bg-surface-container border border-outline-variant/40 text-on-surface outline-none focus:border-primary"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="block font-semibold text-on-surface mb-1">Clearance Level</label>
                    <select
                      value={newBadgeForm.clearance_level}
                      onChange={(e) => setNewBadgeForm({ ...newBadgeForm, clearance_level: e.target.value })}
                      className="w-full p-2 rounded-xl bg-surface-container border border-outline-variant/40 text-on-surface outline-none focus:border-primary"
                    >
                      <option value="Level 4 - Master Admin">Level 4 - Master Admin</option>
                      <option value="Level 3 - Lead Engineer">Level 3 - Lead Engineer</option>
                      <option value="Level 2 - Procurement Analyst">Level 2 - Procurement Analyst</option>
                      <option value="Level 1 - Facility Operator">Level 1 - Facility Operator</option>
                      <option value="Guest - Verified Supplier">Guest - Verified Supplier</option>
                    </select>
                  </div>
                  <div>
                    <label className="block font-semibold text-on-surface mb-1">Blood Group</label>
                    <input
                      type="text"
                      value={newBadgeForm.blood_group}
                      onChange={(e) => setNewBadgeForm({ ...newBadgeForm, blood_group: e.target.value })}
                      placeholder="e.g. O+, A+, B+"
                      className="w-full p-2 rounded-xl bg-surface-container border border-outline-variant/40 text-on-surface outline-none focus:border-primary"
                    />
                  </div>
                </div>

                <button
                  type="submit"
                  className="w-full py-2.5 rounded-xl bg-primary text-on-primary font-bold text-xs hover:bg-primary/90 transition-all flex items-center justify-center gap-2 shadow-md mt-1"
                >
                  <Sparkles size={16} /> Generate Verifiable Digital Badge
                </button>
              </form>
            </div>
          </div>

          {/* Right Column: Interactive 3D Digital ID Card Canvas (7 cols) */}
          <div className="lg:col-span-7 flex flex-col items-center justify-center space-y-5">
            {selectedBadge ? (
              <>
                {/* Physical-Style Industrial ID Card */}
                <div className="relative w-full max-w-[420px] aspect-[1/1.58] perspective-1000 group">
                  <div
                    className={`w-full h-full rounded-3xl p-6 transition-all duration-700 shadow-2xl relative border flex flex-col justify-between overflow-hidden ${
                      isFlipped
                        ? 'bg-gradient-to-br from-surface-container-highest via-surface-container-high to-surface-container border-outline-variant/60'
                        : 'bg-gradient-to-br from-surface-container-lowest via-surface-container-low to-surface-container-high border-primary/40'
                    }`}
                  >
                    {/* Holographic Top Security Strip */}
                    <div className="absolute top-0 left-0 right-0 h-2.5 bg-gradient-to-r from-purple-500 via-primary to-cyan-400 opacity-90" />

                    {!isFlipped ? (
                      /* FRONT OF BADGE */
                      <>
                        {/* Header Branding */}
                        <div className="flex items-center justify-between pt-1 border-b border-outline-variant/30 pb-3">
                          <div className="flex items-center gap-2.5">
                            <div className="w-8 h-8 rounded-lg bg-primary text-on-primary flex items-center justify-center font-bold shadow-md">
                              <ShieldCheck size={18} />
                            </div>
                            <div>
                              <h2 className="font-extrabold text-xs tracking-wider uppercase text-on-surface">
                                IndustrialIQ
                              </h2>
                              <p className="text-[9px] font-mono text-primary uppercase tracking-widest font-semibold">
                                Enterprise Verified ID
                              </p>
                            </div>
                          </div>

                          <div className="text-right">
                            <span className="px-2 py-0.5 rounded-full text-[9px] font-bold bg-emerald-500/15 text-emerald-400 border border-emerald-500/30 uppercase">
                              Active
                            </span>
                            <span className="block text-[9px] font-mono text-on-surface-variant mt-0.5">
                              {selectedBadge.blood_group}
                            </span>
                          </div>
                        </div>

                        {/* Personnel Avatar & Info */}
                        <div className="flex flex-col items-center text-center my-auto space-y-2.5">
                          {/* Photo Frame with Clearance Glow Ring */}
                          <div className="relative">
                            <div className="w-24 h-24 rounded-2xl bg-gradient-to-br from-primary/30 via-surface-container-high to-secondary-container/30 border-2 border-primary flex items-center justify-center font-black text-2xl text-primary shadow-lg overflow-hidden">
                              {selectedBadge.name
                                .split(' ')
                                .map((n: string) => n[0])
                                .join('')}
                            </div>
                            <div className="absolute -bottom-1 -right-1 w-6 h-6 rounded-full bg-emerald-500 text-white flex items-center justify-center shadow-md border-2 border-surface">
                              <Check size={12} />
                            </div>
                          </div>

                          <div>
                            <h3 className="text-lg font-black text-on-surface tracking-tight">
                              {selectedBadge.name}
                            </h3>
                            <p className="text-xs font-bold text-primary mt-0.5">
                              {selectedBadge.role}
                            </p>
                            <p className="text-[10px] text-on-surface-variant mt-0.5">
                              {selectedBadge.department} • {selectedBadge.organization}
                            </p>
                          </div>

                          <span className="px-3 py-1 rounded-full text-[10px] font-bold bg-primary/10 text-primary border border-primary/30">
                            {selectedBadge.clearance_level}
                          </span>
                        </div>

                        {/* Bottom QR & Serial Section */}
                        <div className="pt-3 border-t border-outline-variant/30 flex items-center justify-between bg-surface-container/50 -mx-6 -mb-6 p-4 rounded-b-3xl">
                          <div className="space-y-0.5 text-left">
                            <span className="text-[9px] uppercase font-bold text-on-surface-variant">Badge ID</span>
                            <p className="font-mono text-xs font-black text-primary tracking-wider">
                              {selectedBadge.badge_id}
                            </p>
                            <span className="text-[9px] text-on-surface-variant font-mono block">
                              EXP: {selectedBadge.expires_at}
                            </span>
                          </div>

                          {/* Dynamic SVG QR Code */}
                          <div className="bg-white p-1.5 rounded-xl shadow-md border border-outline-variant/40 shrink-0">
                            <svg width="60" height="60" viewBox="0 0 21 21" className="shape-rendering-crisp">
                              {qrMatrix.map((row, r) =>
                                row.map((filled, c) => (
                                  <rect
                                    key={`${r}-${c}`}
                                    x={c}
                                    y={r}
                                    width="1"
                                    height="1"
                                    fill={filled ? '#0f172a' : '#ffffff'}
                                  />
                                ))
                              )}
                            </svg>
                          </div>
                        </div>
                      </>
                    ) : (
                      /* BACK OF BADGE */
                      <>
                        <div className="pt-2 border-b border-outline-variant/30 pb-3">
                          <h4 className="text-xs font-bold uppercase tracking-wider text-on-surface flex items-center gap-1.5">
                            <Lock size={14} className="text-primary" /> Authorization Scope & Terms
                          </h4>
                          <p className="text-[10px] text-on-surface-variant mt-1">
                            This digital credential is property of IndustrialIQ AI. Authorized access granted only to verified personnel.
                          </p>
                        </div>

                        <div className="space-y-3 my-auto text-xs">
                          <div>
                            <span className="text-[10px] uppercase font-bold text-on-surface-variant block mb-1">
                              Authorized Access Zones:
                            </span>
                            <div className="flex flex-wrap gap-1.5">
                              {(selectedBadge.access_zones || ["AI ML Center", "Procurement Desk"]).map((z: string, i: number) => (
                                <span key={i} className="px-2 py-0.5 rounded text-[10px] bg-primary/10 text-primary border border-primary/20 font-medium">
                                  {z}
                                </span>
                              ))}
                            </div>
                          </div>

                          <div className="p-2.5 rounded-xl bg-surface-container-lowest border border-outline-variant/20 space-y-1">
                            <div className="flex justify-between text-[10px]">
                              <span className="text-on-surface-variant">Security Hash:</span>
                              <span className="font-mono text-primary font-bold">{selectedBadge.verification_hash}</span>
                            </div>
                            <div className="flex justify-between text-[10px]">
                              <span className="text-on-surface-variant">Issued Date:</span>
                              <span className="font-mono text-on-surface">{selectedBadge.issued_at}</span>
                            </div>
                            <div className="flex justify-between text-[10px]">
                              <span className="text-on-surface-variant">Emergency Concierge:</span>
                              <span className="font-mono text-emerald-400">+1 (800) 555-IIQ-SEC</span>
                            </div>
                          </div>
                        </div>

                        <div className="pt-3 border-t border-outline-variant/30 text-center -mx-6 -mb-6 p-3 bg-surface-container/40 rounded-b-3xl">
                          <p className="text-[9px] font-mono text-on-surface-variant">
                            UNILOG INDUSTRIAL COMMERCE INTELLIGENCE PLATFORM • 2026
                          </p>
                        </div>
                      </>
                    )}
                  </div>
                </div>

                {/* Card Interactive Controls Bar */}
                <div className="flex items-center gap-2.5">
                  <button
                    onClick={() => setIsFlipped(!isFlipped)}
                    className="px-4 py-2 rounded-xl bg-surface-container-high border border-outline-variant/50 hover:bg-surface-container-highest text-xs font-semibold text-on-surface transition-all flex items-center gap-1.5 shadow-sm"
                  >
                    <RotateCw size={15} className="text-primary" />
                    Flip Card ({isFlipped ? 'Front' : 'Back'})
                  </button>

                  <button
                    onClick={handleCopyPayload}
                    className="px-4 py-2 rounded-xl bg-surface-container-high border border-outline-variant/50 hover:bg-surface-container-highest text-xs font-semibold text-on-surface transition-all flex items-center gap-1.5 shadow-sm"
                  >
                    {copiedPayload ? <Check size={15} className="text-emerald-400" /> : <Copy size={15} className="text-primary" />}
                    {copiedPayload ? 'Copied QR Payload!' : 'Copy QR Data'}
                  </button>

                  <button
                    onClick={() => {
                      setActiveTab('scanner');
                      handleTriggerScan(selectedBadge.badge_id);
                    }}
                    className="px-4 py-2 rounded-xl bg-primary text-on-primary text-xs font-bold hover:bg-primary/90 transition-all flex items-center gap-1.5 shadow-md"
                  >
                    <Scan size={15} />
                    Test Gate Scan
                  </button>
                </div>
              </>
            ) : (
              <div className="p-12 text-center text-on-surface-variant bg-surface-container rounded-2xl">
                Select or generate an identity badge.
              </div>
            )}
          </div>
        </div>
      )}

      {/* TAB 2: LIVE QR SCANNER & GATE VERIFICATION TERMINAL */}
      {activeTab === 'scanner' && (
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
          {/* Left Column: Scanner Terminal Viewport (6 cols) */}
          <div className="lg:col-span-6 p-6 rounded-3xl bg-surface-container-low border border-outline-variant/30 space-y-5 shadow-sm">
            <div className="flex items-center justify-between">
              <div>
                <h3 className="text-sm font-bold text-on-surface flex items-center gap-2">
                  <Scan size={18} className="text-primary" /> Security Access Terminal & QR Scanner
                </h3>
                <p className="text-xs text-on-surface-variant mt-0.5">
                  Point QR code or click preset badges to verify real-time cryptographic authorization.
                </p>
              </div>
              <span className="px-2.5 py-1 rounded-full text-[10px] font-mono font-bold bg-emerald-500/10 text-emerald-400 border border-emerald-500/30">
                TERMINAL ONLINE
              </span>
            </div>

            {/* Simulated Optical QR Scanner Viewport */}
            <div className="relative aspect-video rounded-2xl bg-black/90 border-2 border-primary/50 overflow-hidden flex flex-col items-center justify-center p-6 text-center shadow-inner">
              {/* Animated Laser Scanning Beam */}
              {isScanning && (
                <div className="absolute inset-x-0 h-1 bg-gradient-to-r from-transparent via-cyan-400 to-transparent shadow-[0_0_15px_#22d3ee] animate-bounce top-1/4" />
              )}

              {/* Viewport Reticle Corners */}
              <div className="w-48 h-48 border-2 border-dashed border-primary/60 rounded-2xl relative flex items-center justify-center">
                <div className="absolute top-0 left-0 w-4 h-4 border-t-2 border-l-2 border-cyan-400" />
                <div className="absolute top-0 right-0 w-4 h-4 border-t-2 border-r-2 border-cyan-400" />
                <div className="absolute bottom-0 left-0 w-4 h-4 border-b-2 border-l-2 border-cyan-400" />
                <div className="absolute bottom-0 right-0 w-4 h-4 border-b-2 border-r-2 border-cyan-400" />
                
                <div className="text-center space-y-1">
                  <QrCode size={36} className="text-primary/70 mx-auto animate-pulse" />
                  <span className="text-[10px] font-mono text-cyan-300 block">
                    {isScanning ? 'DECRYPTING SIGNATURE...' : 'ALIGN QR CODE HERE'}
                  </span>
                </div>
              </div>

              <span className="absolute bottom-3 text-[10px] font-mono text-on-surface-variant">
                LOCATION: {terminalLocation} • SHA-256 VALIDATED
              </span>
            </div>

            {/* Quick Test Scanner Controls */}
            <div className="space-y-2">
              <label className="block text-[11px] font-bold text-on-surface uppercase tracking-wider">
                Quick Test: Select Badge to Scan
              </label>
              <div className="grid grid-cols-3 gap-2">
                {teamBadges.map((b) => (
                  <button
                    key={b.badge_id}
                    onClick={() => {
                      setScannerInput(b.badge_id);
                      handleTriggerScan(b.badge_id);
                    }}
                    className="p-2 rounded-xl bg-surface-container hover:bg-primary/20 border border-outline-variant/40 text-xs font-semibold text-on-surface text-center transition-all truncate"
                  >
                    {b.name.split(' ')[0]} ({b.badge_id.slice(-4)})
                  </button>
                ))}
              </div>
            </div>

            {/* Manual QR / Barcode Input */}
            <div className="flex gap-2">
              <input
                type="text"
                value={scannerInput}
                onChange={(e) => setScannerInput(e.target.value)}
                placeholder="Or paste QR payload / Badge ID..."
                className="flex-1 px-3 py-2 rounded-xl bg-surface-container border border-outline-variant/40 text-xs text-on-surface outline-none focus:border-primary font-mono"
              />
              <button
                onClick={() => handleTriggerScan()}
                disabled={isScanning}
                className="px-4 py-2 rounded-xl bg-primary text-on-primary font-bold text-xs hover:bg-primary/90 transition-all flex items-center gap-1.5 shrink-0"
              >
                <Scan size={15} />
                Scan Code
              </button>
            </div>
          </div>

          {/* Right Column: Gate Verification Result & Access Decision (6 cols) */}
          <div className="lg:col-span-6 space-y-4">
            {scannerResult ? (
              <div
                className={`p-6 rounded-3xl border transition-all space-y-5 shadow-lg ${
                  scannerResult.status === 'ACCESS_GRANTED'
                    ? 'bg-emerald-950/20 border-emerald-500/50'
                    : 'bg-red-950/20 border-red-500/50'
                }`}
              >
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <div
                      className={`w-12 h-12 rounded-2xl flex items-center justify-center font-bold shadow-md ${
                        scannerResult.status === 'ACCESS_GRANTED'
                          ? 'bg-emerald-500 text-white'
                          : 'bg-red-500 text-white'
                      }`}
                    >
                      {scannerResult.status === 'ACCESS_GRANTED' ? (
                        <CheckCircle2 size={28} />
                      ) : (
                        <XCircle size={28} />
                      )}
                    </div>
                    <div>
                      <span
                        className={`text-xs font-black uppercase tracking-wider ${
                          scannerResult.status === 'ACCESS_GRANTED'
                            ? 'text-emerald-400'
                            : 'text-red-400'
                        }`}
                      >
                        {scannerResult.status === 'ACCESS_GRANTED'
                          ? 'ACCESS GRANTED • IDENTITY VERIFIED'
                          : 'ACCESS DENIED • SIGNATURE INVALID'}
                      </span>
                      <h3 className="text-base font-extrabold text-on-surface mt-0.5">
                        {scannerResult.message}
                      </h3>
                    </div>
                  </div>
                </div>

                {scannerResult.badge && (
                  <div className="p-4 rounded-2xl bg-surface-container border border-outline-variant/30 space-y-3 text-xs">
                    <div className="grid grid-cols-2 gap-3">
                      <div>
                        <span className="text-[10px] text-on-surface-variant uppercase font-bold">Personnel</span>
                        <p className="font-bold text-on-surface mt-0.5">{scannerResult.badge.name}</p>
                      </div>
                      <div>
                        <span className="text-[10px] text-on-surface-variant uppercase font-bold">Badge ID</span>
                        <p className="font-mono font-bold text-primary mt-0.5">{scannerResult.badge.badge_id}</p>
                      </div>
                      <div>
                        <span className="text-[10px] text-on-surface-variant uppercase font-bold">Designation</span>
                        <p className="text-on-surface mt-0.5">{scannerResult.badge.role}</p>
                      </div>
                      <div>
                        <span className="text-[10px] text-on-surface-variant uppercase font-bold">Clearance Level</span>
                        <p className="font-bold text-emerald-400 mt-0.5">{scannerResult.badge.clearance_level}</p>
                      </div>
                    </div>

                    <div className="pt-2 border-t border-outline-variant/20 flex justify-between text-[10px] text-on-surface-variant">
                      <span>Gate: {terminalLocation}</span>
                      <span>Verified: {scannerResult.scan_timestamp}</span>
                    </div>
                  </div>
                )}
              </div>
            ) : (
              <div className="p-12 text-center text-on-surface-variant bg-surface-container-low border border-outline-variant/30 rounded-3xl space-y-2">
                <Scan size={36} className="mx-auto text-primary/40" />
                <p className="font-bold text-sm text-on-surface">Terminal Awaiting Scan</p>
                <p className="text-xs max-w-sm mx-auto">
                  Click any team member preset on the left or scan a badge QR code to verify security credentials in real time.
                </p>
              </div>
            )}
          </div>
        </div>
      )}

      {/* TAB 3: ACCESS AUDIT TELEMETRY & SCAN LOGS */}
      {activeTab === 'logs' && (
        <div className="p-6 rounded-3xl bg-surface-container-low border border-outline-variant/30 space-y-4">
          <div className="flex items-center justify-between">
            <h3 className="text-sm font-bold text-on-surface flex items-center gap-2">
              <History size={18} className="text-primary" /> Live Facility Access Audit Trail
            </h3>
            <span className="text-xs font-mono text-on-surface-variant">
              Total Recorded Scans: {scanLogs.length}
            </span>
          </div>

          <div className="overflow-x-auto rounded-2xl border border-outline-variant/30">
            <table className="w-full text-left text-xs">
              <thead className="bg-surface-container text-on-surface-variant font-semibold border-b border-outline-variant/30">
                <tr>
                  <th className="p-3.5">Log ID</th>
                  <th className="p-3.5">Badge ID</th>
                  <th className="p-3.5">Personnel Name</th>
                  <th className="p-3.5">Clearance Level</th>
                  <th className="p-3.5">Terminal Location</th>
                  <th className="p-3.5">Timestamp</th>
                  <th className="p-3.5">Access Status</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-outline-variant/20">
                {scanLogs.map((log, idx) => (
                  <tr key={idx} className="hover:bg-surface-container-high/40 transition-colors">
                    <td className="p-3.5 font-mono text-on-surface-variant">{log.scan_id}</td>
                    <td className="p-3.5 font-mono font-bold text-primary">{log.badge_id}</td>
                    <td className="p-3.5 font-bold text-on-surface">{log.name}</td>
                    <td className="p-3.5 text-on-surface-variant">{log.clearance}</td>
                    <td className="p-3.5 text-on-surface-variant">{log.location}</td>
                    <td className="p-3.5 font-mono text-[11px] text-on-surface-variant">{log.timestamp}</td>
                    <td className="p-3.5">
                      <span className="px-2.5 py-1 rounded-full text-[10px] font-bold bg-emerald-500/10 text-emerald-400 border border-emerald-500/20">
                        {log.status}
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}
    </div>
  );
}
