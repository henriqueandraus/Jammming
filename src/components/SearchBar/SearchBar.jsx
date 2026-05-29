import styles from './SearchBar.module.css';

function SearchBar() {
  return (
    <div className={styles.searchBar}>
      <input
        className={styles.searchInput}
        placeholder="Enter a song, album, or artist"
      />
      <button className={styles.searchButton}>Search</button>
    </div>
  );
}

export default SearchBar;