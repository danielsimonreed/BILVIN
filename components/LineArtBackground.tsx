import React from 'react';
import { motion, useScroll, useTransform, MotionValue } from 'framer-motion';

interface LineArtBackgroundProps {
  isDarkMode?: boolean;
}

// Cloud Component with Parallax
interface CloudProps {
  className?: string;
  delay?: number;
  duration?: number;
  scale?: number;
  y?: number;
  opacity?: number;
  parallaxFactor?: number;
  scrollY: MotionValue<number>;
}

const Cloud: React.FC<CloudProps> = ({
  className = "",
  delay = 0,
  duration = 20,
  scale = 1,
  y = 0,
  opacity = 0.8,
  parallaxFactor = 0.2,
  scrollY
}) => {
  const yMotion = useTransform(scrollY, [0, 2000], [y, y + (2000 * parallaxFactor)]);

  return (
    <motion.div
      className={`absolute ${className}`}
      initial={{ x: "-100%" }}
      animate={{ x: "400%" }}
      transition={{
        duration: duration,
        repeat: Infinity,
        delay: delay,
        ease: "linear"
      }}
      style={{ scale, opacity, y: yMotion }}
    >
      <svg width="100" height="60" viewBox="0 0 100 60" fill="currentColor" className="text-white filter blur-[2px]">
        <path d="M25,60.2c-8.3,0-15-6.7-15-15c0-8.3,6.7-15,15-15c0.8,0,1.6,0.1,2.4,0.2c2.8-12,13.6-21,26.4-21c11.9,0,22.1,7.8,25.7,18.7c2.2-0.8,4.6-1.3,7.1-1.3c11,0,20,9,20,20c0,11-9,20-20,20H25z" />
      </svg>
    </motion.div>
  );
};

const Star: React.FC<{ style: any; delay: number; duration: number }> = ({ style, delay, duration }) => (
  <motion.div
    className="absolute bg-white rounded-full shadow-[0_0_3px_rgba(255,255,255,0.8)]"
    style={style}
    animate={{
      opacity: [0.2, 0.8, 0.2],
      scale: [0.8, 1.2, 0.8]
    }}
    transition={{
      duration: duration,
      delay: delay,
      repeat: Infinity,
      ease: "easeInOut"
    }}
  />
);

