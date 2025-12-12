import React from 'react';
import { motion } from 'framer-motion';
import { PLAYLIST } from '../constants';

interface MusicPageProps {
  isPlaying: boolean;
  onTogglePlay: () => void;
  onNext: () => void;
  onPrev: () => void;
  currentTrackIndex: number;
  volume: number;
  onVolumeChange: (volume: number) => void;
}

const MusicPage: React.FC<MusicPageProps> = ({
  isPlaying,
  onTogglePlay,
  onNext,
  onPrev,
  currentTrackIndex,
  volume,
  onVolumeChange
}) => {
  const currentSong = PLAYLIST[currentTrackIndex];

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0 }}
      className="pt-20 px-8 pb-32 h-full flex flex-col items-center"
    >
      <h1 className="font-serif text-3xl text-stone-800 dark:text-rose-50 mb-10">Our Playlist</h1>

      {/* Vinyl Record */}
      <div className="relative w-64 h-64 mb-12">
        <motion.div
          animate={{ rotate: isPlaying ? 360 : 0 }}
          transition={{ duration: 3, repeat: Infinity, ease: "linear", repeatType: "loop" }}
          className={`w-full h-full rounded-full bg-stone-900 dark:bg-black shadow-2xl flex items-center justify-center border-4 border-stone-800 dark:border-slate-800`}
        >
          {/* Vinyl Grooves */}
          <div className="absolute inset-2 rounded-full border border-stone-800 opacity-50" />
          <div className="absolute inset-8 rounded-full border border-stone-800 opacity-50" />
          <div className="absolute inset-16 rounded-full border border-stone-800 opacity-50" />

          {/* Label */}
          <div className="w-24 h-24 rounded-full bg-rose-300 flex items-center justify-center relative overflow-hidden">
            <motion.div
              className="absolute inset-0 bg-gradient-to-tr from-rose-400 to-rose-200"
              animate={{ rotate: isPlaying ? 360 : 0 }}
              transition={{ duration: 3, repeat: Infinity, ease: "linear" }}
            />
            <span className="relative text-[8px] font-bold text-rose-900 tracking-widest uppercase z-10">BILVIN Records</span>
          </div>
        </motion.div>

        {/* Tone arm simulation */}
        <motion.div
          animate={{ rotate: isPlaying ? 25 : 0 }}
          className="absolute -top-10 -right-10 w-32 h-40 origin-top-right transition-transform duration-700"
        >
          <svg width="100%" height="100%" viewBox="0 0 100 120">
            <path d="M90,10 L90,30 L40,100" stroke="#57534e" strokeWidth="6" fill="none" />
            <circle cx="90" cy="10" r="10" fill="#292524" />
            <rect x="35" y="95" width="12" height="18" fill="#1c1917" />
          </svg>
        </motion.div>
      </div>

      {/* Track Info */}
      <div className="text-center mb-8 h-16">
        <motion.div
          key={currentTrackIndex}
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
        >
          <h3 className="font-bold text-xl text-stone-800 dark:text-white mb-2">{currentSong.title}</h3>
          <p className="text-rose-500 dark:text-rose-400 text-sm">{currentSong.artist}</p>
        </motion.div>
      </div>

      {/* Volume Control */}
      <div className="w-full max-w-xs mb-8 flex items-center gap-4">
        <svg className="text-stone-400" width="20" height="20" viewBox="0 0 24 24" fill="currentColor">
          <path d="M7 9v6h4l5 5V4l-5 5H7z" />
        </svg>
        <input
          type="range"
          min="0"
          max="1"
          step="0.01"
          value={volume}
          onChange={(e) => onVolumeChange(parseFloat(e.target.value))}
          className="w-full h-2 bg-stone-200 dark:bg-stone-700 rounded-lg appearance-none cursor-pointer accent-rose-500"
        />
        <svg className="text-stone-400" width="20" height="20" viewBox="0 0 24 24" fill="currentColor">
          <path d="M7 9v6h4l5 5V4l-5 5H7zM15.5 12c0-1.77-1.02-3.29-2.5-4.03v8.05c1.48-.73 2.5-2.25 2.5-4.02zM14 3.23v2.06c2.89.86 5 3.54 5 6.71s-2.11 5.85-5 6.71v2.06c4.01-.91 7-4.49 7-8.77s-2.99-7.86-7-8.77z" />
        </svg>
      </div>

      {/* Controls */}
      <div className="flex items-center gap-8">
        <button
          onClick={onPrev}
          className="text-stone-400 hover:text-stone-600 dark:text-slate-500 dark:hover:text-slate-300 transition-colors"
        >
          <svg width="32" height="32" viewBox="0 0 24 24" fill="currentColor"><path d="M6 6h2v12H6zm3.5 6l8.5 6V6z" /></svg>
        </button>

        <button
          onClick={onTogglePlay}
          className="w-16 h-16 rounded-full bg-rose-500 text-white flex items-center justify-center shadow-lg hover:scale-105 active:scale-95 transition-transform"
        >
          {isPlaying ? (
            <svg width="32" height="32" viewBox="0 0 24 24" fill="currentColor"><path d="M6 19h4V5H6v14zm8-14v14h4V5h-4z" /></svg>
          ) : (
            <svg width="32" height="32" viewBox="0 0 24 24" fill="currentColor"><path d="M8 5v14l11-7z" /></svg>
          )}
        </button>

        <button
          onClick={onNext}
          className="text-stone-400 hover:text-stone-600 dark:text-slate-500 dark:hover:text-slate-300 transition-colors"
        >
          <svg width="32" height="32" viewBox="0 0 24 24" fill="currentColor"><path d="M6 18l8.5-6L6 6v12zM16 6v12h2V6h-2z" /></svg>
        </button>
      </div>

      <p className="mt-auto text-xs text-stone-400/50 italic mb-4">
        Ensure files are in public/music/
      </p>
    </motion.div>
  );
};

export default MusicPage;