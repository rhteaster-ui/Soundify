const axios = require('axios');

// In-memory ratings array (starts empty - no mock/demo data)
let memoryRatings = [];

const JSONBIN_API_KEY = process.env.JSONBIN_KEY || '';
const JSONBIN_BIN_ID = process.env.JSONBIN_BIN_ID || '';

async function getRatingsFromBin() {
    if (JSONBIN_API_KEY && JSONBIN_BIN_ID) {
        try {
            const resp = await axios.get(`https://api.jsonbin.io/v3/b/${JSONBIN_BIN_ID}/latest`, {
                headers: {
                    'X-Master-Key': JSONBIN_API_KEY
                },
                timeout: 5000
            });
            if (resp.data && resp.data.record && Array.isArray(resp.data.record.ratings)) {
                return resp.data.record.ratings;
            }
        } catch (err) {
            console.error('[Rating API] Failed to fetch from JSONBin:', err.message);
        }
    }
    return memoryRatings;
}

async function saveRatingsToBin(ratingsList) {
    memoryRatings = ratingsList;
    if (JSONBIN_API_KEY && JSONBIN_BIN_ID) {
        try {
            await axios.put(`https://api.jsonbin.io/v3/b/${JSONBIN_BIN_ID}`, {
                ratings: ratingsList
            }, {
                headers: {
                    'Content-Type': 'application/json',
                    'X-Master-Key': JSONBIN_API_KEY
                },
                timeout: 5000
            });
        } catch (err) {
            console.error('[Rating API] Failed to save to JSONBin:', err.message);
        }
    }
}

module.exports = async (req, res) => {
    // Enable CORS
    res.setHeader('Access-Control-Allow-Origin', '*');
    res.setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS');
    res.setHeader('Access-Control-Allow-Headers', 'Content-Type');

    if (req.method === 'OPTIONS') {
        return res.status(200).end();
    }

    if (req.method === 'GET') {
        try {
            const ratings = await getRatingsFromBin();
            const total = ratings.length;
            const sum = ratings.reduce((acc, curr) => acc + (Number(curr.stars) || 5), 0);
            const average = total > 0 ? (sum / total).toFixed(1) : '0.0';

            return res.json({
                status: true,
                average: Number(average),
                total: total,
                ratings: ratings.slice(-30).reverse() // return recent 30 ratings
            });
        } catch (err) {
            return res.status(500).json({ status: false, message: err.message });
        }
    }

    if (req.method === 'POST') {
        try {
            const body = req.body || {};
            const stars = Math.min(5, Math.max(1, parseInt(body.stars) || 5));
            const comment = String(body.comment || '').trim();
            const name = String(body.name || 'Pengguna Soundify').trim();
            
            // Get client IP
            const clientIp = req.headers['x-forwarded-for'] || req.socket.remoteAddress || '127.0.0.1';

            const currentRatings = await getRatingsFromBin();

            const newEntry = {
                id: Date.now().toString(36) + Math.random().toString(36).substr(2, 4),
                stars,
                comment: comment,
                name: name || 'Pengguna Soundify',
                date: new Date().toISOString(),
                ip: String(clientIp).split(',')[0].trim()
            };

            currentRatings.push(newEntry);
            await saveRatingsToBin(currentRatings);

            const total = currentRatings.length;
            const sum = currentRatings.reduce((acc, curr) => acc + (Number(curr.stars) || 5), 0);
            const average = total > 0 ? (sum / total).toFixed(1) : '0.0';

            return res.json({
                status: true,
                message: 'Rating & ulasan Anda berhasil disimpan!',
                average: Number(average),
                total: total,
                entry: newEntry
            });
        } catch (err) {
            return res.status(500).json({ status: false, message: err.message });
        }
    }

    return res.status(405).json({ status: false, message: 'Method Not Allowed' });
};
