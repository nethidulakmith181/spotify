import React, { useState } from 'react';
import { Plus, Heart, Search, Sparkles } from 'lucide-react';
import { Playlist, Track, SpotifyUserProfile } from '../../types/spotify';

interface LibraryViewProps {
  playlists: Playlist[];
  user: SpotifyUserProfile | null;
  likedTrackIds: Set<string>;
  allTracks: Track[];
  onSelectPlaylist: (playlist: Playlist) => void;
  onCreatePlaylist: (name: string) => void;
  onOpenAccountModal: () => void;
}

export const LibraryView: React.FC<LibraryViewProps> = ({
  playlists,
  user,
  likedTrackIds,
  allTracks,
  onSelectPlaylist,
  onCreatePlaylist,
  onOpenAccountModal,
}) => {
  const [activeChip, setActiveChip] = useState<'playlists' | 'liked' | 'downloaded'>('playlists');
  const [searchQuery, setSearchQuery] = useState('');
  const [isCreating, setIsCreating] = useState(false);
  const [newPlaylistName, setNewPlaylistName] = useState('');

  const likedTracks = allTracks.filter((t) => likedTrackIds.has(t.id));

  const handleCreate = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newPlaylistName.trim()) return;
    onCreatePlaylist(newPlaylistName.trim());
    setNewPlaylistName('');
    setIsCreating(false);
  };

  const filteredPlaylists = playlists.filter((p) =>
    p.title.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className="flex-1 overflow-y-auto px-4 py-4 space-y-4 select-none pb-28">
      {/* Top Title & Actions */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2.5">
          <img
            src={user?.avatarUrl || 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=100&auto=format&fit=crop&q=80'}
            alt="Profile"
            className="w-8 h-8 rounded-full object-cover ring-2 ring-white/20"
          />
          <h1 className="text-xl font-black text-white tracking-tight">Your Library</h1>
        </div>

        <button
          onClick={() => setIsCreating(true)}
          className="p-2 rounded-full liquid-glass-button text-white transition cursor-pointer"
          title="Create playlist"
        >
          <Plus className="w-4 h-4" />
        </button>
      </div>

      {/* Filter Chips with Liquid Glass */}
      <div className="flex items-center gap-2 overflow-x-auto no-scrollbar">
        {(['playlists', 'liked', 'downloaded'] as const).map((chip) => {
          const isActive = activeChip === chip;
          return (
            <button
              key={chip}
              onClick={() => setActiveChip(chip)}
              className={`px-3.5 py-1.5 rounded-full text-xs font-bold capitalize transition cursor-pointer ${
                isActive
                  ? 'liquid-glass-primary text-black font-extrabold shadow-md'
                  : 'liquid-glass-button text-neutral-300 hover:text-white'
              }`}
            >
              {chip === 'liked' ? 'Liked Songs' : chip}
            </button>
          );
        })}
      </div>

      {/* Search in library */}
      <div className="relative">
        <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-neutral-400" />
        <input
          type="text"
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          placeholder="Search in Your Library"
          className="w-full pl-10 pr-3 py-2 rounded-xl liquid-glass-surface text-xs text-white placeholder-neutral-400 focus:outline-none focus:border-[#1ed760] transition"
        />
      </div>

      {/* Create Playlist Modal / Form */}
      {isCreating && (
        <form
          onSubmit={handleCreate}
          className="p-4 rounded-2xl liquid-glass-surface space-y-3 animate-fadeIn"
        >
          <h4 className="text-xs font-bold text-white">Give your playlist a name</h4>
          <input
            type="text"
            value={newPlaylistName}
            onChange={(e) => setNewPlaylistName(e.target.value)}
            placeholder="My Favorite Hits"
            autoFocus
            className="w-full px-3 py-2 rounded-xl liquid-glass-surface text-xs text-white focus:outline-none focus:border-[#1ed760]"
          />
          <div className="flex justify-end gap-2 pt-1">
            <button
              type="button"
              onClick={() => setIsCreating(false)}
              className="px-3 py-1.5 text-xs text-neutral-300 hover:text-white"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="px-4 py-1.5 rounded-full liquid-glass-primary text-black text-xs font-bold"
            >
              Create
            </button>
          </div>
        </form>
      )}

      {/* Pinned Liked Songs Card with Liquid Glass */}
      {activeChip !== 'downloaded' && (
        <div
          onClick={() => {
            const likedPlaylist: Playlist = {
              id: 'liked-songs',
              title: 'Liked Songs',
              description: 'Your favorite tracks with instant rewind and zero ads.',
              coverUrl: 'https://images.unsplash.com/photo-1511671782779-c97d3d27a1d4?w=600&auto=format&fit=crop&q=80',
              curator: user?.displayName || 'You',
              accentColor: '#6366f1',
              tracks: likedTracks,
            };
            onSelectPlaylist(likedPlaylist);
          }}
          className="flex items-center gap-3.5 p-3 rounded-2xl liquid-glass-card border border-indigo-500/30 transition cursor-pointer"
        >
          <div className="w-13 h-13 rounded-xl bg-gradient-to-br from-indigo-500 via-purple-600 to-pink-500 flex items-center justify-center flex-shrink-0 shadow-lg border border-white/20">
            <Heart className="w-6 h-6 text-white fill-white" />
          </div>
          <div className="min-w-0 flex-1">
            <h4 className="text-xs font-bold text-white">Liked Songs</h4>
            <p className="text-[11px] text-neutral-300 mt-0.5">
              Playlist • {likedTracks.length} song{likedTracks.length === 1 ? '' : 's'}
            </p>
          </div>
        </div>
      )}

      {/* Spotify Sync Notice if not connected */}
      {!user?.isConnectedWithRealAccount && (
        <div
          onClick={onOpenAccountModal}
          className="p-3.5 rounded-2xl liquid-glass-surface border border-emerald-500/30 flex items-center justify-between cursor-pointer hover:border-emerald-500/50 transition"
        >
          <div className="flex items-center gap-2.5">
            <Sparkles className="w-4 h-4 text-[#1ed760]" />
            <span className="text-xs font-semibold text-emerald-300">
              Sync your Spotify account
            </span>
          </div>
          <span className="text-[11px] text-[#1ed760] font-bold">Connect →</span>
        </div>
      )}

      {/* Playlists List */}
      <div className="space-y-1.5">
        {filteredPlaylists.map((playlist) => (
          <div
            key={playlist.id}
            onClick={() => onSelectPlaylist(playlist)}
            className="flex items-center gap-3 p-2.5 rounded-2xl liquid-glass-card transition cursor-pointer"
          >
            <img
              src={playlist.coverUrl}
              alt={playlist.title}
              className="w-12 h-12 rounded-xl object-cover flex-shrink-0 border border-white/10"
            />
            <div className="min-w-0 flex-1">
              <h4 className="text-xs font-bold text-white truncate">
                {playlist.title}
              </h4>
              <p className="text-[11px] text-neutral-300 truncate mt-0.5">
                Playlist • {playlist.curator} • {playlist.tracks.length} tracks
              </p>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};
