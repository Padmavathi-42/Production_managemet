export default function SortDropdown({ setSortOption }) {
    return (
      <select 
        onChange={(e) => setSortOption(e.target.value)} 
        className="sort-select"
      >
        <option value="name">Sort by Name</option>
        <option value="price-low">Price: Low to High</option>
        <option value="price-high">Price: High to Low</option>
        <option value="date">Newest First</option>
      </select>
    );
  }
  
