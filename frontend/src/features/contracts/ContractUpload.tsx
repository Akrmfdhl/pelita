import React, { useState } from 'react';
import { apiRequest } from '../../lib/api';
import { ContractAuditResponse } from '../../types';
import { StampBadge } from '../../components/ui/StampBadge';
import { UploadCloud, FileText, CheckCircle2 } from 'lucide-react';

export const ContractUpload: React.FC = () => {
  const [platformName, setPlatformName] = useState('Pinjaman Dana Instan Kilat');
  const [dailyInterest, setDailyInterest] = useState('0.8');
  const [adminFee, setAdminFee] = useState('25');
  const [permissions, setPermissions] = useState('CONTACTS, GALLERY, LOCATION');
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState<ContractAuditResponse | null>(null);

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
          late_fee_daily_rate: 0.005,
          tenor_days: 30,
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
    <div className="space-y-8">
      <div>
        <h1 className="font-serif font-bold text-3xl text-ink-primary">Pemindai Kontrak & T&C Pinjaman</h1>
        <p className="text-ink-muted text-sm mt-1">
          Pindai draf perjanjian pinjaman, izin aplikasi, dan suku bunga tersembunyi sebelum Anda menandatangani.
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        <div className="lg:col-span-5 bg-canvas-surface border border-canvas-border rounded-lg p-6 shadow-sm">
          <form onSubmit={handleAudit} className="space-y-4">
            <div>
              <label className="block text-xs font-mono uppercase tracking-wider text-ink-muted mb-1">
                Nama Aplikasi / Penyelenggara
              </label>
              <input
                type="text"
                value={platformName}
                onChange={(e) => setPlatformName(e.target.value)}
                className="w-full bg-canvas-subtle border border-canvas-border rounded px-3 py-2 text-sm text-ink-primary font-medium focus:outline-none focus:border-ink-navy"
                required
              />
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-mono uppercase tracking-wider text-ink-muted mb-1">
                  Bunga Harian (%)
                </label>
                <input
                  type="number"
                  step="0.01"
                  value={dailyInterest}
                  onChange={(e) => setDailyInterest(e.target.value)}
                  className="w-full bg-canvas-subtle border border-canvas-border rounded px-3 py-2 text-sm text-ink-primary font-medium focus:outline-none focus:border-ink-navy"
                  required
                />
              </div>

              <div>
                <label className="block text-xs font-mono uppercase tracking-wider text-ink-muted mb-1">
                  Biaya Admin (%)
                </label>
                <input
                  type="number"
                  step="0.1"
                  value={adminFee}
                  onChange={(e) => setAdminFee(e.target.value)}
                  className="w-full bg-canvas-subtle border border-canvas-border rounded px-3 py-2 text-sm text-ink-primary font-medium focus:outline-none focus:border-ink-navy"
                  required
                />
              </div>
            </div>

            <div>
              <label className="block text-xs font-mono uppercase tracking-wider text-ink-muted mb-1">
                Izin Akses Aplikasi yang Diminta
              </label>
              <input
                type="text"
                value={permissions}
                onChange={(e) => setPermissions(e.target.value)}
                className="w-full bg-canvas-subtle border border-canvas-border rounded px-3 py-2 text-sm text-ink-primary font-medium focus:outline-none focus:border-ink-navy"
                placeholder="CONTACTS, GALLERY, LOCATION"
                required
              />
              <span className="text-[11px] text-ink-muted mt-1 block">
                Pisahkan dengan koma (contoh: CAMERA, LOCATION, CONTACTS).
              </span>
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full bg-ink-navy hover:bg-opacity-95 text-canvas-paper py-2.5 rounded font-medium text-sm transition flex items-center justify-center gap-2"
            >
              {loading ? (
                <span>Mengevaluasi Klausul Hukum...</span>
              ) : (
                <>
                  <UploadCloud className="w-4 h-4" />
                  Audit Kontrak dengan Rule Engine
                </>
              )}
            </button>
          </form>
        </div>

        <div className="lg:col-span-7">
          {result ? (
            <div className="bg-canvas-surface border border-canvas-border rounded-lg p-6 shadow-sm space-y-6">
              <div className="flex items-start justify-between">
                <div>
                  <span className="font-mono text-xs text-ink-muted">HASIL ANALISIS KONTRAK</span>
                  <h2 className="font-serif font-bold text-2xl text-ink-primary mt-1">{result.platform_name}</h2>
                </div>
                <StampBadge level={result.risk_level} />
              </div>

              <div className="p-4 bg-canvas-subtle rounded border border-canvas-border">
                <h3 className="font-mono text-xs uppercase font-semibold text-ink-navy mb-1">Ringkasan Evaluasi Hukum:</h3>
                <p className="text-sm text-ink-primary leading-relaxed">{result.summary_explanation}</p>
              </div>

              {result.violations.length > 0 && (
                <div className="space-y-3">
                  <h3 className="font-mono text-xs uppercase font-semibold text-stamp-red">
                    Pelanggaran Regulasi Teridentifikasi ({result.violations.length})
                  </h3>
                  {result.violations.map((v, i) => (
                    <div key={i} className="border-l-4 border-stamp-red bg-stamp-red-bg p-3.5 rounded-r">
                      <div className="flex items-center justify-between">
                        <span className="font-semibold text-sm text-stamp-red">{v.violation_type}</span>
                        <span className="font-mono text-[11px] text-ink-muted">{v.rule_code}</span>
                      </div>
                      <p className="text-xs text-ink-primary font-mono mt-1">Dasar: {v.statutory_article}</p>
                      <p className="text-xs text-ink-muted mt-1.5">{v.legal_explanation}</p>
                    </div>
                  ))}
                </div>
              )}
            </div>
          ) : (
            <div className="bg-canvas-surface border border-dashed border-canvas-border rounded-lg p-12 text-center text-ink-muted flex flex-col items-center justify-center h-full min-h-[320px]">
              <FileText className="w-12 h-12 text-canvas-border mb-3" />
              <p className="text-sm font-medium">Unggah atau masukkan parameter kontrak untuk memulai audit deterministik.</p>
              <div className="flex items-center gap-2 mt-4 text-xs font-mono text-stamp-teal">
                <CheckCircle2 className="w-3.5 h-3.5" />
                Diverifikasi terhadap POJK No. 10/2022 & Surat Edaran AFPI
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
