import React, { Suspense, useState, useEffect, useRef, useMemo } from 'react';
import { AnimatePresence, MotionConfig, motion } from 'framer-motion';
import MobileFrame from './components/MobileFrame';
import SecretGate from './components/SecretGate';
import Timeline from './components/Timeline';
import LineArtBackground from './components/LineArtBackground';
import BottomNav from './components/BottomNav';
import SecretNotification from './components/SecretNotification';
import { PLAYLIST, UserType } from './constants';
import { prefetchAudio, runWhenIdle } from './lib/media';

type TabType = 'story' | 'gallery' | 'milestones' | 'wishlist' | 'music' | 'settings';

const loadGallery = () => import('./components/Gallery');
const loadMusicPage = () => import('./components/MusicPage');
const loadSettingsPage = () => import('./components/SettingsPage');
const loadSecretMessagePage = () => import('./components/SecretMessagePage');
const loadVoiceMessagePage = () => import('./components/VoiceMessagePage');
const loadValentineSurprise = () => import('./components/ValentineSurprise');
const loadMilestones = () => import('./components/Milestones');
const loadWishlistPage = () => import('./components/WishlistPage');

const Gallery = React.lazy(loadGallery);
const MusicPage = React.lazy(loadMusicPage);
const SettingsPage = React.lazy(loadSettingsPage);
const SecretMessagePage = React.lazy(loadSecretMessagePage);
const VoiceMessagePage = React.lazy(loadVoiceMessagePage);
const ValentineSurprise = React.lazy(loadValentineSurprise);
const Milestones = React.lazy(loadMilestones);
const WishlistPage = React.lazy(loadWishlistPage);

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
  const notificationAudioRef = useRef<HTMLAudioElement | null>(null);
  // Track if music was playing before pausing for special pages
  const wasPlayingBeforePause = useRef(false);
  const lastCollapsedState = useRef(false);
  const hasTriggeredNotification = useRef(false);
  const scrollRafRef = useRef<number | null>(null);
  const valentineTimeoutRef = useRef<number | null>(null);
  const autoplayTimeoutRef = useRef<number | null>(null);
  const resumeTimeoutRef = useRef<number | null>(null);
  const prefetchedTrackRefs = useRef<Map<number, HTMLAudioElement>>(new Map());
  const currentTrack = useMemo(() => PLAYLIST[currentTrackIndex], [currentTrackIndex]);

  // Initialize audio once on mount
  useEffect(() => {
    if (!hasInitializedAudio.current) {
      audioRef.current = new Audio(`/music/${PLAYLIST[0]?.file}`);
      audioRef.current.preload = 'metadata';
      audioRef.current.volume = 0.4;
      audioRef.current.addEventListener('ended', () => {
        setCurrentTrackIndex((prev) => (prev + 1) % PLAYLIST.length);
      });
      notificationAudioRef.current = new Audio('/notification.mp3');
      notificationAudioRef.current.preload = 'auto';
      hasInitializedAudio.current = true;
    }

    return () => {
      if (scrollRafRef.current !== null) {
        cancelAnimationFrame(scrollRafRef.current);
      }
      if (valentineTimeoutRef.current !== null) {
        clearTimeout(valentineTimeoutRef.current);
      }
      if (autoplayTimeoutRef.current !== null) {
        clearTimeout(autoplayTimeoutRef.current);
      }
      if (resumeTimeoutRef.current !== null) {
        clearTimeout(resumeTimeoutRef.current);
      }
      if (audioRef.current) {
        audioRef.current.pause();
        audioRef.current = null;
      }
      if (notificationAudioRef.current) {
        notificationAudioRef.current.pause();
        notificationAudioRef.current = null;
      }
      prefetchedTrackRefs.current.forEach((audio) => {
        audio.pause();
        audio.src = '';
      });
      prefetchedTrackRefs.current.clear();
    };
  }, []);

  // Update audio source when track changes
  useEffect(() => {
    if (audioRef.current && hasInitializedAudio.current) {
      const wasPlaying = !audioRef.current.paused;
      audioRef.current.src = `/music/${PLAYLIST[currentTrackIndex]?.file}`;
      audioRef.current.preload = 'metadata';
      audioRef.current.load();
      if (wasPlaying || isPlaying) {
        audioRef.current.play().catch(e => console.error("Track change play failed", e));
      }
    }
  }, [currentTrackIndex]);

  useEffect(() => {
    if (!currentTrack) {
      return;
    }

    const currentIndex = currentTrackIndex;
    const nextIndex = (currentIndex + 1) % PLAYLIST.length;
    const nextTrack = PLAYLIST[nextIndex];

    const cancelIdle = runWhenIdle(() => {
      if (!nextTrack || prefetchedTrackRefs.current.has(nextIndex)) {
        return;
      }

      const prefetchedAudio = prefetchAudio(`/music/${nextTrack.file}`);
      if (prefetchedAudio) {
        prefetchedTrackRefs.current.set(nextIndex, prefetchedAudio);
      }
    });

    return cancelIdle;
  }, [currentTrack, currentTrackIndex]);

  useEffect(() => {
    if (!isUnlocked) {
      return;
    }

    const cancelIdlePrefetch = runWhenIdle(() => {
      void loadGallery();
      void loadMilestones();
      void loadWishlistPage();
      void loadMusicPage();
      void loadSettingsPage();
      void loadSecretMessagePage();
      void loadVoiceMessagePage();
      void loadValentineSurprise();
    }, 2000);

    return cancelIdlePrefetch;
  }, [isUnlocked]);

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

  useEffect(() => {
    if (!isUnlocked) {
      hasTriggeredNotification.current = false;
      lastCollapsedState.current = false;
      setHasScrolled(false);
      setShowNotification(false);
      setIsMenuCollapsed(false);
    }
  }, [isUnlocked]);

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
        valentineTimeoutRef.current = window.setTimeout(() => setShowValentineSurprise(true), 800);
      }
    }
  }, [isUnlocked]);

  // Auto-play music when unlocked (skip if valentine surprise is showing)
  useEffect(() => {
    if (isUnlocked && !showSecretPage && !showVoicePage && !showValentineSurprise) {
      // Small delay to ensure browser acknowledges the user interaction from the unlock click
      autoplayTimeoutRef.current = window.setTimeout(() => {
        setIsPlaying(true);
      }, 100);
    }
    return () => {
      if (autoplayTimeoutRef.current !== null) {
        clearTimeout(autoplayTimeoutRef.current);
      }
    };
  }, [isUnlocked, showSecretPage, showVoicePage, showValentineSurprise]);

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
        resumeTimeoutRef.current = window.setTimeout(() => {
          setIsPlaying(true);
        }, 100);
        wasPlayingBeforePause.current = false;
      }
    }
    return () => {
      if (resumeTimeoutRef.current !== null) {
        clearTimeout(resumeTimeoutRef.current);
      }
    };
  }, [showSecretPage, showVoicePage, showValentineSurprise]);

  // Handle scroll to trigger notification
  const handleScroll = (e: React.UIEvent<HTMLDivElement>) => {
    const currentTarget = e.currentTarget;

    if (scrollRafRef.current !== null) {
      return;
    }

    scrollRafRef.current = requestAnimationFrame(() => {
      scrollRafRef.current = null;

      const { scrollTop, scrollHeight, clientHeight } = currentTarget;
      const shouldCollapse = scrollTop > 50;

      if (lastCollapsedState.current !== shouldCollapse) {
        lastCollapsedState.current = shouldCollapse;
        setIsMenuCollapsed(shouldCollapse);
      }

      if (!hasTriggeredNotification.current && isUnlocked && isTimelineReady && activeTab === 'story') {
        const maxScroll = scrollHeight - clientHeight;
        const scrollPercentage = maxScroll > 0 ? scrollTop / maxScroll : 0;

        if (scrollPercentage > 0.8) {
          hasTriggeredNotification.current = true;
          setHasScrolled(true);
          setShowNotification(true);
          notificationAudioRef.current?.play().catch(err => console.log('Audio play failed', err));
        }
      }
    });
  };

  const handleNotificationClick = () => {
    setShowNotification(false);
    setShowSecretPage(true);
  };

  // Render the active view
  const renderContent = () => {
    if (showVoicePage) {
      return (
        <Suspense fallback={<div className="w-full h-full" />}>
          <VoiceMessagePage onBack={() => setShowVoicePage(false)} />
        </Suspense>
      );
    }

    if (showSecretPage) {
      return (
        <Suspense fallback={<div className="w-full h-full" />}>
          <SecretMessagePage
            onBack={() => setShowSecretPage(false)}
            onOpenVoice={() => setShowVoicePage(true)}
          />
        </Suspense>
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
        return (
          <Suspense fallback={<div className="w-full h-full" />}>
            <Gallery />
          </Suspense>
        );
      case 'milestones':
        return (
          <Suspense fallback={<div className="w-full h-full" />}>
            <Milestones />
          </Suspense>
        );
      case 'wishlist':
        return (
          <Suspense fallback={<div className="w-full h-full" />}>
            <WishlistPage currentUser={currentUser} />
          </Suspense>
        );
      case 'music':
        return (
          <Suspense fallback={<div className="w-full h-full" />}>
            <MusicPage
              isPlaying={isPlaying}
              onTogglePlay={togglePlay}
              onNext={nextTrack}
              onPrev={prevTrack}
              currentTrackIndex={currentTrackIndex}
              volume={volume}
              onVolumeChange={handleVolumeChange}
            />
          </Suspense>
        );
      case 'settings':
        return (
          <Suspense fallback={<div className="w-full h-full" />}>
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
          </Suspense>
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
        <LineArtBackground
          isDarkMode={isDarkMode}
          shouldAnimate={!showSecretPage && !showVoicePage && !showValentineSurprise}
        />

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
            <Suspense fallback={null}>
              <ValentineSurprise onDismiss={() => setShowValentineSurprise(false)} />
            </Suspense>
          )}
        </AnimatePresence>
      </MobileFrame>
    </MotionConfig>
  );
};
export default App;
