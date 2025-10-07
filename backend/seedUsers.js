const mongoose = require('mongoose');
const User = require('./models/User');
require('dotenv').config();

const seedUsers = async () => {
  try {
    // Connect to MongoDB
    await mongoose.connect(process.env.MONGODB_URI || 'mongodb://localhost:27017/excel-analytics');
    console.log('✅ Connected to MongoDB');

    // Clear existing demo users
    await User.deleteMany({ 
      email: { $in: ['admin@demo.com', 'user@demo.com'] } 
    });
    console.log('🗑️  Cleared existing demo users');

    // Create admin user
    const adminUser = new User({
      username: 'Admin User',
      email: 'admin@demo.com',
      password: 'admin123', // Will be hashed by pre-save middleware
      isAdmin: true
    });
    await adminUser.save();
    console.log('👑 Created admin user: admin@demo.com / admin123');

    // Create regular user
    const regularUser = new User({
      username: 'Demo User',
      email: 'user@demo.com',
      password: 'user123', // Will be hashed by pre-save middleware
      isAdmin: false
    });
    await regularUser.save();
    console.log('👤 Created demo user: user@demo.com / user123');

    console.log('\n🎉 Demo users created successfully!');
    console.log('\n📝 Login Credentials:');
    console.log('   Admin: admin@demo.com / admin123');
    console.log('   User:  user@demo.com / user123');
    
    process.exit(0);
  } catch (error) {
    console.error('❌ Error seeding users:', error);
    process.exit(1);
  }
};

if (require.main === module) {
  seedUsers();
}

module.exports = { seedUsers };