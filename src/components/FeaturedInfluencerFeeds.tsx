import React, { useState, useEffect } from 'react';
import { PlayCircle, ExternalLink, Radio, Clock } from 'lucide-react';

export interface InfluencerVideoItem {
  id: string;
  title: string;
  sourceUrl: string;
  imageUrl: string;
  sourceName: string;
  publishedAt: string;
}

const FALLBACK_IMAGE_SCOTTY = "https://images.unsplash.com/photo-1486006920555-c77dce18193b?auto=format&fit=crop&w=800&q=80";
const FALLBACK_IMAGE_ALEX = "https://images.unsplash.com/photo-1563720223185-11003d516935?auto=format&fit=crop&w=800&q=80";
const FALLBACK_IMAGE_CDG = "https://images.unsplash.com/photo-1552519507-da3b142c6e3d?auto=format&fit=crop&w=800&q=80";

const influencersConfig = [
  {
    key: "scotty",
    name: "Scotty Kilmer | Mechanical Reliability",
    url: "https://api.rss2json.com/v1/api.json?rss_url=https://www.youtube.com/feeds/videos.xml?channel_id=UCuxpxCCevIlF-k-K5YU8XPA",
    fallback: {
      id: "scotty-fallback",
      title: "Why New Cars are Engineered to Fail (Avoid These Brands At All Costs)",
      sourceUrl: "https://www.youtube.com/c/scottykilmer",
      imageUrl: FALLBACK_IMAGE_SCOTTY,
      sourceName: "Scotty Kilmer | Mechanical Reliability",
      publishedAt: "2026-06-23 09:00:00"
    }
  },
  {
    key: "autobuyers",
    name: "Auto Buyers Guide | Deep Dives",
    url: "https://api.rss2json.com/v1/api.json?rss_url=https://www.youtube.com/feeds/videos.xml?user=subaruwrxfan",
    fallback: {
      id: "autobuyers-fallback",
      title: "Comprehensive Real-World Range & Charging Test: The Best Mid-Size SUVs",
      sourceUrl: "https://www.youtube.com/user/subaruwrxfan",
      imageUrl: FALLBACK_IMAGE_ALEX,
      sourceName: "Auto Buyers Guide | Deep Dives",
      publishedAt: "2026-06-23 08:00:00"
    }
  },
  {
    key: "cdg",
    name: "Car Dealership Guy | Market Insights",
    url: "https://api.rss2json.com/v1/api.json?rss_url=https://www.youtube.com/feeds/videos.xml?channel_id=UCxVAdOU294AbW5P1IO5vGUQ",
    fallback: {
      id: "cdg-fallback",
      title: "Inside the Dealership: How Wholesale Pricing Trends Impact Buyers Today",
      sourceUrl: "https://www.youtube.com/channel/UCxVAdOU294AbW5P1IO5vGUQ",
      imageUrl: FALLBACK_IMAGE_CDG,
      sourceName: "Car Dealership Guy | Market Insights",
      publishedAt: "2026-06-23 10:00:00"
    }
  }
];

// Helper to format the pubDate safely
function formatPubDate(dateStr: string) {
  try {
    const d = new Date(dateStr);
    if (isNaN(d.getTime())) return "Recently";
    return d.toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' });
  } catch (e) {
    return "Recently";
  }
}

// Helper to strip HTML just in case
function stripHtml(html: string) {
  const tmp = document.createElement('DIV');
  tmp.innerHTML = html;
  return tmp.textContent || tmp.innerText || '';
}

