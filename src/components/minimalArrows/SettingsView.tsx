import React from 'react';
import { Volume2, VolumeX, RotateCcw, HelpCircle, Shield, Home, Compass } from 'lucide-react';
import { soundFx } from '../../utils/audio';
import { ArrowHeadStyle } from '../../types/minimalGame';

interface SettingsViewProps {
  soundEnabled: boolean;
  headStyle?: ArrowHeadStyle;
  onToggleSound: () => void;
  onToggleHeadStyle?: () => void;
  onResetProgress: () => void;
  onExitToHome?: () => void;
}

export const SettingsView: React.FC<SettingsViewProps> = ({
  soundEnabled,
  headStyle = 'solid',
  onToggleSound,
  onToggleHeadStyle,
  onResetProgress,
  onExitToHome,
}) => {
  return (
    <div
      id="minimal-settings-screen"
      className="w-full h-full flex flex-col justify-between p-6 bg-white select-none overflow-y-auto"
    >
      <div className="flex flex-col gap-5 pt-4">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-2xl bg-indigo-50 text-indigo-600 flex items-center justify-center font-bold">
              <Shield className="w-5 h-5" />
            </div>
            <div>
              <h2 className="text-xl font-black text-slate-800">Settings</h2>
              <p className="text-xs text-slate-400">Audio, preferences & options</p>
            </div>
          </div>

          {onExitToHome && (
            <button
              onClick={() => {
                soundFx.playTap();
                onExitToHome();
              }}
              className="w-9 h-9 rounded-full bg-slate-100 hover:bg-slate-200 active:scale-95 flex items-center justify-center text-slate-600 transition-colors"
              title="Return to Home"
            >
              <Home className="w-4 h-4" />
            </button>
          )}
        </div>

        {/* Options List */}
        <div className="flex flex-col gap-2.5">
          {/* Sound Toggle */}
          <div
            onClick={onToggleSound}
            className="flex items-center justify-between p-3.5 rounded-2xl bg-slate-50 border border-slate-100 cursor-pointer hover:bg-slate-100/70 transition-colors"
          >
            <div className="flex items-center gap-3">
              <div className="w-8 h-8 rounded-xl bg-white shadow-xs flex items-center justify-center text-slate-700">
                {soundEnabled ? (
                  <Volume2 className="w-4 h-4 text-emerald-500" />
                ) : (
                  <VolumeX className="w-4 h-4 text-slate-400" />
                )}
              </div>
              <div>
                <div className="text-xs font-bold text-slate-800">Sound Effects (आवाज़)</div>
                <div className="text-[10px] text-slate-400">Audio feedback on launches & clears</div>
              </div>
            </div>
            <button
              onClick={e => {
                e.stopPropagation();
                onToggleSound();
              }}
              className={`w-12 h-6.5 rounded-full p-0.5 transition-colors ${
                soundEnabled ? 'bg-[#7c87ff]' : 'bg-slate-300'
              }`}
            >
              <div
                className={`w-5.5 h-5.5 rounded-full bg-white shadow-sm transition-transform ${
                  soundEnabled ? 'translate-x-5.5' : 'translate-x-0'
                }`}
              />
            </button>
          </div>

          {/* 2D Arrow Style Toggle */}
          {onToggleHeadStyle && (
            <div
              onClick={() => {
                soundFx.playTap();
                onToggleHeadStyle();
              }}
              className="flex items-center justify-between p-3.5 rounded-2xl bg-slate-50 border border-slate-100 cursor-pointer hover:bg-slate-100/70 transition-colors"
            >
              <div className="flex items-center gap-3">
                <div className="w-8 h-8 rounded-xl bg-indigo-50 text-indigo-600 flex items-center justify-center font-black text-sm">
                  {headStyle === 'solid' ? '▲' : '❯'}
                </div>
                <div>
                  <div className="text-xs font-bold text-slate-800">2D Arrow Style (तीर का 2D स्टाइल)</div>
                  <div className="text-[10px] text-slate-400">
                    {headStyle === 'solid' ? 'Pure 2D Solid Triangle (▲)' : 'Pure 2D Clean Vector (❯)'}
                  </div>
                </div>
              </div>
              <div className="text-xs font-bold px-3 py-1.5 rounded-xl bg-indigo-100/80 text-indigo-700">
                {headStyle === 'solid' ? 'Solid ▲' : 'Line ❯'}
              </div>
            </div>
          )}

          {/* Rules / How to play */}
          <div className="p-4 rounded-2xl bg-slate-50 border border-slate-100 flex flex-col gap-2">
            <div className="flex items-center gap-2 text-xs font-bold text-slate-800">
              <HelpCircle className="w-4 h-4 text-indigo-500" />
              <span>How to Play (खेलने का तरीका)</span>
            </div>
            <ul className="text-xs text-slate-500 space-y-1.5 list-disc list-inside">
              <li>Tap arrows that face an unobstructed exit path.</li>
              <li>Blocked arrows bump and cost 1 heart (❤️).</li>
              <li>Clear outer boundary arrows first to free intricate inner coils!</li>
            </ul>
          </div>

          {/* Reset progress */}
          <div className="pt-2 flex flex-col gap-2">
            <button
              onClick={() => {
                soundFx.playTap();
                onResetProgress();
              }}
              className="w-full py-3 rounded-2xl border border-rose-200 text-rose-500 hover:bg-rose-50/50 text-xs font-bold transition-all flex items-center justify-center gap-2"
            >
              <RotateCcw className="w-3.5 h-3.5" />
              <span>Reset Game to Level 1</span>
            </button>

            {onExitToHome && (
              <button
                onClick={() => {
                  soundFx.playTap();
                  onExitToHome();
                }}
                className="w-full py-2.5 rounded-2xl bg-slate-100 hover:bg-slate-200 text-slate-600 text-xs font-semibold transition-all flex items-center justify-center gap-2"
              >
                <Home className="w-3.5 h-3.5" />
                <span>Exit to Home Screen</span>
              </button>
            )}
          </div>
        </div>
      </div>

      <div className="text-center text-[10px] text-slate-400 pb-2">
        ▲rrows Minimalist Edition &bull; 100+ Unique Levels
      </div>
    </div>
  );
};
