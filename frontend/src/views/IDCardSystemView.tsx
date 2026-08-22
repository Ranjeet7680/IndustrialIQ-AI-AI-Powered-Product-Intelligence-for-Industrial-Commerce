"use client";

import React, { useState, useEffect, useRef, useCallback } from 'react';
import {
  ShieldCheck, QrCode, Scan, UserCheck, KeyRound, Download,
  RotateCw, Sparkles, CheckCircle2, XCircle, Lock, History,
  Copy, Check, Printer, Camera, CameraOff, RefreshCw, Wifi,
  AlertTriangle, ZapIcon, BadgeCheck
} from 'lucide-react';
import { getTeamBadges, generateDigitalBadge, scanQRCode, getScanLogs } from '../lib/api';

/* ════════════════════════════════════════════════════════════
   REAL QR CODE GENERATOR — uses qrcode lib (canvas API)
   Falls back to a deterministic SVG matrix if lib unavailable
═══════════════════════════════════════════════════════════ */
async function generateQRDataURL(text: string): Promise<string> {
  try {
    // Dynamic import so it's only loaded client-side
    const QRCode = (await import('qrcode')).default;
    return await QRCode.toDataURL(text, {
      width: 200,
      margin: 1,
      color: { dark: '#0f172a', light: '#ffffff' },
      errorCorrectionLevel: 'H'
    });
  } catch {
    return '';
  }
}

/* ════════════════════════════════════════════════════════════
   REAL-TIME CAMERA QR SCANNER COMPONENT
   Uses html5-qrcode — actual device camera
═══════════════════════════════════════════════════════════ */
interface LiveScannerProps {
  onScanSuccess: (decodedText: string) => void;
  onScanError?: (error: string) => void;
  isActive: boolean;
}

function LiveCameraScanner({ onScanSuccess, isActive }: LiveScannerProps) {
  const scannerRef = useRef<any>(null);
  const containerRef = useRef<HTMLDivElement>(null);
  const [cameraError, setCameraError] = useState<string>('');
  const [isCameraRunning, setIsCameraRunning] = useState(false);

  const startScanner = useCallback(async () => {
    if (!containerRef.current || scannerRef.current) return;
    try {
      const { Html5Qrcode } = await import('html5-qrcode');
      const scanner = new Html5Qrcode('qr-scanner-region');
      scannerRef.current = scanner;

      await scanner.start(
        { facingMode: 'environment' },
        { fps: 15, qrbox: { width: 220, height: 220 } },
        (decodedText: string) => {
          onScanSuccess(decodedText);
        },
        () => { /* suppress ongoing not-found errors */ }
      );
      setIsCameraRunning(true);
      setCameraError('');
    } catch (err: any) {
      const msg = err?.message || 'Camera not available';
      if (msg.includes('NotAllowed') || msg.includes('Permission')) {
        setCameraError('Camera permission denied. Please allow camera access.');
      } else if (msg.includes('NotFound') || msg.includes('device')) {
        setCameraError('No camera device found on this machine.');
      } else {
        setCameraError('Camera unavailable: ' + msg);
      }
      setIsCameraRunning(false);
    }
  }, [onScanSuccess]);

  const stopScanner = useCallback(async () => {
    if (scannerRef.current) {
      try {
        await scannerRef.current.stop();
        scannerRef.current.clear();
      } catch {}
      scannerRef.current = null;
    }
    setIsCameraRunning(false);
  }, []);

  useEffect(() => {
    if (isActive) {
      startScanner();
    } else {
      stopScanner();
    }
    return () => { stopScanner(); };
  }, [isActive, startScanner, stopScanner]);

  return (
    <div className="relative">
      {/* Camera viewport */}
      <div className="relative rounded-2xl overflow-hidden bg-black" style={{ minHeight: 280 }}>
        <div id="qr-scanner-region" className="w-full" />

        {/* Overlay corners when camera running */}
        {isCameraRunning && (
          <>
            <div className="absolute top-4 left-4 w-8 h-8 border-t-2 border-l-2 border-cyan-400 rounded-tl-lg" />
            <div className="absolute top-4 right-4 w-8 h-8 border-t-2 border-r-2 border-cyan-400 rounded-tr-lg" />
            <div className="absolute bottom-4 left-4 w-8 h-8 border-b-2 border-l-2 border-cyan-400 rounded-bl-lg" />
            <div className="absolute bottom-4 right-4 w-8 h-8 border-b-2 border-r-2 border-cyan-400 rounded-br-lg" />
            {/* Scanning laser */}
            <div
              className="absolute left-4 right-4 h-0.5 bg-gradient-to-r from-transparent via-cyan-400 to-transparent"
              style={{
                top: '50%',
                boxShadow: '0 0 12px 2px #22d3ee',
                animation: 'scanLine 2s ease-in-out infinite'
              }}
            />
            <div className="absolute bottom-3 left-0 right-0 text-center">
              <span className="text-[10px] font-mono text-cyan-300 bg-black/60 px-2 py-0.5 rounded">
                LIVE CAMERA • ALIGN QR CODE IN FRAME
              </span>
            </div>
          </>
        )}

        {/* Error or no-camera state */}
        {!isCameraRunning && (
          <div
            className="absolute inset-0 flex flex-col items-center justify-center gap-3 bg-black/90"
            style={{ minHeight: 280 }}
          >
            {cameraError ? (
              <>
                <CameraOff size={36} className="text-red-400" />
                <p className="text-xs text-red-300 text-center max-w-[220px]">{cameraError}</p>
                <button
                  onClick={startScanner}
                  className="px-3 py-1.5 rounded-lg bg-cyan-500/20 text-cyan-300 text-xs font-semibold border border-cyan-500/30 flex items-center gap-1.5"
                >
                  <RefreshCw size={13} /> Retry Camera
                </button>
              </>
            ) : (
              <>
                <Camera size={36} className="text-cyan-400/50" />
                <p className="text-xs text-cyan-300/60 text-center">Starting camera…</p>
              </>
            )}
          </div>
        )}
      </div>
    </div>
  );
}

