const express = require('express');
const router = express.Router();
const Hadith = require('../models/Hadith');

// Get daily hadith
router.get('/daily', async (req, res) => {
    try {
        // Sample hadiths (in production, fetch from database)
        const hadiths = [
            {
                arabic: 'عن أبي هريرة رضي الله عنه أن رسول الله صلى الله عليه وسلم قال: "إذا جاء رمضان فتحت أبواب الجنة وغلقت أبواب النار وصفدت الشياطين"',
                english: 'When Ramadan begins, the gates of Paradise are opened, the gates of Hell are closed, and the devils are chained',
                narrator: 'Abu Hurairah',
                source: 'Sahih Muslim'
            },
            {
                arabic: 'قال رسول الله صلى الله عليه وسلم: "من صام رمضان إيمانا واحتسابا غفر له ما تقدم من ذنبه"',
                english: 'Whoever fasts Ramadan out of faith and seeking reward, his previous sins will be forgiven',
                narrator: 'Abu Hurairah',
                source: 'Sahih Bukhari'
            },
            {
                arabic: 'قال رسول الله صلى الله عليه وسلم: "تحروا ليلة القدر في العشر الأواخر من رمضان"',
                english: 'Seek Laylatul Qadr in the last ten nights of Ramadan',
                narrator: 'Aisha',
                source: 'Sahih Bukhari'
            }
        ];
        
        const randomIndex = Math.floor(Math.random() * hadiths.length);
        res.json(hadiths[randomIndex]);
    } catch (error) {
        res.status(500).json({ message: 'Error fetching hadith' });
    }
});

module.exports = router;
