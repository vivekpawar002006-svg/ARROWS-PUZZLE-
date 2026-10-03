import React from 'react';
import { NavTab } from '../../types/minimalGame';
import { Lock, Home, Settings } from 'lucide-react';

interface ArrowsBottomNavProps {
  activeTab: NavTab;
  onSelectTab: (tab: NavTab) => void;
}

export const ArrowsBottomNav: React.FC<ArrowsBottomNavProps> = ({
  activeTab,
  onSelectTab,
}) => {
  return (
    <nav
      id="minimal-bottom-navigation"
      className="w-full bg-[#f8f9fe] border-t border-slate-200/60 pt-2 pb-5 px-6 flex flex-col items-center justify-center select-none"
    >
      <div className="w-full max-w-xs flex items-center justify-around">
        {/* Challenge Tab */}
        <button
          id="tab-challenge-btn"
          onClick={() => onSelectTab('challenge')}
          className={`flex flex-col items-center gap-1 py-1 px-3 rounded-2xl transition-all ${
            activeTab === 'challenge'
              ? 'text-indigo-600'
              : 'text-slate-400 hover:text-slate-600'
          }`}
        >
          <div
            className={`w-10 h-8 flex items-center justify-center rounded-2xl transition-colors ${
              activeTab === 'challenge' ? 'bg-indigo-100/70 text-indigo-600' : ''
            }`}
          >
            <Lock className="w-4 h-4" />
          </div>
          <span className="text-[11px] font-bold">Challenge</span>
        </button>

        {/* Home Tab (highlighted by default in video 00:00) */}
        <button
          id="tab-home-btn"
          onClick={() => onSelectTab('home')}
          className={`flex flex-col items-center gap-1 py-1 px-3 rounded-2xl transition-all ${
            activeTab === 'home'
              ? 'text-indigo-600'
              : 'text-slate-400 hover:text-slate-600'
          }`}
        >
          <div
            className={`w-12 h-8 flex items-center justify-center rounded-2xl transition-colors ${
              activeTab === 'home' ? 'bg-[#e2e6ff] text-indigo-600' : ''
            }`}
          >
            <Home className="w-5 h-5 fill-current" />
          </div>
          <span className="text-[11px] font-bold">Home</span>
        </button>

        {/* Settings Tab */}
        <button
          id="tab-settings-btn"
          onClick={() => onSelectTab('settings')}
          className={`flex flex-col items-center gap-1 py-1 px-3 rounded-2xl transition-all ${
            activeTab === 'settings'
              ? 'text-indigo-600'
              : 'text-slate-400 hover:text-slate-600'
          }`}
        >
          <div
            className={`w-10 h-8 flex items-center justify-center rounded-2xl transition-colors ${
              activeTab === 'settings' ? 'bg-indigo-100/70 text-indigo-600' : ''
            }`}
          >
            <Settings className="w-4 h-4" />
          </div>
          <span className="text-[11px] font-bold">Settings</span>
        </button>
      </div>

      {/* Modern bottom home indicator line as seen in video 00:00 */}
      <div className="w-28 h-1 bg-slate-800 rounded-full mt-3 opacity-80" />
    </nav>
  );
};
