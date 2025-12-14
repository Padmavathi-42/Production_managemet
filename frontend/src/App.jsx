import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import { useState, useEffect } from "react";
import Navbar from "./components/Navbar";
import Home from "./pages/Home";
import AddProduct from "./pages/AddProduct";
import EditProduct from "./pages/EditProduct";
import NotFound from "./pages/NotFound";
import Products from "./pages/Products";
import { productAPI, healthCheck } from "./services/api";
import "./App.css";

function App() {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [apiStatus, setApiStatus] = useState("checking");
  
  const deleteProduct = async (id) => {
    if (!window.confirm("Are you sure you want to delete this product?")) return;
    try {
      await productAPI.delete(id);
      setProducts((prev) => prev.filter((p) => (p._id || p.id) !== id));
    } catch (err) {
      console.error("Error deleting product:", err);
      alert("Failed to delete product. Please try again.");
    }
  };

  // Check API health and fetch initial data
  useEffect(() => {
    const initializeApp = async () => {
      setLoading(true);
      
      try {
        // Check if backend is running
        await healthCheck();
        setApiStatus("connected");
        
        // Fetch initial products
        const response = await productAPI.getAll();
        setProducts(response.data || []);
        
      } catch (err) {
        console.error("Failed to connect to backend:", err);
        setApiStatus("disconnected");
        setError("Unable to connect to backend server. Please ensure the backend is running on port 5000.");
        
        // Fallback to dummy data for development
        setProducts([
          { 
            id: 1, 
            name: "Laptop", 
            price: 800, 
            description: "High-performance laptop for work and gaming",
            category: "Electronics",
            date: "2025-01-01" 
          },
          { 
            id: 2, 
            name: "Phone", 
            price: 500, 
            description: "Latest smartphone with advanced features",
            category: "Electronics",
            date: "2025-02-05" 
          },
          { 
            id: 3, 
            name: "Keyboard", 
            price: 50, 
            description: "Mechanical keyboard for typing enthusiasts",
            category: "Electronics",
            date: "2025-03-02" 
          },
        ]);
      } finally {
        setLoading(false);
      }
    };

    initializeApp();
  }, []);

  // Show loading screen
  if (loading) {
    return (
      <div className="app-container">
        <div className="loading-screen">
          <div className="spinner"></div>
          <h2>Loading Product Manager...</h2>
          <p>Connecting to backend...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="app-container">
      <Router>
        <Navbar />
        
        {/* API Status Banner */}
        {apiStatus === "disconnected" && (
          <div className="api-status-banner error">
            <span className="status-icon">⚠️</span>
            <span>Backend disconnected - Using offline mode</span>
            <button 
              onClick={() => window.location.reload()}
              className="retry-btn"
            >
              Retry Connection
            </button>
          </div>
        )}
        
        {apiStatus === "connected" && (
          <div className="api-status-banner success">
            <span className="status-icon">✅</span>
            <span>Connected to backend</span>
          </div>
        )}

        <main className="main-content">
          <Routes>
            <Route 
              path="/" 
              element={
                <Home 
                  products={products} 
                  setProducts={setProducts} 
                  deleteProduct={deleteProduct}
                />
              } 
            />
            <Route 
              path="/add" 
              element={
                <AddProduct 
                  products={products}
                  setProducts={setProducts} 
                />
              } 
            />
            <Route 
              path="/products" 
              element={
                <Products 
                  products={products}
                  setProducts={setProducts}
                  deleteProduct={deleteProduct}
                />
              }
            />
            <Route 
              path="/edit/:id" 
              element={
                <EditProduct 
                  products={products} 
                  setProducts={setProducts} 
                />
              } 
            />
            <Route path="*" element={<NotFound />} />
          </Routes>
        </main>
      </Router>
    </div>
  );
}

export default App;
