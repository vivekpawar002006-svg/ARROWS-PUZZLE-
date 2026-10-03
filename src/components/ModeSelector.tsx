import React from 'react';
import { GameMode, TrailStyle } from '../types';
import { Target, Sparkles, Crosshair, Flame, Zap } from 'lucide-react';

interface ModeSelectorProps {
  currentMode: GameMode;
  onSelectMode: (mode: GameMode) => void;
  trailStyle: TrailStyle;
  onSelectTrail: (trail: TrailStyle) => void;
}

export const ModeSelector: React.FC<ModeSelectorProps> = ({
  currentMode,
  onSelectMode,
  trailStyle,
  onSelectTrail,
}) => {
  const modes: { id: GameMode; label: string; icon: React.ReactNode; desc: string }[] = [
    {
      id: 'classic',
      label: 'Classic Target',
      icon: <Target className="w-4 h-4 text-amber-500" />,
      desc: '10 Arrows • Standard Moving Board',
    },
    {
      id: 'balloons',
      label: 'Balloon Frenzy',
      icon: <Sparkles className="w-4 h-4 text-emerald-500" />,
      desc: '45s Blitz • Floating Bonus Balloons',
    },
    {
      id: 'trickshot',
      label: 'Apple Trick Shot',
      icon: <Crosshair className="w-4 h-4 text-red-500" />,
      desc: 'Precision Snipe • 500pt Moving Apple',
    },
  ];

  const trails: { id: TrailStyle; label: string; icon: React.ReactNode; color: string }[] = [
    { id: 'classic', label: 'Classic', icon: <span className="text-xs">🏹</span>, color: 'border-slate-500' },
    { id: 'fire', label: 'Fire Blaze', icon: <Flame className="w-3.5 h-3.5 text-orange-500" />, color: 'border-orange-500' },
    { id: 'neon', label: 'Neon Cyber', icon: <Zap className="w-3.5 h-3.5 text-cyan-400" />, color: 'border-cyan-400' },
    { id: 'rainbow', label: 'Rainbow', icon: <Sparkles className="w-3.5 h-3.5 text-pink-400" />, color: 'border-pink-400' },
  ];

  return (
    <div id="mode-selector-panel" className="flex flex-col md:flex-row items-stretch md:items-center justify-between gap-3 bg-slate-900/90 backdrop-blur-md p-3 rounded-2xl border border-slate-800 shadow-md">
      {/* Modes */}
      <div className="flex flex-wrap items-center gap-2">
        <span className="text-xs font-semibold text-slate-400 uppercase tracking-wider px-1">Mode:</span>
        {modes.map(m => {
          const isActive = currentMode === m.id;
          return (
            <button
              key={m.id}
              id={`mode-btn-${m.id}`}
              onClick={() => onSelectMode(m.id)}
              className={`flex items-center gap-2 px-3.5 py-2 rounded-xl text-xs font-bold transition-all ${
                isActive
                  ? 'bg-amber-500 text-slate-950 shadow-md scale-[1.02]'
                  : 'bg-slate-800/80 text-slate-300 hover:bg-slate-800 hover:text-white'
              }`}
            >
              {m.icon}
              <div className="flex flex-col text-left">
                <span>{m.label}</span>
              </div>
            </button>
          );
        })}
      </div>

      {/* Arrow Trail Styles */}
      <div className="flex items-center gap-2 pt-2 md:pt-0 border-t md:border-t-0 md:border-l border-slate-800 md:pl-4">
        <span className="text-xs font-semibold text-slate-400 uppercase tracking-wider px-1">Arrow Trail:</span>
        <div className="flex items-center gap-1.5">
          {trails.map(t => {
            const isSelected = trailStyle === t.id;
            return (
              <button
                key={t.id}
                id={`trail-btn-${t.id}`}
                onClick={() => onSelectTrail(t.id)}
                className={`flex items-center gap-1.5 px-2.5 py-1.5 rounded-lg text-xs font-semibold border transition-all ${
                  isSelected
                    ? 'bg-slate-800 text-white border-amber-400 ring-1 ring-amber-400/50'
                    : 'bg-slate-900/60 text-slate-400 border-slate-700/60 hover:text-slate-200'
                }`}
                title={t.label}
              >
                {t.icon}
                <span className="hidden sm:inline">{t.label}</span>
              </button>
            );
          })}
        </div>
      </div>
    </div>
  );
};
