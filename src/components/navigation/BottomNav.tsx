import React from 'react';
import { Home, Search, Library, Sparkles } from 'lucide-react';

export type NavTab = 'home' | 'search' | 'library' | 'premium';

interface BottomNavProps {
  activeTab: NavTab;
  onTabChange: (tab: NavTab) => void;
}

export const BottomNav: React.FC<BottomNavProps> = ({ activeTab, onTabChange }) => {
  const tabs = [
    { id: 'home' as const, label: 'Home', icon: Home },
    { id: 'search' as const, label: 'Search', icon: Search },
    { id: 'library' as const, label: 'Your Library', icon: Library },
    { id: 'premium' as const, label: 'Perks', icon: Sparkles },
  ];

  return (
    <div className="z-30 px-3 pb-3 pt-1 select-none">
      <div className="liquid-glass-dock rounded-2xl py-1 px-2 flex items-center justify-around shadow-2xl">
        {tabs.map((tab) => {
          const Icon = tab.icon;
          const isActive = activeTab === tab.id;
          return (
            <button
              key={tab.id}
              onClick={() => onTabChange(tab.id)}
              className={`flex flex-col items-center justify-center gap-1 py-1.5 px-3 rounded-xl transition-all cursor-pointer relative ${
                isActive
                  ? 'text-[#1ed760] font-bold'
                  : 'text-neutral-400 hover:text-white'
              }`}
            >
              {isActive && (
                <span className="absolute -top-1 w-6 h-[2px] bg-[#1ed760] rounded-full shadow-[0_0_8px_#1ed760]" />
              )}
              <Icon className={`w-5 h-5 ${isActive ? 'stroke-[2.5]' : 'stroke-2'}`} />
              <span className="text-[10px] tracking-tight">
                {tab.label}
              </span>
            </button>
          );
        })}
      </div>
    </div>
  );
};
