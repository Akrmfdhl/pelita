import React from 'react';
import { Link } from 'react-router-dom';
import {
  Lock,
  PhoneCall,
  Scale,
  ShieldCheck,
  Activity,
  Server,
  Plus,
} from 'lucide-react';

export const BentoShowcaseSection: React.FC = () => {
  return (
    <section className="max-w-6xl mx-auto px-4">
      <div className="grid grid-cols-1 md:grid-cols-12 gap-6 items-stretch">
        <div className="md:col-span-6 bg-white border border-slate-200/80 rounded-2xl p-6 sm:p-8 flex flex-col justify-between relative overflow-hidden group">
          <div className="space-y-2.5">
            <span className="text-[10px] font-mono uppercase tracking-wider text-[#BA3801] font-semibold block">
              Rekonstruksi Bukti Digital
            </span>
            <h2 className="text-2xl sm:text-3xl font-semibold text-[#1E2C4F] tracking-tight">
              Rekonstruksi Bukti Berkecepatan Tinggi
            </h2>
            <p className="text-sm text-[#2E3E6E] leading-relaxed font-normal">
              Ekstrak otomatis transkrip pesan intimidasi dan tandai pasal pelanggaran hukum positif dalam hitungan detik.
            </p>
          </div>

          <div className="relative my-6 rounded-xl overflow-hidden border border-slate-200/60 shadow-[0_10px_30px_rgba(0,0,0,0.10)]">
            <img
              src="/assets/images/hero-shield.jpg"
              alt="Matriks Perlindungan Hukum dan Bukti Digital"
              className="w-full h-52 object-cover group-hover:scale-105 transition-transform duration-500"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-[#1E2C4F] via-[#1E2C4F]/20 to-transparent flex items-end p-4">
              <div className="flex flex-wrap gap-1.5">
                <div className="bg-white/95 backdrop-blur-xs px-2.5 py-1 rounded-md text-[10px] font-mono font-semibold text-emerald-950 flex items-center gap-1.5 border border-slate-200/60 shadow-2xs">
                  <span className="w-1.5 h-1.5 rounded-full bg-emerald-600" />
                  WhatsApp
                </div>
                <div className="bg-white/95 backdrop-blur-xs px-2.5 py-1 rounded-md text-[10px] font-mono font-semibold text-[#1E2C4F] flex items-center gap-1.5 border border-slate-200/60 shadow-2xs">
                  <PhoneCall className="w-3 h-3 text-[#4A69B3]" />
                  OJK 157
                </div>
                <div className="bg-white/95 backdrop-blur-xs px-2.5 py-1 rounded-md text-[10px] font-mono font-semibold text-[#1E2C4F] flex items-center gap-1.5 border border-slate-200/60 shadow-2xs">
                  <Scale className="w-3 h-3 text-[#BA3801]" />
                  Posko AFPI
                </div>
                <div className="bg-white/95 backdrop-blur-xs px-2.5 py-1 rounded-md text-[10px] font-mono font-semibold text-rose-950 flex items-center gap-1.5 border border-slate-200/60 shadow-2xs">
                  <ShieldCheck className="w-3 h-3 text-rose-700" />
                  SPKT Polri
                </div>
              </div>
            </div>
          </div>

          <div className="pt-3 border-t border-slate-100 flex items-center justify-between text-xs font-mono text-[#2E3E6E]">
            <span className="flex items-center gap-1.5 font-semibold text-[#1E2C4F]">
              <Lock className="w-3.5 h-3.5 text-emerald-600" />
              Enkripsi Sisi Server AES-256
            </span>
            <span className="text-[#BA3801] font-semibold">Siap Diekspor Berkas</span>
          </div>
        </div>

        <div className="md:col-span-6 flex flex-col justify-between gap-6">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
            <div className="bg-[#1E2C4F] text-white rounded-2xl p-6 flex flex-col justify-between space-y-4 shadow-sm">
              <div className="space-y-1">
                <span className="text-4xl sm:text-5xl font-semibold text-[#FFEC89] tracking-tight font-mono">10X</span>
                <p className="text-xs text-blue-100 leading-relaxed font-normal">
                  Akselerasi analisis kepatuhan kontrak pinjol vs verifikasi manual.
                </p>
              </div>
              <div className="text-[10px] font-mono text-slate-300 pt-2 border-t border-white/10 font-semibold">
                POJK No. 10/2022 &amp; 22/2023
              </div>
            </div>

            <div className="bg-white border border-slate-200/80 rounded-2xl p-6 flex flex-col items-center justify-center text-center space-y-3 relative overflow-hidden">
              <div className="w-14 h-14 rounded-2xl bg-amber-50 border border-amber-200/80 flex items-center justify-center">
                <Activity className="w-6 h-6 text-[#BA3801]" />
              </div>
              <div className="space-y-0.5">
                <span className="font-semibold text-sm text-[#1E2C4F] block">Mesin Aturan Aktif</span>
                <p className="text-[11px] font-normal text-[#2E3E6E]">Deteksi Pelanggaran 0.3% / Hari</p>
              </div>
            </div>
          </div>

          <div className="bg-white border border-slate-200/80 rounded-2xl p-6 sm:p-7 flex flex-col justify-between space-y-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Server className="w-4 h-4 text-[#4A69B3]" />
                <span className="font-mono text-xs font-semibold text-[#1E2C4F]">Terminal Berkas Terenkripsi</span>
              </div>
              <div className="flex items-center gap-1.5 text-[10px] font-mono font-semibold text-emerald-900 bg-emerald-50 border border-emerald-200 px-2 py-0.5 rounded-md">
                <span className="w-1.5 h-1.5 rounded-full bg-emerald-600 animate-pulse" />
                <span>Sistem Siap</span>
              </div>
            </div>

            <div className="p-3.5 bg-[#FFFDE8] rounded-xl border border-slate-200/70 font-mono text-xs space-y-1 text-[#1E2C4F]">
              <div className="flex items-center justify-between text-[11px]">
                <span>Modul: Legal Clause Validator</span>
                <span className="text-[#BA3801] font-semibold">v2.4.0</span>
              </div>
              <div className="text-[11px] font-semibold">
                &gt; Memindai parameter: Bunga 0.8%, Admin 25%, Izin Kontak...
              </div>
            </div>

            <div className="flex items-center justify-between pt-1">
              <Link
                to="/evidence"
                className="inline-flex items-center gap-1.5 bg-[#BA3801] hover:bg-[#9A2E01] text-white font-semibold px-4 py-2 rounded-full text-xs transition-all duration-150 active:scale-95 shadow-2xs"
              >
                <Plus className="w-3.5 h-3.5" />
                <span>Tambah Kasus Aduan</span>
              </Link>
              <span className="text-[11px] font-mono text-[#2E3E6E] font-normal">Bebas Pelacak Komersial</span>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};
