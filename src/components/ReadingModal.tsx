import React from 'react';
import { X, Star, RotateCcw, Trash } from 'lucide-react';
import { useReading } from '../contexts/ReadingContext';
import { Card } from '../contexts/ReadingContext';

const ReadingModal: React.FC = () => {
  const { 
    currentReading, 
    isReadingModalOpen, 
    setIsReadingModalOpen, 
    drawCard,
    completeReading,
    setCurrentReading,
    deleteReading
  } = useReading();

  if (!isReadingModalOpen || !currentReading) return null;

  const positions = ['past', 'present', 'future'] as const;
  const positionLabels = {
    past: 'Past',
    present: 'Present', 
    future: 'Future'
  };

  const getCardForPosition = (position: string) => {
    return currentReading.cards.find(card => {
      const cardWithPosition = card as Card & { position?: string };
      return cardWithPosition.position === position;
    });
  };

  const isComplete = currentReading.cards.length === 3;

  return (
    <div className="fixed inset-0 bg-black/80 flex items-center justify-center p-4 z-50">
      <div className="bg-slate-800 rounded-xl p-6 w-full max-w-md border border-slate-700 max-h-[90vh] overflow-y-auto">
        <div className="flex justify-between items-center mb-6">
          <div>
            <h2 className="text-xl font-bold text-yellow-400">{currentReading.title}</h2>
            <p className="text-gray-400 text-sm">{currentReading.type}</p>
          </div>
          <div className="flex gap-4">
            {currentReading.status === 'completed' && (
              <button 
                onClick={() => {
                  if (confirm('Are you sure you want to delete this reading?')) {
                    deleteReading(currentReading.id);
                    setIsReadingModalOpen(false);
                  }
                }}
                className="text-red-400 hover:text-red-300 transition-colors"
              >
                <Trash className="w-5 h-5" />
              </button>
            )}
            <button 
              onClick={() => setIsReadingModalOpen(false)}
              className="text-gray-400 hover:text-white transition-colors"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        <div className="space-y-6">
          {/* Card Positions */}
          <div className="grid grid-cols-3 gap-4">
            {positions.map(position => {
              const card = getCardForPosition(position);
              
              return (
                <div key={position} className="text-center">
                  <p className="text-gray-400 text-sm mb-2">{positionLabels[position]}</p>
                  <div 
                    className={`aspect-[3/4] rounded-lg border-2 border-dashed border-slate-600 flex items-center justify-center cursor-pointer transition-all hover:border-purple-400 ${
                      card ? 'bg-slate-700 border-solid border-purple-500' : 'bg-slate-800'
                    }`}
                    onClick={() => !card && drawCard(position)}
                  >
                    {card ? (
                      <div className="text-center p-2">
                        <Star className="w-6 h-6 text-yellow-400 mx-auto mb-2" />
                        <p className="text-white text-xs font-medium">{card.name}</p>
                        {card.reversed && (
                          <RotateCcw className="w-3 h-3 text-red-400 mx-auto mt-1" />
                        )}
                      </div>
                    ) : (
                      <div className="text-center">
                        <div className="w-8 h-8 border-2 border-dashed border-gray-500 rounded mx-auto mb-2"></div>
                        <p className="text-gray-500 text-xs">Tap to draw</p>
                      </div>
                    )}
                  </div>
                </div>
              );
            })}
          </div>

          {/* Card Interpretations */}
          {currentReading.cards_drawn.length > 0 && (
            <div className="space-y-4">
              <h3 className="text-yellow-400 font-semibold">Your Cards</h3>
              {currentReading.cards_drawn.map(card => (
                <div key={card.id} className="bg-slate-700 rounded-lg p-4">
                  <div className="flex items-center gap-2 mb-2">
                    <Star className="w-4 h-4 text-yellow-400" />
                    <h4 className="text-white font-medium">
                      {card.name} {card.reversed && '(Reversed)'}
                    </h4>
                  </div>
                  <p className="text-gray-300 text-sm mb-1">{card.suit}</p>
                  <p className="text-gray-400 text-sm">{card.meaning}</p>
                </div>
              ))}
            </div>
          )}

          {/* AI Interpretation */}
          {currentReading.interpretation && (
            <div className="space-y-4">
              <h3 className="text-yellow-400 font-semibold">AI Reading Interpretation</h3>
              <div className="bg-slate-700 rounded-lg p-4">
                <div className="text-gray-300 text-sm whitespace-pre-line">
                  {currentReading.interpretation}
                </div>
              </div>
            </div>
          )}

          {/* Action Buttons */}
          <div className="flex gap-3">
            {isComplete ? (
              currentReading.status === 'completed' ? (
                <button
                  onClick={() => {
                    setCurrentReading(null);
                    setIsReadingModalOpen(false);
                  }}
                  className="flex-1 bg-purple-500 hover:bg-purple-600 text-white py-3 rounded-lg font-medium transition-colors"
                >
                  Close Reading
                </button>
              ) : (
                <button
                  onClick={completeReading}
                  className="flex-1 bg-green-600 hover:bg-green-700 text-white py-3 rounded-lg font-medium transition-colors"
                >
                  Complete Reading
                </button>
              )
            ) : (
              <button
                onClick={() => setIsReadingModalOpen(false)}
              >
                Save & Continue Later
              </button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default ReadingModal;