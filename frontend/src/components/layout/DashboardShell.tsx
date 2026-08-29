import React, { useState } from 'react';
import { Outlet } from 'react-router-dom';
import { DashboardSidebar } from './DashboardSidebar';
import { Menu } from 'lucide-react';

export const DashboardShell: React.FC = () => {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [isCollapsed, setIsCollapsed] = useState(false);

  return (
    <div className="min-h-screen bg-[#FFEC89] text-[#1E2C4F] flex selection:bg-[#BA3801] selection:text-white">
      {/* Mobile Floating Menu Button */}
      <button
        type="button"
        onClick={() => setSidebarOpen(true)}
        className="fixed top-3.5 left-3.5 z-40 lg:hidden p-2 rounded-xl bg-white/95 backdrop-blur-md border border-slate-200/80 shadow-md text-[#1E2C4F] hover:bg-[#FFEC89] transition-all"
        title="Buka Menu"
        aria-label="Buka Menu"
      >
        <Menu className="w-5 h-5" />
      </button>

      {/* Floating Island Capsule Sidebar */}
      <DashboardSidebar
        isOpen={sidebarOpen}
        onClose={() => setSidebarOpen(false)}
        isCollapsed={isCollapsed}
        onToggleCollapse={() => setIsCollapsed((prev) => !prev)}
      />

      {/* Main Workspace with Clean Padding without Topbar */}
      <div
        className={`flex-1 flex flex-col min-w-0 transition-all duration-300 ease-in-out ${
          isCollapsed ? 'lg:pl-[96px]' : 'lg:pl-[304px]'
        }`}
      >
        <main className="flex-1 px-4 sm:px-8 py-6 sm:py-8 max-w-7xl w-full mx-auto animate-fadeIn">
          <Outlet />
        </main>
      </div>
    </div>
  );
};
