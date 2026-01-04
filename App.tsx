
import React, { useState, useEffect } from 'react';
import ChatWindow from './components/ChatWindow';
import SubscriptionModal from './components/SubscriptionModal';
import LandingPage from './components/LandingPage';
import { UserProfile, MAX_FREE_MESSAGES, AppLanguage } from './types';
import { initBilling } from './services/billingService';

const App: React.FC = () => {
  const [hasStarted, setHasStarted] = useState(false);
  const [user, setUser] = useState<UserProfile>(() => {
    const saved = localStorage.getItem('napoleon_user');
    return saved ? JSON.parse(saved) : { name: 'Guest', isPremium: false, messageCount: 0, language: 'en' };
  });
  const [showPaywall, setShowPaywall] = useState(false);

  useEffect(() => {
    initBilling(() => {
      setUser(prev => ({ ...prev, isPremium: true }));
      setShowPaywall(false);
    });
  }, []);

  useEffect(() => {
    localStorage.setItem('napoleon_user', JSON.stringify(user));
  }, [user]);

  const handleStart = (lang: AppLanguage) => {
    setUser(prev => ({ ...prev, language: lang }));
    setHasStarted(true);
  };

  const incrementMessageCount = () => {
    if (user.isPremium) return true;
    if (user.messageCount >= MAX_FREE_MESSAGES) {
      setShowPaywall(true);
      return false;
    }
    setUser(prev => ({ ...prev, messageCount: prev.messageCount + 1 }));
    return true;
  };

  if (!hasStarted) {
    return <LandingPage onStart={handleStart} />;
  }

  return (
    <div className="flex flex-col h-screen bg-[#faf9f6] safe-area-inset">
      <ChatWindow 
        user={user} 
        onMessageSent={incrementMessageCount} 
        onUpgrade={() => setShowPaywall(true)}
        isLimited={!user.isPremium && user.messageCount >= MAX_FREE_MESSAGES}
      />
      
      {showPaywall && (
        <SubscriptionModal 
          lang={user.language}
          onClose={() => setShowPaywall(false)} 
          onSubscribe={() => setShowPaywall(false)} 
        />
      )}
    </div>
  );
};

export default App;
