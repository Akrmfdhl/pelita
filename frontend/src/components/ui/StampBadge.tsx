import React from 'react';
import { RiskLevel } from '../../types';
import { cn } from '../../lib/utils';
import { ShieldCheck, AlertTriangle, AlertOctagon, Ban } from 'lucide-react';

interface StampBadgeProps {
  level: RiskLevel;
  className?: string;
}

export const StampBadge: React.FC<StampBadgeProps> = ({ level, className }) => {
  switch (level) {
    case 'low':
      return (
        <span className={cn("stamp-badge border-stamp-teal text-stamp-teal bg-stamp-teal-bg", className)}>
          <ShieldCheck className="w-3.5 h-3.5" />
          RESMI & AMAN
        </span>
      );
    case 'medium':
      return (
        <span className={cn("stamp-badge border-stamp-amber text-stamp-amber bg-stamp-amber-bg", className)}>
          <AlertTriangle className="w-3.5 h-3.5" />
          WASPADAI RISIKO
        </span>
      );
    case 'danger':
      return (
        <span className={cn("stamp-badge border-stamp-red text-stamp-red bg-stamp-red-bg", className)}>
          <AlertOctagon className="w-3.5 h-3.5" />
          PELANGGARAN BERAT
        </span>
      );
    case 'illegal_entity':
      return (
        <span className={cn("stamp-badge border-stamp-red text-stamp-red bg-stamp-red-bg font-bold", className)}>
          <Ban className="w-3.5 h-3.5" />
          PINJOL ILEGAL
        </span>
      );
  }
};