/* ════════════════════════════════════════════════════════════
   PRINT STYLES — injected as a <style> tag, only active
   during window.print()
═══════════════════════════════════════════════════════════ */
const PRINT_STYLES = `
@media print {
  body * { visibility: hidden !important; }
  #id-card-print-root, #id-card-print-root * { visibility: visible !important; }
  #id-card-print-root {
    position: fixed !important;
    top: 0 !important; left: 0 !important;
    width: 100vw !important; height: 100vh !important;
    display: flex !important;
    align-items: center !important;
    justify-content: center !important;
    background: white !important;
    z-index: 99999 !important;
  }
  .no-print { display: none !important; }
}
@keyframes scanLine {
  0%   { top: 20%; }
  50%  { top: 80%; }
  100% { top: 20%; }
}
@keyframes fadeUp {
  from { opacity: 0; transform: translateY(16px); }
  to   { opacity: 1; transform: translateY(0); }
}
@keyframes grantPulse {
  0%   { box-shadow: 0 0 0 0 rgba(16,185,129,0.5); }
  70%  { box-shadow: 0 0 0 16px rgba(16,185,129,0); }
  100% { box-shadow: 0 0 0 0 rgba(16,185,129,0); }
}
@keyframes denyPulse {
  0%   { box-shadow: 0 0 0 0 rgba(239,68,68,0.5); }
  70%  { box-shadow: 0 0 0 16px rgba(239,68,68,0); }
  100% { box-shadow: 0 0 0 0 rgba(239,68,68,0); }
}
@keyframes hologram {
  0%, 100% { opacity: 0.6; }
  50%       { opacity: 1; }
}
`;

