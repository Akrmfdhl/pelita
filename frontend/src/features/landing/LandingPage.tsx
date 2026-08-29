import React from 'react';
import { HeroSection } from './components/HeroSection';
import { BentoShowcaseSection } from './components/BentoShowcaseSection';
import { MetricsWallSection } from './components/MetricsWallSection';
import { CapabilitiesSection } from './components/CapabilitiesSection';
import { WorkflowCircuitSection } from './components/WorkflowCircuitSection';
import { LoanCalculatorSection } from './components/LoanCalculatorSection';
import { CtaBannerSection } from './components/CtaBannerSection';

export const LandingPage: React.FC = () => {
  return (
    <div className="space-y-24 md:space-y-32 pb-16 overflow-hidden">
      <HeroSection />
      <BentoShowcaseSection />
      <MetricsWallSection />
      <CapabilitiesSection />
      <WorkflowCircuitSection />
      <LoanCalculatorSection />
      <CtaBannerSection />
    </div>
  );
};
