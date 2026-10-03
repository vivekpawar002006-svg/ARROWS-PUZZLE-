import React from 'react';
import { PUZZLE_LEVELS } from '../../data/puzzleLevels';
import { X, Star, Sparkles, Trophy } from 'lucide-react';
import { motion } from 'motion/react';
import { AppLanguage } from '../../types';
import { translations } from '../../utils/translations';

interface PuzzleLevelSelectModalProps {
  currentLevelId: number;
  completedLevels: Record<number, { stars: number }>;
  language?: AppLanguage;
  onSelectLevel: (levelId: number) => void;
  onSelectEndless: () => void;
  onClose: () => void;
}

export const PuzzleLevelSelectModal: React.FC<PuzzleLevelSelectModalProps> = ({
  currentLevelId,
  completedLevels,
  language = 'en',
  onSelectLevel,
  onSelectEndless,
  onClose,
}) => {
  const t = translations[language] || translations.en;

  return (
    <div
      id="puzzle-level-select-backdrop"
      className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-5 bg-black/80 backdrop-blur-md overflow-y-auto"
    >
      <motion.div
        initial={{ scale: 0.9, opacity: 0, y: 20 }}
        animate={{ scale: 1, opacity: 1, y: 0 }}
        exit={{ scale: 0.9, opacity: 0, y: 20 }}
        id="puzzle-level-select-card"
        className="w-full max-w-2xl bg-slate-900 border border-slate-700/80 rounded-3xl p-5 sm:p-7 shadow-2xl text-white relative my-auto max-h-[90vh] flex flex-col"
      >
        {/* Header */}
        <div className="flex items-center justify-between pb-4 border-b border-slate-800">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-xl bg-amber-500/20 text-amber-400 flex items-center justify-center border border-amber-500/30">
              <Trophy className="w-4 h-4" />
            </div>
            <div>
              <h2 className="text-lg font-black tracking-tight">{t.selectLevel}</h2>
              <p className="text-xs text-slate-400">
                {language === 'hi'
                  ? 'पहेली चुनें या अनंत मोड खेलें'
                  : 'Choose a puzzle challenge or endless mode'}
              </p>
            </div>
          </div>
          <button
            id="close-level-select-btn"
            onClick={onClose}
            className="p-1.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-400 hover:text-white transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Endless Mode Banner */}
        <div className="my-4">
          <button
            id="endless-mode-banner-btn"
            onClick={onSelectEndless}
            className="w-full bg-gradient-to-r from-amber-500/20 via-orange-500/20 to-pink-500/20 hover:from-amber-500/30 hover:to-pink-500/30 border border-amber-500/40 rounded-2xl p-4 flex items-center justify-between transition-all group active:scale-[0.99]"
          >
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-amber-500 text-slate-950 flex items-center justify-center font-black shadow-md">
                <Sparkles className="w-5 h-5" />
              </div>
              <div className="text-left">
                <div className="text-sm font-black text-amber-400 flex items-center gap-1.5">
                  <span>{t.endlessMode}</span>
                  <span className="text-[10px] uppercase font-bold bg-amber-400 text-slate-950 px-1.5 py-0.2 rounded-full">
                    {language === 'hi' ? 'अनंत' : 'Infinite'}
                  </span>
                </div>
                <div className="text-xs text-slate-300">
                  {language === 'hi'
                    ? 'हर बार नया और हल करने योग्य पहेली बोर्ड'
                    : 'Procedurally generated unique solvable puzzle boards'}
                </div>
              </div>
            </div>
            <span className="text-xs font-bold text-amber-400 group-hover:translate-x-1 transition-transform">
              {language === 'hi' ? 'खेलें →' : 'Play →'}
            </span>
          </button>
        </div>

        {/* Level Grid */}
        <div className="flex-1 overflow-y-auto pr-1">
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-2.5">
            {PUZZLE_LEVELS.map(lvl => {
              const isCurrent = currentLevelId === lvl.id;
              const result = completedLevels[lvl.id];
              const stars = result ? result.stars : 0;
              const isCompleted = !!result;

              return (
                <button
                  key={lvl.id}
                  id={`level-card-${lvl.id}`}
                  onClick={() => onSelectLevel(lvl.id)}
                  className={`p-3 rounded-2xl border text-left flex flex-col justify-between h-28 transition-all relative ${
                    isCurrent
                      ? 'bg-amber-500/15 border-amber-400 ring-2 ring-amber-400/40'
                      : isCompleted
                      ? 'bg-slate-800/80 border-slate-700/80 hover:bg-slate-800 hover:border-slate-600'
                      : 'bg-slate-800/40 border-slate-800 hover:bg-slate-800/70 hover:border-slate-700'
                  }`}
                >
                  <div className="flex items-start justify-between">
                    <span className="text-sm font-black text-white">
                      #{lvl.id}
                    </span>
                    <span
                      className={`text-[9px] font-bold px-1.5 py-0.5 rounded-md uppercase ${
                        lvl.difficulty === 'Beginner'
                          ? 'bg-emerald-500/20 text-emerald-400 border border-emerald-500/30'
                          : lvl.difficulty === 'Intermediate'
                          ? 'bg-cyan-500/20 text-cyan-400 border border-cyan-500/30'
                          : lvl.difficulty === 'Advanced'
                          ? 'bg-amber-500/20 text-amber-400 border border-amber-500/30'
                          : 'bg-red-500/20 text-red-400 border border-red-500/30'
                      }`}
                    >
                      {lvl.difficulty}
                    </span>
                  </div>

                  <div>
                    <span className="text-xs font-bold text-slate-200 block truncate">
                      {lvl.name}
                    </span>
                    <span className="text-[10px] text-slate-400 block">
                      {lvl.rows}x{lvl.cols} grid &bull; {lvl.tiles.filter(x => x.type === 'arrow').length} arrows
                    </span>
                  </div>

                  {/* Stars footer */}
                  <div className="flex items-center gap-1 pt-1">
                    {[1, 2, 3].map(s => (
                      <Star
                        key={s}
                        className={`w-3.5 h-3.5 ${
                          s <= stars
                            ? 'text-amber-400 fill-amber-400'
                            : 'text-slate-700 fill-slate-800'
                        }`}
                      />
                    ))}
                  </div>
                </button>
              );
            })}
          </div>
        </div>
      </motion.div>
    </div>
  );
};