/* ════════════════════════════════════════════════════════════
   MAIN COMPONENT
═══════════════════════════════════════════════════════════ */
export default function IDCardSystemView() {
  const [activeTab, setActiveTab] = useState<'card' | 'scanner' | 'logs'>('card');
  const [teamBadges, setTeamBadges] = useState<any[]>([]);
  const [selectedBadge, setSelectedBadge] = useState<any>(null);
  const [isFlipped, setIsFlipped] = useState(false);
  const [copiedPayload, setCopiedPayload] = useState(false);
  const [qrDataURL, setQrDataURL] = useState<string>('');

  // New badge form
  const [newBadgeForm, setNewBadgeForm] = useState({
    name: '', role: 'Procurement Specialist',
    department: 'Quality & Catalog Intelligence',
    organization: 'IndustrialIQ AI / Unilog',
    email: '', clearance_level: 'Level 3 - Lead Engineer', blood_group: 'O+'
  });
  const [isCreating, setIsCreating] = useState(false);
  const [createSuccess, setCreateSuccess] = useState(false);

  // Scanner state
  const [cameraActive, setCameraActive] = useState(false);
  const [scannerInput, setScannerInput] = useState('');
  const [scannerResult, setScannerResult] = useState<any | null>(null);
  const [isScanning, setIsScanning] = useState(false);
  const [terminalLocation, setTerminalLocation] = useState('HQ Facility Gate 01');
  const [scanLogs, setScanLogs] = useState<any[]>([]);
  const [localScanLogs, setLocalScanLogs] = useState<any[]>([]);

  useEffect(() => {
    loadData();
    // Inject print styles
    const styleEl = document.createElement('style');
    styleEl.innerHTML = PRINT_STYLES;
    document.head.appendChild(styleEl);
    return () => { document.head.removeChild(styleEl); };
  }, []);

  useEffect(() => {
    if (selectedBadge) {
      const payload = `IIQ-BADGE:${selectedBadge.badge_id}:${selectedBadge.name}:${selectedBadge.verification_hash}`;
      generateQRDataURL(payload).then(url => setQrDataURL(url));
    }
  }, [selectedBadge]);

  // Stop camera when leaving scanner tab
  useEffect(() => {
    if (activeTab !== 'scanner') setCameraActive(false);
  }, [activeTab]);

  const loadData = async () => {
    const badges = await getTeamBadges();
    if (badges?.length > 0) { setTeamBadges(badges); setSelectedBadge(badges[0]); }
    const logs = await getScanLogs();
    if (logs) setScanLogs(logs);
  };

  const handleCreateBadge = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newBadgeForm.name) return;
    setIsCreating(true);
    const created = await generateDigitalBadge(newBadgeForm);
    if (created) {
      setTeamBadges([created, ...teamBadges]);
      setSelectedBadge(created);
      setCreateSuccess(true);
      setNewBadgeForm({ name: '', role: 'Procurement Specialist', department: 'Quality & Catalog Intelligence', organization: 'IndustrialIQ AI / Unilog', email: '', clearance_level: 'Level 3 - Lead Engineer', blood_group: 'O+' });
      setTimeout(() => setCreateSuccess(false), 3000);
    }
    setIsCreating(false);
  };

  // Called by both camera scanner and manual input
  const triggerVerification = useCallback(async (payload: string) => {
    if (!payload.trim()) return;
    setIsScanning(true);
    setScannerResult(null);
    setCameraActive(false); // stop camera after successful scan

    // Extract badge ID from IIQ-BADGE: prefix if present
    let badgeId = payload;
    if (payload.startsWith('IIQ-BADGE:')) {
      badgeId = payload.split(':')[1] || payload;
    }

    const res = await scanQRCode(badgeId, terminalLocation);

    // Enrich result with badge details from local team
    const matchedBadge = teamBadges.find(b => b.badge_id === badgeId || b.badge_id === payload);
    const enrichedRes = {
      ...res,
      badge: res.badge || (matchedBadge ? {
        badge_id: matchedBadge.badge_id,
        name: matchedBadge.name,
        role: matchedBadge.role,
        clearance_level: matchedBadge.clearance_level,
        status: matchedBadge.status,
        access_zones: matchedBadge.access_zones
      } : res.badge),
      scan_timestamp: new Date().toLocaleString('en-IN', { timeZone: 'Asia/Kolkata' })
    };

    setScannerResult(enrichedRes);
    setIsScanning(false);

    // Append to local scan log
    const newLog = {
      scan_id: `SCAN-${Date.now()}`,
      badge_id: badgeId,
      name: enrichedRes.badge?.name || 'Unknown',
      clearance: enrichedRes.badge?.clearance_level || 'Unknown',
      location: terminalLocation,
      timestamp: enrichedRes.scan_timestamp,
      status: enrichedRes.status === 'ACCESS_GRANTED' ? 'GRANTED' : 'DENIED'
    };
    setLocalScanLogs(prev => [newLog, ...prev]);
  }, [teamBadges, terminalLocation]);

  const handleCopyPayload = () => {
    const p = selectedBadge ? `IIQ-BADGE:${selectedBadge.badge_id}:${selectedBadge.name}:${selectedBadge.verification_hash}` : '';
    navigator.clipboard.writeText(p);
    setCopiedPayload(true);
    setTimeout(() => setCopiedPayload(false), 2000);
  };

  const handlePrintCard = () => {
    window.print();
  };

  const allLogs = [...localScanLogs, ...scanLogs];
  const clearanceColor = (level: string) => {
    if (level?.includes('4') || level?.includes('Master')) return 'text-red-400 border-red-400/30 bg-red-500/10';
    if (level?.includes('3')) return 'text-amber-400 border-amber-400/30 bg-amber-500/10';
    if (level?.includes('2')) return 'text-cyan-400 border-cyan-400/30 bg-cyan-500/10';
    return 'text-emerald-400 border-emerald-400/30 bg-emerald-500/10';
  };

  return (
    <div className="space-y-6 max-w-[1600px] mx-auto text-on-surface" style={{ animation: 'fadeUp 0.4s ease both' }}>

      {/* ── Header ── */}
      <div
        className="rounded-3xl p-6 sm:p-8 relative overflow-hidden border border-outline-variant/30"
        style={{ background: 'linear-gradient(135deg, rgba(124,58,237,0.12) 0%, rgba(17,24,39,0.6) 50%, rgba(8,145,178,0.12) 100%)' }}
      >
        <div className="relative z-10 space-y-2">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full border border-violet-500/30 bg-violet-500/15 text-xs font-bold text-violet-400 uppercase tracking-wider">
            <ShieldCheck size={13} /> Cryptographic Access & Identity System
          </div>
          <h1 className="text-2xl sm:text-4xl font-extrabold tracking-tight text-on-surface">
            Digital ID Card &amp; Real-Time QR Verification
          </h1>
          <p className="text-xs sm:text-sm text-on-surface-variant max-w-2xl leading-relaxed">
            Enterprise-grade badge generation with live camera QR scanning, holographic credentials, and one-click card printing.
          </p>
        </div>
        {/* Decorative grid lines */}
        <div className="absolute inset-0 opacity-5 pointer-events-none"
          style={{ backgroundImage: 'linear-gradient(#7c3aed 1px, transparent 1px), linear-gradient(90deg, #7c3aed 1px, transparent 1px)', backgroundSize: '40px 40px' }} />
      </div>

      {/* ── Tab Bar ── */}
      <div className="flex items-center gap-1.5 flex-wrap">
        {([
          { key: 'card', icon: QrCode, label: 'Digital ID Badge Studio' },
          { key: 'scanner', icon: Scan, label: 'Live Camera QR Scanner' },
          { key: 'logs', icon: History, label: `Access Audit Log (${allLogs.length})` }
        ] as const).map(t => (
          <button
            key={t.key}
            onClick={() => setActiveTab(t.key)}
            className={`px-4 py-2 rounded-xl text-xs font-bold transition-all flex items-center gap-2 ${
              activeTab === t.key
                ? 'text-white shadow-lg'
                : 'bg-surface-container-high/60 text-on-surface-variant hover:text-on-surface border border-outline-variant/30'
            }`}
            style={activeTab === t.key ? { background: 'linear-gradient(135deg,#7c3aed,#2563eb)' } : {}}
          >
            <t.icon size={15} /> {t.label}
          </button>
        ))}
      </div>

      {/* ══════════════════════════════════════════════════════
          TAB 1 — DIGITAL ID BADGE STUDIO
      ══════════════════════════════════════════════════════ */}
      {activeTab === 'card' && (
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start" style={{ animation: 'fadeUp 0.3s ease both' }}>

          {/* Left: Badge list + form */}
          <div className="lg:col-span-5 space-y-5">
            {/* Team badge switcher */}
            <div className="p-5 rounded-2xl bg-surface-container-low border border-outline-variant/30 space-y-3">
              <h3 className="text-xs font-bold uppercase tracking-wider text-violet-400 flex items-center gap-2">
                <UserCheck size={15} /> Verified Team Badges
              </h3>
              <div className="space-y-2">
                {teamBadges.map(b => (
                  <button
                    key={b.badge_id}
                    onClick={() => { setSelectedBadge(b); setIsFlipped(false); }}
                    className={`w-full p-3 rounded-xl border text-left transition-all flex items-center justify-between group ${
                      selectedBadge?.badge_id === b.badge_id
                        ? 'border-violet-500/50 bg-violet-500/10'
                        : 'border-outline-variant/30 bg-surface-container hover:bg-surface-container-high'
                    }`}
                  >
                    <div className="flex items-center gap-3">
                      <div
                        className="w-9 h-9 rounded-xl flex items-center justify-center font-black text-sm text-white shrink-0"
                        style={{ background: 'linear-gradient(135deg,#7c3aed,#2563eb)' }}
                      >
                        {b.name.charAt(0)}
                      </div>
                      <div>
                        <p className="text-xs font-bold text-on-surface">{b.name}</p>
                        <p className="text-[10px] text-on-surface-variant">{b.role}</p>
                      </div>
                    </div>
                    <div className="text-right">
                      <span className="text-[10px] font-mono font-bold text-violet-400 block">{b.badge_id}</span>
                      <span className={`text-[9px] font-semibold px-1.5 py-0.5 rounded border ${clearanceColor(b.clearance_level)}`}>
                        {b.clearance_level?.split(' - ')[0]}
                      </span>
                    </div>
                  </button>
                ))}
              </div>
            </div>

            {/* Issue new badge form */}
            <div className="p-5 rounded-2xl bg-surface-container-low border border-outline-variant/30 space-y-4">
              <h3 className="text-xs font-bold uppercase tracking-wider text-on-surface flex items-center gap-2">
                <KeyRound size={15} className="text-amber-400" /> Issue New Digital Identity Badge
              </h3>

              {createSuccess && (
                <div className="flex items-center gap-2 p-2.5 rounded-xl bg-emerald-500/10 border border-emerald-500/30 text-emerald-400 text-xs font-bold" style={{ animation: 'fadeUp 0.3s ease' }}>
                  <CheckCircle2 size={15} /> Badge created and selected!
                </div>
              )}

              <form onSubmit={handleCreateBadge} className="space-y-3 text-xs">
                <div>
                  <label className="block font-semibold text-on-surface mb-1">Full Personnel Name *</label>
                  <input
                    required value={newBadgeForm.name}
                    onChange={e => setNewBadgeForm({ ...newBadgeForm, name: e.target.value })}
                    placeholder="e.g. Priya Sharma"
                    className="w-full p-2.5 rounded-xl bg-surface-container border border-outline-variant/40 text-on-surface outline-none focus:border-violet-400 transition-colors"
                  />
                </div>
                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="block font-semibold text-on-surface mb-1">Designation</label>
                    <input value={newBadgeForm.role} onChange={e => setNewBadgeForm({ ...newBadgeForm, role: e.target.value })}
                      className="w-full p-2 rounded-xl bg-surface-container border border-outline-variant/40 text-on-surface outline-none focus:border-violet-400 transition-colors" />
                  </div>
                  <div>
                    <label className="block font-semibold text-on-surface mb-1">Department</label>
                    <input value={newBadgeForm.department} onChange={e => setNewBadgeForm({ ...newBadgeForm, department: e.target.value })}
                      className="w-full p-2 rounded-xl bg-surface-container border border-outline-variant/40 text-on-surface outline-none focus:border-violet-400 transition-colors" />
                  </div>
                </div>
                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="block font-semibold text-on-surface mb-1">Clearance Level</label>
                    <select value={newBadgeForm.clearance_level} onChange={e => setNewBadgeForm({ ...newBadgeForm, clearance_level: e.target.value })}
                      className="w-full p-2 rounded-xl bg-surface-container border border-outline-variant/40 text-on-surface outline-none focus:border-violet-400 transition-colors">
                      <option>Level 4 - Master Admin</option>
                      <option>Level 3 - Lead Engineer</option>
                      <option>Level 2 - Procurement Analyst</option>
                      <option>Level 1 - Facility Operator</option>
                      <option>Guest - Verified Supplier</option>
                    </select>
                  </div>
                  <div>
                    <label className="block font-semibold text-on-surface mb-1">Blood Group</label>
                    <input value={newBadgeForm.blood_group} onChange={e => setNewBadgeForm({ ...newBadgeForm, blood_group: e.target.value })}
                      placeholder="O+, A-, B+" className="w-full p-2 rounded-xl bg-surface-container border border-outline-variant/40 text-on-surface outline-none focus:border-violet-400 transition-colors" />
                  </div>
                </div>
                <div>
                  <label className="block font-semibold text-on-surface mb-1">Email</label>
                  <input type="email" value={newBadgeForm.email} onChange={e => setNewBadgeForm({ ...newBadgeForm, email: e.target.value })}
                    placeholder="name@company.com" className="w-full p-2 rounded-xl bg-surface-container border border-outline-variant/40 text-on-surface outline-none focus:border-violet-400 transition-colors" />
                </div>
                <button
                  type="submit" disabled={isCreating}
                  className="w-full py-2.5 rounded-xl text-xs font-bold text-white flex items-center justify-center gap-2 shadow-md hover:-translate-y-0.5 transition-transform disabled:opacity-60"
                  style={{ background: 'linear-gradient(135deg,#7c3aed,#2563eb)' }}
                >
                  {isCreating
                    ? <><RefreshCw size={15} className="animate-spin" /> Generating…</>
                    : <><Sparkles size={15} /> Generate Verifiable Digital Badge</>
                  }
                </button>
              </form>
            </div>
          </div>

          {/* Right: Card canvas */}
          <div className="lg:col-span-7 flex flex-col items-center gap-5">
            {selectedBadge ? (
              <>
                {/* ── PRINTABLE ID CARD ── */}
                <div id="id-card-print-root" className="w-full flex justify-center">
                  <div
                    className="relative w-full max-w-[400px]"
                    style={{ perspective: '1000px' }}
                  >
                    <div
                      className="relative rounded-3xl overflow-hidden shadow-2xl border"
                      style={{
                        background: isFlipped
                          ? 'linear-gradient(145deg,#1e1b4b,#0f172a,#0c1a2e)'
                          : 'linear-gradient(145deg,#0f172a,#1e1b4b,#0c1a2e)',
                        borderColor: 'rgba(124,58,237,0.4)',
                        minHeight: 520
                      }}
                    >
                      {/* Holographic top strip */}
                      <div
                        className="absolute top-0 left-0 right-0 h-3"
                        style={{ background: 'linear-gradient(90deg,#7c3aed,#2563eb,#0891b2,#7c3aed)', animation: 'hologram 2s ease infinite', backgroundSize: '200%' }}
                      />

                      {/* Subtle grid overlay */}
                      <div className="absolute inset-0 opacity-[0.04] pointer-events-none"
                        style={{ backgroundImage: 'linear-gradient(rgba(124,58,237,1) 1px,transparent 1px),linear-gradient(90deg,rgba(124,58,237,1) 1px,transparent 1px)', backgroundSize: '20px 20px' }} />

                      {!isFlipped ? (
                        /* FRONT */
                        <div className="relative z-10 p-6 flex flex-col gap-5" style={{ minHeight: 520 }}>
                          {/* Org header */}
                          <div className="flex items-center justify-between border-b border-violet-500/20 pb-4 mt-3">
                            <div className="flex items-center gap-3">
                              <div className="w-10 h-10 rounded-xl flex items-center justify-center"
                                style={{ background: 'linear-gradient(135deg,#7c3aed,#2563eb)' }}>
                                <ShieldCheck size={20} className="text-white" />
                              </div>
                              <div>
                                <h2 className="text-xs font-black tracking-widest text-white uppercase">IndustrialIQ AI</h2>
                                <p className="text-[9px] text-violet-300 uppercase tracking-widest font-mono">Enterprise Verified ID</p>
                              </div>
                            </div>
                            <div className="text-right">
                              <span className="text-[9px] font-bold px-2 py-0.5 rounded-full border border-emerald-500/40 text-emerald-400 bg-emerald-500/10 block">
                                ● ACTIVE
                              </span>
                              <span className="text-[9px] font-mono text-slate-400 mt-1 block">{selectedBadge.blood_group}</span>
                            </div>
                          </div>

                          {/* Avatar + Info */}
                          <div className="flex flex-col items-center text-center gap-3 flex-1 justify-center">
                            <div className="relative">
                              <div
                                className="w-24 h-24 rounded-2xl flex items-center justify-center text-2xl font-black text-white border-2 border-violet-400/50"
                                style={{ background: 'linear-gradient(135deg,rgba(124,58,237,0.4),rgba(37,99,235,0.4))' }}
                              >
                                {selectedBadge.name.split(' ').map((n: string) => n[0]).join('')}
                              </div>
                              <div className="absolute -bottom-1.5 -right-1.5 w-7 h-7 rounded-full bg-emerald-500 flex items-center justify-center border-2 border-slate-900 shadow-lg">
                                <Check size={13} className="text-white" />
                              </div>
                            </div>

                            <div>
                              <h3 className="text-xl font-black text-white tracking-tight">{selectedBadge.name}</h3>
                              <p className="text-sm font-bold text-violet-300 mt-0.5">{selectedBadge.role}</p>
                              <p className="text-[11px] text-slate-400 mt-0.5">{selectedBadge.department}</p>
                              <p className="text-[10px] text-slate-500 mt-0.5">{selectedBadge.organization}</p>
                            </div>

                            <span className={`px-3 py-1 rounded-full text-[10px] font-black border ${clearanceColor(selectedBadge.clearance_level)}`}>
                              {selectedBadge.clearance_level}
                            </span>
                          </div>

                          {/* Footer: badge ID + QR */}
                          <div className="border-t border-violet-500/20 pt-4 flex items-end justify-between">
                            <div>
                              <span className="text-[8px] uppercase font-bold text-slate-500 block">Badge ID</span>
                              <p className="font-mono text-sm font-black text-violet-400 tracking-wider">{selectedBadge.badge_id}</p>
                              <span className="text-[9px] text-slate-500 font-mono">EXP: {selectedBadge.expires_at}</span>
                            </div>

                            {/* Real QR Code */}
                            <div className="bg-white p-2 rounded-xl shadow-lg border border-violet-300/20 shrink-0">
                              {qrDataURL ? (
                                <img src={qrDataURL} alt="QR Code" width={80} height={80} className="block" style={{ imageRendering: 'pixelated' }} />
                              ) : (
                                <div className="w-20 h-20 flex items-center justify-center">
                                  <QrCode size={36} className="text-slate-300 animate-pulse" />
                                </div>
                              )}
                            </div>
                          </div>
                        </div>
                      ) : (
                        /* BACK */
                        <div className="relative z-10 p-6 flex flex-col gap-5" style={{ minHeight: 520 }}>
                          <div className="flex items-center gap-2 border-b border-violet-500/20 pb-4 mt-3">
                            <Lock size={14} className="text-violet-400" />
                            <h4 className="text-xs font-bold uppercase tracking-wider text-white">Authorization Scope</h4>
                          </div>

                          <div className="space-y-4 flex-1">
                            <div>
                              <span className="text-[10px] font-bold uppercase text-slate-500 block mb-1.5">Authorized Access Zones</span>
                              <div className="flex flex-wrap gap-1.5">
                                {(selectedBadge.access_zones || ['AI ML Center', 'Procurement Desk']).map((z: string, i: number) => (
                                  <span key={i} className="px-2 py-0.5 rounded-lg text-[10px] bg-violet-500/15 text-violet-300 border border-violet-500/25 font-medium flex items-center gap-1">
                                    <BadgeCheck size={10} /> {z}
                                  </span>
                                ))}
                              </div>
                            </div>

                            <div className="p-3 rounded-2xl border border-violet-500/20 space-y-2" style={{ background: 'rgba(124,58,237,0.08)' }}>
                              {[
                                ['Security Hash', selectedBadge.verification_hash, 'font-mono text-violet-400'],
                                ['Issued', selectedBadge.issued_at, 'font-mono text-slate-300'],
                                ['Expires', selectedBadge.expires_at, 'font-mono text-amber-400'],
                                ['Status', selectedBadge.status, 'text-emerald-400'],
                                ['Email', selectedBadge.email || '—', 'text-cyan-400'],
                              ].map(([label, val, style]) => (
                                <div key={label as string} className="flex justify-between text-[10px]">
                                  <span className="text-slate-500">{label}:</span>
                                  <span className={`font-bold ${style}`}>{val}</span>
                                </div>
                              ))}
                            </div>

                            <p className="text-[9px] text-slate-600 leading-relaxed">
                              This digital credential is property of IndustrialIQ AI. Authorized access granted only to verified personnel. Scan QR code to verify real-time.
                            </p>
                          </div>

                          <div className="border-t border-violet-500/20 pt-3 text-center">
                            <p className="text-[8px] font-mono text-slate-600 uppercase tracking-widest">
                              UNILOG INDUSTRIAL COMMERCE INTELLIGENCE PLATFORM • 2026
                            </p>
                          </div>
                        </div>
                      )}
                    </div>
                  </div>
                </div>

                {/* Card Controls */}
                <div className="flex flex-wrap items-center justify-center gap-2.5 no-print">
                  <button
                    onClick={() => setIsFlipped(!isFlipped)}
                    className="px-4 py-2 rounded-xl bg-surface-container-high border border-outline-variant/50 hover:bg-surface-container-highest text-xs font-semibold text-on-surface transition-all flex items-center gap-1.5 shadow-sm hover:-translate-y-0.5"
                    style={{ transition: 'all 0.2s' }}
                  >
                    <RotateCw size={14} className="text-violet-400" />
                    Flip ({isFlipped ? 'Show Front' : 'Show Back'})
                  </button>

                  <button
                    onClick={handleCopyPayload}
                    className="px-4 py-2 rounded-xl bg-surface-container-high border border-outline-variant/50 hover:bg-surface-container-highest text-xs font-semibold text-on-surface transition-all flex items-center gap-1.5 shadow-sm hover:-translate-y-0.5"
                    style={{ transition: 'all 0.2s' }}
                  >
                    {copiedPayload ? <Check size={14} className="text-emerald-400" /> : <Copy size={14} className="text-violet-400" />}
                    {copiedPayload ? 'Copied!' : 'Copy QR Payload'}
                  </button>

                  <button
                    onClick={handlePrintCard}
                    className="px-4 py-2 rounded-xl text-xs font-bold text-white flex items-center gap-1.5 shadow-md hover:-translate-y-0.5 hover:shadow-lg"
                    style={{ background: 'linear-gradient(135deg,#7c3aed,#2563eb)', transition: 'all 0.2s' }}
                  >
                    <Printer size={14} /> Print ID Card
                  </button>

                  <button
                    onClick={() => { setActiveTab('scanner'); setScannerInput(selectedBadge.badge_id); triggerVerification(selectedBadge.badge_id); }}
                    className="px-4 py-2 rounded-xl bg-emerald-500/15 text-emerald-400 border border-emerald-500/30 text-xs font-bold flex items-center gap-1.5 hover:-translate-y-0.5 hover:bg-emerald-500/25 transition-all"
                  >
                    <ZapIcon size={14} /> Test Gate Scan
                  </button>
                </div>
              </>
            ) : (
              <div className="p-16 text-center text-on-surface-variant bg-surface-container rounded-3xl border border-outline-variant/20">
                <QrCode size={40} className="mx-auto text-violet-400/30 mb-3" />
                Select or generate a badge to preview.
              </div>
            )}
          </div>
        </div>
      )}

      {/* ══════════════════════════════════════════════════════
          TAB 2 — LIVE CAMERA QR SCANNER
      ══════════════════════════════════════════════════════ */}
      {activeTab === 'scanner' && (
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start" style={{ animation: 'fadeUp 0.3s ease both' }}>

          {/* Scanner viewport */}
          <div className="lg:col-span-6 p-5 rounded-3xl bg-surface-container-low border border-outline-variant/30 space-y-4 shadow-sm">
            <div className="flex items-center justify-between">
              <div>
                <h3 className="text-sm font-bold text-on-surface flex items-center gap-2">
                  <Camera size={17} className="text-cyan-400" /> Live Camera QR Terminal
                </h3>
                <p className="text-xs text-on-surface-variant mt-0.5">
                  Use your device camera to scan any IndustrialIQ QR badge in real time.
                </p>
              </div>
              <div className="flex items-center gap-1.5">
                <div className={`w-2 h-2 rounded-full ${cameraActive ? 'bg-emerald-400 animate-pulse' : 'bg-slate-500'}`} />
                <span className="text-[10px] font-mono font-bold text-on-surface-variant">
                  {cameraActive ? 'LIVE' : 'STANDBY'}
                </span>
              </div>
            </div>

            {/* Location selector */}
            <div>
              <label className="text-[10px] uppercase font-bold text-on-surface-variant mb-1 block">Terminal Location</label>
              <select
                value={terminalLocation}
                onChange={e => setTerminalLocation(e.target.value)}
                className="w-full p-2 rounded-xl bg-surface-container border border-outline-variant/40 text-xs text-on-surface outline-none focus:border-violet-400 transition-colors"
              >
                <option>HQ Facility Gate 01</option>
                <option>AI ML Center Entry</option>
                <option>Procurement Vault</option>
                <option>Data Pipeline Labs</option>
                <option>Cloud Edge Ops</option>
                <option>Warehouse Floor</option>
                <option>Executive Floor</option>
              </select>
            </div>

            {/* Real camera */}
            <div className="rounded-2xl overflow-hidden border-2 border-cyan-500/30" style={{ background: '#0a0a0a' }}>
              <LiveCameraScanner
                isActive={cameraActive}
                onScanSuccess={(text) => {
                  setScannerInput(text);
                  triggerVerification(text);
                }}
              />
            </div>

            {/* Camera toggle */}
            <button
              onClick={() => setCameraActive(!cameraActive)}
              className={`w-full py-2.5 rounded-xl text-xs font-bold flex items-center justify-center gap-2 transition-all hover:-translate-y-0.5 ${
                cameraActive
                  ? 'bg-red-500/15 text-red-400 border border-red-500/30 hover:bg-red-500/25'
                  : 'text-white shadow-md hover:shadow-lg'
              }`}
              style={!cameraActive ? { background: 'linear-gradient(135deg,#0891b2,#2563eb)' } : {}}
            >
              {cameraActive ? <><CameraOff size={15} /> Stop Camera</> : <><Camera size={15} /> Start Live Camera Scanner</>}
            </button>

            {/* Divider */}
            <div className="flex items-center gap-2">
              <div className="flex-1 h-px bg-outline-variant/30" />
              <span className="text-[10px] text-on-surface-variant font-semibold uppercase">or quick-test</span>
              <div className="flex-1 h-px bg-outline-variant/30" />
            </div>

            {/* Quick test buttons */}
            <div className="grid grid-cols-3 gap-2">
              {teamBadges.map(b => (
                <button
                  key={b.badge_id}
                  onClick={() => { setScannerInput(b.badge_id); triggerVerification(b.badge_id); }}
                  className="p-2 rounded-xl bg-surface-container hover:bg-violet-500/10 border border-outline-variant/40 hover:border-violet-500/30 text-xs font-semibold text-on-surface text-center transition-all truncate"
                >
                  {b.name.split(' ')[0]}
                  <span className="block text-[9px] text-violet-400 font-mono">…{b.badge_id.slice(-4)}</span>
                </button>
              ))}
            </div>

            {/* Manual input */}
            <div className="flex gap-2">
              <input
                type="text" value={scannerInput}
                onChange={e => setScannerInput(e.target.value)}
                onKeyDown={e => e.key === 'Enter' && triggerVerification(scannerInput)}
                placeholder="Paste Badge ID or QR payload…"
                className="flex-1 px-3 py-2 rounded-xl bg-surface-container border border-outline-variant/40 text-xs text-on-surface outline-none focus:border-violet-400 font-mono transition-colors"
              />
              <button
                onClick={() => triggerVerification(scannerInput)} disabled={isScanning}
                className="px-4 py-2 rounded-xl text-xs font-bold text-white flex items-center gap-1.5 shrink-0 shadow-md disabled:opacity-60"
                style={{ background: 'linear-gradient(135deg,#7c3aed,#2563eb)' }}
              >
                <Scan size={14} /> {isScanning ? '…' : 'Verify'}
              </button>
            </div>
          </div>

          {/* Result panel */}
          <div className="lg:col-span-6 space-y-4">
            {isScanning ? (
              <div
                className="p-8 rounded-3xl border border-cyan-500/30 flex flex-col items-center gap-4"
                style={{ background: 'linear-gradient(135deg,rgba(8,145,178,0.08),rgba(37,99,235,0.08))', animation: 'fadeUp 0.3s ease' }}
              >
                <div className="w-16 h-16 rounded-full border-2 border-cyan-400 border-t-transparent animate-spin" />
                <div className="text-center">
                  <p className="text-sm font-bold text-on-surface">Verifying Cryptographic Signature…</p>
                  <p className="text-xs text-on-surface-variant mt-1">Checking clearance level & access zones</p>
                </div>
              </div>
            ) : scannerResult ? (
              <div
                className={`p-6 rounded-3xl border space-y-5 shadow-xl`}
                style={{
                  background: scannerResult.status === 'ACCESS_GRANTED'
                    ? 'linear-gradient(135deg,rgba(16,185,129,0.08),rgba(5,150,105,0.05))'
                    : 'linear-gradient(135deg,rgba(239,68,68,0.08),rgba(185,28,28,0.05))',
                  borderColor: scannerResult.status === 'ACCESS_GRANTED' ? 'rgba(16,185,129,0.4)' : 'rgba(239,68,68,0.4)',
                  animation: 'fadeUp 0.35s ease'
                }}
              >
                {/* Status header */}
                <div className="flex items-center gap-4">
                  <div
                    className={`w-14 h-14 rounded-2xl flex items-center justify-center shadow-xl`}
                    style={{
                      background: scannerResult.status === 'ACCESS_GRANTED' ? '#10b981' : '#ef4444',
                      animation: scannerResult.status === 'ACCESS_GRANTED' ? 'grantPulse 1.5s ease 1' : 'denyPulse 1.5s ease 1'
                    }}
                  >
                    {scannerResult.status === 'ACCESS_GRANTED'
                      ? <CheckCircle2 size={30} className="text-white" />
                      : <XCircle size={30} className="text-white" />
                    }
                  </div>
                  <div>
                    <p className={`text-xs font-black uppercase tracking-wider ${scannerResult.status === 'ACCESS_GRANTED' ? 'text-emerald-400' : 'text-red-400'}`}>
                      {scannerResult.status === 'ACCESS_GRANTED' ? '✓ ACCESS GRANTED • IDENTITY VERIFIED' : '✗ ACCESS DENIED • INVALID CREDENTIALS'}
                    </p>
                    <h3 className="text-base font-extrabold text-on-surface mt-0.5">{scannerResult.message}</h3>
                  </div>
                </div>

                {/* Personnel details */}
                {scannerResult.badge && (
                  <div className="p-4 rounded-2xl bg-surface-container border border-outline-variant/30 space-y-3 text-xs">
                    <div className="grid grid-cols-2 gap-3">
                      {[
                        ['Personnel', scannerResult.badge.name, 'font-bold text-on-surface'],
                        ['Badge ID', scannerResult.badge.badge_id, 'font-mono font-bold text-violet-400'],
                        ['Designation', scannerResult.badge.role, 'text-on-surface'],
                        ['Clearance', scannerResult.badge.clearance_level, 'font-bold text-amber-400'],
                      ].map(([lbl, val, style]) => (
                        <div key={lbl as string}>
                          <span className="text-[9px] text-on-surface-variant uppercase font-bold block mb-0.5">{lbl}</span>
                          <p className={style as string}>{val || '—'}</p>
                        </div>
                      ))}
                    </div>

                    {scannerResult.badge.access_zones && (
                      <div>
                        <span className="text-[9px] text-on-surface-variant uppercase font-bold block mb-1">Access Zones</span>
                        <div className="flex flex-wrap gap-1">
                          {scannerResult.badge.access_zones.map((z: string, i: number) => (
                            <span key={i} className="px-1.5 py-0.5 rounded text-[9px] bg-violet-500/10 text-violet-400 border border-violet-500/20">{z}</span>
                          ))}
                        </div>
                      </div>
                    )}

                    <div className="pt-2 border-t border-outline-variant/20 flex justify-between text-[10px] text-on-surface-variant">
                      <span className="flex items-center gap-1"><Wifi size={11} /> Gate: {terminalLocation}</span>
                      <span>{scannerResult.scan_timestamp}</span>
                    </div>
                  </div>
                )}

                {/* Action buttons */}
                <div className="flex gap-2">
                  <button
                    onClick={() => setScannerResult(null)}
                    className="flex-1 py-2 rounded-xl bg-surface-container-high border border-outline-variant/40 text-xs font-semibold text-on-surface hover:bg-surface-container-highest transition-all"
                  >
                    Reset Terminal
                  </button>
                  <button
                    onClick={() => setCameraActive(true)}
                    className="flex-1 py-2 rounded-xl text-xs font-bold text-white"
                    style={{ background: 'linear-gradient(135deg,#0891b2,#2563eb)' }}
                  >
                    Scan Next
                  </button>
                </div>
              </div>
            ) : (
              <div
                className="p-12 text-center text-on-surface-variant border border-outline-variant/20 rounded-3xl flex flex-col items-center gap-4"
                style={{ background: 'linear-gradient(135deg,rgba(124,58,237,0.04),rgba(37,99,235,0.04))' }}
              >
                <div className="w-20 h-20 rounded-full border-2 border-dashed border-outline-variant/40 flex items-center justify-center">
                  <Scan size={32} className="text-violet-400/40" />
                </div>
                <div>
                  <p className="font-bold text-on-surface">Terminal Awaiting Scan</p>
                  <p className="text-xs mt-1 max-w-[240px] mx-auto">
                    Start the live camera to scan a badge QR, or click a preset badge to verify instantly.
                  </p>
                </div>
              </div>
            )}
          </div>
        </div>
      )}

      {/* ══════════════════════════════════════════════════════
          TAB 3 — ACCESS AUDIT TELEMETRY
      ══════════════════════════════════════════════════════ */}
      {activeTab === 'logs' && (
        <div className="p-5 rounded-3xl bg-surface-container-low border border-outline-variant/30 space-y-4" style={{ animation: 'fadeUp 0.3s ease both' }}>
          <div className="flex items-center justify-between">
            <h3 className="text-sm font-bold text-on-surface flex items-center gap-2">
              <History size={17} className="text-violet-400" /> Live Facility Access Audit Trail
            </h3>
            <div className="flex items-center gap-3">
              <span className="text-[10px] font-mono text-on-surface-variant bg-surface-container-high px-2.5 py-1 rounded-lg">
                {allLogs.length} total scans
              </span>
              {localScanLogs.length > 0 && (
                <span className="flex items-center gap-1 text-[10px] text-emerald-400 font-bold">
                  <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" /> {localScanLogs.length} new
                </span>
              )}
            </div>
          </div>

          {allLogs.length === 0 ? (
            <div className="py-16 text-center text-on-surface-variant">
              <History size={36} className="mx-auto text-violet-400/30 mb-3" />
              <p className="font-semibold text-on-surface">No scan logs yet</p>
              <p className="text-xs mt-1">Use the scanner to create access records.</p>
            </div>
          ) : (
            <div className="overflow-x-auto rounded-2xl border border-outline-variant/30">
              <table className="w-full text-left text-xs">
                <thead className="bg-surface-container text-on-surface-variant font-semibold border-b border-outline-variant/30">
                  <tr>
                    <th className="p-3">Scan ID</th>
                    <th className="p-3">Badge ID</th>
                    <th className="p-3">Personnel</th>
                    <th className="p-3">Clearance</th>
                    <th className="p-3">Terminal</th>
                    <th className="p-3">Timestamp</th>
                    <th className="p-3">Decision</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-outline-variant/20">
                  {allLogs.map((log, idx) => (
                    <tr
                      key={idx}
                      className="hover:bg-surface-container-high/40 transition-colors"
                      style={idx < localScanLogs.length ? { animation: `fadeUp 0.3s ease ${idx * 40}ms both` } : {}}
                    >
                      <td className="p-3 font-mono text-[10px] text-on-surface-variant">{log.scan_id}</td>
                      <td className="p-3 font-mono font-bold text-violet-400">{log.badge_id}</td>
                      <td className="p-3 font-bold text-on-surface">{log.name}</td>
                      <td className="p-3 text-on-surface-variant text-[11px]">{log.clearance}</td>
                      <td className="p-3 text-on-surface-variant text-[11px]">{log.location}</td>
                      <td className="p-3 font-mono text-[10px] text-on-surface-variant">{log.timestamp}</td>
                      <td className="p-3">
                        <span className={`px-2 py-0.5 rounded-lg text-[10px] font-bold border ${
                          log.status === 'GRANTED' || log.status === 'ACCESS_GRANTED'
                            ? 'bg-emerald-500/10 text-emerald-400 border-emerald-500/20'
                            : 'bg-red-500/10 text-red-400 border-red-500/20'
                        }`}>
                          {log.status === 'GRANTED' || log.status === 'ACCESS_GRANTED' ? '✓ GRANTED' : '✗ DENIED'}
                        </span>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      )}
    </div>
  );
}
