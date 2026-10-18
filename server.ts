import express from 'express';
import dotenv from 'dotenv';
import path from 'path';
import fs from 'fs';
import { fileURLToPath } from 'url';

dotenv.config();

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
const PORT = parseInt(process.env.PORT || '3000', 10);

app.use(express.json());

// App base URL from environment or fallback
function getBaseUrl(req: express.Request): string {
  if (process.env.APP_URL) {
    return process.env.APP_URL.replace(/\/$/, '');
  }
  const protocol = req.headers['x-forwarded-proto'] || req.protocol || 'http';
  const host = req.headers['x-forwarded-host'] || req.headers.host || `localhost:${PORT}`;
  return `${protocol}://${host}`;
}

// 1. Spotify OAuth URL Generation
app.get('/api/auth/spotify/url', (req, res) => {
  const baseUrl = getBaseUrl(req);
  const redirectUri = `${baseUrl}/auth/callback`;
  const clientId = (req.query.client_id as string) || process.env.SPOTIFY_CLIENT_ID || '';
  const codeChallenge = (req.query.code_challenge as string) || '';
  const state = (req.query.state as string) || Math.random().toString(36).substring(7);

  const scopes = [
    'user-read-private',
    'user-read-email',
    'user-read-playback-state',
    'user-modify-playback-state',
    'user-read-currently-playing',
    'playlist-read-private',
    'playlist-read-collaborative',
    'user-library-read',
    'user-top-read',
    'user-read-recently-played',
    'streaming'
  ].join(' ');

  const params = new URLSearchParams({
    client_id: clientId,
    response_type: 'code',
    redirect_uri: redirectUri,
    scope: scopes,
    state: state,
    show_dialog: 'true'
  });

  if (codeChallenge) {
    params.append('code_challenge_method', 'S256');
    params.append('code_challenge', codeChallenge);
  }

  const authUrl = `https://accounts.spotify.com/authorize?${params.toString()}`;

  res.json({
    url: authUrl,
    redirectUri,
    configuredClientId: !!clientId,
    clientId
  });
});

// 2. OAuth Callback Route (popup sends postMessage to opener window)
const callbackHandler = (req: express.Request, res: express.Response) => {
  const { code, state, error } = req.query;

  // PostMessage back to opener
  res.send(`<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <title>Spotify Authentication</title>
  <style>
    body {
      background-color: #121212;
      color: #ffffff;
      font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, Helvetica, Arial, sans-serif;
      display: flex;
      flex-direction: column;
      align-items: center;
      justify-content: center;
      height: 100vh;
      margin: 0;
      text-align: center;
    }
    .card {
      background-color: #181818;
      border: 1px solid #282828;
      border-radius: 16px;
      padding: 32px;
      max-width: 360px;
      box-shadow: 0 10px 30px rgba(0,0,0,0.5);
    }
    .logo {
      width: 48px;
      height: 48px;
      margin-bottom: 16px;
    }
    h2 {
      margin: 0 0 8px 0;
      font-size: 20px;
    }
    p {
      color: #b3b3b3;
      font-size: 14px;
      margin: 0 0 16px 0;
    }
    .spinner {
      border: 3px solid rgba(255,255,255,0.1);
      border-left-color: #1DB954;
      border-radius: 50%;
      width: 28px;
      height: 28px;
      animation: spin 1s linear infinite;
      margin: 0 auto;
    }
    @keyframes spin {
      0% { transform: rotate(0deg); }
      100% { transform: rotate(360deg); }
    }
  </style>
</head>
<body>
  <div class="card">
    <svg class="logo" viewBox="0 0 512 512">
      <circle cx="256" cy="256" r="256" fill="#1DB954"/>
      <path d="M370.8 368.5c-4.4 7.2-13.8 9.5-21 5.1-57.5-35.1-130-43.1-215.3-23.6-8.2 1.9-16.4-3.3-18.2-11.5s3.3-16.4 11.5-18.2c93.5-21.3 173.8-12.3 237.9 27.1 7.2 4.4 9.5 13.9 5.1 21.1zm30.3-67.4c-5.5 9-17.3 11.8-26.3 6.3-65.8-40.4-166.2-52.2-244.1-28.5-10.1 3.1-21-2.7-24.1-12.8s2.7-21 12.8-24.1c89.1-27 199.7-13.8 275.4 32.8 9 5.4 11.8 17.3 6.3 26.3zm2.6-70.1C325 183.9 194.8 179.6 119.5 202.5c-12 3.6-24.8-3.1-28.4-15.1s3.1-24.8 15.1-28.4c86.5-26.3 230.1-21.4 316.8 30 10.9 6.5 14.5 20.6 8 31.5-6.5 10.9-20.6 14.5-31.5 8z" fill="#000000"/>
    </svg>
    <h2>${error ? 'Connection Failed' : 'Spotify Connected!'}</h2>
    <p>${error ? 'Error: ' + error : 'Finalizing secure connection... This window will close automatically.'}</p>
    <div class="spinner"></div>
  </div>
  <script>
    const payload = {
      type: 'SPOTIFY_AUTH_SUCCESS',
      code: ${JSON.stringify(code || null)},
      state: ${JSON.stringify(state || null)},
      error: ${JSON.stringify(error || null)}
    };

    if (window.opener) {
      window.opener.postMessage(payload, '*');
      setTimeout(() => {
        window.close();
      }, 500);
    } else {
      setTimeout(() => {
        window.location.href = '/';
      }, 1500);
    }
  </script>
</body>
</html>`);
};

app.get(['/auth/callback', '/auth/callback/'], callbackHandler);

