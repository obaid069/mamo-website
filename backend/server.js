const express = require('express');
const mongoose = require('mongoose');
const dotenv = require('dotenv');
const cors = require('cors');
const path = require('path');

// Load environment variables
dotenv.config();

const app = express();

// Middleware
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Static files for uploads
app.use('/uploads', express.static(path.join(__dirname, 'uploads')));

// Connect to MongoDB with additional options and fallback
const connectDB = async (retryCount = 0) => {
  const maxRetries = 3;
  
  try {
    console.log(`🔄 Attempting MongoDB connection (attempt ${retryCount + 1}/${maxRetries + 1})...`);
    
    const conn = await mongoose.connect(process.env.MONGO_URI, {
      serverSelectionTimeoutMS: 15000, // 15 seconds
      socketTimeoutMS: 45000, // 45 seconds
      family: 4, // Force IPv4
    });
    
    console.log('✅ MongoDB connected successfully');
    console.log(`📍 Connected to: ${conn.connection.host}`);
    console.log(`🔢 Database: ${conn.connection.name}`);
    
  } catch (error) {
    console.error('❌ MongoDB connection error:', error.message);
    
    if (retryCount < maxRetries) {
      console.log(`🔄 Retrying connection in ${(retryCount + 1) * 2} seconds...`);
      setTimeout(() => connectDB(retryCount + 1), (retryCount + 1) * 2000);
    } else {
      console.log('\n🚫 MongoDB connection failed after multiple attempts.');
      console.log('📋 Troubleshooting steps:');
      console.log('   1. Check your internet connection');
      console.log('   2. Verify MongoDB Atlas cluster is running');
      console.log('   3. Check if your IP address is whitelisted in MongoDB Atlas');
      console.log('   4. Try using a VPN or different network');
      console.log('   5. Contact your network administrator about DNS issues');
      console.log('\n⚠️  Server will continue running without database connection.');
      console.log('   Some features may not work properly.');
    }
  }
};

connectDB();

// Routes
app.use('/api/auth', require('./routes/auth'));
app.use('/api/users', require('./routes/users'));
app.use('/api/products', require('./routes/products'));
app.use('/api/orders', require('./routes/orders'));
app.use('/api/categories', require('./routes/categories'));

// Error handling middleware
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).json({ message: 'Something went wrong!' });
});

const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
