import React, { useState, useEffect } from 'react';
import { Play, Pause, SkipBack, SkipForward, RotateCcw, RotateCw, Lock, Unlock, ShieldCheck } from 'lucide-react';
import { Track } from '../../types/spotify';

interface LockScreenSimulatorModalProps {
  isOpen: boolean;
  track: Track | null;
  isPlaying: boolean;
  currentTime: number;
  duration: number;
  onClose: () => void;
  onTogglePlay: () => void;
  onRewind: (seconds?: number) => void;
  onForward: (seconds?: number) => void;
  onSeek: (seconds: number) => void;
  onNext: () => void;
  onPrevious: () => void;
}

export const LockScreenSimulatorModal: React.FC<LockScreenSimulatorModalProps> = ({
  isOpen,
  track,
  isPlaying,
  currentTime,
  duration,
  onClose,
  onTogglePlay,
  onRewind,
  onForward,
  onSeek,
  onNext,
  onPrevious,
}) => {
  const [clock, setClock] = useState('9:41');
  const [dateStr, setDateStr] = useState('Sunday, October 18');

  useEffect(() => {
    const updateTime = () => {
      const now = new Date();
      const hours = now.getHours() % 12 || 12;
      const mins = now.getMinutes().toString().padStart(2, '0');
      setClock(`${hours}:${mins}`);
      setDateStr(now.toLocaleDateString('en-US', { weekday: 'long', month: 'long', day: 'numeric' }));
    };
    updateTime();
    const interval = setInterval(updateTime, 10000);
    return () => clearInterval(interval);
  }, []);

  if (!isOpen || !track) return null;

  const progressPercent = duration > 0 ? (currentTime / duration) * 100 : 0;

  const formatTime = (secs: number) => {
    if (isNaN(secs) || secs < 0) return '0:00';
    const m = Math.floor(secs / 60);
    const s = Math.floor(secs % 60);
    return `${m}:${s < 10 ? '0' : ''}${s}`;
  };

  return (
    <div className="fixed inset-0 z-50 bg-black/90 flex flex-col justify-between p-6 select-none animate-fadeIn backdrop-blur-3xl">
      {/* Liquid background wallpaper with blur */}
      <div
        className="absolute inset-0 bg-cover bg-center opacity-40 filter blur-2xl scale-110 pointer-events-none"
        style={{ backgroundImage: `url(${track.coverUrl})` }}
      />
      <div className="absolute inset-0 bg-gradient-to-t from-black via-black/40 to-transparent pointer-events-none" />

      {/* Top Lock Screen Status & Clock */}
      <div className="relative z-10 flex flex-col items-center pt-8 text-white">
        <div className="flex items-center gap-1.5 text-xs text-neutral-300 mb-2 px-3 py-1 rounded-full liquid-glass-surface">
          <Lock className="w-3.5 h-3.5 text-[#1ed760]" />
          <span>Phone Screen Locked</span>
        </div>

        <p className="text-sm font-medium text-neutral-300">{dateStr}</p>
        <h1 className="text-6xl font-extralight tracking-tight mt-1">{clock}</h1>
      </div>

      {/* Liquid Glass Media Widget */}
      <div className="relative z-10 my-auto w-full max-w-sm mx-auto">
        <div className="liquid-glass-dock rounded-3xl p-5 border border-white/20 shadow-[0_20px_50px_rgba(0,0,0,0.8)] flex flex-col gap-4">
          {/* Top row: Artwork & Title */}
          <div className="flex items-center gap-4">
            <img
              src={track.coverUrl}
              alt={track.title}
              className="w-16 h-16 rounded-2xl object-cover shadow-lg border border-white/20"
            />
            <div className="min-w-0 flex-1">
              <h3 className="text-base font-bold text-white truncate leading-tight">
                {track.title}
              </h3>
              <p className="text-xs font-semibold text-neutral-300 truncate mt-0.5">
                {track.artist}
              </p>
              <div className="flex items-center gap-1.5 mt-1.5 text-[11px] text-[#1ed760] font-semibold">
                <span className="w-1.5 h-1.5 rounded-full bg-[#1ed760] animate-pulse" />
                <span>Liquid Glass • Background Active</span>
              </div>
            </div>
          </div>

          {/* Timeline & Scrubber */}
          <div className="space-y-1">
            <div
              onClick={(e) => {
                const rect = e.currentTarget.getBoundingClientRect();
                const pos = Math.max(0, Math.min(rect.width, e.clientX - rect.left));
                onSeek((pos / rect.width) * duration);
              }}
              className="w-full h-1.5 liquid-glass-surface hover:h-2 rounded-full cursor-pointer relative overflow-hidden transition-all"
            >
              <div
                className="h-full bg-gradient-to-r from-[#1ed760] to-emerald-300 rounded-full transition-all shadow-[0_0_8px_#1ed760]"
                style={{ width: `${progressPercent}%` }}
              />
            </div>
            <div className="flex items-center justify-between text-[11px] font-medium text-neutral-300">
              <span>{formatTime(currentTime)}</span>
              <span>-{formatTime(duration - currentTime)}</span>
            </div>
          </div>

          {/* Lock Screen Media Controls */}
          <div className="flex items-center justify-around py-1">
            {/* Previous */}
            <button
              onClick={onPrevious}
              className="p-2.5 rounded-full liquid-glass-button text-white transition cursor-pointer active:scale-90"
              title="Previous Track"
            >
              <SkipBack className="w-5 h-5 fill-white" />
            </button>

            {/* Rewind 15s */}
            <button
              onClick={() => onRewind(15)}
              className="relative p-2.5 rounded-full liquid-glass-button text-white transition cursor-pointer active:scale-90 flex items-center justify-center"
              title="Rewind 15s"
            >
              <RotateCcw className="w-5 h-5 stroke-[2.2]" />
              <span className="absolute text-[8px] font-black top-2.5 -left-0.5 scale-75">
                15
              </span>
            </button>

            {/* Play / Pause */}
            <button
              onClick={onTogglePlay}
              className="p-3.5 rounded-full liquid-glass-primary text-black hover:scale-105 active:scale-95 transition cursor-pointer shadow-lg"
              title={isPlaying ? 'Pause' : 'Play'}
            >
              {isPlaying ? (
                <Pause className="w-6 h-6 fill-black stroke-black" />
              ) : (
                <Play className="w-6 h-6 fill-black stroke-black translate-x-0.5" />
              )}
            </button>

            {/* Forward 15s */}
            <button
              onClick={() => onForward(15)}
              className="relative p-2.5 rounded-full liquid-glass-button text-white transition cursor-pointer active:scale-90 flex items-center justify-center"
              title="Fast Forward 15s"
            >
              <RotateCw className="w-5 h-5 stroke-[2.2]" />
              <span className="absolute text-[8px] font-black top-2.5 -right-0.5 scale-75">
                15
              </span>
            </button>

            {/* Next */}
            <button
              onClick={onNext}
              className="p-2.5 rounded-full liquid-glass-button text-white transition cursor-pointer active:scale-90"
              title="Next Track"
            >
              <SkipForward className="w-5 h-5 fill-white" />
            </button>
          </div>
        </div>
      </div>

      {/* Bottom unlock swipe indicator */}
      <div className="relative z-10 flex flex-col items-center pb-4 text-neutral-300 gap-2">
        <button
          onClick={onClose}
          className="flex items-center gap-2 px-5 py-2.5 rounded-full liquid-glass-surface text-sm font-semibold text-white transition cursor-pointer shadow-lg active:scale-95 border border-white/20"
        >
          <Unlock className="w-4 h-4 text-emerald-400" />
          <span>Tap to Unlock Phone</span>
        </button>
        <span className="text-[11px] text-neutral-400 flex items-center gap-1">
          <ShieldCheck className="w-3.5 h-3.5 text-[#1ed760]" />
          Real device lock screen controls active via MediaSession
        </span>
      </div>
    </div>
  );
};
