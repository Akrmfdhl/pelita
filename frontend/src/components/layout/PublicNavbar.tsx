import React, { useState, useEffect, useRef } from 'react';
import { NavLink, Link, useLocation, useNavigate } from 'react-router-dom';
import {
  ShieldCheck,
  BookOpen,
  LogIn,
  LayoutDashboard,
  Zap,
  LogOut,
  User,
  Calculator,
  BarChart3,
  Scale,
  Compass,
  ChevronDown,
  Menu,
  X,
} from 'lucide-react';
import { performLogout } from '../../lib/firebase';
import { PelitaLogo } from '../brand/PelitaLogo';

export const PublicNavbar: React.FC = () => {
  const [userName, setUserName] = useState<string | null>(null);
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isExploreOpen, setIsExploreOpen] = useState(false);
  const hoverTimeoutRef = useRef<NodeJS.Timeout | null>(null);
  const location = useLocation();
  const navigate = useNavigate();

  useEffect(() => {
    setUserName(localStorage.getItem('pelita_user_name'));
  }, [location]);

  const handleMouseEnter = () => {
    if (hoverTimeoutRef.current) {
      clearTimeout(hoverTimeoutRef.current);
    }
    setIsExploreOpen(true);
  };

  const handleMouseLeave = () => {
    hoverTimeoutRef.current = setTimeout(() => {
      setIsExploreOpen(false);
    }, 150);
  };

  const handleLogout = async () => {
    await performLogout();
    setUserName(null);
    navigate('/');
  };

  const exploreLinks = [
    {
      to: '/radar',
      label: 'Radar Entitas OJK',
      desc: 'Cek 98+ pinjol berizin & daftar blokir',
      icon: ShieldCheck,
      badge: '98 Berizin',
    },
    {
      to: '/calculator',
      label: 'Kalkulator Bunga',
      desc: 'Simulasi batas 0.3%/hari & denda 100%',
      icon: Calculator,
      badge: 'SEOJK 19/2023',
    },
    {
      to: '/stats',
      label: 'Peta Teror Nasional',
      desc: 'Peta sebaran & jam rawan penagihan',
      icon: BarChart3,
      badge: 'Statistik',
    },
    {
      to: '/regulations',
      label: 'Korpus Regulasi',
      desc: 'Direktori pasal POJK, UU PDP & KUHP',
      icon: Scale,
      badge: 'Hukum Positif',
    },
  ];

  const allNavLinks = [
    { to: '/', label: 'Beranda', icon: ShieldCheck },
    ...exploreLinks,
    { to: '/literacy', label: 'Literasi Mikro', icon: BookOpen },
  ];

  const isExploreActive = ['/radar', '/calculator', '/stats', '/regulations'].includes(location.pathname);

  return (
    <header className="sticky top-4 z-50 max-w-7xl mx-auto px-4 sm:px-6 w-full">
      <div className="bg-gradient-to-b from-white/95 via-white/85 to-white/70 backdrop-blur-2xl backdrop-saturate-200 rounded-full border border-white/90 px-4 sm:px-6 py-2 shadow-[inset_0_1px_2px_rgba(255,255,255,0.9),0_12px_36px_rgba(15,23,42,0.08)] flex items-center justify-between gap-3 transition-all">
        {/* Brand Logo */}
        <Link to="/" className="group flex items-center shrink-0">
          <PelitaLogo size="md" variant="horizontal" className="group-hover:scale-102 transition-transform duration-150" />
        </Link>

        {/* Desktop Public Navigation */}
        <nav className="hidden md:flex items-center gap-1.5 bg-white/50 backdrop-blur-md p-1 rounded-full border border-white/70 shadow-inner">
          <NavLink
            to="/"
            className={({ isActive }) =>
              `flex items-center gap-1.5 px-3.5 py-1.5 rounded-full text-xs font-semibold transition-all duration-150 active:scale-95 whitespace-nowrap ${
                isActive
                  ? 'bg-[#BA3801] text-white shadow-[0_2px_8px_rgba(186,56,1,0.35)]'
                  : 'text-slate-700 hover:text-slate-900 hover:bg-white/70'
              }`
            }
          >
            {({ isActive }) => (
              <>
                <ShieldCheck className={`w-3.5 h-3.5 ${isActive ? 'text-white' : 'text-slate-600'}`} />
                <span>Beranda</span>
              </>
            )}
          </NavLink>

          {/* Fitur & Regulasi Hover Dropdown Menu */}
          <div
            className="relative"
            onMouseEnter={handleMouseEnter}
            onMouseLeave={handleMouseLeave}
          >
            <button
              type="button"
              className={`flex items-center gap-1.5 px-3.5 py-1.5 rounded-full text-xs font-semibold transition-all duration-150 active:scale-95 whitespace-nowrap cursor-pointer ${
                isExploreActive
                  ? 'bg-[#BA3801] text-white shadow-[0_2px_8px_rgba(186,56,1,0.35)]'
                  : isExploreOpen
                  ? 'text-slate-900 bg-white/80'
                  : 'text-slate-700 hover:text-slate-900 hover:bg-white/70'
              }`}
            >
              <Compass className={`w-3.5 h-3.5 ${isExploreActive ? 'text-white' : 'text-slate-600'}`} />
              <span>Fitur &amp; Regulasi</span>
              <ChevronDown
                className={`w-3 h-3 transition-transform duration-200 ${
                  isExploreOpen ? 'rotate-180' : ''
                } ${isExploreActive ? 'text-white' : 'text-slate-500'}`}
              />
            </button>

            {isExploreOpen && (
              <div className="absolute left-0 mt-2 w-72 bg-white border border-slate-200/90 rounded-3xl p-2.5 shadow-2xl space-y-1 z-50 text-left animate-fadeIn">
                <span className="text-[10px] font-mono font-bold text-slate-400 uppercase tracking-wider px-3 pt-1 block">
                  Pusat Fitur &amp; Regulasi
                </span>
                {exploreLinks.map((item) => {
                  const Icon = item.icon;
                  return (
                    <NavLink
                      key={item.to}
                      to={item.to}
                      onClick={() => setIsExploreOpen(false)}
                      className={({ isActive }) =>
                        `flex items-start gap-2.5 p-2 rounded-2xl transition-all ${
                          isActive ? 'bg-[#BA3801] text-white shadow-2xs' : 'text-slate-800 hover:bg-slate-50'
                        }`
                      }
                    >
                      {({ isActive }) => (
                        <>
                          <div className={`p-1.5 rounded-xl shrink-0 mt-0.5 ${isActive ? 'bg-white/20 text-white' : 'bg-slate-100 text-[#BA3801]'}`}>
                            <Icon className="w-4 h-4" />
                          </div>
                          <div className="flex-1 min-w-0">
                            <div className="flex items-center justify-between gap-1">
                              <span className="font-bold text-xs truncate">{item.label}</span>
                              <span className={`text-[9px] font-mono px-1.5 py-0.5 rounded-md ${isActive ? 'bg-white/20 text-white' : 'bg-slate-100 text-slate-600'}`}>
                                {item.badge}
                              </span>
                            </div>
                            <span className={`text-[10px] block truncate ${isActive ? 'text-white/80' : 'text-slate-500'}`}>{item.desc}</span>
                          </div>
                        </>
                      )}
                    </NavLink>
                  );
                })}
              </div>
            )}
          </div>

          <NavLink
            to="/literacy"
            className={({ isActive }) =>
              `flex items-center gap-1.5 px-3.5 py-1.5 rounded-full text-xs font-semibold transition-all duration-150 active:scale-95 whitespace-nowrap ${
                isActive
                  ? 'bg-[#BA3801] text-white shadow-[0_2px_8px_rgba(186,56,1,0.35)]'
                  : 'text-slate-700 hover:text-slate-900 hover:bg-white/70'
              }`
            }
          >
            {({ isActive }) => (
              <>
                <BookOpen className={`w-3.5 h-3.5 ${isActive ? 'text-white' : 'text-slate-600'}`} />
                <span>Literasi Mikro</span>
              </>
            )}
          </NavLink>
        </nav>

        {/* Auth / Action Section */}
        <div className="flex items-center gap-2 shrink-0">
          {userName ? (
            <div className="flex items-center gap-1.5 shrink-0">
              <Link
                to="/scanner"
                className="flex items-center gap-1.5 bg-[#BA3801] hover:bg-[#9A2E01] text-white px-4 py-1.5 rounded-full text-xs font-semibold transition-all duration-150 active:scale-95 shadow-[0_2px_8px_rgba(186,56,1,0.35)] shrink-0"
              >
                <LayoutDashboard className="w-3.5 h-3.5 text-white" />
                <span className="hidden sm:inline">Dashboard</span>
              </Link>
              <div className="hidden sm:flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-white/60 backdrop-blur-md border border-white/80 text-xs font-semibold text-slate-800 shadow-2xs shrink-0">
                <User className="w-3.5 h-3.5 text-[#BA3801]" />
                <span className="max-w-[70px] truncate">{userName}</span>
              </div>
              <button
                type="button"
                onClick={handleLogout}
                className="p-1.5 rounded-full text-slate-500 hover:text-rose-600 hover:bg-white/80 transition-colors active:scale-95 shrink-0"
                title="Keluar Akun"
                aria-label="Keluar Akun"
              >
                <LogOut className="w-3.5 h-3.5" />
              </button>
            </div>
          ) : (
            <div className="flex items-center gap-2 shrink-0">
              <Link
                to="/login"
                className="flex items-center gap-1.5 bg-white/70 hover:bg-white text-slate-800 border border-white/90 px-3.5 py-1.5 rounded-full text-xs font-semibold transition-all duration-150 active:scale-95 shadow-2xs shrink-0"
              >
                <LogIn className="w-3.5 h-3.5 text-slate-700" />
                <span>Masuk</span>
              </Link>
              <Link
                to="/scanner"
                className="flex items-center gap-1.5 bg-[#BA3801] hover:bg-[#9A2E01] text-white px-4 py-1.5 rounded-full text-xs font-semibold transition-all duration-150 active:scale-95 shadow-[0_2px_8px_rgba(186,56,1,0.35)] shrink-0"
              >
                <Zap className="w-3.5 h-3.5 text-white" />
                <span className="hidden sm:inline">Audit Kontrak</span>
                <span className="sm:hidden">Audit</span>
              </Link>
            </div>
          )}

          {/* Mobile Drawer Toggle */}
          <button
            type="button"
            onClick={() => setIsMenuOpen(!isMenuOpen)}
            className="md:hidden p-1.5 rounded-full text-slate-700 hover:bg-white/80 transition-colors shrink-0"
          >
            {isMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
          </button>
        </div>
      </div>

      {/* Mobile Drawer Menu */}
      {isMenuOpen && (
        <div className="md:hidden mt-2 bg-white/95 backdrop-blur-2xl border border-white/80 rounded-3xl p-4 shadow-2xl space-y-2 animate-fadeIn text-left">
          <span className="text-[10px] font-mono font-bold text-slate-400 uppercase tracking-wider px-2 block">
            Menu Navigasi
          </span>
          <div className="grid grid-cols-2 gap-1.5">
            {allNavLinks.map((item) => {
              const Icon = item.icon;
              return (
                <NavLink
                  key={item.to}
                  to={item.to}
                  onClick={() => setIsMenuOpen(false)}
                  className={({ isActive }) =>
                    `flex items-center gap-2 p-2.5 rounded-2xl text-xs font-semibold transition-all ${
                      isActive
                        ? 'bg-[#BA3801] text-white shadow-xs'
                        : 'text-slate-800 bg-white/60 hover:bg-white'
                    }`
                  }
                >
                  {({ isActive }) => (
                    <>
                      <Icon className={`w-4 h-4 ${isActive ? 'text-white' : 'text-[#BA3801]'}`} />
                      <span className="truncate">{item.label}</span>
                    </>
                  )}
                </NavLink>
              );
            })}
          </div>
        </div>
      )}
    </header>
  );
};
