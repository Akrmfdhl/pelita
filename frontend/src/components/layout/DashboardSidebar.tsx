import React, { useState } from 'react';
import { NavLink, Link, useNavigate } from 'react-router-dom';
import {
  FileCheck,
  ShieldAlert,
  MessageSquareText,
  BookOpen,
  Lock,
  LogOut,
  User,
  ArrowLeft,
  ChevronLeft,
  ChevronRight,
  Activity,
  FolderArchive,
  CheckCircle2,
} from 'lucide-react';
import { performLogout } from '../../lib/firebase';
import { useEvidenceCases } from '../../hooks/useEvidence';

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
      icon: FileCheck,
      badge: 'Preventif',
    },
    {
      to: '/evidence',
      label: 'Penyusun Bukti',
      desc: 'Rekonstruksi Intimidasi Chat',
      icon: ShieldAlert,
      badge: 'Kuratif',
    },
    {
      to: '/assistant',
      label: 'Asisten Pelaporan',
      desc: 'RAG AI & Generator Draf Surat',
      icon: MessageSquareText,
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
        className={`fixed top-3 bottom-3 left-3 bg-white/95 backdrop-blur-md rounded-2xl border border-slate-200/80 z-50 flex flex-col justify-between transition-all duration-300 ease-in-out lg:translate-x-0 ${
          isOpen ? 'translate-x-0' : '-translate-x-[calc(100%+16px)]'
        } ${isCollapsed ? 'lg:w-[76px]' : 'lg:w-72'} w-72 shadow-xl shadow-slate-900/5`}
      >
        <button
          type="button"
          onClick={onToggleCollapse}
          className="absolute -right-3 top-1/2 -translate-y-1/2 z-50 hidden lg:flex items-center justify-center w-6 h-6 rounded-full bg-white border border-slate-200 text-slate-400 hover:text-slate-800 hover:border-slate-300 shadow-sm hover:scale-110 active:scale-95 transition-all"
          title={isCollapsed ? 'Perluas Sidebar' : 'Ciutkan Sidebar'}
          aria-label={isCollapsed ? 'Perluas Sidebar' : 'Ciutkan Sidebar'}
        >
          {isCollapsed ? (
            <ChevronRight className="w-3.5 h-3.5 text-[#BA3801]" />
          ) : (
            <ChevronLeft className="w-3.5 h-3.5 text-[#BA3801]" />
          )}
        </button>

        {/* Section 1: Header / Brand */}
        <div className={`border-b border-slate-100 transition-all ${isCollapsed ? 'p-3 text-center' : 'p-4 space-y-3'}`}>
          <div className={`flex items-center ${isCollapsed ? 'justify-center' : 'justify-between'}`}>
            <Link to="/" className="flex items-center gap-2.5 group">
              <div className="w-8 h-8 rounded-xl bg-[#BA3801] text-white flex items-center justify-center font-bold text-xs shadow-xs group-hover:scale-105 transition-transform shrink-0">
                <span className="font-mono">P</span>
              </div>
              {!isCollapsed && (
                <div className="min-w-0">
                  <div className="flex items-center gap-1.5">
                    <span className="font-bold text-sm tracking-tight text-slate-900">PELITA</span>
                    <span className="text-[9px] font-mono font-bold bg-slate-100 text-slate-600 px-1.5 py-0.2 rounded">
                      CMS
                    </span>
                  </div>
                  <p className="text-[11px] text-slate-400 font-medium truncate">Advokasi &amp; Integritas</p>
                </div>
              )}
            </Link>
          </div>

          {!isCollapsed ? (
            <div className="px-3 py-2 bg-slate-50/80 rounded-xl border border-slate-200/50 flex items-center justify-between text-xs">
              <div className="flex items-center gap-2 font-mono text-[10px] font-semibold text-slate-700">
                <Lock className="w-3.5 h-3.5 text-emerald-600" />
                <span>AES-256 Vault Aktif</span>
              </div>
              <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
            </div>
          ) : (
            <div className="mt-1 flex justify-center" title="AES-256 GCM Aktif">
              <div className="w-8 h-8 rounded-xl bg-slate-50 border border-slate-200/60 flex items-center justify-center">
                <Lock className="w-3.5 h-3.5 text-emerald-600" />
              </div>
            </div>
          )}
        </div>

        {/* Section 2: Nav Menu with Spacious Spacing */}
        <div className={`flex-1 overflow-y-auto ${isCollapsed ? 'p-2 space-y-4' : 'p-3.5 space-y-6'}`}>
          <div className="space-y-1.5">
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
                      `group flex items-center rounded-xl transition-all duration-150 text-xs relative ${
                        isCollapsed ? 'justify-center p-2.5' : 'items-start gap-3 px-3 py-2.5'
                      } ${
                        isActive
                          ? 'bg-[#BA3801] text-white font-semibold shadow-xs'
                          : 'text-slate-700 hover:text-slate-900 hover:bg-slate-100/70 font-medium'
                      }`
                    }
                  >
                    {({ isActive }) => (
                      <>
                        <div
                          className={`w-7 h-7 rounded-lg flex items-center justify-center shrink-0 transition-colors ${
                            isActive
                              ? 'bg-[#9A2E01] text-white'
                              : 'bg-slate-100 text-[#BA3801] group-hover:bg-white'
                          }`}
                        >
                          <Icon className="w-4 h-4" />
                        </div>
                        {!isCollapsed && (
                          <div className="flex-1 min-w-0">
                            <div className="flex items-center justify-between gap-1">
                              <span className="font-semibold truncate text-xs">{item.label}</span>
                              <span
                                className={`text-[9px] font-mono font-bold uppercase px-1.5 py-0.2 rounded ${
                                  isActive ? 'bg-[#9A2E01] text-[#FFEC89]' : 'bg-slate-100 text-slate-500'
                                }`}
                              >
                                {item.badge}
                              </span>
                            </div>
                            <p
                              className={`text-[10px] truncate font-normal mt-0.5 ${
                                isActive ? 'text-white/90' : 'text-slate-400'
                              }`}
                            >
                              {item.desc}
                            </p>
                          </div>
                        )}
                      </>
                    )}
                  </NavLink>

                  {/* Floating Popover Tooltip on Collapsed Mode */}
                  {isCollapsed && hoveredItem === item.to && (
                    <div className="absolute left-full top-1/2 -translate-y-1/2 ml-3.5 z-50 pointer-events-none animate-fadeIn">
                      <div className="bg-slate-900 text-white px-3.5 py-2 rounded-xl shadow-xl border border-slate-800 whitespace-nowrap space-y-0.5">
                        <div className="flex items-center gap-2">
                          <span className="font-semibold text-xs">{item.label}</span>
                          <span className="text-[9px] font-mono font-bold uppercase bg-[#BA3801] text-[#FFEC89] px-1.5 py-0.2 rounded">
                            {item.badge}
                          </span>
                        </div>
                        <p className="text-[10px] text-slate-300 font-normal">{item.desc}</p>
                      </div>
                    </div>
                  )}
                </div>
              );
            })}
          </div>

          {/* Quick Stat Summary */}
          {!isCollapsed ? (
            <div className="p-3 bg-slate-50/80 rounded-xl border border-slate-200/50 space-y-2">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-1.5 font-mono text-[10px] font-semibold text-slate-500 uppercase tracking-wider">
                  <Activity className="w-3.5 h-3.5 text-[#BA3801]" />
                  <span>Ringkasan Kasus</span>
                </div>
                <span className="text-[9px] font-mono font-bold text-emerald-800 bg-emerald-50 px-1.5 py-0.2 rounded border border-emerald-200">
                  Live
                </span>
              </div>
              <div className="grid grid-cols-2 gap-2 text-center">
                <div className="p-2 bg-white rounded-lg border border-slate-200/40 shadow-2xs">
                  <span className="text-sm font-extrabold text-slate-800 font-mono block leading-tight">
                    {cases.length}
                  </span>
                  <span className="text-[9px] text-slate-400 font-medium block">Berkas Kasus</span>
                </div>
                <div className="p-2 bg-white rounded-lg border border-slate-200/40 shadow-2xs">
                  <span className="text-sm font-extrabold text-emerald-800 font-mono block leading-tight flex items-center justify-center gap-0.5">
                    <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" />
                    100%
                  </span>
                  <span className="text-[9px] text-slate-400 font-medium block">UU PDP</span>
                </div>
              </div>
            </div>
          ) : (
            <div className="flex justify-center" title={`Status: ${cases.length} Kasus Aktif Terdaftar`}>
              <div className="w-8 h-8 rounded-xl bg-slate-50 border border-slate-200/60 flex items-center justify-center text-slate-600">
                <FolderArchive className="w-3.5 h-3.5 text-[#BA3801]" />
              </div>
            </div>
          )}

          {/* Section 3: Education & Public Pages */}
          <div className="space-y-1.5 pt-2 border-t border-slate-100">
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
                className={`flex items-center rounded-xl text-slate-700 hover:text-slate-900 hover:bg-slate-100/70 text-xs font-medium transition-all ${
                  isCollapsed ? 'justify-center p-2.5' : 'justify-between px-3 py-2.5'
                }`}
              >
                <div className="flex items-center gap-2.5">
                  <div className="w-7 h-7 rounded-lg bg-amber-50 text-amber-700 flex items-center justify-center shrink-0">
                    <BookOpen className="w-4 h-4" />
                  </div>
                  {!isCollapsed && <span className="font-semibold text-xs">Literasi Mikro</span>}
                </div>
                {!isCollapsed && (
                  <span className="text-[9px] font-mono font-bold text-amber-800 bg-amber-50 px-1.5 py-0.2 rounded border border-amber-200">
                    Kuis
                  </span>
                )}
              </Link>
              {isCollapsed && hoveredItem === '/literacy' && (
                <div className="absolute left-full top-1/2 -translate-y-1/2 ml-3.5 z-50 pointer-events-none animate-fadeIn">
                  <div className="bg-slate-900 text-white px-3.5 py-2 rounded-xl shadow-xl border border-slate-800 whitespace-nowrap">
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
                className={`flex items-center rounded-xl text-slate-700 hover:text-slate-900 hover:bg-slate-100/70 text-xs font-medium transition-all ${
                  isCollapsed ? 'justify-center p-2.5' : 'justify-between px-3 py-2.5'
                }`}
              >
                <div className="flex items-center gap-2.5">
                  <div className="w-7 h-7 rounded-lg bg-slate-100 text-slate-600 flex items-center justify-center shrink-0">
                    <ArrowLeft className="w-4 h-4" />
                  </div>
                  {!isCollapsed && <span className="font-semibold text-xs">Beranda Publik</span>}
                </div>
              </Link>
              {isCollapsed && hoveredItem === '/' && (
                <div className="absolute left-full top-1/2 -translate-y-1/2 ml-3.5 z-50 pointer-events-none animate-fadeIn">
                  <div className="bg-slate-900 text-white px-3.5 py-2 rounded-xl shadow-xl border border-slate-800 whitespace-nowrap">
                    <span className="font-semibold text-xs">Kembali ke Beranda Publik</span>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Section 4: User Profile */}
        <div className={`border-t border-slate-100 bg-white/50 rounded-b-2xl ${isCollapsed ? 'p-2 space-y-2' : 'p-3.5 space-y-2'}`}>
          {!isCollapsed ? (
            <div className="flex items-center justify-between gap-2 p-2 bg-slate-50/80 rounded-xl border border-slate-200/50">
              <div className="flex items-center gap-2.5 min-w-0">
                <div className="w-7 h-7 rounded-full bg-[#BA3801] text-white flex items-center justify-center font-bold text-xs shrink-0 shadow-2xs">
                  <User className="w-3.5 h-3.5" />
                </div>
                <div className="min-w-0">
                  <span className="text-xs font-semibold text-slate-800 block truncate">{userName}</span>
                  <span className="text-[9px] font-mono text-emerald-700 font-semibold block">Sesi Terverifikasi</span>
                </div>
              </div>

              <button
                type="button"
                onClick={handleLogout}
                className="tactile-btn p-1.5 rounded-lg text-slate-400 hover:text-rose-600 hover:bg-rose-50 transition-colors shrink-0"
                title="Keluar Sesi"
                aria-label="Keluar Sesi"
              >
                <LogOut className="w-3.5 h-3.5" />
              </button>
            </div>
          ) : (
            <div className="flex flex-col items-center gap-1.5">
              <div
                className="w-7 h-7 rounded-full bg-[#BA3801] text-white flex items-center justify-center font-bold text-xs shrink-0 shadow-2xs"
                title={userName}
              >
                <User className="w-3.5 h-3.5" />
              </div>
              <button
                type="button"
                onClick={handleLogout}
                className="tactile-btn p-1.5 rounded-lg text-slate-400 hover:text-rose-600 hover:bg-rose-50 transition-colors"
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
