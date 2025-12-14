
const mongoose = require('mongoose');

const productSchema = new mongoose.Schema({
  name: {
    type: String,
    required: [true, 'Product name is required'],
    trim: true,
    maxlength: [100, 'Product name cannot exceed 100 characters']
  },
  price: {
    type: Number,
    required: [true, 'Price is required'],
    min: [0.01, 'Price must be greater than 0']
  },
  description: {
    type: String,
    required: [true, 'Description is required'],
    trim: true,
    maxlength: [500, 'Description cannot exceed 500 characters']
  },
  category: {
    type: String,
    required: [true, 'Category is required'],
    enum: {
      values: [
        'Electronics', 'Clothing', 'Books', 'Home & Garden', 'Sports', 'Toys',
        'Furniture', 'Appliances', 'Groceries', 'Beauty', 'Automotive', 'Accessories',
        'Footwear', 'Jewelry', 'Health', 'Pet Supplies', 'Music', 'Gaming', 'Office',
        'Kitchen', 'Garden', 'Tools', 'Baby', 'Outdoor', 'Art', 'Photography', 'Other'
      ],
      message: 'Category must be one of the supported categories'
    }
  },
  date: {
    type: Date,
    default: Date.now
  }
}, {
  timestamps: true
});

// Create indexes for better query performance
productSchema.index({ name: 'text', description: 'text' });
productSchema.index({ category: 1 });
productSchema.index({ price: 1 });
productSchema.index({ date: -1 });

module.exports = mongoose.model('Product', productSchema);
