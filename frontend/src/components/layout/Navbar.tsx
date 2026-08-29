import React from 'react';
import { Shield, FileSearch, FolderArchive, MessageSquareText, BookOpen } from 'lucide-react';
import { NavLink } from 'react-router-dom';

export const Navbar: React.FC = () => {
  return (
    <header className="sticky top-0 z-50 bg-canvas-surface border-b border-canvas-border shadow-sm">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded bg-ink-navy flex items-center justify-center text-canvas-paper font-serif font-bold text-xl">
            P
          </div>
          <div>
            <span className="font-serif font-bold text-lg text-ink-primary tracking-tight">PELITA</span>
            <span className="block text-[11px] font-mono text-ink-muted uppercase tracking-wider">Integritas Konsumen AI</span>
          </div>
        </div>

        <nav className="hidden md:flex items-center gap-1">
          <NavLink
            to="/"
            className={({ isActive }) =>
              `px-3 py-2 rounded text-sm font-medium transition-colors flex items-center gap-2 ${
                isActive ? "bg-canvas-subtle text-ink-navy font-semibold" : "text-ink-muted hover:text-ink-primary"
              }`
            }
          >
            <FileSearch className="w-4 h-4" />
            Pemindai Kontrak
          </NavLink>
          <NavLink
            to="/evidence"
            className={({ isActive }) =>
              `px-3 py-2 rounded text-sm font-medium transition-colors flex items-center gap-2 ${
                isActive ? "bg-canvas-subtle text-ink-navy font-semibold" : "text-ink-muted hover:text-ink-primary"
              }`
            }
          >
            <FolderArchive className="w-4 h-4" />
            Penyusun Bukti
          </NavLink>
          <NavLink
            to="/assistant"
            className={({ isActive }) =>
              `px-3 py-2 rounded text-sm font-medium transition-colors flex items-center gap-2 ${
                isActive ? "bg-canvas-subtle text-ink-navy font-semibold" : "text-ink-muted hover:text-ink-primary"
              }`
            }
          >
            <MessageSquareText className="w-4 h-4" />
            Asisten Pelaporan
          </NavLink>
          <NavLink
            to="/literacy"
            className={({ isActive }) =>
              `px-3 py-2 rounded text-sm font-medium transition-colors flex items-center gap-2 ${
                isActive ? "bg-canvas-subtle text-ink-navy font-semibold" : "text-ink-muted hover:text-ink-primary"
              }`
            }
          >
            <BookOpen className="w-4 h-4" />
            Literasi Mikro
          </NavLink>
        </nav>

        <div className="flex items-center gap-2">
          <span className="font-mono text-xs text-stamp-teal border border-stamp-teal px-2 py-1 rounded bg-stamp-teal-bg">
            <Shield className="w-3 h-3 inline mr-1" />
            POJK No. 10/2022
          </span>
        </div>
      </div>
    </header>
  );
};
