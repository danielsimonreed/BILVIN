import React, { useState, useEffect, useRef } from 'react';
import { AnimatePresence, MotionConfig, motion } from 'framer-motion';
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
import VoiceMessagePage from './components/VoiceMessagePage';
import ValentineSurprise from './components/ValentineSurprise';

import { UserProvider } from './contexts/UserContext';

import Milestones from './components/Milestones';
import WishlistPage from './components/WishlistPage';
import { PLAYLIST, UserType } from './constants';

type TabType = 'story' | 'gallery' | 'milestones' | 'wishlist' | 'music' | 'settings';

const App: React.FC = () => {

  const [isUnlocked, setIsUnlocked] = useState(false);
  const [currentUser, setCurrentUser] = useState<UserType | null>(null);
  const [activeTab, setActiveTab] = useState<TabType>('story');
  // Set default to TRUE for Dark Mode
  const [isDarkMode, setIsDarkMode] = useState(true);

  // Secret feature states
  const [hasScrolled, setHasScrolled] = useState(false);
  const [showNotification, setShowNotification] = useState(false);
  const [showSecretPage, setShowSecretPage] = useState(false);
  const [showVoicePage, setShowVoicePage] = useState(false);
  const [isMenuCollapsed, setIsMenuCollapsed] = useState(false);
  const [showValentineSurprise, setShowValentineSurprise] = useState(false);
  const [isTimelineReady, setIsTimelineReady] = useState(false);
  // Track if user has seen the welcome message (persists across tab changes)
  const [hasSeenWelcome, setHasSeenWelcome] = useState(false);
  const scrollRef = useRef<HTMLDivElement>(null);

  // Music Player State
  const [isPlaying, setIsPlaying] = useState(false);
  const [currentTrackIndex, setCurrentTrackIndex] = useState(0);
  const [volume, setVolume] = useState(0.4);

  // Create a persistent Audio instance that lives outside of React's render cycle
  const audioRef = useRef<HTMLAudioElement | null>(null);
  const hasInitializedAudio = useRef(false);
  // Track if music was playing before pausing for special pages
  const wasPlayingBeforePause = useRef(false);

  // Initialize audio once on mount
  useEffect(() => {
    if (!hasInitializedAudio.current) {
      audioRef.current = new Audio(`/music/${PLAYLIST[0]?.file}`);
      audioRef.current.volume = 0.4;
      audioRef.current.addEventListener('ended', () => {
        setCurrentTrackIndex((prev) => (prev + 1) % PLAYLIST.length);
      });
      hasInitializedAudio.current = true;
    }

    return () => {
      if (audioRef.current) {
        audioRef.current.pause();
        audioRef.current = null;
      }
    };
  }, []);

  // Update audio source when track changes
  useEffect(() => {
    if (audioRef.current && hasInitializedAudio.current) {
      const wasPlaying = !audioRef.current.paused;
      audioRef.current.src = `/music/${PLAYLIST[currentTrackIndex]?.file}`;
      audioRef.current.load();
      if (wasPlaying || isPlaying) {
        audioRef.current.play().catch(e => console.error("Track change play failed", e));
      }
    }
  }, [currentTrackIndex]);

  // Handle play/pause changes
  useEffect(() => {
    if (audioRef.current) {
      if (isPlaying) {
        audioRef.current.play().catch(e => console.error("Playback failed", e));
      } else {
        audioRef.current.pause();
      }
    }
  }, [isPlaying]);

  // Handle volume changes
  useEffect(() => {
    if (audioRef.current) {
      audioRef.current.volume = volume;
    }
  }, [volume]);

  // Music Controls - removed bgAudioRef references
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

  // Valentine Surprise — date-gated, shows once per session during Feb 11-14
  useEffect(() => {
    if (isUnlocked) {
      const now = new Date();
      const month = now.getMonth(); // 0-indexed: Jan=0, Feb=1
      const day = now.getDate();
      const year = now.getFullYear();
      const isValentineWindow = year === 2026 && month === 1 && day >= 11 && day <= 14;
      const alreadySeenThisSession = sessionStorage.getItem('valentineSurprise2026Seen') === 'true';

      if (isValentineWindow && !alreadySeenThisSession) {
        setTimeout(() => setShowValentineSurprise(true), 800);
      }
    }
  }, [isUnlocked]);

  // Auto-play music when unlocked (skip if valentine surprise is showing)
  useEffect(() => {
    if (isUnlocked && !showSecretPage && !showVoicePage && !showValentineSurprise) {
      // Small delay to ensure browser acknowledges the user interaction from the unlock click
      setTimeout(() => {
        setIsPlaying(true);
      }, 100);
    }
  }, [isUnlocked, showValentineSurprise]);

  // Pause/Resume music when secret or voice page is opened/closed
  useEffect(() => {
    const isSpecialPageOpen = showSecretPage || showVoicePage || showValentineSurprise;

    if (isSpecialPageOpen) {
      // Pause music when entering special pages
      // Check the actual audio element state, not the React state
      if (audioRef.current && !audioRef.current.paused) {
        wasPlayingBeforePause.current = true;
        setIsPlaying(false);
      }
    } else {
      // Resume music when leaving special pages (if it was playing before)
      if (wasPlayingBeforePause.current) {
        setTimeout(() => {
          setIsPlaying(true);
        }, 100);
        wasPlayingBeforePause.current = false;
      }
    }
  }, [showSecretPage, showVoicePage, showValentineSurprise]);

  // Handle scroll to trigger notification
  const handleScroll = (e: React.UIEvent<HTMLDivElement>) => {
    const { scrollTop, scrollHeight, clientHeight } = e.currentTarget;
    setIsMenuCollapsed(scrollTop > 50);

    if (!hasScrolled && isUnlocked && isTimelineReady && activeTab === 'story') {
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
    if (showVoicePage) {
      return <VoiceMessagePage onBack={() => setShowVoicePage(false)} />;
    }

    if (showSecretPage) {
      return (
        <SecretMessagePage
          onBack={() => setShowSecretPage(false)}
          onOpenVoice={() => setShowVoicePage(true)}
        />
      );
    }

    switch (activeTab) {
      case 'story':
        return (
          <Timeline
            onLogout={() => setIsUnlocked(false)}
            onReadyChange={setIsTimelineReady}
            hasSeenWelcome={hasSeenWelcome}
            onWelcomeSeen={() => setHasSeenWelcome(true)}
          />
        );
      case 'gallery':
        return <Gallery />;
      case 'milestones':
        return <Milestones />;
      case 'wishlist':
        return <WishlistPage currentUser={currentUser} />;
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
            onLock={() => {
              setCurrentUser(null);
              setIsUnlocked(false);
              setHasSeenWelcome(false);
              setActiveTab('story');
            }}
            textSize={textSize}
            setTextSize={setTextSize}
            reducedMotion={reducedMotion}
            setReducedMotion={setReducedMotion}
          />
        );
      default:
        return (
          <Timeline
            onLogout={() => setIsUnlocked(false)}
            onReadyChange={setIsTimelineReady}
            hasSeenWelcome={hasSeenWelcome}
            onWelcomeSeen={() => setHasSeenWelcome(true)}
          />
        );
    }
  };



  return (
    <MotionConfig reducedMotion={reducedMotion ? "always" : "user"}>
      <MobileFrame
        isDarkMode={isDarkMode}
        scrollRef={scrollRef}
        textSize={textSize}
        bottomBar={
          isUnlocked && !showSecretPage && !showVoicePage && (activeTab !== 'story' || isTimelineReady) ? (
            <BottomNav
              activeTab={activeTab}
              onTabChange={setActiveTab}
              isCollapsed={isMenuCollapsed}
              onExpand={() => setIsMenuCollapsed(false)}
            />
          ) : null
        }
        notification={
          isUnlocked && isTimelineReady ? (
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

        <AnimatePresence mode="wait">
          {!isUnlocked ? (
            <SecretGate key="gate" onUnlock={(user: UserType) => {
              setCurrentUser(user);
              setIsUnlocked(true);
            }} />
          ) : (
            <div key="content-area" className="w-full h-full relative">
              {renderContent()}
            </div>
          )}
        </AnimatePresence>

        {/* Valentine Surprise Overlay */}
        <AnimatePresence>
          {showValentineSurprise && (
            <ValentineSurprise onDismiss={() => setShowValentineSurprise(false)} />
          )}
        </AnimatePresence>
      </MobileFrame>
    </MotionConfig>
  );
};
export default App;