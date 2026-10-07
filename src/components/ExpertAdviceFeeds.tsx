import React, { useRef, useState, useEffect } from 'react';
import { PlayCircle, ExternalLink, ShieldCheck, Clock, ChevronLeft, ChevronRight } from 'lucide-react';

export interface VideoAdviceItem {
  id: string;
  title: string;
  sourceUrl: string;
  imageUrl: string;
  sourceName: string;
  publishedAt: string;
}

const FALLBACK_THUMBNAIL = "https://images.unsplash.com/photo-1549317661-bd32c8ce0db2?auto=format&fit=crop&w=800&q=80";

const curatedVideos: VideoAdviceItem[] = [
  {
    id: "curated-005",
    title: "Leasing vs Buying a Car in the US — The Real Math Nobody Shows You",
    sourceUrl: "https://youtu.be/0qwfPCGgu6c?si=7HrwQ3NePjQ4H-TD",
    imageUrl: "https://img.youtube.com/vi/0qwfPCGgu6c/maxresdefault.jpg",
    sourceName: "Business Mechanics",
    publishedAt: "2026-09-15"
  },
  {
    id: "curated-006",
    title: "How Car Dealerships Scam America",
    sourceUrl: "https://youtu.be/GREaEG_0Xcw?si=b14jv1hE5vj8cKIe",
    imageUrl: "https://img.youtube.com/vi/GREaEG_0Xcw/maxresdefault.jpg",
    sourceName: "Wendover Productions",
    publishedAt: "2026-08-20"
  },
  {
    id: "curated-007",
    title: "NEW Lexus Dealership Scams That You MUST Avoid!",
    sourceUrl: "https://www.youtube.com/watch?v=XFgmf08knEo",
    imageUrl: "https://img.youtube.com/vi/XFgmf08knEo/maxresdefault.jpg",
    sourceName: "Everything Lexus",
    publishedAt: "2026-09-02"
  },
  {
    id: "curated-001",
    title: "How to Negotiate Like a PRO at a Dealership",
    sourceUrl: "https://youtu.be/iZLflOeCCyU?si=yDOMe1OmiIl0rM85",
    imageUrl: "https://img.youtube.com/vi/iZLflOeCCyU/maxresdefault.jpg",
    sourceName: "Inside Car Guys",
    publishedAt: "2026-06-20"
  },
  {
    id: "curated-002",
    title: "The $3,000 Trick Dealers Use on Every Buyer",
    sourceUrl: "https://youtu.be/WPrUW148vvg?si=rKWkgz_XLijQvGir",
    imageUrl: "https://img.youtube.com/vi/WPrUW148vvg/maxresdefault.jpg",
    sourceName: "Webb Finance",
    publishedAt: "2026-04-24T13:30:05-07:00"
  },
  {
    id: "curated-003",
    title: "Never Trade Your Car Without Watching This",
    sourceUrl: "https://www.youtube.com/watch?v=sW6px6cYZKI",
    imageUrl: "https://img.youtube.com/vi/sW6px6cYZKI/maxresdefault.jpg",
    sourceName: "The Car Guy Chronicles",
    publishedAt: "2026-06-28T16:30:36-07:00"
  },
  {
    id: "curated-004",
    title: "I Sold Cars for 15 Years — These 5 Fees Are Designed to Trick You",
    sourceUrl: "https://www.youtube.com/watch?v=ouuyY7o7Nxc",
    imageUrl: "https://img.youtube.com/vi/ouuyY7o7Nxc/maxresdefault.jpg",
    sourceName: "Auto Insider",
    publishedAt: "2026-06-16T12:56:42-07:00"
  }
];

// Helper to format the pubDate safely
function formatPubDate(dateStr: string) {
  try {
    const d = new Date(dateStr);
    if (isNaN(d.getTime())) return dateStr || "Recently";
    return d.toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' });
  } catch (e) {
    return dateStr || "Recently";
  }
}

