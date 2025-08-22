import React from 'react';
import { Star, Calendar } from 'lucide-react';
import { useReading } from '../../contexts/ReadingContext';
import { useAuth } from '../../contexts/AuthContext';

interface ReadingsViewProps {
  onViewChange: (view: string) => void;
}

const ReadingsView: React.FC<ReadingsViewProps> = ({ onViewChange }) => {
  const { readings, currentReading } = useReading();
  const { user } = useAuth();

  const allReadings = currentReading ? [currentReading, ...readings] : readings;

  if (!user) {
    return (
      <div className="space-y-6">
        <div className="bg-slate-800 border border-slate-700 rounded-xl p-8 text-center">
          <Star className="w-16 h-16 text-gray-400 mx-auto mb-4" />
          <p className="text-gray-400 mb-4">Sign in to view your readings</p>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold text-yellow-400">Your Readings</h1>
        <button 
          onClick={() => onViewChange('spread-selection')}
          className="bg-purple-500 hover:bg-purple-600 text-white px-4 py-2 rounded-lg font-medium transition-colors"
        >
          New Reading
        </button>
      </div>

      {allReadings.length > 0 ? (
        <div className="space-y-4">
          {allReadings.map((reading) => (
            <div key={reading.id} className="bg-slate-800 border border-slate-700 rounded-xl p-4 hover:bg-slate-750 transition-colors cursor-pointer">
              <div className="flex items-start justify-between mb-3">
                <div>
                  <h3 className="text-white font-semibold">{reading.title}</h3>
                  <p className="text-gray-400 text-sm">{reading.type}</p>
                </div>
                <span className={`px-3 py-1 rounded-full text-xs font-medium ${
                  reading.status === 'in-progress' 
                    ? 'bg-yellow-400/10 text-yellow-400' 
                    : 'bg-green-400/10 text-green-400'
                }`}>
                  {reading.status === 'in-progress' ? 'In Progress' : 'Completed'}
                </span>
              </div>
              
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2 text-gray-400 text-sm">
                  <Calendar className="w-4 h-4" />
                  {reading.createdAt.toLocaleDateString()}
                </div>
                
                <div className="flex items-center gap-1">
                  {reading.cards.slice(0, 3).map((_, index) => (
                    <Star key={index} className="w-4 h-4 text-yellow-400 fill-current" />
                  ))}
                  {Array.from({ length: 3 - reading.cards.length }).map((_, index) => (
                    <Star key={`empty-${index}`} className="w-4 h-4 text-gray-600" />
                  ))}
                </div>
              </div>
            </div>
          ))}
        </div>
      ) : (
        <div className="bg-slate-800 border border-slate-700 rounded-xl p-8 text-center">
          <div className="w-16 h-16 bg-slate-700 rounded-full flex items-center justify-center mx-auto mb-4">
            <Star className="w-8 h-8 text-gray-400" />
          </div>
          <p className="text-gray-400 mb-4">No readings yet</p>
          <button 
            onClick={() => onViewChange('spread-selection')}
            className="text-purple-400 hover:text-purple-300 transition-colors font-medium"
          >
            Start your first reading
          </button>
        </div>
      )}
    </div>
  );
};

export default ReadingsView;