import React, { useState, useEffect, useRef } from 'react';
import { AnimatePresence } from 'framer-motion';
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

  // Toggle Dark Mode class on body
  useEffect(() => {
    if (isDarkMode) {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
  }, [isDarkMode]);

  const toggleTheme = () => setIsDarkMode(!isDarkMode);

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
        // TODO: Add notification sound here
        // const audio = new Audio('/notification.mp3');
        // audio.play().catch(e => console.log('Audio play failed', e));
      }
    }
  };

  const handleScrollToTop = () => {
    scrollRef.current?.scrollTo({ top: 0, behavior: 'smooth' });
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
        return <MusicPage />;
      case 'settings':
        return (
          <SettingsPage
            isDarkMode={isDarkMode}
            toggleTheme={toggleTheme}
            onLock={() => setIsUnlocked(false)}
          />
        );
      default:
        return <Timeline />;
    }
  };

  return (
    <MobileFrame
      isDarkMode={isDarkMode}
      scrollRef={scrollRef}
      bottomBar={
        isUnlocked && !showSecretPage ? (
          <BottomNav
            activeTab={activeTab}
            onTabChange={setActiveTab}
            isCollapsed={isMenuCollapsed}
            onExpand={() => setIsMenuCollapsed(false)}
          />
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
  );
};

export default App;