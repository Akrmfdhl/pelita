import React from 'react';

interface PelitaMascotProps {
  size?: 'sm' | 'md' | 'lg' | 'xl' | 'hero';
  mood?: 'guiding' | 'analyzing' | 'alert' | 'success';
  className?: string;
  withSpeechBubble?: boolean;
  speechText?: string;
}

export const PelitaMascot: React.FC<PelitaMascotProps> = ({
  size = 'md',
  mood = 'guiding',
  className = '',
  withSpeechBubble = false,
  speechText = 'Halo! Saya Lita, asisten hukum dan pelindung integritas finansial Anda.',
}) => {
  const sizeMap = {
    sm: 36,
    md: 52,
    lg: 84,
    xl: 120,
    hero: 160,
  };

  const dim = sizeMap[size];

  const getMoodEyeColor = () => {
    switch (mood) {
      case 'alert':
        return '#EF4444';
      case 'success':
        return '#10B981';
      case 'analyzing':
        return '#3B82F6';
      default:
        return '#F59E0B';
    }
  };

  const eyeGlowColor = getMoodEyeColor();

  return (
    <div className={`inline-flex items-center gap-3 select-none ${className}`}>
      <div className="relative group shrink-0">
        <svg
          width={dim}
          height={dim}
          viewBox="0 0 100 100"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
          className="transition-transform duration-300 group-hover:scale-105"
        >
          <defs>
            <linearGradient id="litaBody" x1="50" y1="20" x2="50" y2="85" gradientUnits="userSpaceOnUse">
              <stop offset="0%" stopColor="#2E3E6E" />
              <stop offset="100%" stopColor="#1E2C4F" />
            </linearGradient>
            <linearGradient id="litaArmor" x1="50" y1="45" x2="50" y2="80" gradientUnits="userSpaceOnUse">
              <stop offset="0%" stopColor="#FFFFFF" />
              <stop offset="50%" stopColor="#F1F5F9" />
              <stop offset="100%" stopColor="#E2E8F0" />
            </linearGradient>
            <linearGradient id="litaLantern" x1="82" y1="50" x2="82" y2="78" gradientUnits="userSpaceOnUse">
              <stop offset="0%" stopColor="#FFF2A3" />
              <stop offset="60%" stopColor="#F59E0B" />
              <stop offset="100%" stopColor="#BA3801" />
            </linearGradient>
            <filter id="lanternGlow" x="65" y="40" width="35" height="45" filterUnits="userSpaceOnUse">
              <feGaussianBlur stdDeviation="3" result="glow" />
              <feComposite in="SourceGraphic" in2="glow" operator="over" />
            </filter>
            <filter id="eyeGlow" x="25" y="25" width="50" height="30" filterUnits="userSpaceOnUse">
              <feGaussianBlur stdDeviation="1.5" result="glow" />
              <feComposite in="SourceGraphic" in2="glow" operator="over" />
            </filter>
          </defs>

          {/* Owl Ear Tufts / Sentinel Antennas */}
          <path d="M30 35L22 15L42 25Z" fill="#1E2C4F" />
          <path d="M26 22L34 26" stroke="#BA3801" strokeWidth="2" strokeLinecap="round" />
          <path d="M70 35L78 15L58 25Z" fill="#1E2C4F" />
          <path d="M74 22L66 26" stroke="#BA3801" strokeWidth="2" strokeLinecap="round" />

          {/* Main Body (Egg-shaped Sentinel Owl) */}
          <ellipse cx="50" cy="54" rx="32" ry="34" fill="url(#litaBody)" />

          {/* Protective Breastplate Armor */}
          <path
            d="M32 50C32 46 68 46 68 50C68 68 58 76 50 78C42 76 32 68 32 50Z"
            fill="url(#litaArmor)"
            stroke="#CBD5E1"
            strokeWidth="1.5"
          />

          {/* Armor Core Emblem (Mini Scales of Justice) */}
          <circle cx="50" cy="60" r="5" fill="#1E2C4F" />
          <path d="M48 60H52M50 58V62" stroke="#FFEC89" strokeWidth="1" strokeLinecap="round" />

          {/* Wings */}
          {/* Left Wing (holding analytic lens) */}
          <path
            d="M20 48C16 56 18 72 26 76C24 66 22 56 26 50Z"
            fill="#1E2C4F"
            stroke="#BA3801"
            strokeWidth="1"
          />
          {/* Analytical Evidence Lens */}
          <circle cx="16" cy="62" r="7" fill="#E2E8F0" stroke="#BA3801" strokeWidth="2" opacity="0.9" />
          <circle cx="16" cy="62" r="5" fill="#3B82F6" opacity="0.3" />
          <line x1="16" y1="69" x2="20" y2="76" stroke="#BA3801" strokeWidth="2.5" strokeLinecap="round" />

          {/* Right Wing (holding glowing Pelita lantern) */}
          <path
            d="M80 48C84 56 82 72 74 76C76 66 78 56 74 50Z"
            fill="#1E2C4F"
            stroke="#BA3801"
            strokeWidth="1"
          />
          {/* Crystal Pelita Lantern */}
          <path
            d="M76 52H88L90 68L82 74L74 68L76 52Z"
            fill="url(#litaLantern)"
            filter="url(#lanternGlow)"
          />
          <path d="M78 52L82 46L86 52" stroke="#FFEC89" strokeWidth="1.5" strokeLinecap="round" />
          <line x1="82" y1="46" x2="78" y2="58" stroke="#FFFFFF" strokeWidth="1" opacity="0.8" />

          {/* Owl Facial Disk & Glasses Visor */}
          <circle cx="38" cy="38" r="13" fill="#1E2C4F" stroke="#BA3801" strokeWidth="2" />
          <circle cx="62" cy="38" r="13" fill="#1E2C4F" stroke="#BA3801" strokeWidth="2" />
          {/* Visor Bridge */}
          <line x1="49" y1="38" x2="51" y2="38" stroke="#BA3801" strokeWidth="3" strokeLinecap="round" />

          {/* Analytical High-Tech Eyes */}
          <g filter="url(#eyeGlow)">
            <circle cx="38" cy="38" r="8" fill={eyeGlowColor} />
            <circle cx="38" cy="38" r="4" fill="#0F172A" />
            <circle cx="36" cy="36" r="2" fill="#FFFFFF" />

            <circle cx="62" cy="38" r="8" fill={eyeGlowColor} />
            <circle cx="62" cy="38" r="4" fill="#0F172A" />
            <circle cx="60" cy="36" r="2" fill="#FFFFFF" />
          </g>

          {/* Golden Beak */}
          <path d="M47 43L53 43L50 51Z" fill="#F59E0B" stroke="#B45309" strokeWidth="1" />

          {/* Talons / Pedestal Rest */}
          <ellipse cx="42" cy="85" rx="5" ry="3" fill="#F59E0B" />
          <ellipse cx="58" cy="85" rx="5" ry="3" fill="#F59E0B" />
        </svg>
      </div>

      {withSpeechBubble && (
        <div className="relative bg-white/95 backdrop-blur-xl border border-slate-200/80 rounded-2xl p-3.5 shadow-sm max-w-xs text-xs space-y-1 animate-fadeIn">
          <div className="flex items-center gap-1.5 font-mono text-[10px] font-semibold text-[#BA3801] uppercase tracking-wider">
            <span>Lita</span>
            <span className="w-1.5 h-1.5 rounded-full bg-emerald-500" />
            <span className="text-slate-400 font-normal">AI Sentinel</span>
          </div>
          <p className="text-[#1E2C4F] font-normal leading-relaxed">{speechText}</p>
        </div>
      )}
    </div>
  );
};
