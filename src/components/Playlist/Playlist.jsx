import Tracklist from '../Tracklist/Tracklist';
import styles from './Playlist.module.css';

function Playlist({ playlistTracks }) {
  return (
    <div className={styles.playlist}>
      <input
        className={styles.playlistName}
        defaultValue="My Playlist"
      />
      <Tracklist tracks={playlistTracks} />
      <button className={styles.saveButton}>Save To Spotify</button>
    </div>
  );
}

export default Playlist;