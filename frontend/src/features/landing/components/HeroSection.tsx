import React from 'react';
import { Link } from 'react-router-dom';
import { HeroThreeCanvas } from './HeroThreeCanvas';
import {
  ArrowRight,
  ShieldAlert,
  Lock,
  Scale,
  ShieldCheck,
} from 'lucide-react';

export const HeroSection: React.FC = () => {
  return (
    <section className="max-w-6xl mx-auto px-4 pt-6 sm:pt-10 pb-4">
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 lg:gap-12 items-center">
        <div className="lg:col-span-7 space-y-6 text-left">
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-white/80 backdrop-blur-md border border-slate-200/80 text-slate-800 font-mono text-xs font-semibold shadow-2xs">
            <span className="w-2 h-2 rounded-full bg-[#BA3801] animate-pulse" />
            <span>Integritas Finansial &amp; Advokasi Konsumen</span>
          </div>

          <h1 className="text-4xl sm:text-5xl lg:text-6xl font-semibold text-[#1E2C4F] tracking-tight leading-[1.10]">
            Era Baru <span className="text-[#BA3801]">Perlindungan Finansial</span> &amp; Advokasi Konsumen
          </h1>

          <p className="text-[17px] text-[#2E3E6E] leading-[1.47] font-normal max-w-xl">
            Pelita mengotomatisasi audit kepatuhan kontrak pinjaman online dan merekonstruksi kronologi barang bukti intimidasi penagihan berbasis regulasi POJK &amp; UU PDP.
          </p>

          <div className="pt-2 flex flex-col sm:flex-row items-stretch sm:items-center gap-3.5">
            <Link
              to="/scanner"
              className="bg-[#BA3801] hover:bg-[#9A2E01] text-white px-7 py-3 rounded-full text-sm font-semibold transition-all duration-150 active:scale-95 flex items-center justify-center gap-2 shadow-sm"
            >
              <span>Mulai Audit Kontrak Gratis</span>
              <ArrowRight className="w-4 h-4 text-[#FFEC89]" />
            </Link>
            <Link
              to="/evidence"
              className="bg-white hover:bg-slate-50 text-[#1E2C4F] border border-slate-200/90 px-7 py-3 rounded-full text-sm font-semibold transition-all duration-150 active:scale-95 flex items-center justify-center gap-2 shadow-2xs"
            >
              <ShieldAlert className="w-4 h-4 text-rose-600" />
              <span>Susun Berkas Aduan Teror</span>
            </Link>
          </div>

          <div className="pt-4 border-t border-slate-200/60 flex flex-wrap items-center gap-4 text-xs font-mono text-slate-600">
            <div className="flex items-center gap-1.5 font-semibold text-[#1E2C4F]">
              <Scale className="w-3.5 h-3.5 text-[#4A69B3]" />
              <span>Standar POJK</span>
            </div>
            <div className="flex items-center gap-1.5 font-semibold text-[#1E2C4F]">
              <Lock className="w-3.5 h-3.5 text-emerald-600" />
              <span>Perlindungan Data</span>
            </div>
            <div className="flex items-center gap-1.5 font-semibold text-[#1E2C4F]">
              <ShieldCheck className="w-3.5 h-3.5 text-[#BA3801]" />
              <span>Keamanan Terjamin</span>
            </div>
          </div>
        </div>

        <div className="lg:col-span-5 relative">
          <div className="w-full h-[420px] sm:h-[480px] rounded-3xl border border-slate-200/80 bg-gradient-to-b from-white/90 via-slate-50/60 to-white/40 backdrop-blur-xl relative shadow-lg shadow-slate-900/5 overflow-hidden flex items-center justify-center group">
            <HeroThreeCanvas />

            <div className="absolute top-4 left-4 z-10 pointer-events-none">
              <div className="bg-white/85 backdrop-blur-md px-3 py-1.5 rounded-xl border border-slate-200/70 shadow-2xs flex items-center gap-2">
                <Scale className="w-3.5 h-3.5 text-[#BA3801]" />
                <span className="text-[10px] font-mono font-semibold text-[#1E2C4F]">
                  Integritas &amp; Advokasi Konsumen
                </span>
              </div>
            </div>

            <div className="absolute bottom-4 right-4 z-10 pointer-events-none">
              <div className="bg-white/85 backdrop-blur-md px-3 py-1.5 rounded-xl border border-slate-200/70 shadow-2xs flex items-center gap-2">
                <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
                <span className="text-[10px] font-mono font-semibold text-emerald-900">
                  Layanan Terverifikasi
                </span>
              </div>
            </div>

            <div className="absolute bottom-4 left-4 z-10 pointer-events-none hidden sm:block">
              <div className="bg-white/85 backdrop-blur-md px-3 py-1.5 rounded-xl border border-slate-200/70 shadow-2xs flex items-center gap-1.5 text-[10px] font-mono font-semibold text-slate-700">
                <ShieldCheck className="w-3 h-3 text-[#BA3801]" />
                <span>Keadilan Konsumen Pinjol</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};
