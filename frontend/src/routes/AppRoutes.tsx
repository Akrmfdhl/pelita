import React from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import { PublicShell } from '../components/layout/PublicShell';
import { DashboardShell } from '../components/layout/DashboardShell';
import { ProtectedRoute } from '../components/layout/ProtectedRoute';
import { LandingPage } from '../features/landing/LandingPage';
import { ContractUpload } from '../features/contracts/ContractUpload';
import { EvidenceUploader } from '../features/evidence/EvidenceUploader';
import { AssistantChat } from '../features/reporting/AssistantChat';
import { QuizCard } from '../features/literacy/QuizCard';
import { EntityRadarPage } from '../features/radar/EntityRadarPage';
import { LoanCalculatorPage } from '../features/calculator/LoanCalculatorPage';
import { NationalStatsPage } from '../features/stats/NationalStatsPage';
import { RegulationsDirectoryPage } from '../features/regulations/RegulationsDirectoryPage';
import { Login } from '../features/auth/Login';
import { Register } from '../features/auth/Register';

export const AppRoutes: React.FC = () => {
  return (
    <Routes>
      {/* 1. Public Facing Shell with Navbar & Footer */}
      <Route element={<PublicShell />}>
        <Route path="/" element={<LandingPage />} />
        <Route path="/radar" element={<EntityRadarPage />} />
        <Route path="/calculator" element={<LoanCalculatorPage />} />
        <Route path="/stats" element={<NationalStatsPage />} />
        <Route path="/regulations" element={<RegulationsDirectoryPage />} />
        <Route path="/literacy" element={<QuizCard />} />
      </Route>

      {/* 2. Standalone Auth Pages without Public Navbar */}
      <Route path="/login" element={<Login />} />
      <Route path="/register" element={<Register />} />

      {/* 3. Protected Dashboard CMS Shell (Sidebar + Workspace) */}
      <Route
        element={
          <ProtectedRoute>
            <DashboardShell />
          </ProtectedRoute>
        }
      >
        <Route path="/dashboard" element={<Navigate to="/scanner" replace />} />
        <Route path="/scanner" element={<ContractUpload />} />
        <Route path="/evidence" element={<EvidenceUploader />} />
        <Route path="/assistant" element={<AssistantChat />} />
      </Route>

      {/* Catch-all fallback */}
      <Route path="*" element={<Navigate to="/" replace />} />
    </Routes>
  );
};
