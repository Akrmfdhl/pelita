import React from 'react';
import { Shield, FileSearch, FolderArchive, MessageSquareText, BookOpen, PhoneCall } from 'lucide-react';
import { NavLink } from 'react-router-dom';

export const Navbar: React.FC = () => {
  return (
    <header className="sticky top-0 z-50 bg-canvas-surface/95 backdrop-blur border-b border-canvas-border shadow-sm">
      <div className="bg-ink-navy text-canvas-paper text-[11px] font-mono py-1 px-4 text-center tracking-wider flex items-center justify-between max-w-7xl mx-auto">
        <span className="flex items-center gap-2">
          <span className="w-2 h-2 rounded-full bg-stamp-teal animate-pulse" />
          <span>Pelita Rule Engine: POJK No. 10/2022 &amp; POJK No. 22/2023 Aktif</span>
        </span>
        <span className="hidden sm:flex items-center gap-4 text-canvas-subtle">
          <span className="flex items-center gap-1">
            <PhoneCall className="w-3 h-3 text-stamp-amber" /> Hotline OJK: 157
          </span>
          <span>AFPI: 150 505</span>
        </span>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
        <NavLink to="/" className="flex items-center gap-3 group">
          <div className="w-10 h-10 rounded bg-ink-navy flex items-center justify-center text-canvas-paper font-serif font-bold text-xl border border-canvas-border shadow-sm group-hover:scale-[1.02] transition-transform">
            P
          </div>
          <div>
            <div className="flex items-center gap-2">
              <span className="font-serif font-bold text-xl text-ink-primary tracking-tight">PELITA</span>
              <span className="font-mono text-[10px] px-1.5 py-0.5 rounded bg-canvas-subtle border border-canvas-border text-ink-navy font-semibold">
                v1.0
              </span>
            </div>
            <span className="block text-[11px] font-mono text-ink-muted uppercase tracking-wider">
              Advokasi Integritas Konsumen AI
            </span>
          </div>
        </NavLink>

        <nav className="hidden md:flex items-center gap-1.5 bg-canvas-subtle p-1 rounded-lg border border-canvas-border">
          <NavLink
            to="/"
            end
            className={({ isActive }) =>
              `px-3.5 py-1.5 rounded-md text-xs font-medium transition-all flex items-center gap-2 ${
                isActive
                  ? 'bg-canvas-surface text-ink-navy shadow-sm font-semibold border border-canvas-border'
                  : 'text-ink-muted hover:text-ink-primary hover:bg-canvas-surface/50'
              }`
            }
          >
            <FileSearch className="w-4 h-4 text-ink-navy" />
            Pemindai Kontrak
          </NavLink>
          <NavLink
            to="/evidence"
            className={({ isActive }) =>
              `px-3.5 py-1.5 rounded-md text-xs font-medium transition-all flex items-center gap-2 ${
                isActive
                  ? 'bg-canvas-surface text-ink-navy shadow-sm font-semibold border border-canvas-border'
                  : 'text-ink-muted hover:text-ink-primary hover:bg-canvas-surface/50'
              }`
            }
          >
            <FolderArchive className="w-4 h-4 text-ink-navy" />
            Penyusun Bukti
          </NavLink>
          <NavLink
            to="/assistant"
            className={({ isActive }) =>
              `px-3.5 py-1.5 rounded-md text-xs font-medium transition-all flex items-center gap-2 ${
                isActive
                  ? 'bg-canvas-surface text-ink-navy shadow-sm font-semibold border border-canvas-border'
                  : 'text-ink-muted hover:text-ink-primary hover:bg-canvas-surface/50'
              }`
            }
          >
            <MessageSquareText className="w-4 h-4 text-ink-navy" />
            Asisten Pelaporan
          </NavLink>
          <NavLink
            to="/literacy"
            className={({ isActive }) =>
              `px-3.5 py-1.5 rounded-md text-xs font-medium transition-all flex items-center gap-2 ${
                isActive
                  ? 'bg-canvas-surface text-ink-navy shadow-sm font-semibold border border-canvas-border'
                  : 'text-ink-muted hover:text-ink-primary hover:bg-canvas-surface/50'
              }`
            }
          >
            <BookOpen className="w-4 h-4 text-ink-navy" />
            Literasi Mikro
          </NavLink>
        </nav>

        <div className="flex items-center gap-2.5">
          <div className="hidden lg:flex flex-col text-right">
            <span className="text-[11px] font-semibold text-ink-primary">Kanal Verifikasi OJK</span>
            <span className="text-[10px] font-mono text-stamp-teal">Terhubung ke Basis Data 2026</span>
          </div>
          <div className="w-8 h-8 rounded-full bg-stamp-teal-bg border border-stamp-teal flex items-center justify-center text-stamp-teal">
            <Shield className="w-4 h-4" />
          </div>
        </div>
      </div>
    </header>
  );
};
