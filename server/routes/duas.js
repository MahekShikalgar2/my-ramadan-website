const express = require('express');
const router = express.Router();
const Dua = require('../models/Dua');

// Get all duas
router.get('/', async (req, res) => {
    try {
        const { category } = req.query;
        let query = {};
        
        if (category && category !== 'all') {
            query.category = category;
        }
        
        const duas = await Dua.find(query);
        res.json(duas);
    } catch (error) {
        res.status(500).json({ message: 'Error fetching duas' });
    }
});

// Get AI suggestions based on feeling
router.post('/suggest', async (req, res) => {
    try {
        const { feeling } = req.body;
        
        // Simple keyword-based suggestions
        const suggestions = [];
        
        if (feeling.toLowerCase().includes('sad') || feeling.toLowerCase().includes('upset')) {
            suggestions.push({
                arabic: 'رَبَّنَا آتِنَا فِي الدُّنْيَا حَسَنَةً وَفِي الْآخِرَةِ حَسَنَةً وَقِنَا عَذَابَ النَّارِ',
                translation: 'Our Lord, give us in this world good and in the Hereafter good and protect us from the punishment of the Fire'
            });
        }
        
        if (feeling.toLowerCase().includes('stress') || feeling.toLowerCase().includes('anxious')) {
            suggestions.push({
                arabic: 'حَسْبُنَا اللَّهُ وَنِعْمَ الْوَكِيلُ',
                translation: 'Sufficient for us is Allah, and He is the best disposer of affairs'
            });
        }
        
        if (feeling.toLowerCase().includes('thank') || feeling.toLowerCase().includes('grateful')) {
            suggestions.push({
                arabic: 'الْحَمْدُ لِلَّهِ رَبِّ الْعَالَمِينَ',
                translation: 'All praise is due to Allah, Lord of the worlds'
            });
        }
        
        res.json(suggestions);
    } catch (error) {
        res.status(500).json({ message: 'Error generating suggestions' });
    }
});

module.exports = router;
