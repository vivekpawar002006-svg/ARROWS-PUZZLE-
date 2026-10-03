import React, { useState, useEffect } from 'react';
import { NavTab, MinimalLevel, ArrowHeadStyle } from '../../types/minimalGame';
import { getLevel, TOTAL_LEVELS_COUNT } from '../../data/minimalLevels';
import { ArrowsHomeView } from './ArrowsHomeView';
import { ArrowsGameView } from './ArrowsGameView';
import { ArrowsBottomNav } from './ArrowsBottomNav';
import { ChallengeView } from './ChallengeView';
import { SettingsView } from './SettingsView';
import { soundFx } from '../../utils/audio';

export const MinimalArrowsApp: React.FC = () => {
  const [activeTab, setActiveTab] = useState<NavTab>('home');
  const [isPlaying, setIsPlaying] = useState<boolean>(false);
  const [soundEnabled, setSoundEnabled] = useState<boolean>(true);

  // 2D Arrow Style: 'solid' (Pure Flat 2D Triangle ▲) or 'chevron' (Pure Flat 2D Line ❯)
  const [arrowHeadStyle, setArrowHeadStyle] = useState<ArrowHeadStyle>(() => {
    try {
      const saved = localStorage.getItem('minimal_arrow_head_style');
      return (saved === 'chevron' || saved === 'solid') ? saved : 'solid';
    } catch {
      return 'solid';
    }
  });

  // Unlocked level tracking (defaults to 0 for Level 1, or saved from localStorage)
  // Progressive gating: Next level opens ONLY when currently open level is completed!
  const [unlockedLevelIndex, setUnlockedLevelIndex] = useState<number>(() => {
    try {
      const saved = localStorage.getItem('minimal_arrows_unlocked_idx');
      return saved !== null ? Math.max(0, parseInt(saved, 10)) : 0;
    } catch {
      return 0;
    }
  });

  // Level tracking (defaults to Level 1 or saved index, clamped to unlocked levels)
  const [currentLevelIndex, setCurrentLevelIndex] = useState<number>(() => {
    try {
      const savedUnlocked = localStorage.getItem('minimal_arrows_unlocked_idx');
      const maxUnlocked = savedUnlocked !== null ? Math.max(0, parseInt(savedUnlocked, 10)) : 0;
      const saved = localStorage.getItem('minimal_arrows_level_idx');
      const idx = saved !== null ? parseInt(saved, 10) : 0;
      return Math.min(idx, maxUnlocked);
    } catch {
      return 0;
    }
  });

  const [activeCustomLevel, setActiveCustomLevel] = useState<MinimalLevel | null>(null);

  useEffect(() => {
    try {
      localStorage.setItem('minimal_arrows_level_idx', currentLevelIndex.toString());
    } catch {
      // Ignore
    }
  }, [currentLevelIndex]);

  useEffect(() => {
    try {
      localStorage.setItem('minimal_arrows_unlocked_idx', unlockedLevelIndex.toString());
    } catch {
      // Ignore
    }
  }, [unlockedLevelIndex]);

  useEffect(() => {
    try {
      localStorage.setItem('minimal_arrow_head_style', arrowHeadStyle);
    } catch {
      // Ignore
    }
  }, [arrowHeadStyle]);

  const handleToggleArrowHeadStyle = () => {
    setArrowHeadStyle(prev => (prev === 'solid' ? 'chevron' : 'solid'));
  };

  // Retrieve current level data (supports all 250 levels)
  const activeLevel = activeCustomLevel || getLevel(currentLevelIndex + 1);

  const handleStartLevel = () => {
    setActiveCustomLevel(null);
    setIsPlaying(true);
  };

  // Unlock next level as soon as a level is completed
  const handleLevelComplete = (completedIdx: number) => {
    const nextUnlocked = Math.max(unlockedLevelIndex, completedIdx + 1);
    setUnlockedLevelIndex(nextUnlocked);
  };

  const handleNextLevel = () => {
    if (activeCustomLevel) {
      setActiveCustomLevel(null);
      setIsPlaying(false);
    } else {
      // Advance to next level only upon completing current level
      const nextIdx = currentLevelIndex + 1;
      if (nextIdx < TOTAL_LEVELS_COUNT) {
        setUnlockedLevelIndex(prev => Math.max(prev, nextIdx));
        setCurrentLevelIndex(nextIdx);
      } else {
        setIsPlaying(false);
        setActiveTab('home');
      }
    }
  };

  const handleRestartLevel = () => {
    setIsPlaying(false);
    setTimeout(() => setIsPlaying(true), 40);
  };

  const handleBackToHome = () => {
    setIsPlaying(false);
    setActiveCustomLevel(null);
    setActiveTab('home');
  };

  const handlePlayChallengeLevel = (lvl: MinimalLevel) => {
    setActiveCustomLevel(lvl);
    setIsPlaying(true);
  };

  const handleToggleSound = () => {
    const next = !soundEnabled;
    setSoundEnabled(next);
    soundFx.setEnabled(next);
  };

  const handleResetProgress = () => {
    setCurrentLevelIndex(0);
    setUnlockedLevelIndex(0);
    try {
      localStorage.setItem('minimal_arrows_level_idx', '0');
      localStorage.setItem('minimal_arrows_unlocked_idx', '0');
    } catch {
      // Ignore
    }
    setIsPlaying(false);
    setActiveTab('home');
  };

  return (
    <div
      id="minimal-arrows-app-container"
      className="w-full max-w-md h-[100dvh] max-h-[880px] mx-auto bg-white rounded-none sm:rounded-3xl sm:border sm:border-slate-200/80 sm:shadow-xs flex flex-col justify-between overflow-hidden relative"
    >
      {/* Active Screen Area */}
      <main className="w-full flex-1 flex flex-col overflow-hidden relative">
        {isPlaying ? (
          <ArrowsGameView
            key={`game-${activeLevel.id}-${isPlaying}`}
            level={activeLevel}
            soundEnabled={soundEnabled}
            headStyle={arrowHeadStyle}
            onBackToHome={handleBackToHome}
            onNextLevel={handleNextLevel}
            onLevelComplete={handleLevelComplete}
            onRestartLevel={handleRestartLevel}
            onToggleSound={handleToggleSound}
            onToggleHeadStyle={handleToggleArrowHeadStyle}
          />
        ) : (
          <>
            {activeTab === 'home' && (
              <ArrowsHomeView
                currentLevelIndex={currentLevelIndex}
                unlockedLevelIndex={unlockedLevelIndex}
                onStartLevel={handleStartLevel}
                onSelectLevelIndex={idx => {
                  if (idx <= unlockedLevelIndex) {
                    setCurrentLevelIndex(idx);
                  }
                }}
                onOpenSettings={() => setActiveTab('settings')}
              />
            )}
            {activeTab === 'challenge' && (
              <ChallengeView onPlayChallengeLevel={handlePlayChallengeLevel} />
            )}
            {activeTab === 'settings' && (
              <SettingsView
                soundEnabled={soundEnabled}
                headStyle={arrowHeadStyle}
                onToggleSound={handleToggleSound}
                onToggleHeadStyle={handleToggleArrowHeadStyle}
                onResetProgress={handleResetProgress}
                onExitToHome={() => setActiveTab('home')}
              />
            )}
          </>
        )}
      </main>

      {/* Bottom Navigation Bar (visible when on menus, matching video 00:00) */}
      {!isPlaying && (
        <ArrowsBottomNav
          activeTab={activeTab}
          onSelectTab={tab => {
            soundFx.playTap();
            setActiveTab(tab);
          }}
        />
      )}
    </div>
  );
};
