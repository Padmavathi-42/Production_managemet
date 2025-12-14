const express = require('express');
const cors = require('cors');
require('dotenv').config();

const connectDB = require('./config/database');
const productRoutes = require('./routes/productRoutes');
const { errorHandler, notFoundHandler } = require('./middleware/errorMiddleware');

const app = express();
const PORT = process.env.PORT || 5000;

// Connect to MongoDB
connectDB();

// Enhanced CORS configuration
app.use(cors({
  origin: [
    'http://localhost:3000', 
    'http://localhost:5173',
    'http://127.0.0.1:3000',
    'http://127.0.0.1:5173'
  ], 
  credentials: true,
  optionsSuccessStatus: 200,
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization', 'X-Requested-With']
}));

// Body parsing middleware with increased limit
app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true, limit: '10mb' }));

// Add request logging for debugging
app.use((req, res, next) => {
  console.log(`\n🚀 ${new Date().toISOString()} - ${req.method} ${req.originalUrl}`);
  console.log('📋 Headers:', JSON.stringify(req.headers, null, 2));
  if (req.body && Object.keys(req.body).length > 0) {
    console.log('📦 Body:', JSON.stringify(req.body, null, 2));
  }
  next();
});

// Test route
app.get('/', (req, res) => {
  res.json({ 
    message: 'Product Manager API is running!',
    timestamp: new Date().toISOString(),
    endpoints: {
      products: '/api/products',
      health: '/api/health',
      categories: '/api/products/categories'
    }
  });
});

// Routes
app.use('/api', productRoutes);

// Error handling middleware (must be last)
app.use(notFoundHandler);
app.use(errorHandler);

// Graceful shutdown
process.on('SIGINT', async () => {
  console.log('\n🔄 Shutting down gracefully...');
  const mongoose = require('mongoose');
  await mongoose.connection.close();
  console.log('✅ MongoDB connection closed');
  process.exit(0);
});

// Enhanced error handling for uncaught exceptions
process.on('uncaughtException', (err) => {
  console.error('💥 Uncaught Exception:', err);
  process.exit(1);
});

process.on('unhandledRejection', (err) => {
  console.error('💥 Unhandled Rejection:', err);
  process.exit(1);
});

app.listen(PORT, () => {
  console.log('🚀'.repeat(50));
  console.log(`🚀 Server running on http://localhost:${PORT}`);
  console.log(`📚 API Documentation: http://localhost:${PORT}/api/products`);
  console.log(`🏥 Health Check: http://localhost:${PORT}/api/health`);
  console.log(`🗂️ Categories: http://localhost:${PORT}/api/products/categories`);
  console.log('🚀'.repeat(50));
});

module.exports = app;
