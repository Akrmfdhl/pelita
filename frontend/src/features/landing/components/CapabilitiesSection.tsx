import React from 'react';
import { Link } from 'react-router-dom';
import {
  FileCheck,
  ShieldAlert,
  BrainCircuit,
  BookOpen,
  Database,
} from 'lucide-react';

export const CapabilitiesSection: React.FC = () => {
  return (
    <section className="max-w-6xl mx-auto px-4 space-y-8">
      <div className="text-center max-w-2xl mx-auto space-y-2.5">
        <span className="text-xs font-mono uppercase tracking-wider text-[#BA3801] font-semibold bg-white px-3.5 py-1 rounded-full border border-slate-200/90 shadow-2xs">
          FITUR UTAMA ADVOKASI
        </span>
        <h2 className="text-3xl sm:text-4xl font-semibold text-[#1E2C4F] tracking-tight">
          Instrumen Cerdas untuk <span className="text-[#BA3801]">Mengamankan Hak Finansial</span> Anda
        </h2>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="bg-white border border-slate-200/80 rounded-2xl overflow-hidden flex flex-col justify-between group">
          <div className="p-6 sm:p-7 space-y-2.5">
            <div className="flex items-center justify-between">
              <span className="text-[10px] font-mono uppercase tracking-wider text-[#BA3801] font-semibold">
                MODUL 01: AUDIT PREVENTIF
              </span>
              <span className="text-xs font-mono text-emerald-900 bg-emerald-50 px-2.5 py-0.5 rounded-full border border-emerald-200 font-semibold">
                POJK No. 10/2022
              </span>
            </div>
            <h3 className="text-xl sm:text-2xl font-semibold text-[#1E2C4F]">
              Pemindai Dokumen Kontrak &amp; T&amp;C
            </h3>
            <p className="text-sm text-[#2E3E6E] leading-relaxed font-normal">
              Pemeriksaan otomatis pada draf perjanjian pinjaman untuk mendeteksi bunga melampaui plafon 0.3%/hari, denda tersembunyi, dan izin akses perangkat ilegal.
            </p>
          </div>
          <div className="relative border-t border-slate-100 overflow-hidden">
            <img
              src="/assets/images/contract-scanner.jpg"
              alt="Audit Kontrak Pinjol"
              className="w-full h-56 object-cover group-hover:scale-105 transition-transform duration-500"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-[#1E2C4F] via-transparent to-transparent flex items-end p-5">
              <Link
                to="/scanner"
                className="inline-flex items-center gap-2 bg-white hover:bg-slate-50 text-[#1E2C4F] font-semibold px-4 py-2 rounded-full text-xs shadow-sm active:scale-95 transition-transform"
              >
                <FileCheck className="w-4 h-4 text-[#BA3801]" />
                <span>Buka Pemindai Kontrak</span>
              </Link>
            </div>
          </div>
        </div>

        <div className="bg-white border border-slate-200/80 rounded-2xl overflow-hidden flex flex-col justify-between group">
          <div className="p-6 sm:p-7 space-y-2.5">
            <div className="flex items-center justify-between">
              <span className="text-[10px] font-mono uppercase tracking-wider text-[#BA3801] font-semibold">
                MODUL 02: ADVOKASI KURATIF
              </span>
              <span className="text-xs font-mono text-rose-900 bg-rose-50 px-2.5 py-0.5 rounded-full border border-rose-200 font-semibold">
                UU PDP No. 27/2022
              </span>
            </div>
            <h3 className="text-xl sm:text-2xl font-semibold text-[#1E2C4F]">
              Penyusun Berkas Bukti &amp; Draf Pengaduan
            </h3>
            <p className="text-sm text-[#2E3E6E] leading-relaxed font-normal">
              Rekonstruksi kronologis pesan WhatsApp/SMS ancaman debt collector, penandaan jam teror ilegal di luar batas 08.00-20.00, dan ekspor draf surat aduan OJK 157.
            </p>
          </div>
          <div className="relative border-t border-slate-100 overflow-hidden">
            <img
              src="/assets/images/evidence-dossier.jpg"
              alt="Penyusun Berkas Bukti Teror"
              className="w-full h-56 object-cover group-hover:scale-105 transition-transform duration-500"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-[#1E2C4F] via-transparent to-transparent flex items-end p-5">
              <Link
                to="/evidence"
                className="inline-flex items-center gap-2 bg-white hover:bg-slate-50 text-[#1E2C4F] font-semibold px-4 py-2 rounded-full text-xs shadow-sm active:scale-95 transition-transform"
              >
                <ShieldAlert className="w-4 h-4 text-rose-600" />
                <span>Buka Penyusun Bukti</span>
              </Link>
            </div>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
        <div className="bg-white border border-slate-200/80 rounded-2xl p-6 space-y-3 flex flex-col justify-between">
          <div className="space-y-2">
            <div className="w-10 h-10 rounded-xl bg-orange-50 text-[#BA3801] flex items-center justify-center">
              <BrainCircuit className="w-5 h-5" />
            </div>
            <h4 className="font-semibold text-base text-[#1E2C4F]">Asisten Advokasi Regulasi</h4>
            <p className="text-xs text-[#2E3E6E] leading-relaxed font-normal">
              Konsultasi percakapan hukum terikat pasal KUHP 368/369, UU ITE, dan POJK tanpa rekayasa fakta.
            </p>
          </div>
          <Link to="/assistant" className="text-xs font-mono text-[#BA3801] font-semibold hover:underline flex items-center gap-1">
            Konsultasi Sekarang &rarr;
          </Link>
        </div>

        <div className="bg-white border border-slate-200/80 rounded-2xl p-6 space-y-3 flex flex-col justify-between">
          <div className="space-y-2">
            <div className="w-10 h-10 rounded-xl bg-amber-50 text-amber-700 flex items-center justify-center">
              <BookOpen className="w-5 h-5" />
            </div>
            <h4 className="font-semibold text-base text-[#1E2C4F]">Literasi Mikro 2 Menit</h4>
            <p className="text-xs text-[#2E3E6E] leading-relaxed font-normal">
              Modul ringkas dan kuis interaktif untuk mengenali hak konsumen dan etika penagihan resmi.
            </p>
          </div>
          <Link to="/literacy" className="text-xs font-mono text-[#BA3801] font-semibold hover:underline flex items-center gap-1">
            Buka Modul Edukasi &rarr;
          </Link>
        </div>

        <div className="bg-white border border-slate-200/80 rounded-2xl p-6 space-y-3 flex flex-col justify-between">
          <div className="space-y-2">
            <div className="w-10 h-10 rounded-xl bg-emerald-50 text-emerald-700 flex items-center justify-center">
              <Database className="w-5 h-5" />
            </div>
            <h4 className="font-semibold text-base text-[#1E2C4F]">Enkripsi AES-256 &amp; Penghapusan</h4>
            <p className="text-xs text-[#2E3E6E] leading-relaxed font-normal">
              Penyimpanan bukti terlindungi enkripsi tingkat tinggi dengan hak pemusnahan berkas instan (Right to Erasure).
            </p>
          </div>
          <span className="text-[11px] font-mono text-emerald-900 font-semibold">Kepatuhan UU PDP Terjamin</span>
        </div>
      </div>
    </section>
  );
};
