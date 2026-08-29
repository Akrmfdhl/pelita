import React from 'react';
import { useLocation, Link } from 'react-router-dom';
import {
  Menu,
  ExternalLink,
  User,
  ChevronRight,
  Database,
} from 'lucide-react';

interface DashboardTopbarProps {
  onToggleSidebar: () => void;
}

export const DashboardTopbar: React.FC<DashboardTopbarProps> = ({ onToggleSidebar }) => {
  const location = useLocation();
  const userName = localStorage.getItem('pelita_user_name') || 'Pengguna';

  const getPageDetails = () => {
    switch (location.pathname) {
      case '/scanner':
        return {
          title: 'Pemindai Kontrak & T&C Pinjaman',
          subtitle: 'Audit Kepatuhan Bunga & Izin Akses POJK',
          moduleCategory: 'Audit Preventif',
          breadcrumb: 'Pemindai Kontrak',
        };
      case '/evidence':
        return {
          title: 'Penyusun Bukti & Kronologi Intimidasi',
          subtitle: 'Rekonstruksi Pesan Teror Chat Terenkripsi AES-256',
          moduleCategory: 'Advokasi Kuratif',
          breadcrumb: 'Penyusun Bukti',
        };
      case '/assistant':
        return {
          title: 'Asisten Advokasi & Pembuat Draf Aduan',
          subtitle: 'Konsultasi Yuridis RAG pgvector & Generator Surat Resmi',
          moduleCategory: 'Konsultasi Yuridis',
          breadcrumb: 'Asisten Pelaporan',
        };
      default:
        return {
          title: 'Dashboard Investigasi Integritas',
          subtitle: 'Pusat Advokasi & Perlindungan Konsumen Pinjol',
          moduleCategory: 'Area CMS',
          breadcrumb: 'Ikhtisar',
        };
    }
  };

  const { title, subtitle, moduleCategory, breadcrumb } = getPageDetails();

  return (
    <header className="sticky top-3 z-30 mx-3 sm:mx-6 lg:mx-8 mb-4 bg-white/95 backdrop-blur-md rounded-2xl border border-slate-200/80 px-4 sm:px-6 py-2.5 flex items-center justify-between gap-4 shadow-xl shadow-slate-900/5 transition-all">
      <div className="flex items-center gap-3">
        <button
          type="button"
          onClick={onToggleSidebar}
          className="tactile-btn p-1.5 rounded-xl border border-slate-200 text-slate-700 hover:bg-slate-50 lg:hidden"
          title="Buka Navigasi"
          aria-label="Buka Navigasi"
        >
          <Menu className="w-4 h-4" />
        </button>

        <div className="space-y-0.5">
          <div className="flex items-center gap-1.5 text-[10px] font-mono text-slate-400">
            <span className="font-semibold text-slate-600">CMS</span>
            <ChevronRight className="w-3 h-3 text-slate-300" />
            <span className="text-[#BA3801] font-semibold">{moduleCategory}</span>
            <ChevronRight className="w-3 h-3 text-slate-300" />
            <span className="text-slate-800 font-semibold truncate max-w-[120px] sm:max-w-none">{breadcrumb}</span>
          </div>

          <div className="flex items-center gap-2">
            <h1 className="text-sm sm:text-base font-bold text-[#1E2C4F] tracking-tight truncate max-w-[200px] sm:max-w-md">
              {title}
            </h1>
          </div>
          <p className="text-[11px] text-slate-500 font-medium hidden md:block">
            {subtitle}
          </p>
        </div>
      </div>

      <div className="flex items-center gap-2 sm:gap-3">
        <div className="hidden sm:flex items-center gap-2 px-2.5 py-1 rounded-xl bg-emerald-50 text-[11px] font-mono font-semibold text-emerald-900 border border-emerald-200/80 shadow-2xs">
          <Database className="w-3 h-3 text-emerald-700" />
          <span className="w-1.5 h-1.5 rounded-full bg-emerald-600 animate-pulse" />
          <span>RAG pgvector Online</span>
        </div>

        <Link
          to="/"
          className="tactile-btn hidden sm:flex items-center gap-1.5 text-xs font-mono font-semibold text-slate-700 hover:text-[#BA3801] px-3 py-1.5 rounded-xl border border-slate-200 bg-white hover:bg-slate-50 transition-all shadow-2xs"
        >
          <span>Beranda Publik</span>
          <ExternalLink className="w-3 h-3 text-slate-400" />
        </Link>

        <div className="flex items-center gap-2 pl-2 border-l border-slate-200">
          <div className="w-7 h-7 rounded-full bg-[#BA3801] text-white flex items-center justify-center font-bold text-xs shadow-2xs">
            <User className="w-3.5 h-3.5" />
          </div>
          <span className="text-xs font-bold text-[#1E2C4F] hidden sm:block max-w-[100px] truncate">
            {userName}
          </span>
        </div>
      </div>
    </header>
  );
};
