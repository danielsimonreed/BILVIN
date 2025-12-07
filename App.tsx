import React, { useState, useEffect } from 'react';
import { AnimatePresence } from 'framer-motion';
import MobileFrame from './components/MobileFrame';
import SecretGate from './components/SecretGate';
import Timeline from './components/Timeline';
import LineArtBackground from './components/LineArtBackground';
import BottomNav from './components/BottomNav';
import Gallery from './components/Gallery';
import MusicPage from './components/MusicPage';
import SettingsPage from './components/SettingsPage';

type TabType = 'story' | 'gallery' | 'music' | 'settings';

const App: React.FC = () => {
  const [isUnlocked, setIsUnlocked] = useState(false);
  const [activeTab, setActiveTab] = useState<TabType>('story');
  // Set default to TRUE for Dark Mode
  const [isDarkMode, setIsDarkMode] = useState(true);

  // Toggle Dark Mode class on body
  useEffect(() => {
    if (isDarkMode) {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
  }, [isDarkMode]);

  const toggleTheme = () => setIsDarkMode(!isDarkMode);

  // Render the active view
  const renderContent = () => {
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
      bottomBar={isUnlocked ? <BottomNav activeTab={activeTab} onTabChange={setActiveTab} /> : null}
    >
      <LineArtBackground isDarkMode={isDarkMode} />
      
      <AnimatePresence mode="wait">
        {!isUnlocked ? (
          <SecretGate key="gate" onUnlock={() => setIsUnlocked(true)} />
        ) : (
          <div key="content-area" className="w-full h-full">
            {renderContent()}
          </div>
        )}
      </AnimatePresence>
    </MobileFrame>
  );
};

export default App;