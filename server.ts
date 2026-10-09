import express from "express";
import path from "path";
import dotenv from "dotenv";
import fs from "fs";
// @ts-ignore
import marketPulseHandler from "./api/market-pulse.js";
import { dealerIntelRouter } from "./src/services/dealerIntelRoutes";

// Load environment variables from .env or .env.local
if (fs.existsSync('.env.local')) {
  dotenv.config({ path: '.env.local' });
} else {
  dotenv.config();
}


async function startServer() {
  const app = express();
  const PORT = process.env.PORT ? Number(process.env.PORT) : 3000;

  // JSON Body Parser for API requests
  app.use(express.json());

  // Dealer Intel™ API routes
  app.use("/api/dealer-intel", dealerIntelRouter);

  // Add a proxy endpoint for MarketCheck
  app.get("/api/marketcheck/search", async (req, res) => {
    try {
      const { make, model, year, query, rows, zip, radius } = req.query;
      let apiKey = process.env.VITE_MARKETCHECK_API_KEY || 'ThoKb13BeDzhQhMeHuh5XkO8UiwFRedr';
      
      const buildUrl = (key: string) => {
        let url = `https://mc-api.marketcheck.com/v2/search/car/active?api_key=${key}`;
        if (rows) url += `&rows=${rows}`;
        if (make) url += `&make=${encodeURIComponent(make as string)}`;
        if (model) url += `&model=${encodeURIComponent(model as string)}`;
        if (year) url += `&year=${encodeURIComponent(year as string)}`;
        if (zip) url += `&zip=${encodeURIComponent(zip as string)}`;
        if (radius) url += `&radius=${encodeURIComponent(radius as string)}`;
        return url;
      };

      let response = await fetch(buildUrl(apiKey));
      
      // If unauthorized, fallback to the default demo key
      if (!response.ok && process.env.VITE_MARKETCHECK_API_KEY) {
        console.warn(`Configured API key returned ${response.status}, falling back to demo key.`);
        response = await fetch(buildUrl('ThoKb13BeDzhQhMeHuh5XkO8UiwFRedr'));
      }

      if (!response.ok) {
        console.error(`MarketCheck API Error Details: status=${response.status}, text=${await response.text()}`);
        throw new Error(`MarketCheck API Error: ${response.status} ${response.statusText}`);
      }
      
      const data = await response.json();
      res.json(data);
    } catch (error) {
      console.error('Proxy Error:', error);
      res.status(500).json({ error: 'Failed to fetch from MarketCheck', details: String(error) });
    }
  });

  // Add proxy endpoint for MarketCheck Economics/TCO
  app.get("/api/marketcheck/predict", async (req, res) => {
    try {
      const { vin, make, model, year, state } = req.query;
      let apiKey = process.env.VITE_MARKETCHECK_API_KEY || 'ThoKb13BeDzhQhMeHuh5XkO8UiwFRedr';
      
      const buildUrl = (key: string) => {
        let url = `https://mc-api.marketcheck.com/v2/predict/car/costs?api_key=${key}`;
        if (vin) url += `&vin=${encodeURIComponent(vin as string)}`;
        if (make) url += `&make=${encodeURIComponent(make as string)}`;
        if (model) url += `&model=${encodeURIComponent(model as string)}`;
        if (year) url += `&year=${encodeURIComponent(year as string)}`;
        if (state) url += `&state=${encodeURIComponent(state as string)}`;
        return url;
      };

      let response = await fetch(buildUrl(apiKey));
      
      if (!response.ok && process.env.VITE_MARKETCHECK_API_KEY) {
        response = await fetch(buildUrl('ThoKb13BeDzhQhMeHuh5XkO8UiwFRedr'));
      }

      if (!response.ok) {
        throw new Error(`MarketCheck Predict API Error: ${response.status} ${response.statusText}`);
      }
      
      const data = await response.json();
      res.json(data);
    } catch (error) {
      console.error('Predict Proxy Error:', error);
      res.status(500).json({ error: 'Failed to fetch TCO from MarketCheck', details: String(error) });
    }
  });

  // Add local proxy endpoint for MarketPulse
  app.get("/api/market-pulse", async (req, res) => {
    try {
      await marketPulseHandler(req, res);
    } catch (error) {
      console.error("MarketPulse Proxy Error:", error);
      res.status(500).json({ error: "Failed to fetch MarketPulse data", details: String(error) });
    }
  });

  // Automated In-Memory Cached Feeds (1-Hour Cache TTL)
  let videoCache: { data: any[]; timestamp: number } | null = null;
  let newsCache: { data: any[]; timestamp: number } | null = null;
  const CACHE_TTL_MS = 60 * 60 * 1000;

  // Real-Time YouTube Channel Video Feed
  app.get("/api/feeds/videos", async (req, res) => {
    try {
      const now = Date.now();
      if (videoCache && now - videoCache.timestamp < CACHE_TTL_MS) {
        return res.json(videoCache.data);
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
      res.json(results.length > 0 ? results : (videoCache?.data || []));
    } catch (error) {
      console.error("YouTube Feeds Proxy Error:", error);
      res.status(500).json({ error: "Failed to fetch YouTube feeds", details: String(error) });
    }
  });

  // Real-Time Automotive News Feed (Motor1 + Car and Driver)
  app.get("/api/feeds/news", async (req, res) => {
    try {
      const now = Date.now();
      if (newsCache && now - newsCache.timestamp < CACHE_TTL_MS) {
        return res.json(newsCache.data);
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
      res.json(items.length > 0 ? items : (newsCache?.data || []));
    } catch (error) {
      console.error("News Feeds Proxy Error:", error);
      res.status(500).json({ error: "Failed to fetch News feeds", details: String(error) });
    }
  });

  // Vite middleware for development
  if (process.env.NODE_ENV !== "production") {
    const { createServer: createViteServer } = await import("vite");
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: "spa",
    });
    app.use(vite.middlewares);
  } else {
    const distPath = path.join(process.cwd(), 'dist');
    app.use(express.static(distPath));
    app.get('*', (req, res) => {
      res.sendFile(path.join(distPath, 'index.html'));
    });
  }

  app.listen(PORT, "0.0.0.0", () => {
    console.log(`Server running on http://localhost:${PORT}`);
  });
}

startServer();
