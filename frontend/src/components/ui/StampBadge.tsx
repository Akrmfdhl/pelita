import React from 'react';
import { RiskLevel } from '../../types';
import { ShieldCheck, ShieldAlert, ShieldX } from 'lucide-react';

interface StampBadgeProps {
  level: RiskLevel;
  className?: string;
  animate?: boolean;
}

export const StampBadge: React.FC<StampBadgeProps> = ({ level, className = '', animate = true }) => {
  const configs: Record<string, { label: string; sublabel: string; color: string; icon: typeof ShieldCheck; ringColor: string }> = {
    low: {
      label: 'RESMI OJK',
      sublabel: 'SESUAI REGULASI',
      color: 'border-stamp-teal text-stamp-teal bg-stamp-teal-bg/60',
      icon: ShieldCheck,
      ringColor: 'ring-stamp-teal/20',
    },
    medium: {
      label: 'PERINGATAN',
      sublabel: 'KLAUSUL BERISIKO',
      color: 'border-stamp-amber text-stamp-amber bg-stamp-amber-bg/60',
      icon: ShieldAlert,
      ringColor: 'ring-stamp-amber/20',
    },
    danger: {
      label: 'BERBAHAYA',
      sublabel: 'PELANGGARAN HUKUM',
      color: 'border-stamp-red text-stamp-red bg-stamp-red-bg/60',
      icon: ShieldX,
      ringColor: 'ring-stamp-red/20',
    },
    high: {
      label: 'ILEGAL',
      sublabel: 'PELANGGARAN HUKUM',
      color: 'border-stamp-red text-stamp-red bg-stamp-red-bg/60',
      icon: ShieldX,
      ringColor: 'ring-stamp-red/20',
    },
    illegal_entity: {
      label: 'ILEGAL',
      sublabel: 'TIDAK TERDAFTAR OJK',
      color: 'border-stamp-red text-stamp-red bg-stamp-red-bg/60',
      icon: ShieldX,
      ringColor: 'ring-stamp-red/20',
    },
  };

  const config = configs[level] || configs.medium;
  const Icon = config.icon;

  return (
    <div
      className={`inline-flex flex-col items-center justify-center border-2 border-dashed px-3.5 py-1.5 rounded-sm font-mono select-none shadow-sm ring-4 ${config.ringColor} ${config.color} ${
        animate ? 'animate-stamp' : ''
      } ${className}`}
    >
      <div className="flex items-center gap-1.5">
        <Icon className="w-4 h-4 stroke-[2.5]" />
        <span className="font-bold text-sm tracking-widest">{config.label}</span>
      </div>
      <span className="text-[9px] font-semibold tracking-wider opacity-90">{config.sublabel}</span>
    </div>
  );
};
