const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const dotenv = require('dotenv');
const authRoutes = require('./routes/auth');

dotenv.config();

const app = express();

// Middleware
app.use(cors());
app.use(express.json());

// Test route to check if server is running
app.get('/', (req, res) => {
    res.json({ message: 'Ramadan Kareem API is running!' });
});

// MongoDB connection - FIXED VERSION
const MONGODB_URI = process.env.MONGODB_URI || 'mongodb://127.0.0.1:27017/ramadan-website';

mongoose.connect(MONGODB_URI)
.then(() => {
    console.log('✅ Connected to MongoDB successfully');
    console.log(`📦 Database: ramadan-website`);
})
.catch(err => {
    console.error('❌ MongoDB connection error:', err.message);
    console.log('💡 Troubleshooting tips:');
    console.log('   1. Make sure MongoDB is installed');
    console.log('   2. Run: "C:\\Program Files\\MongoDB\\Server\\6.0\\bin\\mongod.exe" --dbpath=C:\\data\\db');
    console.log('   3. Check if MongoDB service is running');
});

// Routes
app.use('/api/auth', authRoutes);

// Error handling middleware
app.use((err, req, res, next) => {
    console.error('❌ Server error:', err.stack);
    res.status(500).json({ 
        message: 'Something went wrong!',
        error: process.env.NODE_ENV === 'development' ? err.message : {}
    });
});

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
    console.log(`🚀 Server running on port ${PORT}`);
    console.log(`📍 Local: http://localhost:${PORT}`);
});