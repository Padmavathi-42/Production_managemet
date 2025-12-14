import { Link, useLocation } from "react-router-dom";

export default function Navbar() {
  const location = useLocation();

  return (
    <nav className="navbar">
      <div>
        <h1 className="navbar-brand">
          Product Manager
        </h1>
      </div>
      
      <div className="navbar-nav">
        <Link 
          to="/" 
          className={`nav-link ${location.pathname === "/" ? "active" : ""}`}
        >
          Home
        </Link>
        <Link 
          to="/products" 
          className={`nav-link ${location.pathname === "/products" ? "active" : ""}`}
        >
          Products
        </Link>
        <Link 
          to="/add" 
          className={`nav-link ${location.pathname === "/add" ? "active" : ""}`}
        >
          Add Product
        </Link>
      </div>
    </nav>
  );
}
