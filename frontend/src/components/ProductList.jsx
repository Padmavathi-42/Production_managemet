import ProductItem from "./ProductItem";

export default function ProductList({ products, searchQuery, sortOption, deleteProduct }) {
  const safeProducts = Array.isArray(products) ? products : [];
  const query = (searchQuery || "").toLowerCase();

  let filtered = safeProducts.filter((p) => {
    if (!p) return false;
    const name = (p.name || "").toLowerCase();
    return name.includes(query);
  });

  if (sortOption === "name") {
    filtered.sort((a, b) => (a?.name || "").localeCompare(b?.name || ""));
  } else if (sortOption === "price-low") {
    filtered.sort((a, b) => (Number(a?.price) || 0) - (Number(b?.price) || 0));
  } else if (sortOption === "price-high") {
    filtered.sort((a, b) => (Number(b?.price) || 0) - (Number(a?.price) || 0));
  } else if (sortOption === "date") {
    const getTime = (p) => {
      const dateStr = p?.date || p?.createdAt;
      const t = dateStr ? new Date(dateStr).getTime() : 0;
      return Number.isNaN(t) ? 0 : t;
    };
    filtered.sort((a, b) => getTime(b) - getTime(a));
  }

  return (
    <div>
      {filtered.length > 0 ? (
        <div className="product-grid">
          {filtered.map((p, idx) => (
            <ProductItem key={p?._id || p?.id || idx} product={p} deleteProduct={deleteProduct} />
          ))}
        </div>
      ) : (
        <div className="empty-state">
          <div className="empty-icon">🔍</div>
          <h3 className="empty-title">No products found</h3>
          <p className="empty-message">Try adjusting your search or add a new product</p>
        </div>
      )}
    </div>
  );
}
