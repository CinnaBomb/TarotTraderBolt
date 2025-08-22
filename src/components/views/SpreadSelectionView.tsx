import React from 'react';
import { Layers, Star } from 'lucide-react';
import { useReading } from '../../contexts/ReadingContext';

interface SpreadOption {
  title: string;
  description: string;
  type: string;
  cardCount: number;
  icon: React.ReactNode;
}

interface SpreadSelectionViewProps {
  onViewChange: (view: string) => void;
}

const SpreadSelectionView: React.FC<SpreadSelectionViewProps> = ({ onViewChange }) => {
  const { startNewReading, setIsReadingModalOpen } = useReading();

  const spreads: SpreadOption[] = [
    {
      title: 'Past, Present, Future',
      description: 'A classic three-card spread revealing your journey through time',
      type: 'three_card',
      cardCount: 3,
      icon: <Layers className="w-6 h-6 text-white" />,
    },
    {
      title: 'Celtic Cross',
      description: 'A comprehensive ten-card spread for deep insights',
      type: 'celtic_cross',
      cardCount: 10,
      icon: <Star className="w-6 h-6 text-white" />,
    },
    // Add more spread options here
  ];

  return (
    <div className="space-y-6">
      <div className="mb-8">
        <h1 className="text-2xl font-bold text-yellow-400 mb-2">Choose Your Spread</h1>
        <p className="text-gray-400">Select a tarot spread to begin your reading</p>
      </div>

      <div className="grid gap-4">
        {spreads.map((spread) => (
          <div
            key={spread.title}
            onClick={async () => {
              await startNewReading(spread.type, spread.title);
              onViewChange('home');
            }}
            className="bg-slate-800 border border-slate-700 rounded-xl p-6 hover:bg-slate-750 transition-colors cursor-pointer group"
          >
            <div className="flex items-start gap-4">
              <div className="w-12 h-12 bg-purple-500 rounded-full flex items-center justify-center group-hover:bg-purple-400 transition-colors flex-shrink-0">
                {spread.icon}
              </div>
              <div>
                <h3 className="text-yellow-400 font-semibold text-lg mb-1">{spread.title}</h3>
                <p className="text-gray-400 text-sm mb-2">{spread.description}</p>
                <div className="flex items-center gap-1">
                  {Array.from({ length: spread.cardCount }).map((_, i) => (
                    <Star key={i} className="w-4 h-4 text-purple-400/50" />
                  ))}
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default SpreadSelectionView;
