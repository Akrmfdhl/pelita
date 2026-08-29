import React from 'react';

interface PelitaLogoProps {
  size?: 'sm' | 'md' | 'lg' | 'xl';
  variant?: 'icon' | 'horizontal' | 'badge';
  className?: string;
  theme?: 'light' | 'dark' | 'color';
}

export const PelitaLogo: React.FC<PelitaLogoProps> = ({
  size = 'md',
  variant = 'horizontal',
  className = '',
  theme = 'color',
}) => {
  const sizeMap = {
    sm: { icon: 24, text: 'text-xs', sub: 'text-[9px]' },
    md: { icon: 32, text: 'text-sm', sub: 'text-[11px]' },
    lg: { icon: 44, text: 'text-lg', sub: 'text-xs' },
    xl: { icon: 56, text: 'text-2xl', sub: 'text-sm' },
  };

  const dim = sizeMap[size];

  const renderIcon = () => (
    <svg
      width={dim.icon}
      height={dim.icon}
      viewBox="0 0 48 48"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className="shrink-0 transition-transform duration-200"
    >
      <defs>
        <linearGradient id="pelitaFlame" x1="24" y1="6" x2="24" y2="28" gradientUnits="userSpaceOnUse">
          <stop offset="0%" stopColor="#FFEC89" />
          <stop offset="40%" stopColor="#F59E0B" />
          <stop offset="100%" stopColor="#BA3801" />
        </linearGradient>
        <linearGradient id="pelitaShield" x1="24" y1="2" x2="24" y2="46" gradientUnits="userSpaceOnUse">
          <stop offset="0%" stopColor="#1E2C4F" />
          <stop offset="100%" stopColor="#0F172A" />
        </linearGradient>
        <linearGradient id="pelitaGold" x1="12" y1="18" x2="36" y2="38" gradientUnits="userSpaceOnUse">
          <stop offset="0%" stopColor="#FFF2A3" />
          <stop offset="100%" stopColor="#EAB308" />
        </linearGradient>
        <filter id="flameGlow" x="12" y="2" width="24" height="30" filterUnits="userSpaceOnUse">
          <feGaussianBlur stdDeviation="1.5" result="glow" />
          <feComposite in="SourceGraphic" in2="glow" operator="over" />
        </filter>
      </defs>

      {/* Outer Shield Contour */}
      <path
        d="M24 3L40 9V22C40 32.5 33.2 42.1 24 45C14.8 42.1 8 32.5 8 22V9L24 3Z"
        fill={theme === 'dark' ? '#0F172A' : '#1E2C4F'}
        stroke="#BA3801"
        strokeWidth="1.5"
        strokeLinejoin="round"
      />

      {/* Inner Accent Ring */}
      <path
        d="M24 6L37 11V22C37 30.5 31.5 38.5 24 41C16.5 38.5 11 30.5 11 22V11L24 6Z"
        fill="#1E2C4F"
        opacity="0.9"
      />

      {/* Scales Balance Beam */}
      <path
        d="M15 22C18 20.5 30 20.5 33 22"
        stroke="url(#pelitaGold)"
        strokeWidth="2"
        strokeLinecap="round"
      />

      {/* Central Pillar */}
      <line x1="24" y1="14" x2="24" y2="36" stroke="url(#pelitaGold)" strokeWidth="2" strokeLinecap="round" />

      {/* Left Balance Pan (Suspended) */}
      <path d="M15 22L12 28M15 22L18 28" stroke="#FFEC89" strokeWidth="1" strokeLinecap="round" />
      <path d="M11 28C11 30.5 19 30.5 19 28H11Z" fill="#F59E0B" stroke="#FFEC89" strokeWidth="1" />

      {/* Right Balance Pan (Suspended) */}
      <path d="M33 22L30 28M33 22L36 28" stroke="#FFEC89" strokeWidth="1" strokeLinecap="round" />
      <path d="M29 28C29 30.5 37 30.5 37 28H29Z" fill="#F59E0B" stroke="#FFEC89" strokeWidth="1" />

      {/* Pedestal Base */}
      <path d="M19 36H29L31 39H17L19 36Z" fill="#BA3801" />

      {/* Center Beacon Flame (The Pelita Light of Truth) */}
      <path
        d="M24 8C21 13 20 16 22 19C23 20.5 25 20.5 26 19C28 16 27 13 24 8Z"
        fill="url(#pelitaFlame)"
        filter="url(#flameGlow)"
      />
      <circle cx="24" cy="16" r="2" fill="#FFFFFF" opacity="0.9" />
    </svg>
  );

  if (variant === 'icon') {
    return <div className={`inline-flex items-center justify-center ${className}`}>{renderIcon()}</div>;
  }

  if (variant === 'badge') {
    return (
      <div
        className={`inline-flex items-center gap-2.5 px-3 py-1.5 rounded-2xl bg-white/90 backdrop-blur-md border border-slate-200/80 shadow-2xs ${className}`}
      >
        {renderIcon()}
        <div className="flex flex-col text-left">
          <span className={`font-semibold tracking-tight leading-none text-[#1E2C4F] ${dim.text}`}>
            PELITA
          </span>
          <span className={`font-mono text-slate-400 leading-tight ${dim.sub}`}>
            Integritas Hukum AI
          </span>
        </div>
      </div>
    );
  }

  return (
    <div className={`inline-flex items-center gap-2.5 ${className}`}>
      {renderIcon()}
      <div className="flex flex-col text-left min-w-0">
        <div className="flex items-center gap-1.5">
          <span className={`font-semibold tracking-tight text-[#1E2C4F] ${dim.text}`}>
            PELITA
          </span>
          <span className="text-[9px] font-mono font-semibold bg-[#BA3801] text-white px-1.5 py-0.2 rounded-full leading-none">
            AI
          </span>
        </div>
        <span className={`text-slate-400 font-normal leading-tight truncate ${dim.sub}`}>
          Advokasi &amp; Integritas Finansial
        </span>
      </div>
    </div>
  );
};
