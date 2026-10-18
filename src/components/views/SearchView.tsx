import React, { useState } from 'react';
import { Search as SearchIcon, X, Play, Music, Sparkles } from 'lucide-react';
import { Track, SpotifyUserProfile } from '../../types/spotify';
import { BROWSE_CATEGORIES } from '../../data/musicData';
import { SpotifyAuth } from '../../services/spotifyAuth';

interface SearchViewProps {
  allTracks: Track[];
  user: SpotifyUserProfile | null;
  onPlayTrack: (track: Track, queue?: Track[]) => void;
}

export const SearchView: React.FC<SearchViewProps> = ({
  allTracks,
  user,
  onPlayTrack,
}) => {
  const [query, setQuery] = useState('');
  const [selectedGenre, setSelectedGenre] = useState<string | null>(null);
  const [spotifyResults, setSpotifyResults] = useState<Track[]>([]);
  const [isSearchingSpotify, setIsSearchingSpotify] = useState(false);

  // Filter local catalog
  const filteredLocalTracks = allTracks.filter((track) => {
    if (selectedGenre) {
      return (
        track.genre?.toLowerCase().includes(selectedGenre.toLowerCase()) ||
        track.album.toLowerCase().includes(selectedGenre.toLowerCase())
      );
    }
    if (!query.trim()) return false;
    const q = query.toLowerCase();
    return (
      track.title.toLowerCase().includes(q) ||
      track.artist.toLowerCase().includes(q) ||
      track.album.toLowerCase().includes(q)
    );
  });

  const handleSearchChange = async (val: string) => {
    setQuery(val);
    setSelectedGenre(null);

    const token = SpotifyAuth.getAccessToken();
    if (token && val.trim().length > 2) {
      setIsSearchingSpotify(true);
      try {
        const results = await SpotifyAuth.searchSpotify(token, val);
        setSpotifyResults(results);
      } catch (err) {
        console.warn('Spotify live search failed:', err);
      } finally {
        setIsSearchingSpotify(false);
      }
    } else {
      setSpotifyResults([]);
    }
  };

  const clearSearch = () => {
    setQuery('');
    setSelectedGenre(null);
    setSpotifyResults([]);
  };

  const displayedTracks = query.trim() || selectedGenre ? filteredLocalTracks : [];

  return (
    <div className="flex-1 overflow-y-auto px-4 py-4 space-y-5 select-none pb-28">
      {/* Header */}
      <h1 className="text-2xl font-black text-white tracking-tight">Search</h1>

      {/* Liquid Glass Search Input Bar */}
      <div className="relative">
        <SearchIcon className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-neutral-300" />
        <input
          type="text"
          value={query}
          onChange={(e) => handleSearchChange(e.target.value)}
          placeholder="What do you want to listen to?"
          className="w-full pl-11 pr-10 py-3 rounded-2xl liquid-glass-surface text-xs font-semibold text-white placeholder-neutral-400 focus:outline-none focus:border-[#1ed760] transition shadow-md"
        />
        {query && (
          <button
            onClick={clearSearch}
            className="absolute right-3.5 top-1/2 -translate-y-1/2 p-1 text-neutral-400 hover:text-white"
          >
            <X className="w-4 h-4" />
          </button>
        )}
      </div>

      {/* Selected Genre Banner */}
      {selectedGenre && (
        <div className="flex items-center justify-between p-3 rounded-2xl liquid-glass-surface border border-emerald-500/30">
          <div className="flex items-center gap-2">
            <Music className="w-4 h-4 text-[#1ed760]" />
            <span className="text-xs font-bold text-white">
              Browsing: {selectedGenre}
            </span>
          </div>
          <button
            onClick={clearSearch}
            className="text-xs text-neutral-300 hover:text-white"
          >
            Clear filter
          </button>
        </div>
      )}

      {/* Search Results */}
      {(query.trim() || selectedGenre) ? (
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <h2 className="text-sm font-bold text-neutral-200">
              {displayedTracks.length} Matching Song{displayedTracks.length === 1 ? '' : 's'}
            </h2>
            <span className="text-[11px] text-emerald-300 font-semibold">
              Ad-Free • Full Scrubbing
            </span>
          </div>

          {displayedTracks.length === 0 && spotifyResults.length === 0 ? (
            <div className="py-12 text-center text-neutral-400 text-xs">
              No songs found matching "{query || selectedGenre}". Try searching another title or artist!
            </div>
          ) : (
            <div className="space-y-2">
              {displayedTracks.map((track) => (
                <div
                  key={track.id}
                  onClick={() => onPlayTrack(track, displayedTracks)}
                  className="flex items-center justify-between p-2.5 rounded-2xl liquid-glass-card transition cursor-pointer shadow-sm"
                >
                  <div className="flex items-center gap-3 min-w-0 flex-1 mr-2">
                    <img
                      src={track.coverUrl}
                      alt={track.title}
                      className="w-11 h-11 rounded-xl object-cover flex-shrink-0 border border-white/10"
                    />
                    <div className="min-w-0 flex-1">
                      <h4 className="text-xs font-bold text-white truncate">
                        {track.title}
                      </h4>
                      <p className="text-[11px] text-neutral-300 truncate mt-0.5">
                        {track.artist}
                      </p>
                    </div>
                  </div>

                  <button className="p-2.5 rounded-full liquid-glass-primary text-black transition flex-shrink-0 shadow-md">
                    <Play className="w-3.5 h-3.5 fill-black stroke-black translate-x-0.2" />
                  </button>
                </div>
              ))}

              {/* Direct Spotify Results */}
              {spotifyResults.length > 0 && (
                <div className="pt-4 space-y-2">
                  <div className="flex items-center gap-1.5 text-xs font-bold text-[#1ed760]">
                    <Sparkles className="w-3.5 h-3.5" />
                    <span>Direct Spotify Catalog Results</span>
                  </div>
                  {spotifyResults.map((track) => (
                    <div
                      key={track.id}
                      onClick={() => onPlayTrack(track, spotifyResults)}
                      className="flex items-center justify-between p-2.5 rounded-2xl liquid-glass-card transition cursor-pointer shadow-sm"
                    >
                      <div className="flex items-center gap-3 min-w-0 flex-1 mr-2">
                        <img
                          src={track.coverUrl}
                          alt={track.title}
                          className="w-11 h-11 rounded-xl object-cover flex-shrink-0 border border-white/10"
                        />
                        <div className="min-w-0 flex-1">
                          <h4 className="text-xs font-bold text-white truncate">
                            {track.title}
                          </h4>
                          <p className="text-[11px] text-neutral-300 truncate mt-0.5">
                            {track.artist}
                          </p>
                        </div>
                      </div>
                      <span className="text-[10px] text-neutral-300 px-2.5 py-0.5 rounded-full liquid-glass-surface mr-2">
                        Spotify Web
                      </span>
                      <button className="p-2.5 rounded-full liquid-glass-primary text-black transition shadow-md">
                        <Play className="w-3.5 h-3.5 fill-black stroke-black" />
                      </button>
                    </div>
                  ))}
                </div>
              )}
            </div>
          )}
        </div>
      ) : (
        /* Browse All Category Tiles with Glass Tint */
        <div className="space-y-3">
          <h2 className="text-base font-bold text-white tracking-tight">
            Browse all
          </h2>
          <div className="grid grid-cols-2 gap-3">
            {BROWSE_CATEGORIES.map((cat) => (
              <div
                key={cat.id}
                onClick={() => setSelectedGenre(cat.title)}
                className={`relative h-24 rounded-2xl p-3.5 bg-gradient-to-br ${cat.color} overflow-hidden cursor-pointer shadow-lg hover:scale-[1.02] active:scale-95 transition border border-white/20`}
              >
                <div className="absolute inset-0 bg-white/[0.08] pointer-events-none" />
                <h3 className="relative z-10 text-sm font-black text-white max-w-[65%] drop-shadow">
                  {cat.title}
                </h3>
                <img
                  src={cat.img}
                  alt={cat.title}
                  className="absolute -right-2 -bottom-2 w-16 h-16 object-cover rounded-xl rotate-[25deg] shadow-2xl border border-white/30"
                />
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};
