import type { VercelRequest, VercelResponse } from '@vercel/node';

let newsCache: { data: any[]; timestamp: number } | null = null;
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
    if (newsCache && now - newsCache.timestamp < CACHE_TTL_MS) {
      return res.status(200).json(newsCache.data);
    }

    const sources = [
      { name: 'Motor1', url: 'https://www.motor1.com/rss/news/all/' },
      { name: 'Car and Driver', url: 'https://www.caranddriver.com/rss/all.xml/' }
    ];

    const items: any[] = [];
    for (const src of sources) {
      if (items.length >= 4) break;
      try {
        const response = await fetch(src.url, {
          headers: { 'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36' }
        });
        if (!response.ok) continue;
        const xml = await response.text();

        const itemRegex = /<item>([\s\S]*?)<\/item>/g;
        let match;
        while ((match = itemRegex.exec(xml)) !== null && items.length < 4) {
          const itemContent = match[1];
          const titleMatch = itemContent.match(/<title>(?:<!\[CDATA\[([\s\S]*?)\]\]>|([^<]+))<\/title>/);
          const linkMatch = itemContent.match(/<link>(?:<!\[CDATA\[([\s\S]*?)\]\]>|([^<]+))<\/link>/);
          const pubMatch = itemContent.match(/<pubDate>([^<]+)<\/pubDate>/);
          const descMatch = itemContent.match(/<description>(?:<!\[CDATA\[([\s\S]*?)\]\]>|([^<]+))<\/description>/);
          const enclosureMatch = itemContent.match(/url=["']([^"']+\.(?:jpg|jpeg|png|webp)[^"']*)["']/i);

          const title = (titleMatch ? (titleMatch[1] || titleMatch[2]) : '').trim();
          const link = (linkMatch ? (linkMatch[1] || linkMatch[2]) : '').trim();
          const pubDate = pubMatch ? pubMatch[1] : '';
          const rawDesc = (descMatch ? (descMatch[1] || descMatch[2]) : '').trim();
          const summary = rawDesc.replace(/<[^>]*>/g, '').trim().substring(0, 160) + '...';
          const imageUrl = enclosureMatch ? enclosureMatch[1] : 'https://images.unsplash.com/photo-1552519507-da3b142c6e3d?auto=format&fit=crop&w=800&q=80';

          if (title && link) {
            items.push({
              id: link,
              title,
              summary,
              sourceName: src.name,
              sourceUrl: link,
              imageUrl,
              publishedAt: pubDate
            });
          }
        }
      } catch (err) {
        console.warn(`News feed fetch error for ${src.name}:`, err);
      }
    }

    if (items.length > 0) {
      newsCache = { data: items, timestamp: now };
    }

    return res.status(200).json(items.length > 0 ? items : (newsCache?.data || []));
  } catch (error) {
    console.error("News Feeds Proxy Error:", error);
    return res.status(500).json({ error: "Failed to fetch News feeds", details: String(error) });
  }
}
