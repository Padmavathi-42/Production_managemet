const express = require('express');
const {
  getAllProducts,
  getProductById,
  createProduct,
  updateProduct,
  deleteProduct,
  getCategories,
  healthCheck
} = require('../controllers/productController');
const { validateProduct, validateObjectId } = require('../middleware/validationMiddleware');

const router = express.Router();

// Add request logging middleware for debugging
const requestLogger = (req, res, next) => {
  console.log(`\n=== ${new Date().toISOString()} ===`);
  console.log(`${req.method} ${req.originalUrl}`);
  console.log('Headers:', req.headers);
  console.log('Body:', req.body);
  console.log('Query:', req.query);
  console.log('Params:', req.params);
  console.log('=================\n');
  next();
};

// Apply logging to all routes
router.use(requestLogger);

// Health check route
router.get('/health', healthCheck);

// Categories route (must be before /:id route to avoid conflicts)
router.get('/products/categories', getCategories);

// Product routes
router.route('/products')
  .get(getAllProducts)                              // GET /api/products
  .post(createProduct);                             // POST /api/products (removed validation middleware to debug)

router.route('/products/:id')
  .get(validateObjectId, getProductById)            // GET /api/products/:id
  .put(validateObjectId, updateProduct)             // PUT /api/products/:id (removed validation middleware to debug)
  .delete(validateObjectId, deleteProduct);         // DELETE /api/products/:id

module.exports = router;
