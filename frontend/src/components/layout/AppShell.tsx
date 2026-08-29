import React from 'react';
import { Navbar } from './Navbar';
import { Outlet } from 'react-router-dom';
import { ShieldCheck, PhoneCall, ExternalLink } from 'lucide-react';

export const AppShell: React.FC = () => {
  return (
    <div className="min-h-screen flex flex-col bg-canvas-paper bg-grid-pattern text-ink-primary selection:bg-ink-navy selection:text-canvas-paper">
      <Navbar />
      <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-8 sm:py-10">
        <Outlet />
      </main>

      <footer className="border-t border-canvas-border bg-canvas-surface py-8">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-6">
          <div className="flex flex-col md:flex-row items-center justify-between gap-4 pb-6 border-b border-canvas-border text-xs text-ink-muted">
            <div className="flex items-center gap-3">
              <div className="w-7 h-7 rounded bg-ink-navy text-canvas-paper font-serif font-bold flex items-center justify-center text-sm">
                P
              </div>
              <span className="font-serif font-semibold text-ink-primary text-sm">
                Pelita Consumer Integrity Platform
              </span>
            </div>
            <div className="flex flex-wrap items-center gap-6 font-mono text-[11px]">
              <span className="flex items-center gap-1.5 text-stamp-teal">
                <ShieldCheck className="w-3.5 h-3.5" />
                POJK No. 10/2022 &amp; POJK No. 22/2023
              </span>
              <span className="flex items-center gap-1.5 text-ink-navy">
                <PhoneCall className="w-3.5 h-3.5" />
                Kontak OJK: 157
              </span>
              <span>AFPI: 150 505</span>
            </div>
          </div>

          <div className="flex flex-col sm:flex-row items-center justify-between gap-3 text-[11px] text-ink-muted">
            <p>
              Pelita adalah platform AI advokasi dan perlindungan konsumen independen untuk mendeteksi risiko kontrak dan intimidasi penagihan online di Indonesia.
            </p>
            <div className="flex items-center gap-4 font-mono text-[10px]">
              <span className="hover:text-ink-primary transition-colors cursor-pointer flex items-center gap-1">
                Kanal Satgas PASTI <ExternalLink className="w-2.5 h-2.5" />
              </span>
              <span className="hover:text-ink-primary transition-colors cursor-pointer flex items-center gap-1">
                Katalog POJK <ExternalLink className="w-2.5 h-2.5" />
              </span>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
};
