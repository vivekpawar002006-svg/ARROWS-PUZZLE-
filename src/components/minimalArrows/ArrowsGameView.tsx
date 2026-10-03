import React, { useState, useEffect, useRef, useCallback } from 'react';
import { MinimalLevel, MinimalArrow, ArrowHeadStyle } from '../../types/minimalGame';
import { DotGrid } from './DotGrid';
import { MinimalArrowSVG } from './MinimalArrowSVG';
import { ConfettiEffect } from './ConfettiEffect';
import { GameSettingsModal } from './GameSettingsModal';
import { GameEffectsOverlay, VisualEffectEvent } from './GameEffectsOverlay';
import { isArrowBlocked } from '../../utils/arrowCollision';
import { soundFx } from '../../utils/audio';
import { Settings, RotateCcw, Heart, AlertCircle, Lightbulb, ChevronLeft, ArrowUpRight } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';

interface ArrowsGameViewProps {
  level: MinimalLevel;
  soundEnabled: boolean;
  headStyle?: ArrowHeadStyle;
  onBackToHome: () => void;
  onNextLevel: () => void;
  onLevelComplete?: (levelIndex: number) => void;
  onRestartLevel: () => void;
  onToggleSound: () => void;
  onToggleHeadStyle?: () => void;
}

export const ArrowsGameView: React.FC<ArrowsGameViewProps> = ({
  level,
  soundEnabled,
  headStyle = 'solid',
  onBackToHome,
  onNextLevel,
  onLevelComplete,
  onRestartLevel,
  onToggleSound,
  onToggleHeadStyle,
}) => {
  const [arrows, setArrows] = useState<MinimalArrow[]>([]);
  const [hearts, setHearts] = useState<number>(3);
  const [isWon, setIsWon] = useState<boolean>(false);
  const [isGameOver, setIsGameOver] = useState<boolean>(false);
  const [isSettingsOpen, setIsSettingsOpen] = useState<boolean>(false);
  const [hintedArrowId, setHintedArrowId] = useState<string | null>(null);
  const [hintCount, setHintCount] = useState<number>(2);
  const [svgDimensions, setSvgDimensions] = useState({ width: 360, height: 480 });
  const [visualEffects, setVisualEffects] = useState<VisualEffectEvent[]>([]);
  const [combo, setCombo] = useState<number>(0);
  const [isShaking, setIsShaking] = useState<boolean>(false);

  const containerRef = useRef<HTMLDivElement | null>(null);
  const svgRef = useRef<SVGSVGElement | null>(null);
  const lastSuccessTime = useRef<number>(0);

  // Helper to add temporary visual effects
  const addEffect = useCallback((effect: Omit<VisualEffectEvent, 'id'>) => {
    const id = `fx_${Date.now()}_${Math.random().toString(36).substr(2, 6)}`;
    setVisualEffects(prev => [...prev, { ...effect, id }]);
    setTimeout(() => {
      setVisualEffects(prev => prev.filter(e => e.id !== id));
    }, 950);
  }, []);

  // Initialize level
  useEffect(() => {
    setArrows(level.arrows.map(a => ({ ...a, isFlying: false, isBumping: false })));
    setHearts(3);
    setIsWon(false);
    setIsGameOver(false);
    setIsSettingsOpen(false);
    setHintedArrowId(null);
    setCombo(0);
    setVisualEffects([]);
  }, [level]);

  // Responsive SVG sizing
  useEffect(() => {
    const updateSize = () => {
      if (containerRef.current) {
        const { clientWidth, clientHeight } = containerRef.current;
        setSvgDimensions({
          width: Math.max(300, clientWidth),
          height: Math.max(380, clientHeight),
        });
      }
    };
    updateSize();
    window.addEventListener('resize', updateSize);
    return () => window.removeEventListener('resize', updateSize);
  }, []);

  // Responsive viewBox & dynamic dotSpacing:
  // Using a stable virtual coordinate space (380x380) ensures uniform line weight,
  // perfectly sized arrowheads ("arrows ke face ache se show hoo"), and zero crowded touching!
  const viewBoxWidth = 380;
  const viewBoxHeight = 380;

  const maxDimension = Math.max(level.gridCols, level.gridRows, 3);
  const availableContent = 300;
  const dotSpacing = Math.round(availableContent / Math.max(maxDimension - 1, 1));

  const gridWidth = (level.gridCols - 1) * dotSpacing;
  const gridHeight = (level.gridRows - 1) * dotSpacing;
  const offsetX = (viewBoxWidth - gridWidth) / 2;
  const offsetY = (viewBoxHeight - gridHeight) / 2;

  // Convert SVG coordinates to container pixel coordinates for visual effects
  const getContainerCoord = useCallback((svgX: number, svgY: number) => {
    if (!svgRef.current || !containerRef.current) return { x: svgX, y: svgY };
    const svgRect = svgRef.current.getBoundingClientRect();
    const containerRect = containerRef.current.getBoundingClientRect();
    const scale = Math.min(svgRect.width / viewBoxWidth, svgRect.height / viewBoxHeight);
    const contentWidth = viewBoxWidth * scale;
    const contentHeight = viewBoxHeight * scale;
    const contentLeft = svgRect.left + (svgRect.width - contentWidth) / 2;
    const contentTop = svgRect.top + (svgRect.height - contentHeight) / 2;
    return {
      x: contentLeft - containerRect.left + svgX * scale,
      y: contentTop - containerRect.top + svgY * scale,
    };
  }, [viewBoxWidth, viewBoxHeight]);

  // Handle arrow tap
  const handleArrowClick = useCallback(
    (arrow: MinimalArrow) => {
      if (isWon || isGameOver || arrow.isFlying || arrow.isBumping) return;

      const activeArrows = arrows.filter(a => !a.isFlying);
      const blocked = isArrowBlocked(arrow, activeArrows);

      // Coordinates for visual effects
      const tip = arrow.points[arrow.points.length - 1];
      const tipX = offsetX + tip.x * dotSpacing;
      const tipY = offsetY + tip.y * dotSpacing;

      const origin = arrow.points[0];
      const midX = offsetX + ((origin.x + tip.x) / 2) * dotSpacing;
      const midY = offsetY + ((origin.y + tip.y) / 2) * dotSpacing;

      const tipPos = getContainerCoord(tipX, tipY);
      const midPos = getContainerCoord(midX, midY);

      if (blocked) {
        // Reset streak/combo
        setCombo(0);

        // Bonk & Bump: arrow stays, loses 1 heart
        soundFx.playPuzzleBlocked();

        // Screen micro-shake
        setIsShaking(true);
        setTimeout(() => setIsShaking(false), 260);

        // Visual Bonk impact effect at collision tip
        addEffect({
          type: 'bonk',
          x: tipPos.x,
          y: tipPos.y,
          direction: arrow.direction,
        });

        // Floating -1 Heart loss
        addEffect({
          type: 'heart_lost',
          x: tipPos.x,
          y: tipPos.y - 14,
        });

        setArrows(prev =>
          prev.map(a => (a.id === arrow.id ? { ...a, isBumping: true } : a))
        );

        setTimeout(() => {
          setArrows(prev =>
            prev.map(a => (a.id === arrow.id ? { ...a, isBumping: false } : a))
          );
        }, 280);

        setHearts(prev => {
          const next = prev - 1;
          if (next <= 0) {
            setIsGameOver(true);
          }
          return Math.max(0, next);
        });
      } else {
        // Success: Arrow slides off-screen in its pointing direction!
        const now = Date.now();
        const nextCombo = now - lastSuccessTime.current < 1700 ? combo + 1 : 1;
        lastSuccessTime.current = now;
        setCombo(nextCombo);

        soundFx.playShootCombo(nextCombo);

        // Launch burst particles at release origin
        addEffect({
          type: 'launch',
          x: midPos.x,
          y: midPos.y,
          direction: arrow.direction,
        });

        // If in a flow streak, pop combo badge
        if (nextCombo >= 2) {
          const comboLabels = [
            'Combo x2! ⚡',
            'Swift x3! 🚀',
            'Great x4! ✨',
            'Brilliant x5! 🔥',
            'Master Streak! 💎',
          ];
          const text = comboLabels[Math.min(nextCombo - 2, comboLabels.length - 1)];
          addEffect({
            type: 'combo',
            x: midPos.x,
            y: midPos.y - 24,
            comboCount: nextCombo,
            text,
          });
        }

        setArrows(prev =>
          prev.map(a => (a.id === arrow.id ? { ...a, isFlying: true } : a))
        );

        // After flight transition, check win state
        setTimeout(() => {
          setArrows(prev => {
            const nextList = prev.filter(a => a.id !== arrow.id);
            if (nextList.length === 0) {
              // Level cleared!
              setIsWon(true);
              soundFx.playPuzzleWin();
              onLevelComplete?.(level.id - 1);

              // Radial win shockwave
              addEffect({
                type: 'win_ring',
                x: svgDimensions.width / 2,
                y: svgDimensions.height / 2,
              });

              // Auto-advance after celebration
              setTimeout(() => {
                onNextLevel();
              }, 2200);
            }
            return nextList;
          });
        }, 1650);
      }
    },
    [arrows, isWon, isGameOver, onNextLevel, offsetX, offsetY, dotSpacing, combo, addEffect, svgDimensions]
  );

  // Provide visual hint highlighting an unblocked arrow
  const handleHint = useCallback(() => {
    if (isWon || isGameOver) return;
    const activeArrows = arrows.filter(a => !a.isFlying);
    const unblocked = activeArrows.filter(a => !isArrowBlocked(a, activeArrows));
    if (unblocked.length > 0) {
      soundFx.playPuzzleHint();
      setHintCount(prev => (prev > 0 ? prev - 1 : 2));
      setHintedArrowId(unblocked[0].id);
      setTimeout(() => {
        setHintedArrowId(null);
      }, 2200);
    }
  }, [arrows, isWon, isGameOver]);

  const remainingArrowsCount = arrows.filter(a => !a.isFlying).length;

  return (
    <div
      ref={containerRef}
      id="arrows-gameplay-canvas"
      className="relative w-full h-full flex flex-col justify-between bg-white select-none overflow-hidden"
    >
      {/* Top Header Bar with prominent Lives and Settings */}
      <div className="w-full shrink-0 flex flex-col px-3.5 pt-2.5 pb-2 z-20 gap-2 border-b border-slate-100 bg-white/95 backdrop-blur-xs">
        {/* Row 1: Back Button (< Back), Level Title, Settings Button (⚙️ Settings) */}
        <header className="w-full flex items-center justify-between">
          <button
            id="minimal-back-header-btn"
            onClick={() => {
              soundFx.playTap();
              onBackToHome();
            }}
            aria-label="Back to home"
            className="flex items-center gap-1 px-3 py-1.5 rounded-full bg-slate-100 hover:bg-slate-200 active:scale-95 text-slate-700 text-xs font-bold transition-all cursor-pointer shadow-2xs"
            title="Back to Menu"
          >
            <ChevronLeft className="w-4 h-4 stroke-[2.5]" />
            <span>Back</span>
          </button>

          <div className="flex flex-col items-center">
            <h1 className="text-base sm:text-lg font-black text-slate-800 tracking-tight leading-none">
              {level.title?.includes('Challenge')
                ? level.title
                : level.id >= 1000
                ? `Challenge ${level.gridCols}x${level.gridRows}`
                : `Level ${level.id}`}
            </h1>
            <span className="text-[10px] text-slate-400 font-bold uppercase tracking-wider mt-0.5">
              {level.id >= 1000 ? 'Procedural Challenge' : level.title || `Stage ${level.id}`}
            </span>
          </div>

          <button
            id="minimal-settings-btn"
            onClick={() => {
              soundFx.playTap();
              setIsSettingsOpen(true);
            }}
            aria-label="Settings"
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-slate-100 hover:bg-slate-200 active:scale-95 text-slate-700 text-xs font-bold transition-all cursor-pointer shadow-2xs"
            title="Settings"
          >
            <Settings className="w-4 h-4 text-slate-600" />
            <span>Settings</span>
          </button>
        </header>

        {/* Row 2: Prominent Lives Display ("Kitni Life H") & Level Info Pill */}
        <div className="w-full flex items-center justify-between px-1">
          {/* Prominent Red Hearts Lives Counter */}
          <div
            id="minimal-hearts-container"
            className="flex items-center gap-2 bg-rose-50/90 border border-rose-200/80 px-3 py-1.5 rounded-full shadow-2xs"
            title={`${hearts} of 3 Lives Remaining`}
          >
            <div className="flex items-center gap-1">
              <Heart className="w-4 h-4 fill-rose-500 text-rose-500" />
              <span className="text-xs font-black text-rose-700">Lives:</span>
              <span className="text-xs font-black text-rose-600 ml-0.5">{hearts}/3</span>
            </div>

            <div className="flex items-center gap-1 ml-1 pl-1.5 border-l border-rose-200">
              {[1, 2, 3].map(h => (
                <motion.div
                  key={h}
                  animate={
                    h > hearts
                      ? { scale: [1, 1.35, 0.75], opacity: 0.25 }
                      : { scale: 1, opacity: 1 }
                  }
                  transition={{ duration: 0.25 }}
                >
                  <Heart
                    className={`w-4 h-4 transition-colors ${
                      h <= hearts
                        ? 'fill-rose-500 text-rose-500 drop-shadow-xs'
                        : 'fill-slate-200 text-slate-300'
                    }`}
                  />
                </motion.div>
              ))}
            </div>
          </div>

          {/* Right: Remaining Arrows & Difficulty Pill */}
          <div className="flex items-center gap-1.5">
            <div className="flex items-center gap-1 bg-slate-100/90 text-slate-700 px-2.5 py-1.5 rounded-full text-xs font-bold shadow-2xs">
              <ArrowUpRight className="w-3.5 h-3.5 text-slate-600 stroke-[2.5]" />
              <span>{remainingArrowsCount} left</span>
            </div>

            <div className="bg-indigo-50 border border-indigo-100/70 text-indigo-700 px-2.5 py-1.5 rounded-full text-xs font-bold shadow-2xs hidden sm:block">
              {level.difficulty || 'Hard'}
            </div>
          </div>
        </div>
      </div>

      {/* Main SVG Interactive Stage - Clean Minimalist 2D with effects & shake */}
      <motion.div
        id="arrows-interactive-board"
        animate={isShaking ? { x: [-4, 4, -3, 3, -1, 1, 0] } : { x: 0 }}
        transition={{ duration: 0.25 }}
        className="flex-1 min-h-0 w-full relative flex items-center justify-center overflow-hidden p-2"
      >
        <svg
          ref={svgRef}
          viewBox={`0 0 ${viewBoxWidth} ${viewBoxHeight}`}
          preserveAspectRatio="xMidYMid meet"
          className="w-full h-full max-h-full block select-none"
        >
          {/* Minimalist 2D Navy Arrows with rounded corners and clean triangular heads matching IMG_3160.jpeg */}
          {arrows.map(arrow => (
            <MinimalArrowSVG
              key={arrow.id}
              arrow={arrow}
              spacing={dotSpacing}
              offsetX={offsetX}
              offsetY={offsetY}
              headStyle={headStyle}
              isHinted={arrow.id === hintedArrowId}
              onClick={() => handleArrowClick(arrow)}
            />
          ))}
        </svg>

        {/* Visual Effects Overlay: Launch particles, Bonk sparks, Combo badges, Win waves */}
        <GameEffectsOverlay effects={visualEffects} />

        {/* Victory Celebration: Compliment + Confetti */}
        <AnimatePresence>
          {isWon && (
            <>
              <ConfettiEffect />
              <motion.div
                initial={{ scale: 0.8, opacity: 0, y: 10 }}
                animate={{ scale: 1, opacity: 1, y: 0 }}
                exit={{ scale: 0.9, opacity: 0 }}
                id="minimal-victory-text"
                className="absolute inset-0 flex flex-col items-center justify-center pointer-events-none z-30"
              >
                <h2 className="text-3xl sm:text-4xl font-black text-indigo-600 tracking-tight drop-shadow-sm">
                  {level.compliment || 'Brilliant!'}
                </h2>
                <p className="text-xs font-semibold text-indigo-400 mt-1">Level {level.id} Cleared</p>
              </motion.div>
            </>
          )}
        </AnimatePresence>

        {/* Game Over / Out of Lives Modal */}
        <AnimatePresence>
          {isGameOver && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              id="minimal-gameover-backdrop"
              className="absolute inset-0 bg-slate-900/50 backdrop-blur-xs flex items-center justify-center p-6 z-40"
            >
              <motion.div
                initial={{ scale: 0.9, y: 20 }}
                animate={{ scale: 1, y: 0 }}
                exit={{ scale: 0.9, y: 20 }}
                id="minimal-gameover-card"
                className="w-full max-w-xs bg-white rounded-3xl p-6 shadow-2xl text-center flex flex-col items-center gap-4"
              >
                <div className="w-14 h-14 rounded-full bg-rose-50 text-rose-500 flex items-center justify-center">
                  <AlertCircle className="w-8 h-8" />
                </div>
                <div>
                  <h3 className="text-xl font-black text-slate-800">Out of Lives!</h3>
                  <p className="text-xs text-slate-400 mt-1">
                    Find which arrow has a free, unobstructed path before tapping.
                  </p>
                </div>
                <div className="w-full flex flex-col gap-2 pt-1">
                  <button
                    id="minimal-try-again-btn"
                    onClick={onRestartLevel}
                    className="w-full py-3 rounded-2xl bg-indigo-500 hover:bg-indigo-600 active:scale-98 text-white font-bold text-sm shadow-md transition-all flex items-center justify-center gap-2"
                  >
                    <RotateCcw className="w-4 h-4" />
                    <span>Try Again</span>
                  </button>

                  <button
                    id="minimal-gameover-exit-btn"
                    onClick={onBackToHome}
                    className="w-full py-2.5 rounded-2xl bg-slate-100 hover:bg-slate-200 active:scale-98 text-slate-600 font-semibold text-xs transition-all"
                  >
                    Exit to Menu
                  </button>
                </div>
              </motion.div>
            </motion.div>
          )}
        </AnimatePresence>
      </motion.div>

      {/* Floating Bottom Tools matching clean responsive layout */}
      <footer className="w-full shrink-0 flex items-center justify-center gap-8 pb-3.5 pt-1.5 z-20 border-t border-slate-100 bg-white/95 backdrop-blur-xs">
        {/* Restart / Reset Button */}
        <button
          id="minimal-restart-btn"
          onClick={() => {
            soundFx.playTap();
            onRestartLevel();
          }}
          aria-label="Restart level"
          className="flex items-center gap-2 px-4 py-2 rounded-2xl bg-slate-100 hover:bg-slate-200 active:scale-95 text-slate-700 text-xs font-bold transition-all shadow-2xs cursor-pointer"
          title="Restart Level"
        >
          <RotateCcw className="w-4 h-4 text-slate-600" />
          <span>Restart</span>
        </button>

        {/* Lightbulb Hint Button with Blue Badge */}
        <button
          id="minimal-hint-btn"
          onClick={handleHint}
          aria-label="Hint"
          className="relative flex items-center gap-2 px-4 py-2 rounded-2xl bg-sky-50 hover:bg-sky-100 active:scale-95 text-sky-700 text-xs font-bold transition-all border border-sky-200/80 shadow-2xs cursor-pointer"
          title="Show Hint (Highlights an unblocked arrow with sky-blue ribbon)"
        >
          <Lightbulb className="w-4 h-4 text-amber-500 fill-amber-400/40" />
          <span>Hint</span>
          <span className="ml-0.5 w-5 h-5 bg-sky-500 text-white rounded-full text-[10px] font-black flex items-center justify-center shadow-xs">
            {hintCount}
          </span>
        </button>
      </footer>

      {/* In-Game Settings Modal with Sound, Arrow Style, Restart, Exit */}
      <GameSettingsModal
        isOpen={isSettingsOpen}
        soundEnabled={soundEnabled}
        levelNumber={level.id}
        headStyle={headStyle}
        onClose={() => setIsSettingsOpen(false)}
        onToggleSound={onToggleSound}
        onRestartLevel={onRestartLevel}
        onExitGame={onBackToHome}
        onToggleHeadStyle={onToggleHeadStyle}
      />
    </div>
  );
};
