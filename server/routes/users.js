const express = require('express');
const router = express.Router();
const User = require('../models/User');
const auth = require('../middleware/auth');

// Get user profile
router.get('/profile', auth, async (req, res) => {
    try {
        const user = await User.findById(req.userId).select('-password');
        res.json(user);
    } catch (error) {
        res.status(500).json({ message: 'Server error' });
    }
});

// Update user goals
router.post('/goals', auth, async (req, res) => {
    try {
        const { quranPages, prayers, charity, goodDeeds } = req.body;
        const user = await User.findById(req.userId);
        
        user.ramadanGoals = { quranPages, prayers, charity, goodDeeds };
        await user.save();
        
        res.json(user.ramadanGoals);
    } catch (error) {
        res.status(500).json({ message: 'Server error' });
    }
});

// Save checklist
router.post('/checklist', auth, async (req, res) => {
    try {
        const user = await User.findById(req.userId);
        user.dailyChecklist = req.body;
        await user.save();
        res.json({ message: 'Checklist saved' });
    } catch (error) {
        res.status(500).json({ message: 'Server error' });
    }
});

// Get checklist
router.get('/checklist', auth, async (req, res) => {
    try {
        const user = await User.findById(req.userId);
        res.json(user.dailyChecklist || {});
    } catch (error) {
        res.status(500).json({ message: 'Server error' });
    }
});

// Save tasbeeh count
router.post('/tasbeeh', auth, async (req, res) => {
    try {
        const { name, count } = req.body;
        const user = await User.findById(req.userId);
        
        user.tasbeehCounts.push({ name, count });
        await user.save();
        
        res.json({ message: 'Tasbeeh saved' });
    } catch (error) {
        res.status(500).json({ message: 'Server error' });
    }
});

module.exports = router;
