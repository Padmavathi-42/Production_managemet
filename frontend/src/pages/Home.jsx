import { useMemo, useState } from "react";
import ProductList from "../components/ProductList";
import SearchBar from "../components/SearchBar";
import SortDropdown from "../components/SortDropdown";
import { Link } from "react-router-dom";
import { productAPI } from "../services/api"; // ✅ import API service

export default function Home({ products, setProducts }) {
  const [searchQuery, setSearchQuery] = useState("");
  const [sortOption, setSortOption] = useState("name");

  const deleteProduct = async (id) => {
    if (!window.confirm("Are you sure you want to delete this product?")) return;

    try {
      // ✅ Delete from backend
      await productAPI.delete(id);

      // ✅ Update frontend state
      setProducts((prev) => prev.filter((p) => (p._id || p.id) !== id));
    } catch (error) {
      console.error("Error deleting product:", error);
      alert("Failed to delete product. Please try again.");
    }
  };

  const firstEight = useMemo(() => products.slice(0, 8), [products]);

  return (
    <div className="home-page">
      {/* Hero Section with Background */}
      <div className="hero-section">
        <div className="hero-content">
          <h1 className="hero-title">Streamline Your Inventory</h1>
          <p className="hero-subtitle">
            Effortlessly manage products, track sales, and grow your business
            with our powerful tools
          </p>

          <div className="hero-features">
            <div className="hero-feature">
              <span>🏷️</span>
              <span>Categories</span>
            </div>
            <div className="hero-feature">
              <span>📱</span>
              <span>Mobile Ready</span>
            </div>
          </div>

          <a href="#products" className="hero-cta">
            Get Started
          </a>
        </div>
      </div>

      {/* Featured Products Preview */}
      <div id="products" className="products-section">
        <div className="page-container">
          <h2 className="page-title" style={{marginBottom: "1rem"}}>Products</h2>

          {/* <div className="controls-container" style={{marginBottom: "1rem"}}>
            <SearchBar setSearchQuery={setSearchQuery} />
            <SortDropdown setSortOption={setSortOption} />
          </div> */}

          <ProductList
            products={firstEight}
            searchQuery={searchQuery}
            sortOption={sortOption}
            deleteProduct={deleteProduct}
          />

          <div style={{display: "flex", justifyContent: "center", marginTop: "1.25rem"}}>
            <Link to="/products">
              <button className="btn btn-primary btn-sm">View more products</button>
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
