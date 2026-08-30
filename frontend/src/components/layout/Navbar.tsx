import React, { useState, useRef, useEffect } from 'react';
import { NavLink, Link, useNavigate } from 'react-router-dom';
import {
  FileCheck,
  ShieldAlert,
  MessageSquareText,
  BookOpen,
  LogIn,
  LogOut,
  User,
  Menu,
  X,
  ShieldCheck,
  Calculator,
  BarChart3,
  Scale,
  ChevronDown,
  Compass,
  Wrench,
} from 'lucide-react';
import { performLogout } from '../../lib/firebase';

export const Navbar: React.FC = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [activeDropdown, setActiveDropdown] = useState<'explore' | 'tools' | null>(null);
  const dropdownRef = useRef<HTMLDivElement>(null);
  const userName = localStorage.getItem('pelita_user_name');
  const navigate = useNavigate();

  const handleLogout = async () => {
    await performLogout();
    navigate('/');
  };

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setActiveDropdown(null);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const publicExploreItems = [
    {
      to: '/radar',
      label: 'Radar Entitas OJK',
      desc: 'Cek legalitas 98+ pinjol & daftar blokir',
      icon: ShieldCheck,
      badge: '98 Berizin',
    },
    {
      to: '/calculator',
      label: 'Kalkulator Bunga',
      desc: 'Simulasi batas 0.3%/hari & plafon 100%',
      icon: Calculator,
      badge: 'SEOJK 19/2023',
    },
    {
      to: '/stats',
      label: 'Peta Teror Nasional',
      desc: 'Peta sebaran & jam rawan penagihan',
      icon: BarChart3,
      badge: 'Data Agregat',
    },
    {
      to: '/regulations',
      label: 'Korpus Regulasi',
      desc: 'Direktori POJK, UU PDP & KUHP',
      icon: Scale,
      badge: 'Hukum Positif',
    },
  ];

  const advocacyToolItems = [
    {
      to: '/assistant',
      label: 'Asisten Lita AI',
      desc: 'Konsultasi hukum & draf surat aduan',
      icon: MessageSquareText,
      badge: 'Multimodal',
    },
    {
      to: '/scanner',
      label: 'Pemindai Kontrak',
      desc: 'Audit klausul berbahaya otomatis',
      icon: FileCheck,
      badge: 'OCR AI',
    },
    {
      to: '/evidence',
      label: 'Penyusun Bukti',
      desc: 'Rekonstruksi kronologi teror chat',
      icon: ShieldAlert,
      badge: 'AES-256',
    },
    {
      to: '/literacy',
      label: 'Literasi & Kuis',
      desc: 'Pelatihan singkat & skor pemahaman',
      icon: BookOpen,
      badge: 'Mikro Modul',
    },
  ];

  return (
    <header className="sticky top-4 z-50 max-w-7xl mx-auto px-4 w-full" ref={dropdownRef}>
      <div className="bg-white border-2 border-[#4A69B3] rounded-full px-4 sm:px-6 py-2.5 shadow-xl shadow-[#1E2C4F]/10 flex items-center justify-between gap-3">
        {/* Brand Logo */}
        <Link to="/" className="flex items-center gap-2.5 group shrink-0">
          <div className="w-8 h-8 rounded-full bg-[#BA3801] text-white flex items-center justify-center font-bold text-xs shadow-xs group-hover:scale-105 transition-transform">
            <span className="font-mono">P</span>
          </div>
          <div className="flex flex-col text-left">
            <span className="font-extrabold text-base tracking-tight text-[#1E2C4F] leading-none">PELITA</span>
            <span className="text-[8.5px] font-mono font-bold text-[#BA3801] tracking-wider uppercase">
              Advokasi Konsumen
            </span>
          </div>
        </Link>

        {/* Desktop Navigation Menus */}
        <nav className="hidden md:flex items-center gap-2">
          {/* Dropdown 1: Eksplorasi Publik */}
          <div className="relative">
            <button
              type="button"
              onClick={() => setActiveDropdown(activeDropdown === 'explore' ? null : 'explore')}
              className={`flex items-center gap-1.5 px-3.5 py-1.5 rounded-full text-xs font-bold transition-all ${
                activeDropdown === 'explore'
                  ? 'bg-[#1E2C4F] text-white shadow-xs'
                  : 'text-[#1E2C4F] hover:bg-slate-100'
              }`}
            >
              <Compass className="w-3.5 h-3.5 text-[#BA3801]" />
              <span>Eksplorasi Publik</span>
              <ChevronDown
                className={`w-3 h-3 transition-transform duration-200 ${
                  activeDropdown === 'explore' ? 'rotate-180 text-white' : 'text-slate-400'
                }`}
              />
            </button>

            {activeDropdown === 'explore' && (
              <div className="absolute left-0 mt-3 w-80 bg-white border-2 border-[#4A69B3] rounded-3xl p-3 shadow-2xl space-y-1 animate-fadeIn text-left z-50">
                <span className="text-[10px] font-mono font-bold text-slate-400 uppercase tracking-wider px-3 pt-1 block">
                  Pusat Data &amp; Regulasi Terbuka
                </span>
                {publicExploreItems.map((item) => {
                  const Icon = item.icon;
                  return (
                    <NavLink
                      key={item.to}
                      to={item.to}
                      onClick={() => setActiveDropdown(null)}
                      className={({ isActive }) =>
                        `flex items-start gap-3 p-2.5 rounded-2xl transition-all ${
                          isActive
                            ? 'bg-[#BA3801] text-white'
                            : 'hover:bg-slate-50 text-[#1E2C4F]'
                        }`
                      }
                    >
                      <div className="p-2 rounded-xl bg-slate-100 text-[#BA3801] shrink-0 mt-0.5">
                        <Icon className="w-4 h-4" />
                      </div>
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center justify-between gap-1">
                          <span className="font-bold text-xs truncate">{item.label}</span>
                          <span className="text-[9px] font-mono px-1.5 py-0.5 rounded-md bg-slate-100 text-slate-600 font-semibold shrink-0">
                            {item.badge}
                          </span>
                        </div>
                        <span className="text-[11px] text-slate-500 block truncate">{item.desc}</span>
                      </div>
                    </NavLink>
                  );
                })}
              </div>
            )}
          </div>

          {/* Dropdown 2: Alat Advokasi */}
          <div className="relative">
            <button
              type="button"
              onClick={() => setActiveDropdown(activeDropdown === 'tools' ? null : 'tools')}
              className={`flex items-center gap-1.5 px-3.5 py-1.5 rounded-full text-xs font-bold transition-all ${
                activeDropdown === 'tools'
                  ? 'bg-[#1E2C4F] text-white shadow-xs'
                  : 'text-[#1E2C4F] hover:bg-slate-100'
              }`}
            >
              <Wrench className="w-3.5 h-3.5 text-[#BA3801]" />
              <span>Alat Advokasi &amp; AI</span>
              <ChevronDown
                className={`w-3 h-3 transition-transform duration-200 ${
                  activeDropdown === 'tools' ? 'rotate-180 text-white' : 'text-slate-400'
                }`}
              />
            </button>

            {activeDropdown === 'tools' && (
              <div className="absolute left-0 mt-3 w-80 bg-white border-2 border-[#4A69B3] rounded-3xl p-3 shadow-2xl space-y-1 animate-fadeIn text-left z-50">
                <span className="text-[10px] font-mono font-bold text-slate-400 uppercase tracking-wider px-3 pt-1 block">
                  Fitur Pemindai &amp; Pendampingan AI
                </span>
                {advocacyToolItems.map((item) => {
                  const Icon = item.icon;
                  return (
                    <NavLink
                      key={item.to}
                      to={item.to}
                      onClick={() => setActiveDropdown(null)}
                      className={({ isActive }) =>
                        `flex items-start gap-3 p-2.5 rounded-2xl transition-all ${
                          isActive
                            ? 'bg-[#BA3801] text-white'
                            : 'hover:bg-slate-50 text-[#1E2C4F]'
                        }`
                      }
                    >
                      <div className="p-2 rounded-xl bg-slate-100 text-[#BA3801] shrink-0 mt-0.5">
                        <Icon className="w-4 h-4" />
                      </div>
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center justify-between gap-1">
                          <span className="font-bold text-xs truncate">{item.label}</span>
                          <span className="text-[9px] font-mono px-1.5 py-0.5 rounded-md bg-slate-100 text-slate-600 font-semibold shrink-0">
                            {item.badge}
                          </span>
                        </div>
                        <span className="text-[11px] text-slate-500 block truncate">{item.desc}</span>
                      </div>
                    </NavLink>
                  );
                })}
              </div>
            )}
          </div>

          {/* Direct Link: Asisten Lita AI (Primary Action) */}
          <NavLink
            to="/assistant"
            className={({ isActive }) =>
              `flex items-center gap-1.5 px-4 py-1.5 rounded-full text-xs font-bold transition-all ${
                isActive
                  ? 'bg-[#BA3801] text-white shadow-md'
                  : 'bg-[#FFEC89] text-[#1E2C4F] hover:bg-[#FFE359]'
              }`
            }
          >
            <MessageSquareText className="w-3.5 h-3.5 text-[#BA3801]" />
            <span>Tanya Lita AI</span>
          </NavLink>
        </nav>

        {/* User Auth Action Section */}
        <div className="flex items-center gap-2 shrink-0">
          {userName ? (
            <div className="flex items-center gap-2">
              <div className="hidden sm:flex items-center gap-1.5 px-3.5 py-1.5 rounded-full bg-white border-2 border-[#4A69B3]/40 text-xs font-bold text-[#1E2C4F]">
                <User className="w-3.5 h-3.5 text-[#BA3801]" />
                <span className="max-w-[90px] truncate">{userName}</span>
              </div>
              <button
                type="button"
                onClick={handleLogout}
                className="p-2 rounded-full text-[#2E3E6E] hover:text-rose-600 hover:bg-rose-50 transition-colors"
                title="Keluar Akun"
              >
                <LogOut className="w-4 h-4" />
              </button>
            </div>
          ) : (
            <Link
              to="/login"
              className="flex items-center gap-1.5 bg-white border-2 border-[#4A69B3]/40 hover:bg-[#FFEC89] text-[#1E2C4F] px-4 py-1.5 rounded-full text-xs font-bold transition-all"
            >
              <LogIn className="w-3.5 h-3.5 text-[#BA3801]" />
              <span>Masuk</span>
            </Link>
          )}

          {/* Hamburger Mobile Toggle */}
          <button
            type="button"
            onClick={() => setIsOpen(!isOpen)}
            className="md:hidden p-2 rounded-full text-[#1E2C4F] hover:bg-[#FFEC89] transition-colors"
          >
            {isOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
          </button>
        </div>
      </div>

      {/* Mobile Drawer Menu */}
      {isOpen && (
        <div className="md:hidden mt-2 bg-white border-2 border-[#4A69B3] rounded-3xl p-5 shadow-2xl space-y-4 animate-fadeIn text-left">
          <div className="space-y-2">
            <span className="text-[11px] font-mono font-bold text-slate-400 uppercase tracking-wider block">
              Eksplorasi Publik
            </span>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-1.5">
              {publicExploreItems.map((item) => {
                const Icon = item.icon;
                return (
                  <NavLink
                    key={item.to}
                    to={item.to}
                    onClick={() => setIsOpen(false)}
                    className={({ isActive }) =>
                      `flex items-center gap-2.5 p-2.5 rounded-2xl text-xs font-bold transition-all ${
                        isActive
                          ? 'bg-[#BA3801] text-white shadow-xs'
                          : 'text-[#1E2C4F] hover:bg-slate-100'
                      }`
                    }
                  >
                    <Icon className="w-4 h-4 text-[#BA3801]" />
                    <span>{item.label}</span>
                  </NavLink>
                );
              })}
            </div>
          </div>

          <div className="space-y-2 pt-2 border-t border-slate-100">
            <span className="text-[11px] font-mono font-bold text-slate-400 uppercase tracking-wider block">
              Alat Advokasi &amp; AI
            </span>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-1.5">
              {advocacyToolItems.map((item) => {
                const Icon = item.icon;
                return (
                  <NavLink
                    key={item.to}
                    to={item.to}
                    onClick={() => setIsOpen(false)}
                    className={({ isActive }) =>
                      `flex items-center gap-2.5 p-2.5 rounded-2xl text-xs font-bold transition-all ${
                        isActive
                          ? 'bg-[#BA3801] text-white shadow-xs'
                          : 'text-[#1E2C4F] hover:bg-slate-100'
                      }`
                    }
                  >
                    <Icon className="w-4 h-4 text-[#BA3801]" />
                    <span>{item.label}</span>
                  </NavLink>
                );
              })}
            </div>
          </div>
        </div>
      )}
    </header>
  );
};
