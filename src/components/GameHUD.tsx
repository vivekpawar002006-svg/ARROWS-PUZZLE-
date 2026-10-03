import React from 'react';
import { GameStats, GameMode } from '../types';
import { Volume2, VolumeX, RotateCcw, Flame, Wind as WindIcon, Timer, Target } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';

interface GameHUDProps {
  stats: GameStats;
  gameMode: GameMode;
  wind: number;
  soundEnabled: boolean;
  onToggleSound: () => void;
  onRestart: () => void;
  onOpenSettings: () => void;
}

export const GameHUD: React.FC<GameHUDProps> = ({
  stats,
  gameMode,
  wind,
  soundEnabled,
  onToggleSound,
  onRestart,
}) => {
  // Arrow quiver icons list
  const arrowSlots = Array.from({ length: Math.min(stats.arrowsLeft, 10) });

  return (
    <div id="game-hud-overlay" className="absolute top-0 left-0 right-0 p-3 md:p-5 pointer-events-none z-10">
      <div className="flex flex-wrap items-center justify-between gap-3 max-w-6xl mx-auto">
        {/* Left: Score & High Score */}
        <div className="flex items-center gap-3 bg-slate-900/85 backdrop-blur-md px-4 py-2.5 rounded-xl border border-slate-700/60 shadow-lg pointer-events-auto">
          <div className="flex flex-col">
            <span className="text-[11px] font-semibold text-slate-400 tracking-wider uppercase">Score</span>
            <motion.span
              key={stats.score}
              initial={{ scale: 1.25, color: '#f59e0b' }}
              animate={{ scale: 1, color: '#ffffff' }}
              className="text-2xl md:text-3xl font-extrabold text-white tracking-tight leading-none"
            >
              {stats.score.toLocaleString()}
            </motion.span>
          </div>

          <div className="h-8 w-px bg-slate-700/60 mx-1" />

          <div className="flex flex-col">
            <span className="text-[10px] font-medium text-slate-400 uppercase">Best</span>
            <span className="text-sm md:text-base font-bold text-amber-400 leading-none">
              {stats.highScore.toLocaleString()}
            </span>
          </div>

          {/* Combo Multiplier Badge */}
          <AnimatePresence>
            {stats.combo > 1 && (
              <motion.div
                initial={{ scale: 0, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                exit={{ scale: 0, opacity: 0 }}
                className="flex items-center gap-1 bg-gradient-to-r from-amber-500 to-orange-500 text-white text-xs font-black px-2.5 py-1 rounded-full shadow-md ml-1"
              >
                <Flame className="w-3.5 h-3.5 fill-current animate-pulse" />
                <span>{stats.combo}x STREAK</span>
              </motion.div>
            )}
          </AnimatePresence>
        </div>

        {/* Center: Quiver / Timer & Wind */}
        <div className="flex items-center gap-2 md:gap-3 pointer-events-auto">
          {/* Mode Indicator & Arrows / Timer */}
          {gameMode === 'balloons' ? (
            <div className="flex items-center gap-2 bg-slate-900/85 backdrop-blur-md px-3.5 py-2 rounded-xl border border-slate-700/60 shadow-lg text-white">
              <Timer className="w-4 h-4 text-emerald-400" />
              <div className="flex flex-col">
                <span className="text-[10px] text-slate-400 uppercase font-medium">Time</span>
                <span
                  className={`text-lg font-black tracking-tight ${
                    stats.timeLeft <= 10 ? 'text-red-400 animate-pulse' : 'text-emerald-400'
                  }`}
                >
                  {stats.timeLeft}s
                </span>
              </div>
            </div>
          ) : (
            <div className="flex items-center gap-2 bg-slate-900/85 backdrop-blur-md px-3.5 py-2 rounded-xl border border-slate-700/60 shadow-lg">
              <div className="flex flex-col">
                <div className="flex items-center justify-between gap-2">
                  <span className="text-[10px] text-slate-400 uppercase font-medium">Arrows Quiver</span>
                  <span className="text-xs font-bold text-amber-400">
                    {stats.arrowsLeft} left
                  </span>
                </div>
                {/* Visual Arrow Icons */}
                <div className="flex items-center gap-1 mt-1">
                  {arrowSlots.map((_, i) => (
                    <motion.div
                      key={i}
                      initial={{ scale: 0.5 }}
                      animate={{ scale: 1 }}
                      className="w-1.5 h-4 bg-amber-400 rounded-sm shadow-sm"
                    />
                  ))}
                  {stats.arrowsLeft > 10 && (
                    <span className="text-[10px] text-slate-400 font-bold ml-1">+{stats.arrowsLeft - 10}</span>
                  )}
                  {stats.arrowsLeft <= 0 && (
                    <span className="text-xs text-red-400 font-bold">Empty</span>
                  )}
                </div>
              </div>
            </div>
          )}

          {/* Wind Vane Widget */}
          <div className="flex items-center gap-2 bg-slate-900/85 backdrop-blur-md px-3.5 py-2 rounded-xl border border-slate-700/60 shadow-lg text-white">
            <WindIcon
              className={`w-4 h-4 transition-transform duration-300 ${
                wind > 0 ? 'text-cyan-400' : wind < 0 ? 'text-amber-400 -scale-x-100' : 'text-slate-400'
              }`}
            />
            <div className="flex flex-col">
              <span className="text-[10px] text-slate-400 uppercase font-medium">Wind</span>
              <span className="text-xs font-bold tracking-tight text-slate-200">
                {wind === 0
                  ? '0.0 m/s'
                  : `${Math.abs(wind).toFixed(1)} m/s ${wind > 0 ? 'East →' : '← West'}`}
              </span>
            </div>
          </div>
        </div>

        {/* Right: Sound & Restart Controls */}
        <div className="flex items-center gap-2 pointer-events-auto">
          <button
            id="hud-sound-toggle"
            onClick={onToggleSound}
            aria-label={soundEnabled ? 'Mute sound' : 'Unmute sound'}
            className="p-2.5 rounded-xl bg-slate-900/85 backdrop-blur-md border border-slate-700/60 text-slate-300 hover:text-white hover:bg-slate-800 transition-colors shadow-lg active:scale-95"
          >
            {soundEnabled ? <Volume2 className="w-5 h-5 text-emerald-400" /> : <VolumeX className="w-5 h-5 text-slate-400" />}
          </button>

          <button
            id="hud-restart-btn"
            onClick={onRestart}
            aria-label="Restart Game"
            className="flex items-center gap-1.5 px-3.5 py-2.5 rounded-xl bg-slate-900/85 backdrop-blur-md border border-slate-700/60 text-slate-200 hover:text-white hover:bg-slate-800 transition-all shadow-lg active:scale-95 text-xs font-semibold"
          >
            <RotateCcw className="w-4 h-4 text-amber-400" />
            <span className="hidden sm:inline">Restart</span>
          </button>
        </div>
      </div>
    </div>
  );
};
