import React from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Volume2, VolumeX, RotateCcw, LogOut, X, Play } from 'lucide-react';
import { soundFx } from '../../utils/audio';
import { ArrowHeadStyle } from '../../types/minimalGame';

interface GameSettingsModalProps {
  isOpen: boolean;
  soundEnabled: boolean;
  levelNumber: number;
  headStyle?: ArrowHeadStyle;
  onClose: () => void;
  onToggleSound: () => void;
  onRestartLevel: () => void;
  onExitGame: () => void;
  onToggleHeadStyle?: () => void;
}

export const GameSettingsModal: React.FC<GameSettingsModalProps> = ({
  isOpen,
  soundEnabled,
  levelNumber,
  headStyle = 'solid',
  onClose,
  onToggleSound,
  onRestartLevel,
  onExitGame,
  onToggleHeadStyle,
}) => {
  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          id="game-settings-backdrop"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-4 select-none"
        >
          <motion.div
            id="game-settings-card"
            initial={{ scale: 0.92, y: 15, opacity: 0 }}
            animate={{ scale: 1, y: 0, opacity: 1 }}
            exit={{ scale: 0.92, y: 15, opacity: 0 }}
            transition={{ type: 'spring', damping: 25, stiffness: 300 }}
            className="w-full max-w-xs bg-white rounded-3xl p-6 shadow-2xl flex flex-col gap-5 border border-slate-100"
          >
            {/* Header */}
            <div className="flex items-center justify-between pb-2 border-b border-slate-100">
              <div className="flex flex-col">
                <h3 className="text-lg font-black text-slate-800 tracking-tight">Settings</h3>
                <span className="text-xs text-indigo-500 font-semibold">Level {levelNumber}</span>
              </div>
              <button
                id="close-settings-modal-btn"
                onClick={() => {
                  soundFx.playTap();
                  onClose();
                }}
                className="w-8 h-8 rounded-full bg-slate-100 hover:bg-slate-200 active:scale-95 flex items-center justify-center text-slate-500 transition-colors"
                aria-label="Close settings"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            {/* Settings Options List: Sound, Arrow Style, Restart, Exit */}
            <div className="flex flex-col gap-3">
              {/* Option 1: Sound Toggle */}
              <div
                id="setting-sound-row"
                className="flex items-center justify-between p-3.5 rounded-2xl bg-slate-50 hover:bg-slate-100/80 transition-colors cursor-pointer"
                onClick={onToggleSound}
              >
                <div className="flex items-center gap-3">
                  <div
                    className={`w-9 h-9 rounded-xl flex items-center justify-center ${
                      soundEnabled
                        ? 'bg-indigo-100 text-indigo-600'
                        : 'bg-slate-200 text-slate-400'
                    }`}
                  >
                    {soundEnabled ? (
                      <Volume2 className="w-5 h-5" />
                    ) : (
                      <VolumeX className="w-5 h-5" />
                    )}
                  </div>
                  <div>
                    <span className="text-sm font-bold text-slate-800 block">Sound</span>
                    <span className="text-[11px] text-slate-400 block">
                      {soundEnabled ? 'Enabled' : 'Muted'}
                    </span>
                  </div>
                </div>

                {/* Switch Toggle Button */}
                <div
                  className={`w-11 h-6 flex items-center rounded-full p-1 transition-colors duration-200 ${
                    soundEnabled ? 'bg-indigo-500 justify-end' : 'bg-slate-300 justify-start'
                  }`}
                >
                  <motion.div
                    layout
                    className="w-4 h-4 rounded-full bg-white shadow-sm"
                    transition={{ type: 'spring', stiffness: 500, damping: 30 }}
                  />
                </div>
              </div>

              {/* Option: 2D Arrow Style Toggle */}
              {onToggleHeadStyle && (
                <div
                  id="setting-arrow-style-row"
                  className="flex items-center justify-between p-3.5 rounded-2xl bg-slate-50 hover:bg-slate-100/80 transition-colors cursor-pointer"
                  onClick={() => {
                    soundFx.playTap();
                    onToggleHeadStyle();
                  }}
                >
                  <div className="flex items-center gap-3">
                    <div className="w-9 h-9 rounded-xl bg-indigo-50 text-indigo-600 flex items-center justify-center font-black text-base">
                      {headStyle === 'solid' ? '▲' : '❯'}
                    </div>
                    <div>
                      <span className="text-sm font-bold text-slate-800 block">2D Arrow Head</span>
                      <span className="text-[11px] text-slate-400 block">
                        {headStyle === 'solid' ? 'Pure 2D Solid (▲)' : 'Pure 2D Line (❯)'}
                      </span>
                    </div>
                  </div>
                  <div className="text-xs font-bold px-2.5 py-1 rounded-lg bg-indigo-100/70 text-indigo-700">
                    {headStyle === 'solid' ? 'Solid ▲' : 'Line ❯'}
                  </div>
                </div>
              )}

              {/* Option 2: Restart Level */}
              <button
                id="setting-restart-btn"
                onClick={() => {
                  soundFx.playTap();
                  onClose();
                  onRestartLevel();
                }}
                className="w-full flex items-center gap-3 p-3.5 rounded-2xl bg-slate-50 hover:bg-rose-50 active:scale-98 transition-all text-left group"
              >
                <div className="w-9 h-9 rounded-xl bg-amber-100 group-hover:bg-rose-100 text-amber-600 group-hover:text-rose-600 flex items-center justify-center transition-colors">
                  <RotateCcw className="w-5 h-5" />
                </div>
                <div>
                  <span className="text-sm font-bold text-slate-800 group-hover:text-rose-700 block transition-colors">
                    Restart Level
                  </span>
                  <span className="text-[11px] text-slate-400 group-hover:text-rose-400 block transition-colors">
                    Reset arrows and refill 3 hearts
                  </span>
                </div>
              </button>

              {/* Option 3: Exit Game */}
              <button
                id="setting-exit-btn"
                onClick={() => {
                  soundFx.playTap();
                  onClose();
                  onExitGame();
                }}
                className="w-full flex items-center gap-3 p-3.5 rounded-2xl bg-slate-50 hover:bg-slate-100 active:scale-98 transition-all text-left group"
              >
                <div className="w-9 h-9 rounded-xl bg-slate-200 group-hover:bg-slate-300 text-slate-600 flex items-center justify-center transition-colors">
                  <LogOut className="w-5 h-5" />
                </div>
                <div>
                  <span className="text-sm font-bold text-slate-800 block">Exit to Menu</span>
                  <span className="text-[11px] text-slate-400 block">
                    Return to home entrance
                  </span>
                </div>
              </button>
            </div>

            {/* Resume Button */}
            <button
              id="setting-resume-btn"
              onClick={() => {
                soundFx.playTap();
                onClose();
              }}
              className="w-full py-3 rounded-2xl bg-[#7c87ff] hover:bg-[#6c78f0] active:scale-98 text-white font-bold text-sm shadow-md shadow-indigo-200/60 flex items-center justify-center gap-2 transition-all"
            >
              <Play className="w-4 h-4 fill-white" />
              <span>Resume</span>
            </button>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};
