import React, { useState, useCallback, useEffect, useMemo, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

interface GalleryItem {
  src: string;
  isGif: boolean;
}

const GALLERY_ITEMS: GalleryItem[] = [
  { src: '/images/bilvin (1).webp', isGif: false },
  { src: '/images/bilvin (2).webp', isGif: false },
  { src: '/images/bilvin (3).webp', isGif: false },
  { src: '/images/bilvin (4).webp', isGif: false },
  { src: '/images/bilvin (5).webp', isGif: false },
  { src: '/images/bilvin (6).webp', isGif: false },
  { src: '/images/bilvin (7).webp', isGif: false },
  { src: '/images/bilvin (8).webp', isGif: false },
  { src: '/images/bilvin (9).webp', isGif: false },
  { src: '/images/bilvin (10).webp', isGif: false },
  { src: '/images/bilvin (11).webp', isGif: false },
  { src: '/images/bilvin (12).webp', isGif: false },
  { src: '/images/bilvin (13).webp', isGif: false },
  { src: '/images/bilvin (14).webp', isGif: false },
  { src: '/images/bilvin (15).webp', isGif: false },
  { src: '/images/bilvin (16).webp', isGif: false },
  { src: '/images/bilvin (17).webp', isGif: false },
  { src: '/images/bilvin (18).webp', isGif: false },
  { src: '/images/bilvin (19).webp', isGif: false },
  { src: '/images/bilvin (20).webp', isGif: false },
  { src: '/images/bilvin (21).webp', isGif: false },
  { src: '/images/bilvin (22).webp', isGif: false },
  { src: '/images/bilvin (23).webp', isGif: false },
  { src: '/images/bilvin (24).webp', isGif: false },
  { src: '/images/bilvin (25).webp', isGif: false },
  { src: '/images/bilvin (26).webp', isGif: false },
  { src: '/images/gif1.gif', isGif: true },
  { src: '/images/gif2.gif', isGif: true },
  { src: '/images/gif3.gif', isGif: true },
  { src: '/images/gif4.gif', isGif: true },
  { src: '/images/gif5.gif', isGif: true },
  { src: '/images/jadian.jpg', isGif: false },
  { src: '/images/photos3.jpg', isGif: false },
  { src: '/images/photos8.jpg', isGif: false },
  { src: '/images/photos10.jpg', isGif: false },
  { src: '/images/photo12.jpg', isGif: false },
];

const THUMBNAIL_LIMIT = 15;
const ROW_HEIGHT = '240px';

const useNearViewport = () => {
  const ref = useRef<HTMLDivElement | null>(null);
  const [isNearViewport, setIsNearViewport] = useState(false);

  useEffect(() => {
    const node = ref.current;
    if (!node || typeof IntersectionObserver === 'undefined') {
      setIsNearViewport(true);
      return;
    }

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setIsNearViewport(true);
          observer.disconnect();
        }
      },
      { rootMargin: '300px 0px' }
    );

    observer.observe(node);

    return () => observer.disconnect();
  }, []);

  return { ref, isNearViewport };
};

interface MarqueeRowProps {
  direction: 'left' | 'right';
  items: GalleryItem[];
  onOpen: (index: number) => void;
  rowIndex: number;
  speed: number;
  startIndex: number;
}

