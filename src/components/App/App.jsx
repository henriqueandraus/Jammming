import { useState } from 'react';
import SearchBar from '../SearchBar/SearchBar';
import SearchResults from '../SearchResults/SearchResults';
import Playlist from '../Playlist/Playlist';
import styles from './App.module.css';

const mockTracks = [
  { id: 1, name: "Blinding Lights", artist: "The Weeknd", album: "After Hours" },
  { id: 2, name: "Levitating", artist: "Dua Lipa", album: "Future Nostalgia" },
  { id: 3, name: "Stay", artist: "Kid LAROI", album: "F*CK LOVE" },
];

function App() {
  const [searchResults, setSearchResults] = useState(mockTracks);
  const [playlistName, setPlaylistName] = useState("My Playlist");
  const [playlistTracks, setPlaylistTracks] = useState([]);

  function addTrack(track) {
    if (playlistTracks.find(t => t.id === track.id)) return;
    setPlaylistTracks(prev => [...prev, track]);
  }

  function removeTrack(track) {
    setPlaylistTracks(prev => prev.filter(t => t.id !== track.id));
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
        />
      </div>
    </div>
  );
}

export default App;