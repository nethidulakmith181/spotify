import { SpotifyUserProfile, Track, Playlist } from '../types/spotify';

const TOKEN_KEY = 'spotify_access_token';
const REFRESH_KEY = 'spotify_refresh_token';
const EXPIRY_KEY = 'spotify_token_expires_at';
const USER_KEY = 'spotify_user_profile';
const VERIFIER_KEY = 'spotify_pkce_verifier';
const CLIENT_ID_KEY = 'spotify_custom_client_id';

// Helper for PKCE
function dec2hex(dec: number) {
  return ('0' + dec.toString(16)).substr(-2);
}

export function generateRandomString(length: number = 64) {
  const array = new Uint32Array(length / 2);
  window.crypto.getRandomValues(array);
  return Array.from(array, dec2hex).join('');
}

export async function sha256(plain: string) {
  const encoder = new TextEncoder();
  const data = encoder.encode(plain);
  return window.crypto.subtle.digest('SHA-256', data);
}

export function base64urlencode(a: ArrayBuffer) {
  let str = '';
  const bytes = new Uint8Array(a);
  const len = bytes.byteLength;
  for (let i = 0; i < len; i++) {
    str += String.fromCharCode(bytes[i]);
  }
  return btoa(str)
    .replace(/\+/g, '-')
    .replace(/\//g, '_')
    .replace(/=+$/, '');
}

export const SpotifyAuth = {
  getSavedClientId(): string {
    return localStorage.getItem(CLIENT_ID_KEY) || '';
  },

  setSavedClientId(clientId: string) {
    if (clientId) {
      localStorage.setItem(CLIENT_ID_KEY, clientId);
    } else {
      localStorage.removeItem(CLIENT_ID_KEY);
    }
  },

  getAccessToken(): string | null {
    const expiry = localStorage.getItem(EXPIRY_KEY);
    if (expiry && Date.now() > parseInt(expiry, 10)) {
      // Token expired
      return null;
    }
    return localStorage.getItem(TOKEN_KEY);
  },

  getRefreshToken(): string | null {
    return localStorage.getItem(REFRESH_KEY);
  },

  saveTokens(accessToken: string, refreshToken?: string, expiresInSeconds: number = 3600) {
    localStorage.setItem(TOKEN_KEY, accessToken);
    if (refreshToken) {
      localStorage.setItem(REFRESH_KEY, refreshToken);
    }
    const expiresAt = Date.now() + expiresInSeconds * 1000;
    localStorage.setItem(EXPIRY_KEY, expiresAt.toString());
  },

  clearSession() {
    localStorage.removeItem(TOKEN_KEY);
    localStorage.removeItem(REFRESH_KEY);
    localStorage.removeItem(EXPIRY_KEY);
    localStorage.removeItem(USER_KEY);
    sessionStorage.removeItem(VERIFIER_KEY);
  },

  getUserProfile(): SpotifyUserProfile | null {
    const raw = localStorage.getItem(USER_KEY);
    if (!raw) return null;
    try {
      return JSON.parse(raw);
    } catch {
      return null;
    }
  },

  saveUserProfile(profile: SpotifyUserProfile) {
    localStorage.setItem(USER_KEY, JSON.stringify(profile));
  },

  async startLoginFlow(customClientId?: string): Promise<string> {
    const verifier = generateRandomString(64);
    sessionStorage.setItem(VERIFIER_KEY, verifier);

    const hashed = await sha256(verifier);
    const challenge = base64urlencode(hashed);

    const clientId = customClientId || this.getSavedClientId();

    // Request the authorization URL from backend
    const params = new URLSearchParams({
      code_challenge: challenge,
    });
    if (clientId) {
      params.append('client_id', clientId);
    }

    const res = await fetch(`/api/auth/spotify/url?${params.toString()}`);
    if (!res.ok) {
      throw new Error('Failed to generate Spotify authorization URL');
    }

    const data = await res.json();
    return data.url;
  },

  async exchangeCodeForToken(code: string, customClientId?: string): Promise<string> {
    const verifier = sessionStorage.getItem(VERIFIER_KEY) || '';
    const clientId = customClientId || this.getSavedClientId();

    const res = await fetch('/api/auth/spotify/token', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        code,
        code_verifier: verifier,
        client_id: clientId,
      }),
    });

    if (!res.ok) {
      const err = await res.json().catch(() => ({}));
      throw new Error(err.error_description || err.error || 'Failed to exchange authorization code');
    }

    const data = await res.json();
    this.saveTokens(data.access_token, data.refresh_token, data.expires_in);
    return data.access_token;
  },

  async fetchMe(token: string): Promise<SpotifyUserProfile> {
    const res = await fetch('https://api.spotify.com/v1/me', {
      headers: { Authorization: `Bearer ${token}` }
    });

    if (!res.ok) {
      throw new Error('Failed to fetch Spotify profile');
    }

    const data = await res.json();
    const profile: SpotifyUserProfile = {
      id: data.id,
      displayName: data.display_name || data.id,
      email: data.email,
      avatarUrl: data.images?.[0]?.url || 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=200&auto=format&fit=crop&q=80',
      product: data.product === 'premium' ? 'premium' : 'free',
      followersCount: data.followers?.total || 0,
      country: data.country,
      isConnectedWithRealAccount: true
    };

    this.saveUserProfile(profile);
    return profile;
  },

  async fetchUserPlaylists(token: string): Promise<Playlist[]> {
    try {
      const res = await fetch('https://api.spotify.com/v1/me/playlists?limit=15', {
        headers: { Authorization: `Bearer ${token}` }
      });
      if (!res.ok) return [];
      const data = await res.json();
      return (data.items || []).map((item: any) => ({
        id: item.id,
        title: item.name,
        description: item.description || `By ${item.owner?.display_name || 'Spotify'}`,
        coverUrl: item.images?.[0]?.url || 'https://images.unsplash.com/photo-1470225620780-dba8ba36b745?w=300&auto=format&fit=crop&q=80',
        curator: item.owner?.display_name || 'Spotify',
        tracks: []
      }));
    } catch {
      return [];
    }
  },

  async searchSpotify(token: string, query: string): Promise<Track[]> {
    try {
      const res = await fetch(`https://api.spotify.com/v1/search?q=${encodeURIComponent(query)}&type=track&limit=15`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      if (!res.ok) return [];
      const data = await res.json();
      return (data.tracks?.items || []).map((item: any) => ({
        id: `sp-${item.id}`,
        title: item.name,
        artist: item.artists?.map((a: any) => a.name).join(', ') || 'Unknown Artist',
        album: item.album?.name || 'Single',
        coverUrl: item.album?.images?.[0]?.url || 'https://images.unsplash.com/photo-1518709268805-4e9042af9f23?w=300&auto=format&fit=crop&q=80',
        audioUrl: item.preview_url || '',
        duration: Math.round((item.duration_ms || 180000) / 1000),
        spotifyUri: item.uri,
        explicit: item.explicit
      }));
    } catch {
      return [];
    }
  },

  setMockProfile(): SpotifyUserProfile {
    const mock: SpotifyUserProfile = {
      id: 'spotify-user-demo',
      displayName: 'Alex Rivers',
      email: 'alex.rivers@spotify.demo',
      avatarUrl: 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=200&auto=format&fit=crop&q=80',
      product: 'premium',
      followersCount: 142,
      country: 'US',
      isConnectedWithRealAccount: false
    };
    this.saveUserProfile(mock);
    return mock;
  }
};
