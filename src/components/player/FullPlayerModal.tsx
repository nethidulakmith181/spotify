import React, { useState, useRef } from 'react';
import {
  ChevronDown,
  MoreVertical,
  Heart,
  Shuffle,
  SkipBack,
  Play,
  Pause,
  SkipForward,
  Repeat,
  Repeat1,
  RotateCcw,
  RotateCw,
  Mic2,
  ListMusic,
  Sliders,
  Volume2,
  VolumeX,
  Smartphone
} from 'lucide-react';
import { Track, RepeatMode } from '../../types/spotify';

interface FullPlayerModalProps {
  isOpen: boolean;
  track: Track | null;
  isPlaying: boolean;
  currentTime: number;
  duration: number;
  isLiked?: boolean;
  repeatMode: RepeatMode;
  isShuffled: boolean;
  volume: number;
  playbackSpeed: number;
  onClose: () => void;
  onTogglePlay: () => void;
  onRewind: (seconds?: number) => void;
  onForward: (seconds?: number) => void;
  onSeek: (seconds: number) => void;
  onNext: () => void;
  onPrevious: () => void;
  onToggleShuffle: () => void;
  onCycleRepeat: () => void;
  onToggleLike: (trackId: string) => void;
  onSetVolume: (vol: number) => void;
  onSetSpeed: (speed: number) => void;
  onOpenLyrics: () => void;
  onOpenQueue: () => void;
  onOpenSettings: () => void;
}

