import React, { useEffect, useRef } from 'react';

export type OrbState =
  | 'working'
  | 'searching'
  | 'solving'
  | 'listening'
  | 'connecting'
  | 'weaving'
  | 'composing'
  | 'breathing'
  | 'shaping'
  | 'thinking'
  | 'analyzing'
  | 'idle';

interface LitaThinkingOrbProps {
  size?: number | 'xs' | 'sm' | 'md' | 'lg' | 'xl';
  state?: OrbState;
  className?: string;
  theme?: 'dark' | 'light' | 'pelita';
}

export const LitaThinkingOrb: React.FC<LitaThinkingOrbProps> = ({
  size = 24,
  state = 'listening',
  className = '',
  theme = 'pelita',
}) => {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  const dim = typeof size === 'number' ? size : {
    xs: 18,
    sm: 24,
    md: 32,
    lg: 48,
    xl: 64,
  }[size];

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    let animationFrameId: number;
    let time = 0;

    const dpr = window.devicePixelRatio || 1;
    canvas.width = dim * dpr;
    canvas.height = dim * dpr;
    ctx.scale(dpr, dpr);

    const numPoints = 42;
    const points: { phi: number; theta: number; radius: number; speed: number; id: number }[] = [];

    for (let i = 0; i < numPoints; i++) {
      points.push({
        id: i,
        phi: Math.acos(-1 + (2 * i) / numPoints),
        theta: Math.sqrt(numPoints * Math.PI) * i,
        radius: (dim / 2) * 0.76,
        speed: 0.012 + (i % 6) * 0.003,
      });
    }

    const render = () => {
      time += 0.02;
      ctx.clearRect(0, 0, dim, dim);

      const centerX = dim / 2;
      const centerY = dim / 2;

      let speedMult = 1.0;
      let pulseScale = 1.0;
      let rotXSpeed = 0.5;
      let rotYSpeed = 0.7;

      switch (state) {
        case 'searching':
          speedMult = 2.2;
          rotXSpeed = 0.1;
          rotYSpeed = 1.6;
          pulseScale = 1.0 + Math.sin(time * 3) * 0.06;
          break;
        case 'solving':
        case 'thinking':
        case 'analyzing':
          speedMult = 2.6;
          rotXSpeed = 1.4;
          rotYSpeed = 1.1;
          pulseScale = 1.0 + Math.sin(time * 5) * 0.09;
          break;
        case 'working':
          speedMult = 1.8;
          rotXSpeed = 0.8;
          rotYSpeed = 0.9;
          break;
        case 'connecting':
        case 'weaving':
          speedMult = 1.4;
          rotXSpeed = 0.3;
          rotYSpeed = 1.2;
          pulseScale = 1.0 + Math.cos(time * 2) * 0.05;
          break;
        case 'composing':
        case 'shaping':
          speedMult = 1.6;
          rotXSpeed = 0.9;
          rotYSpeed = 0.4;
          pulseScale = 1.0 + Math.sin(time * 2.8) * 0.07;
          break;
        case 'breathing':
        case 'idle':
          speedMult = 0.8;
          pulseScale = 1.0 + Math.sin(time * 1.5) * 0.12;
          break;
        case 'listening':
        default:
          speedMult = 1.0;
          pulseScale = 1.0 + Math.sin(time * 2) * 0.04;
          break;
      }

      const rotX = time * rotXSpeed * speedMult;
      const rotY = time * rotYSpeed * speedMult;

      const projectedPoints: { x: number; y: number; z: number; color: string; size: number }[] = [];

      for (let i = 0; i < points.length; i++) {
        const p = points[i];
        let currentTheta = p.theta + time * p.speed * speedMult;

        if (state === 'searching') {
          currentTheta = p.theta + time * 0.04 * speedMult;
        }

        const x0 = p.radius * pulseScale * Math.sin(p.phi) * Math.cos(currentTheta);
        const y0 = p.radius * pulseScale * Math.sin(p.phi) * Math.sin(currentTheta);
        const z0 = p.radius * pulseScale * Math.cos(p.phi);

        const y1 = y0 * Math.cos(rotX) - z0 * Math.sin(rotX);
        const z1 = y0 * Math.sin(rotX) + z0 * Math.cos(rotX);

        const x2 = x0 * Math.cos(rotY) + z1 * Math.sin(rotY);
        const z2 = -x0 * Math.sin(rotY) + z1 * Math.cos(rotY);

        const scale = (z2 + dim) / (dim * 1.5);
        const screenX = centerX + x2;
        const screenY = centerY + y1;

        const alpha = Math.max(0.18, Math.min(1.0, (z2 + p.radius) / (2 * p.radius)));

        let color = `rgba(255, 255, 255, ${alpha * 0.9})`;
        if (theme === 'pelita') {
          if (i % 3 === 0) {
            color = `rgba(186, 56, 1, ${alpha})`;
          } else if (i % 4 === 0) {
            color = `rgba(255, 236, 137, ${alpha * 0.95})`;
          } else {
            color = `rgba(30, 44, 79, ${alpha * 0.85})`;
          }
        } else if (theme === 'light') {
          color = `rgba(15, 23, 42, ${alpha * 0.85})`;
        }

        projectedPoints.push({
          x: screenX,
          y: screenY,
          z: z2,
          color,
          size: Math.max(1.1, scale * 2.0),
        });
      }

      projectedPoints.sort((a, b) => a.z - b.z);

      for (const pt of projectedPoints) {
        ctx.beginPath();
        ctx.arc(pt.x, pt.y, pt.size, 0, Math.PI * 2);
        ctx.fillStyle = pt.color;
        ctx.fill();
      }

      animationFrameId = requestAnimationFrame(render);
    };

    render();

    return () => {
      cancelAnimationFrame(animationFrameId);
    };
  }, [dim, state, theme]);

  return (
    <div
      className={`relative inline-flex items-center justify-center shrink-0 ${className}`}
      style={{ width: dim, height: dim }}
    >
      <canvas
        ref={canvasRef}
        style={{ width: dim, height: dim }}
        className="rounded-full select-none pointer-events-none"
      />
    </div>
  );
};

export const ProcessOrbPill: React.FC<{
  state: OrbState;
  label: string;
  className?: string;
  theme?: 'dark' | 'light' | 'pelita';
}> = ({ state, label, className = '', theme = 'dark' }) => {
  return (
    <div
      className={`inline-flex items-center gap-2.5 px-3.5 py-1.5 rounded-full font-mono text-xs font-medium transition-all shadow-2xs select-none ${
        theme === 'dark'
          ? 'bg-slate-900/90 backdrop-blur-md text-slate-200 border border-slate-700/80'
          : 'bg-white/95 backdrop-blur-md text-slate-800 border border-slate-200/90 shadow-2xs'
      } ${className}`}
    >
      <LitaThinkingOrb size={18} state={state} theme={theme === 'dark' ? 'dark' : 'pelita'} />
      <span className="tracking-tight text-[11px] sm:text-xs">{label}</span>
    </div>
  );
};
