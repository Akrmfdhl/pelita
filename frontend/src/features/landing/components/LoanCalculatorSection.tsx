import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { AlertOctagon, CheckCircle2, ChevronRight } from 'lucide-react';

export const LoanCalculatorSection: React.FC = () => {
  const [simulatedDailyInterest, setSimulatedDailyInterest] = useState(0.8);
  const [simulatedLoanAmount, setSimulatedLoanAmount] = useState(2000000);
  const [simulatedTenor, setSimulatedTenor] = useState(30);

  const interestRate = simulatedDailyInterest;
  const isViolatingCap = interestRate > 0.3;
  const ojkDailyLimit = 0.3;

  const totalInterestCost = (simulatedLoanAmount * (interestRate / 100)) * simulatedTenor;
  const legalInterestCost = (simulatedLoanAmount * (ojkDailyLimit / 100)) * simulatedTenor;
  const overchargeAmount = Math.max(0, totalInterestCost - legalInterestCost);

  return (
    <section className="max-w-6xl mx-auto px-4">
      <div className="text-center max-w-2xl mx-auto mb-10 space-y-2.5">
        <span className="text-xs font-mono uppercase tracking-wider text-[#BA3801] font-semibold bg-white px-3.5 py-1 rounded-full border border-slate-200/90 shadow-2xs">
          SIMULATOR INTERAKTIF
        </span>
        <h2 className="text-3xl sm:text-4xl font-semibold text-[#1E2C4F] tracking-tight">
          Kalkulator Suku Bunga &amp; Deteksi Overcharge
        </h2>
        <p className="text-sm text-[#2E3E6E] font-normal">
          Geser parameter untuk melihat bagaimana pinjol ilegal membebankan bunga berlebih di luar batas resmi OJK.
        </p>
      </div>

      <div className="bg-white border border-slate-200/80 rounded-2xl p-6 sm:p-10 shadow-2xs">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
          <div className="lg:col-span-6 space-y-6">
            <div>
              <div className="flex justify-between items-center mb-2">
                <label className="text-xs font-mono uppercase tracking-wider text-[#1E2C4F] font-semibold">
                  Bunga Harian: <span className="font-bold text-[#1E2C4F]">{simulatedDailyInterest}% / hari</span>
                </label>
                <span
                  className={`text-[11px] font-mono font-semibold px-2.5 py-0.5 rounded-full ${
                    isViolatingCap ? 'bg-rose-50 text-rose-900 border border-rose-200' : 'bg-emerald-50 text-emerald-950 border border-emerald-200'
                  }`}
                >
                  {isViolatingCap ? 'Melanggar Batas OJK' : 'Sesuai Batas Maksimal'}
                </span>
              </div>
              <input
                type="range"
                min="0.05"
                max="1.5"
                step="0.05"
                value={simulatedDailyInterest}
                onChange={(e) => setSimulatedDailyInterest(parseFloat(e.target.value))}
                className="w-full h-2 bg-slate-200 rounded-lg appearance-none cursor-pointer accent-[#BA3801]"
              />
              <div className="flex justify-between text-[10px] font-mono text-[#2E3E6E] mt-1.5 font-medium">
                <span>0.05%</span>
                <span className="text-[#1E2C4F] font-semibold">Batas OJK: 0.3%</span>
                <span>1.5% (Ilegal)</span>
              </div>
            </div>

            <div>
              <div className="flex justify-between items-center mb-2">
                <label className="text-xs font-mono uppercase tracking-wider text-[#1E2C4F] font-semibold">
                  Pokok Pinjaman: <span className="font-bold text-[#1E2C4F]">Rp {simulatedLoanAmount.toLocaleString('id-ID')}</span>
                </label>
              </div>
              <input
                type="range"
                min="500000"
                max="10000000"
                step="500000"
                value={simulatedLoanAmount}
                onChange={(e) => setSimulatedLoanAmount(parseInt(e.target.value, 10))}
                className="w-full h-2 bg-slate-200 rounded-lg appearance-none cursor-pointer accent-[#BA3801]"
              />
            </div>

            <div>
              <div className="flex justify-between items-center mb-2">
                <label className="text-xs font-mono uppercase tracking-wider text-[#1E2C4F] font-semibold">
                  Tenor Pinjaman: <span className="font-bold text-[#1E2C4F]">{simulatedTenor} Hari</span>
                </label>
              </div>
              <input
                type="range"
                min="7"
                max="90"
                step="1"
                value={simulatedTenor}
                onChange={(e) => setSimulatedTenor(parseInt(e.target.value, 10))}
                className="w-full h-2 bg-slate-200 rounded-lg appearance-none cursor-pointer accent-[#BA3801]"
              />
            </div>
          </div>

          <div className="lg:col-span-6 bg-slate-50/80 rounded-2xl p-6 sm:p-7 space-y-4 border border-slate-200/60">
            <div className="flex items-center justify-between border-b border-slate-200/60 pb-3">
              <span className="text-xs font-mono uppercase tracking-wider text-[#1E2C4F] font-semibold">
                Hasil Kalkulasi Finansial
              </span>
              <span className="text-xs font-mono text-slate-500 font-semibold">SEOJK No. 19/2023</span>
            </div>

            <div className="grid grid-cols-2 gap-3.5">
              <div className="bg-white p-4 rounded-xl border border-slate-200/60 shadow-2xs">
                <span className="text-[11px] font-mono text-[#2E3E6E] block font-semibold">Total Bunga Berjalan</span>
                <span className="text-lg sm:text-xl font-bold text-[#1E2C4F] font-mono">
                  Rp {Math.round(totalInterestCost).toLocaleString('id-ID')}
                </span>
              </div>
              <div className="bg-white p-4 rounded-xl border border-slate-200/60 shadow-2xs">
                <span className="text-[11px] font-mono text-emerald-900 block font-semibold">Batas Legal Maksimum</span>
                <span className="text-lg sm:text-xl font-bold text-emerald-950 font-mono">
                  Rp {Math.round(legalInterestCost).toLocaleString('id-ID')}
                </span>
              </div>
            </div>

            {isViolatingCap ? (
              <div className="bg-rose-50 border border-rose-200 text-rose-950 p-4 rounded-xl space-y-1.5 shadow-2xs">
                <div className="flex items-center gap-1.5 font-semibold text-xs font-mono text-rose-800">
                  <AlertOctagon className="w-4 h-4 text-rose-700" />
                  <span>Terdeteksi Bunga Berlebih (Overcharge):</span>
                </div>
                <p className="text-sm font-semibold">
                  Anda dibebani lebih mahal sebesar Rp {Math.round(overchargeAmount).toLocaleString('id-ID')}.
                </p>
                <p className="text-xs text-rose-900 leading-relaxed font-normal">
                  Pengenaan bunga di atas 0.3% per hari berstatus melanggar ketentuan dan dapat diajukan sebagai sengketa ke Satgas PASTI.
                </p>
              </div>
            ) : (
              <div className="bg-emerald-50 border border-emerald-200 text-emerald-950 p-4 rounded-xl space-y-1 shadow-2xs">
                <div className="flex items-center gap-1.5 font-semibold text-xs font-mono text-emerald-800">
                  <CheckCircle2 className="w-4 h-4 text-emerald-700" />
                  <span>Bunga Dalam Batas Wajar POJK</span>
                </div>
                <p className="text-xs text-emerald-900 font-normal">
                  Suku bunga harian tidak melampaui plafon maksimum yang diizinkan oleh Otoritas Jasa Keuangan.
                </p>
              </div>
            )}

            <Link
              to="/scanner"
              className="w-full bg-[#BA3801] hover:bg-[#9A2E01] text-white py-3 rounded-full text-xs font-mono font-semibold flex items-center justify-center gap-2 transition-all duration-150 active:scale-95 shadow-2xs"
            >
              <span>Uji Dokumen Kontrak Anda di Pemindai</span>
              <ChevronRight className="w-4 h-4 text-[#FFEC89]" />
            </Link>
          </div>
        </div>
      </div>
    </section>
  );
};
