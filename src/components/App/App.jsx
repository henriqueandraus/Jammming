import SearchBar from '../SearchBar/SearchBar';
import SearchResults from '../SearchResults/SearchResults';
import Playlist from '../Playlist/Playlist';
import styles from './App.module.css';

const mockTracks = [
  { id: 1, title: "Blinding Lights", artist: "The Weeknd", album: "After Hours" },
  { id: 2, title: "Levitating", artist: "Dua Lipa", album: "Future Nostalgia" },
  { id: 3, title: "Stay", artist: "Kid LAROI", album: "F*CK LOVE" },
];

function App() {
  return (
    <div className={styles.app}>
      <h1 className={styles.title}>Ja<span>mmm</span>ing</h1>
      <SearchBar />
      <div className={styles.content}>
        <SearchResults searchResults={mockTracks} />
        <Playlist playlistTracks={mockTracks} />
      </div>
    </div>
  );
}

export default App;