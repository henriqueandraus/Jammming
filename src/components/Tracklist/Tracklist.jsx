import Track from '../Track/Track';
import styles from './Tracklist.module.css';

function Tracklist({ tracks }) {
  return (
    <div className={styles.tracklist}>
      {tracks.map(track => (
        <Track key={track.id} track={track} />
      ))}
    </div>
  );
}

export default Tracklist;