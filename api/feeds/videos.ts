import type { VercelRequest, VercelResponse } from '@vercel/node';

let videoCache: { data: any[]; timestamp: number } | null = null;
const CACHE_TTL_MS = 60 * 60 * 1000; // 1 hour

export default async function handler(req: VercelRequest, res: VercelResponse) {
  res.setHeader('Access-Control-Allow-Credentials', 'true');
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET,OPTIONS');
  res.setHeader('Cache-Control', 's-maxage=3600, stale-while-revalidate=1800');

  if (req.method === 'OPTIONS') {
    return res.status(200).end();
  }

  try {
    const now = Date.now();
    if (videoCache && now - videoCache.timestamp < CACHE_TTL_MS) {
      return res.status(200).json(videoCache.data);
    }

    const channels = [
      { key: "scotty", name: "Scotty Kilmer | Mechanical Reliability", channelId: "UCuxpxCCevIlF-k-K5YU8XPA" },
      { key: "autobuyers", name: "Auto Buyers Guide | Deep Dives", channelId: "UCu3fngdIGYCQ-c7YG0e9FuQ" },
      { key: "cdg", name: "Car Dealership Guy | Market Insights", channelId: "UCxVAdOU294AbW5P1IO5vGUQ" }
    ];

    const results: any[] = [];
    for (const ch of channels) {
      try {
        const url = `https://www.youtube.com/feeds/videos.xml?channel_id=${ch.channelId}`;
        const response = await fetch(url, {
          headers: { 'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36' }
        });
        if (!response.ok) continue;
        const xml = await response.text();

        const entryMatch = xml.match(/<entry>([\s\S]*?)<\/entry>/);
        if (entryMatch) {
          const entry = entryMatch[1];
          const idMatch = entry.match(/<yt:videoId>([^<]+)<\/yt:videoId>/);
          const titleMatch = entry.match(/<title>([^<]+)<\/title>/);
          const pubMatch = entry.match(/<published>([^<]+)<\/published>/);

          const videoId = idMatch ? idMatch[1] : '';
          const rawTitle = titleMatch ? titleMatch[1] : '';
          const title = rawTitle
            .replace(/&amp;/g, '&')
            .replace(/&quot;/g, '"')
            .replace(/&#39;/g, "'")
            .replace(/&lt;/g, '<')
            .replace(/&gt;/g, '>');
          const publishedAt = pubMatch ? pubMatch[1] : '';
          const sourceUrl = `https://www.youtube.com/watch?v=${videoId}`;
          const imageUrl = `https://i.ytimg.com/vi/${videoId}/hqdefault.jpg`;

          results.push({
            id: videoId,
            key: ch.key,
            title,
            sourceUrl,
            imageUrl,
            sourceName: ch.name,
            publishedAt
          });
        }
      } catch (err) {
        console.warn(`YouTube feed fetch error for channel ${ch.name}:`, err);
      }
    }

    if (results.length > 0) {
      videoCache = { data: results, timestamp: now };
    }

    return res.status(200).json(results.length > 0 ? results : (videoCache?.data || []));
  } catch (error) {
    console.error("YouTube Feeds Proxy Error:", error);
    return res.status(500).json({ error: "Failed to fetch YouTube feeds", details: String(error) });
  }
}
