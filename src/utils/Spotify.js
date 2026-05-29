const clientId = '31ad68fddbbb47dfa26e70f39d43d7ab';
const redirectUri = 'http://127.0.0.1:5174/';

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
  async getAccessToken() {
    // Verifica se já tem token salvo
    const token = localStorage.getItem('spotify_access_token');
    const expiry = localStorage.getItem('spotify_token_expiry');

    if (token && expiry && Date.now() < Number(expiry)) {
      return token;
    }

    // Verifica se voltou do login com o code
    const params = new URLSearchParams(window.location.search);
    const code = params.get('code');

    if (code) {
      const verifier = localStorage.getItem('spotify_code_verifier');

      const response = await fetch('https://accounts.spotify.com/api/token', {
        method: 'POST',
        headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
        body: new URLSearchParams({
          client_id: clientId,
          grant_type: 'authorization_code',
          code,
          redirect_uri: redirectUri,
          code_verifier: verifier,
        }),
      });

      const data = await response.json();
      localStorage.setItem('spotify_access_token', data.access_token);
      localStorage.setItem('spotify_token_expiry', Date.now() + data.expires_in * 1000);
      window.history.pushState({}, '', '/');
      return data.access_token;
    }

    // Redireciona para login
    const verifier = await generateCodeVerifier();
    const challenge = await generateCodeChallenge(verifier);
    localStorage.setItem('spotify_code_verifier', verifier);

    const scope = 'playlist-modify-public';
    window.location = `https://accounts.spotify.com/authorize?client_id=${clientId}&response_type=code&redirect_uri=${encodeURIComponent(redirectUri)}&scope=${scope}&code_challenge_method=S256&code_challenge=${challenge}`;
  },

  async search(term) {
    const token = await this.getAccessToken();
    const response = await fetch(`https://api.spotify.com/v1/search?type=track&q=${encodeURIComponent(term)}`, {
      headers: { Authorization: `Bearer ${token}` }
    });
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
    const token = await this.getAccessToken();

    const userResponse = await fetch('https://api.spotify.com/v1/me', {
      headers: { Authorization: `Bearer ${token}` }
    });
    const userData = await userResponse.json();
    const userId = userData.id;

    const playlistResponse = await fetch(`https://api.spotify.com/v1/users/${userId}/playlists`, {
      method: 'POST',
      headers: {
        Authorization: `Bearer ${token}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ name, public: true }),
    });
    const playlist = await playlistResponse.json();

    await fetch(`https://api.spotify.com/v1/playlists/${playlist.id}/tracks`, {
      method: 'POST',
      headers: {
        Authorization: `Bearer ${token}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ uris: trackURIs }),
    });
  }
};

export default Spotify;