export const FullPlayerModal: React.FC<FullPlayerModalProps> = ({
  isOpen,
  track,
  isPlaying,
  currentTime,
  duration,
  isLiked = false,
  repeatMode,
  isShuffled,
  volume,
  playbackSpeed,
  onClose,
  onTogglePlay,
  onRewind,
  onForward,
  onSeek,
  onNext,
  onPrevious,
  onToggleShuffle,
  onCycleRepeat,
  onToggleLike,
  onSetVolume,
  onSetSpeed,
  onOpenLyrics,
  onOpenQueue,
  onOpenSettings,
}) => {
  const [isScrubbing, setIsScrubbing] = useState(false);
  const [scrubTime, setScrubTime] = useState(0);
  const [showSpeedMenu, setShowSpeedMenu] = useState(false);
  const progressBarRef = useRef<HTMLDivElement>(null);

  if (!isOpen || !track) return null;

  const displayTime = isScrubbing ? scrubTime : currentTime;
  const progressPercent = duration > 0 ? (displayTime / duration) * 100 : 0;

  const formatTime = (seconds: number) => {
    if (isNaN(seconds) || seconds < 0) return '0:00';
    const mins = Math.floor(seconds / 60);
    const secs = Math.floor(seconds % 60);
    return `${mins}:${secs < 10 ? '0' : ''}${secs}`;
  };

  const remainingTime = duration - displayTime;

  // Handle Scrubbing
  const handleSeekFromEvent = (e: React.MouseEvent<HTMLDivElement> | React.TouchEvent<HTMLDivElement>) => {
    if (!progressBarRef.current) return;
    const rect = progressBarRef.current.getBoundingClientRect();
    const clientX = 'touches' in e ? e.touches[0].clientX : e.clientX;
    const clickPos = Math.max(0, Math.min(rect.width, clientX - rect.left));
    const percentage = clickPos / rect.width;
    const targetSeconds = percentage * duration;
    return targetSeconds;
  };

  const handlePointerDown = (e: React.MouseEvent<HTMLDivElement> | React.TouchEvent<HTMLDivElement>) => {
    setIsScrubbing(true);
    const target = handleSeekFromEvent(e);
    if (target !== undefined) {
      setScrubTime(target);
    }
  };

  const handlePointerMove = (e: React.MouseEvent<HTMLDivElement> | React.TouchEvent<HTMLDivElement>) => {
    if (!isScrubbing) return;
    const target = handleSeekFromEvent(e);
    if (target !== undefined) {
      setScrubTime(target);
    }
  };

  const handlePointerUp = () => {
    if (isScrubbing) {
      onSeek(scrubTime);
      setIsScrubbing(false);
    }
  };

  const accentColor = track.accentColor || '#1DB954';

  return (
    <div
      className="fixed inset-0 z-50 flex flex-col justify-between overflow-y-auto select-none transition-all duration-300 backdrop-blur-3xl animate-fadeIn"
      style={{
        background: `radial-gradient(circle at 50% 20%, ${accentColor}88 0%, rgba(15,16,22,0.88) 60%, #08090d 100%)`,
      }}
      onMouseUp={handlePointerUp}
      onTouchEnd={handlePointerUp}
    >
      {/* Liquid Glass Overlay Shimmer */}
      <div className="absolute inset-0 bg-white/[0.03] pointer-events-none" />

      {/* Top Bar */}
      <div className="relative z-10 flex items-center justify-between px-5 pt-4 pb-2">
        <button
          onClick={onClose}
          className="p-2 -ml-2 rounded-full liquid-glass-button text-white transition cursor-pointer"
          title="Minimize player"
        >
          <ChevronDown className="w-6 h-6" />
        </button>

        <div className="text-center min-w-0 px-2 flex-1">
          <p className="text-[10px] uppercase font-bold tracking-widest text-emerald-300 truncate">
            PLAYING FROM PLAYLIST
          </p>
          <h3 className="text-xs font-bold text-white truncate">
            {track.album || "Today's Top Hits"}
          </h3>
        </div>

        <button
          onClick={onOpenSettings}
          className="p-2 -mr-2 rounded-full liquid-glass-button text-white transition cursor-pointer"
          title="Playback settings"
        >
          <MoreVertical className="w-5 h-5" />
        </button>
      </div>

      {/* Album Artwork with Liquid Glass Frame */}
      <div className="relative z-10 flex-1 flex items-center justify-center px-8 py-3 max-h-[350px]">
        <div className="relative group w-full max-w-[290px] aspect-square rounded-3xl overflow-hidden shadow-[0_25px_60px_rgba(0,0,0,0.85),inset_0_1px_2px_rgba(255,255,255,0.6)] border border-white/25 transition-transform duration-300 hover:scale-[1.02]">
          <img
            src={track.coverUrl}
            alt={track.title}
            className="w-full h-full object-cover"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black/40 via-transparent to-transparent pointer-events-none" />
        </div>
      </div>

      {/* Song Info & Like Button */}
      <div className="relative z-10 px-6 pt-2 pb-1 flex items-center justify-between">
        <div className="min-w-0 flex-1 mr-3">
          <h2 className="text-lg sm:text-xl font-black text-white truncate tracking-tight">
            {track.title}
          </h2>
          <p className="text-sm font-semibold text-neutral-300 truncate mt-0.5">
            {track.artist}
          </p>
        </div>

        <button
          onClick={() => onToggleLike(track.id)}
          className={`p-3 rounded-full liquid-glass-button transition cursor-pointer ${
            isLiked ? 'text-[#1ed760] border-emerald-500/40' : 'text-neutral-400 hover:text-white'
          }`}
          title={isLiked ? 'Saved to Your Library' : 'Save to Your Library'}
        >
          <Heart className={`w-5 h-5 ${isLiked ? 'fill-[#1ed760]' : ''}`} />
        </button>
      </div>

      {/* Scrubber / Liquid Glass Timeline Slider */}
      <div className="relative z-10 px-6 py-2">
        <div
          ref={progressBarRef}
          onMouseDown={handlePointerDown}
          onMouseMove={handlePointerMove}
          onTouchStart={handlePointerDown}
          onTouchMove={handlePointerMove}
          className="relative h-6 flex items-center cursor-pointer group"
        >
          {/* Glass track background */}
          <div className="w-full h-1.5 liquid-glass-surface rounded-full overflow-hidden relative group-hover:h-2 transition-all">
            <div
              className="h-full bg-gradient-to-r from-[#1ed760] to-emerald-300 rounded-full shadow-[0_0_10px_#1ed760] transition-all"
              style={{ width: `${progressPercent}%` }}
            />
          </div>

          {/* Liquid glass handle */}
          <div
            className="absolute w-4 h-4 bg-white rounded-full shadow-[0_0_12px_rgba(255,255,255,0.9)] border border-white/60 -translate-x-1/2 opacity-0 group-hover:opacity-100 transition-opacity"
            style={{ left: `${progressPercent}%` }}
          />
        </div>

        {/* Timestamps */}
        <div className="flex items-center justify-between text-[11px] font-semibold text-neutral-300 -mt-1">
          <span>{formatTime(displayTime)}</span>
          <span className="text-[10px] text-emerald-300 font-bold px-2 py-0.5 rounded-full liquid-glass-surface border border-emerald-500/30">
            Ad-Free • Rewind Anytime
          </span>
          <span>-{formatTime(remainingTime)}</span>
        </div>
      </div>

      {/* Main Playback Controls: Includes Dedicated -15s Rewind & +15s Fast Forward */}
      <div className="relative z-10 px-6 py-3 flex items-center justify-between">
        {/* Shuffle Button */}
        <button
          onClick={onToggleShuffle}
          className={`p-2.5 rounded-full liquid-glass-button transition cursor-pointer ${
            isShuffled ? 'text-[#1ed760] border-emerald-500/40' : 'text-neutral-400 hover:text-white'
          }`}
          title={isShuffled ? 'Shuffle On' : 'Shuffle Off'}
        >
          <Shuffle className="w-4 h-4" />
        </button>

        {/* Previous Track */}
        <button
          onClick={onPrevious}
          className="p-2.5 rounded-full liquid-glass-button text-white hover:text-neutral-200 transition cursor-pointer active:scale-90"
          title="Previous Track / Rewind to Start"
        >
          <SkipBack className="w-6 h-6 fill-white" />
        </button>

        {/* REWIND 15 SECONDS BUTTON */}
        <button
          onClick={() => onRewind(15)}
          className="group relative p-3 rounded-full liquid-glass-button text-white hover:text-[#1ed760] transition cursor-pointer active:scale-90 flex items-center justify-center shadow-lg"
          title="Rewind 15 seconds"
        >
          <RotateCcw className="w-6 h-6 stroke-[2.2]" />
          <span className="absolute text-[9px] font-black top-3 -left-0.5 group-hover:text-[#1ed760] scale-90">
            15
          </span>
        </button>

        {/* Main Play / Pause Liquid Glass Button */}
        <button
          onClick={onTogglePlay}
          className="p-4 rounded-full liquid-glass-primary text-black hover:scale-105 active:scale-95 transition cursor-pointer shadow-[0_10px_30px_rgba(29,185,84,0.5)]"
          title={isPlaying ? 'Pause' : 'Play'}
        >
          {isPlaying ? (
            <Pause className="w-7 h-7 fill-black stroke-black" />
          ) : (
            <Play className="w-7 h-7 fill-black stroke-black translate-x-0.5" />
          )}
        </button>

        {/* FAST-FORWARD 15 SECONDS BUTTON */}
        <button
          onClick={() => onForward(15)}
          className="group relative p-3 rounded-full liquid-glass-button text-white hover:text-[#1ed760] transition cursor-pointer active:scale-90 flex items-center justify-center shadow-lg"
          title="Fast-forward 15 seconds"
        >
          <RotateCw className="w-6 h-6 stroke-[2.2]" />
          <span className="absolute text-[9px] font-black top-3 -right-0.5 group-hover:text-[#1ed760] scale-90">
            15
          </span>
        </button>

        {/* Next Track */}
        <button
          onClick={onNext}
          className="p-2.5 rounded-full liquid-glass-button text-white hover:text-neutral-200 transition cursor-pointer active:scale-90"
          title="Next Track"
        >
          <SkipForward className="w-6 h-6 fill-white" />
        </button>

        {/* Repeat Button */}
        <button
          onClick={onCycleRepeat}
          className={`p-2.5 rounded-full liquid-glass-button transition cursor-pointer ${
            repeatMode !== 'off'
              ? 'text-[#1ed760] border-emerald-500/40'
              : 'text-neutral-400 hover:text-white'
          }`}
          title={`Repeat: ${repeatMode}`}
        >
          {repeatMode === 'one' ? (
            <Repeat1 className="w-4 h-4" />
          ) : (
            <Repeat className="w-4 h-4" />
          )}
        </button>
      </div>

      {/* Extra Controls & Audio Settings Row */}
      <div className="relative z-10 px-6 py-2 flex items-center justify-between border-t border-white/10">
        <button
          onClick={onOpenSettings}
          className="flex items-center gap-1.5 text-xs font-semibold text-emerald-300 hover:text-white transition cursor-pointer"
        >
          <Smartphone className="w-4 h-4 text-[#1ed760]" />
          <span>This Phone (320 kbps)</span>
        </button>

        <div className="flex items-center gap-2">
          {/* Playback speed selector */}
          <div className="relative">
            <button
              onClick={() => setShowSpeedMenu(!showSpeedMenu)}
              className="text-[11px] font-bold px-2.5 py-1 rounded-xl liquid-glass-button text-neutral-200 transition cursor-pointer"
              title="Playback speed"
            >
              {playbackSpeed}x
            </button>
            {showSpeedMenu && (
              <div className="absolute bottom-9 right-0 liquid-glass-dock rounded-2xl p-1.5 shadow-2xl flex flex-col gap-1 z-50">
                {[0.75, 1.0, 1.25, 1.5, 2.0].map((s) => (
                  <button
                    key={s}
                    onClick={() => {
                      onSetSpeed(s);
                      setShowSpeedMenu(false);
                    }}
                    className={`px-3 py-1 text-xs font-semibold rounded-lg text-left transition ${
                      playbackSpeed === s
                        ? 'bg-[#1ed760] text-black font-bold'
                        : 'text-white hover:bg-white/10'
                    }`}
                  >
                    {s}x
                  </button>
                ))}
              </div>
            )}
          </div>

          {/* Equalizer */}
          <button
            onClick={onOpenSettings}
            className="p-2 rounded-full liquid-glass-button text-neutral-300 hover:text-white transition cursor-pointer"
            title="Audio Equalizer & FX"
          >
            <Sliders className="w-4 h-4" />
          </button>

          {/* Lyrics Drawer Toggle */}
          <button
            onClick={onOpenLyrics}
            className="p-2 rounded-full liquid-glass-button text-neutral-300 hover:text-[#1ed760] transition cursor-pointer"
            title="Show Synchronized Lyrics"
          >
            <Mic2 className="w-4 h-4" />
          </button>

          {/* Queue Drawer Toggle */}
          <button
            onClick={onOpenQueue}
            className="p-2 rounded-full liquid-glass-button text-neutral-300 hover:text-white transition cursor-pointer"
            title="Up Next Queue"
          >
            <ListMusic className="w-4 h-4" />
          </button>
        </div>
      </div>

      {/* Mini Volume Slider */}
      <div className="relative z-10 px-6 pb-6 pt-1 flex items-center gap-2.5">
        <button
          onClick={() => onSetVolume(volume > 0 ? 0 : 0.8)}
          className="text-neutral-300 hover:text-white transition cursor-pointer"
        >
          {volume === 0 ? (
            <VolumeX className="w-4 h-4" />
          ) : (
            <Volume2 className="w-4 h-4" />
          )}
        </button>
        <input
          type="range"
          min="0"
          max="1"
          step="0.01"
          value={volume}
          onChange={(e) => onSetVolume(parseFloat(e.target.value))}
          className="w-full h-1 liquid-glass-surface rounded-lg appearance-none cursor-pointer accent-[#1ed760]"
          title="Volume"
        />
      </div>
    </div>
  );
};
