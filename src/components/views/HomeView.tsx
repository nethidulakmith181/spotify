import React from 'react';
import { Play, Sparkles } from 'lucide-react';
import { Track, Playlist, SpotifyUserProfile } from '../../types/spotify';

interface HomeViewProps {
  user: SpotifyUserProfile | null;
  playlists: Playlist[];
  currentTrack: Track | null;
  isPlaying: boolean;
  onPlayTrack: (track: Track, queue?: Track[]) => void;
  onSelectPlaylist: (playlist: Playlist) => void;
  onOpenAccountModal: () => void;
}

export const HomeView: React.FC<HomeViewProps> = ({
  user,
  playlists,
  currentTrack,
  isPlaying,
  onPlayTrack,
  onSelectPlaylist,
  onOpenAccountModal,
}) => {
  const getGreeting = () => {
    const hours = new Date().getHours();
    if (hours < 12) return 'Good morning';
    if (hours < 18) return 'Good afternoon';
    return 'Good evening';
  };

  const topHits = playlists.find((p) => p.id === 'playlist-top-hits')?.tracks || [];
  const discoverTracks = playlists.find((p) => p.id === 'playlist-discover')?.tracks || [];
  const lofiTracks = playlists.find((p) => p.id === 'playlist-chill-lofi')?.tracks || [];

  return (
    <div className="flex-1 overflow-y-auto px-4 py-4 space-y-6 select-none pb-28">
      {/* Dynamic Greeting */}
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-black text-white tracking-tight">
          {getGreeting()}
        </h1>
        <button
          onClick={onOpenAccountModal}
          className="flex items-center gap-1.5 px-3.5 py-1.5 rounded-full liquid-glass-button text-xs font-semibold text-emerald-300 transition cursor-pointer"
        >
          <Sparkles className="w-3.5 h-3.5 text-[#1ed760]" />
          <span>{user?.isConnectedWithRealAccount ? 'Spotify Synced' : 'Sync Account'}</span>
        </button>
      </div>

      {/* 6 Quick-Access Liquid Glass Tiles */}
      <div className="grid grid-cols-2 gap-2.5">
        {playlists.slice(0, 6).map((playlist) => {
          return (
            <div
              key={playlist.id}
              onClick={() => onSelectPlaylist(playlist)}
              className="group relative flex items-center liquid-glass-card rounded-xl overflow-hidden transition-all duration-200 cursor-pointer shadow-md"
            >
              <img
                src={playlist.coverUrl}
                alt={playlist.title}
                className="w-13 h-13 object-cover flex-shrink-0"
              />
              <span className="px-2.5 text-xs font-bold text-white line-clamp-2 leading-tight flex-1">
                {playlist.title}
              </span>

              {/* Quick Play Button */}
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  if (playlist.tracks.length > 0) {
                    onPlayTrack(playlist.tracks[0], playlist.tracks);
                  }
                }}
                className="mr-2.5 p-2.5 rounded-full liquid-glass-primary text-black shadow-lg opacity-0 group-hover:opacity-100 transition-all hover:scale-110 active:scale-95 flex-shrink-0"
                title="Play playlist"
              >
                <Play className="w-3.5 h-3.5 fill-black stroke-black translate-x-0.2" />
              </button>
            </div>
          );
        })}
      </div>

      {/* Today's Top Hits Carousel */}
      <div className="space-y-3">
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-base font-bold text-white tracking-tight">
              Today's Top Hits
            </h2>
            <p className="text-xs text-neutral-300">
              Zero ads • Unrestricted music rewind
            </p>
          </div>
          <button
            onClick={() => {
              const p = playlists.find((x) => x.id === 'playlist-top-hits');
              if (p) onSelectPlaylist(p);
            }}
            className="text-xs font-bold text-neutral-300 hover:text-white transition cursor-pointer"
          >
            Show all
          </button>
        </div>

        <div className="flex gap-3 overflow-x-auto no-scrollbar pb-2 pt-1 -mx-4 px-4">
          {topHits.map((track) => {
            const isPlayingThis = track.id === currentTrack?.id && isPlaying;
            return (
              <div
                key={track.id}
                onClick={() => onPlayTrack(track, topHits)}
                className="group flex-shrink-0 w-36 liquid-glass-card p-2.5 rounded-2xl transition cursor-pointer shadow-md"
              >
                <div className="relative aspect-square rounded-xl overflow-hidden mb-2 border border-white/10">
                  <img
                    src={track.coverUrl}
                    alt={track.title}
                    className="w-full h-full object-cover group-hover:scale-105 transition duration-300"
                  />
                  <button
                    className={`absolute bottom-2 right-2 p-2.5 rounded-full liquid-glass-primary text-black shadow-lg transition duration-200 hover:scale-110 active:scale-95 ${
                      isPlayingThis ? 'opacity-100 scale-100' : 'opacity-0 group-hover:opacity-100'
                    }`}
                  >
                    <Play className="w-3.5 h-3.5 fill-black stroke-black translate-x-0.2" />
                  </button>
                </div>
                <h3 className="text-xs font-bold text-white truncate leading-tight">
                  {track.title}
                </h3>
                <p className="text-[11px] text-neutral-300 truncate mt-0.5">
                  {track.artist}
                </p>
              </div>
            );
          })}
        </div>
      </div>

      {/* Made For You / Chill Vibes Carousel */}
      <div className="space-y-3">
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-base font-bold text-white tracking-tight">
              Made For You
            </h2>
            <p className="text-xs text-neutral-300">
              Personalized selections with background playback
            </p>
          </div>
        </div>

        <div className="flex gap-3 overflow-x-auto no-scrollbar pb-2 pt-1 -mx-4 px-4">
          {discoverTracks.map((track) => (
            <div
              key={track.id}
              onClick={() => onPlayTrack(track, discoverTracks)}
              className="group flex-shrink-0 w-36 liquid-glass-card p-2.5 rounded-2xl transition cursor-pointer shadow-md"
            >
              <div className="relative aspect-square rounded-xl overflow-hidden mb-2 border border-white/10">
                <img
                  src={track.coverUrl}
                  alt={track.title}
                  className="w-full h-full object-cover group-hover:scale-105 transition duration-300"
                />
                <button className="absolute bottom-2 right-2 p-2.5 rounded-full liquid-glass-primary text-black shadow-lg opacity-0 group-hover:opacity-100 transition duration-200 hover:scale-110 active:scale-95">
                  <Play className="w-3.5 h-3.5 fill-black stroke-black translate-x-0.2" />
                </button>
              </div>
              <h3 className="text-xs font-bold text-white truncate leading-tight">
                {track.title}
              </h3>
              <p className="text-[11px] text-neutral-300 truncate mt-0.5">
                {track.artist}
              </p>
            </div>
          ))}
        </div>
      </div>

      {/* Focus & Study Lo-Fi Section */}
      <div className="space-y-3">
        <div className="flex items-center justify-between">
          <h2 className="text-base font-bold text-white tracking-tight">
            Cozy Lo-Fi & Focus
          </h2>
        </div>

        <div className="flex gap-3 overflow-x-auto no-scrollbar pb-2 pt-1 -mx-4 px-4">
          {lofiTracks.map((track) => (
            <div
              key={track.id}
              onClick={() => onPlayTrack(track, lofiTracks)}
              className="group flex-shrink-0 w-36 liquid-glass-card p-2.5 rounded-2xl transition cursor-pointer shadow-md"
            >
              <div className="relative aspect-square rounded-xl overflow-hidden mb-2 border border-white/10">
                <img
                  src={track.coverUrl}
                  alt={track.title}
                  className="w-full h-full object-cover group-hover:scale-105 transition duration-300"
                />
              </div>
              <h3 className="text-xs font-bold text-white truncate leading-tight">
                {track.title}
              </h3>
              <p className="text-[11px] text-neutral-300 truncate mt-0.5">
                {track.artist}
              </p>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};
