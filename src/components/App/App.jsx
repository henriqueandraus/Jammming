import { useState, useEffect, useRef } from 'react';
import SearchBar from '../SearchBar/SearchBar';
import SearchResults from '../SearchResults/SearchResults';
import Playlist from '../Playlist/Playlist';
import Spotify from '../../utils/Spotify';
import styles from './App.module.css';

function App() {
  const [searchResults, setSearchResults] = useState([]);
  const [playlistName, setPlaylistName] = useState("My Playlist");
  const [playlistTracks, setPlaylistTracks] = useState([]);
  const tokenFetched = useRef(false);

  useEffect(() => {
    if (tokenFetched.current) return;
    tokenFetched.current = true;
    Spotify.getAccessToken();
  }, []);

  async function search(term) {
    const results = await Spotify.search(term);
    setSearchResults(results);
  }

  function addTrack(track) {
    if (playlistTracks.find(t => t.id === track.id)) return;
    setPlaylistTracks(prev => [...prev, track]);
  }

  function removeTrack(track) {
    setPlaylistTracks(prev => prev.filter(t => t.id !== track.id));
  }

  function savePlaylist() {
    const trackURIs = playlistTracks.map(t => t.uri);
    Spotify.savePlaylist(playlistName, trackURIs);
    setPlaylistName("My Playlist");
    setPlaylistTracks([]);
  }

  return (
    <div className={styles.app}>
      <h1 className={styles.title}>Ja<span>mmm</span>ing</h1>
      <SearchBar onSearch={search} />
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