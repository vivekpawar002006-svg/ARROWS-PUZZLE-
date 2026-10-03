import React from 'react';
import { Trophy, Star, RotateCcw, ArrowRight, Grid } from 'lucide-react';
import { motion } from 'motion/react';
import { AppLanguage } from '../../types';
import { translations } from '../../utils/translations';

interface PuzzleVictoryModalProps {
  levelNumber: number;
  levelName: string;
  moves: number;
  mistakes: number;
  timeSeconds: number;
  stars: number;
  hasNextLevel: boolean;
  language?: AppLanguage;
  onNextLevel: () => void;
  onReplay: () => void;
  onOpenLevelSelect: () => void;
}

export const PuzzleVictoryModal: React.FC<PuzzleVictoryModalProps> = ({
  levelNumber,
  levelName,
  moves,
  mistakes,
  timeSeconds,
  stars,
  hasNextLevel,
  language = 'en',
  onNextLevel,
  onReplay,
  onOpenLevelSelect,
}) => {
  const t = translations[language] || translations.en;

  const formatTime = (secs: number) => {
    const m = Math.floor(secs / 60);
    const s = secs % 60;
    return `${m}:${s < 10 ? '0' : ''}${s}`;
  };

  return (
    <div
      id="puzzle-victory-backdrop"
      className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/75 backdrop-blur-md"
    >
      <motion.div
        initial={{ scale: 0.8, opacity: 0, y: 25 }}
        animate={{ scale: 1, opacity: 1, y: 0 }}
        exit={{ scale: 0.8, opacity: 0, y: 25 }}
        transition={{ type: 'spring', damping: 22, stiffness: 300 }}
        id="puzzle-victory-card"
        className="w-full max-w-sm sm:max-w-md bg-slate-900 border border-slate-700/80 rounded-3xl p-6 md:p-8 shadow-2xl text-center text-white relative overflow-hidden"
      >
        {/* Ambient Top Glow */}
        <div className="absolute -top-24 left-1/2 -translate-x-1/2 w-56 h-56 bg-amber-500/20 rounded-full blur-3xl pointer-events-none" />

        {/* Victory Trophy Badge */}
        <div className="relative mx-auto w-16 h-16 rounded-2xl bg-gradient-to-tr from-amber-500 to-yellow-300 flex items-center justify-center shadow-xl mb-3">
          <Trophy className="w-9 h-9 text-slate-950 fill-current" />
        </div>

        <span className="text-xs font-bold uppercase tracking-wider text-amber-400">
          {language === 'hi' ? `लेवल ${levelNumber} पूरा हुआ!` : `Level ${levelNumber} Cleared!`}
        </span>
        <h2 className="text-2xl sm:text-3xl font-black tracking-tight text-white mt-0.5 mb-4">
          {levelName}
        </h2>

        {/* Star Rating Animation */}
        <div className="flex justify-center items-center gap-3 mb-6">
          {[1, 2, 3].map(sIndex => (
            <motion.div
              key={sIndex}
              initial={{ scale: 0, rotate: -20 }}
              animate={{ scale: 1, rotate: 0 }}
              transition={{ delay: 0.2 + sIndex * 0.15, type: 'spring' }}
            >
              <Star
                className={`w-10 h-10 ${
                  sIndex <= stars
                    ? 'text-amber-400 fill-amber-400 drop-shadow-[0_0_12px_rgba(251,191,36,0.6)]'
                    : 'text-slate-700 fill-slate-800'
                }`}
              />
            </motion.div>
          ))}
        </div>

        {/* Level Stats Summary */}
        <div className="grid grid-cols-3 gap-2.5 bg-slate-800/60 border border-slate-700/60 rounded-2xl p-3.5 mb-6">
          <div className="flex flex-col items-center">
            <span className="text-lg font-black text-white">{moves}</span>
            <span className="text-[10px] text-slate-400 uppercase font-semibold">{t.moves}</span>
          </div>
          <div className="flex flex-col items-center border-x border-slate-700/60">
            <span className={`text-lg font-black ${mistakes === 0 ? 'text-emerald-400' : 'text-amber-400'}`}>
              {mistakes}
            </span>
            <span className="text-[10px] text-slate-400 uppercase font-semibold">{t.mistakes}</span>
          </div>
          <div className="flex flex-col items-center">
            <span className="text-lg font-black text-cyan-400">{formatTime(timeSeconds)}</span>
            <span className="text-[10px] text-slate-400 uppercase font-semibold">
              {language === 'hi' ? 'समय' : 'Time'}
            </span>
          </div>
        </div>

        {/* Buttons */}
        <div className="flex flex-col gap-2.5">
          {hasNextLevel && (
            <button
              id="puzzle-next-level-btn"
              onClick={onNextLevel}
              className="w-full flex items-center justify-center gap-2 bg-gradient-to-r from-amber-500 to-amber-600 hover:from-amber-400 hover:to-amber-500 text-slate-950 font-black py-3.5 px-6 rounded-2xl shadow-lg transition-all active:scale-[0.98] text-base"
            >
              <span>{t.nextPuzzle}</span>
              <ArrowRight className="w-5 h-5" />
            </button>
          )}

          <div className="flex items-center gap-2">
            <button
              id="puzzle-replay-btn"
              onClick={onReplay}
              className="flex-1 flex items-center justify-center gap-1.5 py-3 px-4 rounded-xl bg-slate-800 hover:bg-slate-700 border border-slate-700 text-slate-200 text-xs font-bold transition-all active:scale-95"
            >
              <RotateCcw className="w-4 h-4 text-amber-400" />
              <span>{t.replay}</span>
            </button>

            <button
              id="puzzle-level-select-btn"
              onClick={onOpenLevelSelect}
              className="flex-1 flex items-center justify-center gap-1.5 py-3 px-4 rounded-xl bg-slate-800 hover:bg-slate-700 border border-slate-700 text-slate-200 text-xs font-bold transition-all active:scale-95"
            >
              <Grid className="w-4 h-4 text-cyan-400" />
              <span>{t.allLevels}</span>
            </button>
          </div>
        </div>
      </motion.div>
    </div>
  );
};
