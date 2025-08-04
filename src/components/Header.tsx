import React from 'react';
import { Bell, User } from 'lucide-react';
import { useAuth } from '../contexts/AuthContext';

interface HeaderProps {
  onAuthClick: () => void;
}

const Header: React.FC<HeaderProps> = ({ onAuthClick }) => {
  const { user } = useAuth();

  return (
    <header className="px-6 py-6 flex items-center justify-between">
      <div>
        <h1 className="text-2xl font-bold text-yellow-400">Mystic Cards</h1>
        <p className="text-gray-300 text-sm">Discover Your Destiny</p>
      </div>
      
      <div className="flex items-center gap-4">
        <button className="p-2 hover:bg-slate-800 rounded-full transition-colors">
          <Bell className="w-5 h-5 text-yellow-400" />
        </button>
        
        <button 
          onClick={onAuthClick}
          className="w-10 h-10 bg-purple-500 hover:bg-purple-600 rounded-full flex items-center justify-center transition-colors"
        >
          {user ? (
            <span className="text-white font-semibold text-sm">
              {user.name.charAt(0).toUpperCase()}
            </span>
          ) : (
            <User className="w-5 h-5 text-white" />
          )}
        </button>
      </div>
    </header>
  );
};

export default Header;