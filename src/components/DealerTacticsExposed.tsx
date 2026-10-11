import React, { useRef, useState, useEffect } from 'react';
import { Play, ChevronLeft, ChevronRight, ExternalLink, X, Flame, ShieldAlert } from 'lucide-react';

export interface DealerTacticShort {
  id: string;
  title: string;
  author: string;
  url: string;
  thumbnail: string;
  tag?: string;
}

export const DEALER_TACTICS_SHORTS: DealerTacticShort[] = [
  {
    id: "Lg3edHCXoVk",
    title: "Car Dealership Caught Trying to Scam Buyer",
    author: "UP&SMOKE TV",
    url: "https://www.youtube.com/shorts/Lg3edHCXoVk",
    thumbnail: "https://i.ytimg.com/vi/Lg3edHCXoVk/hqdefault.jpg",
    tag: "CAUGHT ON TAPE"
  },
  {
    id: "Sp7VqALBQxk",
    title: "Car Dealers Just Lost Their Tricks 🚗🚫",
    author: "Fatherhood Voices",
    url: "https://www.youtube.com/shorts/Sp7VqALBQxk",
    thumbnail: "https://i.ytimg.com/vi/Sp7VqALBQxk/hqdefault.jpg",
    tag: "RULES & REGS"
  },
  {
    id: "Q9_WlNNyoQY",
    title: "Uncovered The Craziest Dealership Scam Ever!",
    author: "George J Saliba",
    url: "https://www.youtube.com/shorts/Q9_WlNNyoQY",
    thumbnail: "https://i.ytimg.com/vi/Q9_WlNNyoQY/hqdefault.jpg",
    tag: "FINANCE TRAP"
  },
  {
    id: "fN0bgS74nIQ",
    title: "What's The Most Common Dealership Scam?",
    author: "Genuine Automotive",
    url: "https://www.youtube.com/shorts/fN0bgS74nIQ",
    thumbnail: "https://i.ytimg.com/vi/fN0bgS74nIQ/hqdefault.jpg",
    tag: "SERVICE & SALES"
  },
  {
    id: "s16J5TkU-d4",
    title: "Dealership Refused to Give Car After Being Paid $51,500!",
    author: "LoadingNY",
    url: "https://www.youtube.com/shorts/s16J5TkU-d4",
    thumbnail: "https://i.ytimg.com/vi/s16J5TkU-d4/hqdefault.jpg",
    tag: "DELIVERY HOLD"
  },
  {
    id: "tq1eCKEx0Jc",
    title: "How Car Dealerships Scam You at the Desk",
    author: "RussFlipsWhips",
    url: "https://www.youtube.com/shorts/tq1eCKEx0Jc",
    thumbnail: "https://i.ytimg.com/vi/tq1eCKEx0Jc/hqdefault.jpg",
    tag: "DESK TACTICS"
  },
  {
    id: "TTEkBMJhsZQ",
    title: "Car Dealer and CarGurus Get Caught Red Handed",
    author: "CarEdge",
    url: "https://www.youtube.com/shorts/TTEkBMJhsZQ",
    thumbnail: "https://i.ytimg.com/vi/TTEkBMJhsZQ/hqdefault.jpg",
    tag: "PRICE BAIT"
  },
  {
    id: "t7M1bCi6Ce8",
    title: "I Caught a Dealership Trying to Scam My Customer",
    author: "Motor Michael",
    url: "https://www.youtube.com/shorts/t7M1bCi6Ce8",
    thumbnail: "https://i.ytimg.com/vi/t7M1bCi6Ce8/hqdefault.jpg",
    tag: "ADD-ON TRAPS"
  },
  {
    id: "ZCTi050ahpI",
    title: "5 Dealer Scams That Cost You Thousands",
    author: "Car Haggle Helper",
    url: "https://www.youtube.com/shorts/ZCTi050ahpI",
    thumbnail: "https://i.ytimg.com/vi/ZCTi050ahpI/hqdefault.jpg",
    tag: "OUT-THE-DOOR"
  }
];

