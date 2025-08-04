import React, { useState } from 'react';
import { AuthProvider } from './contexts/AuthContext';
import { ReadingProvider } from './contexts/ReadingContext';
import Header from './components/Header';
import MainContent from './components/MainContent';
import BottomNavigation from './components/BottomNavigation';
import AuthModal from './components/AuthModal';
import ReadingModal from './components/ReadingModal';

function App() {
  const [currentView, setCurrentView] = useState('home');
  const [showAuthModal, setShowAuthModal] = useState(false);

  return (
    <AuthProvider>
      <ReadingProvider>
        <div className="min-h-screen bg-slate-900 text-white overflow-hidden">
          <div className="max-w-md mx-auto bg-slate-900 min-h-screen relative">
            <Header onAuthClick={() => setShowAuthModal(true)} />
            <MainContent currentView={currentView} />
            <BottomNavigation currentView={currentView} onViewChange={setCurrentView} />
            
            {showAuthModal && (
              <AuthModal onClose={() => setShowAuthModal(false)} />
            )}
            
            <ReadingModal />
          </div>
        </div>
      </ReadingProvider>
    </AuthProvider>
  );
}

export default App;