export default function FeaturedInfluencerFeeds() {
  const [videos, setVideos] = useState<InfluencerVideoItem[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchAllInfluencers = async () => {
      setIsLoading(true);
      try {
        const res = await fetch('/api/feeds/videos');
        if (!res.ok) throw new Error(`HTTP error ${res.status}`);
        const data = await res.json();
        
        if (Array.isArray(data) && data.length > 0) {
          const items: InfluencerVideoItem[] = data.map((item: any) => ({
            id: item.id || item.sourceUrl,
            title: stripHtml(item.title),
            sourceUrl: item.sourceUrl,
            imageUrl: item.imageUrl || FALLBACK_IMAGE_SCOTTY,
            sourceName: item.sourceName,
            publishedAt: item.publishedAt
          }));
          setVideos(items);
          setIsLoading(false);
          return;
        }
        throw new Error("Empty items from feeds endpoint");
      } catch (err) {
        console.warn("Failed to fetch live YouTube feeds from backend, using fallbacks.", err);
        setVideos(influencersConfig.map(c => c.fallback));
        setIsLoading(false);
      }
    };

    fetchAllInfluencers();
  }, []);

  return (
    <section className="w-full bg-[#070b11] py-20 px-4 sm:px-6 lg:px-8 font-sans border-t border-slate-800/60">
      <div className="max-w-[1200px] mx-auto">
        {/* Header Section */}
        <div className="mb-12 md:mb-16">
          <div className="flex items-center gap-2 mb-3">
            <Radio size={20} className="text-[#29abe2]" />
            <h2 className="text-[#e8edf2] text-[13px] md:text-[14px] tracking-[0.15em] font-bold uppercase">
              Voices in the Market
            </h2>
          </div>
          <p className="text-[#8b95a3] text-[16px] md:text-[18px] font-medium max-w-[700px] leading-relaxed">
            Get raw, unedited transparency on car reliability, pricing traps, and buying strategies directly from the internet's top consumer watchdogs.
          </p>
        </div>

        {/* 3-Column Grid Layout */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 md:gap-6 lg:gap-8">
          {isLoading ? (
            // Skeleton Loading State (3 items)
            Array.from({ length: 3 }).map((_, idx) => (
              <div key={idx} className="flex flex-col bg-[#121822] rounded-2xl overflow-hidden border border-[#1f2937] animate-pulse">
                <div className="aspect-video w-full bg-[#1f2937]"></div>
                <div className="p-6 flex flex-col flex-grow">
                  <div className="h-4 w-28 bg-[#1f2937] rounded-md mb-4"></div>
                  <div className="h-6 w-full bg-[#1f2937] rounded-md mb-3"></div>
                  <div className="h-6 w-2/3 bg-[#1f2937] rounded-md mb-6"></div>
                  <div className="h-4 w-32 bg-[#1f2937] rounded-md mt-auto"></div>
                </div>
              </div>
            ))
          ) : (
            // Loaded State (Scotty, Alex, CDG)
            videos.map((video) => (
              <a 
                key={video.id}
                href={video.sourceUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="group flex flex-col bg-[#121822] rounded-2xl overflow-hidden border border-[#1f2937] hover:border-[#29abe2]/40 transition-all duration-300 hover:-translate-y-1.5 hover:scale-[1.01] hover:shadow-2xl hover:shadow-black/50"
              >
                {/* Video Thumbnail Wrapper */}
                <div className="relative aspect-video w-full overflow-hidden bg-[#000]">
                  <img 
                    src={video.imageUrl} 
                    alt={video.title}
                    className="w-full h-full object-cover transition-transform duration-700 ease-out group-hover:scale-105"
                    onError={(e) => {
                      // Fallback dynamically if the direct image load fails
                      const matchingConfig = influencersConfig.find(c => c.name === video.sourceName);
                      e.currentTarget.src = matchingConfig ? matchingConfig.fallback.imageUrl : FALLBACK_IMAGE_SCOTTY;
                    }}
                  />
                  {/* Subtle overlay gradient */}
                  <div className="absolute inset-0 bg-gradient-to-t from-[#121822] via-transparent to-transparent opacity-80"></div>
                  
                  {/* Play Icon Overlay */}
                  <div className="absolute inset-0 flex items-center justify-center">
                    <div className="w-14 h-14 bg-black/40 backdrop-blur-sm rounded-full flex items-center justify-center group-hover:bg-[#29abe2] group-hover:scale-110 transition-all duration-300 shadow-lg border border-white/10">
                      <PlayCircle size={32} className="text-white ml-1 opacity-90" />
                    </div>
                  </div>

                  {/* Channel / Influencer Badge */}
                  <div className="absolute top-4 left-4 max-w-[calc(100%-2rem)]">
                    <span className="inline-flex items-center px-3 py-1.5 rounded-lg bg-black/75 backdrop-blur-md text-white text-[10px] md:text-[11px] font-bold uppercase tracking-wider border border-white/10 shadow-sm truncate">
                      {video.sourceName}
                    </span>
                  </div>
                </div>

                {/* Card Content */}
                <div className="p-6 flex flex-col flex-grow">
                  {video.publishedAt && (
                    <div className="flex items-center gap-1.5 text-[#7d8896] text-[12px] font-medium mb-3">
                      <Clock size={12} />
                      <span>{formatPubDate(video.publishedAt)}</span>
                    </div>
                  )}
                  
                  <h3 className="text-[#e8edf2] text-[17px] md:text-[18px] font-bold leading-snug mb-5 line-clamp-2 group-hover:text-[#29abe2] transition-colors duration-200">
                    {video.title}
                  </h3>
                  
                  <div className="flex items-center gap-1.5 text-[#8b95a3] text-[13px] md:text-[14px] font-bold group-hover:text-[#e8edf2] transition-colors mt-auto uppercase tracking-wider">
                    Watch Review
                    <ExternalLink size={15} className="ml-1 opacity-60 group-hover:opacity-100 group-hover:translate-x-1 group-hover:-translate-y-1 transition-all" />
                  </div>
                </div>
              </a>
            ))
          )}
        </div>
      </div>
    </section>
  );
}
