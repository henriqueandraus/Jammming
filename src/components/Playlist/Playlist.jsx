import Tracklist from '../Tracklist/Tracklist';
import styles from './Playlist.module.css';

function Playlist({ playlistName, playlistTracks, onNameChange }) {
  return (
    <div className={styles.playlist}>
      <input
        className={styles.playlistName}
        value={playlistName}
        onChange={e => onNameChange(e.target.value)}
      />
      <Tracklist tracks={playlistTracks} />
      <button className={styles.saveButton}>Save To Spotify</button>
    </div>
  );
}

export default Playlist;