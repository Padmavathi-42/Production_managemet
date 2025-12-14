
import { useState, useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";
import ProductForm from "../components/ProductForm";
import { productAPI } from "../services/api";

export default function EditProduct({ products, setProducts }) {
  const { id } = useParams();
  const navigate = useNavigate();
  const [form, setForm] = useState(null);
  const [loading, setLoading] = useState(true);

  // Prefer local state first, then fetch if needed (e.g., on hard refresh)
  useEffect(() => {
    const maybeLocal = products?.find((p) => (p._id || p.id)?.toString() === id);
    if (maybeLocal) {
      setForm(maybeLocal);
      setLoading(false);
      return;
    }

    const fetchProduct = async () => {
      try {
        const response = await productAPI.getById(id);
        // API returns product in `data`
        setForm(response.data);
      } catch (error) {
        console.error("Error fetching product:", error);
        setForm(null);
      } finally {
        setLoading(false);
      }
    };

    fetchProduct();
  }, [id, products]);

  // ✅ Handle form submit (PUT request)
  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const response = await productAPI.update(id, form); // PUT to backend
      const updatedProduct = response.data; // API returns updated product in `data`

      // update local state
      setProducts((prev) =>
        prev.map((p) => ((p._id || p.id) === (updatedProduct._id || updatedProduct.id) ? updatedProduct : p))
      );

      navigate("/");
    } catch (error) {
      console.error("Error updating product:", error);
      alert("Failed to update product. Please try again.");
    }
  };

  if (loading) {
    return <p>Loading product...</p>;
  }

  if (!form) {
    return (
      <div className="form-page-container">
        <div className="form-content">
          <div className="error-state">
            <div className="error-icon">❌</div>
            <h2 className="error-title">Product Not Found</h2>
            <p className="error-message">
              The product you're looking for doesn't exist.
            </p>
            <button
              onClick={() => navigate("/")}
              className="btn btn-primary"
            >
              Back to Products
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="form-page-container">
      <div className="form-content">
        <div className="form-header">
          <h1 className="page-title">Edit Product</h1>
          <p className="page-subtitle">
            Update the details for <strong>{form.name}</strong>
          </p>
        </div>

        <div className="form-card">
          <ProductForm 
            form={form} 
            setForm={setForm} 
            handleSubmit={handleSubmit} 
            buttonText="Update Product" 
          />
        </div>
      </div>
    </div>
  );
}
