import { useState, useEffect } from 'react';
import SearchBar from '../SearchBar/SearchBar';
import SearchResults from '../SearchResults/SearchResults';
import Playlist from '../Playlist/Playlist';
import Spotify from '../../utils/Spotify';
import styles from './App.module.css';

const mockTracks = [
  { id: 1, name: "Blinding Lights", artist: "The Weeknd", album: "After Hours", uri: "spotify:track:0VjIjW4GlUZAMYd2vXMi3b" },
  { id: 2, name: "Levitating", artist: "Dua Lipa", album: "Future Nostalgia", uri: "spotify:track:463CkQjx2Zk1yXoBuierM9" },
  { id: 3, name: "Stay", artist: "Kid LAROI", album: "F*CK LOVE", uri: "spotify:track:5HCyWlXZPP0y6Gqq8TgA20" },
];

function App() {
  const [searchResults, setSearchResults] = useState(mockTracks);
  const [playlistName, setPlaylistName] = useState("My Playlist");
  const [playlistTracks, setPlaylistTracks] = useState([]);

  useEffect(() => {
    Spotify.getAccessToken();
  }, []);

  function addTrack(track) {
    if (playlistTracks.find(t => t.id === track.id)) return;
    setPlaylistTracks(prev => [...prev, track]);
  }

  function removeTrack(track) {
    setPlaylistTracks(prev => prev.filter(t => t.id !== track.id));
  }

  function savePlaylist() {
    const trackURIs = playlistTracks.map(t => t.uri);
    console.log("Saving playlist:", playlistName);
    console.log("Track URIs:", trackURIs);
    setPlaylistName("My Playlist");
    setPlaylistTracks([]);
  }

  return (
    <div className={styles.app}>
      <h1 className={styles.title}>Ja<span>mmm</span>ing</h1>
      <SearchBar />
      <div className={styles.content}>
        <SearchResults searchResults={searchResults} onAdd={addTrack} />
        <Playlist
          playlistName={playlistName}
          playlistTracks={playlistTracks}
          onNameChange={setPlaylistName}
          onRemove={removeTrack}
          onSave={savePlaylist}
        />
      </div>
    </div>
  );
}

export default App;