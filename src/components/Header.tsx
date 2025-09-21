import React, { useState, useRef, useEffect } from 'react';
import { Bell, User, LogOut, Settings } from 'lucide-react';
import { useAuth } from '../contexts/AuthContext';

interface HeaderProps {
  onAuthClick: () => void;
}

const Header: React.FC<HeaderProps> = ({ onAuthClick }) => {
  const { user, signOut } = useAuth();
  const [showUserMenu, setShowUserMenu] = useState(false);
  const menuRef = useRef<HTMLDivElement>(null);

  // Close menu when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (menuRef.current && !menuRef.current.contains(event.target as Node)) {
        setShowUserMenu(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, []);

  const handleAuthClick = () => {
    if (user) {
      setShowUserMenu(!showUserMenu);
    } else {
      onAuthClick();
    }
  };

  const handleLogout = async () => {
    try {
      await signOut();
      setShowUserMenu(false);
    } catch (error) {
      console.error('Logout error:', error);
    }
  };

  return (
    <header className="px-6 py-6 flex items-center justify-between">
      <div>
        <h1 className="text-2xl font-bold text-yellow-400">Tarot Trader</h1>
        <p className="text-gray-300 text-sm">Discover Your Destiny</p>
      </div>
      
      <div className="flex items-center gap-4">
        <button className="p-2 hover:bg-slate-800 rounded-full transition-colors">
          <Bell className="w-5 h-5 text-yellow-400" />
        </button>
        
        <div className="relative" ref={menuRef}>
          <button 
            onClick={handleAuthClick}
            className="w-10 h-10 bg-purple-500 hover:bg-purple-600 rounded-full flex items-center justify-center transition-colors"
            role="button"
            aria-label={user ? "User profile menu" : "Sign in"}
            data-testid="header-auth-button"
          >
            {user ? (
              <span className="text-white font-semibold text-sm">
                {user.name.charAt(0).toUpperCase()}
              </span>
            ) : (
              <User className="w-5 h-5 text-white" />
            )}
          </button>

          {/* User dropdown menu */}
          {user && showUserMenu && (
            <div className="absolute right-0 mt-2 w-48 bg-slate-800 rounded-lg shadow-lg py-2 z-50 border border-slate-700">
              <div className="px-4 py-2 border-b border-slate-700">
                <p className="text-sm font-medium text-white">{user.name}</p>
                <p className="text-xs text-gray-400">{user.email}</p>
              </div>
              
              <button 
                className="w-full px-4 py-2 text-left text-sm text-gray-300 hover:bg-slate-700 transition-colors flex items-center gap-2"
                onClick={() => {
                  setShowUserMenu(false);
                  // Add profile settings functionality here if needed
                }}
              >
                <Settings className="w-4 h-4" />
                Profile Settings
              </button>
              
              <button 
                className="w-full px-4 py-2 text-left text-sm text-gray-300 hover:bg-slate-700 transition-colors flex items-center gap-2"
                onClick={handleLogout}
                data-testid="logout-button"
              >
                <LogOut className="w-4 h-4" />
                Sign Out
              </button>
            </div>
          )}
        </div>
      </div>
    </header>
  );
};

export default Header;