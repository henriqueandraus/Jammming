import styles from './Track.module.css';

function Track({ track }) {
  return (
    <div className={styles.track}>
      <div className={styles.trackInfo}>
        <h3>{track.name}</h3>
        <p>{track.artist} | {track.album}</p>
      </div>
      <button className={styles.trackAction}>+</button>
    </div>
  );
}

export default Track;