import React from 'react';
import { Link } from 'react-router-dom';
import {
  ShieldCheck,
  PhoneCall,
  Scale,
  Building2,
  Lock,
  ExternalLink,
} from 'lucide-react';

export const Footer: React.FC = () => {
  return (
    <footer className="border-t-2 border-[#4A69B3]/40 bg-white mt-16 text-xs text-[#2E3E6E]">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
        <div className="grid grid-cols-1 md:grid-cols-12 gap-8 items-start">
          {/* Kolom 1: Brand & Purpose (5 cols) */}
          <div className="md:col-span-5 space-y-3">
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
              Platform independen advokasi konsumen dan audit kepatuhan pinjaman online berbasis regulasi POJK No. 10/2022, POJK No. 22/2023, dan UU PDP No. 27/2022.
            </p>
            <div className="flex items-center gap-2 text-[11px] font-bold text-emerald-950 bg-emerald-50 px-3 py-1 rounded-full border-2 border-emerald-400 w-fit">
              <ShieldCheck className="w-3.5 h-3.5 text-emerald-700" />
              <span>Privasi Terlindungi &amp; Bebas Pelacak Komersial</span>
            </div>
          </div>

          {/* Kolom 2: Kanal Resmi Pengaduan (4 cols) */}
          <div className="md:col-span-4 space-y-2.5">
            <span className="font-mono text-xs font-bold uppercase tracking-wider text-[#1E2C4F] block">
              Kanal Resmi Pengaduan Indonesia
            </span>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-[11px] font-mono">
              <div className="p-2.5 bg-white rounded-xl border-2 border-[#4A69B3]/40 space-y-0.5 shadow-2xs">
                <span className="font-bold text-[#1E2C4F] flex items-center gap-1">
                  <PhoneCall className="w-3 h-3 text-[#BA3801]" /> Kontak OJK 157
                </span>
                <span className="text-[#2E3E6E] text-[10px] block">Tel: 157 | WA: 081157157157</span>
              </div>
              <div className="p-2.5 bg-white rounded-xl border-2 border-[#4A69B3]/40 space-y-0.5 shadow-2xs">
                <span className="font-bold text-[#1E2C4F] flex items-center gap-1">
                  <Scale className="w-3 h-3 text-[#BA3801]" /> Posko AFPI
                </span>
                <span className="text-[#2E3E6E] text-[10px] block">Tel: 150 505</span>
              </div>
              <div className="p-2.5 bg-white rounded-xl border-2 border-[#4A69B3]/40 space-y-0.5 shadow-2xs sm:col-span-2">
                <span className="font-bold text-[#1E2C4F] flex items-center gap-1">
                  <Building2 className="w-3 h-3 text-[#BA3801]" /> Satgas PASTI OJK
                </span>
                <span className="text-[#2E3E6E] text-[10px] block">Email: waspadainvestasi@ojk.go.id</span>
              </div>
            </div>
          </div>

          {/* Kolom 3: Tautan Modul & Hak UU PDP (3 cols) */}
          <div className="md:col-span-3 space-y-2.5">
            <span className="font-mono text-xs font-bold uppercase tracking-wider text-[#1E2C4F] block">
              Navigasi &amp; Regulasi
            </span>
            <ul className="space-y-1.5 text-xs font-semibold">
              <li>
                <Link to="/literacy" className="hover:text-[#BA3801] transition-colors flex items-center justify-between">
                  <span>Modul Literasi Mikro</span>
                  <ExternalLink className="w-3 h-3 text-[#4A69B3]" />
                </Link>
              </li>
              <li>
                <Link to="/scanner" className="hover:text-[#BA3801] transition-colors flex items-center justify-between">
                  <span>Pemindai Kontrak (CMS)</span>
                  <ExternalLink className="w-3 h-3 text-[#4A69B3]" />
                </Link>
              </li>
              <li>
                <Link to="/evidence" className="hover:text-[#BA3801] transition-colors flex items-center justify-between">
                  <span>Penyusun Bukti Intimidasi</span>
                  <ExternalLink className="w-3 h-3 text-[#4A69B3]" />
                </Link>
              </li>
              <li>
                <Link to="/assistant" className="hover:text-[#BA3801] transition-colors flex items-center justify-between">
                  <span>Asisten Pelaporan RAG</span>
                  <ExternalLink className="w-3 h-3 text-[#4A69B3]" />
                </Link>
              </li>
            </ul>
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
