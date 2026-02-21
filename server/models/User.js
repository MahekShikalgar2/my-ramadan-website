const express = require('express');
const router = express.Router();
const User = require('../models/User');
const auth = require('../middleware/auth');

// ==================== PROFILE ROUTES ====================

// Get user profile
router.get('/profile', auth, async (req, res) => {
    try {
        console.log('📊 Fetching profile for user:', req.userId);
        const user = await User.findById(req.userId).select('-password');
        
        if (!user) {
            console.log('❌ User not found:', req.userId);
            return res.status(404).json({ message: 'User not found' });
        }
        
        console.log('✅ User found:', user.email);
        res.json(user);
    } catch (error) {
        console.error('❌ Profile error:', error);
        res.status(500).json({ message: 'Server error', error: error.message });
    }
});

// ==================== GOALS ROUTES ====================

// Update user goals
router.post('/goals', auth, async (req, res) => {
    try {
        console.log('🎯 Updating goals for user:', req.userId);
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
        
        console.log('✅ Goals updated:', user.ramadanGoals);
        res.json({ 
            message: 'Goals updated successfully',
            goals: user.ramadanGoals 
        });
    } catch (error) {
        console.error('❌ Goals update error:', error);
        res.status(500).json({ message: 'Server error' });
    }
});

// ==================== CHECKLIST ROUTES (30-Day Planner) ====================

// Save full checklist (for 30-day planner)
router.post('/checklist', auth, async (req, res) => {
    try {
        console.log('📝 Saving full checklist for user:', req.userId);
        const checklistData = req.body; // Object with day numbers as keys
        
        console.log('Received checklist data:', checklistData);
        
        const user = await User.findById(req.userId);
        if (!user) {
            return res.status(404).json({ message: 'User not found' });
        }
        
        // Convert day-number keys to actual dates
        // Day 1 = March 10, 2024 (first day of Ramadan 2024)
        const baseDate = new Date('2024-03-10');
        baseDate.setHours(0, 0, 0, 0);
        
        const newChecklist = [];
        
        Object.keys(checklistData).forEach(dayKey => {
            const day = parseInt(dayKey);
            if (!isNaN(day) && day >= 1 && day <= 30) {
                const date = new Date(baseDate);
                date.setDate(baseDate.getDate() + (day - 1));
                date.setHours(0, 0, 0, 0);
                
                console.log(`Day ${day} -> Date: ${date.toDateString()}`);
                
                newChecklist.push({
                    date: date,
                    completed: checklistData[dayKey]
                });
            }
        });
        
        // Replace the entire checklist
        user.dailyChecklist = newChecklist;
        await user.save();
        
        console.log('✅ Checklist saved successfully with', newChecklist.length, 'entries');
        res.json({ 
            message: 'Checklist saved successfully',
            checklist: checklistData
        });
    } catch (error) {
        console.error('❌ Checklist error:', error);
        res.status(500).json({ message: 'Server error' });
    }
});

// Get full checklist (for 30-day planner)
router.get('/checklist', auth, async (req, res) => {
    try {
        console.log('📖 Fetching full checklist for user:', req.userId);
        const user = await User.findById(req.userId);
        if (!user) {
            return res.status(404).json({ message: 'User not found' });
        }
        
        // Convert array to object format expected by frontend
        // Frontend expects: { "1": {...}, "2": {...}, ... }
        const checklistObject = {};
        
        // Base date for Ramadan 2024
        const baseDate = new Date('2024-03-10');
        baseDate.setHours(0, 0, 0, 0);
        
        console.log('📅 Base date:', baseDate.toDateString());
        console.log('📊 User has', user.dailyChecklist.length, 'checklist entries');
        
        user.dailyChecklist.forEach(item => {
            const itemDate = new Date(item.date);
            itemDate.setHours(0, 0, 0, 0);
            
            // Calculate day number (1-30)
            const diffTime = itemDate.getTime() - baseDate.getTime();
            const diffDays = Math.floor(diffTime / (1000 * 60 * 60 * 24));
            const dayNumber = diffDays + 1; // +1 because day 1 is March 10
            
            console.log(`Item date: ${itemDate.toDateString()}, Day number: ${dayNumber}`);
            
            if (dayNumber >= 1 && dayNumber <= 30) {
                checklistObject[dayNumber] = item.completed;
            }
        });
        
        console.log('✅ Returning checklist with', Object.keys(checklistObject).length, 'days');
        res.json(checklistObject);
    } catch (error) {
        console.error('❌ Get checklist error:', error);
        res.status(500).json({ message: 'Server error' });
    }
});

