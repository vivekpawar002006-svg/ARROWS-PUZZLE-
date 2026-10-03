import React, { useState } from 'react';
import { MinimalLevel } from '../../types/minimalGame';
import { generateProceduralMinimalLevel } from '../../data/minimalLevels';
import { Sparkles, Trophy, Shuffle, Play, Zap, Target, Flame, Crown, HelpCircle } from 'lucide-react';
import { soundFx } from '../../utils/audio';

interface ChallengeViewProps {
  onPlayChallengeLevel: (lvl: MinimalLevel) => void;
}

interface ChallengeTier {
  size: number;
  name: string;
  arrowsEstimate: string;
  diffLabel: string;
  badgeColor: string;
  accentColor: string;
  icon: React.ReactNode;
  desc: string;
}

const CHALLENGE_TIERS: ChallengeTier[] = [
  {
    size: 8,
    name: 'Quick Sprint',
    arrowsEstimate: '22 Arrows',
    diffLabel: 'Casual',
    badgeColor: 'bg-emerald-100 text-emerald-800 border-emerald-200',
    accentColor: 'border-emerald-500 bg-emerald-50/50',
    icon: <Zap className="w-4 h-4 text-emerald-600" />,
    desc: 'Compact 8x8 maze with quick escapes and sleek winding arrows.',
  },
  {
    size: 10,
    name: 'Classic Maze',
    arrowsEstimate: '34 Arrows',
    diffLabel: 'Tricky',
    badgeColor: 'bg-blue-100 text-blue-800 border-blue-200',
    accentColor: 'border-blue-500 bg-blue-50/50',
    icon: <Target className="w-4 h-4 text-blue-600" />,
    desc: 'Dense 10x10 labyrinth with interlocking spirals and multi-turn hooks.',
  },
  {
    size: 12,
    name: 'Hard Labyrinth',
    arrowsEstimate: '48 Arrows',
    diffLabel: 'Hard',
    badgeColor: 'bg-amber-100 text-amber-800 border-amber-200',
    accentColor: 'border-amber-500 bg-amber-50/50',
    icon: <Flame className="w-4 h-4 text-amber-600" />,
    desc: 'High-density 12x12 maze with tightly chained blocker dependencies.',
  },
  {
    size: 14,
    name: 'Grandmaster',
    arrowsEstimate: '68 Arrows',
    diffLabel: 'Expert',
    badgeColor: 'bg-purple-100 text-purple-800 border-purple-200',
    accentColor: 'border-purple-500 bg-purple-50/50',
    icon: <Crown className="w-4 h-4 text-purple-600" />,
    desc: 'Massive 14x14 labyrinth. Only 1 arrow is free at the start!',
  },
];

