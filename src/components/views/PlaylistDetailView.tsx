import React from 'react';
import { ArrowLeft, Play, Pause, Shuffle, Heart } from 'lucide-react';
import { Playlist, Track } from '../../types/spotify';

interface PlaylistDetailViewProps {
  playlist: Playlist;
  currentTrack: Track | null;
  isPlaying: boolean;
  likedTrackIds: Set<string>;
  onBack: () => void;
  onPlayTrack: (track: Track, queue?: Track[]) => void;
  onTogglePlay: () => void;
  onToggleLike: (trackId: string) => void;
}

export const PlaylistDetailView: React.FC<PlaylistDetailViewProps> = ({
  playlist,
  currentTrack,
  isPlaying,
  likedTrackIds,
  onBack,
  onPlayTrack,
  onTogglePlay,
  onToggleLike,
}) => {
  const isPlayingThisPlaylist =
    isPlaying && playlist.tracks.some((t) => t.id === currentTrack?.id);

  const handlePlayFirst = () => {
    if (isPlayingThisPlaylist) {
      onTogglePlay();
    } else if (playlist.tracks.length > 0) {
      onPlayTrack(playlist.tracks[0], playlist.tracks);
    }
  };

  const formatDuration = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = Math.floor(seconds % 60);
    return `${mins}:${secs < 10 ? '0' : ''}${secs}`;
  };

  const accentColor = playlist.accentColor || '#1DB954';

  return (
    <div className="flex-1 overflow-y-auto select-none pb-28">
      {/* Dynamic Header Gradient with Liquid Glass Blur */}
      <div
        className="px-4 pt-4 pb-6 transition-all relative overflow-hidden backdrop-blur-2xl"
        style={{
          background: `radial-gradient(circle at 50% 10%, ${accentColor}88 0%, rgba(15,16,22,0.85) 70%, transparent 100%)`,
        }}
      >
        <button
          onClick={onBack}
          className="p-2 -ml-2 rounded-full liquid-glass-button text-white transition cursor-pointer mb-3"
          title="Go back"
        >
          <ArrowLeft className="w-5 h-5" />
        </button>

        {/* Playlist Art & Title */}
        <div className="flex flex-col items-center text-center gap-3">
          <div className="relative w-44 h-44 rounded-2xl overflow-hidden shadow-[0_20px_45px_rgba(0,0,0,0.7)] border border-white/20">
            <img
              src={playlist.coverUrl}
              alt={playlist.title}
              className="w-full h-full object-cover"
            />
          </div>

          <div>
            <h1 className="text-xl font-black text-white leading-tight">
              {playlist.title}
            </h1>
            <p className="text-xs text-neutral-200 mt-1 max-w-xs line-clamp-2">
              {playlist.description}
            </p>
            <div className="flex items-center justify-center gap-1.5 text-[11px] text-neutral-300 mt-2 font-medium">
              <span className="font-bold text-white">{playlist.curator}</span>
              <span>•</span>
              <span>{playlist.tracks.length} songs</span>
              <span>•</span>
              <span className="text-[#1ed760] font-bold">Zero Ads</span>
            </div>
          </div>
        </div>

        {/* Action Controls Row */}
        <div className="flex items-center justify-between pt-4 px-2">
          <button
            onClick={() => {
              if (playlist.tracks.length > 0) {
                const shuffled = [...playlist.tracks].sort(() => Math.random() - 0.5);
                onPlayTrack(shuffled[0], shuffled);
              }
            }}
            className="p-2.5 rounded-full liquid-glass-button text-neutral-300 hover:text-white transition cursor-pointer"
            title="Shuffle play"
          >
            <Shuffle className="w-4 h-4" />
          </button>

          {/* Big Green Liquid Glass Play Button */}
          <button
            onClick={handlePlayFirst}
            className="p-4 rounded-full liquid-glass-primary text-black shadow-xl hover:scale-105 active:scale-95 transition cursor-pointer"
            title={isPlayingThisPlaylist ? 'Pause' : 'Play playlist'}
          >
            {isPlayingThisPlaylist ? (
              <Pause className="w-6 h-6 fill-black stroke-black" />
            ) : (
              <Play className="w-6 h-6 fill-black stroke-black translate-x-0.5" />
            )}
          </button>
        </div>
      </div>

      {/* Tracks List */}
      <div className="px-4 space-y-1.5 pt-2">
        {playlist.tracks.map((track, index) => {
          const isThisCurrent = track.id === currentTrack?.id;
          const isLiked = likedTrackIds.has(track.id);

          return (
            <div
              key={track.id}
              onClick={() => onPlayTrack(track, playlist.tracks)}
              className={`flex items-center gap-3 p-2.5 rounded-2xl transition cursor-pointer liquid-glass-card ${
                isThisCurrent ? 'border-emerald-500/40' : ''
              }`}
            >
              {/* Index or Live Equalizer Animation */}
              <div className="w-6 text-center text-xs font-semibold text-neutral-400 flex-shrink-0">
                {isThisCurrent && isPlaying ? (
                  <div className="flex items-end justify-center gap-0.5 h-3.5">
                    <span className="w-1 bg-[#1ed760] animate-[bounce_0.6s_ease-in-out_infinite] h-3 rounded-full" />
                    <span className="w-1 bg-[#1ed760] animate-[bounce_0.8s_ease-in-out_infinite_0.2s] h-2 rounded-full" />
                    <span className="w-1 bg-[#1ed760] animate-[bounce_0.5s_ease-in-out_infinite_0.4s] h-3.5 rounded-full" />
                  </div>
                ) : (
                  <span>{index + 1}</span>
                )}
              </div>

              {/* Cover thumbnail */}
              <img
                src={track.coverUrl}
                alt={track.title}
                className="w-10 h-10 rounded-xl object-cover flex-shrink-0 border border-white/10"
              />

              {/* Title & Artist */}
              <div className="min-w-0 flex-1">
                <h4
                  className={`text-xs font-bold truncate ${
                    isThisCurrent ? 'text-[#1ed760]' : 'text-white'
                  }`}
                >
                  {track.title}
                </h4>
                <p className="text-[11px] text-neutral-300 truncate mt-0.5">
                  {track.artist}
                </p>
              </div>

              {/* Heart & Duration */}
              <div
                className="flex items-center gap-2 flex-shrink-0"
                onClick={(e) => e.stopPropagation()}
              >
                <button
                  onClick={() => onToggleLike(track.id)}
                  className={`p-1.5 transition ${
                    isLiked ? 'text-[#1ed760]' : 'text-neutral-400 hover:text-white'
                  }`}
                >
                  <Heart className={`w-4 h-4 ${isLiked ? 'fill-[#1ed760]' : ''}`} />
                </button>
                <span className="text-[11px] font-medium text-neutral-300 w-8 text-right">
                  {formatDuration(track.duration)}
                </span>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};
