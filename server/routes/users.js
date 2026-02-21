const express = require('express');
const router = express.Router();
const User = require('../models/User');
const auth = require('../middleware/auth');

// Get user profile
router.get('/profile', auth, async (req, res) => {
    try {
        console.log('Fetching profile for user:', req.userId);
        const user = await User.findById(req.userId).select('-password');
        
        if (!user) {
            console.log('User not found:', req.userId);
            return res.status(404).json({ message: 'User not found' });
        }
        
        console.log('User found:', user.email);
        res.json(user);
    } catch (error) {
        console.error('Profile error:', error);
        res.status(500).json({ message: 'Server error', error: error.message });
    }
});

// Update user goals
router.post('/goals', auth, async (req, res) => {
    try {
        const { quranPages, prayers, charity, goodDeeds } = req.body;
        const user = await User.findById(req.userId);
        
        if (!user) {
            return res.status(404).json({ message: 'User not found' });
        }
        
        user.ramadanGoals = { 
            quranPages: quranPages || 0, 
            prayers: prayers || 0, 
            charity: charity || 0, 
            goodDeeds: goodDeeds || 0 
        };
        
        await user.save();
        
        res.json({ 
            message: 'Goals updated successfully',
            goals: user.ramadanGoals 
        });
    } catch (error) {
        console.error('Goals update error:', error);
        res.status(500).json({ message: 'Server error' });
    }
});

// Save full checklist (for 30-day planner)
router.post('/checklist', auth, async (req, res) => {
    try {
        console.log('Saving full checklist for user:', req.userId);
        const checklistData = req.body; // This should be an object with day numbers as keys
        
        const user = await User.findById(req.userId);
        if (!user) {
            return res.status(404).json({ message: 'User not found' });
        }
        
        // Convert the day-number keys to actual dates and store
        // This assumes day 1 = March 10, 2024 (first day of Ramadan)
        const baseDate = new Date('2024-03-10');
        const newChecklist = [];
        
        Object.keys(checklistData).forEach(dayKey => {
            const day = parseInt(dayKey);
            if (!isNaN(day) && day >= 1 && day <= 30) {
                const date = new Date(baseDate);
                date.setDate(baseDate.getDate() + (day - 1));
                date.setHours(0, 0, 0, 0);
                
                newChecklist.push({
                    date: date,
                    completed: checklistData[dayKey]
                });
            }
        });
        
        // Replace the entire checklist
        user.dailyChecklist = newChecklist;
        await user.save();
        
        console.log('Checklist saved successfully with', newChecklist.length, 'entries');
        res.json({ 
            message: 'Checklist saved successfully',
            checklist: user.dailyChecklist 
        });
    } catch (error) {
        console.error('Checklist error:', error);
        res.status(500).json({ message: 'Server error' });
    }
});

// Get full checklist (for 30-day planner)
router.get('/checklist', auth, async (req, res) => {
    try {
        console.log('Fetching full checklist for user:', req.userId);
        const user = await User.findById(req.userId);
        if (!user) {
            return res.status(404).json({ message: 'User not found' });
        }
        
        // Convert the array to object format expected by frontend
        // Frontend expects: { "1": {...}, "2": {...}, ... }
        const checklistObject = {};
        
        // Base date for Ramadan 2024
        const baseDate = new Date('2024-03-10');
        baseDate.setHours(0, 0, 0, 0);
        
        user.dailyChecklist.forEach(item => {
            const itemDate = new Date(item.date);
            itemDate.setHours(0, 0, 0, 0);
            
            // Calculate day number (1-30)
            const diffTime = Math.abs(itemDate - baseDate);
            const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
            const dayNumber = diffDays + 1; // +1 because day 1 is March 10
            
            if (dayNumber >= 1 && dayNumber <= 30) {
                checklistObject[dayNumber] = item.completed;
            }
        });
        
        console.log('Returning checklist with', Object.keys(checklistObject).length, 'days');
        res.json(checklistObject);
    } catch (error) {
        console.error('Get checklist error:', error);
        res.status(500).json({ message: 'Server error' });
    }
});

// Save today's checklist only (for dashboard)
router.post('/checklist/today', auth, async (req, res) => {
    try {
        const user = await User.findById(req.userId);
        if (!user) {
            return res.status(404).json({ message: 'User not found' });
        }
        
        // Get today's date at midnight for comparison
        const today = new Date();
        today.setHours(0, 0, 0, 0);
        
        // Check if there's already an entry for today
        const todayIndex = user.dailyChecklist.findIndex(item => {
            const itemDate = new Date(item.date);
            itemDate.setHours(0, 0, 0, 0);
            return itemDate.getTime() === today.getTime();
        });
        
        if (todayIndex >= 0) {
            // Update today's entry
            user.dailyChecklist[todayIndex].completed = req.body.completed;
        } else {
            // Add new entry for today
            user.dailyChecklist.push({
                date: new Date(),
                completed: req.body.completed
            });
        }
        
        await user.save();
        res.json({ message: 'Today\'s checklist saved successfully' });
    } catch (error) {
        console.error('Checklist error:', error);
        res.status(500).json({ message: 'Server error' });
    }
});

// Get today's checklist only (for dashboard)
router.get('/checklist/today', auth, async (req, res) => {
    try {
        const user = await User.findById(req.userId);
        if (!user) {
            return res.status(404).json({ message: 'User not found' });
        }
        
        // Return today's checklist or empty object
        const today = new Date();
        today.setHours(0, 0, 0, 0);
        
        const todayChecklist = user.dailyChecklist.find(item => {
            const itemDate = new Date(item.date);
            itemDate.setHours(0, 0, 0, 0);
            return itemDate.getTime() === today.getTime();
        });
        
        res.json(todayChecklist?.completed || {});
    } catch (error) {
        console.error('Get checklist error:', error);
        res.status(500).json({ message: 'Server error' });
    }
});

// Save tasbeeh count
router.post('/tasbeeh', auth, async (req, res) => {
    try {
        console.log('Saving tasbeeh for user:', req.userId);
        const { name, count } = req.body;
        const user = await User.findById(req.userId);
        
        if (!user) {
            return res.status(404).json({ message: 'User not found' });
        }
        
        user.tasbeehCounts.push({ 
            name, 
            count, 
            date: new Date() 
        });
        
        await user.save();
        
        // Return last 5 counts
        const recent = user.tasbeehCounts.slice(-5).reverse();
        
        res.json({ 
            message: 'Tasbeeh saved successfully',
            counts: recent
        });
    } catch (error) {
        console.error('Tasbeeh save error:', error);
        res.status(500).json({ message: 'Server error' });
    }
});

// Get recent tasbeeh counts
router.get('/tasbeeh/recent', auth, async (req, res) => {
    try {
        console.log('Fetching recent tasbeeh for user:', req.userId);
        const user = await User.findById(req.userId);
        if (!user) {
            return res.status(404).json({ message: 'User not found' });
        }
        
        // Return last 10 tasbeeh counts
        const recent = user.tasbeehCounts.slice(-10).reverse();
        console.log('Found', recent.length, 'tasbeeh records');
        res.json(recent);
    } catch (error) {
        console.error('Get tasbeeh error:', error);
        res.status(500).json({ message: 'Server error' });
    }
});

module.exports = router;
