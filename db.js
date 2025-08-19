// db.js
const mongoose = require('mongoose');
require('dotenv').config();

const connectDB = async () => {
  try {
    await mongoose.connect(process.env.MONGO_URI, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
      serverSelectionTimeoutMS: 5000,
      socketTimeoutMS: 45000,
      tls: true,
      dbName: "ecommerce"
    });

    console.log('✅ [DB] Secure MongoDB Connected');
  } catch (err) {
    console.error('❌ [DB] Connection Error:', err.message);
    process.exit(1);
  }
};

module.exports = connectDB;

