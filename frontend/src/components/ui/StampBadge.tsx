import React from 'react';
import { RiskLevel } from '../../types';
import { ShieldCheck, ShieldAlert, ShieldX } from 'lucide-react';

interface StampBadgeProps {
  level: RiskLevel;
  className?: string;
  animate?: boolean;
}

export const StampBadge: React.FC<StampBadgeProps> = ({ level, className = '', animate = true }) => {
  const configs: Record<
    string,
    { label: string; sublabel: string; borderColor: string; textColor: string; bgColor: string; icon: typeof ShieldCheck }
  > = {
    low: {
      label: 'TERVERIFIKASI RESMI OJK',
      sublabel: 'PATUH POJK NO. 10/2022 & SEOJK 19/2023',
      borderColor: 'border-emerald-700',
      textColor: 'text-emerald-950',
      bgColor: 'bg-emerald-50',
      icon: ShieldCheck,
    },
    medium: {
      label: 'PERINGATAN RISIKO',
      sublabel: 'TERDETEKSI KLAUSUL NON-STANDAR',
      borderColor: 'border-amber-700',
      textColor: 'text-amber-950',
      bgColor: 'bg-amber-50',
      icon: ShieldAlert,
    },
    danger: {
      label: 'PERINGATAN KERAS: ILEGAL',
      sublabel: 'PELANGGARAN POJK & INDIKASI PIDANA',
      borderColor: 'border-rose-700',
      textColor: 'text-rose-950',
      bgColor: 'bg-rose-50',
      icon: ShieldX,
    },
    high: {
      label: 'PERINGATAN KERAS: ILEGAL',
      sublabel: 'PELANGGARAN POJK & INDIKASI PIDANA',
      borderColor: 'border-rose-700',
      textColor: 'text-rose-950',
      bgColor: 'bg-rose-50',
      icon: ShieldX,
    },
    illegal_entity: {
      label: 'ENTITAS TIDAK BERIZIN OJK',
      sublabel: 'TIDAK TERDAFTAR DALAM WHITELIST OJK',
      borderColor: 'border-rose-700',
      textColor: 'text-rose-950',
      bgColor: 'bg-rose-50',
      icon: ShieldX,
    },
  };

  const config = configs[level] || configs.medium;
  const Icon = config.icon;

  return (
    <div
      className={`border-2 border-double ${config.borderColor} ${config.bgColor} ${config.textColor} px-4 py-2.5 rounded-2xl font-mono select-none shadow-sm flex items-center gap-3 ${
        animate ? 'animate-fadeIn' : ''
      } ${className}`}
    >
      <div className="w-8 h-8 rounded-xl bg-white border border-current flex items-center justify-center shrink-0 shadow-2xs">
        <Icon className="w-4 h-4 stroke-[2.5]" />
      </div>
      <div>
        <span className="font-extrabold text-xs tracking-wider block leading-tight">{config.label}</span>
        <span className="text-[10px] font-semibold tracking-normal block text-opacity-90">{config.sublabel}</span>
      </div>
    </div>
  );
};
