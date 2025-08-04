import React from 'react';
import HomeView from './views/HomeView';
import ReadingsView from './views/ReadingsView';
import CollectionView from './views/CollectionView';
import TradeView from './views/TradeView';
import ProfileView from './views/ProfileView';

interface MainContentProps {
  currentView: string;
}

const MainContent: React.FC<MainContentProps> = ({ currentView }) => {
  const renderView = () => {
    switch (currentView) {
      case 'readings':
        return <ReadingsView />;
      case 'collection':
        return <CollectionView />;
      case 'trade':
        return <TradeView />;
      case 'profile':
        return <ProfileView />;
      default:
        return <HomeView />;
    }
  };

  return (
    <main className="px-6 pb-24">
      {renderView()}
    </main>
  );
};

export default MainContent;