import React, { useState } from 'react';
import { NavLink, Link, useNavigate } from 'react-router-dom';
import {
  ScanLine,
  Fingerprint,
  BrainCircuit,
  GraduationCap,
  Globe,
  Lock,
  LogOut,
  User,
  ChevronLeft,
  ChevronRight,
  Activity,
  CheckCircle2,
} from 'lucide-react';
import { performLogout } from '../../lib/firebase';
import { useEvidenceCases } from '../../hooks/useEvidence';
import { PelitaLogo } from '../brand/PelitaLogo';

interface DashboardSidebarProps {
  isOpen: boolean;
  onClose?: () => void;
  isCollapsed: boolean;
  onToggleCollapse: () => void;
}

export const DashboardSidebar: React.FC<DashboardSidebarProps> = ({
  isOpen,
  onClose,
  isCollapsed,
  onToggleCollapse,
}) => {
  const navigate = useNavigate();
  const userName = localStorage.getItem('pelita_user_name') || 'Pengguna';
  const { data: cases = [] } = useEvidenceCases();
  const [hoveredItem, setHoveredItem] = useState<string | null>(null);

  const handleLogout = async () => {
    await performLogout();
    navigate('/');
  };

  const investigationItems = [
    {
      to: '/scanner',
      label: 'Pemindai Kontrak',
      desc: 'Audit Kepatuhan Bunga & Izin POJK',
      icon: ScanLine,
      badge: 'Preventif',
    },
    {
      to: '/evidence',
      label: 'Penyusun Bukti',
      desc: 'Rekonstruksi Intimidasi Chat',
      icon: Fingerprint,
      badge: 'Kuratif',
    },
    {
      to: '/assistant',
      label: 'Asisten Pelaporan',
      desc: 'RAG AI & Generator Draf Surat',
      icon: BrainCircuit,
      badge: 'Yuridis',
    },
  ];

  return (
    <>
      {isOpen && (
        <div
          className="fixed inset-0 bg-slate-900/20 backdrop-blur-xs z-40 lg:hidden"
          onClick={onClose}
        />
      )}

      <aside
        className={`fixed top-3.5 bottom-3.5 left-3.5 bg-white/95 backdrop-blur-2xl rounded-3xl border border-slate-200/70 z-50 flex flex-col justify-between transition-all duration-300 ease-in-out lg:translate-x-0 ${
          isOpen ? 'translate-x-0' : '-translate-x-[calc(100%+16px)]'
        } ${isCollapsed ? 'lg:w-[72px]' : 'lg:w-72'} w-72 shadow-xl shadow-slate-900/5`}
      >
        {/* Centered Pin Toggle */}
        <button
          type="button"
          onClick={onToggleCollapse}
          className="absolute -right-3 top-1/2 -translate-y-1/2 z-50 hidden lg:flex items-center justify-center w-6 h-6 rounded-full bg-white border border-slate-200/80 text-slate-400 hover:text-slate-800 hover:border-slate-300 shadow-sm hover:scale-110 active:scale-95 transition-all duration-150"
          title={isCollapsed ? 'Perluas Navigasi' : 'Ciutkan Navigasi'}
          aria-label={isCollapsed ? 'Perluas Navigasi' : 'Ciutkan Navigasi'}
        >
          {isCollapsed ? (
            <ChevronRight className="w-3.5 h-3.5 text-[#BA3801]" />
          ) : (
            <ChevronLeft className="w-3.5 h-3.5 text-[#BA3801]" />
          )}
        </button>

        {/* Brand Header */}
        <div className={`transition-all ${isCollapsed ? 'p-3 text-center border-b border-transparent' : 'p-4 space-y-3 border-b border-slate-100'}`}>
          <div className={`flex items-center ${isCollapsed ? 'justify-center' : 'justify-between'}`}>
            <Link to="/" className="flex items-center gap-2.5 group">
              {isCollapsed ? (
                <PelitaLogo size="sm" variant="icon" className="group-hover:scale-105 transition-transform duration-150" />
              ) : (
                <PelitaLogo size="md" variant="horizontal" className="group-hover:scale-102 transition-transform duration-150" />
              )}
            </Link>
          </div>

          {!isCollapsed && (
            <div className="px-3 py-2 bg-slate-50/80 rounded-2xl border border-slate-200/50 flex items-center justify-between text-xs">
              <div className="flex items-center gap-2 font-mono text-[10px] font-medium text-slate-700">
                <Lock className="w-3.5 h-3.5 text-emerald-600" />
                <span>Enkripsi Sisi Klien Aktif</span>
              </div>
              <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
            </div>
          )}
        </div>

        {/* Nav Items List */}
        <div className={`flex-1 overflow-y-auto ${isCollapsed ? 'p-2 space-y-2' : 'p-3.5 space-y-6'}`}>
          <div className="space-y-1">
            {!isCollapsed && (
              <span className="text-[10px] font-semibold uppercase tracking-wider text-slate-400 px-3 block mb-2">
                Modul Investigasi
              </span>
            )}

            {investigationItems.map((item) => {
              const Icon = item.icon;
              return (
                <div
                  key={item.to}
                  className="relative"
                  onMouseEnter={() => setHoveredItem(item.to)}
                  onMouseLeave={() => setHoveredItem(null)}
                >
                  <NavLink
                    to={item.to}
                    onClick={onClose}
                    className={({ isActive }) =>
                      `group flex items-center rounded-2xl transition-all duration-150 text-xs relative ${
                        isCollapsed ? 'justify-center p-2.5' : 'items-start gap-3 px-3 py-2.5'
                      } ${
                        isActive
                          ? 'bg-[#1E2C4F] text-white font-medium shadow-2xs'
                          : 'text-slate-700 hover:bg-[#BA3801]/8 hover:text-[#1E2C4F] font-normal'
                      }`
                    }
                  >
                    {({ isActive }) => (
                      <>
                        <div
                          className={`w-7 h-7 rounded-xl flex items-center justify-center shrink-0 transition-colors ${
                            isActive
                              ? 'bg-[#BA3801] text-white'
                              : 'bg-slate-100 text-[#1E2C4F] group-hover:bg-[#BA3801]/15 group-hover:text-[#BA3801]'
                          }`}
                        >
                          <Icon className="w-4 h-4" />
                        </div>
                        {!isCollapsed && (
                          <div className="flex-1 min-w-0">
                            <div className="flex items-center justify-between gap-1">
                              <span className="font-semibold truncate text-xs">{item.label}</span>
                              <span
                                className={`text-[9px] font-mono font-semibold uppercase px-1.5 py-0.2 rounded-full ${
                                  isActive ? 'bg-[#BA3801] text-white' : 'bg-slate-100 text-slate-500'
                                }`}
                              >
                                {item.badge}
                              </span>
                            </div>
                            <p
                              className={`text-[10px] truncate font-normal mt-0.5 ${
                                isActive ? 'text-slate-300' : 'text-slate-400'
                              }`}
                            >
                              {item.desc}
                            </p>
                          </div>
                        )}
                      </>
                    )}
                  </NavLink>

                  {/* Popover Tooltip in Collapsed Mode */}
                  {isCollapsed && hoveredItem === item.to && (
                    <div className="absolute left-full top-1/2 -translate-y-1/2 ml-3 z-50 pointer-events-none animate-fadeIn">
                      <div className="bg-[#1E2C4F] text-white px-3 py-1.5 rounded-xl shadow-xl border border-slate-700 whitespace-nowrap flex items-center gap-2">
                        <span className="font-semibold text-xs">{item.label}</span>
                        <span className="text-[9px] font-mono font-semibold uppercase bg-[#BA3801] text-white px-1.5 py-0.2 rounded-full">
                          {item.badge}
                        </span>
                      </div>
                    </div>
                  )}
                </div>
              );
            })}
          </div>

          {/* Quick Case Summary - Hidden in Collapsed Mode */}
          {!isCollapsed && (
            <div className="p-3.5 bg-slate-50/80 rounded-2xl border border-slate-200/50 space-y-2.5">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-1.5 font-mono text-[10px] font-semibold text-slate-500 uppercase tracking-wider">
                  <Activity className="w-3.5 h-3.5 text-[#BA3801]" />
                  <span>Ringkasan Kasus</span>
                </div>
                <span className="text-[9px] font-mono font-semibold text-emerald-800 bg-emerald-50 px-2 py-0.5 rounded-full border border-emerald-200/60">
                  Aktif
                </span>
              </div>
              <div className="grid grid-cols-2 gap-2 text-center">
                <div className="p-2 bg-white rounded-xl border border-slate-200/50 shadow-2xs">
                  <span className="text-sm font-semibold text-slate-800 font-mono block leading-tight">
                    {cases.length}
                  </span>
                  <span className="text-[9px] text-slate-400 font-medium block mt-0.5">Berkas Kasus</span>
                </div>
                <div className="p-2 bg-white rounded-xl border border-slate-200/50 shadow-2xs">
                  <span className="text-sm font-semibold text-emerald-700 font-mono block leading-tight flex items-center justify-center gap-0.5">
                    <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" />
                    100%
                  </span>
                  <span className="text-[9px] text-slate-400 font-medium block mt-0.5">UU PDP</span>
                </div>
              </div>
            </div>
          )}

          {/* Education & Public Home Links */}
          <div className={`space-y-1 ${!isCollapsed ? 'pt-2 border-t border-slate-100' : 'pt-1 border-t border-slate-100/60'}`}>
            {!isCollapsed && (
              <span className="text-[10px] font-semibold uppercase tracking-wider text-slate-400 px-3 block mb-2">
                Edukasi &amp; Beranda
              </span>
            )}

            <div
              className="relative"
              onMouseEnter={() => setHoveredItem('/literacy')}
              onMouseLeave={() => setHoveredItem(null)}
            >
              <Link
                to="/literacy"
                onClick={onClose}
                className={`flex items-center rounded-2xl text-slate-700 hover:bg-[#BA3801]/8 hover:text-[#1E2C4F] text-xs font-normal transition-all duration-150 ${
                  isCollapsed ? 'justify-center p-2.5' : 'justify-between px-3 py-2.5'
                }`}
              >
                <div className="flex items-center gap-2.5">
                  <div className="w-7 h-7 rounded-xl bg-amber-50 text-amber-700 flex items-center justify-center shrink-0">
                    <GraduationCap className="w-4 h-4" />
                  </div>
                  {!isCollapsed && <span className="font-semibold text-xs">Literasi Mikro</span>}
                </div>
                {!isCollapsed && (
                  <span className="text-[9px] font-mono font-semibold text-amber-800 bg-amber-50 px-2 py-0.5 rounded-full border border-amber-200/60">
                    Kuis
                  </span>
                )}
              </Link>
              {isCollapsed && hoveredItem === '/literacy' && (
                <div className="absolute left-full top-1/2 -translate-y-1/2 ml-3 z-50 pointer-events-none animate-fadeIn">
                  <div className="bg-[#1E2C4F] text-white px-3 py-1.5 rounded-xl shadow-xl border border-slate-700 whitespace-nowrap">
                    <span className="font-semibold text-xs">Modul Literasi Mikro &amp; Kuis</span>
                  </div>
                </div>
              )}
            </div>

            <div
              className="relative"
              onMouseEnter={() => setHoveredItem('/')}
              onMouseLeave={() => setHoveredItem(null)}
            >
              <Link
                to="/"
                onClick={onClose}
                className={`flex items-center rounded-2xl text-slate-700 hover:bg-[#BA3801]/8 hover:text-[#1E2C4F] text-xs font-normal transition-all duration-150 ${
                  isCollapsed ? 'justify-center p-2.5' : 'justify-between px-3 py-2.5'
                }`}
              >
                <div className="flex items-center gap-2.5">
                  <div className="w-7 h-7 rounded-xl bg-slate-100 text-slate-600 flex items-center justify-center shrink-0">
                    <Globe className="w-4 h-4" />
                  </div>
                  {!isCollapsed && <span className="font-semibold text-xs">Beranda Publik</span>}
                </div>
              </Link>
              {isCollapsed && hoveredItem === '/' && (
                <div className="absolute left-full top-1/2 -translate-y-1/2 ml-3 z-50 pointer-events-none animate-fadeIn">
                  <div className="bg-[#1E2C4F] text-white px-3 py-1.5 rounded-xl shadow-xl border border-slate-700 whitespace-nowrap">
                    <span className="font-semibold text-xs">Kembali ke Beranda Publik</span>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>

        {/* User Session Bar */}
        <div className={`border-t border-slate-100 bg-white/50 rounded-b-3xl ${isCollapsed ? 'p-2 space-y-2' : 'p-3.5 space-y-2'}`}>
          {!isCollapsed ? (
            <div className="flex items-center justify-between gap-2 p-2.5 bg-slate-50/80 rounded-2xl border border-slate-200/50">
              <div className="flex items-center gap-2.5 min-w-0">
                <div className="w-7 h-7 rounded-full bg-[#BA3801] text-white flex items-center justify-center font-semibold text-xs shrink-0 shadow-2xs">
                  <User className="w-3.5 h-3.5" />
                </div>
                <div className="min-w-0">
                  <span className="text-xs font-semibold text-slate-800 block truncate">{userName}</span>
                  <span className="text-[9px] font-mono text-emerald-700 font-medium block">Sesi Terverifikasi</span>
                </div>
              </div>

              <button
                type="button"
                onClick={handleLogout}
                className="p-1.5 rounded-full text-slate-400 hover:text-rose-600 hover:bg-rose-50 transition-colors shrink-0 active:scale-95"
                title="Keluar Sesi"
                aria-label="Keluar Sesi"
              >
                <LogOut className="w-3.5 h-3.5" />
              </button>
            </div>
          ) : (
            <div className="flex flex-col items-center gap-1.5">
              <div
                className="w-7 h-7 rounded-full bg-[#BA3801] text-white flex items-center justify-center font-semibold text-xs shrink-0 shadow-2xs"
                title={userName}
              >
                <User className="w-3.5 h-3.5" />
              </div>
              <button
                type="button"
                onClick={handleLogout}
                className="p-1.5 rounded-full text-slate-400 hover:text-rose-600 hover:bg-rose-50 transition-colors active:scale-95"
                title="Keluar Sesi"
                aria-label="Keluar Sesi"
              >
                <LogOut className="w-3.5 h-3.5" />
              </button>
            </div>
          )}

          {!isCollapsed && (
            <div className="text-[9px] font-mono text-slate-400 text-center font-normal">
              POJK No. 10/2022 : UU PDP 27/2022
            </div>
          )}
        </div>
      </aside>
    </>
  );
};
