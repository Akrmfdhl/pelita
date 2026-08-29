import React, { useState } from 'react';
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
} from 'lucide-react';
import { performLogout } from '../../lib/firebase';

export const Navbar: React.FC = () => {
  const [isOpen, setIsOpen] = useState(false);
  const userName = localStorage.getItem('pelita_user_name');
  const navigate = useNavigate();

  const handleLogout = async () => {
    await performLogout();
    navigate('/');
  };

  const navItems = [
    { to: '/scanner', label: 'Pemindai Kontrak', icon: FileCheck },
    { to: '/evidence', label: 'Penyusun Bukti', icon: ShieldAlert },
    { to: '/assistant', label: 'Asisten Pelaporan', icon: MessageSquareText },
    { to: '/literacy', label: 'Literasi Mikro', icon: BookOpen },
  ];

  return (
    <header className="sticky top-4 z-50 max-w-7xl mx-auto px-4 w-full">
      <div className="bg-white border-2 border-[#4A69B3] rounded-full px-5 py-2.5 shadow-xl shadow-[#1E2C4F]/10 flex items-center justify-between gap-4">
        <Link to="/" className="flex items-center gap-2.5 group">
          <div className="w-8 h-8 rounded-full bg-[#BA3801] text-white flex items-center justify-center font-bold text-xs shadow-xs group-hover:scale-105 transition-transform">
            <span className="font-mono">P</span>
          </div>
          <div className="flex flex-col">
            <span className="font-extrabold text-base tracking-tight text-[#1E2C4F] leading-none">PELITA</span>
            <span className="text-[9px] font-mono font-bold text-[#BA3801] tracking-widest uppercase">Advokasi Konsumen</span>
          </div>
        </Link>

        <nav className="hidden md:flex items-center gap-1.5">
          {navItems.map((item) => {
            const Icon = item.icon;
            return (
              <NavLink
                key={item.to}
                to={item.to}
                className={({ isActive }) =>
                  `tactile-btn flex items-center gap-1.5 px-3.5 py-1.5 rounded-full text-xs font-bold transition-all ${
                    isActive
                      ? 'bg-[#BA3801] text-white shadow-md'
                      : 'text-[#1E2C4F] hover:text-[#BA3801] hover:bg-[#FFEC89]'
                  }`
                }
              >
                <Icon className="w-3.5 h-3.5" />
                <span>{item.label}</span>
              </NavLink>
            );
          })}
        </nav>

        <div className="flex items-center gap-2">
          {userName ? (
            <div className="flex items-center gap-2">
              <div className="hidden sm:flex items-center gap-1.5 px-3.5 py-1.5 rounded-full bg-white border-2 border-[#4A69B3]/40 text-xs font-bold text-[#1E2C4F]">
                <User className="w-3.5 h-3.5 text-[#BA3801]" />
                <span className="max-w-[100px] truncate">{userName}</span>
              </div>
              <button
                type="button"
                onClick={handleLogout}
                className="tactile-btn p-2 rounded-full text-[#2E3E6E] hover:text-rose-600 hover:bg-rose-50 transition-colors"
                title="Keluar Akun"
              >
                <LogOut className="w-4 h-4" />
              </button>
            </div>
          ) : (
            <Link
              to="/login"
              className="tactile-btn flex items-center gap-1.5 bg-white border-2 border-[#4A69B3]/40 hover:bg-[#FFEC89] text-[#1E2C4F] px-4 py-1.5 rounded-full text-xs font-bold transition-all"
            >
              <LogIn className="w-3.5 h-3.5 text-[#BA3801]" />
              <span>Masuk</span>
            </Link>
          )}

          <button
            type="button"
            onClick={() => setIsOpen(!isOpen)}
            className="md:hidden p-2 rounded-full text-[#1E2C4F] hover:bg-[#FFEC89]"
          >
            {isOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
          </button>
        </div>
      </div>
    </header>
  );
};