const LineArtBackground: React.FC<LineArtBackgroundProps> = ({ isDarkMode = false }) => {
  const { scrollY } = useScroll();

  const yFast = useTransform(scrollY, [0, 1000], [0, 150]);
  const ySlow = useTransform(scrollY, [0, 1000], [0, 80]);
  const yReverse = useTransform(scrollY, [0, 1000], [0, -50]);

  // Generate random stars
  const stars = React.useMemo(() => {
    return Array.from({ length: 50 }).map((_, i) => ({
      id: i,
      top: `${Math.random() * 100}%`,
      left: `${Math.random() * 100}%`,
      size: Math.random() > 0.7 ? 3 : 2, // Varied sizes
      delay: Math.random() * 5,
      duration: Math.random() * 3 + 2 // 2s to 5s duration
    }));
  }, []);

  return (
    <div className="fixed inset-0 z-0 pointer-events-none overflow-hidden h-full">

      {/* --- NIGHT MODE: Stars & Moon --- */}
      <motion.div
        className="absolute inset-0"
        animate={{ opacity: isDarkMode ? 1 : 0 }}
        transition={{ duration: 1.5 }}
      >
        {/* Twinkling Star Field */}
        {stars.map((star) => (
          <Star
            key={star.id}
            style={{
              top: star.top,
              left: star.left,
              width: star.size,
              height: star.size
            }}
            delay={star.delay}
            duration={star.duration}
          />
        ))}

        {/* Moon */}
        <motion.div
          className="absolute top-10 right-8 w-16 h-16 rounded-full bg-slate-100 shadow-[0_0_30px_rgba(255,255,255,0.4)]"
          animate={{ y: [0, -10, 0] }}
          transition={{ duration: 8, repeat: Infinity, ease: "easeInOut" }}
          style={{ y: ySlow }}
        >
          <div className="absolute top-2 left-3 w-3 h-3 rounded-full bg-slate-300 opacity-20" />
          <div className="absolute bottom-4 right-4 w-5 h-5 rounded-full bg-slate-300 opacity-20" />
          <div className="absolute top-6 left-8 w-2 h-2 rounded-full bg-slate-300 opacity-10" />
        </motion.div>
      </motion.div>


      {/* --- DAY MODE: Clouds --- */}
      <motion.div
        className="absolute inset-0"
        animate={{ opacity: isDarkMode ? 0 : 1 }}
        transition={{ duration: 1.5 }}
      >
        <Cloud delay={0} duration={45} scale={1.8} y={20} opacity={0.6} className="top-10" parallaxFactor={0.1} scrollY={scrollY} />
        <Cloud delay={20} duration={50} scale={2} y={-20} opacity={0.5} className="top-0" parallaxFactor={0.15} scrollY={scrollY} />
        <Cloud delay={5} duration={35} scale={1.2} y={250} opacity={0.7} parallaxFactor={0.3} scrollY={scrollY} />
        <Cloud delay={15} duration={38} scale={1.3} y={150} opacity={0.6} parallaxFactor={0.25} scrollY={scrollY} />
        <Cloud delay={8} duration={40} scale={1.4} y={350} opacity={0.5} parallaxFactor={0.35} scrollY={scrollY} />
        <Cloud delay={12} duration={28} scale={0.8} y={100} opacity={0.4} parallaxFactor={0.5} scrollY={scrollY} />
        <Cloud delay={25} duration={30} scale={0.9} y={400} opacity={0.4} parallaxFactor={0.45} scrollY={scrollY} />
        <Cloud delay={2} duration={50} scale={2.5} y={500} opacity={0.4} parallaxFactor={0.1} scrollY={scrollY} />
      </motion.div>


      {/* --- Universal Decorations (Hearts/Lines) - Color shifts --- */}

      {/* Top Right Heart */}
      <motion.svg
        width="40"
        height="40"
        viewBox="0 0 24 24"
        fill="currentColor"
        className="absolute top-10 right-[-5px] transition-colors duration-700"
        animate={{
          scale: [1, 1.1, 1],
          rotate: [0, 10, 0],
          color: isDarkMode ? '#cbd5e1' : '#fecdd3' // Slate 300 vs Rose 200
        }}
        transition={{ duration: 6, repeat: Infinity, ease: "easeInOut" }}
        style={{ y: ySlow, opacity: isDarkMode ? 0.3 : 0.4 }}
      >
        <path d="M12 21.35l-1.45-1.32C5.4 15.36 2 12.28 2 8.5 2 5.42 4.42 3 7.5 3c1.74 0 3.41.81 4.5 2.09C13.09 3.81 14.76 3 16.5 3 19.58 3 22 5.42 22 8.5c0 3.78-3.4 6.86-8.55 11.54L12 21.35z" />
      </motion.svg>

      {/* Floating Heart 1 */}
      <motion.div
        className={`absolute top-1/4 left-8 transition-colors duration-700 ${isDarkMode ? 'text-slate-500' : 'text-rose-300'} opacity-30`}
        style={{ y: yFast }}
      >
        <motion.div
          animate={{ opacity: [0.2, 0.4, 0.2], y: [0, -10, 0] }}
          transition={{ duration: 4, repeat: Infinity }}
        >
          <svg width="24" height="24" viewBox="0 0 24 24" fill="currentColor">
            <path d="M12 21.35l-1.45-1.32C5.4 15.36 2 12.28 2 8.5 2 5.42 4.42 3 7.5 3c1.74 0 3.41.81 4.5 2.09C13.09 3.81 14.76 3 16.5 3 19.58 3 22 5.42 22 8.5c0 3.78-3.4 6.86-8.55 11.54L12 21.35z" />
          </svg>
        </motion.div>
      </motion.div>
    </div>
  );
};

export default LineArtBackground;