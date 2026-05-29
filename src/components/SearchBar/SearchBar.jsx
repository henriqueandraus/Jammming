import { useState } from 'react';
import styles from './SearchBar.module.css';

function SearchBar({ onSearch }) {
  const [term, setTerm] = useState('');

  function handleSearch() {
    if (term) onSearch(term);
  }

  function handleKeyDown(e) {
    if (e.key === 'Enter') handleSearch();
  }

  return (
    <div className={styles.searchBar}>
      <input
        className={styles.searchInput}
        placeholder="Enter a song, album, or artist"
        value={term}
        onChange={e => setTerm(e.target.value)}
        onKeyDown={handleKeyDown}
      />
      <button className={styles.searchButton} onClick={handleSearch}>Search</button>
    </div>
  );
}

export default SearchBar;