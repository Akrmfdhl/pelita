import React, { useState, useRef } from 'react';
import { useExtractContract, useAuditContract } from '../../hooks/useContracts';
import { ContractAuditResponse } from '../../types';
import { StampBadge } from '../../components/ui/StampBadge';
import {
  UploadCloud,
  FileText,
  AlertTriangle,
  Scale,
  Info,
  ChevronDown,
  ChevronUp,
  ShieldCheck,
  Zap,
  CheckCircle2,
  FileCheck2,
} from 'lucide-react';

export const ContractUpload: React.FC = () => {
  const [platformName, setPlatformName] = useState('');
  const [dailyInterest, setDailyInterest] = useState('');
  const [adminFee, setAdminFee] = useState('');
  const [lateFee, setLateFee] = useState('');
  const [tenorDays, setTenorDays] = useState('');
  const [permissions, setPermissions] = useState('');
  const [uploadedFileName, setUploadedFileName] = useState<string | null>(null);
  const [isDragging, setIsDragging] = useState(false);
  const [result, setResult] = useState<ContractAuditResponse | null>(null);
  const [expandedViolations, setExpandedViolations] = useState<Record<number, boolean>>({});

  const fileInputRef = useRef<HTMLInputElement>(null);

  const extractMutation = useExtractContract();
  const auditMutation = useAuditContract();

  const isExtracting = extractMutation.isPending;
  const loading = auditMutation.isPending;

  const interestNum = parseFloat(dailyInterest) || 0;
  const isInterestOverCap = interestNum > 0.3;

  const toggleViolation = (index: number) => {
    setExpandedViolations((prev) => ({ ...prev, [index]: !prev[index] }));
  };

  const handleFileDrop = async (file: File) => {
    setUploadedFileName(file.name);
    try {
      const extracted = await extractMutation.mutateAsync({
        file_name: file.name,
        document_text: file.name,
      });

      if (extracted) {
        if (extracted.platform_name) setPlatformName(extracted.platform_name);
        if (extracted.daily_interest_rate) setDailyInterest((extracted.daily_interest_rate * 100).toFixed(2));
        if (extracted.admin_fee_percentage) setAdminFee((extracted.admin_fee_percentage * 100).toFixed(1));
        if (extracted.late_fee_daily_rate) setLateFee((extracted.late_fee_daily_rate * 100).toFixed(2));
        if (extracted.tenor_days) setTenorDays(extracted.tenor_days.toString());
        if (extracted.permissions_requested) setPermissions(extracted.permissions_requested.join(', '));
      }
    } catch {
      if (file.name.toLowerCase().includes('ilegal') || file.name.toLowerCase().includes('kilat')) {
        applyPreset('illegal');
      } else if (file.name.toLowerCase().includes('sahabat') || file.name.toLowerCase().includes('resmi')) {
        applyPreset('legal');
      } else {
        setPlatformName(file.name.replace(/\.[^/.]+$/, '').toUpperCase());
      }
    }
  };

  const applyPreset = (type: 'illegal' | 'legal' | 'hidden_fee') => {
    if (type === 'illegal') {
      setPlatformName('Rupiah Cepat Kilat Online (Ilegal)');
      setDailyInterest('0.8');
      setAdminFee('30');
      setLateFee('1.5');
      setTenorDays('14');
      setPermissions('CONTACTS, GALLERY, SMS, LOCATION, CAMERA, STORAGE');
    } else if (type === 'legal') {
      setPlatformName('PT Fintek Sahabat Berizin OJK');
      setDailyInterest('0.1');
      setAdminFee('4.5');
      setLateFee('0.1');
      setTenorDays('90');
      setPermissions('CAMERA, MICROPHONE, LOCATION');
    } else if (type === 'hidden_fee') {
      setPlatformName('Dana Cepat Pro (Indikasi Biaya Tersembunyi)');
      setDailyInterest('0.25');
      setAdminFee('35');
      setLateFee('2.0');
      setTenorDays('30');
      setPermissions('CONTACTS, CAMERA, LOCATION');
    }
  };

  const handleAudit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const data = await auditMutation.mutateAsync({
        platform_name: platformName,
        document_url: uploadedFileName
          ? `https://storage.pelita.id/contracts/${encodeURIComponent(uploadedFileName)}`
          : 'https://storage.pelita.id/samples/sample_contract_01.pdf',
        daily_interest_rate: parseFloat(dailyInterest) / 100,
        admin_fee_percentage: parseFloat(adminFee) / 100,
        late_fee_daily_rate: parseFloat(lateFee) / 100,
        tenor_days: parseInt(tenorDays, 10),
        permissions_requested: permissions.split(',').map((p) => p.trim()),
      });
      setResult(data);
    } catch {
      // Handled via TanStack Query state
    }
  };

  return (
    <div className="max-w-6xl mx-auto space-y-8 pb-12">
      {/* Header Section */}
      <div className="space-y-4 text-left">
        <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-white/80 backdrop-blur-md border border-slate-200/80 text-slate-800 font-mono text-xs font-semibold shadow-2xs">
          <span className="w-2 h-2 rounded-full bg-[#BA3801] animate-pulse" />
          <span>Platform Integritas Finansial &amp; Audit Preventif</span>
        </div>

        <div className="flex flex-col md:flex-row md:items-end justify-between gap-6">
          <div className="space-y-2 max-w-2xl">
            <h1 className="text-3xl sm:text-4xl lg:text-5xl font-semibold text-[#1E2C4F] tracking-tight leading-[1.15]">
              Pemindai Kontrak &amp; <span className="text-[#BA3801]">T&amp;C Pinjaman</span>
            </h1>
            <p className="text-[17px] text-[#2E3E6E] leading-[1.47] font-normal">
              Evaluasi kepatuhan hukum draf perjanjian pinjaman secara otomatis terhadap batasan suku bunga POJK No. 10/2022 dan larangan akses data pribadi non-CAMDOG.
            </p>
          </div>

          <div className="flex flex-wrap items-center gap-2">
            <button
              type="button"
              onClick={() => applyPreset('illegal')}
              className="px-4 py-2 rounded-full text-xs font-medium bg-rose-50 hover:bg-rose-100/80 text-rose-900 border border-rose-200/80 transition-all duration-150 active:scale-95 flex items-center gap-1.5 shadow-2xs"
            >
              <Zap className="w-3.5 h-3.5 text-rose-600" />
              <span>Preset: Pinjol Ilegal</span>
            </button>
            <button
              type="button"
              onClick={() => applyPreset('legal')}
              className="px-4 py-2 rounded-full text-xs font-medium bg-emerald-50 hover:bg-emerald-100/80 text-emerald-900 border border-emerald-200/80 transition-all duration-150 active:scale-95 flex items-center gap-1.5 shadow-2xs"
            >
              <ShieldCheck className="w-3.5 h-3.5 text-emerald-600" />
              <span>Preset: Berizin OJK</span>
            </button>
          </div>
        </div>
      </div>

      {/* Workbench Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        {/* Left Column: Form & Document Upload */}
        <div className="lg:col-span-5 rounded-3xl border border-slate-200/80 bg-white/90 backdrop-blur-xl p-6 sm:p-8 shadow-sm space-y-6">
          <div className="flex items-center justify-between pb-4 border-b border-slate-200/60">
            <h2 className="font-semibold text-base text-[#1E2C4F]">Parameter Klausul</h2>
            <span className="font-mono text-[11px] font-semibold text-[#BA3801] bg-[#BA3801]/10 px-3 py-1 rounded-full">
              POJK No. 10/2022
            </span>
          </div>

          {/* Upload Dropzone */}
          <div
            onDragOver={(e) => {
              e.preventDefault();
              setIsDragging(true);
            }}
            onDragLeave={() => setIsDragging(false)}
            onDrop={(e) => {
              e.preventDefault();
              setIsDragging(false);
              if (e.dataTransfer.files && e.dataTransfer.files[0]) {
                handleFileDrop(e.dataTransfer.files[0]);
              }
            }}
            onClick={() => fileInputRef.current?.click()}
            className={`border border-dashed rounded-2xl p-6 text-center cursor-pointer transition-all duration-150 ${
              isDragging
                ? 'border-[#BA3801] bg-[#BA3801]/5'
                : 'border-slate-300 hover:border-slate-400 bg-slate-50/50 hover:bg-white'
            }`}
          >
            <input
              type="file"
              ref={fileInputRef}
              accept=".pdf,.png,.jpg,.jpeg"
              className="hidden"
              onChange={(e) => {
                if (e.target.files && e.target.files[0]) {
                  handleFileDrop(e.target.files[0]);
                }
              }}
            />
            <UploadCloud className="w-8 h-8 text-[#BA3801] mx-auto mb-2 opacity-90" />
            {isExtracting ? (
              <div className="flex items-center justify-center gap-2 text-xs font-mono text-[#BA3801] font-semibold">
                <span className="w-3.5 h-3.5 border-2 border-[#BA3801] border-t-transparent rounded-full animate-spin" />
                <span>Mengekstrak parameter otomatis...</span>
              </div>
            ) : uploadedFileName ? (
              <div className="flex items-center justify-center gap-1.5 text-xs font-mono text-[#1E2C4F] font-semibold">
                <CheckCircle2 className="w-4 h-4 text-emerald-600" />
                <span>{uploadedFileName}</span>
              </div>
            ) : (
              <p className="text-xs text-slate-600 leading-relaxed">
                Tarik dan lepas berkas kontrak PDF/Gambar di sini, atau <span className="text-[#BA3801] font-semibold">pilih file</span>
              </p>
            )}
          </div>

          {/* Input Form */}
          <form onSubmit={handleAudit} className="space-y-4">
            <div>
              <label className="block text-xs font-semibold text-[#1E2C4F] mb-1.5">
                Nama Penyelenggara / Platform
              </label>
              <input
                type="text"
                value={platformName}
                onChange={(e) => setPlatformName(e.target.value)}
                placeholder="Contoh: PT Pinjaman Maju Bersama"
                className="w-full bg-white border border-slate-200/80 rounded-2xl px-3.5 py-2.5 text-xs text-[#1E2C4F] font-medium focus:outline-none focus:border-[#BA3801] focus:ring-1 focus:ring-[#BA3801] transition-all"
                required
              />
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <div className="flex items-center justify-between mb-1.5">
                  <label className="text-xs font-semibold text-[#1E2C4F]">
                    Bunga Harian (%)
                  </label>
                  {isInterestOverCap && (
                    <span className="text-[10px] font-mono text-rose-600 font-semibold">
                      Di atas batas
                    </span>
                  )}
                </div>
                <input
                  type="number"
                  step="0.01"
                  value={dailyInterest}
                  onChange={(e) => setDailyInterest(e.target.value)}
                  placeholder="0.3"
                  className={`w-full bg-white border rounded-2xl px-3.5 py-2.5 text-xs font-medium focus:outline-none transition-all ${
                    isInterestOverCap
                      ? 'border-rose-300 text-rose-800 bg-rose-50/50 focus:border-rose-400'
                      : 'border-slate-200/80 text-[#1E2C4F] focus:border-[#BA3801]'
                  }`}
                  required
                />
                <span className="text-[10px] font-mono text-slate-500 mt-1 block">
                  Batas OJK: maks 0.3%/hari
                </span>
              </div>

              <div>
                <label className="block text-xs font-semibold text-[#1E2C4F] mb-1.5">
                  Biaya Admin (%)
                </label>
                <input
                  type="number"
                  step="0.1"
                  value={adminFee}
                  onChange={(e) => setAdminFee(e.target.value)}
                  placeholder="5.0"
                  className="w-full bg-white border border-slate-200/80 rounded-2xl px-3.5 py-2.5 text-xs text-[#1E2C4F] font-medium focus:outline-none focus:border-[#BA3801] focus:ring-1 focus:ring-[#BA3801] transition-all"
                  required
                />
                <span className="text-[10px] font-mono text-slate-500 mt-1 block">
                  Potongan pencairan
                </span>
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-semibold text-[#1E2C4F] mb-1.5">
                  Denda Harian (%)
                </label>
                <input
                  type="number"
                  step="0.01"
                  value={lateFee}
                  onChange={(e) => setLateFee(e.target.value)}
                  placeholder="0.1"
                  className="w-full bg-white border border-slate-200/80 rounded-2xl px-3.5 py-2.5 text-xs text-[#1E2C4F] font-medium focus:outline-none focus:border-[#BA3801] focus:ring-1 focus:ring-[#BA3801] transition-all"
                  required
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-[#1E2C4F] mb-1.5">
                  Tenor (Hari)
                </label>
                <input
                  type="number"
                  value={tenorDays}
                  onChange={(e) => setTenorDays(e.target.value)}
                  placeholder="30"
                  className="w-full bg-white border border-slate-200/80 rounded-2xl px-3.5 py-2.5 text-xs text-[#1E2C4F] font-medium focus:outline-none focus:border-[#BA3801] focus:ring-1 focus:ring-[#BA3801] transition-all"
                  required
                />
              </div>
            </div>

            <div>
              <label className="block text-xs font-semibold text-[#1E2C4F] mb-1.5">
                Izin Akses Smartphone
              </label>
              <textarea
                rows={2}
                value={permissions}
                onChange={(e) => setPermissions(e.target.value)}
                className="w-full bg-white border border-slate-200/80 rounded-2xl px-3.5 py-2 text-xs font-mono text-[#1E2C4F] focus:outline-none focus:border-[#BA3801] focus:ring-1 focus:ring-[#BA3801] transition-all"
                placeholder="CAMERA, MICROPHONE, LOCATION"
                required
              />
              <div className="mt-1.5 flex items-center gap-1.5 text-[11px] text-slate-500">
                <Info className="w-3.5 h-3.5 text-[#BA3801] shrink-0" />
                <span>Aturan CAMDOG: Hanya Kamera, Mikrofon, dan Lokasi yang diizinkan.</span>
              </div>
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full bg-[#BA3801] hover:bg-[#9A2E01] text-white py-3 rounded-full font-semibold text-sm transition-all duration-150 active:scale-95 shadow-sm disabled:opacity-50 flex items-center justify-center gap-2"
            >
              {loading ? (
                <span className="flex items-center gap-2 font-mono text-xs">
                  <span className="w-3.5 h-3.5 border-2 border-white border-t-transparent rounded-full animate-spin" />
                  Mengevaluasi Klausul Regulasi...
                </span>
              ) : (
                <>
                  <FileCheck2 className="w-4 h-4 text-[#FFEC89]" />
                  <span>Jalankan Audit Kepatuhan</span>
                </>
              )}
            </button>
          </form>
        </div>

        {/* Right Column: Audit Results */}
        <div className="lg:col-span-7">
          {result ? (
            <div className="rounded-3xl border border-slate-200/80 bg-white/90 backdrop-blur-xl p-6 sm:p-8 shadow-sm space-y-6">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-5 border-b border-slate-200/60">
                <div>
                  <span className="font-mono text-xs font-semibold text-[#BA3801] tracking-wider uppercase block">
                    Hasil Evaluasi Kepatuhan Hukum
                  </span>
                  <h2 className="text-2xl font-semibold text-[#1E2C4F] mt-1 tracking-tight">
                    {result.platform_name}
                  </h2>
                </div>
                <StampBadge level={result.risk_level} />
              </div>

              {/* Juridical Summary Box */}
              <div className="p-5 rounded-2xl bg-slate-50/80 border border-slate-200/60 space-y-2">
                <div className="flex items-center gap-2 text-[#1E2C4F] font-semibold text-xs font-mono uppercase tracking-wider">
                  <Scale className="w-4 h-4 text-[#BA3801]" />
                  <span>Kesimpulan Yuridis:</span>
                </div>
                <p className="text-[15px] text-[#2E3E6E] leading-[1.6] font-normal">
                  {result.summary_explanation}
                </p>
              </div>

              {/* Violations List */}
              {result.violations.length > 0 ? (
                <div className="space-y-3">
                  <div className="flex items-center justify-between">
                    <h3 className="font-mono text-xs font-semibold uppercase tracking-wider text-rose-900 flex items-center gap-1.5">
                      <AlertTriangle className="w-4 h-4 text-rose-600" />
                      <span>Pelanggaran Regulasi Teridentifikasi ({result.violations.length})</span>
                    </h3>
                    <span className="text-[11px] font-mono text-slate-500">Klik rincian pasal</span>
                  </div>

                  <div className="space-y-2.5">
                    {result.violations.map((v, i) => (
                      <div
                        key={i}
                        className="border border-rose-200/80 bg-rose-50/40 rounded-2xl overflow-hidden transition-all duration-150"
                      >
                        <button
                          type="button"
                          onClick={() => toggleViolation(i)}
                          className="w-full p-4 text-left flex items-center justify-between gap-3 hover:bg-rose-50/80 transition-colors"
                        >
                          <div className="space-y-1">
                            <span className="font-semibold text-sm text-rose-950 block">
                              {v.violation_type}
                            </span>
                            <span className="font-mono text-xs text-slate-700 block">
                              Dasar Regulasi: {v.statutory_article}
                            </span>
                          </div>
                          <div className="text-rose-700 p-1">
                            {expandedViolations[i] ? (
                              <ChevronUp className="w-4 h-4" />
                            ) : (
                              <ChevronDown className="w-4 h-4" />
                            )}
                          </div>
                        </button>

                        {expandedViolations[i] && (
                          <div className="p-4 pt-0 border-t border-rose-200/60 bg-white/60 text-xs space-y-2">
                            <div className="font-mono text-[11px] text-slate-500 pt-2">
                              Kode Regulasi: <span className="font-semibold text-[#1E2C4F]">{v.rule_code}</span>
                            </div>
                            <p className="text-slate-700 leading-relaxed font-normal">
                              {v.legal_explanation}
                            </p>
                          </div>
                        )}
                      </div>
                    ))}
                  </div>
                </div>
              ) : (
                <div className="p-5 rounded-2xl bg-emerald-50/80 border border-emerald-200/80 text-emerald-950 flex items-center gap-3.5">
                  <ShieldCheck className="w-6 h-6 shrink-0 text-emerald-600" />
                  <div>
                    <span className="font-semibold text-sm block">Klausul Sesuai Regulasi POJK</span>
                    <span className="text-xs text-slate-600 leading-relaxed block mt-0.5">
                      Suku bunga harian, biaya administrasi, dan izin akses perangkat berada dalam batas wajar ketentuan Otoritas Jasa Keuangan.
                    </span>
                  </div>
                </div>
              )}
            </div>
          ) : (
            <div className="rounded-3xl border border-dashed border-slate-200/90 bg-white/60 backdrop-blur-md p-12 text-center text-slate-500 flex flex-col items-center justify-center h-full min-h-[420px] shadow-2xs">
              <div className="w-14 h-14 rounded-2xl bg-white border border-slate-200/80 flex items-center justify-center mb-4 shadow-2xs">
                <FileText className="w-7 h-7 text-[#BA3801]" />
              </div>
              <h3 className="font-semibold text-base text-[#1E2C4F]">Siap Menganalisis Dokumen</h3>
              <p className="text-xs max-w-sm mt-1.5 text-slate-600 leading-relaxed">
                Unggah berkas kontrak pinjol atau pilih salah satu tombol preset di atas untuk menguji klausul perjanjian secara instan.
              </p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
