const express = require('express');
const router = express.Router();
const axios = require('axios');

// Get prayer times by location
router.get('/times', async (req, res) => {
    try {
        const { lat, lng, date } = req.query;
        
        if (!lat || !lng) {
            return res.status(400).json({ message: 'Location required' });
        }

        const response = await axios.get(
            `http://api.aladhan.com/v1/timings/${date || Math.floor(Date.now()/1000)}`,
            {
                params: {
                    latitude: lat,
                    longitude: lng,
                    method: 2
                }
            }
        );
        
        res.json(response.data.data.timings);
    } catch (error) {
        res.status(500).json({ message: 'Error fetching prayer times' });
    }
});

module.exports = router;