export default function ExpertAdviceFeeds() {
  const displayVideos = curatedVideos;
  const isLoading = false;
  const scrollContainerRef = useRef<HTMLDivElement>(null);
  const [canScrollLeft, setCanScrollLeft] = useState(false);
  const [canScrollRight, setCanScrollRight] = useState(true);

  const checkScroll = () => {
    const el = scrollContainerRef.current;
    if (!el) return;
    setCanScrollLeft(el.scrollLeft > 10);
    setCanScrollRight(el.scrollLeft < el.scrollWidth - el.clientWidth - 10);
  };

  useEffect(() => {
    checkScroll();
    const el = scrollContainerRef.current;
    if (el) {
      el.addEventListener('scroll', checkScroll, { passive: true });
      window.addEventListener('resize', checkScroll);
      return () => {
        el.removeEventListener('scroll', checkScroll);
        window.removeEventListener('resize', checkScroll);
      };
    }
  }, []);

  const scroll = (direction: 'left' | 'right') => {
    const el = scrollContainerRef.current;
    if (!el) return;
    const scrollAmount = el.clientWidth * 0.75;
    el.scrollBy({
      left: direction === 'left' ? -scrollAmount : scrollAmount,
      behavior: 'smooth'
    });
  };

  return (
    <section className="w-full bg-[#0a0f16] py-20 px-4 sm:px-6 lg:px-8 font-sans border-t border-slate-800/60">
      <div className="max-w-[1200px] mx-auto">
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 mb-10 md:mb-12">
          <div>
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

          {/* Navigation Controls in Header */}
          <div className="flex items-center gap-2.5 shrink-0">
            <button
              onClick={() => scroll('left')}
              disabled={!canScrollLeft}
              className={`p-2.5 rounded-xl border transition-all duration-200 cursor-pointer ${
                canScrollLeft
                  ? 'bg-slate-900/80 hover:bg-slate-800 border-slate-700 hover:border-[#29abe2] text-white shadow-lg shadow-black/30 hover:scale-105 active:scale-95'
                  : 'bg-slate-900/40 border-slate-800/60 text-slate-600 cursor-not-allowed opacity-40'
              }`}
              aria-label="Previous videos"
            >
              <ChevronLeft size={20} />
            </button>
            <button
              onClick={() => scroll('right')}
              disabled={!canScrollRight}
              className={`p-2.5 rounded-xl border transition-all duration-200 cursor-pointer ${
                canScrollRight
                  ? 'bg-slate-900/80 hover:bg-slate-800 border-slate-700 hover:border-[#29abe2] text-white shadow-lg shadow-black/30 hover:scale-105 active:scale-95'
                  : 'bg-slate-900/40 border-slate-800/60 text-slate-600 cursor-not-allowed opacity-40'
              }`}
              aria-label="Next videos"
            >
              <ChevronRight size={20} />
            </button>
          </div>
        </div>

        {/* Carousel Container with Side Floating Arrows */}
        <div className="relative group/carousel">
          {/* Left Side Floating Arrow */}
          <button
            onClick={() => scroll('left')}
            disabled={!canScrollLeft}
            className={`hidden md:flex absolute -left-5 top-1/2 -translate-y-1/2 z-20 w-11 h-11 rounded-full items-center justify-center backdrop-blur-xl bg-slate-950/90 border border-slate-700 hover:border-[#29abe2] text-white shadow-2xl transition-all duration-200 hover:scale-110 active:scale-95 cursor-pointer ${
              canScrollLeft ? 'opacity-100 hover:bg-slate-900' : 'opacity-0 pointer-events-none'
            }`}
            aria-label="Scroll left"
          >
            <ChevronLeft size={22} />
          </button>

          {/* Right Side Floating Arrow */}
          <button
            onClick={() => scroll('right')}
            disabled={!canScrollRight}
            className={`hidden md:flex absolute -right-5 top-1/2 -translate-y-1/2 z-20 w-11 h-11 rounded-full items-center justify-center backdrop-blur-xl bg-slate-950/90 border border-slate-700 hover:border-[#29abe2] text-white shadow-2xl transition-all duration-200 hover:scale-110 active:scale-95 cursor-pointer ${
              canScrollRight ? 'opacity-100 hover:bg-slate-900' : 'opacity-0 pointer-events-none'
            }`}
            aria-label="Scroll right"
          >
            <ChevronRight size={22} />
          </button>

          {/* Scrollable Track */}
          <div
            ref={scrollContainerRef}
            className="flex gap-6 overflow-x-auto scroll-smooth snap-x snap-mandatory pb-4 pt-1 px-1 [scrollbar-width:none] [-ms-overflow-style:none] [&::-webkit-scrollbar]:hidden"
          >
            {isLoading ? (
              // Skeleton Loading State
              Array.from({ length: 4 }).map((_, idx) => (
                <div key={idx} className="w-[85vw] sm:w-[calc(50%-12px)] lg:w-[calc(25%-18px)] flex-shrink-0 flex flex-col bg-[#121822] rounded-2xl overflow-hidden border border-[#1f2937] animate-pulse">
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
                  className="w-[85vw] sm:w-[calc(50%-12px)] lg:w-[calc(25%-18px)] flex-shrink-0 snap-start group flex flex-col bg-[#121822] rounded-2xl overflow-hidden border border-[#1f2937] hover:border-[#2d3b4f] transition-all duration-300 hover:-translate-y-1.5 hover:scale-[1.01] hover:shadow-2xl hover:shadow-black/50"
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
      </div>
    </section>
  );
}
