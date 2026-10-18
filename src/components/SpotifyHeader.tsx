import React from 'react';
import { Settings, ShieldCheck, Download, Sparkles } from 'lucide-react';
import { SpotifyUserProfile } from '../types/spotify';
import { usePWAInstall } from '../hooks/usePWAInstall';

interface SpotifyHeaderProps {
  user: SpotifyUserProfile | null;
  activeFilter: 'all' | 'music' | 'podcasts';
  onFilterChange: (filter: 'all' | 'music' | 'podcasts') => void;
  onOpenAccountModal: () => void;
  onOpenSettingsModal: () => void;
  onOpenApkModal: () => void;
}

export const SpotifyHeader: React.FC<SpotifyHeaderProps> = ({
  user,
  activeFilter,
  onFilterChange,
  onOpenAccountModal,
  onOpenSettingsModal,
  onOpenApkModal,
}) => {
  const { isInstallable, install } = usePWAInstall();

  return (
    <div className="sticky top-0 z-30 px-4 pt-2.5 pb-3 border-b border-white/10 backdrop-blur-2xl bg-white/[0.04] flex flex-col gap-2.5 shadow-sm">
      {/* Top row: Avatar & Brand & Settings */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2.5">
          <button
            onClick={onOpenAccountModal}
            className="relative group cursor-pointer focus:outline-none"
            title="Spotify Account Profile"
          >
            <img
              src={
                user?.avatarUrl ||
                'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=120&auto=format&fit=crop&q=80'
              }
              alt="Profile"
              className="w-8 h-8 rounded-full object-cover ring-2 ring-white/30 group-hover:ring-[#1ed760] transition shadow-md"
            />
            {user?.isConnectedWithRealAccount ? (
              <span className="absolute -bottom-0.5 -right-0.5 w-3 h-3 bg-[#1ed760] rounded-full border-2 border-black" />
            ) : null}
          </button>

          <div>
            <div className="flex items-center gap-1.5">
              <span className="text-sm font-bold text-white tracking-tight">
                {user ? user.displayName : 'Spotify Web'}
              </span>
              <span className="text-[10px] px-2 py-0.2 rounded-full liquid-glass-surface text-emerald-300 font-bold border border-emerald-500/30">
                PRO • NO ADS
              </span>
            </div>
            <p className="text-[11px] text-neutral-300">
              {user?.isConnectedWithRealAccount
                ? 'Synced Spotify Account'
                : 'Tap to connect your Spotify account'}
            </p>
          </div>
        </div>

        <div className="flex items-center gap-1.5">
          <button
            onClick={onOpenApkModal}
            className="flex items-center gap-1.5 px-3 py-1 rounded-full liquid-glass-primary text-black text-xs font-black transition shadow-md cursor-pointer hover:scale-105 active:scale-95"
            title="Install Full App on Phone"
          >
            <Download className="w-3.5 h-3.5 stroke-[3]" />
            <span>Install App</span>
          </button>

          <button
            onClick={onOpenAccountModal}
            className="p-2 rounded-full liquid-glass-button text-neutral-200 hover:text-white transition cursor-pointer"
            title="Spotify Account"
          >
            <Sparkles className="w-4 h-4 text-[#1ed760]" />
          </button>

          <button
            onClick={onOpenSettingsModal}
            className="p-2 rounded-full liquid-glass-button text-neutral-200 hover:text-white transition cursor-pointer"
            title="Audio & Player Settings"
          >
            <Settings className="w-4 h-4" />
          </button>
        </div>
      </div>

      {/* Quick Category Filter Pills with Liquid Glass */}
      <div className="flex items-center gap-2 overflow-x-auto no-scrollbar pt-0.5">
        {(['all', 'music', 'podcasts'] as const).map((filter) => {
          const isActive = activeFilter === filter;
          return (
            <button
              key={filter}
              onClick={() => onFilterChange(filter)}
              className={`px-3.5 py-1.5 rounded-full text-xs font-bold capitalize transition cursor-pointer whitespace-nowrap ${
                isActive
                  ? 'liquid-glass-primary text-black shadow-md'
                  : 'liquid-glass-button text-neutral-200 hover:text-white'
              }`}
            >
              {filter}
            </button>
          );
        })}

        <div className="ml-auto flex items-center gap-1.5 text-[11px] text-emerald-300 font-medium liquid-glass-surface px-2.5 py-1 rounded-full border border-emerald-500/20 whitespace-nowrap">
          <ShieldCheck className="w-3.5 h-3.5 text-[#1ed760]" />
          <span>Rewind & Background On</span>
        </div>
      </div>
    </div>
  );
};
