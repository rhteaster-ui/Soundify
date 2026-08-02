// Injects per-track Open Graph / Twitter meta tags for /play/:videoId share
// links (so links shared on WhatsApp/social apps show the song's cover art),
// mirroring what the old Express server did server-side.

export default async (request, context) => {
    const url = new URL(request.url);
    const raw = url.pathname.split('/play/')[1] || '';
    const videoId = raw.split('?')[0].split('/')[0];

    const response = await context.next();
    if (!videoId) return response;

    const html = await response.text();
    const coverUrl = `https://i.ytimg.com/vi/${videoId}/hqdefault.jpg`;
    const title = 'Dengarkan Musik - Soundify • rhmt';
    const desc = 'Dengarkan lagu favoritmu di Soundify Web Music Player by rhmt';

    const updated = html
        .replace(/<title>.*?<\/title>/i, `<title>${title}</title>`)
        .replace(/<meta property="og:title" content=".*?"\s*\/?>/i, `<meta property="og:title" content="${title}">`)
        .replace(/<meta property="og:description" content=".*?"\s*\/?>/i, `<meta property="og:description" content="${desc}">`)
        .replace(/<meta property="og:image" content=".*?"\s*\/?>/i, `<meta property="og:image" content="${coverUrl}">`)
        .replace(/<meta name="twitter:title" content=".*?"\s*\/?>/i, `<meta name="twitter:title" content="${title}">`)
        .replace(/<meta name="twitter:description" content=".*?"\s*\/?>/i, `<meta name="twitter:description" content="${desc}">`)
        .replace(/<meta name="twitter:image" content=".*?"\s*\/?>/i, `<meta name="twitter:image" content="${coverUrl}">`)
        .replace(/<link rel="icon".*?>/i, `<link rel="icon" type="image/jpeg" href="${coverUrl}">`)
        .replace(/<link rel="apple-touch-icon".*?>/i, `<link rel="apple-touch-icon" href="${coverUrl}">`);

    return new Response(updated, {
        status: response.status,
        headers: { 'content-type': 'text/html; charset=utf-8' }
    });
};

export const config = { path: '/play/*' };
