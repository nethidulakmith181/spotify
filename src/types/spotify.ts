export interface Track {
  id: string;
  title: string;
  artist: string;
  artistId?: string;
  album: string;
  coverUrl: string;
  audioUrl: string;
  duration: number; // in seconds
  lyrics?: LyricsLine[];
  accentColor?: string;
  genre?: string;
  year?: number;
  explicit?: boolean;
  spotifyUri?: string;
}

export interface LyricsLine {
  time: number; // in seconds
  text: string;
}

export interface Playlist {
  id: string;
  title: string;
  description: string;
  coverUrl: string;
  curator: string;
  tracks: Track[];
  isUserCreated?: boolean;
  accentColor?: string;
}

export interface SpotifyUserProfile {
  id: string;
  displayName: string;
  email?: string;
  avatarUrl?: string;
  product: 'premium' | 'free';
  followersCount: number;
  country?: string;
  isConnectedWithRealAccount: boolean;
}

export type RepeatMode = 'off' | 'all' | 'one';

export type EqualizerPreset = 'flat' | 'bass-boost' | 'vocal-booster' | 'treble-boost' | 'acoustic' | 'electronic' | 'rock';

export interface AudioSettings {
  quality: 'normal' | 'high' | 'ultra';
  equalizer: EqualizerPreset;
  playbackSpeed: number;
  wakeLockEnabled: boolean;
  normalizeVolume: boolean;
}
