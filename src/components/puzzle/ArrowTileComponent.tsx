import React from 'react';
import { PuzzleTile, ArrowDirection, PuzzleTheme } from '../../types';
import { motion } from 'motion/react';
import { ArrowUp, ArrowDown, ArrowLeft, ArrowRight, ShieldAlert } from 'lucide-react';

interface ArrowTileComponentProps {
  tile: PuzzleTile;
  cellSize: number;
  theme: PuzzleTheme;
  onClick: () => void;
}

export const ArrowTileComponent: React.FC<ArrowTileComponentProps> = ({
  tile,
  cellSize,
  theme,
  onClick,
}) => {
  // Arrow Direction icon helper
  const renderArrowIcon = (dir: ArrowDirection) => {
    const iconClass = "w-1/2 h-1/2 drop-shadow-md stroke-[3]";
    switch (dir) {
      case 'UP':
        return <ArrowUp className={iconClass} />;
      case 'DOWN':
        return <ArrowDown className={iconClass} />;
      case 'LEFT':
        return <ArrowLeft className={iconClass} />;
      case 'RIGHT':
        return <ArrowRight className={iconClass} />;
    }
  };

  // Flying off the board animation offsets
  const getFlyOffset = (dir: ArrowDirection) => {
    const distance = 850;
    switch (dir) {
      case 'UP':
        return { x: 0, y: -distance };
      case 'DOWN':
        return { x: 0, y: distance };
      case 'LEFT':
        return { x: -distance, y: 0 };
      case 'RIGHT':
        return { x: distance, y: 0 };
    }
  };

  // Blocked bump animation offsets
  const getBumpKeyframes = (dir: ArrowDirection) => {
    const bumpDist = 18;
    switch (dir) {
      case 'UP':
        return { y: [0, -bumpDist, 4, -2, 0] };
      case 'DOWN':
        return { y: [0, bumpDist, -4, 2, 0] };
      case 'LEFT':
        return { x: [0, -bumpDist, 4, -2, 0] };
      case 'RIGHT':
        return { x: [0, bumpDist, -4, 2, 0] };
    }
  };

  // If obstacle (Stone Wall)
  if (tile.type === 'obstacle') {
    return (
      <div
        id={`tile-${tile.id}`}
        style={{
          width: `${cellSize}px`,
          height: `${cellSize}px`,
          top: `${tile.row * cellSize}px`,
          left: `${tile.col * cellSize}px`,
        }}
        className="absolute p-1.5 flex items-center justify-center select-none"
      >
        <div className="w-full h-full rounded-2xl bg-gradient-to-br from-slate-700 via-slate-800 to-slate-900 border-2 border-slate-600/80 shadow-md flex flex-col items-center justify-center text-slate-400">
          <ShieldAlert className="w-5 h-5 text-slate-400/80 mb-0.5" />
          <span className="text-[9px] font-black tracking-wider uppercase text-slate-400">BLOCK</span>
        </div>
      </div>
    );
  }

  // Animation variants
  const flyOffset = getFlyOffset(tile.direction);
  const bumpAnim = tile.isBumping ? getBumpKeyframes(tile.direction) : undefined;

  // Theme styling
  const getTileClasses = () => {
    if (theme === 'neon') {
      return 'border-2 border-white/40 shadow-[0_6px_20px_rgba(0,0,0,0.5)] hover:brightness-110 active:scale-95';
    }
    if (theme === 'wooden') {
      return 'border-2 border-amber-950/80 shadow-lg hover:brightness-105 active:scale-95';
    }
    if (theme === 'candy') {
      return 'border-2 border-white/60 shadow-md hover:brightness-110 active:scale-95';
    }
    if (theme === 'sunset') {
      return 'border-2 border-orange-300/40 shadow-lg hover:brightness-110 active:scale-95';
    }
    return 'border-2 border-white/30 shadow-lg hover:brightness-110 active:scale-95';
  };

  const tileBg = tile.color || '#38bdf8';

  return (
    <motion.div
      id={`arrow-tile-${tile.id}`}
      style={{
        width: `${cellSize}px`,
        height: `${cellSize}px`,
        top: `${tile.row * cellSize}px`,
        left: `${tile.col * cellSize}px`,
      }}
      animate={
        tile.isFlying
          ? {
              x: flyOffset.x,
              y: flyOffset.y,
              opacity: [1, 1, 0],
              scale: [1, 1.15, 0.7],
              transition: { duration: 0.38, ease: 'easeIn' },
            }
          : tile.isBumping
          ? {
              ...bumpAnim,
              transition: { duration: 0.28, ease: 'easeInOut' },
            }
          : {
              x: 0,
              y: 0,
              opacity: 1,
              scale: 1,
            }
      }
      onClick={onClick}
      className="absolute p-1.5 cursor-pointer select-none transition-transform z-10"
    >
      <div
        style={{
          backgroundColor: tileBg,
        }}
        className={`relative w-full h-full rounded-2xl flex items-center justify-center text-slate-950 font-black transition-all ${getTileClasses()} ${
          tile.isHinted ? 'ring-4 ring-amber-400 ring-offset-2 ring-offset-slate-950 animate-bounce' : ''
        }`}
      >
        {/* Subtle highlight sheen */}
        <div className="absolute top-1 left-2 right-2 h-2.5 bg-white/30 rounded-t-xl pointer-events-none" />

        {/* Direction Arrow */}
        <div className="relative z-10 flex items-center justify-center w-full h-full text-white">
          {renderArrowIcon(tile.direction)}
        </div>

        {/* Blocked Alert Flash Indicator */}
        {tile.isBumping && (
          <div className="absolute inset-0 bg-red-600/40 rounded-2xl flex items-center justify-center animate-pulse">
            <span className="text-[10px] font-black uppercase text-white bg-red-600 px-1.5 py-0.5 rounded shadow">
              Blocked!
            </span>
          </div>
        )}

        {/* Hint Indicator Pin */}
        {tile.isHinted && (
          <div className="absolute -top-3 left-1/2 -translate-x-1/2 bg-amber-400 text-slate-950 text-[10px] font-black px-2 py-0.5 rounded-full shadow-lg border border-white">
            FREE!
          </div>
        )}
      </div>
    </motion.div>
  );
};
