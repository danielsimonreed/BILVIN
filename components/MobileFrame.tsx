import React from 'react';
import { motion } from 'framer-motion';

interface MobileFrameProps {
  children: React.ReactNode;
  bottomBar?: React.ReactNode;
  isDarkMode?: boolean;
}

const MobileFrame: React.FC<MobileFrameProps> = ({ children, bottomBar, isDarkMode = false }) => {
  return (
    <div className={`min-h-screen w-full flex justify-center items-start bg-stone-100 dark:bg-black font-sans text-stone-800 ${isDarkMode ? 'dark' : ''}`}>
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
      >
        {/* Main Content Area - Scrollable */}
        <div className="flex-1 relative w-full overflow-y-auto no-scrollbar scroll-smooth z-10">
          <div className="absolute inset-0 min-h-full">
             {children}
          </div>
        </div>

        {/* 
          Foreground Cloud Bank at the bottom 
          Fixed position relative to the frame so content scrolls BEHIND it.
          Changes color based on Dark Mode.
        */}
        <div className="absolute bottom-0 left-0 right-0 z-20 pointer-events-none">
           {/* Layer 1 - Bigger, behind */}
           <motion.div 
             animate={{ 
               x: [0, 15, 0],
               color: isDarkMode ? '#0f172a' : '#FFF5F5'
             }}
             transition={{ x: { duration: 10, repeat: Infinity, ease: "easeInOut" }, color: { duration: 0.8 } }}
             className="absolute bottom-0 w-[130%] -left-10 opacity-90 text-[#FFF5F5]"
           >
              <svg viewBox="0 0 1440 320" className="w-full h-auto block transform scale-y-150 origin-bottom">
                <path fill="currentColor" fillOpacity="1" d="M0,224L48,213.3C96,203,192,181,288,181.3C384,181,480,203,576,224C672,245,768,267,864,261.3C960,256,1056,224,1152,197.3C1248,171,1344,149,1392,138.7L1440,128L1440,320L1392,320C1344,320,1248,320,1152,320C1056,320,960,320,864,320C768,320,672,320,576,320C480,320,384,320,288,320C192,320,96,320,48,320L0,320Z"></path>
              </svg>
           </motion.div>

           {/* Layer 2 - Main front clouds */}
           <motion.div 
              animate={{ 
                x: [0, -20, 0],
                color: isDarkMode ? '#0f172a' : '#FFF5F5'
              }}
              transition={{ x: { duration: 8, repeat: Infinity, ease: "easeInOut" }, color: { duration: 0.8 } }}
              className="relative w-[130%] -left-5 text-[#FFF5F5]"
           >
              <svg viewBox="0 0 1440 320" className="w-full h-auto block transform scale-y-125 origin-bottom">
                 <path fill="currentColor" fillOpacity="1" d="M0,192L48,197.3C96,203,192,213,288,229.3C384,245,480,267,576,250.7C672,235,768,181,864,181.3C960,181,1056,235,1152,234.7C1248,235,1344,181,1392,154.7L1440,128L1440,320L1392,320C1344,320,1248,320,1152,320C1056,320,960,320,864,320C768,320,672,320,576,320C480,320,384,320,288,320C192,320,96,320,48,320L0,320Z"></path>
              </svg>
           </motion.div>
        </div>

        {/* Bottom Nav Bar Slot - Fixed absolute to simulate phone UI */}
        {bottomBar && (
          <div className="absolute bottom-0 left-0 right-0 z-50 pointer-events-none">
             {/* Wrapper to allow pointer events on the bar itself */}
             <div className="w-full h-full pointer-events-auto">
               {bottomBar}
             </div>
          </div>
        )}

      </motion.div>
    </div>
  );
};

export default MobileFrame;