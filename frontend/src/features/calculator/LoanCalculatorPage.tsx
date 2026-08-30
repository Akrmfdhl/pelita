import React, { useState } from 'react';
import {
  Calculator,
  ShieldCheck,
  ShieldAlert,
  AlertTriangle,
  ArrowRight,
  Info,
  RotateCcw,
  FileText,
  BadgeAlert,
  Scale,
} from 'lucide-react';
import { Link } from 'react-router-dom';

export const LoanCalculatorPage: React.FC = () => {
  const [loanPrincipal, setLoanPrincipal] = useState<number>(3000000);
  const [tenorDays, setTenorDays] = useState<number>(30);
  const [dailyRatePercent, setDailyRatePercent] = useState<number>(0.8);
  const [adminFeePercent, setAdminFeePercent] = useState<number>(10);
  const [lateDays, setLateDays] = useState<number>(0);
  const [lateDailyRatePercent, setLateDailyRatePercent] = useState<number>(0.5);

  const formatIDR = (num: number) => {
    return new Intl.NumberFormat('id-ID', {
      style: 'currency',
      currency: 'IDR',
      maximumFractionDigits: 0,
    }).format(num);
  };

  const adminFeeNominal = (loanPrincipal * adminFeePercent) / 100;
  const netReceived = loanPrincipal - adminFeeNominal;

  const appTotalInterest = (loanPrincipal * dailyRatePercent * tenorDays) / 100;
  const appTotalLatePenalty = (loanPrincipal * lateDailyRatePercent * lateDays) / 100;
  const appTotalRepayment = loanPrincipal + appTotalInterest + appTotalLatePenalty;

  const ojkMaxDailyRate = 0.3;
  const ojkMaxLegalInterest = (loanPrincipal * ojkMaxDailyRate * tenorDays) / 100;
  const ojkMaxLegalLatePenalty = (loanPrincipal * 0.1 * lateDays) / 100;

  const ojk100PercentCap = loanPrincipal;
  const ojkTotalLegalCostsUncapped = adminFeeNominal + ojkMaxLegalInterest + ojkMaxLegalLatePenalty;
  const ojkTotalLegalCosts = Math.min(ojkTotalLegalCostsUncapped, ojk100PercentCap);
  const ojkMaxLegalRepayment = loanPrincipal + ojkTotalLegalCosts;

  const excessOvercharge = Math.max(0, appTotalRepayment - ojkMaxLegalRepayment);

  const effectiveDailyRate =
    ((appTotalRepayment - netReceived) / (netReceived * (tenorDays + lateDays || 1))) * 100;
  const annualPercentageRate = effectiveDailyRate * 365;

  let riskStatus: 'safe' | 'warning' | 'danger' = 'safe';
  if (dailyRatePercent > ojkMaxDailyRate || adminFeePercent > 15 || excessOvercharge > 0) {
    riskStatus = 'warning';
  }
  if (dailyRatePercent >= 0.8 || adminFeePercent >= 25 || effectiveDailyRate > 1.0) {
    riskStatus = 'danger';
  }

  const handleReset = () => {
    setLoanPrincipal(3000000);
    setTenorDays(30);
    setDailyRatePercent(0.3);
    setAdminFeePercent(5);
    setLateDays(0);
    setLateDailyRatePercent(0.1);
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-10">
      {/* Header & Hero Section */}
      <div className="space-y-4 text-left">
        <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-white border border-slate-200/80 text-slate-800 font-mono text-xs font-semibold shadow-2xs">
          <Scale className="w-4 h-4 text-[#BA3801]" />
          <span>SEOJK No. 19/SEOJK.05/2023 &amp; POJK No. 10/2022 Legal Benchmark</span>
        </div>

        <div className="flex flex-col lg:flex-row lg:items-end justify-between gap-6">
          <div className="space-y-2 max-w-3xl">
            <h1 className="text-3xl sm:text-4xl lg:text-5xl font-semibold text-[#1E2C4F] tracking-tight leading-[1.15]">
              Kalkulator Bunga Legal &amp; <span className="text-[#BA3801]">Predatory Alert</span>
            </h1>
            <p className="text-[17px] text-[#2E3E6E] leading-[1.47] font-normal">
              Uji kepatuhan suku bunga, biaya admin, dan denda pinjol Anda terhadap batas maksimum resmi OJK (0.3%/hari dan plafon biaya maksimal 100%).
            </p>
          </div>

          <button
            type="button"
            onClick={handleReset}
            className="px-4 py-2 rounded-full bg-white hover:bg-slate-100 border border-slate-200 text-xs font-mono font-semibold text-[#1E2C4F] flex items-center gap-2 shadow-2xs self-start lg:self-end transition-all"
          >
            <RotateCcw className="w-3.5 h-3.5" />
            <span>Reset Standar OJK (0.3%/hari)</span>
          </button>
        </div>
      </div>

      {/* Main Grid: Inputs vs Legal Verdict */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        {/* Left Column: Interactive Sliders & Inputs (7 cols) */}
        <div className="lg:col-span-7 bg-white border border-slate-200 rounded-3xl p-6 sm:p-8 shadow-sm space-y-7 ring-1 ring-slate-900/5 text-left">
          <div className="flex items-center justify-between pb-4 border-b border-slate-100">
            <div className="flex items-center gap-2.5">
              <Calculator className="w-5 h-5 text-[#BA3801]" />
              <h2 className="font-semibold text-lg text-[#1E2C4F]">Parameter Pinjaman Anda</h2>
            </div>
            <span className="text-xs font-mono text-slate-500">Sesuaikan Nilai Kontrak</span>
          </div>

          {/* Input 1: Pokok Pinjaman */}
          <div className="space-y-2.5">
            <div className="flex justify-between items-center text-xs font-mono">
              <label className="font-semibold text-[#1E2C4F]">1. Pokok Pinjaman yang Diajukan</label>
              <span className="text-sm font-bold text-[#BA3801]">{formatIDR(loanPrincipal)}</span>
            </div>
            <input
              type="range"
              min={500000}
              max={25000000}
              step={500000}
              value={loanPrincipal}
              onChange={(e) => setLoanPrincipal(Number(e.target.value))}
              className="w-full h-2 bg-slate-200 rounded-lg appearance-none cursor-pointer accent-[#BA3801]"
            />
            <div className="flex justify-between text-[10px] font-mono text-slate-400">
              <span>Rp 500 Ribu</span>
              <span>Rp 10 Juta</span>
              <span>Rp 25 Juta</span>
            </div>
          </div>

          {/* Input 2: Tenor Hari */}
          <div className="space-y-2.5">
            <div className="flex justify-between items-center text-xs font-mono">
              <label className="font-semibold text-[#1E2C4F]">2. Durasi Tenor Pinjaman</label>
              <span className="text-sm font-bold text-[#1E2C4F]">{tenorDays} Hari</span>
            </div>
            <input
              type="range"
              min={7}
              max={180}
              step={1}
              value={tenorDays}
              onChange={(e) => setTenorDays(Number(e.target.value))}
              className="w-full h-2 bg-slate-200 rounded-lg appearance-none cursor-pointer accent-[#BA3801]"
            />
            <div className="flex justify-between text-[10px] font-mono text-slate-400">
              <span>7 Hari (Mingguan)</span>
              <span>30 Hari (1 Bulan)</span>
              <span>90 Hari</span>
              <span>180 Hari</span>
            </div>
          </div>

          {/* Input 3: Suku Bunga Harian Aplikasi */}
          <div className="space-y-2.5">
            <div className="flex justify-between items-center text-xs font-mono">
              <div className="flex items-center gap-1.5">
                <label className="font-semibold text-[#1E2C4F]">3. Suku Bunga Harian yang Dikenakan</label>
                <span className="text-[10px] bg-slate-100 text-slate-600 px-2 py-0.5 rounded-full font-mono">
                  Batas OJK: 0.3%/hari
                </span>
              </div>
              <span
                className={`text-sm font-bold font-mono ${
                  dailyRatePercent > 0.3 ? 'text-rose-700' : 'text-emerald-700'
                }`}
              >
                {dailyRatePercent.toFixed(2)}% / hari
              </span>
            </div>
            <input
              type="range"
              min={0.05}
              max={2.0}
              step={0.05}
              value={dailyRatePercent}
              onChange={(e) => setDailyRatePercent(Number(e.target.value))}
              className="w-full h-2 bg-slate-200 rounded-lg appearance-none cursor-pointer accent-[#BA3801]"
            />
            <div className="flex justify-between text-[10px] font-mono text-slate-400">
              <span>0.1% (Produktif)</span>
              <span>0.3% (Batas Maksimal OJK)</span>
              <span>0.8% (Indikasi Pinjol Ilegal)</span>
              <span>2.0%</span>
            </div>
          </div>

          {/* Input 4: Biaya Admin di Awal & Denda */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-5 pt-2">
            <div className="space-y-2">
              <div className="flex justify-between text-xs font-mono">
                <label className="font-semibold text-[#1E2C4F]">Potongan Admin di Awal</label>
                <span className="font-bold text-[#BA3801]">{adminFeePercent}%</span>
              </div>
              <input
                type="range"
                min={0}
                max={40}
                step={1}
                value={adminFeePercent}
                onChange={(e) => setAdminFeePercent(Number(e.target.value))}
                className="w-full h-2 bg-slate-200 rounded-lg appearance-none cursor-pointer accent-[#BA3801]"
              />
              <span className="text-[10px] text-slate-500 font-mono block">
                Dipotong di muka: {formatIDR(adminFeeNominal)}
              </span>
            </div>

            <div className="space-y-2">
              <div className="flex justify-between text-xs font-mono">
                <label className="font-semibold text-[#1E2C4F]">Hari Keterlambatan</label>
                <span className="font-bold text-[#1E2C4F]">{lateDays} Hari</span>
              </div>
              <input
                type="range"
                min={0}
                max={90}
                step={1}
                value={lateDays}
                onChange={(e) => setLateDays(Number(e.target.value))}
                className="w-full h-2 bg-slate-200 rounded-lg appearance-none cursor-pointer accent-[#BA3801]"
              />
              <span className="text-[10px] text-slate-500 font-mono block">
                Denda harian: {lateDailyRatePercent}%/hari
              </span>
            </div>
          </div>

          {/* Net Cash Disbursed Insight */}
          <div className="p-4 rounded-2xl bg-slate-50 border border-slate-200 flex items-center justify-between text-xs font-mono">
            <div className="space-y-0.5">
              <span className="text-slate-500">UANG BERSIH DITERIMA:</span>
              <span className="font-bold text-base text-emerald-800 block">{formatIDR(netReceived)}</span>
            </div>
            <div className="space-y-0.5 text-right">
              <span className="text-slate-500">APR EFEKTIF RIIL:</span>
              <span className="font-bold text-base text-[#1E2C4F] block">{annualPercentageRate.toFixed(0)}% / tahun</span>
            </div>
          </div>
        </div>

        {/* Right Column: Legal Benchmark & Predatory Analysis (5 cols) */}
        <div className="lg:col-span-5 space-y-6 text-left">
          {/* Risk Alert Card */}
          <div
            className={`rounded-3xl p-6 sm:p-7 border transition-all space-y-5 bg-white shadow-sm ring-1 ring-slate-900/5 ${
              riskStatus === 'safe'
                ? 'border-emerald-200 bg-emerald-50/20'
                : riskStatus === 'warning'
                ? 'border-amber-200 bg-amber-50/20'
                : 'border-rose-200 bg-rose-50/20'
            }`}
          >
            <div className="flex items-center justify-between pb-3 border-b border-slate-200/60">
              <div className="flex items-center gap-2">
                {riskStatus === 'safe' ? (
                  <ShieldCheck className="w-5 h-5 text-emerald-700" />
                ) : riskStatus === 'warning' ? (
                  <AlertTriangle className="w-5 h-5 text-amber-700" />
                ) : (
                  <ShieldAlert className="w-5 h-5 text-rose-700" />
                )}
                <h3 className="font-semibold text-base text-[#1E2C4F]">Status Legalitas Kontrak</h3>
              </div>

              <span
                className={`px-3 py-1 rounded-full font-mono text-xs font-bold ${
                  riskStatus === 'safe'
                    ? 'bg-emerald-100 text-emerald-800'
                    : riskStatus === 'warning'
                    ? 'bg-amber-100 text-amber-900'
                    : 'bg-rose-100 text-rose-900'
                }`}
              >
                {riskStatus === 'safe'
                  ? 'MEMENUHI ATURAN OJK'
                  : riskStatus === 'warning'
                  ? 'BUNGA DI ATAS BATAS'
                  : 'PREDATOR FINANSIAL EKSTREM'}
              </span>
            </div>

            {/* Comparison Numbers */}
            <div className="space-y-3 font-mono text-xs">
              <div className="p-3.5 rounded-2xl bg-white border border-slate-200/80 space-y-1">
                <span className="text-slate-500 block text-[11px]">TOTAL TAGIHAN VERSI APLIKASI:</span>
                <span className="text-xl font-extrabold text-[#1E2C4F]">{formatIDR(appTotalRepayment)}</span>
                <span className="text-[10px] text-slate-500 block">
                  Pokok + Bunga ({formatIDR(appTotalInterest)}) + Denda ({formatIDR(appTotalLatePenalty)})
                </span>
              </div>

              <div className="p-3.5 rounded-2xl bg-white border border-slate-200/80 space-y-1">
                <span className="text-slate-500 block text-[11px]">BATAS MAKSIMAL LEGAL OJK (SEOJK 19/2023):</span>
                <span className="text-xl font-extrabold text-emerald-700">{formatIDR(ojkMaxLegalRepayment)}</span>
                <span className="text-[10px] text-emerald-800 block">
                  Bunga maks. 0.3%/hari &amp; total seluruh biaya maks. 100% pokok
                </span>
              </div>
            </div>

            {/* Excess Overcharge Alert Box */}
            {excessOvercharge > 0 && (
              <div className="p-4 rounded-2xl bg-rose-50 border border-rose-200 space-y-2">
                <div className="flex items-center gap-2 text-rose-950 font-bold text-xs font-mono">
                  <BadgeAlert className="w-4 h-4 text-rose-700" />
                  <span>POTENSI KELEBIHAN TAGIHAN ILEGAL:</span>
                </div>
                <div className="text-2xl font-black text-rose-700 font-mono">{formatIDR(excessOvercharge)}</div>
                <p className="text-xs text-slate-700 leading-relaxed font-normal">
                  Nominal ini melebihi batas legalitas POJK. Sesuai regulasi OJK, debitur berhak menolak membayar kelebihan bunga dan dapat menuntut penyesuaian tagihan.
                </p>
              </div>
            )}

            <div className="pt-2">
              <Link
                to="/assistant"
                className="w-full py-3 rounded-full bg-[#BA3801] hover:bg-[#9A2E01] text-white text-xs font-semibold flex items-center justify-center gap-2 transition-all shadow-sm active:scale-98"
              >
                <FileText className="w-4 h-4 text-[#FFEC89]" />
                <span>Susun Dokumen Sanggahan ke Lita AI</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </Link>
            </div>
          </div>

          {/* Quick Legal FAQ Box */}
          <div className="rounded-3xl p-5 bg-white border border-slate-200 text-xs space-y-3 font-mono">
            <div className="flex items-center gap-2 text-[#1E2C4F] font-bold">
              <Info className="w-4 h-4 text-[#BA3801]" />
              <span>Dasar Hukum Regulasi Bunga OJK:</span>
            </div>
            <ul className="space-y-1.5 text-slate-600 list-disc pl-4 text-[11px] leading-relaxed">
              <li>
                <strong>SEOJK No. 19/SEOJK.05/2023</strong>: Batas maksimum bunga harian pendanaan konsumtif diturunkan bertahap menjadi 0.3%/hari (2024) dan 0.2%/hari (2025).
              </li>
              <li>
                <strong>Plafon 100%</strong>: Total seluruh biaya pinjaman (termasuk bunga, admin, dan denda) tidak boleh melebihi 100% dari nilai pokok pinjaman.
              </li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
};
