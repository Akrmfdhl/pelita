import React from 'react';
import { Link } from 'react-router-dom';

export const CtaBannerSection: React.FC = () => {
  return (
    <section className="max-w-5xl mx-auto px-4">
      <div className="bg-[#1E2C4F] text-white rounded-2xl p-8 sm:p-14 text-center space-y-6 shadow-sm relative overflow-hidden">
        <span className="text-xs font-mono uppercase tracking-wider text-[#FFEC89] font-semibold block">
          Akses Perlindungan Konsumen Terbuka
        </span>
        <h2 className="text-3xl sm:text-5xl font-semibold tracking-tight text-white max-w-3xl mx-auto leading-tight">
          Lindungi Data Pribadi dan Hak Finansial Anda Sekarang.
        </h2>
        <p className="text-[17px] text-blue-100 max-w-xl mx-auto leading-[1.47] font-normal">
          Tanpa biaya, terenkripsi aman di sisi server dengan AES-256-GCM, dan berlandaskan hukum positif Republik Indonesia.
        </p>
        <div className="pt-3 flex flex-col sm:flex-row items-center justify-center gap-3.5">
          <Link
            to="/scanner"
            className="w-full sm:w-auto bg-[#BA3801] hover:bg-[#9A2E01] text-white font-semibold px-8 py-3.5 rounded-full text-sm transition-all duration-150 active:scale-95 shadow-sm"
          >
            Mulai Audit Kontrak
          </Link>
          <Link
            to="/register"
            className="w-full sm:w-auto bg-white hover:bg-slate-50 text-[#1E2C4F] px-8 py-3.5 rounded-full text-sm font-semibold transition-all duration-150 active:scale-95 shadow-2xs"
          >
            Buat Akun Terlindungi
          </Link>
        </div>
      </div>
    </section>
  );
};