export default function DealerTacticsExposed() {
  const scrollContainerRef = useRef<HTMLDivElement>(null);
  const [canScrollLeft, setCanScrollLeft] = useState(false);
  const [canScrollRight, setCanScrollRight] = useState(true);
  const [activeVideo, setActiveVideo] = useState<DealerTacticShort | null>(null);

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

  // Keyboard navigation for modal
  useEffect(() => {
    if (!activeVideo) return;
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') setActiveVideo(null);
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [activeVideo]);

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
    <section className="w-full bg-[#06090e] py-16 sm:py-20 px-4 sm:px-6 lg:px-8 font-poppins border-t border-slate-800/60 relative overflow-hidden">
      {/* Ambient decorative glow */}
      <div className="absolute top-0 left-1/4 w-96 h-96 bg-rose-500/5 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute bottom-0 right-1/4 w-96 h-96 bg-amber-500/5 rounded-full blur-3xl pointer-events-none" />

      <div className="max-w-[1200px] mx-auto relative z-10">
        {/* Section Header */}
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 mb-8 md:mb-10">
          <div>
            <div className="flex items-center gap-2 mb-2.5">
              <span className="w-6 h-6 rounded-lg bg-rose-500/15 border border-rose-500/30 text-rose-400 flex items-center justify-center">
                <Flame size={14} className="animate-pulse" />
              </span>
              <h2 className="text-[#e8edf2] text-[13px] md:text-[14px] tracking-[0.18em] font-bold uppercase">
                Dealer Tactics Exposed
              </h2>
              <span className="px-2 py-0.5 rounded-full text-[9px] font-extrabold uppercase tracking-widest bg-rose-500/15 border border-rose-500/30 text-rose-300">
                SHORTS
              </span>
            </div>
            <p className="text-[#8b95a3] text-sm sm:text-base font-medium max-w-[680px] leading-relaxed">
              Real-world undercover clips, hidden-fee callouts, and consumer confrontations revealing how dealership desks manipulate numbers.
            </p>
          </div>

          {/* Carousel Arrow Controls in Header */}
          <div className="flex items-center gap-2 shrink-0">
            <button
              onClick={() => scroll('left')}
              disabled={!canScrollLeft}
              className={`p-2 sm:p-2.5 rounded-xl border transition-all duration-200 cursor-pointer ${
                canScrollLeft
                  ? 'bg-slate-900/90 hover:bg-slate-800 border-slate-700 hover:border-rose-500/60 text-white shadow-lg shadow-black/40 hover:scale-105 active:scale-95'
                  : 'bg-slate-900/40 border-slate-800/60 text-slate-600 cursor-not-allowed opacity-30'
              }`}
              aria-label="Previous shorts"
            >
              <ChevronLeft size={19} />
            </button>
            <button
              onClick={() => scroll('right')}
              disabled={!canScrollRight}
              className={`p-2 sm:p-2.5 rounded-xl border transition-all duration-200 cursor-pointer ${
                canScrollRight
                  ? 'bg-slate-900/90 hover:bg-slate-800 border-slate-700 hover:border-rose-500/60 text-white shadow-lg shadow-black/40 hover:scale-105 active:scale-95'
                  : 'bg-slate-900/40 border-slate-800/60 text-slate-600 cursor-not-allowed opacity-30'
              }`}
              aria-label="Next shorts"
            >
              <ChevronRight size={19} />
            </button>
          </div>
        </div>

        {/* Carousel Container with Side Floating Arrows */}
        <div className="relative group/carousel">
          {/* Left Side Floating Arrow */}
          <button
            onClick={() => scroll('left')}
            disabled={!canScrollLeft}
            className={`hidden md:flex absolute -left-4 top-1/2 -translate-y-1/2 z-20 w-10 h-10 rounded-full items-center justify-center backdrop-blur-xl bg-slate-950/90 border border-slate-700 hover:border-rose-500 text-white shadow-2xl transition-all duration-200 hover:scale-110 active:scale-95 cursor-pointer ${
              canScrollLeft ? 'opacity-100 hover:bg-slate-900' : 'opacity-0 pointer-events-none'
            }`}
            aria-label="Scroll left"
          >
            <ChevronLeft size={20} />
          </button>

          {/* Right Side Floating Arrow */}
          <button
            onClick={() => scroll('right')}
            disabled={!canScrollRight}
            className={`hidden md:flex absolute -right-4 top-1/2 -translate-y-1/2 z-20 w-10 h-10 rounded-full items-center justify-center backdrop-blur-xl bg-slate-950/90 border border-slate-700 hover:border-rose-500 text-white shadow-2xl transition-all duration-200 hover:scale-110 active:scale-95 cursor-pointer ${
              canScrollRight ? 'opacity-100 hover:bg-slate-900' : 'opacity-0 pointer-events-none'
            }`}
            aria-label="Scroll right"
          >
            <ChevronRight size={20} />
          </button>

          {/* Scrollable Track - Cards Glide Off-Screen */}
          <div
            ref={scrollContainerRef}
            className="flex gap-4 sm:gap-5 overflow-x-auto scroll-smooth snap-x snap-mandatory pb-4 pt-1 px-1 [scrollbar-width:none] [-ms-overflow-style:none] [&::-webkit-scrollbar]:hidden"
          >
            {DEALER_TACTICS_SHORTS.map((video) => (
              <div
                key={video.id}
                onClick={() => setActiveVideo(video)}
                className="w-[200px] sm:w-[220px] md:w-[230px] shrink-0 snap-start group cursor-pointer relative flex flex-col rounded-2xl overflow-hidden bg-slate-950 border border-slate-800/80 hover:border-rose-500/50 hover:shadow-[0_12px_32px_rgba(244,63,94,0.18)] transition-all duration-300 hover:-translate-y-1.5"
              >
                {/* Vertical 9:16 Media Wrapper */}
                <div className="relative aspect-[9/16] w-full overflow-hidden bg-black">
                  <img
                    src={video.thumbnail}
                    alt={video.title}
                    className="w-full h-full object-cover transition-transform duration-700 ease-out group-hover:scale-105"
                    loading="lazy"
                  />

                  {/* Gradient overlays */}
                  <div className="absolute inset-0 bg-gradient-to-t from-slate-950 via-slate-950/30 to-black/60 pointer-events-none" />

                  {/* Top Badges */}
                  <div className="absolute top-2.5 inset-x-2.5 flex items-center justify-between z-10">
                    <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[9px] font-extrabold uppercase tracking-wider bg-black/70 backdrop-blur-md border border-white/15 text-rose-400">
                      <span className="w-1.5 h-1.5 rounded-full bg-rose-500 animate-pulse" />
                      {video.tag || 'EXPOSED'}
                    </span>

                    <span className="w-6 h-6 rounded-full bg-black/60 backdrop-blur-md border border-white/10 flex items-center justify-center text-white/70 group-hover:text-white group-hover:border-white/30 transition-colors">
                      <Play size={10} className="fill-white translate-x-0.5" />
                    </span>
                  </div>

                  {/* Centered Play Button on Hover */}
                  <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-all duration-300 pointer-events-none">
                    <div className="w-13 h-13 rounded-full bg-rose-600/90 text-white flex items-center justify-center shadow-xl shadow-rose-950/80 group-hover:scale-110 transition-transform">
                      <Play size={22} className="fill-white translate-x-0.5" />
                    </div>
                  </div>

                  {/* Bottom Content Over Thumbnail */}
                  <div className="absolute bottom-0 inset-x-0 p-3.5 z-10">
                    <div className="text-[10px] font-bold text-slate-300 uppercase tracking-wider truncate mb-1">
                      {video.author}
                    </div>
                    <h3 className="text-xs sm:text-[13px] font-bold text-white line-clamp-2 leading-snug group-hover:text-rose-300 transition-colors">
                      {video.title}
                    </h3>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Video Modal Player */}
      {activeVideo && (
        <div 
          className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md animate-fadeIn"
          onClick={() => setActiveVideo(null)}
        >
          <div 
            className="relative w-full max-w-sm rounded-3xl bg-slate-950 border border-slate-800 shadow-[0_25px_60px_-15px_rgba(0,0,0,0.95)] overflow-hidden"
            onClick={(e) => e.stopPropagation()}
          >
            {/* Modal Top Bar */}
            <div className="flex items-center justify-between p-3.5 border-b border-slate-800/80 bg-slate-900/60">
              <div className="flex items-center gap-2 truncate pr-2">
                <span className="w-2 h-2 rounded-full bg-rose-500 animate-pulse shrink-0" />
                <span className="text-xs font-bold text-slate-200 truncate">
                  {activeVideo.title}
                </span>
              </div>
              <div className="flex items-center gap-1 shrink-0">
                <a
                  href={activeVideo.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="p-1.5 rounded-lg text-slate-400 hover:text-white hover:bg-white/10 transition-colors"
                  title="Open on YouTube"
                >
                  <ExternalLink size={15} />
                </a>
                <button
                  onClick={() => setActiveVideo(null)}
                  className="p-1.5 rounded-lg text-slate-400 hover:text-white hover:bg-white/10 transition-colors cursor-pointer"
                  aria-label="Close video"
                >
                  <X size={17} />
                </button>
              </div>
            </div>

            {/* 9:16 Shorts Video Embed */}
            <div className="relative aspect-[9/16] w-full bg-black">
              <iframe
                src={`https://www.youtube.com/embed/${activeVideo.id}?autoplay=1&rel=0&modestbranding=1`}
                title={activeVideo.title}
                className="w-full h-full border-0"
                allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
                allowFullScreen
              />
            </div>

            {/* Modal Footer */}
            <div className="p-3 border-t border-slate-800/80 bg-slate-900/60 flex items-center justify-between text-xs">
              <span className="text-slate-400 font-medium truncate">
                By {activeVideo.author}
              </span>
              <a
                href={activeVideo.url}
                target="_blank"
                rel="noopener noreferrer"
                className="text-rose-400 hover:text-rose-300 font-semibold flex items-center gap-1 transition-colors shrink-0"
              >
                <span>Watch on YouTube</span>
                <ExternalLink size={12} />
              </a>
            </div>
          </div>
        </div>
      )}
    </section>
  );
}
