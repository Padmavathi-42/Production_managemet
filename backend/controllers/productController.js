const Product = require('../models/Product');
const mongoose = require('mongoose');
const { sendResponse } = require('../utils/responseHelper');

// @desc    Get all products with optional filtering and sorting
// @route   GET /api/products
// @access  Public
const getAllProducts = async (req, res) => {
  try {
    const { search, category, sort } = req.query;
    let query = {};

    // Search functionality
    if (search) {
      query.name = { $regex: search, $options: 'i' };
    }

    // Category filter
    if (category && category !== 'all') {
      query.category = category;
    }

    let products = await Product.find(query);

    // Sorting
    if (sort === 'name') {
      products.sort((a, b) => a.name.localeCompare(b.name));
    } else if (sort === 'price-low') {
      products.sort((a, b) => a.price - b.price);
    } else if (sort === 'price-high') {
      products.sort((a, b) => b.price - a.price);
    } else if (sort === 'date') {
      products.sort((a, b) => new Date(b.date) - new Date(a.date));
    } else {
      // Default sort by creation date (newest first)
      products.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));
    }

    sendResponse(res, 200, products, `Found ${products.length} products`);
  } catch (error) {
    console.error('Error fetching products:', error);
    sendResponse(res, 500, null, 'Failed to fetch products');
  }
};

// @desc    Get single product by ID
// @route   GET /api/products/:id
// @access  Public
const getProductById = async (req, res) => {
  try {
    const { id } = req.params;

    if (!mongoose.Types.ObjectId.isValid(id)) {
      return sendResponse(res, 400, null, 'Invalid product ID');
    }

    const product = await Product.findById(id);
    
    if (!product) {
      return sendResponse(res, 404, null, 'Product not found');
    }

    sendResponse(res, 200, product, 'Product retrieved successfully');
  } catch (error) {
    console.error('Error fetching product:', error);
    sendResponse(res, 500, null, 'Failed to fetch product');
  }
};

// @desc    Create new product
// @route   POST /api/products
// @access  Public
const createProduct = async (req, res) => {
  try {
    const { name, price, description, category, date } = req.body;

    // Log received data for debugging
    console.log('=== CREATE PRODUCT DEBUG ===');
    console.log('Received product data:', { name, price, description, category, date });
    console.log('Request headers:', req.headers);
    console.log('Request body type:', typeof req.body);

    // Basic validation
    if (!name || !name.trim()) {
      console.log('Validation failed: Name is required');
      return sendResponse(res, 400, null, 'Product name is required');
    }

    if (!price || Number(price) <= 0) {
      console.log('Validation failed: Invalid price');
      return sendResponse(res, 400, null, 'Price must be a positive number');
    }

    if (!description || !description.trim()) {
      console.log('Validation failed: Description is required');
      return sendResponse(res, 400, null, 'Description is required');
    }

    if (!category) {
      console.log('Validation failed: Category is required');
      return sendResponse(res, 400, null, 'Category is required');
    }

    // Validate category against allowed values
    const allowedCategories = [
      'Electronics', 'Clothing', 'Books', 'Home & Garden', 'Sports', 'Toys',
      'Furniture', 'Appliances', 'Groceries', 'Beauty', 'Automotive', 'Accessories',
      'Footwear', 'Jewelry', 'Health', 'Pet Supplies', 'Music', 'Gaming', 'Office',
      'Kitchen', 'Garden', 'Tools', 'Baby', 'Outdoor', 'Art', 'Photography', 'Other'
    ];

    if (!allowedCategories.includes(category)) {
      console.log('Validation failed: Invalid category:', category);
      return sendResponse(res, 400, null, `Invalid category. Allowed categories: ${allowedCategories.join(', ')}`);
    }

    // Create product data
    const productData = {
      name: name.trim(),
      price: Number(price),
      description: description.trim(),
      category,
      date: date ? new Date(date) : new Date()
    };

    console.log('Creating product with data:', productData);

    const newProduct = new Product(productData);
    const savedProduct = await newProduct.save();
    
    console.log('Product saved successfully:', savedProduct);
    console.log('=== END DEBUG ===');
    
    sendResponse(res, 201, savedProduct, 'Product created successfully');
  } catch (error) {
    console.error('Error creating product:', error);
    console.error('Error details:', error.message);
    console.error('Error stack:', error.stack);
    
    if (error.name === 'ValidationError') {
      const errors = Object.values(error.errors).map(err => err.message);
      console.log('Mongoose validation errors:', errors);
      return sendResponse(res, 400, null, errors.join(', '));
    }

    if (error.code === 11000) {
      console.log('Duplicate key error:', error.keyValue);
      return sendResponse(res, 400, null, 'Product with this name already exists');
    }
    
    sendResponse(res, 500, null, 'Failed to create product');
  }
};

