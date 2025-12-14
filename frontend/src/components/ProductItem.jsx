import { Link } from "react-router-dom";
import { useEffect, useState } from "react";

// Simple in-memory cache keyed by name+category to avoid repeated Unsplash requests per product
const productImageCache = {};

export default function ProductItem({ product, deleteProduct }) {
  const [imageUrl, setImageUrl] = useState("");
  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString("en-US", {
      year: "numeric",
      month: "short",
      day: "numeric",
    });
  };

  const getCategoryIcon = (category) => {
    const icons = {
      Electronics: "📱",
      Clothing: "👕",
      Books: "📚",
      "Home & Garden": "🏠",
      Sports: "⚽",
      Toys: "🧸",
      Furniture: "🪑",
      Appliances: "🧺",
      Groceries: "🧃",
      Beauty: "💄",
      Automotive: "🚗",
      Accessories: "👜",
      Footwear: "👟",
      Jewelry: "💍",
      Health: "🩺",
      "Pet Supplies": "🐶",
      Music: "🎵",
      Gaming: "🎮",
      Office: "🗂️",
      Kitchen: "🍳",
      Garden: "🌿",
      Tools: "🛠️",
      Baby: "🍼",
      Outdoor: "🏕️",
      Art: "🎨",
      Photography: "📷",
      Other: "📦",
    };
    return icons[category] || "📦";
  };

  const fallbackImage = "https://images.unsplash.com/photo-1560472354-b33ff0c44a43?w=400&h=300&fit=crop&crop=center";

  useEffect(() => {
    const name = (product?.name || "").trim();
    if (!name) return;

    const UNSPLASH_KEY = import.meta.env.VITE_UNSPLASH_ACCESS_KEY;

    const fetchImage = async (query) => {
      try {
        const res = await fetch(`https://api.unsplash.com/search/photos?query=${encodeURIComponent(query)}&client_id=${UNSPLASH_KEY}&per_page=1`);
        if (!res.ok) throw new Error("Unsplash API error");
        const data = await res.json();
        return data.results[0]?.urls?.small || "";
      } catch (err) {
        console.error("Failed to fetch image:", err);
        return "";
      }
    };

    (async () => {
      const img = await fetchImage(name);
      setImageUrl(img);
    })();
  }, [product?.category, product?.name]);

  const truncateDescription = (text, maxLength = 100) => {
    if (!text) return "";
    return text.length <= maxLength ? text : text.substring(0, maxLength) + "...";
  };

  return (
    <div className="product-card">
      <div className="product-image-container">
        <img
          src={imageUrl || fallbackImage}
          alt={product.name}
          className="product-image"
          onError={(e) => {
            e.target.src =
              "https://images.unsplash.com/photo-1560472354-b33ff0c44a43?w=400&h=300&fit=crop&crop=center";
          }}
        />
        <div className="product-category-badge">
          <span className="category-icon">{getCategoryIcon(product.category)}</span>
          <span className="category-text">{product.category}</span>
        </div>
      </div>

      <div className="product-info">
        <h3 className="product-title">{product.name}</h3>

        <div className="product-description">
          <p className="description-text">{truncateDescription(product.description)}</p>
        </div>

        <div className="product-price">
          <span className="price-icon">💰</span>
          <span className="price-value">${Number(product.price).toLocaleString()}</span>
        </div>

        {/* <div className="product-date">
          <span>📅</span>
          <span>{formatDate(product.date || product.createdAt)}</span>
        </div> */}
      </div>

      <div className="product-actions">
        <Link to={`/edit/${product?._id || product?.id}`}>
          <button className="btn btn-success btn-icon btn-sm">
            <span className="icon-chip success">✔</span>
            <span>Edit</span>
          </button>
        </Link>

        <button onClick={() => deleteProduct(product?._id || product?.id)} className="btn btn-danger btn-icon btn-sm">
          <span className="icon-chip danger">🗑</span>
          <span>Delete</span>
        </button>
      </div>
    </div>
  );
}
