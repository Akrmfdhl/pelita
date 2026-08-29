import React, { useState } from 'react';
import { apiRequest } from '../../lib/api';
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
} from 'lucide-react';

export const ContractUpload: React.FC = () => {
  const [platformName, setPlatformName] = useState('Pinjaman Dana Instan Kilat');
  const [dailyInterest, setDailyInterest] = useState('0.8');
  const [adminFee, setAdminFee] = useState('25');
  const [lateFee, setLateFee] = useState('0.5');
  const [tenorDays, setTenorDays] = useState('30');
  const [permissions, setPermissions] = useState('CONTACTS, GALLERY, LOCATION, CAMERA');
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState<ContractAuditResponse | null>(null);
  const [expandedViolations, setExpandedViolations] = useState<Record<number, boolean>>({});

  const interestNum = parseFloat(dailyInterest) || 0;
  const isInterestOverCap = interestNum > 0.3;

  const toggleViolation = (index: number) => {
    setExpandedViolations((prev) => ({ ...prev, [index]: !prev[index] }));
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
    setLoading(true);
    try {
      const data = await apiRequest<ContractAuditResponse>('/contracts/audit', {
        method: 'POST',
        body: JSON.stringify({
          platform_name: platformName,
          document_url: 'https://storage.pelita.id/samples/sample_contract_01.pdf',
          daily_interest_rate: parseFloat(dailyInterest) / 100,
          admin_fee_percentage: parseFloat(adminFee) / 100,
          late_fee_daily_rate: parseFloat(lateFee) / 100,
          tenor_days: parseInt(tenorDays, 10),
          permissions_requested: permissions.split(',').map((p) => p.trim()),
        }),
      });
      setResult(data);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="space-y-8 max-w-7xl mx-auto">
      <div className="border-b border-canvas-border pb-5 flex flex-col md:flex-row md:items-end justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <Scale className="w-5 h-5 text-stamp-teal" />
            <span className="font-mono text-xs font-semibold uppercase tracking-wider text-stamp-teal">
              Modul Audit Preventif
            </span>
          </div>
          <h1 className="font-serif font-bold text-3xl text-ink-primary">Pemindai Kontrak &amp; T&amp;C Pinjaman</h1>
          <p className="text-ink-muted text-sm mt-1 max-w-2xl">
            Evaluasi kepatuhan hukum draf perjanjian pinjaman secara otomatis terhadap batasan suku bunga POJK No. 10/2022
            dan larangan akses data pribadi non-CAMDOG.
          </p>
        </div>

        <div className="flex flex-wrap gap-2">
          <button
            type="button"
            onClick={() => applyPreset('illegal')}
            className="tactile-btn text-xs font-mono px-3 py-1.5 rounded bg-stamp-red-bg text-stamp-red border border-stamp-red hover:bg-opacity-90 flex items-center gap-1.5"
          >
            <Zap className="w-3.5 h-3.5" />
            Preset: Pinjol Ilegal
          </button>
          <button
            type="button"
            onClick={() => applyPreset('legal')}
            className="tactile-btn text-xs font-mono px-3 py-1.5 rounded bg-stamp-teal-bg text-stamp-teal border border-stamp-teal hover:bg-opacity-90 flex items-center gap-1.5"
          >
            <ShieldCheck className="w-3.5 h-3.5" />
            Preset: Berizin OJK
          </button>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        <div className="lg:col-span-5 bg-canvas-surface border border-canvas-border rounded-xl p-6 shadow-sm space-y-5">
          <div className="flex items-center justify-between border-b border-canvas-border pb-3">
            <h2 className="font-serif font-bold text-lg text-ink-primary">Parameter Perjanjian</h2>
            <span className="font-mono text-[11px] text-ink-muted bg-canvas-subtle px-2 py-0.5 rounded border border-canvas-border">
              POJK No. 10/2022
            </span>
          </div>

          <form onSubmit={handleAudit} className="space-y-4">
            <div>
              <label className="block text-xs font-mono uppercase tracking-wider text-ink-muted mb-1.5">
                Nama Platform / Penyelenggara
              </label>
              <input
                type="text"
                value={platformName}
                onChange={(e) => setPlatformName(e.target.value)}
                className="w-full bg-canvas-subtle border border-canvas-border rounded-lg px-3.5 py-2.5 text-sm text-ink-primary font-medium focus:outline-none focus:ring-2 focus:ring-ink-navy/20 focus:border-ink-navy transition-all"
                required
              />
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <div className="flex items-center justify-between mb-1.5">
                  <label className="text-xs font-mono uppercase tracking-wider text-ink-muted">
                    Bunga Harian (%)
                  </label>
                  {isInterestOverCap && (
                    <span className="text-[10px] font-mono text-stamp-red font-semibold">
                      Melebihi Batas
                    </span>
                  )}
                </div>
                <input
                  type="number"
                  step="0.01"
                  value={dailyInterest}
                  onChange={(e) => setDailyInterest(e.target.value)}
                  className={`w-full bg-canvas-subtle border rounded-lg px-3.5 py-2.5 text-sm font-semibold focus:outline-none transition-all ${
                    isInterestOverCap
                      ? 'border-stamp-red text-stamp-red bg-stamp-red-bg/20 focus:ring-2 focus:ring-stamp-red/20'
                      : 'border-canvas-border text-ink-primary focus:border-ink-navy'
                  }`}
                  required
                />
                <span className="text-[10px] font-mono text-ink-muted mt-1 block">
                  Batas OJK: maks 0.3% / hari
                </span>
              </div>

              <div>
                <label className="block text-xs font-mono uppercase tracking-wider text-ink-muted mb-1.5">
                  Biaya Admin (%)
                </label>
                <input
                  type="number"
                  step="0.1"
                  value={adminFee}
                  onChange={(e) => setAdminFee(e.target.value)}
                  className="w-full bg-canvas-subtle border border-canvas-border rounded-lg px-3.5 py-2.5 text-sm text-ink-primary font-semibold focus:outline-none focus:ring-2 focus:ring-ink-navy/20 focus:border-ink-navy transition-all"
                  required
                />
                <span className="text-[10px] font-mono text-ink-muted mt-1 block">
                  Potongan di awal pencairan
                </span>
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-mono uppercase tracking-wider text-ink-muted mb-1.5">
                  Denda Harian (%)
                </label>
                <input
                  type="number"
                  step="0.01"
                  value={lateFee}
                  onChange={(e) => setLateFee(e.target.value)}
                  className="w-full bg-canvas-subtle border border-canvas-border rounded-lg px-3.5 py-2.5 text-sm text-ink-primary font-medium focus:outline-none focus:ring-2 focus:ring-ink-navy/20 focus:border-ink-navy transition-all"
                  required
                />
              </div>

              <div>
                <label className="block text-xs font-mono uppercase tracking-wider text-ink-muted mb-1.5">
                  Tenor Pinjaman (Hari)
                </label>
                <input
                  type="number"
                  value={tenorDays}
                  onChange={(e) => setTenorDays(e.target.value)}
                  className="w-full bg-canvas-subtle border border-canvas-border rounded-lg px-3.5 py-2.5 text-sm text-ink-primary font-medium focus:outline-none focus:ring-2 focus:ring-ink-navy/20 focus:border-ink-navy transition-all"
                  required
                />
              </div>
            </div>

            <div>
              <label className="block text-xs font-mono uppercase tracking-wider text-ink-muted mb-1.5">
                Izin Akses Smartphone yang Diminta
              </label>
              <textarea
                rows={2}
                value={permissions}
                onChange={(e) => setPermissions(e.target.value)}
                className="w-full bg-canvas-subtle border border-canvas-border rounded-lg px-3.5 py-2 text-xs font-mono text-ink-primary focus:outline-none focus:ring-2 focus:ring-ink-navy/20 focus:border-ink-navy transition-all"
                placeholder="CONTACTS, GALLERY, LOCATION, CAMERA"
                required
              />
              <div className="mt-1 flex items-center gap-1 text-[11px] text-ink-muted">
                <Sparkles className="w-3 h-3 text-stamp-teal" />
                <span>Aturan CAMDOG: Hanya Kamera, Mikrofon, &amp; Lokasi yang diizinkan OJK.</span>
              </div>
            </div>

            <button
              type="submit"
              disabled={loading}
              className="tactile-btn w-full bg-ink-navy hover:bg-opacity-95 text-canvas-paper py-3 rounded-lg font-medium text-sm transition-all flex items-center justify-center gap-2 shadow-sm disabled:opacity-50"
            >
              {loading ? (
                <span className="flex items-center gap-2 font-mono text-xs">
                  <span className="w-4 h-4 border-2 border-canvas-paper border-t-transparent rounded-full animate-spin" />
                  Mengevaluasi Klausul Hukum...
                </span>
              ) : (
                <>
                  <UploadCloud className="w-4 h-4 text-stamp-teal" />
                  Jalankan Audit Rule Engine
                </>
              )}
            </button>
          </form>
        </div>

        <div className="lg:col-span-7">
          {result ? (
            <div className="bg-canvas-surface border border-canvas-border rounded-xl p-6 sm:p-7 shadow-sm space-y-6 animate-fadeIn">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-canvas-border pb-5">
                <div>
                  <span className="font-mono text-xs font-semibold text-ink-muted tracking-wider uppercase block">
                    HASIL RESMI EVALUASI HUKUM
                  </span>
                  <h2 className="font-serif font-bold text-2xl text-ink-primary mt-1">{result.platform_name}</h2>
                </div>
                <StampBadge level={result.risk_level} />
              </div>

              <div className="p-4 bg-canvas-subtle rounded-lg border border-canvas-border space-y-2">
                <div className="flex items-center gap-2 text-ink-navy font-semibold text-xs font-mono uppercase tracking-wider">
                  <Scale className="w-4 h-4 text-stamp-teal" />
                  Kesimpulan Yuridis:
                </div>
                <p className="text-sm text-ink-primary leading-relaxed">{result.summary_explanation}</p>
              </div>

              {result.violations.length > 0 ? (
                <div className="space-y-3">
                  <div className="flex items-center justify-between">
                    <h3 className="font-mono text-xs font-bold uppercase tracking-wider text-stamp-red flex items-center gap-1.5">
                      <AlertTriangle className="w-4 h-4" />
                      Pelanggaran Regulasi Teridentifikasi ({result.violations.length})
                    </h3>
                    <span className="text-[11px] font-mono text-ink-muted">Klik untuk rujukan pasal lengkap</span>
                  </div>

                  <div className="space-y-2.5">
                    {result.violations.map((v, i) => (
                      <div
                        key={i}
                        className="border border-stamp-red/30 bg-stamp-red-bg/40 rounded-lg overflow-hidden transition-all"
                      >
                        <button
                          type="button"
                          onClick={() => toggleViolation(i)}
                          className="w-full p-3.5 text-left flex items-center justify-between gap-3 hover:bg-stamp-red-bg/60 transition-colors"
                        >
                          <div className="space-y-1">
                            <span className="font-semibold text-sm text-stamp-red block">{v.violation_type}</span>
                            <span className="font-mono text-xs text-ink-primary block font-medium">
                              Dasar Regulasi: {v.statutory_article}
                            </span>
                          </div>
                          <div className="text-stamp-red p-1">
                            {expandedViolations[i] ? (
                              <ChevronUp className="w-4 h-4" />
                            ) : (
                              <ChevronDown className="w-4 h-4" />
                            )}
                          </div>
                        </button>

                        {expandedViolations[i] && (
                          <div className="p-3.5 pt-0 border-t border-stamp-red/20 bg-canvas-surface/80 text-xs space-y-2">
                            <div className="font-mono text-[11px] text-ink-muted pt-2">
                              Kode Pelanggaran: <span className="font-semibold text-ink-navy">{v.rule_code}</span>
                            </div>
                            <p className="text-ink-primary leading-relaxed">{v.legal_explanation}</p>
                          </div>
                        )}
                      </div>
                    ))}
                  </div>
                </div>
              ) : (
                <div className="p-4 bg-stamp-teal-bg/60 border border-stamp-teal rounded-lg text-stamp-teal flex items-center gap-3">
                  <ShieldCheck className="w-6 h-6 shrink-0" />
                  <div>
                    <span className="font-bold text-sm block">Klausul Sesuai Regulasi POJK</span>
                    <span className="text-xs opacity-90">
                      Suku bunga harian, biaya, dan izin akses perangkat berada dalam batas wajar ketentuan Otoritas Jasa Keuangan.
                    </span>
                  </div>
                </div>
              )}
            </div>
          ) : (
            <div className="bg-canvas-surface border-2 border-dashed border-canvas-border rounded-xl p-12 text-center text-ink-muted flex flex-col items-center justify-center h-full min-h-[380px] shadow-sm">
              <div className="w-14 h-14 rounded-full bg-canvas-subtle border border-canvas-border flex items-center justify-center mb-4">
                <FileText className="w-7 h-7 text-ink-muted" />
              </div>
              <h3 className="font-serif font-bold text-lg text-ink-primary">Siap Menganalisis Dokumen</h3>
              <p className="text-sm max-w-sm mt-1">
                Pilih salah satu tombol preset di atas atau masukkan parameter kontrak Anda untuk menguji klausul secara instan.
              </p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
