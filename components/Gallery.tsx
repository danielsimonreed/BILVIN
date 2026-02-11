import React, { useState, useCallback, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

// All gallery images including new photos and GIFs
const GALLERY_IMAGES = [
  // New bilvin webp images
  '/images/bilvin (1).webp',
  '/images/bilvin (2).webp',
  '/images/bilvin (3).webp',
  '/images/bilvin (4).webp',
  '/images/bilvin (5).webp',
  '/images/bilvin (6).webp',
  '/images/bilvin (7).webp',
  '/images/bilvin (8).webp',
  '/images/bilvin (9).webp',
  '/images/bilvin (10).webp',
  '/images/bilvin (11).webp',
  '/images/bilvin (12).webp',
  '/images/bilvin (13).webp',
  '/images/bilvin (14).webp',
  '/images/bilvin (15).webp',
  '/images/bilvin (16).webp',
  '/images/bilvin (17).webp',
  '/images/bilvin (18).webp',
  '/images/bilvin (19).webp',
  '/images/bilvin (20).webp',
  '/images/bilvin (21).webp',
  '/images/bilvin (22).webp',
  '/images/bilvin (23).webp',
  '/images/bilvin (24).webp',
  '/images/bilvin (25).webp',
  '/images/bilvin (26).webp',
  // GIFs
  '/images/gif1.gif',
  '/images/gif2.gif',
  '/images/gif3.gif',
  '/images/gif4.gif',
  '/images/gif5.gif',
  // Other photos
  '/images/jadian.jpg',
  '/images/photos3.jpg',
  '/images/photos8.jpg',
  '/images/photos10.jpg',
  '/images/photo12.jpg',
];

const Gallery: React.FC = () => {
  const [selectedIndex, setSelectedIndex] = useState<number | null>(null);
  const [touchStart, setTouchStart] = useState<number | null>(null);
  const [touchEnd, setTouchEnd] = useState<number | null>(null);

  // Minimum swipe distance
  const minSwipeDistance = 50;

  const openPreview = (index: number) => {
    setSelectedIndex(index);
  };

  const closePreview = () => {
    setSelectedIndex(null);
  };

  const goNext = useCallback(() => {
    if (selectedIndex !== null) {
      setSelectedIndex((prev) =>
        prev !== null ? (prev + 1) % GALLERY_IMAGES.length : 0
      );
    }
  }, [selectedIndex]);

  const goPrev = useCallback(() => {
    if (selectedIndex !== null) {
      setSelectedIndex((prev) =>
        prev !== null ? (prev - 1 + GALLERY_IMAGES.length) % GALLERY_IMAGES.length : 0
      );
    }
  }, [selectedIndex]);

  // Keyboard navigation
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (selectedIndex === null) return;

      if (e.key === 'ArrowRight') goNext();
      else if (e.key === 'ArrowLeft') goPrev();
      else if (e.key === 'Escape') closePreview();
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [selectedIndex, goNext, goPrev]);

  // Touch handlers for swipe
  const onTouchStart = (e: React.TouchEvent) => {
    setTouchEnd(null);
    setTouchStart(e.targetTouches[0].clientX);
  };

  const onTouchMove = (e: React.TouchEvent) => {
    setTouchEnd(e.targetTouches[0].clientX);
  };

  const onTouchEnd = () => {
    if (!touchStart || !touchEnd) return;

    const distance = touchStart - touchEnd;
    const isLeftSwipe = distance > minSwipeDistance;
    const isRightSwipe = distance < -minSwipeDistance;

    if (isLeftSwipe) goNext();
    if (isRightSwipe) goPrev();
  };

  // Check if image is a GIF
  const isGif = (src: string) => src.toLowerCase().endsWith('.gif');

  // Split images into rows for the "Wall of Marquees"
  const chunkSize = Math.ceil(GALLERY_IMAGES.length / 4);
  const rows = [
    GALLERY_IMAGES.slice(0, chunkSize),
    GALLERY_IMAGES.slice(chunkSize, chunkSize * 2),
    GALLERY_IMAGES.slice(chunkSize * 2, chunkSize * 3),
    GALLERY_IMAGES.slice(chunkSize * 3)
  ];

  const renderMarqueeRow = (images: string[], direction: 'left' | 'right', speed: number, rowIndex: number) => {
    // Duplicate multiple times to ensure it covers wide screens and loops smoothly without gaps
    const marqueeImages = [...images, ...images, ...images, ...images];

    return (
      <div
        key={rowIndex}
        className="relative w-full overflow-hidden group py-2 sm:py-4"
        style={{
          maskImage: 'linear-gradient(to right, transparent 0%, black 15%, black 85%, transparent 100%)',
          WebkitMaskImage: 'linear-gradient(to right, transparent 0%, black 15%, black 85%, transparent 100%)',
        }}
      >
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

        <div className={`marquee-track-${rowIndex} px-4 opacity-85`}>
          {marqueeImages.map((imageSrc, index) => (
            <div
              key={`${rowIndex}-${index}`}
              className="flex-shrink-0 relative w-64 h-40 sm:w-80 sm:h-52 rounded-xl overflow-hidden cursor-pointer hover:scale-105 hover:opacity-100 transition-all duration-300 border border-white/20 dark:border-white/10 hover:border-rose-400/60 shadow-lg hover:shadow-2xl hover:shadow-rose-500/20"
              onClick={() => {
                // Find original index for the lightbox
                const originalIndex = GALLERY_IMAGES.indexOf(imageSrc);
                if (originalIndex !== -1) openPreview(originalIndex);
              }}
            >
              <img
                src={imageSrc}
                alt={`Gallery ${index}`}
                className="w-full h-full object-cover"
                loading="lazy"
              />
              {isGif(imageSrc) && (
                <div className="absolute top-3 left-3 px-2 py-1 rounded-full bg-rose-500/90 text-white text-[10px] font-bold uppercase tracking-wider shadow-sm">
                  GIF
                </div>
              )}
            </div>
          ))}
        </div>
      </div>
    );
  };

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="pt-20 pb-32 overflow-x-hidden min-h-screen"
    >
      <div className="text-center mb-10 px-4 pt-6">
        <h1 className="font-serif text-3xl md:text-5xl text-stone-800 dark:text-rose-50 mb-2 drop-shadow-sm">Our Gallery</h1>
        <p className="font-sans text-stone-500 text-sm md:text-base italic">Galeri milik Bilvin 💕</p>
        <p className="font-sans text-rose-400 font-medium text-xs mt-2 bg-white/50 dark:bg-black/20 inline-block px-3 py-1 rounded-full backdrop-blur-sm shadow-sm">{GALLERY_IMAGES.length} momen bersamamu</p>
      </div>

      <div className="flex flex-col space-y-8 md:space-y-12 py-6">
        {renderMarqueeRow(rows[0], 'left', 120, 0)}
        {renderMarqueeRow(rows[1], 'right', 140, 1)}
        {renderMarqueeRow(rows[2], 'left', 130, 2)}
        {rows[3].length > 0 && renderMarqueeRow(rows[3], 'right', 150, 3)}
      </div>

      {/* Fullscreen Image Preview Modal */}
      <AnimatePresence>
        {selectedIndex !== null && (
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
            {/* Close button */}
            <button
              onClick={closePreview}
              className="absolute top-4 right-4 z-50 w-10 h-10 rounded-full bg-white/10 backdrop-blur-sm flex items-center justify-center text-white hover:bg-white/20 transition-colors"
            >
              <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>

            {/* Image counter */}
            <div className="absolute top-4 left-4 z-50 px-3 py-1.5 rounded-full bg-white/10 backdrop-blur-sm text-white text-sm font-medium flex items-center gap-2">
              <span>{selectedIndex + 1} / {GALLERY_IMAGES.length}</span>
              {isGif(GALLERY_IMAGES[selectedIndex]) && (
                <span className="px-1.5 py-0.5 rounded bg-rose-500 text-[10px] font-bold">GIF</span>
              )}
            </div>

            {/* Previous button */}
            <button
              onClick={(e) => { e.stopPropagation(); goPrev(); }}
              className="absolute left-2 sm:left-4 z-50 w-10 h-10 sm:w-12 sm:h-12 rounded-full bg-white/10 backdrop-blur-sm flex items-center justify-center text-white hover:bg-white/20 transition-colors"
            >
              <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
              </svg>
            </button>

            {/* Next button */}
            <button
              onClick={(e) => { e.stopPropagation(); goNext(); }}
              className="absolute right-2 sm:right-4 z-50 w-10 h-10 sm:w-12 sm:h-12 rounded-full bg-white/10 backdrop-blur-sm flex items-center justify-center text-white hover:bg-white/20 transition-colors"
            >
              <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
              </svg>
            </button>

            {/* Main Image */}
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
                src={GALLERY_IMAGES[selectedIndex]}
                alt={`Photo ${selectedIndex + 1}`}
                className="max-w-full max-h-[80vh] object-contain rounded-lg shadow-2xl"
              />
            </motion.div>

            {/* Swipe hint for mobile */}
            <div className="absolute bottom-6 left-1/2 -translate-x-1/2 text-white/50 text-xs flex items-center gap-2 sm:hidden">
              <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 16l-4-4m0 0l4-4m-4 4h18" />
              </svg>
              <span>Swipe untuk navigasi</span>
              <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 8l4 4m0 0l-4 4m4-4H3" />
              </svg>
            </div>

            {/* Thumbnail strip at bottom - only show first 10 for performance */}
            <div className="absolute bottom-4 left-1/2 -translate-x-1/2 hidden sm:flex gap-2 px-4 py-2 bg-black/50 backdrop-blur-sm rounded-full max-w-[90vw] overflow-x-auto">
              {GALLERY_IMAGES.slice(0, 15).map((imageSrc, index) => (
                <button
                  key={index}
                  onClick={(e) => { e.stopPropagation(); setSelectedIndex(index); }}
                  className={`w-12 h-8 flex-shrink-0 rounded overflow-hidden transition-all duration-200 ${index === selectedIndex
                    ? 'ring-2 ring-rose-500 scale-110'
                    : 'opacity-50 hover:opacity-100'
                    }`}
                >
                  <img
                    src={imageSrc}
                    alt={`Thumbnail ${index + 1}`}
                    className="w-full h-full object-cover"
                  />
                </button>
              ))}
              {GALLERY_IMAGES.length > 15 && (
                <div className="w-12 h-8 flex-shrink-0 rounded bg-white/10 flex items-center justify-center text-white text-xs">
                  +{GALLERY_IMAGES.length - 15}
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