const MarqueeRow: React.FC<MarqueeRowProps> = React.memo(({
  direction,
  items,
  onOpen,
  rowIndex,
  speed,
  startIndex
}) => {
  const { ref, isNearViewport } = useNearViewport();
  const marqueeItems = useMemo(() => [...items, ...items], [items]);

  return (
    <div
      ref={ref}
      className="relative w-full overflow-hidden group py-2 sm:py-4"
      style={{
        minHeight: ROW_HEIGHT,
        maskImage: 'linear-gradient(to right, transparent 0%, black 15%, black 85%, transparent 100%)',
        WebkitMaskImage: 'linear-gradient(to right, transparent 0%, black 15%, black 85%, transparent 100%)',
      }}
    >
      {isNearViewport ? (
        <>
          <style>{`
            @keyframes scroll-${rowIndex} {
              0% { transform: translateX(${direction === 'left' ? '0' : '-50%'}); }
              100% { transform: translateX(${direction === 'left' ? '-50%' : '0'}); }
            }
            .marquee-track-${rowIndex} {
              animation: scroll-${rowIndex} ${speed}s linear infinite;
              width: max-content;
              display: flex;
              gap: 1.5rem;
            }
            .marquee-track-${rowIndex}:hover {
              animation-play-state: paused;
            }
          `}</style>

          <div className={`marquee-track-${rowIndex} px-4 opacity-85`} style={{ willChange: 'transform' }}>
            {marqueeItems.map((item, index) => {
              const originalIndex = startIndex + (index % items.length);

              return (
                <div
                  key={`${rowIndex}-${index}-${item.src}`}
                  className="flex-shrink-0 relative w-64 h-40 sm:w-80 sm:h-52 rounded-xl overflow-hidden cursor-pointer hover:scale-105 hover:opacity-100 transition-all duration-300 border border-white/20 dark:border-white/10 hover:border-rose-400/60 shadow-lg hover:shadow-2xl hover:shadow-rose-500/20"
                  onClick={() => onOpen(originalIndex)}
                  style={{ contentVisibility: 'auto', containIntrinsicSize: '320px 208px' }}
                >
                  <img
                    src={item.src}
                    alt={`Gallery ${originalIndex + 1}`}
                    className="w-full h-full object-cover"
                    loading="lazy"
                    decoding="async"
                    fetchPriority="low"
                    draggable={false}
                  />
                  {item.isGif && (
                    <div className="absolute top-3 left-3 px-2 py-1 rounded-full bg-rose-500/90 text-white text-[10px] font-bold uppercase tracking-wider shadow-sm">
                      GIF
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        </>
      ) : (
        <div className="w-full" />
      )}
    </div>
  );
});

const Gallery: React.FC = () => {
  const [selectedIndex, setSelectedIndex] = useState<number | null>(null);
  const [touchStart, setTouchStart] = useState<number | null>(null);
  const [touchEnd, setTouchEnd] = useState<number | null>(null);

  const minSwipeDistance = 50;

  const rows = useMemo(() => {
    const chunkSize = Math.ceil(GALLERY_ITEMS.length / 4);
    return [
      GALLERY_ITEMS.slice(0, chunkSize),
      GALLERY_ITEMS.slice(chunkSize, chunkSize * 2),
      GALLERY_ITEMS.slice(chunkSize * 2, chunkSize * 3),
      GALLERY_ITEMS.slice(chunkSize * 3)
    ];
  }, []);

  const rowStartIndexes = useMemo(() => {
    const starts: number[] = [];
    let offset = 0;

    rows.forEach((row) => {
      starts.push(offset);
      offset += row.length;
    });

    return starts;
  }, [rows]);

  const openPreview = useCallback((index: number) => {
    setSelectedIndex(index);
  }, []);

  const closePreview = useCallback(() => {
    setSelectedIndex(null);
  }, []);

  const goNext = useCallback(() => {
    setSelectedIndex((prev) =>
      prev !== null ? (prev + 1) % GALLERY_ITEMS.length : 0
    );
  }, []);

  const goPrev = useCallback(() => {
    setSelectedIndex((prev) =>
      prev !== null ? (prev - 1 + GALLERY_ITEMS.length) % GALLERY_ITEMS.length : 0
    );
  }, []);

  useEffect(() => {
    if (selectedIndex === null) {
      return undefined;
    }

    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'ArrowRight') goNext();
      else if (e.key === 'ArrowLeft') goPrev();
      else if (e.key === 'Escape') closePreview();
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [selectedIndex, goNext, goPrev, closePreview]);

  const onTouchStart = (e: React.TouchEvent) => {
    setTouchEnd(null);
    setTouchStart(e.targetTouches[0].clientX);
  };

  const onTouchMove = (e: React.TouchEvent) => {
    setTouchEnd(e.targetTouches[0].clientX);
  };

  const onTouchEnd = () => {
    if (!touchStart || !touchEnd) {
      return;
    }

    const distance = touchStart - touchEnd;
    const isLeftSwipe = distance > minSwipeDistance;
    const isRightSwipe = distance < -minSwipeDistance;

    if (isLeftSwipe) goNext();
    if (isRightSwipe) goPrev();
  };

  const visibleThumbnails = useMemo(
    () => GALLERY_ITEMS.slice(0, THUMBNAIL_LIMIT),
    []
  );

  const currentItem = selectedIndex !== null ? GALLERY_ITEMS[selectedIndex] : null;

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="pt-20 pb-32 overflow-x-hidden min-h-screen"
    >
      <div className="text-center mb-10 px-4 pt-6">
        <h1 className="font-serif text-3xl md:text-5xl text-stone-800 dark:text-rose-50 mb-2 drop-shadow-sm">Our Gallery</h1>
        <p className="font-sans text-stone-500 text-sm md:text-base italic">Galeri milik Bilvin ðŸ’•</p>
        <p className="font-sans text-rose-400 font-medium text-xs mt-2 bg-white/50 dark:bg-black/20 inline-block px-3 py-1 rounded-full backdrop-blur-sm shadow-sm">{GALLERY_ITEMS.length} momen bersamamu</p>
      </div>

      <div className="flex flex-col space-y-8 md:space-y-12 py-6">
        <MarqueeRow direction="left" items={rows[0]} onOpen={openPreview} rowIndex={0} speed={120} startIndex={rowStartIndexes[0]} />
        <MarqueeRow direction="right" items={rows[1]} onOpen={openPreview} rowIndex={1} speed={140} startIndex={rowStartIndexes[1]} />
        <MarqueeRow direction="left" items={rows[2]} onOpen={openPreview} rowIndex={2} speed={130} startIndex={rowStartIndexes[2]} />
        {rows[3].length > 0 && (
          <MarqueeRow direction="right" items={rows[3]} onOpen={openPreview} rowIndex={3} speed={150} startIndex={rowStartIndexes[3]} />
        )}
      </div>

      <AnimatePresence>
        {selectedIndex !== null && currentItem && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 bg-black/95 flex items-center justify-center"
            onClick={closePreview}
            onTouchStart={onTouchStart}
            onTouchMove={onTouchMove}
            onTouchEnd={onTouchEnd}
          >
            <button
              onClick={closePreview}
              className="absolute top-4 right-4 z-50 w-10 h-10 rounded-full bg-white/10 backdrop-blur-sm flex items-center justify-center text-white hover:bg-white/20 transition-colors"
            >
              <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>

            <div className="absolute top-4 left-4 z-50 px-3 py-1.5 rounded-full bg-white/10 backdrop-blur-sm text-white text-sm font-medium flex items-center gap-2">
              <span>{selectedIndex + 1} / {GALLERY_ITEMS.length}</span>
              {currentItem.isGif && (
                <span className="px-1.5 py-0.5 rounded bg-rose-500 text-[10px] font-bold">GIF</span>
              )}
            </div>

            <button
              onClick={(e) => { e.stopPropagation(); goPrev(); }}
              className="absolute left-2 sm:left-4 z-50 w-10 h-10 sm:w-12 sm:h-12 rounded-full bg-white/10 backdrop-blur-sm flex items-center justify-center text-white hover:bg-white/20 transition-colors"
            >
              <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
              </svg>
            </button>

            <button
              onClick={(e) => { e.stopPropagation(); goNext(); }}
              className="absolute right-2 sm:right-4 z-50 w-10 h-10 sm:w-12 sm:h-12 rounded-full bg-white/10 backdrop-blur-sm flex items-center justify-center text-white hover:bg-white/20 transition-colors"
            >
              <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
              </svg>
            </button>

            <motion.div
              key={selectedIndex}
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.9 }}
              transition={{ duration: 0.2 }}
              className="max-w-[90vw] max-h-[80vh] flex items-center justify-center"
              onClick={(e) => e.stopPropagation()}
            >
              <img
                src={currentItem.src}
                alt={`Photo ${selectedIndex + 1}`}
                className="max-w-full max-h-[80vh] object-contain rounded-lg shadow-2xl"
                decoding="async"
                draggable={false}
              />
            </motion.div>

            <div className="absolute bottom-6 left-1/2 -translate-x-1/2 text-white/50 text-xs flex items-center gap-2 sm:hidden">
              <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 16l-4-4m0 0l4-4m-4 4h18" />
              </svg>
              <span>Swipe untuk navigasi</span>
              <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 8l4 4m0 0l-4 4m4-4H3" />
              </svg>
            </div>

            <div className="absolute bottom-4 left-1/2 -translate-x-1/2 hidden sm:flex gap-2 px-4 py-2 bg-black/50 backdrop-blur-sm rounded-full max-w-[90vw] overflow-x-auto">
              {visibleThumbnails.map((item, index) => (
                <button
                  key={`${item.src}-${index}`}
                  onClick={(e) => { e.stopPropagation(); setSelectedIndex(index); }}
                  className={`w-12 h-8 flex-shrink-0 rounded overflow-hidden transition-all duration-200 ${index === selectedIndex
                    ? 'ring-2 ring-rose-500 scale-110'
                    : 'opacity-50 hover:opacity-100'
                    }`}
                >
                  <img
                    src={item.src}
                    alt={`Thumbnail ${index + 1}`}
                    className="w-full h-full object-cover"
                    loading="lazy"
                    decoding="async"
                    draggable={false}
                  />
                </button>
              ))}
              {GALLERY_ITEMS.length > THUMBNAIL_LIMIT && (
                <div className="w-12 h-8 flex-shrink-0 rounded bg-white/10 flex items-center justify-center text-white text-xs">
                  +{GALLERY_ITEMS.length - THUMBNAIL_LIMIT}
                </div>
              )}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  );
};

export default Gallery;
