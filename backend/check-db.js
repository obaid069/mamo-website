const mongoose = require('mongoose');
const Product = require('./models/Product');
const Category = require('./models/Category');
const User = require('./models/User');
require('dotenv').config();

const checkDatabase = async () => {
  try {
    await mongoose.connect(process.env.MONGO_URI);
    console.log('✅ MongoDB Connected');
    
    // Check products
    const products = await Product.find({});
    console.log(`📦 Total Products in DB: ${products.length}`);
    
    if (products.length > 0) {
      console.log('\n📋 Products List:');
      products.forEach((product, index) => {
        console.log(`${index + 1}. ${product.name} - $${product.price}`);
      });
    } else {
      console.log('❌ No products found in database!');
    }
    
    // Check categories
    const categories = await Category.find({});
    console.log(`\n📂 Total Categories: ${categories.length}`);
    
    if (categories.length > 0) {
      console.log('\n📋 Categories List:');
      categories.forEach((cat, index) => {
        console.log(`${index + 1}. ${cat.name} (ID: ${cat._id})`);
      });
    } else {
      console.log('❌ No categories found in database!');
    }
    
    // Check admin user
    const admin = await User.findOne({ role: 'admin' });
    console.log(`\n👤 Admin User: ${admin ? 'Found' : 'Not Found'}`);
    if (admin) {
      console.log(`   Email: ${admin.email}`);
      console.log(`   Name: ${admin.name}`);
    }
    
    process.exit(0);
  } catch (error) {
    console.error('❌ Error:', error);
    process.exit(1);
  }
};

checkDatabase();
