import React from 'react';
import { Routes, Route } from 'react-router-dom';
import { AppShell } from '../components/layout/AppShell';
import { ContractUpload } from '../features/contracts/ContractUpload';
import { EvidenceUploader } from '../features/evidence/EvidenceUploader';
import { AssistantChat } from '../features/reporting/AssistantChat';
import { QuizCard } from '../features/literacy/QuizCard';

export const AppRoutes: React.FC = () => {
  return (
    <Routes>
      <Route element={<AppShell />}>
        <Route path="/" element={<ContractUpload />} />
        <Route path="/evidence" element={<EvidenceUploader />} />
        <Route path="/assistant" element={<AssistantChat />} />
        <Route path="/literacy" element={<QuizCard />} />
      </Route>
    </Routes>
  );
};
