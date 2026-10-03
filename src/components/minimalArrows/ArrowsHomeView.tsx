import React, { useState } from 'react';
import { MinimalLevel } from '../../types/minimalGame';
import { getLevel, TOTAL_LEVELS_COUNT, getDifficultyForLevel } from '../../data/minimalLevels';
import { motion, AnimatePresence } from 'motion/react';
import { X, Trophy, Settings, Sparkles, Play, Flame, Star, Lock, Check, Heart } from 'lucide-react';
import { soundFx } from '../../utils/audio';

interface ArrowsHomeViewProps {
  currentLevelIndex: number;
  unlockedLevelIndex: number;
  onStartLevel: () => void;
  onSelectLevelIndex: (idx: number) => void;
  onOpenSettings?: () => void;
}

export const ArrowsHomeView: React.FC<ArrowsHomeViewProps> = ({
  currentLevelIndex,
  unlockedLevelIndex,
  onStartLevel,
  onSelectLevelIndex,
  onOpenSettings,
}) => {
  const [isLevelModalOpen, setIsLevelModalOpen] = useState(false);
  const [activeTier, setActiveTier] = useState<number>(() => {
    // Auto-select the tier where player's current level resides
    const lvl = currentLevelIndex + 1;
    if (lvl <= 50) return 0;
    if (lvl <= 100) return 1;
    if (lvl <= 175) return 2;
    return 3;
  });
  const [lockedToast, setLockedToast] = useState<string | null>(null);

  const levelNumber = currentLevelIndex + 1;
  const currentLevel = getLevel(levelNumber);
  const difficulty = getDifficultyForLevel(levelNumber);

  const showLockedNotice = (targetLvl: number) => {
    soundFx.playPuzzleBlocked();
    setLockedToast(`Level ${targetLvl} is locked! Complete Level ${unlockedLevelIndex + 1} first.`);
    setTimeout(() => {
      setLockedToast(null);
    }, 2400);
  };

  // Tiers for 250 levels
  const tiers = [
    { label: '1 - 50', name: 'Beginner', start: 1, end: 50 },
    { label: '51 - 100', name: 'Skilled', start: 51, end: 100 },
    { label: '101 - 175', name: 'Expert', start: 101, end: 175 },
    { label: '176 - 250', name: 'Master', start: 176, end: 250 },
  ];

  const currentTierObj = tiers[activeTier];
  const tierLevelNumbers: number[] = [];
  for (let l = currentTierObj.start; l <= currentTierObj.end; l++) {
    tierLevelNumbers.push(l);
  }

  return (
    <div
      id="minimal-arrows-home-screen"
      className="relative w-full h-full flex flex-col items-center justify-between p-6 bg-white select-none overflow-hidden"
    >
      {/* Top Header Bar on Entrance Screen with clear Lives and Settings option */}
      <div className="w-full flex items-center justify-between z-10 shrink-0">
        <div className="flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-slate-50 border border-slate-200/80 text-xs font-semibold text-slate-600 shadow-2xs">
          <Star className="w-3.5 h-3.5 text-amber-500 fill-amber-500" />
          <span>250 Levels</span>
        </div>

        {/* Prominent Lives Display on Home Screen */}
        <div
          id="home-lives-indicator"
          className="flex items-center gap-1.5 px-3.5 py-1.5 rounded-full bg-rose-50 border border-rose-200/80 text-xs font-black text-rose-600 shadow-2xs"
          title="3 Lives per Level"
        >
          <Heart className="w-3.5 h-3.5 fill-rose-500 text-rose-500" />
          <span>3 Lives</span>
        </div>

        {/* Clear Settings Button with Icon and Label */}
        {onOpenSettings && (
          <button
            id="home-settings-btn"
            onClick={() => {
              soundFx.playTap();
              onOpenSettings();
            }}
            aria-label="Settings"
            className="flex items-center gap-1.5 px-3.5 py-1.5 rounded-full bg-slate-100 hover:bg-slate-200 active:scale-95 text-slate-700 font-bold text-xs transition-all shadow-2xs cursor-pointer border border-slate-200/70"
            title="Open Settings"
          >
            <Settings className="w-3.5 h-3.5 text-slate-600" />
            <span>Settings</span>
          </button>
        )}
      </div>

      {/* Decorative subtle background circle matching video */}
      <div className="absolute top-12 right-6 w-16 h-16 rounded-full border border-slate-200/60 bg-slate-50/50 pointer-events-none" />

      {/* Main Center Content */}
      <div className="flex-1 flex flex-col items-center justify-center -mt-6 gap-3">
        {/* Title: ▲rrows */}
        <div className="flex items-center tracking-tight select-none">
          <span className="text-4xl sm:text-5xl font-black text-slate-800 flex items-center">
            <span className="inline-block text-slate-800 mr-1 text-3xl sm:text-4xl">▲</span>
            <span>rrows</span>
          </span>
        </div>

        {/* Level Indicator Badge & Tap to Change */}
        <button
          id="home-level-indicator-btn"
          onClick={() => {
            soundFx.playTap();
            setIsLevelModalOpen(true);
          }}
          className="text-sm sm:text-base font-bold text-indigo-600 hover:text-indigo-700 transition-colors py-1.5 px-4 rounded-full bg-indigo-50/90 hover:bg-indigo-100/90 active:scale-95 flex items-center gap-2 cursor-pointer border border-indigo-100/80 shadow-2xs"
        >
          <span>Level {levelNumber}</span>
          <span className="text-[11px] text-indigo-500 bg-white/95 px-2 py-0.5 rounded-full font-bold shadow-2xs">
            {currentLevel.arrows.length} ↗ Arrows
          </span>
          <span className="text-[10px] text-slate-400 font-semibold uppercase tracking-wider">
            {difficulty}
          </span>
        </button>

        {/* Starting Button with breathing pulse */}
        <div className="mt-10 w-full flex flex-col items-center gap-3">
          <motion.button
            id="home-play-btn"
            animate={{ scale: [1, 1.03, 1] }}
            transition={{ repeat: Infinity, duration: 2.2, ease: 'easeInOut' }}
            whileHover={{ scale: 1.06 }}
            whileTap={{ scale: 0.96 }}
            onClick={() => {
              soundFx.playTap();
              onStartLevel();
            }}
            className="w-52 py-3.5 px-8 rounded-2xl bg-[#7c87ff] hover:bg-[#6c78f0] text-white font-black text-lg shadow-xl shadow-indigo-200/80 transition-all text-center flex items-center justify-center gap-2 cursor-pointer"
          >
            <Play className="w-5 h-5 fill-white" />
            <span>Play Level</span>
          </motion.button>

          {/* Featured Level Quick-Jumps with arrow counts */}
          <div className="flex flex-wrap items-center justify-center gap-2 mt-2 max-w-xs">
            <button
              onClick={() => {
                soundFx.playTap();
                onSelectLevelIndex(0); // Level 1 (0-indexed 0)
              }}
              className="text-[11px] text-slate-600 hover:text-indigo-600 bg-slate-100 hover:bg-slate-200/80 px-2.5 py-1 rounded-full font-semibold transition-colors cursor-pointer"
            >
              Lv 1
            </button>
            <button
              onClick={() => {
                if (unlockedLevelIndex >= 49) {
                  soundFx.playTap();
                  onSelectLevelIndex(49);
                } else {
                  showLockedNotice(50);
                }
              }}
              className={`text-[11px] px-2.5 py-1 rounded-full font-semibold transition-colors flex items-center gap-1 ${
                unlockedLevelIndex >= 49
                  ? 'text-slate-600 hover:text-indigo-600 bg-slate-100 hover:bg-slate-200/80 cursor-pointer'
                  : 'text-slate-400 bg-slate-100/60 cursor-not-allowed'
              }`}
            >
              {unlockedLevelIndex < 49 && <Lock className="w-2.5 h-2.5 text-slate-400" />}
              <span>Lv 50</span>
            </button>
            <button
              onClick={() => {
                if (unlockedLevelIndex >= 238) {
                  soundFx.playTap();
                  onSelectLevelIndex(238);
                } else {
                  showLockedNotice(239);
                }
              }}
              className={`text-[11px] px-3 py-1 rounded-full font-black transition-colors flex items-center gap-1 border shadow-2xs ${
                unlockedLevelIndex >= 238
                  ? 'text-slate-800 hover:text-indigo-600 bg-amber-50 hover:bg-amber-100/90 border-amber-200/80 cursor-pointer'
                  : 'text-slate-400 bg-slate-50 border-slate-200/50 cursor-not-allowed'
              }`}
            >
              {unlockedLevelIndex < 238 ? (
                <Lock className="w-2.5 h-2.5 text-slate-400" />
              ) : (
                <Flame className="w-3.5 h-3.5 text-rose-500 fill-rose-500/20" />
              )}
              <span>Lv 239</span>
            </button>
          </div>
        </div>
      </div>

      {/* Floating Locked Level Toast Warning */}
      <AnimatePresence>
        {lockedToast && (
          <motion.div
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 10 }}
            className="absolute bottom-16 left-4 right-4 z-40 bg-slate-800/95 text-white text-xs font-semibold py-2.5 px-4 rounded-2xl shadow-xl flex items-center gap-2 border border-slate-700 backdrop-blur-xs"
          >
            <Lock className="w-3.5 h-3.5 text-amber-400 shrink-0" />
            <span className="flex-1">{lockedToast}</span>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Bottom info banner */}
      <div className="text-center text-[11px] text-slate-400 pb-2 flex items-center justify-center gap-1.5">
        <span>250 Dense Mazes &bull; Progressive Level Unlock</span>
      </div>

      {/* 100+ Level Selection Modal */}
      <AnimatePresence>
        {isLevelModalOpen && (
          <div
            id="minimal-level-select-modal"
            className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-xs"
          >
            <motion.div
              initial={{ scale: 0.9, opacity: 0, y: 20 }}
              animate={{ scale: 1, opacity: 1, y: 0 }}
              exit={{ scale: 0.9, opacity: 0, y: 20 }}
              className="w-full max-w-sm bg-white rounded-3xl p-5 shadow-2xl flex flex-col max-h-[85vh] border border-slate-100"
            >
              {/* Modal Header */}
              <div className="flex items-center justify-between pb-3 border-b border-slate-100 mb-3">
                <div className="flex items-center gap-2.5">
                  <div className="w-9 h-9 rounded-xl bg-indigo-50 text-indigo-600 flex items-center justify-center font-bold">
                    <Trophy className="w-5 h-5" />
                  </div>
                  <div>
                    <h3 className="text-base font-black text-slate-800">Select Level</h3>
                    <p className="text-[11px] text-slate-400">
                      Unlocked: {unlockedLevelIndex + 1} of 250
                    </p>
                  </div>
                </div>
                <button
                  id="close-level-modal-btn"
                  onClick={() => setIsLevelModalOpen(false)}
                  className="p-1.5 rounded-full hover:bg-slate-100 text-slate-400 hover:text-slate-600"
                >
                  <X className="w-4 h-4" />
                </button>
              </div>

              {/* Tier Navigation Tabs: 1-25, 26-50, 51-75, 76-100 */}
              <div className="grid grid-cols-4 gap-1 p-1 bg-slate-100 rounded-xl mb-3">
                {tiers.map((t, idx) => (
                  <button
                    key={t.label}
                    onClick={() => {
                      soundFx.playTap();
                      setActiveTier(idx);
                    }}
                    className={`py-1.5 text-[11px] font-bold rounded-lg transition-all ${
                      activeTier === idx
                        ? 'bg-white text-indigo-600 shadow-xs'
                        : 'text-slate-500 hover:text-slate-800'
                    }`}
                  >
                    {t.label}
                  </button>
                ))}
              </div>

              {/* Grid of level numbers for active tier */}
              <div className="grid grid-cols-5 gap-2 overflow-y-auto py-1 pr-1 flex-1 max-h-[340px]">
                {tierLevelNumbers.map(lvlNum => {
                  const idx = lvlNum - 1;
                  const isUnlocked = idx <= unlockedLevelIndex;
                  const isCompleted = idx < unlockedLevelIndex;
                  const isCurrent = idx === currentLevelIndex;

                  return (
                    <button
                      key={lvlNum}
                      disabled={!isUnlocked}
                      onClick={() => {
                        if (!isUnlocked) {
                          showLockedNotice(lvlNum);
                          return;
                        }
                        soundFx.playTap();
                        onSelectLevelIndex(idx);
                        setIsLevelModalOpen(false);
                      }}
                      className={`relative aspect-square rounded-2xl flex flex-col items-center justify-center transition-all ${
                        isCurrent
                          ? 'bg-[#7c87ff] text-white shadow-md shadow-indigo-200 scale-105 font-black ring-2 ring-indigo-400/40'
                          : isCompleted
                          ? 'bg-indigo-50/70 hover:bg-indigo-100 text-indigo-900 font-bold border border-indigo-100 cursor-pointer'
                          : isUnlocked
                          ? 'bg-slate-50 hover:bg-indigo-50/60 text-slate-700 hover:text-indigo-600 font-bold border border-slate-100 cursor-pointer'
                          : 'bg-slate-50 text-slate-300 border border-slate-100 cursor-not-allowed opacity-60'
                      }`}
                    >
                      {isUnlocked ? (
                        <>
                          <span className="text-sm">{lvlNum}</span>
                          {isCompleted && (
                            <span className="absolute top-1 right-1 w-3.5 h-3.5 rounded-full bg-emerald-500/15 text-emerald-600 flex items-center justify-center">
                              <Check className="w-2.5 h-2.5 stroke-[3]" />
                            </span>
                          )}
                        </>
                      ) : (
                        <div className="flex flex-col items-center gap-0.5">
                          <Lock className="w-3.5 h-3.5 text-slate-300" />
                          <span className="text-[10px] text-slate-300 font-medium">{lvlNum}</span>
                        </div>
                      )}
                    </button>
                  );
                })}
              </div>

              {/* Modal footer quick start button */}
              <div className="pt-3 border-t border-slate-100 mt-2">
                <button
                  onClick={() => {
                    soundFx.playTap();
                    setIsLevelModalOpen(false);
                    onStartLevel();
                  }}
                  className="w-full py-2.5 rounded-2xl bg-indigo-50 hover:bg-indigo-100/70 text-indigo-600 font-bold text-xs transition-colors flex items-center justify-center gap-1.5"
                >
                  <Play className="w-3.5 h-3.5 fill-indigo-600" />
                  <span>Play Selected Level {levelNumber}</span>
                </button>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
};