// 3. Exchange Code for Access Token (supports both Secret-based and PKCE)
app.post('/api/auth/spotify/token', async (req, res) => {
  try {
    const { code, code_verifier, client_id, client_secret, redirect_uri } = req.body;
    const finalClientId = client_id || process.env.SPOTIFY_CLIENT_ID;
    const finalClientSecret = client_secret || process.env.SPOTIFY_CLIENT_SECRET;
    const baseUrl = getBaseUrl(req);
    const finalRedirectUri = redirect_uri || `${baseUrl}/auth/callback`;

    if (!finalClientId) {
      return res.status(400).json({ error: 'Missing Spotify Client ID' });
    }

    const bodyParams = new URLSearchParams({
      grant_type: 'authorization_code',
      code: code,
      redirect_uri: finalRedirectUri,
      client_id: finalClientId
    });

    if (code_verifier) {
      bodyParams.append('code_verifier', code_verifier);
    }

    const headers: Record<string, string> = {
      'Content-Type': 'application/x-www-form-urlencoded',
    };

    if (finalClientSecret) {
      const basicAuth = Buffer.from(`${finalClientId}:${finalClientSecret}`).toString('base64');
      headers['Authorization'] = `Basic ${basicAuth}`;
    }

    const response = await fetch('https://accounts.spotify.com/api/token', {
      method: 'POST',
      headers,
      body: bodyParams.toString()
    });

    const data = await response.json();
    if (!response.ok) {
      return res.status(response.status).json(data);
    }

    res.json(data);
  } catch (err: unknown) {
    console.error('Error exchanging token:', err);
    res.status(500).json({ error: 'Failed to exchange authorization code for token' });
  }
});

// 4. Refresh Spotify Token
app.post('/api/auth/spotify/refresh', async (req, res) => {
  try {
    const { refresh_token, client_id, client_secret } = req.body;
    const finalClientId = client_id || process.env.SPOTIFY_CLIENT_ID;
    const finalClientSecret = client_secret || process.env.SPOTIFY_CLIENT_SECRET;

    if (!finalClientId || !refresh_token) {
      return res.status(400).json({ error: 'Missing client ID or refresh token' });
    }

    const bodyParams = new URLSearchParams({
      grant_type: 'refresh_token',
      refresh_token: refresh_token,
      client_id: finalClientId
    });

    const headers: Record<string, string> = {
      'Content-Type': 'application/x-www-form-urlencoded',
    };

    if (finalClientSecret) {
      const basicAuth = Buffer.from(`${finalClientId}:${finalClientSecret}`).toString('base64');
      headers['Authorization'] = `Basic ${basicAuth}`;
    }

    const response = await fetch('https://accounts.spotify.com/api/token', {
      method: 'POST',
      headers,
      body: bodyParams.toString()
    });

    const data = await response.json();
    if (!response.ok) {
      return res.status(response.status).json(data);
    }

    res.json(data);
  } catch (err: unknown) {
    console.error('Error refreshing token:', err);
    res.status(500).json({ error: 'Failed to refresh token' });
  }
});

// 5. Proxy Spotify Web API endpoints (to bypass CORS & simplify client queries)
app.use('/api/spotify/proxy', async (req, res) => {
  try {
    const authHeader = req.headers.authorization;
    if (!authHeader) {
      return res.status(401).json({ error: 'Unauthorized: missing bearer token' });
    }

    const spotifyPath = req.url.replace(/^\//, '');
    const url = `https://api.spotify.com/v1/${spotifyPath}`;

    const headers: Record<string, string> = {
      'Authorization': authHeader,
      'Content-Type': 'application/json'
    };

    const fetchOptions: RequestInit = {
      method: req.method,
      headers
    };

    if (req.method !== 'GET' && req.method !== 'HEAD' && req.body) {
      fetchOptions.body = JSON.stringify(req.body);
    }

    const response = await fetch(url, fetchOptions);
    const contentType = response.headers.get('content-type');

    if (contentType && contentType.includes('application/json')) {
      const data = await response.json();
      return res.status(response.status).json(data);
    } else {
      const text = await response.text();
      return res.status(response.status).send(text);
    }
  } catch (err: unknown) {
    console.error('Spotify proxy error:', err);
    res.status(500).json({ error: 'Spotify proxy request failed' });
  }
});

// App configuration info
app.get('/api/config', (req, res) => {
  const baseUrl = getBaseUrl(req);
  res.json({
    appUrl: baseUrl,
    callbackUrl: `${baseUrl}/auth/callback`,
    hasSpotifyClientId: !!process.env.SPOTIFY_CLIENT_ID
  });
});

// 6. Direct Android APK Download Routes
app.get(['/download/spotify-liquid-player.apk', '/download/apk', '/api/download/apk'], (req, res) => {
  const apkFilePath = path.resolve(__dirname, 'public', 'downloads', 'spotify-liquid-player.apk');
  if (fs.existsSync(apkFilePath)) {
    res.setHeader('Content-Type', 'application/vnd.android.package-archive');
    res.setHeader('Content-Disposition', 'attachment; filename="Spotify-Liquid-Player.apk"');
    return res.sendFile(apkFilePath);
  }
  return res.status(404).send('APK file is compiling. Please try again.');
});

// Mount Vite in development or serve static in production
async function startServer() {
  if (process.env.NODE_ENV !== 'production') {
    const { createServer: createViteServer } = await import('vite');
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: 'spa',
    });
    app.use(vite.middlewares);
  } else {
    const distPath = path.resolve(__dirname, 'dist');
    app.use(express.static(distPath));
    app.get('*', (req, res) => {
      res.sendFile(path.resolve(distPath, 'index.html'));
    });
  }

  app.listen(PORT, '0.0.0.0', () => {
    console.log(`Spotify Web Server listening on port ${PORT}`);
  });
}

startServer();
