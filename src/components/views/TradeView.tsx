import React from 'react';
import { ArrowRightLeft, Users, TrendingUp } from 'lucide-react';

const TradeView: React.FC = () => {
  const activeOffers = [
    { id: 1, from: 'MysticMage', offering: 'The Magician', wanting: 'The Empress', timeLeft: '2h 15m' },
    { id: 2, from: 'CardSeeker', offering: 'Ace of Wands', wanting: 'King of Cups', timeLeft: '5h 42m' },
    { id: 3, from: 'TarotMaster', offering: 'The Moon', wanting: 'The Sun', timeLeft: '1d 3h' },
  ];

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold text-yellow-400">Trading Hub</h1>
        <button className="bg-purple-500 hover:bg-purple-600 text-white px-4 py-2 rounded-lg font-medium transition-colors">
          Create Offer
        </button>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-3 gap-4">
        <div className="bg-slate-800 border border-slate-700 rounded-xl p-4 text-center">
          <ArrowRightLeft className="w-6 h-6 text-purple-400 mx-auto mb-2" />
          <p className="text-2xl font-bold text-white">24</p>
          <p className="text-gray-400 text-sm">Active Trades</p>
        </div>
        
        <div className="bg-slate-800 border border-slate-700 rounded-xl p-4 text-center">
          <Users className="w-6 h-6 text-blue-400 mx-auto mb-2" />
          <p className="text-2xl font-bold text-white">156</p>
          <p className="text-gray-400 text-sm">Traders Online</p>
        </div>
        
        <div className="bg-slate-800 border border-slate-700 rounded-xl p-4 text-center">
          <TrendingUp className="w-6 h-6 text-green-400 mx-auto mb-2" />
          <p className="text-2xl font-bold text-white">89%</p>
          <p className="text-gray-400 text-sm">Success Rate</p>
        </div>
      </div>

      {/* Active Offers */}
      <div>
        <h2 className="text-xl font-semibold text-yellow-400 mb-4">Active Offers</h2>
        <div className="space-y-3">
          {activeOffers.map((offer) => (
            <div key={offer.id} className="bg-slate-800 border border-slate-700 rounded-xl p-4">
              <div className="flex items-center justify-between mb-3">
                <div className="flex items-center gap-3">
                  <div className="w-8 h-8 bg-purple-500 rounded-full flex items-center justify-center">
                    <span className="text-white text-sm font-semibold">
                      {offer.from.charAt(0)}
                    </span>
                  </div>
                  <span className="text-white font-medium">{offer.from}</span>
                </div>
                <span className="text-yellow-400 text-sm">{offer.timeLeft}</span>
              </div>
              
              <div className="flex items-center gap-4">
                <div className="flex-1 text-center">
                  <p className="text-gray-400 text-sm mb-1">Offering</p>
                  <p className="text-white font-medium">{offer.offering}</p>
                </div>
                
                <ArrowRightLeft className="w-5 h-5 text-purple-400" />
                
                <div className="flex-1 text-center">
                  <p className="text-gray-400 text-sm mb-1">Wanting</p>
                  <p className="text-white font-medium">{offer.wanting}</p>
                </div>
              </div>
              
              <div className="flex gap-2 mt-4">
                <button className="flex-1 bg-green-600 hover:bg-green-700 text-white py-2 rounded-lg font-medium transition-colors">
                  Accept
                </button>
                <button className="flex-1 bg-slate-700 hover:bg-slate-600 text-white py-2 rounded-lg font-medium transition-colors">
                  Counter
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default TradeView;