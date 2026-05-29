const clientId = '31ad68fddbbb47dfa26e70f39d43d7ab';
const redirectUri = 'https://jammming-gray.vercel.app/';
const VERIFIER_KEY = 'pkce_verifier';

async function generateCodeVerifier() {
  const array = new Uint8Array(32);
  crypto.getRandomValues(array);
  return btoa(String.fromCharCode(...array))
    .replace(/\+/g, '-').replace(/\//g, '_').replace(/=/g, '');
}

async function generateCodeChallenge(verifier) {
  const data = new TextEncoder().encode(verifier);
  const digest = await crypto.subtle.digest('SHA-256', data);
  return btoa(String.fromCharCode(...new Uint8Array(digest)))
    .replace(/\+/g, '-').replace(/\//g, '_').replace(/=/g, '');
}

const Spotify = {
  accessToken: null,

  async getAccessToken() {
    if (this.accessToken) return this.accessToken;

    const token = localStorage.getItem('spotify_access_token');
    const expiry = localStorage.getItem('spotify_token_expiry');

    if (token && expiry && Date.now() < Number(expiry)) {
      this.accessToken = token;
      return token;
    }

    const params = new URLSearchParams(window.location.search);
    const code = params.get('code');

    if (code) {
      const verifier = localStorage.getItem(VERIFIER_KEY);
      window.history.replaceState({}, document.title, '/');

      const response = await fetch('/api/token', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ code, code_verifier: verifier }),
      });

      const data = await response.json();

      if (data.access_token) {
        this.accessToken = data.access_token;
        localStorage.setItem('spotify_access_token', data.access_token);
        localStorage.setItem('spotify_token_expiry', Date.now() + data.expires_in * 1000);
        localStorage.removeItem(VERIFIER_KEY);
        return data.access_token;
      }
    }

    const verifier = await generateCodeVerifier();
    const challenge = await generateCodeChallenge(verifier);
    localStorage.setItem(VERIFIER_KEY, verifier);

    const url = new URL('https://accounts.spotify.com/authorize');
    url.searchParams.set('client_id', clientId);
    url.searchParams.set('response_type', 'code');
    url.searchParams.set('redirect_uri', redirectUri);
    url.searchParams.set('scope', 'playlist-modify-public playlist-modify-private');
    url.searchParams.set('code_challenge_method', 'S256');
    url.searchParams.set('code_challenge', challenge);
    window.location.href = url.toString();
  },

  async search(term) {
    const token = await this.getAccessToken();
    const response = await fetch(
      `https://api.spotify.com/v1/search?type=track&q=${encodeURIComponent(term)}`,
      { headers: { Authorization: `Bearer ${token}` } }
    );
    const data = await response.json();
    return data.tracks.items.map(track => ({
      id: track.id,
      name: track.name,
      artist: track.artists[0].name,
      album: track.album.name,
      uri: track.uri,
    }));
  },

  async savePlaylist(name, trackURIs) {
    if (!name || !trackURIs.length) return;

    const token = await this.getAccessToken();

    const userResponse = await fetch('https://api.spotify.com/v1/me', {
      headers: { Authorization: `Bearer ${token}` }
    });
    const userData = await userResponse.json();
    const userId = userData.id;

    const playlistResponse = await fetch(
      `https://api.spotify.com/v1/users/${userId}/playlists`,
      {
        method: 'POST',
        headers: {
          Authorization: `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ name, public: true }),
      }
    );
    const playlist = await playlistResponse.json();

    await fetch(
      `https://api.spotify.com/v1/playlists/${playlist.id}/tracks`,
      {
        method: 'POST',
        headers: {
          Authorization: `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ uris: trackURIs }),
      }
    );
  }
};

export default Spotify;