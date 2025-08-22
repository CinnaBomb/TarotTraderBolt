import React from 'react';
import HomeView from './views/HomeView';
import ReadingsView from './views/ReadingsView';
import CollectionView from './views/CollectionView';
import TradeView from './views/TradeView';
import ProfileView from './views/ProfileView';
import SpreadSelectionView from './views/SpreadSelectionView';

interface MainContentProps {
  currentView: string;
  setCurrentView: (view: string) => void;
}

const MainContent: React.FC<MainContentProps> = ({ currentView, setCurrentView }) => {
  const renderView = () => {
    switch (currentView) {
      case 'readings':
        return <ReadingsView onViewChange={setCurrentView} />;
      case 'collection':
        return <CollectionView />;
      case 'trade':
        return <TradeView />;
      case 'profile':
        return <ProfileView />;
      case 'spread-selection':
        return <SpreadSelectionView onViewChange={setCurrentView} />;
      default:
        return <HomeView onViewChange={setCurrentView} />;
    }
  };

  return (
    <main className="px-6 pb-24">
      {renderView()}
    </main>
  );
};

export default MainContent;