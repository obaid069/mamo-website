const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');
const User = require('./models/User');
require('dotenv').config();

const fixAdminPassword = async () => {
  try {
    await mongoose.connect(process.env.MONGO_URI);
    console.log('Connected to MongoDB');

    // Find admin user
    let admin = await User.findOne({ email: 'admin@aicosmetics.com' });
    
    if (!admin) {
      console.log('❌ Admin user not found. Creating new admin...');
      
      // Create new admin user
      admin = await User.create({
        name: 'Admin User',
        email: 'admin@aicosmetics.com',
        password: 'admin123',
        role: 'admin'
      });
      
      console.log('✅ New admin user created');
    } else {
      console.log('✅ Admin user found. Updating password...');
      
      // Update password directly using bcrypt
      const salt = await bcrypt.genSalt(10);
      const hashedPassword = await bcrypt.hash('admin123', salt);
      
      await User.findByIdAndUpdate(admin._id, { 
        password: hashedPassword 
      });
      
      console.log('✅ Admin password updated');
    }

    // Test the login again
    const updatedAdmin = await User.findOne({ email: 'admin@aicosmetics.com' });
    const isMatch = await updatedAdmin.matchPassword('admin123');
    
    if (isMatch) {
      console.log('✅ Login test successful! Admin can now login with:');
      console.log('Email: admin@aicosmetics.com');
      console.log('Password: admin123');
    } else {
      console.log('❌ Still having issues with password matching');
    }

  } catch (error) {
    console.error('Error:', error);
  } finally {
    process.exit(0);
  }
};

fixAdminPassword();
