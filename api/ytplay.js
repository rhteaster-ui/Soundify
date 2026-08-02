const axios = require('axios');
const crypto = require('crypto');

function extractVideoId(input) {
    if (!input || typeof input !== 'string') return null;
    const str = input.trim();
    
    // Check if 11-char ID directly
    if (/^[a-zA-Z0-9_-]{11}$/.test(str)) {
        return str;
    }
    
    // Match standard YouTube/YouTube Music URLs
    const match = str.match(/(?:v=|\/vi\/|youtu\.be\/|\/v\/|\/embed\/|\/shorts\/|watch\?v=)([a-zA-Z0-9_-]{11})/);
    if (match) return match[1];

    return null;
}

async function searchVideoId(query) {
    try {
        const payload = {
            context: { client: { clientName: 'WEB_REMIX', clientVersion: '1.20240101.00.00', hl: 'id', gl: 'ID' } },
            query: query,
            params: 'EgWKAQIIAWoSEAQQAxAFEAkQChAVEBAQERAO'
        };
        const { data } = await axios.post('https://music.youtube.com/youtubei/v1/search?prettyPrint=false', payload, {
            headers: { 'Content-Type': 'application/json', 'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36' },
            timeout: 8000
        });

        function findVideoId(obj) {
            if (!obj || typeof obj !== 'object') return null;
            if (obj.videoId && typeof obj.videoId === 'string' && obj.videoId.length === 11) return obj.videoId;
            for (const k of Object.keys(obj)) {
                const found = findVideoId(obj[k]);
                if (found) return found;
            }
            return null;
        }

        return findVideoId(data);
    } catch (e) {
        return null;
    }
}

async function getSavetubeCdn(cdn, videoId) {
    const fullUrl = "https://www.youtube.com/watch?v=" + videoId;
    const api = axios.create({
        headers: {
            "content-type": "application/json",
            "origin": "https://yt.savetube.me",
            "user-agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/128.0.0.0 Safari/537.36"
        },
        timeout: 6000
    });

    const infoResponse = await api.post(`https://${cdn}/v2/info`, { url: fullUrl });
    const encryptedData = infoResponse?.data?.data;
    if (!encryptedData) throw new Error(`[${cdn}] No encrypted data returned`);

    const encrypted = Buffer.from(encryptedData, "base64");
    const decipher = crypto.createDecipheriv("aes-128-cbc",
        Buffer.from("C5D58EF67A7584E4A29F6C35BBC4EB12", "hex"),
        encrypted.slice(0, 16)
    );

    const decryptedBuffer = Buffer.concat([
        decipher.update(encrypted.slice(16)),
        decipher.final()
    ]);

    const decrypted = JSON.parse(decryptedBuffer.toString());
    const downloadRes = await api.post(`https://${cdn}/download`, {
        id: videoId,
        downloadType: "audio",
        quality: "128",
        key: decrypted.key
    });

    const audioUrl = downloadRes.data?.data?.downloadUrl || downloadRes.data?.downloadUrl;
    if (audioUrl) {
        const durSec = decrypted.duration || 0;
        const durStr = `${Math.floor(durSec / 60)}:${(durSec % 60).toString().padStart(2, "0")}`;
        return {
            duration: durStr,
            audio: audioUrl,
            cdn
        };
    }
    throw new Error(`[${cdn}] No download URL returned`);
}

async function getSavetubeAudio(videoId) {
    const cdns = [
        "cdn401.savetube.vip",
        "cdn403.savetube.vip",
        "cdn405.savetube.vip"
    ];

    // Try parallel race first for fastest possible response
    try {
        const result = await Promise.any(cdns.map(cdn => getSavetubeCdn(cdn, videoId)));
        if (result && result.audio) {
            return result;
        }
    } catch (raceErr) {
        // Parallel attempt failed, proceed to sequential fallback
    }

    // Fallback: Try CDNs sequentially
    for (const cdn of cdns) {
        try {
            const res = await getSavetubeCdn(cdn, videoId);
            if (res && res.audio) return res;
        } catch (err) {
            // Ignore individual CDN failures in fallback
        }
    }

    return null;
}

module.exports = async (req, res) => {
    res.setHeader('Access-Control-Allow-Origin', '*');
    res.setHeader('Access-Control-Allow-Methods', 'POST, OPTIONS');
    res.setHeader('Access-Control-Allow-Headers', 'Content-Type');

    if (req.method === 'OPTIONS') { res.status(200).end(); return; }
    if (req.method !== 'POST') { res.status(405).json({ status: false, message: 'Method not allowed' }); return; }

    let body = req.body;
    if (typeof body === 'string') { try { body = JSON.parse(body); } catch (e) { body = {}; } }
    body = body || {};

    const rawQuery = (body.query || body.url || '').trim();
    if (!rawQuery) { res.status(400).json({ status: false, message: 'Parameter query/url wajib diisi' }); return; }

    console.log(`[EXTRACT] Request query: "${rawQuery}"`);

    try {
        let videoId = extractVideoId(rawQuery);
        
        // If not a valid video ID or YouTube URL, perform search
        if (!videoId) {
            console.log(`[EXTRACT] Search fallback for: "${rawQuery}"`);
            videoId = await searchVideoId(rawQuery);
        }

        if (!videoId) {
            console.error("[EXTRACT] Unable to resolve videoId for query:", rawQuery);
            return res.status(404).json({ status: false, error: "Lagu tidak ditemukan. Silakan coba judul lain." });
        }

        console.log(`[EXTRACT] Extracted videoId: ${videoId}`);

        // Try Savetube multi-CDN
        let audioData = await getSavetubeAudio(videoId);

        if (audioData && audioData.audio) {
            console.log("[EXTRACT] Success via Savetube");
            return res.status(200).json({
                status: true,
                result: {
                    videoId,
                    duration: audioData.duration || null,
                    download: { audio: audioData.audio }
                }
            });
        }

        console.error(`[EXTRACT] All extraction methods failed for videoId: ${videoId}`);
        res.status(503).json({ status: false, error: "Layanan ekstraksi audio sedang padat. Silakan coba lagu lain." });
    } catch (err) {
        console.error("[EXTRACT] Fatal error:", err.message);
        res.status(500).json({ status: false, error: "Internal server error during extraction" });
    }
};

