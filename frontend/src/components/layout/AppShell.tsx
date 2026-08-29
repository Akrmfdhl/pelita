import React from 'react';
import { Navbar } from './Navbar';
import { Outlet } from 'react-router-dom';

export const AppShell: React.FC = () => {
  return (
    <div className="min-h-screen flex flex-col bg-canvas-paper">
      <Navbar />
      <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <Outlet />
      </main>
      <footer className="border-t border-canvas-border bg-canvas-surface py-6">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex flex-col sm:flex-row items-center justify-between gap-4 text-xs text-ink-muted">
          <div>
            Pelita — Platform AI Integritas & Advokasi Perlindungan Konsumen Pinjaman Online.
          </div>
          <div className="font-mono">
            Satgas PASTI | OJK | AFPI | Bareskrim Polri
          </div>
        </div>
      </footer>
    </div>
  );
};
