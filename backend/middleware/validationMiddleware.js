const { sendValidationError } = require('../utils/responseHelper');

// Validate product data
const validateProduct = (req, res, next) => {
  console.log('=== VALIDATION MIDDLEWARE ===');
  console.log('Validating product data:', req.body);
  
  const { name, price, description, category } = req.body;
  const errors = [];

  // Name validation
  if (!name || !name.trim()) {
    errors.push('Product name is required');
  } else if (name.trim().length > 100) {
    errors.push('Product name cannot exceed 100 characters');
  }

  // Price validation
  if (!price) {
    errors.push('Price is required');
  } else if (isNaN(price) || Number(price) <= 0) {
    errors.push('Price must be a positive number');
  }

  // Description validation
  if (!description || !description.trim()) {
    errors.push('Description is required');
  } else if (description.trim().length > 500) {
    errors.push('Description cannot exceed 500 characters');
  }

  // Category validation - Match frontend categories exactly
  const validCategories = [
    'Electronics', 'Clothing', 'Books', 'Home & Garden', 'Sports', 'Toys',
    'Furniture', 'Appliances', 'Groceries', 'Beauty', 'Automotive', 'Accessories',
    'Footwear', 'Jewelry', 'Health', 'Pet Supplies', 'Music', 'Gaming', 'Office',
    'Kitchen', 'Garden', 'Tools', 'Baby', 'Outdoor', 'Art', 'Photography', 'Other'
  ];
  
  if (!category) {
    errors.push('Category is required');
  } else if (!validCategories.includes(category)) {
    errors.push(`Please select a valid category. Valid categories: ${validCategories.join(', ')}`);
  }

  console.log('Validation errors:', errors);

  // If there are validation errors, return them
  if (errors.length > 0) {
    console.log('Validation failed, returning errors');
    return sendValidationError(res, errors);
  }

  // Sanitize data
  req.body.name = name.trim();
  req.body.price = Number(price);
  req.body.description = description.trim();

  console.log('Validation passed, sanitized data:', req.body);
  console.log('=== END VALIDATION ===');

  next();
};

// Validate MongoDB ObjectId
const validateObjectId = (req, res, next) => {
  const mongoose = require('mongoose');
  const { id } = req.params;

  console.log('=== VALIDATING OBJECT ID ===');
  console.log('ID to validate:', id);

  if (!mongoose.Types.ObjectId.isValid(id)) {
    console.log('Invalid ObjectId format');
    return sendValidationError(res, ['Invalid product ID format']);
  }

  console.log('ObjectId validation passed');
  console.log('=== END OBJECT ID VALIDATION ===');

  next();
};

module.exports = {
  validateProduct,
  validateObjectId
};