export const ChallengeView: React.FC<ChallengeViewProps> = ({
  onPlayChallengeLevel,
}) => {
  const [selectedSize, setSelectedSize] = useState<number>(10);
  const [challengeSeed, setChallengeSeed] = useState<number>(() => Math.floor(Math.random() * 900) + 100);

  const selectedTier = CHALLENGE_TIERS.find(t => t.size === selectedSize) || CHALLENGE_TIERS[1];

  const handleLaunchChallenge = () => {
    soundFx.playTap();
    const lvl = generateProceduralMinimalLevel(challengeSeed, selectedSize);
    onPlayChallengeLevel(lvl);
  };

  const handleLaunchDaily = () => {
    soundFx.playTap();
    const today = new Date();
    const dailySeed = today.getFullYear() * 10000 + (today.getMonth() + 1) * 100 + today.getDate();
    const lvl = generateProceduralMinimalLevel(dailySeed, 10);
    lvl.title = `Daily Puzzle (${today.toLocaleDateString(undefined, { month: 'short', day: 'numeric' })})`;
    onPlayChallengeLevel(lvl);
  };

  return (
    <div
      id="minimal-challenge-screen"
      className="w-full h-full flex flex-col justify-between p-4 sm:p-5 bg-slate-50/60 select-none overflow-y-auto"
    >
      <div className="flex flex-col gap-4 pt-1 pb-4">
        {/* Header */}
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-2xl bg-indigo-100 text-indigo-600 flex items-center justify-center font-bold shadow-xs">
            <Trophy className="w-5 h-5" />
          </div>
          <div>
            <h2 className="text-xl font-black text-slate-800 tracking-tight">Challenge Mode</h2>
            <p className="text-xs text-slate-500">Pick a maze difficulty or play Daily Challenge</p>
          </div>
        </div>

        {/* Daily Mystery Puzzle Card */}
        <div className="p-4 rounded-2xl bg-gradient-to-br from-indigo-600 to-purple-700 text-white flex flex-col gap-2.5 shadow-md relative overflow-hidden">
          <div className="flex items-center justify-between z-10">
            <div className="flex items-center gap-1.5">
              <Sparkles className="w-4 h-4 text-amber-300" />
              <span className="text-xs font-black uppercase tracking-wider text-amber-200">
                Daily Master Challenge
              </span>
            </div>
            <span className="text-[10px] bg-white/20 text-white px-2 py-0.5 rounded-full font-bold backdrop-blur-xs">
              34 Arrows • 10x10
            </span>
          </div>

          <p className="text-xs text-indigo-100 z-10 leading-relaxed">
            Fresh handcrafted seed for today. All arrows are deeply interlocked with spirals and hooks.
          </p>

          <button
            onClick={handleLaunchDaily}
            className="w-full mt-1 py-2.5 rounded-xl bg-white text-indigo-700 hover:bg-indigo-50 font-black text-xs flex items-center justify-center gap-2 shadow-xs active:scale-98 transition-all cursor-pointer z-10"
          >
            <Play className="w-3.5 h-3.5 fill-current" />
            <span>Play Today's Challenge</span>
          </button>
        </div>

        {/* Difficulty Tier Selector */}
        <div className="flex flex-col gap-2.5">
          <div className="flex items-center justify-between">
            <span className="text-xs font-black text-slate-700 uppercase tracking-wider">
              Select Challenge Size
            </span>
            <button
              onClick={() => {
                soundFx.playTap();
                setChallengeSeed(s => Math.floor(Math.random() * 900) + 100);
              }}
              className="flex items-center gap-1 text-[11px] text-indigo-600 font-bold hover:underline cursor-pointer"
            >
              <Shuffle className="w-3 h-3" />
              <span>Shuffle Layout (#{challengeSeed})</span>
            </button>
          </div>

          {/* Cards for each size */}
          <div className="grid grid-cols-2 gap-2.5">
            {CHALLENGE_TIERS.map(tier => {
              const isSelected = selectedSize === tier.size;
              return (
                <button
                  key={tier.size}
                  onClick={() => {
                    soundFx.playTap();
                    setSelectedSize(tier.size);
                  }}
                  className={`p-3 rounded-2xl border text-left transition-all cursor-pointer flex flex-col justify-between gap-2 ${
                    isSelected
                      ? `bg-white ${tier.accentColor} shadow-sm ring-2 ring-indigo-500/20`
                      : 'bg-white border-slate-200 hover:border-slate-300 hover:bg-slate-50/50'
                  }`}
                >
                  <div className="flex items-center justify-between w-full">
                    <div className="flex items-center gap-1.5">
                      {tier.icon}
                      <span className="text-xs font-black text-slate-800">{tier.size}x{tier.size}</span>
                    </div>
                    <span className={`text-[9px] px-1.5 py-0.5 rounded-md font-black border ${tier.badgeColor}`}>
                      {tier.diffLabel}
                    </span>
                  </div>

                  <div>
                    <h3 className="text-xs font-bold text-slate-700 leading-tight">{tier.name}</h3>
                    <span className="text-[11px] font-black text-indigo-600 mt-0.5 inline-block">
                      {tier.arrowsEstimate}
                    </span>
                  </div>
                </button>
              );
            })}
          </div>
        </div>

        {/* Selected Tier Info & Launch Button */}
        <div className="p-3.5 rounded-2xl bg-white border border-slate-200/80 shadow-xs flex flex-col gap-2.5">
          <div className="flex items-start gap-2 text-slate-600">
            <HelpCircle className="w-4 h-4 text-indigo-500 shrink-0 mt-0.5" />
            <p className="text-[11px] text-slate-600 leading-relaxed">
              <strong className="text-slate-800 font-bold">{selectedTier.name} ({selectedTier.size}x{selectedTier.size})</strong>:{' '}
              {selectedTier.desc} Only 1 arrow has an open exit at first!
            </p>
          </div>

          <button
            onClick={handleLaunchChallenge}
            className="w-full py-3 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white font-black text-sm shadow-md active:scale-98 transition-all flex items-center justify-center gap-2 cursor-pointer"
          >
            <Play className="w-4 h-4 fill-current" />
            <span>Start {selectedTier.name} ({selectedTier.arrowsEstimate})</span>
          </button>
        </div>
      </div>
    </div>
  );
};
