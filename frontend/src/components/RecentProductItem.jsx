
import { useEffect, useState } from "react";

export default function RecentProductItem({ product }) {
  const [imageUrl, setImageUrl] = useState("");

  const fallbackImage = "https://images.unsplash.com/photo-1560472354-b33ff0c44a43?w=200&h=150&fit=crop&crop=center";

  useEffect(() => {
    const name = (product?.name || "").trim();
    if (!name) return;

    const UNSPLASH_KEY = import.meta.env.VITE_UNSPLASH_ACCESS_KEY;

    const fetchImage = async (query) => {
      try {
        if (!UNSPLASH_KEY) throw new Error("Missing Unsplash key");
        const res = await fetch(`https://api.unsplash.com/search/photos?query=${encodeURIComponent(query)}&client_id=${UNSPLASH_KEY}&per_page=1`);
        if (!res.ok) throw new Error("Unsplash API error");
        const data = await res.json();
        return data.results[0]?.urls?.small || "";
      } catch (_) {
        return "";
      }
    };

    (async () => {
      const img = await fetchImage(name);
      setImageUrl(img);
    })();
  }, [product?.name]);

  return (
    <div className="product-card" style={{display: "grid", gridTemplateColumns: "90px 1fr", gap: "0.75rem", padding: "0.5rem"}}>
      <div className="product-image-container" style={{height: "70px", borderRadius: "8px"}}>
        <img
          className="product-image"
          alt={product?.name}
          src={imageUrl || fallbackImage}
          onError={(e) => { e.target.src = fallbackImage; }}
        />
      </div>
      <div className="product-info" style={{padding: 0}}>
        <div className="product-title" style={{margin: 0}}>{product?.name}</div>
        <div className="product-price" style={{marginTop: "0.25rem"}}>💰 ${Number(product?.price).toLocaleString()}</div>
        <div className="category-text" style={{color: "#64748b"}}>{product?.category}</div>
      </div>
    </div>
  );
}