// ==================== TODAY'S CHECKLIST ROUTES (for Dashboard) ====================

// Save today's checklist only (for dashboard)
router.post('/checklist/today', auth, async (req, res) => {
    try {
        console.log('📝 Saving today\'s checklist for user:', req.userId);
        
        const user = await User.findById(req.userId);
        if (!user) {
            return res.status(404).json({ message: 'User not found' });
        }
        
        // Get today's date at midnight
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
            console.log('✅ Updated existing entry for today');
        } else {
            // Add new entry for today
            user.dailyChecklist.push({
                date: today,
                completed: req.body.completed
            });
            console.log('✅ Added new entry for today');
        }
        
        await user.save();
        res.json({ message: 'Today\'s checklist saved successfully' });
    } catch (error) {
        console.error('❌ Checklist error:', error);
        res.status(500).json({ message: 'Server error' });
    }
});

// Get today's checklist only (for dashboard)
router.get('/checklist/today', auth, async (req, res) => {
    try {
        console.log('📖 Fetching today\'s checklist for user:', req.userId);
        
        const user = await User.findById(req.userId);
        if (!user) {
            return res.status(404).json({ message: 'User not found' });
        }
        
        // Get today's date at midnight
        const today = new Date();
        today.setHours(0, 0, 0, 0);
        
        // Find today's entry
        const todayChecklist = user.dailyChecklist.find(item => {
            const itemDate = new Date(item.date);
            itemDate.setHours(0, 0, 0, 0);
            return itemDate.getTime() === today.getTime();
        });
        
        console.log('✅ Found today\'s checklist:', todayChecklist?.completed || {});
        res.json(todayChecklist?.completed || {});
    } catch (error) {
        console.error('❌ Get checklist error:', error);
        res.status(500).json({ message: 'Server error' });
    }
});

// ==================== TASBEEH ROUTES ====================

// Save tasbeeh count
router.post('/tasbeeh', auth, async (req, res) => {
    try {
        console.log('📿 Saving tasbeeh for user:', req.userId);
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
        
        // Return last 10 counts
        const recent = user.tasbeehCounts.slice(-10).reverse();
        
        console.log('✅ Tasbeeh saved successfully');
        res.json({ 
            message: 'Tasbeeh saved successfully',
            counts: recent
        });
    } catch (error) {
        console.error('❌ Tasbeeh save error:', error);
        res.status(500).json({ message: 'Server error' });
    }
});

// Get recent tasbeeh counts
router.get('/tasbeeh/recent', auth, async (req, res) => {
    try {
        console.log('📿 Fetching recent tasbeeh for user:', req.userId);
        
        const user = await User.findById(req.userId);
        if (!user) {
            return res.status(404).json({ message: 'User not found' });
        }
        
        // Return last 20 tasbeeh counts (increased from 10)
        const recent = user.tasbeehCounts.slice(-20).reverse();
        
        console.log('✅ Found', recent.length, 'tasbeeh records');
        res.json(recent);
    } catch (error) {
        console.error('❌ Get tasbeeh error:', error);
        res.status(500).json({ message: 'Server error' });
    }
});

// ==================== DEBUG ROUTE (Optional - Remove in Production) ====================

// Get all user data (for debugging only)
router.get('/debug', auth, async (req, res) => {
    try {
        console.log('🔍 Debug fetch for user:', req.userId);
        
        const user = await User.findById(req.userId).select('-password');
        if (!user) {
            return res.status(404).json({ message: 'User not found' });
        }
        
        res.json({
            message: 'Debug data',
            user: {
                id: user._id,
                name: user.name,
                email: user.email,
                ramadanGoals: user.ramadanGoals,
                dailyChecklistCount: user.dailyChecklist.length,
                dailyChecklist: user.dailyChecklist,
                tasbeehCountsCount: user.tasbeehCounts.length,
                recentTasbeeh: user.tasbeehCounts.slice(-5)
            }
        });
    } catch (error) {
        console.error('❌ Debug error:', error);
        res.status(500).json({ message: 'Server error' });
    }
});

module.exports = router;
