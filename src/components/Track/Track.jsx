import styles from './Track.module.css';

function Track({ track, onAdd, onRemove }) {
  return (
    <div className={styles.track}>
      <div className={styles.trackInfo}>
        <h3>{track.name}</h3>
        <p>{track.artist} | {track.album}</p>
      </div>
      {onAdd && (
        <button className={styles.trackAction} onClick={() => onAdd(track)}>+</button>
      )}
      {onRemove && (
        <button className={styles.trackAction} onClick={() => onRemove(track)}>-</button>
      )}
    </div>
  );
}

export default Track;