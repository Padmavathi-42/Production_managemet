
import { useState, useEffect } from "react";

export default function ProductForm({ form, setForm, handleSubmit, buttonText = "Submit" }) {
  const [errors, setErrors] = useState({});
  const [categories] = useState([
    'Electronics', 'Clothing', 'Books', 'Home & Garden', 'Sports', 'Toys',
    'Furniture', 'Appliances', 'Groceries', 'Beauty', 'Automotive', 'Accessories',
    'Footwear', 'Jewelry', 'Health', 'Pet Supplies', 'Music', 'Gaming', 'Office',
    'Kitchen', 'Garden', 'Tools', 'Baby', 'Outdoor', 'Art', 'Photography', 'Other'
  ]);

  // Update form data when form prop changes
  useEffect(() => {
    if (form) {
      setFormData({
        name: form.name || "",
        price: form.price || "",
        description: form.description || "",
        category: form.category || "",
        date: form.date || "",
      });
    }
  }, [form]);

  const [formData, setFormData] = useState({
    name: form?.name || "",
    price: form?.price || "",
    description: form?.description || "",
    category: form?.category || "",
    date: form?.date || "",
  });

  const handleChange = (e) => {
    const newFormData = { ...formData, [e.target.name]: e.target.value };
    setFormData(newFormData);
    setForm(newFormData); // Update parent form state
    
    // Real-time validation - validate the specific field being changed
    validateField(e.target.name, e.target.value);
  };

  const validateField = (fieldName, value) => {
    let newErrors = { ...errors };
    
    switch (fieldName) {
      case 'name':
        if (!value.trim()) {
          newErrors.name = "Product name is required";
        } else if (value.trim().length > 100) {
          newErrors.name = "Product name cannot exceed 100 characters";
        } else {
          delete newErrors.name;
        }
        break;
        
      case 'price':
        if (!value) {
          newErrors.price = "Price is required";
        } else if (isNaN(value) || Number(value) <= 0) {
          newErrors.price = "Price must be a positive number";
        } else {
          delete newErrors.price;
        }
        break;

      case 'description':
        if (!value.trim()) {
          newErrors.description = "Description is required";
        } else if (value.trim().length > 500) {
          newErrors.description = "Description cannot exceed 500 characters";
        } else {
          delete newErrors.description;
        }
        break;

      case 'category':
        if (!value) {
          newErrors.category = "Category is required";
        } else if (!categories.includes(value)) {
          newErrors.category = "Please select a valid category";
        } else {
          delete newErrors.category;
        }
        break;
        
      default:
        break;
    }
    
    setErrors(newErrors);
  };

  const validate = () => {
    let newErrors = {};

    if (!formData.name.trim()) {
      newErrors.name = "Product name is required";
    } else if (formData.name.trim().length > 100) {
      newErrors.name = "Product name cannot exceed 100 characters";
    }

    if (!formData.price) {
      newErrors.price = "Price is required";
    } else if (isNaN(formData.price) || Number(formData.price) <= 0) {
      newErrors.price = "Price must be a positive number";
    }

    if (!formData.description.trim()) {
      newErrors.description = "Description is required";
    } else if (formData.description.trim().length > 500) {
      newErrors.description = "Description cannot exceed 500 characters";
    }

    if (!formData.category) {
      newErrors.category = "Category is required";
    } else if (!categories.includes(formData.category)) {
      newErrors.category = "Please select a valid category";
    }

    // REMOVED date validation since date field is not required

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleFormSubmit = (e) => {
    e.preventDefault();
    if (validate()) {
      handleSubmit(e);
    }
  };

  return (
    <form onSubmit={handleFormSubmit}>
      <div className="form-group">
        <label className="form-label">
          Product Name:
        </label>
        <input
          type="text"
          name="name"
          value={formData.name}
          onChange={handleChange}
          className={`form-input ${errors.name ? 'error' : ''}`}
          placeholder="Enter product name"
          maxLength="100"
        />
        {errors.name && (
          <p className="form-error-message">
            {errors.name}
          </p>
        )}
      </div>

      <div className="form-group">
        <label className="form-label">
          Price:
        </label>
        <input
          type="number"
          name="price"
          value={formData.price}
          onChange={handleChange}
          className={`form-input ${errors.price ? 'error' : ''}`}
          placeholder="Enter price"
          min="0"
          step="0.01"
        />
        {errors.price && (
          <p className="form-error-message">
            {errors.price}
          </p>
        )}
      </div>

      <div className="form-group">
        <label className="form-label">
          Description:
        </label>
        <textarea
          name="description"
          value={formData.description}
          onChange={handleChange}
          className={`form-input ${errors.description ? 'error' : ''}`}
          placeholder="Enter product description"
          rows="4"
          maxLength="500"
        />
        <div className="character-count">
          {formData.description.length}/500 characters
        </div>
        {errors.description && (
          <p className="form-error-message">
            {errors.description}
          </p>
        )}
      </div>

      <div className="form-group">
        <label className="form-label">
          Category:
        </label>
        <select
          name="category"
          value={formData.category}
          onChange={handleChange}
          className={`form-input ${errors.category ? 'error' : ''}`}
        >
          <option value="">Select a category</option>
          {categories.map((category) => (
            <option key={category} value={category}>
              {category}
            </option>
          ))}
        </select>
        {errors.category && (
          <p className="form-error-message">
            {errors.category}
          </p>
        )}
      </div>

      <button type="submit" className="form-submit">
        {buttonText}
      </button>
    </form>
  );
}
