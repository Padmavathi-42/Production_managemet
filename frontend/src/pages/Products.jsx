
import { useMemo, useState } from "react";
import ProductList from "../components/ProductList";
import SearchBar from "../components/SearchBar";
import SortDropdown from "../components/SortDropdown";

export default function Products({ products, setProducts, deleteProduct }) {
  const [searchQuery, setSearchQuery] = useState("");
  const [sortOption, setSortOption] = useState("name");

  const total = useMemo(() => products?.length || 0, [products]);

  return (
    <div className="page-container">
      <div className="page-header">
        <div className="page-title-section">
          <h1 className="page-title">All Products</h1>
          <p className="page-subtitle">Browse {total} products. Search and sort as needed.</p>
        </div>
      </div>

      <div className="controls-container" style={{marginBottom: "0.5rem"}}>
        <SearchBar setSearchQuery={setSearchQuery} />
        <SortDropdown setSortOption={setSortOption} />
      </div>

      <div className="products-section" style={{paddingTop: 0}}>
        <ProductList
          products={products}
          searchQuery={searchQuery}
          sortOption={sortOption}
          deleteProduct={deleteProduct}
        />
      </div>
    </div>
  );
}
