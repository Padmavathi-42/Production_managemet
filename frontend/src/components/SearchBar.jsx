export default function SearchBar({ setSearchQuery }) {
    return (
      <div className="search-container">
        <input
          type="text"
          placeholder="Search products..."
          onChange={(e) => setSearchQuery(e.target.value)}
          className="search-input"
        />
        <div className="search-icon">
          🔍
        </div>
      </div>
    );
  }
  
