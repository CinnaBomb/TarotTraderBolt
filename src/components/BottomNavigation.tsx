import React from 'react';
import { Home, BookOpen, Layers, ArrowRightLeft, User } from 'lucide-react';

interface BottomNavigationProps {
  currentView: string;
  onViewChange: (view: string) => void;
}

const BottomNavigation: React.FC<BottomNavigationProps> = ({ currentView, onViewChange }) => {
  const navItems = [
    { id: 'home', label: 'Home', icon: Home },
    { id: 'readings', label: 'Readings', icon: BookOpen },
    { id: 'collection', label: 'Collection', icon: Layers },
    { id: 'trade', label: 'Trade', icon: ArrowRightLeft },
    { id: 'profile', label: 'Profile', icon: User },
  ];

  return (
    <nav className="fixed bottom-0 left-1/2 transform -translate-x-1/2 w-full max-w-md bg-slate-800/95 backdrop-blur-sm border-t border-slate-700">
      <div className="flex items-center justify-around py-2">
        {navItems.map((item) => {
          const IconComponent = item.icon;
          const isActive = currentView === item.id;
          
          return (
            <button
              key={item.id}
              onClick={() => onViewChange(item.id)}
              className={`flex flex-col items-center gap-1 py-2 px-3 rounded-lg transition-colors ${
                isActive 
                  ? 'text-yellow-400' 
                  : 'text-gray-400 hover:text-gray-300'
              }`}
            >
              <IconComponent className={`w-5 h-5 ${isActive ? 'text-yellow-400' : ''}`} />
              <span className="text-xs font-medium">{item.label}</span>
            </button>
          );
        })}
      </div>
    </nav>
  );
};

export default BottomNavigation;