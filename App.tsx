import React, { useState, useEffect, useRef } from 'react';
import { AnimatePresence, MotionConfig } from 'framer-motion';
import MobileFrame from './components/MobileFrame';
import SecretGate from './components/SecretGate';
import Timeline from './components/Timeline';
import LineArtBackground from './components/LineArtBackground';
import BottomNav from './components/BottomNav';
import Gallery from './components/Gallery';
import MusicPage from './components/MusicPage';
import SettingsPage from './components/SettingsPage';
import SecretNotification from './components/SecretNotification';
import SecretMessagePage from './components/SecretMessagePage';
import FloatingMusicControl from './components/FloatingMusicControl';
import { PLAYLIST } from './constants';

type TabType = 'story' | 'gallery' | 'music' | 'settings';

const App: React.FC = () => {
  const [isUnlocked, setIsUnlocked] = useState(false);
  const [activeTab, setActiveTab] = useState<TabType>('story');
  // Set default to TRUE for Dark Mode
  const [isDarkMode, setIsDarkMode] = useState(true);

  // Secret feature states
  const [hasScrolled, setHasScrolled] = useState(false);
  const [showNotification, setShowNotification] = useState(false);
  const [showSecretPage, setShowSecretPage] = useState(false);
  const [isMenuCollapsed, setIsMenuCollapsed] = useState(false);
  const scrollRef = useRef<HTMLDivElement>(null);

  // Music Player State
  const [isPlaying, setIsPlaying] = useState(false);
  const [currentTrackIndex, setCurrentTrackIndex] = useState(0);
  const [volume, setVolume] = useState(0.6);
  const bgAudioRef = useRef<HTMLAudioElement | null>(null);

  // Music Controls
  const togglePlay = () => setIsPlaying(!isPlaying);
  const nextTrack = () => {
    setCurrentTrackIndex((prev) => (prev + 1) % PLAYLIST.length);
    setIsPlaying(true);
  };
  const prevTrack = () => {
    setCurrentTrackIndex((prev) => (prev - 1 + PLAYLIST.length) % PLAYLIST.length);
    setIsPlaying(true);
  };

  const handleVolumeChange = (newVolume: number) => {
    setVolume(newVolume);
    if (bgAudioRef.current) {
      bgAudioRef.current.volume = newVolume;
    }
  };

  const [textSize, setTextSize] = useState<'sm' | 'md' | 'lg'>(() => {
    if (typeof window !== 'undefined') {
      const saved = localStorage.getItem('bilvin-text-size');
      return (saved as 'sm' | 'md' | 'lg') || 'md';
    }
    return 'md';
  });

  const [reducedMotion, setReducedMotion] = useState(() => {
    if (typeof window !== 'undefined') {
      return localStorage.getItem('bilvin-reduced-motion') === 'true';
    }
    return false;
  });

  // Persist settings
  useEffect(() => {
    localStorage.setItem('bilvin-text-size', textSize);
  }, [textSize]);

  useEffect(() => {
    localStorage.setItem('bilvin-reduced-motion', String(reducedMotion));
  }, [reducedMotion]);

  // Toggle Dark Mode class on body
  useEffect(() => {
    if (isDarkMode) {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
  }, [isDarkMode]);

  const toggleTheme = () => setIsDarkMode(!isDarkMode);

  // Auto-play music when unlocked
  useEffect(() => {
    if (isUnlocked && bgAudioRef.current) {
      bgAudioRef.current.volume = volume; // Set initial volume
      bgAudioRef.current.play().catch(e => console.log("Auto-play failed:", e));
      setIsPlaying(true);
    }
  }, [isUnlocked]);

  // Handle Audio Playback
  useEffect(() => {
    if (bgAudioRef.current) {
      if (isPlaying) {
        bgAudioRef.current.play().catch(e => console.error("Playback failed", e));
      } else {
        bgAudioRef.current.pause();
      }
    }
  }, [isPlaying, currentTrackIndex]);

  // Handle scroll to trigger notification
  const handleScroll = (e: React.UIEvent<HTMLDivElement>) => {
    const { scrollTop, scrollHeight, clientHeight } = e.currentTarget;
    setIsMenuCollapsed(scrollTop > 50);

    if (!hasScrolled && isUnlocked) {
      // Calculate true scroll progress (0 to 1)
      const maxScroll = scrollHeight - clientHeight;
      const scrollPercentage = maxScroll > 0 ? scrollTop / maxScroll : 0;

      if (scrollPercentage > 0.8) {
        setHasScrolled(true);
        setShowNotification(true);
        const audio = new Audio('/notification.mp3');
        audio.play().catch(e => console.log('Audio play failed', e));
      }
    }
  };

  const handleNotificationClick = () => {
    setShowNotification(false);
    setShowSecretPage(true);
  };

  // Render the active view
  const renderContent = () => {
    if (showSecretPage) {
      return <SecretMessagePage onBack={() => setShowSecretPage(false)} />;
    }

    switch (activeTab) {
      case 'story':
        return <Timeline />;
      case 'gallery':
        return <Gallery />;
      case 'music':
        return (
          <MusicPage
            isPlaying={isPlaying}
            onTogglePlay={togglePlay}
            onNext={nextTrack}
            onPrev={prevTrack}
            currentTrackIndex={currentTrackIndex}
            volume={volume}
            onVolumeChange={handleVolumeChange}
          />
        );
      case 'settings':
        return (
          <SettingsPage
            isDarkMode={isDarkMode}
            toggleTheme={toggleTheme}
            onLock={() => setIsUnlocked(false)}
            textSize={textSize}
            setTextSize={setTextSize}
            reducedMotion={reducedMotion}
            setReducedMotion={setReducedMotion}
          />
        );
      default:
        return <Timeline />;
    }
  };

  return (
    <MotionConfig reducedMotion={reducedMotion ? "always" : "user"}>
      <MobileFrame
        isDarkMode={isDarkMode}
        scrollRef={scrollRef}
        textSize={textSize}
        bottomBar={
          isUnlocked && !showSecretPage ? (
            <>
              {activeTab !== 'music' && (
                <div className="absolute bottom-24 right-6 z-40 pointer-events-auto">
                  <FloatingMusicControl
                    isPlaying={isPlaying}
                    onTogglePlay={togglePlay}
                  />
                </div>
              )}
              <BottomNav
                activeTab={activeTab}
                onTabChange={setActiveTab}
                isCollapsed={isMenuCollapsed}
                onExpand={() => setIsMenuCollapsed(false)}
              />
            </>
          ) : null
        }
        notification={
          isUnlocked ? (
            <SecretNotification
              isVisible={showNotification}
              onClick={handleNotificationClick}
              onClose={() => setShowNotification(false)}
            />
          ) : null
        }
        onScroll={handleScroll}
      >
        <LineArtBackground isDarkMode={isDarkMode} />

        {/* Global Background Music Player */}
        <audio
          ref={bgAudioRef}
          src={`/music/${PLAYLIST[currentTrackIndex]?.file}`}
          onEnded={nextTrack}
        />

        <AnimatePresence mode="wait">
          {!isUnlocked ? (
            <SecretGate key="gate" onUnlock={() => setIsUnlocked(true)} />
          ) : (
            <div key="content-area" className="w-full h-full relative">
              {renderContent()}
            </div>
          )}
        </AnimatePresence>
      </MobileFrame>
    </MotionConfig>
  );
};
export default App;