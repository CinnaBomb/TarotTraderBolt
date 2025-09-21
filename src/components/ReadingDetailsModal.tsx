import React from 'react';
import { X, Star, Calendar, Trash } from 'lucide-react';
import { Reading, useReading } from '../contexts/ReadingContext';

interface ReadingDetailsModalProps {
  reading: Reading;
  onClose: () => void;
}

const ReadingDetailsModal: React.FC<ReadingDetailsModalProps> = ({ reading, onClose }) => {
  const { deleteReading } = useReading();

  const handleDelete = () => {
    if (confirm('Are you sure you want to delete this reading?')) {
      deleteReading(reading.id);
      onClose();
    }
  };

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center p-4 z-50">
      <div className="bg-slate-800 rounded-xl p-6 w-full max-w-md border border-slate-700 max-h-[90vh] overflow-y-auto">
        {/* Header */}
        <div className="flex justify-between items-center mb-6">
          <div>
            <h2 className="text-xl font-bold text-yellow-400">{reading.title}</h2>
            <p className="text-gray-400 text-sm">{reading.type}</p>
          </div>
          <div className="flex gap-4">
            {reading.status === 'completed' && (
              <button 
                onClick={handleDelete}
                className="text-red-400 hover:text-red-300 transition-colors"
              >
                <Trash className="w-5 h-5" />
              </button>
            )}
            <button 
              onClick={onClose}
              className="text-gray-400 hover:text-white transition-colors"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Status and Date */}
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center gap-2 text-gray-400 text-sm">
            <Calendar className="w-4 h-4" />
            {reading.createdAt.toLocaleDateString('en-US', {
              month: 'long',
              day: 'numeric',
              year: 'numeric'
            })}
          </div>
          <span className={`px-3 py-1 rounded-full text-xs font-medium ${
            reading.status === 'in-progress' 
              ? 'bg-yellow-400/10 text-yellow-400' 
              : 'bg-green-400/10 text-green-400'
          }`}>
            {reading.status === 'in-progress' ? 'In Progress' : 'Completed'}
          </span>
        </div>

        {/* Cards */}
        <div className="space-y-4 mb-6">
          <h3 className="text-yellow-400 font-semibold">Your Cards</h3>
          {reading.cards.map(card => (
            <div key={card.id} className="bg-slate-700 rounded-lg p-4">
              <div className="flex items-center gap-2 mb-2">
                <Star className="w-4 h-4 text-yellow-400" />
                <h4 className="text-white font-medium">
                  {card.position && (
                    <span className="text-gray-400 mr-2">
                      {card.position.charAt(0).toUpperCase() + card.position.slice(1)}:
                    </span>
                  )}
                  {card.name} {card.reversed && '(Reversed)'}
                </h4>
              </div>
              <p className="text-gray-300 text-sm mb-1">{card.suit}</p>
              <p className="text-gray-400 text-sm">{card.meaning}</p>
            </div>
          ))}
        </div>

        {/* Interpretation */}
        {reading.interpretation && (
          <div className="space-y-4">
            <h3 className="text-yellow-400 font-semibold">Reading Interpretation</h3>
            <div className="bg-slate-700 rounded-lg p-4">
              <p className="text-gray-300 text-sm whitespace-pre-line">
                {reading.interpretation}
              </p>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default ReadingDetailsModal;
