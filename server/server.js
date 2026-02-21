const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const dotenv = require('dotenv');

// Import routes
const authRoutes = require('./routes/auth');
const userRoutes = require('./routes/users');
const prayerRoutes = require('./routes/prayers');
const duaRoutes = require('./routes/duas');
const hadithRoutes = require('./routes/hadiths');

dotenv.config();

const app = express();

// Middleware
app.use(cors({
    origin: 'http://localhost:3000',
    credentials: true
}));
app.use(express.json());

// Test route
app.get('/', (req, res) => {
    res.json({ 
        message: 'Ramadan Kareem API is running!',
        endpoints: {
            auth: '/api/auth',
            users: '/api/users',
            prayers: '/api/prayers',
            duas: '/api/duas',
            hadiths: '/api/hadiths'
        }
    });
});

// Routes
app.use('/api/auth', authRoutes);
app.use('/api/users', userRoutes);
app.use('/api/prayers', prayerRoutes);
app.use('/api/duas', duaRoutes);
app.use('/api/hadiths', hadithRoutes);

// MongoDB connection
const MONGODB_URI = process.env.MONGODB_URI || 'mongodb://127.0.0.1:27017/ramadan-website';

mongoose.connect(MONGODB_URI)
.then(() => {
    console.log('✅ Connected to MongoDB successfully');
    console.log('📦 Database:', MONGODB_URI.split('/').pop());
})
.catch(err => {
    console.error('❌ MongoDB connection error:', err.message);
    console.log('💡 Make sure MongoDB is running on:', MONGODB_URI);
});

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
    console.log(`🚀 Server running on http://localhost:${PORT}`);
    console.log(`📝 Test the API at http://localhost:${PORT}/`);
});
