import React, { useState, useEffect } from 'react';
import { PlayCircle, ExternalLink, ShieldCheck, Clock } from 'lucide-react';

export interface VideoAdviceItem {
  id: string;
  title: string;
  sourceUrl: string;
  imageUrl: string;
  sourceName: string;
  publishedAt: string;
}

const FALLBACK_THUMBNAIL = "https://images.unsplash.com/photo-1549317661-bd32c8ce0db2?auto=format&fit=crop&w=800&q=80";

const mockVideos: VideoAdviceItem[] = [
  {
    id: "vid-001",
    title: "How to Negotiate Like a Pro at the Dealership",
    sourceUrl: "https://youtube.com",
    imageUrl: FALLBACK_THUMBNAIL,
    sourceName: "CarEdge Advice",
    publishedAt: "2026-06-23 12:00:00"
  },
  {
    id: "vid-002",
    title: "Hidden Fees to Watch Out For When Buying Used",
    sourceUrl: "https://youtube.com",
    imageUrl: FALLBACK_THUMBNAIL,
    sourceName: "CarEdge Advice",
    publishedAt: "2026-06-23 12:00:00"
  },
  {
    id: "vid-003",
    title: "The Most Reliable Used Cars Under $15,000",
    sourceUrl: "https://youtube.com",
    imageUrl: FALLBACK_THUMBNAIL,
    sourceName: "CarEdge Advice",
    publishedAt: "2026-06-23 12:00:00"
  },
  {
    id: "vid-004",
    title: "How to Avoid the Biggest Depreciation Traps",
    sourceUrl: "https://youtube.com",
    imageUrl: FALLBACK_THUMBNAIL,
    sourceName: "CarEdge Advice",
    publishedAt: "2026-06-23 12:00:00"
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

export default function ExpertAdviceFeeds() {
  const [videos, setVideos] = useState<VideoAdviceItem[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [hasError, setHasError] = useState(false);

  useEffect(() => {
    const fetchVideos = async () => {
      try {
        const res = await fetch('https://api.rss2json.com/v1/api.json?rss_url=https://www.youtube.com/feeds/videos.xml?channel_id=UCBRFVQTWUxAph85lUvklzKg');
        if (!res.ok) throw new Error("Network response was not ok");
        
        const data = await res.json();
        
        if (data.status !== "ok" || !data.items || data.items.length === 0) {
          throw new Error("Invalid feed structure or no items");
        }

        // Force the layout to map directly to the specific video URL
        const articles = data.items.slice(0, 4).map((item: any) => ({
          id: item.guid, // YouTube video IDs are stored here
          title: stripHtml(item.title),
          // Ensure it targets the specific video watch page, not the channel profile
          sourceUrl: item.link, 
          imageUrl: item.thumbnail || FALLBACK_THUMBNAIL,
          sourceName: "CarEdge Advice",
          publishedAt: item.pubDate
        }));

        setVideos(articles);
      } catch (err) {
        console.error("Failed to load YouTube feed, falling back to static data.", err);
        setHasError(true);
      } finally {
        setIsLoading(false);
      }
    };

    fetchVideos();
  }, []);

  const displayVideos = (hasError || videos.length === 0) && !isLoading 
    ? mockVideos 
    : videos;

  return (
    <section className="w-full bg-[#0a0f16] py-20 px-4 sm:px-6 lg:px-8 font-sans border-t border-slate-800/60">
      <div className="max-w-[1200px] mx-auto">
        <div className="mb-12 md:mb-16">
          <div className="flex items-center gap-2 mb-3">
            <ShieldCheck size={20} className="text-[#29abe2]" />
            <h2 className="text-[#e8edf2] text-[15px] md:text-[16px] tracking-[0.15em] font-bold uppercase">
              Smart Shopping Insights
            </h2>
          </div>
          <p className="text-[#8b95a3] text-[16px] md:text-[18px] font-medium max-w-[700px] leading-relaxed">
            Master the negotiation, spot hidden dealership fees, and choose high-reliability vehicles with advice from top automotive consumer advocates.
          </p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8 md:gap-6 lg:gap-8">
          {isLoading ? (
            // Skeleton Loading State
            Array.from({ length: 4 }).map((_, idx) => (
              <div key={idx} className="flex flex-col bg-[#121822] rounded-2xl overflow-hidden border border-[#1f2937] animate-pulse">
                <div className="aspect-video w-full bg-[#1f2937]"></div>
                <div className="p-6 flex flex-col flex-grow">
                  <div className="h-6 w-full bg-[#1f2937] rounded-md mb-3"></div>
                  <div className="h-6 w-2/3 bg-[#1f2937] rounded-md mb-6"></div>
                  <div className="h-4 w-32 bg-[#1f2937] rounded-md mt-auto"></div>
                </div>
              </div>
            ))
          ) : (
            // Loaded State
            displayVideos.map((video) => (
              <a 
                key={video.id}
                href={video.sourceUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="group flex flex-col bg-[#121822] rounded-2xl overflow-hidden border border-[#1f2937] hover:border-[#2d3b4f] transition-all duration-300 hover:-translate-y-1.5 hover:scale-[1.01] hover:shadow-2xl hover:shadow-black/50"
              >
                {/* Video Thumbnail Wrapper */}
                <div className="relative aspect-video w-full overflow-hidden bg-[#000]">
                  <img 
                    src={video.imageUrl} 
                    alt={video.title}
                    className="w-full h-full object-cover transition-transform duration-700 ease-out group-hover:scale-105"
                    onError={(e) => {
                      e.currentTarget.src = FALLBACK_THUMBNAIL;
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

                  {/* Channel Badge */}
                  <div className="absolute top-4 left-4">
                    <span className="inline-flex items-center px-3 py-1.5 rounded-lg bg-black/60 backdrop-blur-md text-white text-[11px] font-bold uppercase tracking-wider border border-white/10 shadow-sm">
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
                  <h3 className="text-[#e8edf2] text-[18px] font-bold leading-snug mb-5 line-clamp-2 group-hover:text-[#29abe2] transition-colors duration-200">
                    {video.title}
                  </h3>
                  
                  <div className="flex items-center gap-1.5 text-[#8b95a3] text-[14px] font-bold group-hover:text-[#e8edf2] transition-colors mt-auto uppercase tracking-wider">
                    Watch Guide
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
