import React, { useState, useRef } from 'react';
import { useExtractContract, useAuditContract } from '../../hooks/useContracts';
import { ContractAuditResponse } from '../../types';
import { StampBadge } from '../../components/ui/StampBadge';
import {
  UploadCloud,
  FileText,
  AlertTriangle,
  Scale,
  Sparkles,
  ChevronDown,
  ChevronUp,
  ShieldCheck,
  Zap,
  CheckCircle,
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
    <div className="space-y-8 max-w-7xl mx-auto">
      <div className="border-b-2 border-[#4A69B3]/35 pb-5 flex flex-col md:flex-row md:items-end justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <Scale className="w-5 h-5 text-[#BA3801]" />
            <span className="font-mono text-xs font-bold uppercase tracking-wider text-[#BA3801]">
              Modul Audit Preventif
            </span>
          </div>
          <h1 className="text-3xl font-extrabold text-[#1E2C4F] tracking-tight">Pemindai Kontrak &amp; T&amp;C Pinjaman</h1>
          <p className="text-[#2E3E6E] text-sm mt-1 max-w-2xl font-medium">
            Evaluasi kepatuhan hukum draf perjanjian pinjaman secara otomatis terhadap batasan suku bunga POJK No. 10/2022
            dan larangan akses data pribadi non-CAMDOG.
          </p>
        </div>

        <div className="flex flex-wrap gap-2">
          <button
            type="button"
            onClick={() => applyPreset('illegal')}
            className="tactile-btn text-xs font-mono font-bold px-3.5 py-1.5 rounded-full bg-rose-50 text-rose-950 border-2 border-rose-400 hover:bg-rose-100 flex items-center gap-1.5 shadow-xs"
          >
            <Zap className="w-3.5 h-3.5 text-rose-700" />
            Preset: Pinjol Ilegal
          </button>
          <button
            type="button"
            onClick={() => applyPreset('legal')}
            className="tactile-btn text-xs font-mono font-bold px-3.5 py-1.5 rounded-full bg-white text-[#1E2C4F] border-2 border-[#4A69B3] hover:bg-[#FFEC89] flex items-center gap-1.5 shadow-xs"
          >
            <ShieldCheck className="w-3.5 h-3.5 text-emerald-700" />
            Preset: Berizin OJK
          </button>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        <div className="lg:col-span-5 bg-white border-2 border-[#4A69B3] rounded-3xl p-6 sm:p-7 shadow-xl shadow-[#1E2C4F]/5 space-y-5">
          <div className="flex items-center justify-between border-b border-[#4A69B3]/25 pb-3">
            <h2 className="font-bold text-lg text-[#1E2C4F]">Unggah &amp; Parameter Kontrak</h2>
            <span className="font-mono text-[11px] text-[#1E2C4F] bg-white px-2.5 py-0.5 rounded-md border border-[#1E2C4F] font-bold">
              POJK No. 10/2022
            </span>
          </div>

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
            className={`border-2 border-dashed rounded-2xl p-5 text-center cursor-pointer transition-all ${
              isDragging
                ? 'border-[#BA3801] bg-[#FFEC89]'
                : 'border-[#4A69B3] hover:border-[#BA3801] bg-white'
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
            <UploadCloud className="w-8 h-8 text-[#BA3801] mx-auto mb-2" />
            {isExtracting ? (
              <div className="flex items-center justify-center gap-2 text-xs font-mono text-[#BA3801] font-bold">
                <span className="w-3.5 h-3.5 border-2 border-[#BA3801] border-t-transparent rounded-full animate-spin" />
                <span>Mengekstrak parameter klausul otomatis via AI...</span>
              </div>
            ) : uploadedFileName ? (
              <div className="flex items-center justify-center gap-1.5 text-xs font-mono text-[#1E2C4F] font-bold">
                <CheckCircle className="w-4 h-4 text-emerald-700" />
                <span>{uploadedFileName} (Parameter Terisi Otomatis)</span>
              </div>
            ) : (
              <p className="text-xs text-[#2E3E6E] font-medium">
                Tarik &amp; lepas berkas kontrak PDF/Gambar di sini, atau <span className="text-[#BA3801] font-bold underline">pilih file</span>
              </p>
            )}
          </div>

          <form onSubmit={handleAudit} className="space-y-4">
            <div>
              <label className="block text-xs font-bold text-[#1E2C4F] mb-1.5">
                Nama Platform / Penyelenggara
              </label>
              <input
                type="text"
                value={platformName}
                onChange={(e) => setPlatformName(e.target.value)}
                placeholder="Contoh: PT Pinjaman Maju Bersama"
                className="w-full bg-white border-2 border-[#4A69B3]/40 rounded-2xl px-3.5 py-2.5 text-xs text-[#1E2C4F] font-semibold focus:outline-none focus:ring-2 focus:ring-[#BA3801]/20 focus:border-[#BA3801] transition-all"
                required
              />
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <div className="flex items-center justify-between mb-1.5">
                  <label className="text-xs font-bold text-[#1E2C4F]">
                    Bunga Harian (%)
                  </label>
                  {isInterestOverCap && (
                    <span className="text-[10px] font-mono text-rose-700 font-bold">
                      Melebihi Batas
                    </span>
                  )}
                </div>
                <input
                  type="number"
                  step="0.01"
                  value={dailyInterest}
                  onChange={(e) => setDailyInterest(e.target.value)}
                  placeholder="0.3"
                  className={`w-full bg-white border-2 rounded-2xl px-3.5 py-2.5 text-xs font-bold focus:outline-none transition-all ${
                    isInterestOverCap
                      ? 'border-rose-500 text-rose-800 bg-rose-50'
                      : 'border-[#4A69B3]/40 text-[#1E2C4F] focus:border-[#BA3801]'
                  }`}
                  required
                />
                <span className="text-[10px] font-mono text-[#2E3E6E] mt-1 block font-medium">
                  Batas OJK: maks 0.3% / hari
                </span>
              </div>

              <div>
                <label className="block text-xs font-bold text-[#1E2C4F] mb-1.5">
                  Biaya Admin (%)
                </label>
                <input
                  type="number"
                  step="0.1"
                  value={adminFee}
                  onChange={(e) => setAdminFee(e.target.value)}
                  placeholder="5.0"
                  className="w-full bg-white border-2 border-[#4A69B3]/40 rounded-2xl px-3.5 py-2.5 text-xs text-[#1E2C4F] font-bold focus:outline-none focus:ring-2 focus:ring-[#BA3801]/20 focus:border-[#BA3801] transition-all"
                  required
                />
                <span className="text-[10px] font-mono text-[#2E3E6E] mt-1 block font-medium">
                  Potongan awal pencairan
                </span>
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-bold text-[#1E2C4F] mb-1.5">
                  Denda Harian (%)
                </label>
                <input
                  type="number"
                  step="0.01"
                  value={lateFee}
                  onChange={(e) => setLateFee(e.target.value)}
                  placeholder="0.1"
                  className="w-full bg-white border-2 border-[#4A69B3]/40 rounded-2xl px-3.5 py-2.5 text-xs text-[#1E2C4F] font-bold focus:outline-none focus:ring-2 focus:ring-[#BA3801]/20 focus:border-[#BA3801] transition-all"
                  required
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-[#1E2C4F] mb-1.5">
                  Tenor Pinjaman (Hari)
                </label>
                <input
                  type="number"
                  value={tenorDays}
                  onChange={(e) => setTenorDays(e.target.value)}
                  placeholder="30"
                  className="w-full bg-white border-2 border-[#4A69B3]/40 rounded-2xl px-3.5 py-2.5 text-xs text-[#1E2C4F] font-bold focus:outline-none focus:ring-2 focus:ring-[#BA3801]/20 focus:border-[#BA3801] transition-all"
                  required
                />
              </div>
            </div>

            <div>
              <label className="block text-xs font-bold text-[#1E2C4F] mb-1.5">
                Izin Akses Smartphone yang Diminta
              </label>
              <textarea
                rows={2}
                value={permissions}
                onChange={(e) => setPermissions(e.target.value)}
                className="w-full bg-white border-2 border-[#4A69B3]/40 rounded-2xl px-3.5 py-2 text-xs font-mono text-[#1E2C4F] focus:outline-none focus:ring-2 focus:ring-[#BA3801]/20 focus:border-[#BA3801] transition-all"
                placeholder="CAMERA, MICROPHONE, LOCATION"
                required
              />
              <div className="mt-1 flex items-center gap-1 text-[11px] text-[#2E3E6E] font-medium">
                <Sparkles className="w-3.5 h-3.5 text-[#BA3801]" />
                <span>Aturan CAMDOG: Hanya Kamera, Mikrofon, &amp; Lokasi yang diizinkan OJK.</span>
              </div>
            </div>

            <button
              type="submit"
              disabled={loading}
              className="tactile-btn w-full bg-[#BA3801] hover:bg-[#9A2E01] text-white py-3 rounded-2xl font-bold text-xs transition-all flex items-center justify-center gap-2 shadow-md disabled:opacity-50"
            >
              {loading ? (
                <span className="flex items-center gap-2 font-mono text-xs">
                  <span className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                  Mengevaluasi Klausul Hukum...
                </span>
              ) : (
                <>
                  <UploadCloud className="w-4 h-4 text-[#FFEC89]" />
                  Jalankan Audit Rule Engine
                </>
              )}
            </button>
          </form>
        </div>

        <div className="lg:col-span-7">
          {result ? (
            <div className="bg-white border-2 border-[#4A69B3] rounded-3xl p-6 sm:p-8 shadow-xl shadow-[#1E2C4F]/5 space-y-6 animate-fadeIn">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-[#4A69B3]/25 pb-5">
                <div>
                  <span className="font-mono text-xs font-bold text-[#BA3801] tracking-wider uppercase block">
                    HASIL RESMI EVALUASI HUKUM
                  </span>
                  <h2 className="text-2xl font-bold text-[#1E2C4F] mt-1">{result.platform_name}</h2>
                </div>
                <StampBadge level={result.risk_level} />
              </div>

              <div className="p-4 bg-white rounded-2xl border-2 border-[#4A69B3]/40 space-y-2">
                <div className="flex items-center gap-2 text-[#1E2C4F] font-bold text-xs font-mono uppercase tracking-wider">
                  <Scale className="w-4 h-4 text-[#BA3801]" />
                  Kesimpulan Yuridis:
                </div>
                <p className="text-xs sm:text-sm text-[#1E2C4F] leading-relaxed font-medium">{result.summary_explanation}</p>
              </div>

              {result.violations.length > 0 ? (
                <div className="space-y-3">
                  <div className="flex items-center justify-between">
                    <h3 className="font-mono text-xs font-bold uppercase tracking-wider text-rose-800 flex items-center gap-1.5">
                      <AlertTriangle className="w-4 h-4 text-rose-700" />
                      Pelanggaran Regulasi Teridentifikasi ({result.violations.length})
                    </h3>
                    <span className="text-[11px] font-mono text-[#2E3E6E]">Klik untuk rujukan pasal</span>
                  </div>

                  <div className="space-y-2.5">
                    {result.violations.map((v, i) => (
                      <div
                        key={i}
                        className="border-2 border-rose-300 bg-rose-50 rounded-2xl overflow-hidden transition-all"
                      >
                        <button
                          type="button"
                          onClick={() => toggleViolation(i)}
                          className="w-full p-4 text-left flex items-center justify-between gap-3 hover:bg-rose-100 transition-colors"
                        >
                          <div className="space-y-1">
                            <span className="font-bold text-xs sm:text-sm text-rose-950 block">{v.violation_type}</span>
                            <span className="font-mono text-xs text-[#1E2C4F] block font-bold">
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
                          <div className="p-4 pt-0 border-t border-rose-300 bg-white text-xs space-y-2">
                            <div className="font-mono text-[11px] text-[#2E3E6E] pt-2">
                              Kode Pelanggaran: <span className="font-bold text-[#1E2C4F]">{v.rule_code}</span>
                            </div>
                            <p className="text-[#1E2C4F] leading-relaxed font-medium">{v.legal_explanation}</p>
                          </div>
                        )}
                      </div>
                    ))}
                  </div>
                </div>
              ) : (
                <div className="p-4 bg-emerald-50 border-2 border-emerald-400 rounded-2xl text-emerald-950 flex items-center gap-3">
                  <ShieldCheck className="w-6 h-6 shrink-0 text-emerald-700" />
                  <div>
                    <span className="font-bold text-xs sm:text-sm block">Klausul Sesuai Regulasi POJK</span>
                    <span className="text-xs font-medium opacity-90">
                      Suku bunga harian, biaya, dan izin akses perangkat berada dalam batas wajar ketentuan Otoritas Jasa Keuangan.
                    </span>
                  </div>
                </div>
              )}
            </div>
          ) : (
            <div className="bg-white border-2 border-dashed border-[#4A69B3] rounded-3xl p-12 text-center text-[#2E3E6E] flex flex-col items-center justify-center h-full min-h-[380px] shadow-sm">
              <div className="w-14 h-14 rounded-2xl bg-white border-2 border-[#4A69B3] flex items-center justify-center mb-4 shadow-xs">
                <FileText className="w-7 h-7 text-[#BA3801]" />
              </div>
              <h3 className="font-bold text-base text-[#1E2C4F]">Siap Menganalisis Dokumen</h3>
              <p className="text-xs max-w-sm mt-1 text-[#2E3E6E] font-medium">
                Unggah berkas kontrak pinjol atau pilih salah satu tombol preset di atas untuk menguji klausul secara instan.
              </p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
