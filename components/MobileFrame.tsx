import React from 'react';
import { motion } from 'framer-motion';
import { AnniversaryState } from '../lib/anniversary';

interface MobileFrameProps {
  children: React.ReactNode;
  bottomBar?: React.ReactNode;
  notification?: React.ReactNode; // Added notification prop
  isDarkMode?: boolean;
  anniversaryState?: AnniversaryState;
  onScroll?: (e: React.UIEvent<HTMLDivElement>) => void;
  scrollRef?: React.RefObject<HTMLDivElement>;
  textSize?: 'sm' | 'md' | 'lg';
}

const MobileFrame: React.FC<MobileFrameProps> = ({
  children,
  bottomBar,
  notification,
  isDarkMode = false,
  anniversaryState,
  onScroll,
  scrollRef,
  textSize = 'md'
}) => {

  const textSizeClass = {
    sm: 'text-sm',
    md: 'text-base',
    lg: 'text-lg'
  }[textSize];
  const anniversaryTier = anniversaryState?.anniversaryTier ?? 'none';
  const isAnniversary = anniversaryTier !== 'none';
  const isYearly = anniversaryTier === 'yearly';
  const shellBackground = isDarkMode
    ? isYearly
      ? '#120f1f'
      : isAnniversary
        ? '#13111f'
        : '#0f172a'
    : isYearly
      ? '#fff7e8'
      : isAnniversary
        ? '#fff2ed'
        : '#FFF5F5';
  const backdropClass = isDarkMode
    ? isYearly
      ? 'bg-[radial-gradient(circle_at_top,_rgba(251,191,36,0.14),_transparent_38%),linear-gradient(180deg,rgba(17,24,39,0.92),rgba(9,9,11,0.98))]'
      : isAnniversary
        ? 'bg-[radial-gradient(circle_at_top,_rgba(251,146,60,0.12),_transparent_34%),radial-gradient(circle_at_bottom,_rgba(244,63,94,0.12),_transparent_38%),linear-gradient(180deg,rgba(15,23,42,0.96),rgba(2,6,23,1))]'
        : ''
    : isYearly
      ? 'bg-[radial-gradient(circle_at_top,_rgba(251,191,36,0.24),_transparent_38%),linear-gradient(180deg,rgba(255,251,235,0.96),rgba(255,247,237,1))]'
      : isAnniversary
        ? 'bg-[radial-gradient(circle_at_top,_rgba(251,146,60,0.18),_transparent_34%),radial-gradient(circle_at_bottom,_rgba(244,63,94,0.12),_transparent_38%),linear-gradient(180deg,rgba(255,247,237,0.98),rgba(255,241,242,1))]'
        : '';

  return (
    <div className={`min-h-screen w-full flex justify-center items-start bg-stone-100 dark:bg-black font-sans text-stone-800 ${isDarkMode ? 'dark' : ''} ${textSizeClass}`}>

      {/* 
        Container that simulates a mobile screen on desktop.
        On mobile, it takes full width/height.
        Uses 100dvh for proper mobile sizing.
      */}
      <motion.div
        initial={{
          opacity: 0,
          backgroundColor: shellBackground
        }}
        animate={{
          opacity: 1,
          backgroundColor: shellBackground
        }}
        transition={{ duration: 0.8 }}
        className="w-full max-w-[430px] h-[100dvh] shadow-2xl relative overflow-hidden flex flex-col"
      >
        {/* Main Content Area - Scrollable */}
        <div
          ref={scrollRef}
          className="flex-1 relative w-full overflow-y-auto no-scrollbar scroll-smooth z-10"
          onScroll={onScroll}
        >
          <div className="relative w-full min-h-full">
            {isAnniversary && (
              <>
                <div
                  className={`pointer-events-none absolute inset-0 z-0 ${backdropClass}`}
                  aria-hidden="true"
                />
                <div
                  className={`pointer-events-none absolute inset-x-8 top-14 z-0 h-16 rounded-full blur-2xl ${
                    isYearly
                      ? 'bg-amber-300/18 dark:bg-amber-200/8'
                      : 'bg-rose-300/18 dark:bg-orange-300/8'
                  }`}
                  aria-hidden="true"
                />
              </>
            )}
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
          <div className="absolute bottom-0 left-0 right-0 z-[100] pointer-events-none">
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
