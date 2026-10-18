import React from 'react';
import {
  Sparkles,
  ShieldCheck,
  RotateCcw,
  Radio,
  Mic2,
  Sliders,
  Smartphone,
  Download,
  UserCheck
} from 'lucide-react';
import { SpotifyUserProfile } from '../../types/spotify';
import { usePWAInstall } from '../../hooks/usePWAInstall';

interface PremiumViewProps {
  user: SpotifyUserProfile | null;
  onOpenAccountModal: () => void;
  onOpenLockscreenSimulator: () => void;
  onOpenApkModal: () => void;
}

export const PremiumView: React.FC<PremiumViewProps> = ({
  user,
  onOpenAccountModal,
  onOpenLockscreenSimulator,
  onOpenApkModal,
}) => {
  const { isInstallable, install } = usePWAInstall();

  const features = [
    {
      icon: RotateCcw,
      title: 'Unrestricted Music Rewind',
      desc: 'Tap -15s to rewind instantly, or drag the liquid glass slider to any exact second of the song with zero lag.',
      badge: 'Instant Scrub'
    },
    {
      icon: ShieldCheck,
      title: 'Zero Ads Guaranteed',
      desc: 'No commercial interruptions, no audio ads between songs, and no sponsored breaks. Pure continuous listening.',
      badge: 'Active Always'
    },
    {
      icon: Radio,
      title: 'Background Audio & Lockscreen',
      desc: 'Continues playing when your phone screen turns off or when you switch apps. Full lockscreen widget controls.',
      badge: 'MediaSession API'
    },
    {
      icon: UserCheck,
      title: 'Instant Spotify Account Sync',
      desc: 'Connect your Spotify account in 1 tap without any developer keys or complex setup.',
      badge: 'Zero Developer Setup'
    },
    {
      icon: Mic2,
      title: 'Synchronized Real-Time Lyrics',
      desc: 'Follow along word-for-word and tap any line in the lyrics sheet to rewind right to that verse.',
      badge: 'Live Sync'
    },
    {
      icon: Sliders,
      title: 'Liquid Glass Equalizer & DSP FX',
      desc: 'Web Audio 3-band parametric equalizer with Bass Boost, Vocal Clarity, and Electronic presets.',
      badge: '320 kbps HD'
    },
  ];

  return (
    <div className="flex-1 overflow-y-auto px-4 py-4 space-y-5 select-none pb-28">
      {/* Hero Badge Banner */}
      <div className="relative rounded-3xl p-5 liquid-glass-surface overflow-hidden shadow-2xl border border-white/20">
        <div className="relative z-10 space-y-2.5">
          <div className="flex items-center gap-2">
            <span className="p-1.5 rounded-xl liquid-glass-primary text-black">
              <Sparkles className="w-4 h-4 stroke-[2.5]" />
            </span>
            <span className="text-xs font-black uppercase tracking-wider text-[#1ed760]">
              LIQUID GLASS • NO ADS & REWIND
            </span>
          </div>

          <h2 className="text-xl font-black text-white leading-tight">
            The Unlocked Spotify Experience on Phone
          </h2>

          <p className="text-xs text-neutral-300 leading-relaxed">
            Every song can be rewound, scrubbed, looped, and listened to in the background with zero ads.
          </p>

          <div className="pt-2 flex flex-wrap gap-2">
            <button
              onClick={onOpenApkModal}
              className="px-4 py-2 rounded-full liquid-glass-primary text-black text-xs font-black transition cursor-pointer shadow-lg hover:scale-105 active:scale-95 flex items-center gap-1.5"
            >
              <Download className="w-4 h-4 stroke-[3]" />
              <span>Download Android APK</span>
            </button>

            <button
              onClick={onOpenAccountModal}
              className="px-3.5 py-2 rounded-full liquid-glass-button text-white text-xs font-bold transition cursor-pointer flex items-center gap-1.5"
            >
              <UserCheck className="w-3.5 h-3.5 text-[#1ed760]" />
              <span>{user?.isConnectedWithRealAccount ? 'Spotify Profile' : 'Connect Account'}</span>
            </button>

            <button
              onClick={onOpenLockscreenSimulator}
              className="px-3.5 py-2 rounded-full liquid-glass-button text-white text-xs font-bold transition cursor-pointer flex items-center gap-1.5"
            >
              <Radio className="w-3.5 h-3.5 text-emerald-400" />
              <span>Lock Screen</span>
            </button>
          </div>
        </div>
      </div>

      {/* Feature Highlights Grid */}
      <div className="space-y-3">
        <h3 className="text-xs font-bold text-neutral-300 uppercase tracking-wider">
          Unlocked Features
        </h3>

        <div className="space-y-2.5">
          {features.map((feat, i) => {
            const Icon = feat.icon;
            return (
              <div
                key={i}
                className="p-3.5 rounded-2xl liquid-glass-card transition flex items-start gap-3.5"
              >
                <div className="p-2.5 rounded-xl liquid-glass-button text-[#1ed760] flex-shrink-0 mt-0.5">
                  <Icon className="w-5 h-5" />
                </div>
                <div className="min-w-0 flex-1">
                  <div className="flex items-center justify-between gap-2">
                    <h4 className="text-xs font-bold text-white">
                      {feat.title}
                    </h4>
                    <span className="text-[10px] px-2 py-0.5 rounded-full liquid-glass-surface text-[#1ed760] font-bold whitespace-nowrap">
                      {feat.badge}
                    </span>
                  </div>
                  <p className="text-[11px] text-neutral-300 mt-1 leading-relaxed">
                    {feat.desc}
                  </p>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Android APK Download Card */}
      <div className="p-4 rounded-2xl liquid-glass-surface flex items-center justify-between border border-emerald-500/30 shadow-lg">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl liquid-glass-primary flex items-center justify-center text-black font-black flex-shrink-0">
            <Smartphone className="w-5 h-5 stroke-[2.5]" />
          </div>
          <div>
            <h4 className="text-xs font-bold text-white">Android APK Package</h4>
            <p className="text-[11px] text-neutral-300">Download .apk file for your phone</p>
          </div>
        </div>
        <button
          onClick={onOpenApkModal}
          className="px-3.5 py-2 rounded-xl liquid-glass-primary text-black text-xs font-black transition flex items-center gap-1.5 cursor-pointer shadow-md hover:scale-105 active:scale-95"
        >
          <Download className="w-3.5 h-3.5 stroke-[3]" />
          <span>Get APK</span>
        </button>
      </div>
    </div>
  );
};
