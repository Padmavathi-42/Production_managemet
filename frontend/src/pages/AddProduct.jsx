import { useMemo, useState } from "react";
import RecentProductItem from "../components/RecentProductItem";
import { useNavigate } from "react-router-dom";
import ProductForm from "../components/ProductForm";
import { productAPI } from "../services/api";

export default function AddProduct({ products = [], setProducts }) {
  const navigate = useNavigate();
  const [form, setForm] = useState({
    name: "",
    price: "",
    description: "",
    category: "",
  });

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    console.log("=== ADD PRODUCT DEBUG ===");
    console.log("Form data before submit:", form);
    
    try {
      const payload = {
        name: (form.name || "").trim(),
        price: Number(form.price),
        description: (form.description || "").trim(),
        category: form.category,
      };

      console.log("Payload being sent:", payload);
      console.log("API URL:", import.meta.env.VITE_API_URL);

      const response = await productAPI.create(payload);
      console.log("API response:", response);

      const created = response?.data ?? response;
      console.log("Created product:", created);
      
      if (!created || (!created._id && !created.id)) {
        console.warn("Create response did not include an id. Using payload fallback.");
      }

      setProducts((prev) => {
        console.log("Previous products:", prev);
        const newProducts = [...prev, created || payload];
        console.log("New products array:", newProducts);
        return newProducts;
      });
      
      console.log("Navigating to home...");
      navigate("/");
    } catch (error) {
      console.error("Error adding product:", error);
      console.error("Error details:", error.message);
      console.error("Error stack:", error.stack);
      alert(`Failed to add product: ${error.message}`);
    }
  };

  const recentFour = useMemo(() => {
    const byTime = [...products].sort((a, b) => {
      const ta = new Date(a?.createdAt || a?.date || 0).getTime();
      const tb = new Date(b?.createdAt || b?.date || 0).getTime();
      return tb - ta;
    });
    return byTime.slice(0, 4);
  }, [products]);

  return (
    <div className="page-container" style={{paddingTop: "40px"}}>
      <div className="page-header" style={{marginBottom: "1rem"}}>
        <div className="page-title-section">
          <h1 className="page-title">Add New Product</h1>
          <p className="page-subtitle">Fill the form and preview recent additions.</p>
        </div>
      </div>

      <div style={{display: "grid", gridTemplateColumns: "1.2fr 1fr", gap: "1.25rem", alignItems: "start"}}>
        <div className="form-card">
          <ProductForm 
            form={form} 
            setForm={setForm} 
            handleSubmit={handleSubmit} 
            buttonText="Add Product" 
          />
        </div>

        <div>
          <div className="form-card" style={{padding: "1rem"}}>
            <h3 className="page-title" style={{fontSize: "1.25rem", marginBottom: ".5rem"}}>Recently Added</h3>
            {recentFour.length === 0 ? (
              <p className="page-subtitle">No products yet. Add your first product.</p>
            ) : (
              <div className="product-grid" style={{gridTemplateColumns: "1fr", gap: "0.75rem"}}>
                {recentFour.map((p, idx) => (
                  <RecentProductItem key={p?._id || p?.id || idx} product={p} />
                ))}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
