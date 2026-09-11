import React, { useState, useEffect } from 'react';
import { Clock, ExternalLink } from 'lucide-react';

export interface AutomotiveArticle {
  id: string;
  title: string;
  summary: string;
  sourceName: string;
  sourceUrl: string;
  imageUrl: string;
  publishedAt: string;
}

const FALLBACK_IMAGE = "https://images.unsplash.com/photo-1552519507-da3b142c6e3d?auto=format&fit=crop&w=800&q=80";

const mockArticles: AutomotiveArticle[] = [
  {
    id: "art-001",
    title: "Maximizing Your Trade-In Value Before the 2026 Model Year Drop",
    summary: "As the 2026 inventory starts rolling in, dealership lots are getting crowded. Here are the top three strategies to ensure you get top dollar for your used vehicle today.",
    sourceName: "Motor1",
    sourceUrl: "https://www.motor1.com",
    imageUrl: "https://images.unsplash.com/photo-1552519507-da3b142c6e3d?auto=format&fit=crop&w=800&q=80",
    publishedAt: "2 Hours Ago"
  },
  {
    id: "art-002",
    title: "The High-Mileage Market: Why 100k is the New 50k",
    summary: "Modern engineering has fundamentally changed the depreciation curve. Discover why buyers are increasingly seeking out well-maintained, high-mileage vehicles as smart investments.",
    sourceName: "Edmunds",
    sourceUrl: "https://www.edmunds.com",
    imageUrl: "https://images.unsplash.com/photo-1549317661-bd32c8ce0db2?auto=format&fit=crop&w=800&q=80",
    publishedAt: "5 Hours Ago"
  },
  {
    id: "art-003",
    title: "Electric SUV Buying Guide: Range, Towing, and Total Cost of Ownership",
    summary: "Comparing the top fully-electric midsize SUVs of the year. From charging infrastructure realities to real-world highway range tests, here's everything you need to know before going electric.",
    sourceName: "Car and Driver",
    sourceUrl: "https://www.caranddriver.com",
    imageUrl: "https://images.unsplash.com/photo-1560958089-b8a1929cea89?auto=format&fit=crop&w=800&q=80",
    publishedAt: "1 Day Ago"
  },
  {
    id: "art-004",
    title: "10 Best Interiors Under $40,000",
    summary: "You don't need a luxury budget to get a premium cabin. Here are the cars that punch way above their weight class in interior quality.",
    sourceName: "MotorTrend",
    sourceUrl: "https://www.motortrend.com",
    imageUrl: "https://images.unsplash.com/photo-1492144534655-ae79c964c9d7?auto=format&fit=crop&w=800&q=80",
    publishedAt: "2 Days Ago"
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

// Strip HTML tags from RSS summaries/descriptions
function stripHtml(html: string) {
  const tmp = document.createElement('DIV');
  tmp.innerHTML = html;
  return tmp.textContent || tmp.innerText || '';
}

export default function LatestArticles() {
  const [articles, setArticles] = useState<AutomotiveArticle[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [hasError, setHasError] = useState(false);

  useEffect(() => {
    const fetchArticles = async () => {
      try {
        const res = await fetch('https://api.rss2json.com/v1/api.json?rss_url=https://www.edmunds.com/feeds/rss/car-news.xml');
        if (!res.ok) throw new Error("Network response was not ok");
        
        const data = await res.json();
        
        if (data.status !== "ok" || !data.items || data.items.length === 0) {
          throw new Error("Invalid feed structure or no items");
        }

        const topThree = data.items.slice(0, 4).map((item: any) => ({
          id: item.guid || item.link,
          title: stripHtml(item.title),
          summary: stripHtml(item.description).substring(0, 150) + "...",
          sourceName: "Edmunds",
          sourceUrl: item.link,
          imageUrl: item.thumbnail || (item.enclosure && item.enclosure.link) || FALLBACK_IMAGE,
          publishedAt: formatPubDate(item.pubDate)
        }));

        setArticles(topThree);
      } catch (err) {
        console.error("Failed to load RSS feed, falling back to static data.", err);
        setHasError(true);
      } finally {
        setIsLoading(false);
      }
    };

    fetchArticles();
  }, []);

  // Determine what list to render based on loading/error states
  const displayArticles = (hasError || articles.length === 0) && !isLoading 
    ? mockArticles 
    : articles;

  return (
    <section className="w-full bg-[#0d1117] border-t border-slate-800 py-20 px-4 sm:px-6 lg:px-8 font-sans">
      <div className="max-w-[1200px] mx-auto">
        <div className="mb-12 md:mb-16">
          <h2 className="text-[#e8edf2] text-[15px] md:text-[16px] tracking-[0.15em] font-bold uppercase mb-3">
            Latest From The Auto World
          </h2>
          <p className="text-[#8b95a3] text-[16px] md:text-[18px] font-medium max-w-[600px] leading-relaxed">
            Stay informed with market insights, valuation trends, and car buying advice from trusted industry experts.
          </p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8 md:gap-6 lg:gap-8">
          {isLoading ? (
            // Skeleton Loading State
            Array.from({ length: 4 }).map((_, idx) => (
              <div key={idx} className="flex flex-col bg-[#161d26] rounded-2xl overflow-hidden border border-[#232c38] animate-pulse">
                <div className="aspect-[16/10] w-full bg-[#232c38]"></div>
                <div className="p-6 flex flex-col flex-grow">
                  <div className="flex gap-3 mb-4">
                    <div className="h-6 w-16 bg-[#232c38] rounded-md"></div>
                    <div className="h-6 w-24 bg-[#232c38] rounded-md"></div>
                  </div>
                  <div className="h-6 w-full bg-[#232c38] rounded-md mb-2"></div>
                  <div className="h-6 w-3/4 bg-[#232c38] rounded-md mb-6"></div>
                  <div className="h-4 w-full bg-[#232c38] rounded-md mb-2 mt-auto"></div>
                  <div className="h-4 w-5/6 bg-[#232c38] rounded-md"></div>
                </div>
              </div>
            ))
          ) : (
            // Loaded or Fallback State
            displayArticles.map((article) => (
              <a 
                key={article.id}
                href={article.sourceUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="group flex flex-col bg-[#161d26] rounded-2xl overflow-hidden border border-[#232c38] hover:border-[#384656] transition-all duration-300 hover:-translate-y-1 hover:shadow-xl hover:shadow-black/40"
              >
                {/* Image Skeleton / Wrapper */}
                <div className="relative aspect-[16/10] w-full overflow-hidden bg-[#0a0d12]">
                  <img 
                    src={article.imageUrl} 
                    alt={article.title}
                    className="w-full h-full object-cover transition-transform duration-700 ease-out group-hover:scale-105"
                    onError={(e) => {
                      // Fallback if the dynamically loaded image link is broken
                      e.currentTarget.src = FALLBACK_IMAGE;
                    }}
                  />
                  {/* Subtle overlay gradient for image depth */}
                  <div className="absolute inset-0 bg-gradient-to-t from-[#161d26] via-transparent to-transparent opacity-60"></div>
                </div>

                {/* Card Content */}
                <div className="p-6 flex flex-col flex-grow">
                  <div className="flex items-center gap-3 mb-4">
                    <span className="inline-flex items-center justify-center px-2.5 py-1 rounded-md bg-[#29abe2]/10 text-[#29abe2] text-[11px] font-bold uppercase tracking-wider">
                      {article.sourceName}
                    </span>
                    <span className="flex items-center gap-1.5 text-[#7d8896] text-[12px] font-medium">
                      <Clock size={12} />
                      {article.publishedAt}
                    </span>
                  </div>

                  <h3 className="text-[#e8edf2] text-[18px] font-bold leading-snug mb-3 line-clamp-2 group-hover:text-[#29abe2] transition-colors duration-200">
                    {article.title}
                  </h3>
                  
                  <p className="text-[#8b95a3] text-[14px] leading-relaxed line-clamp-2 mb-6 flex-grow">
                    {article.summary}
                  </p>

                  <div className="flex items-center gap-1.5 text-[#e8edf2] text-[13px] font-bold group-hover:text-[#29abe2] transition-colors mt-auto">
                    Read Full Article
                    <ExternalLink size={14} className="ml-1 opacity-70 group-hover:opacity-100 group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition-all" />
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
