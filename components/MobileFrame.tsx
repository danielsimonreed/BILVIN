import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import HeartBurst, { BurstProps } from './HeartBurst';

interface MobileFrameProps {
  children: React.ReactNode;
  bottomBar?: React.ReactNode;
  notification?: React.ReactNode; // Added notification prop
  isDarkMode?: boolean;
  onScroll?: (e: React.UIEvent<HTMLDivElement>) => void;
  scrollRef?: React.RefObject<HTMLDivElement>;
  textSize?: 'sm' | 'md' | 'lg';
}

const MobileFrame: React.FC<MobileFrameProps> = ({
  children,
  bottomBar,
  notification,
  isDarkMode = false,
  onScroll,
  scrollRef,
  textSize = 'md'
}) => {
  const [bursts, setBursts] = useState<BurstProps[]>([]);

  const addBurst = (e: React.MouseEvent | React.TouchEvent) => {
    // Get coordinates relative to the viewport
    let clientX, clientY;
    if ('touches' in e) {
      clientX = e.touches[0].clientX;
      clientY = e.touches[0].clientY;
    } else {
      clientX = (e as React.MouseEvent).clientX;
      clientY = (e as React.MouseEvent).clientY;
    }

    const newBurst: BurstProps = {
      id: Date.now(),
      x: clientX,
      y: clientY,
      onComplete: (id) => {
        setBursts((prev) => prev.filter((b) => b.id !== id));
      },
    };
    setBursts((prev) => [...prev, newBurst]);
  };

  const textSizeClass = {
    sm: 'text-sm',
    md: 'text-base',
    lg: 'text-lg'
  }[textSize];

  return (
    <div className={`min-h-screen w-full flex justify-center items-start bg-stone-100 dark:bg-black font-sans text-stone-800 ${isDarkMode ? 'dark' : ''} ${textSizeClass}`}>
      {/* Global Particle Container */}
      {bursts.map(burst => (
        <HeartBurst key={burst.id} {...burst} />
      ))}

      {/* 
        Container that simulates a mobile screen on desktop.
        On mobile, it takes full width/height.
        Uses 100dvh for proper mobile sizing.
      */}
      <motion.div
        initial={{
          opacity: 0,
          backgroundColor: isDarkMode ? '#0f172a' : '#FFF5F5'
        }}
        animate={{
          opacity: 1,
          backgroundColor: isDarkMode ? '#0f172a' : '#FFF5F5' // Rose White vs Slate 900
        }}
        transition={{ duration: 0.8 }}
        className="w-full max-w-[430px] h-[100dvh] shadow-2xl relative overflow-hidden flex flex-col"
        onClick={addBurst}
      >
        {/* Main Content Area - Scrollable */}
        <div
          ref={scrollRef}
          className="flex-1 relative w-full overflow-y-auto no-scrollbar scroll-smooth z-10"
          onScroll={onScroll}
        >
          <div className="absolute inset-0 min-h-full">
            {children}
          </div>
        </div>

        {/* 
          Foreground Cloud Bank at the bottom 
          Fixed position relative to the frame so content scrolls BEHIND it.
          Changes color based on Dark Mode.
        */}


        {/* Bottom Nav Bar Slot - Fixed absolute to simulate phone UI */}
        {bottomBar && (
          <div className="absolute bottom-0 left-0 right-0 z-50 pointer-events-none">
            {/* Wrapper to allow pointer events on the bar itself */}
            <div className="w-full h-full pointer-events-auto">
              {bottomBar}
            </div>
          </div>
        )}

        {/* Notification Slot - Fixed at top */}
        {notification}


      </motion.div>
    </div>
  );
};

export default MobileFrame;