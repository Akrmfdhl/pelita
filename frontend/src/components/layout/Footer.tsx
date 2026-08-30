import React from 'react';
import { Link } from 'react-router-dom';
import {
  ShieldCheck,
  PhoneCall,
  Scale,
  Lock,
  ShieldAlert,
} from 'lucide-react';

export const Footer: React.FC = () => {
  return (
    <footer className="border-t-2 border-[#4A69B3]/40 bg-white mt-16 text-xs text-[#2E3E6E]">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
        <div className="grid grid-cols-1 md:grid-cols-12 gap-8 items-start text-left">
          {/* Kolom 1: Brand & Purpose (4 cols) */}
          <div className="md:col-span-4 space-y-3">
            <div className="flex items-center gap-2.5">
              <div className="w-7 h-7 rounded-xl bg-[#BA3801] text-white font-bold flex items-center justify-center text-xs shadow-xs">
                P
              </div>
              <span className="font-extrabold text-base tracking-tight text-[#1E2C4F]">PELITA</span>
              <span className="text-[10px] font-mono font-bold bg-[#FFEC89] border border-[#1E2C4F] text-[#1E2C4F] px-2 py-0.5 rounded">
                Advokasi Finansial
              </span>
            </div>
            <p className="text-xs text-[#2E3E6E] leading-relaxed max-w-sm font-medium">
              Platform independen advokasi konsumen dan audit kepatuhan pinjaman online berbasis regulasi POJK No. 10/2022, POJK No. 22/2023, SEOJK No. 19/2023, dan UU PDP No. 27/2022.
            </p>
            <div className="flex items-center gap-2 text-[11px] font-bold text-emerald-950 bg-emerald-50 px-3 py-1 rounded-full border-2 border-emerald-400 w-fit">
              <ShieldCheck className="w-3.5 h-3.5 text-emerald-700" />
              <span>Privasi Terlindungi &amp; Bebas Pelacak Komersial</span>
            </div>
          </div>

          {/* Kolom 2: Fitur Publik Explorer (4 cols) */}
          <div className="md:col-span-4 space-y-2.5">
            <span className="font-mono text-xs font-bold uppercase tracking-wider text-[#1E2C4F] block">
              Pusat Eksplorasi Publik
            </span>
            <div className="grid grid-cols-2 gap-2 text-xs font-semibold">
              <Link to="/radar" className="hover:text-[#BA3801] transition-colors p-2 rounded-xl bg-slate-50 border border-slate-200">
                Radar Entitas OJK
              </Link>
              <Link to="/calculator" className="hover:text-[#BA3801] transition-colors p-2 rounded-xl bg-slate-50 border border-slate-200">
                Kalkulator Bunga
              </Link>
              <Link to="/stats" className="hover:text-[#BA3801] transition-colors p-2 rounded-xl bg-slate-50 border border-slate-200">
                Peta Teror Nasional
              </Link>
              <Link to="/regulations" className="hover:text-[#BA3801] transition-colors p-2 rounded-xl bg-slate-50 border border-slate-200">
                Korpus Regulasi
              </Link>
              <Link to="/literacy" className="hover:text-[#BA3801] transition-colors p-2 rounded-xl bg-slate-50 border border-slate-200 col-span-2">
                Modul Literasi &amp; Kuis Interaktif
              </Link>
            </div>
          </div>

          {/* Kolom 3: Direktori Pengaduan Resmi (4 cols) */}
          <div className="md:col-span-4 space-y-2.5">
            <span className="font-mono text-xs font-bold uppercase tracking-wider text-[#1E2C4F] block">
              Kanal Resmi Pengaduan RI
            </span>
            <div className="space-y-2 text-[11px] font-mono">
              <div className="p-2 bg-white rounded-xl border border-slate-200 flex justify-between items-center shadow-2xs">
                <span className="font-bold text-[#1E2C4F] flex items-center gap-1.5">
                  <PhoneCall className="w-3.5 h-3.5 text-[#BA3801]" />
                  <span>Kontak OJK 157</span>
                </span>
                <span className="text-[#2E3E6E]">157 / WA 081-157-157-157</span>
              </div>
              <div className="p-2 bg-white rounded-xl border border-slate-200 flex justify-between items-center shadow-2xs">
                <span className="font-bold text-[#1E2C4F] flex items-center gap-1.5">
                  <Scale className="w-3.5 h-3.5 text-[#BA3801]" />
                  <span>Posko AFPI</span>
                </span>
                <span className="text-[#2E3E6E]">150 505</span>
              </div>
              <div className="p-2 bg-white rounded-xl border border-slate-200 flex justify-between items-center shadow-2xs">
                <span className="font-bold text-[#1E2C4F] flex items-center gap-1.5">
                  <ShieldAlert className="w-3.5 h-3.5 text-[#BA3801]" />
                  <span>Siber Polri</span>
                </span>
                <span className="text-[#2E3E6E]">patrolisiber.id / 110</span>
              </div>
            </div>
          </div>
        </div>

        {/* Bottom Bar Compact */}
        <div className="border-t-2 border-[#4A69B3]/25 mt-8 pt-5 flex flex-col sm:flex-row items-center justify-between gap-3 text-[11px] font-mono text-[#2E3E6E]">
          <div>
            &copy; {new Date().getFullYear()} Pelita Platform. Sifat: Zero-Auto-Submission (Pelaporan mandiri oleh pengguna).
          </div>
          <div className="flex items-center gap-2 text-emerald-950 font-bold">
            <Lock className="w-3 h-3 text-emerald-700" />
            <span>Right to Erasure Terjamin (UU PDP No. 27/2022)</span>
          </div>
        </div>
      </div>
    </footer>
  );
};
