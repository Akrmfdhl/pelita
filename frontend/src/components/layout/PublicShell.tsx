import React from 'react';
import { PublicNavbar } from './PublicNavbar';
import { Footer } from './Footer';
import { Outlet } from 'react-router-dom';

export const PublicShell: React.FC = () => {
  return (
    <div className="min-h-screen flex flex-col bg-[#FFEC89] text-[#1E2C4F] selection:bg-[#BA3801] selection:text-white">
      <PublicNavbar />
      <main className="flex-1 w-full">
        <Outlet />
      </main>
      <Footer />
    </div>
  );
};
