/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from 'react';
import { MinimalArrowsApp } from './components/minimalArrows/MinimalArrowsApp';
import { ArrowPuzzleGame } from './components/puzzle/ArrowPuzzleGame';
import { ArcheryCanvas } from './components/ArcheryCanvas';
import { GameHUD } from './components/GameHUD';
import { GameOverModal } from './components/GameOverModal';
import { GameMode, TrailStyle, GameStats, AppLanguage } from './types';
import { Target, ArrowLeft } from 'lucide-react';

export default function App() {
  const [altMode, setAltMode] = useState<'minimal' | 'archery' | 'grid'>('minimal');

  // If user wants minimal arrows matching video (default)
  if (altMode === 'minimal') {
    return (
      <div className="w-full min-h-[100dvh] bg-[#f0f3fa] flex items-center justify-center sm:p-4">
        <MinimalArrowsApp />
      </div>
    );
  }

  // Fallback archery / grid puzzle modes if toggled
  return (
    <div className="w-full min-h-[100dvh] bg-slate-900 text-slate-100 flex flex-col items-center justify-center p-4">
      <div className="w-full max-w-4xl flex items-center justify-between pb-4">
        <button
          onClick={() => setAltMode('minimal')}
          className="flex items-center gap-2 px-4 py-2 rounded-xl bg-slate-800 text-indigo-400 hover:bg-slate-700 text-xs font-bold transition-all"
        >
          <ArrowLeft className="w-4 h-4" />
          <span>Back to Minimal ▲rrows</span>
        </button>
      </div>

      <div className="w-full max-w-4xl bg-slate-950 rounded-3xl p-6 border border-slate-800 shadow-xl">
        <ArrowPuzzleGame
          language="hi"
        />
      </div>
    </div>
  );
}
