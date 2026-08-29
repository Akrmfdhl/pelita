import React, { useState, useEffect } from 'react';
import { NavLink, Link, useLocation, useNavigate } from 'react-router-dom';
import {
  ShieldCheck,
  BookOpen,
  LogIn,
  LayoutDashboard,
  Zap,
  LogOut,
  User,
} from 'lucide-react';
import { performLogout } from '../../lib/firebase';

export const PublicNavbar: React.FC = () => {
  const [userName, setUserName] = useState<string | null>(null);
  const location = useLocation();
  const navigate = useNavigate();

  useEffect(() => {
    setUserName(localStorage.getItem('pelita_user_name'));
  }, [location]);

  const handleLogout = async () => {
    await performLogout();
    setUserName(null);
    navigate('/');
  };

  return (
    <header className="sticky top-4 z-50 max-w-5xl mx-auto px-4 w-full">
      <div className="bg-gradient-to-b from-white/70 via-white/50 to-white/35 backdrop-blur-2xl backdrop-saturate-200 rounded-full border border-white/80 px-4 sm:px-5 py-2 shadow-[inset_0_1px_2px_rgba(255,255,255,0.9),0_12px_36px_rgba(15,23,42,0.08)] flex items-center justify-between gap-4 transition-all">
        {/* Brand */}
        <Link to="/" className="flex items-center gap-2.5 group">
          <div className="w-8 h-8 rounded-full bg-[#BA3801] text-white flex items-center justify-center font-bold text-xs shadow-[0_2px_8px_rgba(186,56,1,0.35)] group-hover:scale-105 transition-transform shrink-0">
            <span className="font-mono">P</span>
          </div>
          <div className="flex flex-col">
            <span className="font-bold text-sm tracking-tight text-slate-900 leading-none">PELITA</span>
            <span className="text-[9px] font-mono font-semibold text-[#BA3801] tracking-wider uppercase mt-0.5">Advokasi Konsumen</span>
          </div>
        </Link>

        {/* Public Navigation */}
        <nav className="flex items-center gap-1 bg-white/30 backdrop-blur-md p-1 rounded-full border border-white/50 shadow-inner">
          <NavLink
            to="/"
            className={({ isActive }) =>
              `flex items-center gap-1.5 px-3.5 py-1.5 rounded-full text-xs font-semibold transition-all duration-150 active:scale-95 ${
                isActive
                  ? 'bg-[#BA3801] text-white shadow-[0_2px_8px_rgba(186,56,1,0.35)]'
                  : 'text-slate-700 hover:text-slate-900 hover:bg-white/60'
              }`
            }
          >
            <ShieldCheck className="w-3.5 h-3.5" />
            <span>Beranda</span>
          </NavLink>

          <NavLink
            to="/literacy"
            className={({ isActive }) =>
              `flex items-center gap-1.5 px-3.5 py-1.5 rounded-full text-xs font-semibold transition-all duration-150 active:scale-95 ${
                isActive
                  ? 'bg-[#BA3801] text-white shadow-[0_2px_8px_rgba(186,56,1,0.35)]'
                  : 'text-slate-700 hover:text-slate-900 hover:bg-white/60'
              }`
            }
          >
            <BookOpen className="w-3.5 h-3.5 text-amber-700" />
            <span>Literasi Mikro</span>
          </NavLink>
        </nav>

        {/* Auth / Dashboard CTA Action */}
        <div className="flex items-center gap-2">
          {userName ? (
            <div className="flex items-center gap-1.5">
              <Link
                to="/scanner"
                className="flex items-center gap-1.5 bg-[#BA3801] hover:bg-[#9A2E01] text-white px-4 py-1.5 rounded-full text-xs font-semibold transition-all duration-150 active:scale-95 shadow-[0_2px_8px_rgba(186,56,1,0.35)]"
              >
                <LayoutDashboard className="w-3.5 h-3.5 text-[#FFEC89]" />
                <span className="hidden sm:inline">Masuk Dashboard</span>
                <span className="sm:hidden">Dashboard</span>
              </Link>
              <div className="hidden sm:flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-white/50 backdrop-blur-md border border-white/70 text-xs font-semibold text-slate-800 shadow-2xs">
                <User className="w-3.5 h-3.5 text-[#BA3801]" />
                <span className="max-w-[70px] truncate">{userName}</span>
              </div>
              <button
                type="button"
                onClick={handleLogout}
                className="p-1.5 rounded-full text-slate-500 hover:text-rose-600 hover:bg-white/60 transition-colors"
                title="Keluar Akun"
                aria-label="Keluar Akun"
              >
                <LogOut className="w-3.5 h-3.5" />
              </button>
            </div>
          ) : (
            <div className="flex items-center gap-2">
              <Link
                to="/login"
                className="flex items-center gap-1.5 bg-white/50 hover:bg-white/80 text-slate-800 border border-white/80 px-3.5 py-1.5 rounded-full text-xs font-semibold transition-all duration-150 active:scale-95 shadow-[inset_0_1px_1px_rgba(255,255,255,0.8),0_2px_6px_rgba(0,0,0,0.03)]"
              >
                <LogIn className="w-3.5 h-3.5 text-[#BA3801]" />
                <span>Masuk</span>
              </Link>
              <Link
                to="/scanner"
                className="flex items-center gap-1.5 bg-[#BA3801] hover:bg-[#9A2E01] text-white px-4 py-1.5 rounded-full text-xs font-semibold transition-all duration-150 active:scale-95 shadow-[0_2px_8px_rgba(186,56,1,0.35)]"
              >
                <Zap className="w-3.5 h-3.5 text-[#FFEC89]" />
                <span>Audit Kontrak</span>
              </Link>
            </div>
          )}
        </div>
      </div>
    </header>
  );
};
