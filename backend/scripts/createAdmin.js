require('dotenv').config();
const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');
const userModel = require('../models/userModel');
const connectdb = require('../config/db');

const createAdminUser = async () => {
  try {
    // Connect to database
    await connectdb();
    console.log('Connected to database');

    // Admin user data
    const adminData = {
      name: 'Admin User',
      email: 'admin@smartmart.com',
      password: 'admin123',
      role: 'ADMIN',
      isActive: true
    };

    // Check if admin already exists
    const existingAdmin = await userModel.findOne({ email: adminData.email });
    if (existingAdmin) {
      console.log('Admin user already exists with email:', adminData.email);
      console.log('Admin details:');
      console.log('Email:', adminData.email);
      console.log('Password: admin123');
      process.exit(0);
    }

    // Hash password
    const hashedPassword = await bcrypt.hash(adminData.password, 10);

    // Create admin user
    const adminUser = new userModel({
      ...adminData,
      password: hashedPassword
    });

    await adminUser.save();

    console.log('✅ Admin user created successfully!');
    console.log('📧 Email:', adminData.email);
    console.log('🔑 Password:', adminData.password);
    console.log('👤 Role:', adminData.role);
    console.log('\nYou can now login to the admin panel with these credentials.');
    
    process.exit(0);
  } catch (error) {
    console.error('❌ Error creating admin user:', error.message);
    process.exit(1);
  }
};

// Run the script
createAdminUser();