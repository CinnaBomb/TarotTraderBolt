import React, { useState } from 'react';
import { AuthProvider, useAuth } from './contexts/AuthContext';
import { ReadingProvider } from './contexts/ReadingContext';
import Header from './components/Header';
import MainContent from './components/MainContent';
import BottomNavigation from './components/BottomNavigation';
import AuthModal from './components/AuthModal';
import ReadingModal from './components/ReadingModal';

function AppContent() {
  const [currentView, setCurrentView] = useState('home');
  const [showAuthModal, setShowAuthModal] = useState(false);
  const { user, isLoading } = useAuth();

  // Show loading state while checking authentication
  if (isLoading) {
    return (
      <div className="min-h-screen text-white overflow-hidden app-background">
        <div className="min-h-screen bg-black/60">
          <div className="max-w-md mx-auto bg-slate-900 min-h-screen relative flex items-center justify-center">
            <div className="text-center">
              <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-yellow-400 mx-auto mb-4"></div>
              <p className="text-yellow-400 font-medium">Loading Tarot Trader...</p>
            </div>
          </div>
        </div>
      </div>
    );
  }

  // Show login page if user is not authenticated
  if (!user) {
    return (
      <div className="min-h-screen text-white overflow-hidden app-background">
        <div className="min-h-screen bg-black/60">
          <div className="max-w-md mx-auto bg-slate-900 min-h-screen relative">
            <AuthModal onClose={() => {}} isMainLogin={true} />
          </div>
        </div>
      </div>
    );
  }

  // Show main app if user is authenticated
  return (
    <div className="min-h-screen text-white overflow-hidden app-background">
      {/* Overlay for better readability */}
      <div className="min-h-screen bg-black/60">
        <div className="max-w-md mx-auto bg-slate-900 min-h-screen relative">
          <Header onAuthClick={() => setShowAuthModal(true)} />
          <MainContent currentView={currentView} setCurrentView={setCurrentView} />
          <BottomNavigation currentView={currentView} onViewChange={setCurrentView} />
          
          {showAuthModal && (
            <AuthModal onClose={() => setShowAuthModal(false)} />
          )}
          
          <ReadingModal />
        </div>
      </div>
    </div>
  );
}

function App() {
  return (
    <AuthProvider>
      <ReadingProvider>
        <AppContent />
      </ReadingProvider>
    </AuthProvider>
  );
}

export default App;