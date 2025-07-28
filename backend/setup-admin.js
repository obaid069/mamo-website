const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');
const User = require('./models/User');
const path = require('path');
require('dotenv').config({ path: path.join(__dirname, '.env') });

const setupAdmin = async () => {
  try {
    await mongoose.connect(process.env.MONGO_URI);
    console.log('✅ Connected to MongoDB');

    // Delete existing admin if exists
    await User.deleteMany({ email: 'admin@aicosmetics.com' });
    console.log('🗑️ Removed any existing admin users');

    // Create new admin user with the desired password
    // Let the User model's pre-save middleware handle the hashing
    const admin = await User.create({
      name: 'Admin User',
      email: 'admin@aicosmetics.com',
      password: '!AI_Cosmetics@786', // Plain text - will be hashed by pre-save middleware
      role: 'admin',
      isVerified: true
    });
    
    console.log('✅ Admin user created successfully!');
    console.log('📧 Email: admin@aicosmetics.com');
    console.log('🔑 Password: !AI_Cosmetics@786');
    
    // Test login
    const testAdmin = await User.findOne({ email: 'admin@aicosmetics.com' });
    const isMatch = await testAdmin.matchPassword('!AI_Cosmetics@786');
    
    if (isMatch) {
      console.log('✅ Password verification successful!');
    } else {
      console.log('❌ Password verification failed!');
    }
    
  } catch (error) {
    console.error('❌ Error:', error);
  } finally {
    process.exit(0);
  }
};

setupAdmin();
