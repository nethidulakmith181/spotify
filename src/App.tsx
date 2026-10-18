/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect } from 'react';
import { PhoneContainer } from './components/PhoneContainer';
import { SpotifyHeader } from './components/SpotifyHeader';
import { BottomNav, NavTab } from './components/navigation/BottomNav';
import { HomeView } from './components/views/HomeView';
import { SearchView } from './components/views/SearchView';
import { LibraryView } from './components/views/LibraryView';
import { PlaylistDetailView } from './components/views/PlaylistDetailView';
import { PremiumView } from './components/views/PremiumView';
import { MiniPlayer } from './components/player/MiniPlayer';
import { FullPlayerModal } from './components/player/FullPlayerModal';
import { LyricsSheet } from './components/player/LyricsSheet';
import { QueueSheet } from './components/player/QueueSheet';
import { SpotifyAccountModal } from './components/modals/SpotifyAccountModal';
import { SettingsModal } from './components/modals/SettingsModal';
import { LockScreenSimulatorModal } from './components/modals/LockScreenSimulatorModal';
import { DownloadApkModal } from './components/modals/DownloadApkModal';
import { useAudioPlayer } from './hooks/useAudioPlayer';
import { INITIAL_PLAYLISTS, INITIAL_TRACKS } from './data/musicData';
import { Playlist, Track, SpotifyUserProfile } from './types/spotify';
import { SpotifyAuth } from './services/spotifyAuth';

