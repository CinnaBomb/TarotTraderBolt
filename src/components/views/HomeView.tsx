import React from 'react';
import { Layers, Sparkles, Star } from 'lucide-react';
import { useReading } from '../../contexts/ReadingContext';
import { useAuth } from '../../contexts/AuthContext';

interface HomeViewProps {
  onViewChange: (view: string) => void;
}

const HomeView: React.FC<HomeViewProps> = ({ onViewChange }) => {
  const { currentReading, continueReading } = useReading();
  const { user } = useAuth();

  return (
    <div className="space-y-8">
      {/* Action Cards */}
      <div className="grid grid-cols-2 gap-4">
        <div 
          onClick={() => onViewChange('spread-selection')}
          className="bg-slate-800 border border-slate-700 rounded-xl p-6 hover:bg-slate-750 transition-colors cursor-pointer group"
        >
          <div className="w-12 h-12 bg-purple-500 rounded-full flex items-center justify-center mb-4 group-hover:bg-purple-400 transition-colors">
            <Layers className="w-6 h-6 text-white" />
          </div>
          <h3 className="text-yellow-400 font-semibold text-lg mb-1">New Reading</h3>
          <p className="text-gray-400 text-sm">Start your journey</p>
        </div>
        
        <div className="bg-slate-800 border border-slate-700 rounded-xl p-6 hover:bg-slate-750 transition-colors cursor-pointer group">
          <div className="w-12 h-12 bg-purple-500 rounded-full flex items-center justify-center mb-4 group-hover:bg-purple-400 transition-colors">
            <Sparkles className="w-6 h-6 text-white" />
          </div>
          <h3 className="text-yellow-400 font-semibold text-lg mb-1">Create Card</h3>
          <p className="text-gray-400 text-sm">AI-powered</p>
        </div>
      </div>

      {/* Current Reading */}
      <div>
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-yellow-400 text-xl font-semibold">Current Reading</h2>
          {user && (
            <button className="text-purple-400 text-sm hover:text-purple-300 transition-colors">
            View All
            </button>
          )}
        </div>
        
        {user && currentReading ? (
          <div className="bg-slate-800 border border-slate-700 rounded-xl p-6">
            <div className="flex items-center justify-between mb-6">
              <h3 className="text-white font-semibold text-lg">{currentReading.title}</h3>
              <span className="text-yellow-400 text-sm font-medium bg-yellow-400/10 px-3 py-1 rounded-full">
                {currentReading.status === 'in-progress' ? 'In Progress' : 'Completed'}
              </span>
            </div>
            
            <div className="flex justify-center gap-4 mb-6">
              {[0, 1, 2].map((index) => {
                const hasCard = currentReading.cards[index];
                return (
                  <div key={index} className={`w-16 h-24 border border-slate-600 rounded-lg flex items-center justify-center transition-colors ${
                    hasCard ? 'bg-slate-700' : 'bg-slate-800 border-dashed'
                  }`}>
                    <Star className={`w-6 h-6 ${hasCard ? 'text-yellow-400' : 'text-gray-500'}`} />
                  </div>
                );
              })}
            </div>
            
            <button 
              onClick={continueReading}
              className="w-full bg-purple-500 hover:bg-purple-600 text-white font-medium py-3 rounded-lg transition-colors"
            >
              Continue Reading
            </button>
          </div>
        ) : user ? (
          <div className="bg-slate-800 border border-slate-700 rounded-xl p-8 text-center">
            <div className="w-16 h-16 bg-slate-700 rounded-full flex items-center justify-center mx-auto mb-4">
              <Star className="w-8 h-8 text-gray-400" />
            </div>
            <p className="text-gray-400 mb-4">No active reading</p>
            <button 
              onClick={() => onViewChange('spread-selection')}
              className="text-purple-400 hover:text-purple-300 transition-colors font-medium"
            >
              Start a new reading
            </button>
          </div>
        ) : (
          <div className="bg-slate-800 border border-slate-700 rounded-xl p-8 text-center">
            <div className="w-16 h-16 bg-slate-700 rounded-full flex items-center justify-center mx-auto mb-4">
              <Star className="w-8 h-8 text-gray-400" />
            </div>
            <p className="text-gray-400 mb-4">Sign in to start reading</p>
          </div>
        )}
      </div>

      {/* My Collection */}
      <div>
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-yellow-400 text-xl font-semibold">My Collection</h2>
          {user && (
            <div className="flex items-center gap-2">
            <span className="text-gray-400 text-sm">0 cards</span>
            <button className="text-purple-400 text-sm hover:text-purple-300 transition-colors">
              View All
            </button>
            </div>
          )}
        </div>
        
        {user ? (
          <div className="bg-slate-800 border border-slate-700 rounded-xl p-8 text-center">
          <div className="w-16 h-16 bg-slate-700 rounded-full flex items-center justify-center mx-auto mb-4">
            <Layers className="w-8 h-8 text-gray-400" />
          </div>
          <p className="text-gray-400 mb-4">Your collection is empty</p>
          <button className="text-purple-400 hover:text-purple-300 transition-colors font-medium">
            Start collecting cards
          </button>
          </div>
        ) : (
          <div className="bg-slate-800 border border-slate-700 rounded-xl p-8 text-center">
            <div className="w-16 h-16 bg-slate-700 rounded-full flex items-center justify-center mx-auto mb-4">
              <Layers className="w-8 h-8 text-gray-400" />
            </div>
            <p className="text-gray-400 mb-4">Sign in to start collecting</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default HomeView;