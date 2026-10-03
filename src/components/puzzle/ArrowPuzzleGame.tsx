import React, { useState, useEffect, useRef, useCallback } from 'react';
import { PuzzleLevel, PuzzleTile, ArrowDirection, PuzzleTheme, MoveHistoryEntry, AppLanguage } from '../../types';
import { PUZZLE_LEVELS, generateProceduralLevel } from '../../data/puzzleLevels';
import { ArrowTileComponent } from './ArrowTileComponent';
import { PuzzleVictoryModal } from './PuzzleVictoryModal';
import { PuzzleLevelSelectModal } from './PuzzleLevelSelectModal';
import { soundFx } from '../../utils/audio';
import { translations } from '../../utils/translations';
import {
  RotateCcw,
  Undo2,
  Lightbulb,
  Grid,
  ChevronLeft,
  ChevronRight,
  Flame,
  Volume2,
  VolumeX,
  Sparkles,
  HelpCircle,
  X,
  Languages,
} from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';

interface ArrowPuzzleGameProps {
  language?: AppLanguage;
  onToggleLanguage?: () => void;
}

export const ArrowPuzzleGame: React.FC<ArrowPuzzleGameProps> = ({
  language = 'hi',
  onToggleLanguage,
}) => {
  const t = translations[language] || translations.en;

  const [levelIndex, setLevelIndex] = useState<number>(0);
  const [isEndless, setIsEndless] = useState<boolean>(false);
  const [endlessSeed, setEndlessSeed] = useState<number>(1);
  const [endlessGridSize, setEndlessGridSize] = useState<number>(5);
  const [theme, setTheme] = useState<PuzzleTheme>('cyber');
  const [soundEnabled, setSoundEnabled] = useState<boolean>(true);

  // Modals
  const [isVictoryOpen, setIsVictoryOpen] = useState<boolean>(false);
  const [isLevelSelectOpen, setIsLevelSelectOpen] = useState<boolean>(false);
  const [isHelpOpen, setIsHelpOpen] = useState<boolean>(false);

  // Active level data & tiles
  const [currentLevel, setCurrentLevel] = useState<PuzzleLevel>(PUZZLE_LEVELS[0]);
  const [tiles, setTiles] = useState<PuzzleTile[]>([]);
  const [history, setHistory] = useState<MoveHistoryEntry[]>([]);

  // Performance metrics
  const [moves, setMoves] = useState<number>(0);
  const [mistakes, setMistakes] = useState<number>(0);
  const [streak, setStreak] = useState<number>(0);
  const [maxStreak, setMaxStreak] = useState<number>(0);
  const [timeSeconds, setTimeSeconds] = useState<number>(0);
  const [starsEarned, setStarsEarned] = useState<number>(3);

  // Completed levels saved in local storage
  const [completedLevels, setCompletedLevels] = useState<Record<number, { stars: number }>>(() => {
    try {
      const saved = localStorage.getItem('arrow_puzzle_completed_levels');
      return saved ? JSON.parse(saved) : {};
    } catch {
      return {};
    }
  });

  // Container dimensions for auto cell sizing
  const boardContainerRef = useRef<HTMLDivElement | null>(null);
  const [cellSize, setCellSize] = useState<number>(75);

  // Load a level
  const loadLevel = useCallback((lvl: PuzzleLevel) => {
    setCurrentLevel(lvl);
    // Deep clone tiles so we don't mutate original
    setTiles(lvl.tiles.map(t => ({ ...t, isFlying: false, isBumping: false, isHinted: false })));
    setHistory([]);
    setMoves(0);
    setMistakes(0);
    setStreak(0);
    setMaxStreak(0);
    setTimeSeconds(0);
    setIsVictoryOpen(false);
  }, []);

  // Initialize or change level
  useEffect(() => {
    if (isEndless) {
      const arrowCount = Math.floor(endlessGridSize * endlessGridSize * 0.65);
      const obsCount = endlessGridSize >= 5 ? (endlessGridSize >= 6 ? 3 : 2) : 1;
      const gen = generateProceduralLevel(endlessSeed, endlessGridSize, endlessGridSize, arrowCount, obsCount);
      loadLevel(gen);
    } else {
      const targetLvl = PUZZLE_LEVELS[levelIndex] || PUZZLE_LEVELS[0];
      loadLevel(targetLvl);
    }
  }, [levelIndex, isEndless, endlessSeed, endlessGridSize, loadLevel]);

  // Timer tick
  useEffect(() => {
    if (isVictoryOpen) return;
    const timer = setInterval(() => {
      setTimeSeconds(s => s + 1);
    }, 1000);
    return () => clearInterval(timer);
  }, [isVictoryOpen]);

  // Dynamic responsive cell sizing
  useEffect(() => {
    const el = boardContainerRef.current;
    if (!el) return;

    const updateSize = () => {
      const rect = el.getBoundingClientRect();
      const availWidth = rect.width - 32;
      const availHeight = rect.height - 32;

      const calcByW = Math.floor(availWidth / currentLevel.cols);
      const calcByH = Math.floor(availHeight / currentLevel.rows);
      const chosen = Math.max(48, Math.min(calcByW, calcByH, 90));
      setCellSize(chosen);
    };

    const ro = new ResizeObserver(() => updateSize());
    ro.observe(el);
    updateSize();

    return () => ro.disconnect();
  }, [currentLevel]);

  // Check if tile is blocked in its direction
  const checkIsBlocked = (tile: PuzzleTile, activeTiles: PuzzleTile[]): boolean => {
    const { row, col, direction } = tile;

    for (const other of activeTiles) {
      if (other.id === tile.id || other.isFlying) continue;

      if (direction === 'UP') {
        if (other.col === col && other.row < row) return true;
      } else if (direction === 'DOWN') {
        if (other.col === col && other.row > row) return true;
      } else if (direction === 'LEFT') {
        if (other.row === row && other.col < col) return true;
      } else if (direction === 'RIGHT') {
        if (other.row === row && other.col > col) return true;
      }
    }

    return false;
  };

  // Handle Tile Click / Tap
  const handleTileClick = (clickedTile: PuzzleTile) => {
    if (clickedTile.type === 'obstacle' || clickedTile.isFlying || isVictoryOpen) return;

    const isBlocked = checkIsBlocked(clickedTile, tiles);

    if (isBlocked) {
      // Trigger Bonk / Bump animation
      soundFx.playPuzzleBlocked();
      setMistakes(m => m + 1);
      setStreak(0);

      setTiles(prev =>
        prev.map(t => (t.id === clickedTile.id ? { ...t, isBumping: true, isHinted: false } : t))
      );

      setTimeout(() => {
        setTiles(prev =>
          prev.map(t => (t.id === clickedTile.id ? { ...t, isBumping: false } : t))
        );
      }, 300);
      return;
    }

    // Path is clear! Fly off the board
    const nextStreak = streak + 1;
    setStreak(nextStreak);
    setMaxStreak(m => Math.max(m, nextStreak));
    setMoves(m => m + 1);

    soundFx.playPuzzleWhoosh(nextStreak);

    // Set flying flag for animation
    setTiles(prev =>
      prev.map(t => (t.id === clickedTile.id ? { ...t, isFlying: true, isHinted: false } : t))
    );

    // Save to history
    setHistory(h => [...h, { clearedTile: clickedTile, streak: nextStreak }]);

    // Remove from board after animation
    setTimeout(() => {
      setTiles(prev => {
        const remaining = prev.filter(t => t.id !== clickedTile.id);
        const remainingArrows = remaining.filter(t => t.type === 'arrow');

        // Check if level won!
        if (remainingArrows.length === 0) {
          handleLevelComplete();
        }

        return remaining;
      });
    }, 380);
  };

  // Handle Level Victory
  const handleLevelComplete = () => {
    soundFx.playPuzzleWin();

    // Compute star rating
    let stars = 1;
    if (mistakes === 0) stars = 3;
    else if (mistakes <= 2) stars = 2;

    setStarsEarned(stars);
    setIsVictoryOpen(true);

    if (!isEndless) {
      setCompletedLevels(prev => {
        const existing = prev[currentLevel.id]?.stars || 0;
        const updated = {
          ...prev,
          [currentLevel.id]: { stars: Math.max(existing, stars) },
        };
        try {
          localStorage.setItem('arrow_puzzle_completed_levels', JSON.stringify(updated));
        } catch {
          // ignore
        }
        return updated;
      });
    }
  };

  // Undo last move
  const handleUndo = () => {
    if (history.length === 0 || isVictoryOpen) return;
    const lastEntry = history[history.length - 1];
    setHistory(h => h.slice(0, -1));

    soundFx.playPuzzleUndo();
    setMoves(m => Math.max(0, m - 1));
    setStreak(lastEntry.streak > 1 ? lastEntry.streak - 1 : 0);

    // Restore tile with fly-in
    setTiles(prev => [
      ...prev,
      {
        ...lastEntry.clearedTile,
        isFlying: false,
        isBumping: false,
        isHinted: false,
      },
    ]);
  };

  // Hint feature: scan for first arrow that has a clear path
  const handleHint = () => {
    if (isVictoryOpen) return;
    const arrows = tiles.filter(t => t.type === 'arrow' && !t.isFlying);

    // Find any arrow with clear line
    const freeArrow = arrows.find(a => !checkIsBlocked(a, tiles));

    if (freeArrow) {
      soundFx.playPuzzleHint();
      setTiles(prev =>
        prev.map(t => (t.id === freeArrow.id ? { ...t, isHinted: true } : { ...t, isHinted: false }))
      );

      // Reset hint highlight after 2.8s
      setTimeout(() => {
        setTiles(prev => prev.map(t => (t.id === freeArrow.id ? { ...t, isHinted: false } : t)));
      }, 2800);
    }
  };

  // Reset Level
  const handleReset = () => {
    loadLevel(currentLevel);
  };

  // Next level navigation
  const handleNextLevel = () => {
    if (isEndless) {
      setEndlessSeed(s => s + 1);
    } else {
      if (levelIndex < PUZZLE_LEVELS.length - 1) {
        setLevelIndex(i => i + 1);
      } else {
        // Finished all handcrafted levels, go to endless!
        setIsEndless(true);
        setEndlessSeed(1);
      }
    }
  };

  const handlePrevLevel = () => {
    if (!isEndless && levelIndex > 0) {
      setLevelIndex(i => i - 1);
    }
  };

  const toggleSound = () => {
    const next = !soundEnabled;
    setSoundEnabled(next);
    soundFx.setEnabled(next);
  };

  const remainingArrowCount = tiles.filter(t => t.type === 'arrow').length;

  return (
    <div id="arrow-puzzle-container" className="w-full flex-1 flex flex-col gap-3 relative">
      {/* Top Puzzle HUD & Level Navigation */}
      <div className="flex flex-wrap items-center justify-between gap-3 bg-slate-900/90 backdrop-blur-md p-3 rounded-2xl border border-slate-800 shadow-lg">
        {/* Level Title & Selector Button */}
        <div className="flex items-center gap-2">
          {!isEndless && (
            <button
              id="prev-level-btn"
              onClick={handlePrevLevel}
              disabled={levelIndex === 0}
              aria-label="Previous level"
              className="p-1.5 rounded-xl bg-slate-800 hover:bg-slate-700 disabled:opacity-30 disabled:pointer-events-none text-slate-300 transition-colors"
            >
              <ChevronLeft className="w-4 h-4" />
            </button>
          )}

          <button
            id="open-level-select-btn"
            onClick={() => setIsLevelSelectOpen(true)}
            className="flex items-center gap-2 px-3 py-1.5 rounded-xl bg-slate-800/90 hover:bg-slate-700/90 border border-slate-700 text-left transition-all active:scale-95"
          >
            <Grid className="w-4 h-4 text-amber-400" />
            <div>
              <div className="flex items-center gap-1.5">
                <span className="text-xs font-black text-white">
                  {isEndless ? `Endless #${endlessSeed}` : `Level ${currentLevel.id}`}
                </span>
                <span className="text-[10px] uppercase font-bold px-1.5 py-0.2 rounded bg-amber-500/20 text-amber-400 border border-amber-500/30">
                  {currentLevel.difficulty}
                </span>
              </div>
              <div className="text-[10px] text-slate-400 hidden sm:block truncate max-w-[140px]">
                {currentLevel.name}
              </div>
            </div>
          </button>

          {!isEndless && (
            <button
              id="next-level-btn"
              onClick={handleNextLevel}
              disabled={levelIndex >= PUZZLE_LEVELS.length - 1}
              aria-label="Next level"
              className="p-1.5 rounded-xl bg-slate-800 hover:bg-slate-700 disabled:opacity-30 disabled:pointer-events-none text-slate-300 transition-colors"
            >
              <ChevronRight className="w-4 h-4" />
            </button>
          )}
        </div>

        {/* Real-time stats */}
        <div className="flex items-center gap-2.5 sm:gap-4">
          <div className="flex flex-col items-center">
            <span className="text-[10px] text-slate-400 uppercase font-semibold">{t.remaining}</span>
            <span className="text-sm sm:text-base font-black text-amber-400">
              {remainingArrowCount}
            </span>
          </div>

          <div className="h-6 w-px bg-slate-800" />

          <div className="flex flex-col items-center">
            <span className="text-[10px] text-slate-400 uppercase font-semibold">{t.moves}</span>
            <span className="text-sm sm:text-base font-black text-white">{moves}</span>
          </div>

          <div className="h-6 w-px bg-slate-800" />

          <div className="flex flex-col items-center">
            <span className="text-[10px] text-slate-400 uppercase font-semibold">{t.mistakes}</span>
            <span
              className={`text-sm sm:text-base font-black ${
                mistakes === 0 ? 'text-slate-400' : 'text-rose-400'
              }`}
            >
              {mistakes}
            </span>
          </div>

          {/* Streak indicator */}
          <AnimatePresence>
            {streak > 1 && (
              <motion.div
                initial={{ scale: 0, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                exit={{ scale: 0, opacity: 0 }}
                className="hidden md:flex items-center gap-1 bg-gradient-to-r from-amber-500 to-orange-500 text-slate-950 font-black text-xs px-2.5 py-1 rounded-full shadow-md"
              >
                <Flame className="w-3.5 h-3.5 fill-current animate-bounce" />
                <span>{streak}x {t.combo}</span>
              </motion.div>
            )}
          </AnimatePresence>
        </div>

        {/* Puzzle Action Buttons: Hint, Undo, Reset, Sound, Language */}
        <div className="flex items-center gap-1.5 sm:gap-2">
          {/* Hint */}
          <button
            id="puzzle-hint-btn"
            onClick={handleHint}
            title={t.hint}
            className="flex items-center gap-1 px-2.5 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-amber-400 border border-slate-700 text-xs font-bold transition-all active:scale-95 shadow-sm"
          >
            <Lightbulb className="w-4 h-4 fill-amber-400/20" />
            <span className="hidden sm:inline">{t.hint}</span>
          </button>

          {/* Undo */}
          <button
            id="puzzle-undo-btn"
            onClick={handleUndo}
            disabled={history.length === 0}
            title={t.undo}
            className="flex items-center gap-1 px-2.5 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 disabled:opacity-40 disabled:pointer-events-none text-slate-200 border border-slate-700 text-xs font-bold transition-all active:scale-95 shadow-sm"
          >
            <Undo2 className="w-4 h-4" />
            <span className="hidden sm:inline">{t.undo}</span>
          </button>

          {/* Reset */}
          <button
            id="puzzle-reset-btn"
            onClick={handleReset}
            title={t.reset}
            className="p-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 hover:text-white border border-slate-700 transition-all active:scale-95"
          >
            <RotateCcw className="w-4 h-4" />
          </button>

          {/* Sound Toggle */}
          <button
            id="puzzle-sound-toggle-btn"
            onClick={toggleSound}
            aria-label="Toggle sound"
            className="p-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 hover:text-white border border-slate-700 transition-all active:scale-95"
          >
            {soundEnabled ? (
              <Volume2 className="w-4 h-4 text-emerald-400" />
            ) : (
              <VolumeX className="w-4 h-4 text-slate-400" />
            )}
          </button>

          {/* Language Switcher */}
          {onToggleLanguage && (
            <button
              id="puzzle-lang-toggle-btn"
              onClick={onToggleLanguage}
              title="Change Language / भाषा बदलें"
              className="flex items-center gap-1 px-2 py-1.5 rounded-xl bg-amber-500/10 hover:bg-amber-500/20 text-amber-400 border border-amber-500/30 text-xs font-black transition-all active:scale-95"
            >
              <Languages className="w-3.5 h-3.5" />
              <span>{language === 'hi' ? 'EN' : 'हिंदी'}</span>
            </button>
          )}
        </div>
      </div>

      {/* Endless Grid Size selector bar when in endless mode */}
      {isEndless && (
        <div className="flex flex-wrap items-center justify-between gap-2 px-3 py-2 bg-slate-900/60 border border-slate-800 rounded-xl text-xs">
          <div className="flex items-center gap-2">
            <Sparkles className="w-4 h-4 text-amber-400" />
            <span className="font-bold text-white">{t.endlessMode}</span>
            <span className="text-slate-400">({t.gridSize}):</span>
          </div>
          <div className="flex items-center gap-1.5">
            {[4, 5, 6, 7].map(sz => (
              <button
                key={sz}
                onClick={() => {
                  setEndlessGridSize(sz);
                  setEndlessSeed(s => s + 1);
                }}
                className={`px-2.5 py-1 rounded-lg text-xs font-bold transition-all ${
                  endlessGridSize === sz
                    ? 'bg-amber-500 text-slate-950 font-black'
                    : 'bg-slate-800 text-slate-300 hover:bg-slate-700'
                }`}
              >
                {sz}x{sz}
              </button>
            ))}
            <button
              onClick={() => setEndlessSeed(s => s + 1)}
              className="ml-2 px-2.5 py-1 rounded-lg bg-emerald-500/20 text-emerald-400 border border-emerald-500/30 hover:bg-emerald-500/30 font-bold"
            >
              {t.newPuzzle} 🎲
            </button>
          </div>
        </div>
      )}

      {/* Main Interactive Puzzle Board */}
      <div
        ref={boardContainerRef}
        id="puzzle-board-canvas"
        className="relative w-full flex-1 min-h-[460px] md:min-h-[560px] rounded-3xl bg-slate-900/60 border border-slate-800/80 shadow-2xl flex items-center justify-center p-4 overflow-hidden"
      >
        {/* Ambient Subtle Grid Pattern Backdrop */}
        <div
          className="absolute inset-0 opacity-[0.03] pointer-events-none"
          style={{
            backgroundImage: 'radial-gradient(#ffffff 1px, transparent 1px)',
            backgroundSize: '24px 24px',
          }}
        />

        {/* The Grid Stage */}
        <div
          style={{
            width: `${currentLevel.cols * cellSize}px`,
            height: `${currentLevel.rows * cellSize}px`,
          }}
          className="relative rounded-2xl border-2 border-slate-700/50 bg-slate-950/80 shadow-inner"
        >
          {/* Subtle Grid Slot Placeholders */}
          {Array.from({ length: currentLevel.rows }).map((_, r) =>
            Array.from({ length: currentLevel.cols }).map((_, c) => (
              <div
                key={`slot-${r}-${c}`}
                style={{
                  width: `${cellSize}px`,
                  height: `${cellSize}px`,
                  top: `${r * cellSize}px`,
                  left: `${c * cellSize}px`,
                }}
                className="absolute border border-slate-800/40 rounded-2xl m-0 pointer-events-none"
              />
            ))
          )}

          {/* Render Arrow & Obstacle Tiles */}
          {tiles.map(tile => (
            <ArrowTileComponent
              key={tile.id}
              tile={tile}
              cellSize={cellSize}
              theme={theme}
              onClick={() => handleTileClick(tile)}
            />
          ))}
        </div>

        {/* Floating Instruction helper */}
        <div
          id="puzzle-instruction-hint"
          className="absolute bottom-3 left-4 right-4 sm:left-auto sm:right-6 pointer-events-none text-xs text-slate-400 bg-slate-950/80 backdrop-blur-md px-3.5 py-1.5 rounded-full border border-slate-800 shadow-md text-center"
        >
          <span>
            {language === 'hi'
              ? 'रास्ता साफ़ होने पर तीरों को टैप करें और बाहर निकालें'
              : 'Tap arrows facing an open path to fly them off the grid'}
          </span>
        </div>
      </div>

      {/* Bottom Level Description & Endless Mode Switcher */}
      <div className="flex flex-wrap items-center justify-between gap-2 px-1 text-xs text-slate-400">
        <div className="flex items-center gap-2">
          <span className="font-semibold text-slate-300">
            {language === 'hi' ? `लेवल ${currentLevel.id}` : currentLevel.name}:
          </span>
          <span>{currentLevel.description}</span>
        </div>

        {/* Theme Picker */}
        <div className="flex items-center gap-1.5 ml-auto">
          <span className="text-[11px] uppercase tracking-wider text-slate-500 font-bold">{t.theme}:</span>
          {(['cyber', 'neon', 'sunset', 'candy', 'wooden'] as PuzzleTheme[]).map(th => (
            <button
              key={th}
              onClick={() => setTheme(th)}
              className={`px-2 py-0.5 rounded-md text-[11px] font-bold capitalize transition-all ${
                theme === th
                  ? 'bg-amber-500 text-slate-950'
                  : 'bg-slate-800/80 text-slate-400 hover:text-slate-200'
              }`}
            >
              {th}
            </button>
          ))}
        </div>
      </div>

      {/* Victory Celebration Modal */}
      <AnimatePresence>
        {isVictoryOpen && (
          <PuzzleVictoryModal
            levelNumber={currentLevel.id}
            levelName={currentLevel.name}
            moves={moves}
            mistakes={mistakes}
            timeSeconds={timeSeconds}
            stars={starsEarned}
            language={language}
            hasNextLevel={isEndless || levelIndex < PUZZLE_LEVELS.length - 1}
            onNextLevel={handleNextLevel}
            onReplay={handleReset}
            onOpenLevelSelect={() => {
              setIsVictoryOpen(false);
              setIsLevelSelectOpen(true);
            }}
          />
        )}
      </AnimatePresence>

      {/* Level Selection Modal */}
      <AnimatePresence>
        {isLevelSelectOpen && (
          <PuzzleLevelSelectModal
            currentLevelId={currentLevel.id}
            completedLevels={completedLevels}
            language={language}
            onSelectLevel={id => {
              setIsEndless(false);
              const idx = PUZZLE_LEVELS.findIndex(l => l.id === id);
              if (idx !== -1) setLevelIndex(idx);
              setIsLevelSelectOpen(false);
            }}
            onSelectEndless={() => {
              setIsEndless(true);
              setEndlessSeed(Math.floor(Math.random() * 50) + 1);
              setIsLevelSelectOpen(false);
            }}
            onClose={() => setIsLevelSelectOpen(false)}
          />
        )}
      </AnimatePresence>
    </div>
  );
};