// @desc    Update existing product
// @route   PUT /api/products/:id
// @access  Public
const updateProduct = async (req, res) => {
  try {
    const { id } = req.params;
    const { name, price, description, category, date } = req.body;

    console.log('=== UPDATE PRODUCT DEBUG ===');
    console.log('Product ID:', id);
    console.log('Update data:', { name, price, description, category, date });

    if (!mongoose.Types.ObjectId.isValid(id)) {
      return sendResponse(res, 400, null, 'Invalid product ID');
    }

    // Basic validation
    if (!name || !name.trim()) {
      return sendResponse(res, 400, null, 'Product name is required');
    }

    if (!price || Number(price) <= 0) {
      return sendResponse(res, 400, null, 'Price must be a positive number');
    }

    if (!description || !description.trim()) {
      return sendResponse(res, 400, null, 'Description is required');
    }

    if (!category) {
      return sendResponse(res, 400, null, 'Category is required');
    }

    // Validate category
    const allowedCategories = [
      'Electronics', 'Clothing', 'Books', 'Home & Garden', 'Sports', 'Toys',
      'Furniture', 'Appliances', 'Groceries', 'Beauty', 'Automotive', 'Accessories',
      'Footwear', 'Jewelry', 'Health', 'Pet Supplies', 'Music', 'Gaming', 'Office',
      'Kitchen', 'Garden', 'Tools', 'Baby', 'Outdoor', 'Art', 'Photography', 'Other'
    ];

    if (!allowedCategories.includes(category)) {
      return sendResponse(res, 400, null, `Invalid category. Allowed categories: ${allowedCategories.join(', ')}`);
    }

    const updateData = {
      name: name.trim(),
      price: Number(price),
      description: description.trim(),
      category,
      date: date ? new Date(date) : undefined
    };

    // Remove undefined values
    Object.keys(updateData).forEach(key => 
      updateData[key] === undefined && delete updateData[key]
    );

    console.log('Updating with data:', updateData);

    const updatedProduct = await Product.findByIdAndUpdate(
      id,
      updateData,
      { new: true, runValidators: true }
    );

    if (!updatedProduct) {
      return sendResponse(res, 404, null, 'Product not found');
    }

    console.log('Product updated successfully:', updatedProduct);
    console.log('=== END UPDATE DEBUG ===');

    sendResponse(res, 200, updatedProduct, 'Product updated successfully');
  } catch (error) {
    console.error('Error updating product:', error);
    
    if (error.name === 'ValidationError') {
      const errors = Object.values(error.errors).map(err => err.message);
      return sendResponse(res, 400, null, errors.join(', '));
    }

    if (error.code === 11000) {
      return sendResponse(res, 400, null, 'Product with this name already exists');
    }
    
    sendResponse(res, 500, null, 'Failed to update product');
  }
};

// @desc    Delete product
// @route   DELETE /api/products/:id
// @access  Public
const deleteProduct = async (req, res) => {
  try {
    const { id } = req.params;

    console.log('=== DELETE PRODUCT DEBUG ===');
    console.log('Deleting product ID:', id);

    if (!mongoose.Types.ObjectId.isValid(id)) {
      return sendResponse(res, 400, null, 'Invalid product ID');
    }

    const deletedProduct = await Product.findByIdAndDelete(id);
    
    if (!deletedProduct) {
      return sendResponse(res, 404, null, 'Product not found');
    }

    console.log('Product deleted successfully:', deletedProduct.name);
    console.log('=== END DELETE DEBUG ===');

    sendResponse(res, 200, deletedProduct, 'Product deleted successfully');
  } catch (error) {
    console.error('Error deleting product:', error);
    sendResponse(res, 500, null, 'Failed to delete product');
  }
};

// @desc    Get available categories
// @route   GET /api/products/categories
// @access  Public
const getCategories = (req, res) => {
  const categories = [
    'Electronics', 'Clothing', 'Books', 'Home & Garden', 'Sports', 'Toys',
    'Furniture', 'Appliances', 'Groceries', 'Beauty', 'Automotive', 'Accessories',
    'Footwear', 'Jewelry', 'Health', 'Pet Supplies', 'Music', 'Gaming', 'Office',
    'Kitchen', 'Garden', 'Tools', 'Baby', 'Outdoor', 'Art', 'Photography', 'Other'
  ];
  sendResponse(res, 200, categories, 'Categories retrieved successfully');
};

// @desc    Health check
// @route   GET /api/health
// @access  Public
const healthCheck = (req, res) => {
  sendResponse(res, 200, { 
    status: 'Server is running', 
    timestamp: new Date().toISOString(),
    database: mongoose.connection.readyState === 1 ? 'Connected' : 'Disconnected'
  }, 'API is healthy');
};

module.exports = {
  getAllProducts,
  getProductById,
  createProduct,
  updateProduct,
  deleteProduct,
  getCategories,
  healthCheck
};
