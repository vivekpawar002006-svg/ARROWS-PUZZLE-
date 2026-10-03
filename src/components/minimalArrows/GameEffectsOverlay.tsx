import React from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Direction } from '../../types/minimalGame';

export interface VisualEffectEvent {
  id: string;
  type: 'launch' | 'bonk' | 'combo' | 'heart_lost' | 'win_ring';
  x: number;
  y: number;
  direction?: Direction;
  text?: string;
  comboCount?: number;
}

interface GameEffectsOverlayProps {
  effects: VisualEffectEvent[];
}

export const GameEffectsOverlay: React.FC<GameEffectsOverlayProps> = ({ effects }) => {
  return (
    <div
      id="game-visual-effects-overlay"
      className="absolute inset-0 pointer-events-none overflow-hidden z-25"
    >
      <AnimatePresence>
        {effects.map(effect => {
          if (effect.type === 'launch') {
            // Speed ring + launch particles
            return (
              <React.Fragment key={effect.id}>
                {/* Launch shockwave ring */}
                <motion.div
                  initial={{ scale: 0.3, opacity: 0.8 }}
                  animate={{ scale: 2.2, opacity: 0 }}
                  exit={{ opacity: 0 }}
                  transition={{ duration: 0.45, ease: 'easeOut' }}
                  style={{
                    left: effect.x,
                    top: effect.y,
                    transform: 'translate(-50%, -50%)',
                  }}
                  className="absolute w-12 h-12 rounded-full border-2 border-indigo-400"
                />

                {/* 6 mini sparkle particles radiating out */}
                {[0, 60, 120, 180, 240, 300].map((angleDeg, i) => {
                  const rad = (angleDeg * Math.PI) / 180;
                  const distance = 28 + (i % 3) * 10;
                  const dx = Math.cos(rad) * distance;
                  const dy = Math.sin(rad) * distance;

                  return (
                    <motion.div
                      key={`${effect.id}-p-${i}`}
                      initial={{ x: effect.x, y: effect.y, scale: 1.2, opacity: 1 }}
                      animate={{
                        x: effect.x + dx,
                        y: effect.y + dy,
                        scale: 0,
                        opacity: 0,
                      }}
                      transition={{ duration: 0.4, ease: 'easeOut' }}
                      className="absolute w-2 h-2 -ml-1 -mt-1 rounded-full bg-indigo-500 shadow-sm"
                    />
                  );
                })}
              </React.Fragment>
            );
          }

          if (effect.type === 'bonk') {
            // Bonk blocked collision sparks (red/amber warning particles + ring)
            return (
              <React.Fragment key={effect.id}>
                {/* Impact vibration ring */}
                <motion.div
                  initial={{ scale: 0.4, opacity: 0.9 }}
                  animate={{ scale: 1.8, opacity: 0 }}
                  exit={{ opacity: 0 }}
                  transition={{ duration: 0.35, ease: 'easeOut' }}
                  style={{
                    left: effect.x,
                    top: effect.y,
                    transform: 'translate(-50%, -50%)',
                  }}
                  className="absolute w-10 h-10 rounded-full border-2 border-rose-500"
                />

                {/* Impact sharp cross sparks */}
                {[45, 135, 225, 315].map((angleDeg, i) => {
                  const rad = (angleDeg * Math.PI) / 180;
                  const dx = Math.cos(rad) * 22;
                  const dy = Math.sin(rad) * 22;

                  return (
                    <motion.div
                      key={`${effect.id}-bonk-${i}`}
                      initial={{ x: effect.x, y: effect.y, scale: 1.4, opacity: 1 }}
                      animate={{
                        x: effect.x + dx,
                        y: effect.y + dy,
                        scale: 0,
                        opacity: 0,
                      }}
                      transition={{ duration: 0.3, ease: 'easeOut' }}
                      className="absolute w-1.5 h-1.5 -ml-0.75 -mt-0.75 rounded-full bg-rose-500 shadow-xs"
                    />
                  );
                })}
              </React.Fragment>
            );
          }

          if (effect.type === 'combo') {
            // Floating Combo text pop
            return (
              <motion.div
                key={effect.id}
                initial={{ scale: 0.6, y: 10, opacity: 0 }}
                animate={{ scale: [0.6, 1.25, 1.05], y: -36, opacity: [0, 1, 0] }}
                exit={{ opacity: 0 }}
                transition={{ duration: 0.85, ease: [0.175, 0.885, 0.32, 1.275] }}
                style={{
                  left: effect.x,
                  top: effect.y,
                  transform: 'translate(-50%, -50%)',
                }}
                className="absolute flex items-center gap-1.5 px-3 py-1 rounded-full bg-indigo-600/90 backdrop-blur-xs text-white shadow-lg text-xs font-black tracking-wide select-none"
              >
                <span>⚡</span>
                <span>{effect.text || `Combo x${effect.comboCount || 2}`}</span>
              </motion.div>
            );
          }

          if (effect.type === 'heart_lost') {
            // Heart Lost Floating indicator (-1 ❤️)
            return (
              <motion.div
                key={effect.id}
                initial={{ scale: 0.8, y: 0, opacity: 1 }}
                animate={{ scale: 1.1, y: -45, opacity: 0 }}
                exit={{ opacity: 0 }}
                transition={{ duration: 0.8, ease: 'easeOut' }}
                style={{
                  left: effect.x,
                  top: effect.y,
                  transform: 'translate(-50%, -50%)',
                }}
                className="absolute flex items-center gap-1 font-black text-rose-500 text-sm drop-shadow-sm select-none"
              >
                <span>-1</span>
                <span>💔</span>
              </motion.div>
            );
          }

          if (effect.type === 'win_ring') {
            // Victory radial wave
            return (
              <motion.div
                key={effect.id}
                initial={{ scale: 0.1, opacity: 0.8 }}
                animate={{ scale: 3.5, opacity: 0 }}
                exit={{ opacity: 0 }}
                transition={{ duration: 0.9, ease: 'easeOut' }}
                style={{
                  left: effect.x,
                  top: effect.y,
                  transform: 'translate(-50%, -50%)',
                }}
                className="absolute w-24 h-24 rounded-full border-4 border-indigo-400/70"
              />
            );
          }

          return null;
        })}
      </AnimatePresence>
    </div>
  );
};
