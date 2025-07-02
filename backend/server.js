const express = require('express');
const dotenv = require('dotenv');
const cors = require('cors');

const authRoutes = require('./routes/auth');
const productRoutes = require('./routes/products');
const cartRoutes = require('./routes/cart');
const orderRoutes = require('./routes/orders');
const contactRoutes = require('./routes/contact');

dotenv.config();

const app = express();
const PORT = process.env.PORT || 5000;

// 🔐 Enable CORS for frontend (React or other)
app.use(cors({
  origin: process.env.FRONTEND_URL,
  credentials: true
}));

// 🛠️ Middleware
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// 📦 API Routes
app.use('/api/auth', authRoutes);
app.use('/api/products', productRoutes);
app.use('/api/cart', cartRoutes);
app.use('/api/orders', orderRoutes);
app.use('/api/contact', contactRoutes);

// ✅ Health Check Route
app.get('/api/health', (req, res) => {
  res.json({ status: 'OK', message: 'Server is running' });
});

// ❌ 500 Error Handler
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).json({ 
    error: 'Something went wrong!',
    message: process.env.NODE_ENV === 'development' ? err.message : 'Internal server error'
  });
});

// ❌ 404 Handler
app.use('*', (req, res) => {
  res.status(404).json({ error: 'Route not found' });
});

// 🚀 Start Server
app.listen(PORT, () => {
  console.log(`🚀 Server is running on port ${PORT}`);
  console.log(`✅ Health check: http://localhost:${PORT}/api/health`);
});