export default function App() {
  const [activeTab, setActiveTab] = useState<NavTab>('home');
  const [activeFilter, setActiveFilter] = useState<'all' | 'music' | 'podcasts'>('all');
  const [selectedPlaylist, setSelectedPlaylist] = useState<Playlist | null>(null);

  // Modals state
  const [isFullPlayerOpen, setIsFullPlayerOpen] = useState(false);
  const [isLyricsOpen, setIsLyricsOpen] = useState(false);
  const [isQueueOpen, setIsQueueOpen] = useState(false);
  const [isAccountModalOpen, setIsAccountModalOpen] = useState(false);
  const [isSettingsModalOpen, setIsSettingsModalOpen] = useState(false);
  const [isLockscreenModalOpen, setIsLockscreenModalOpen] = useState(false);
  const [isApkModalOpen, setIsApkModalOpen] = useState(false);

  // User and playlists state
  const [user, setUser] = useState<SpotifyUserProfile | null>(SpotifyAuth.getUserProfile());
  const [playlists, setPlaylists] = useState<Playlist[]>(INITIAL_PLAYLISTS);
  const [likedTrackIds, setLikedTrackIds] = useState<Set<string>>(() => {
    try {
      const saved = localStorage.getItem('spotify_liked_tracks');
      return saved ? new Set(JSON.parse(saved)) : new Set(['track-1', 'track-3']);
    } catch {
      return new Set(['track-1', 'track-3']);
    }
  });

  // Audio Engine Hook
  const {
    track,
    isPlaying,
    currentTime,
    duration,
    queue,
    repeatMode,
    isShuffled,
    volume,
    playbackSpeed,
    playTrack,
    togglePlay,
    rewind,
    forward,
    seek,
    next,
    previous,
    toggleShuffle,
    cycleRepeatMode,
    setVolume,
    setPlaybackSpeed,
  } = useAudioPlayer();

  // If no track is queued initially, select the first hit track
  useEffect(() => {
    if (!track && INITIAL_TRACKS.length > 0) {
      // Set initial track in engine without autoplaying until user interacts
      audioEngineInit();
    }
  }, []);

  const audioEngineInit = async () => {
    // If not set, prepare track 1
    if (!track) {
      playTrack(INITIAL_TRACKS[0], INITIAL_TRACKS);
    }
  };

  // If real Spotify account is connected, fetch user playlists
  useEffect(() => {
    const token = SpotifyAuth.getAccessToken();
    if (token && user?.isConnectedWithRealAccount) {
      SpotifyAuth.fetchUserPlaylists(token).then((userPlaylists) => {
        if (userPlaylists.length > 0) {
          setPlaylists((prev) => {
            const existingIds = new Set(prev.map((p) => p.id));
            const newOnes = userPlaylists.filter((p) => !existingIds.has(p.id));
            return [...prev, ...newOnes];
          });
        }
      });
    }
  }, [user]);

  // Handle Like/Unlike
  const handleToggleLike = (trackId: string) => {
    setLikedTrackIds((prev) => {
      const nextSet = new Set(prev);
      if (nextSet.has(trackId)) {
        nextSet.delete(trackId);
      } else {
        nextSet.add(trackId);
      }
      localStorage.setItem('spotify_liked_tracks', JSON.stringify(Array.from(nextSet)));
      return nextSet;
    });
  };

  // Create Custom Playlist
  const handleCreatePlaylist = (name: string) => {
    const newP: Playlist = {
      id: `custom-${Date.now()}`,
      title: name,
      description: `Created by ${user?.displayName || 'You'}`,
      coverUrl: 'https://images.unsplash.com/photo-1518709268805-4e9042af9f23?w=600&auto=format&fit=crop&q=80',
      curator: user?.displayName || 'You',
      accentColor: '#10b981',
      tracks: [INITIAL_TRACKS[0], INITIAL_TRACKS[2]],
      isUserCreated: true,
    };
    setPlaylists([newP, ...playlists]);
    setSelectedPlaylist(newP);
  };

  // Current track like status
  const isCurrentTrackLiked = track ? likedTrackIds.has(track.id) : false;

  return (
    <PhoneContainer accentColor={track?.accentColor || '#1DB954'}>
      {/* Top Spotify Header */}
      <SpotifyHeader
        user={user}
        activeFilter={activeFilter}
        onFilterChange={setActiveFilter}
        onOpenAccountModal={() => setIsAccountModalOpen(true)}
        onOpenSettingsModal={() => setIsSettingsModalOpen(true)}
        onOpenApkModal={() => setIsApkModalOpen(true)}
      />

      {/* Main Content Router */}
      <div className="flex-1 flex flex-col overflow-hidden relative">
        {selectedPlaylist ? (
          <PlaylistDetailView
            playlist={selectedPlaylist}
            currentTrack={track}
            isPlaying={isPlaying}
            likedTrackIds={likedTrackIds}
            onBack={() => setSelectedPlaylist(null)}
            onPlayTrack={(t, q) => playTrack(t, q || selectedPlaylist.tracks)}
            onTogglePlay={togglePlay}
            onToggleLike={handleToggleLike}
          />
        ) : activeTab === 'home' ? (
          <HomeView
            user={user}
            playlists={playlists}
            currentTrack={track}
            isPlaying={isPlaying}
            onPlayTrack={(t, q) => playTrack(t, q)}
            onSelectPlaylist={(p) => setSelectedPlaylist(p)}
            onOpenAccountModal={() => setIsAccountModalOpen(true)}
          />
        ) : activeTab === 'search' ? (
          <SearchView
            allTracks={INITIAL_TRACKS}
            user={user}
            onPlayTrack={(t, q) => playTrack(t, q)}
          />
        ) : activeTab === 'library' ? (
          <LibraryView
            playlists={playlists}
            user={user}
            likedTrackIds={likedTrackIds}
            allTracks={INITIAL_TRACKS}
            onSelectPlaylist={(p) => setSelectedPlaylist(p)}
            onCreatePlaylist={handleCreatePlaylist}
            onOpenAccountModal={() => setIsAccountModalOpen(true)}
          />
        ) : (
          <PremiumView
            user={user}
            onOpenAccountModal={() => setIsAccountModalOpen(true)}
            onOpenLockscreenSimulator={() => setIsLockscreenModalOpen(true)}
            onOpenApkModal={() => setIsApkModalOpen(true)}
          />
        )}
      </div>

      {/* Docked Bottom Mini Player */}
      <MiniPlayer
        track={track}
        isPlaying={isPlaying}
        currentTime={currentTime}
        duration={duration}
        isLiked={isCurrentTrackLiked}
        onTogglePlay={togglePlay}
        onRewind={() => rewind(15)}
        onToggleLike={handleToggleLike}
        onOpenFullPlayer={() => setIsFullPlayerOpen(true)}
      />

      {/* Spotify Bottom Navigation Bar */}
      <BottomNav
        activeTab={activeTab}
        onTabChange={(tab) => {
          setSelectedPlaylist(null);
          setActiveTab(tab);
        }}
      />

      {/* Full-Screen Immersive Player Modal */}
      <FullPlayerModal
        isOpen={isFullPlayerOpen}
        track={track}
        isPlaying={isPlaying}
        currentTime={currentTime}
        duration={duration}
        isLiked={isCurrentTrackLiked}
        repeatMode={repeatMode}
        isShuffled={isShuffled}
        volume={volume}
        playbackSpeed={playbackSpeed}
        onClose={() => setIsFullPlayerOpen(false)}
        onTogglePlay={togglePlay}
        onRewind={(secs) => rewind(secs || 15)}
        onForward={(secs) => forward(secs || 15)}
        onSeek={(secs) => seek(secs)}
        onNext={next}
        onPrevious={previous}
        onToggleShuffle={toggleShuffle}
        onCycleRepeat={cycleRepeatMode}
        onToggleLike={handleToggleLike}
        onSetVolume={setVolume}
        onSetSpeed={setPlaybackSpeed}
        onOpenLyrics={() => setIsLyricsOpen(true)}
        onOpenQueue={() => setIsQueueOpen(true)}
        onOpenSettings={() => setIsSettingsModalOpen(true)}
      />

      {/* Real-time Synced Lyrics Sheet */}
      <LyricsSheet
        isOpen={isLyricsOpen}
        track={track}
        currentTime={currentTime}
        onClose={() => setIsLyricsOpen(false)}
        onSeek={(secs) => seek(secs)}
      />

      {/* Play Queue Sheet */}
      <QueueSheet
        isOpen={isQueueOpen}
        currentTrack={track}
        queue={queue}
        onClose={() => setIsQueueOpen(false)}
        onPlayTrack={(t) => playTrack(t)}
      />

      {/* Spotify Account Connect Modal */}
      <SpotifyAccountModal
        isOpen={isAccountModalOpen}
        user={user}
        onClose={() => setIsAccountModalOpen(false)}
        onUserUpdate={(u) => setUser(u)}
      />

      {/* Settings & Equalizer Modal */}
      <SettingsModal
        isOpen={isSettingsModalOpen}
        onClose={() => setIsSettingsModalOpen(false)}
        onOpenLockscreenSimulator={() => setIsLockscreenModalOpen(true)}
        onOpenApkModal={() => setIsApkModalOpen(true)}
      />

      {/* Lockscreen Simulator Modal */}
      <LockScreenSimulatorModal
        isOpen={isLockscreenModalOpen}
        track={track}
        isPlaying={isPlaying}
        currentTime={currentTime}
        duration={duration}
        onClose={() => setIsLockscreenModalOpen(false)}
        onTogglePlay={togglePlay}
        onRewind={(secs) => rewind(secs || 15)}
        onForward={(secs) => forward(secs || 15)}
        onSeek={(secs) => seek(secs)}
        onNext={next}
        onPrevious={previous}
      />

      {/* Android Download APK Modal */}
      <DownloadApkModal
        isOpen={isApkModalOpen}
        onClose={() => setIsApkModalOpen(false)}
      />
    </PhoneContainer>
  );
}
