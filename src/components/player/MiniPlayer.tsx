import React from 'react';
import { Play, Pause, RotateCcw, Heart } from 'lucide-react';
import { Track } from '../../types/spotify';

interface MiniPlayerProps {
  track: Track | null;
  isPlaying: boolean;
  currentTime: number;
  duration: number;
  isLiked?: boolean;
  onTogglePlay: () => void;
  onRewind: (seconds?: number) => void;
  onToggleLike: (trackId: string) => void;
  onOpenFullPlayer: () => void;
}

export const MiniPlayer: React.FC<MiniPlayerProps> = ({
  track,
  isPlaying,
  currentTime,
  duration,
  isLiked = false,
  onTogglePlay,
  onRewind,
  onToggleLike,
  onOpenFullPlayer,
}) => {
  if (!track) return null;

  const progressPercent = duration > 0 ? (currentTime / duration) * 100 : 0;

  return (
    <div className="relative px-3 pb-1.5 z-20">
      <div
        onClick={onOpenFullPlayer}
        className="w-full liquid-glass-dock rounded-2xl p-2.5 flex items-center justify-between shadow-[0_12px_40px_rgba(0,0,0,0.6),inset_0_1px_1px_rgba(255,255,255,0.4)] cursor-pointer transition-all hover:scale-[1.01] active:scale-[0.99] select-none relative overflow-hidden"
      >
        {/* Top Progress Line with Liquid Glow */}
        <div className="absolute top-0 left-3 right-3 h-[2px] bg-white/10 rounded-full overflow-hidden">
          <div
            className="h-full bg-gradient-to-r from-[#1ed760] to-emerald-300 shadow-[0_0_8px_rgba(30,215,96,0.8)] transition-[width] duration-200"
            style={{ width: `${progressPercent}%` }}
          />
        </div>

        {/* Track Thumbnail & Titles */}
        <div className="flex items-center gap-2.5 min-w-0 flex-1 mr-2 mt-0.5">
          <div className="relative w-10 h-10 rounded-xl overflow-hidden flex-shrink-0 shadow-md border border-white/20">
            <img
              src={track.coverUrl}
              alt={track.title}
              className="w-full h-full object-cover"
            />
          </div>
          <div className="min-w-0 flex-1">
            <h4 className="text-xs font-bold text-white truncate leading-tight tracking-tight">
              {track.title}
            </h4>
            <p className="text-[11px] text-neutral-300 truncate mt-0.5">
              {track.artist}
            </p>
          </div>
        </div>

        {/* Glass Controls */}
        <div
          className="flex items-center gap-1.5 flex-shrink-0"
          onClick={(e) => e.stopPropagation()}
        >
          {/* Like Heart */}
          <button
            onClick={() => onToggleLike(track.id)}
            className={`p-2 rounded-full transition cursor-pointer ${
              isLiked ? 'text-[#1ed760]' : 'text-neutral-400 hover:text-white'
            }`}
            title={isLiked ? 'Liked' : 'Like'}
          >
            <Heart className={`w-4 h-4 ${isLiked ? 'fill-[#1ed760]' : ''}`} />
          </button>

          {/* Quick -15s Rewind Glass Button */}
          <button
            onClick={() => onRewind(15)}
            className="relative p-2 rounded-full liquid-glass-button text-neutral-200 hover:text-[#1ed760] transition cursor-pointer active:scale-90 flex items-center justify-center"
            title="Rewind 15 seconds"
          >
            <RotateCcw className="w-4 h-4 stroke-[2.2]" />
            <span className="absolute text-[8px] font-black top-2 -left-0.5 pointer-events-none scale-75">
              15
            </span>
          </button>

          {/* Play / Pause Liquid Glass Primary Button */}
          <button
            onClick={onTogglePlay}
            className="p-2.5 rounded-full liquid-glass-primary text-black hover:scale-105 active:scale-95 transition cursor-pointer shadow-lg ml-0.5"
            title={isPlaying ? 'Pause' : 'Play'}
          >
            {isPlaying ? (
              <Pause className="w-4 h-4 fill-black stroke-black" />
            ) : (
              <Play className="w-4 h-4 fill-black stroke-black translate-x-0.2" />
            )}
          </button>
        </div>
      </div>
    </div>
  );
};
