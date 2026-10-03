import React from 'react';
import { GameStats, GameMode } from '../types';
import { Trophy, Star, Target, Flame, RotateCcw, Award } from 'lucide-react';
import { motion } from 'motion/react';

interface GameOverModalProps {
  stats: GameStats;
  gameMode: GameMode;
  onPlayAgain: () => void;
}

export const GameOverModal: React.FC<GameOverModalProps> = ({
  stats,
  gameMode,
  onPlayAgain,
}) => {
  const isNewHighScore = stats.score > 0 && stats.score >= stats.highScore;

  // Rating calculation: 1 to 3 stars
  let stars = 1;
  if (gameMode === 'classic') {
    if (stats.score >= 700) stars = 3;
    else if (stats.score >= 400) stars = 2;
  } else if (gameMode === 'balloons') {
    if (stats.score >= 1800) stars = 3;
    else if (stats.score >= 900) stars = 2;
  } else {
    if (stats.score >= 1000) stars = 3;
    else if (stats.score >= 500) stars = 2;
  }

  const accuracy = stats.totalArrowsShot > 0
    ? Math.round((stats.hits / stats.totalArrowsShot) * 100)
    : 0;

  return (
    <div
      id="game-over-modal-backdrop"
      className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/70 backdrop-blur-sm"
    >
      <motion.div
        initial={{ scale: 0.85, opacity: 0, y: 20 }}
        animate={{ scale: 1, opacity: 1, y: 0 }}
        exit={{ scale: 0.85, opacity: 0, y: 20 }}
        transition={{ type: 'spring', damping: 25, stiffness: 300 }}
        id="game-over-card"
        className="w-full max-w-md bg-slate-900 border border-slate-700/80 rounded-3xl p-6 md:p-8 shadow-2xl text-center text-white relative overflow-hidden"
      >
        {/* Glow ambient background */}
        <div className="absolute -top-20 left-1/2 -translate-x-1/2 w-48 h-48 bg-amber-500/20 rounded-full blur-3xl pointer-events-none" />

        {/* Header Icon */}
        <div className="relative mx-auto w-16 h-16 rounded-2xl bg-gradient-to-tr from-amber-600 to-amber-400 flex items-center justify-center shadow-lg mb-4">
          <Trophy className="w-9 h-9 text-slate-950 fill-current" />
        </div>

        <h2 className="text-2xl md:text-3xl font-black tracking-tight mb-1">
          {gameMode === 'balloons' ? 'Time Up!' : 'Game Finished!'}
        </h2>
        <p className="text-xs md:text-sm text-slate-400 mb-5">
          {stars === 3
            ? 'Outstanding Master Archer Performance!'
            : stars === 2
            ? 'Great shooting! Keep practicing for perfection!'
            : 'Good effort! Aim carefully and adjust for wind!'}
        </p>

        {/* Stars */}
        <div className="flex justify-center items-center gap-2 mb-6">
          {[1, 2, 3].map(sIndex => (
            <motion.div
              key={sIndex}
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              transition={{ delay: 0.15 + sIndex * 0.15, type: 'spring' }}
            >
              <Star
                className={`w-9 h-9 ${
                  sIndex <= stars
                    ? 'text-amber-400 fill-amber-400 drop-shadow-[0_0_8px_rgba(251,191,36,0.5)]'
                    : 'text-slate-700 fill-slate-800'
                }`}
              />
            </motion.div>
          ))}
        </div>

        {/* Score Display Card */}
        <div className="bg-slate-800/80 border border-slate-700/60 rounded-2xl p-4 mb-6 relative">
          {isNewHighScore && (
            <div className="inline-flex items-center gap-1 bg-gradient-to-r from-amber-500 to-yellow-400 text-slate-950 text-[10px] font-black uppercase px-2.5 py-0.5 rounded-full mb-1">
              <Award className="w-3 h-3" /> New High Score!
            </div>
          )}
          <div className="text-4xl md:text-5xl font-extrabold text-white tracking-tight my-1">
            {stats.score.toLocaleString()}
          </div>
          <div className="text-xs text-slate-400">Total Points Earned</div>
        </div>

        {/* Stats Grid */}
        <div className="grid grid-cols-3 gap-2.5 mb-7">
          <div className="bg-slate-800/50 border border-slate-700/40 rounded-xl p-3 flex flex-col items-center">
            <Target className="w-4 h-4 text-red-400 mb-1" />
            <span className="text-lg font-bold text-slate-100">{stats.bullseyes}</span>
            <span className="text-[10px] text-slate-400 font-medium">Bullseyes</span>
          </div>

          <div className="bg-slate-800/50 border border-slate-700/40 rounded-xl p-3 flex flex-col items-center">
            <Flame className="w-4 h-4 text-orange-400 mb-1" />
            <span className="text-lg font-bold text-slate-100">{stats.maxCombo}x</span>
            <span className="text-[10px] text-slate-400 font-medium">Max Streak</span>
          </div>

          <div className="bg-slate-800/50 border border-slate-700/40 rounded-xl p-3 flex flex-col items-center">
            <Award className="w-4 h-4 text-emerald-400 mb-1" />
            <span className="text-lg font-bold text-slate-100">{accuracy}%</span>
            <span className="text-[10px] text-slate-400 font-medium">Accuracy</span>
          </div>
        </div>

        {/* Action Button */}
        <button
          id="play-again-btn"
          onClick={onPlayAgain}
          className="w-full flex items-center justify-center gap-2 bg-gradient-to-r from-amber-500 to-amber-600 hover:from-amber-400 hover:to-amber-500 text-slate-950 font-black py-3.5 px-6 rounded-2xl shadow-lg transition-all active:scale-[0.98] text-base"
        >
          <RotateCcw className="w-5 h-5" />
          <span>Shoot Again</span>
        </button>
      </motion.div>
    </div>
  );
};
