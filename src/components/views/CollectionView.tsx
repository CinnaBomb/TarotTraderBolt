import React, { useState, useEffect } from 'react';
import { Star, Heart, Sword, Coins, Wand, Package } from 'lucide-react';
import { supabase } from '../../lib/supabase';
import { useAuth } from '../../contexts/AuthContext';

interface UserCard {
  id: string;
  name: string;
  suit: string;
  meaning: string;
  card_type: string;
  rarity: string;
  obtained_at: string;
}

const CollectionView: React.FC = () => {
  const { user } = useAuth();
  const [cards, setCards] = useState<UserCard[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    if (user) {
      loadUserCards();
    }
  }, [user]);

  const loadUserCards = async () => {
    if (!user) return;

    try {
      const { data, error } = await supabase
        .from('user_cards')
        .select(`
          *,
          cards (
            id,
            name,
            suit,
            meaning,
            card_type
          )
        `)
        .eq('user_id', user.id)
        .order('obtained_at', { ascending: false });

      if (error) throw error;

      const userCards = data?.map(uc => ({
        id: uc.cards.id,
        name: uc.cards.name,
        suit: uc.cards.suit,
        meaning: uc.cards.meaning,
        card_type: uc.cards.card_type,
        rarity: uc.rarity,
        obtained_at: uc.obtained_at,
      })) || [];

      setCards(userCards);
    } catch (error) {
      console.error('Error loading user cards:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const openPack = async () => {
    if (!user) return;

    try {
      // Get random cards from database
      const { data: allCards, error: cardsError } = await supabase
        .from('cards')
        .select('*');

      if (cardsError) throw cardsError;
      if (!allCards || allCards.length === 0) return;

      // Give user 3 random cards
      const packCards = [];
      for (let i = 0; i < 3; i++) {
        const randomCard = allCards[Math.floor(Math.random() * allCards.length)];
        const rarity = getRandomRarity();
        
        // Check if user already has this card
        const { data: existingCard } = await supabase
          .from('user_cards')
          .select('id')
          .eq('user_id', user.id)
          .eq('card_id', randomCard.id)
          .single();

        if (!existingCard) {
          const { error: insertError } = await supabase
            .from('user_cards')
            .insert({
              user_id: user.id,
              card_id: randomCard.id,
              rarity,
            });

          if (!insertError) {
            packCards.push({
              ...randomCard,
              rarity,
              obtained_at: new Date().toISOString(),
            });
          }
        }
      }

      if (packCards.length > 0) {
        await loadUserCards(); // Refresh collection
      }
    } catch (error) {
      console.error('Error opening pack:', error);
    }
  };

  const getRandomRarity = () => {
    const rand = Math.random();
    if (rand < 0.05) return 'Legendary';
    if (rand < 0.15) return 'Epic';
    if (rand < 0.35) return 'Rare';
    if (rand < 0.65) return 'Uncommon';
    return 'Common';
  };

  const getSuitIcon = (suit: string) => {
    switch (suit) {
      case 'Cups': return Heart;
      case 'Swords': return Sword;
      case 'Pentacles': return Coins;
      case 'Wands': return Wand;
      default: return Star;
    }
  };

  const getRarityColor = (rarity: string) => {
    switch (rarity) {
      case 'Legendary': return 'text-yellow-400 bg-yellow-400/10';
      case 'Epic': return 'text-purple-400 bg-purple-400/10';
      case 'Rare': return 'text-blue-400 bg-blue-400/10';
      case 'Uncommon': return 'text-green-400 bg-green-400/10';
      default: return 'text-gray-400 bg-gray-400/10';
    }
  };

  if (!user) {
    return (
      <div className="space-y-6">
        <div className="bg-slate-800 border border-slate-700 rounded-xl p-8 text-center">
          <Package className="w-16 h-16 text-gray-400 mx-auto mb-4" />
          <p className="text-gray-400 mb-4">Sign in to view your collection</p>
        </div>
      </div>
    );
  }

  if (isLoading) {
    return (
      <div className="space-y-6">
        <div className="bg-slate-800 border border-slate-700 rounded-xl p-8 text-center">
          <div className="animate-spin w-8 h-8 border-2 border-purple-400 border-t-transparent rounded-full mx-auto mb-4"></div>
          <p className="text-gray-400">Loading your collection...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-yellow-400">My Collection</h1>
          <p className="text-gray-400">{cards.length} cards collected</p>
        </div>
        <button 
          onClick={openPack}
          className="bg-purple-500 hover:bg-purple-600 text-white px-4 py-2 rounded-lg font-medium transition-colors"
        >
          Open Pack
        </button>
      </div>

      {cards.length > 0 ? (
        <div className="grid grid-cols-2 gap-4">
          {cards.map((card) => {
            const IconComponent = getSuitIcon(card.suit);
            return (
              <div key={`${card.id}-${card.obtained_at}`} className="bg-slate-800 border border-slate-700 rounded-xl p-4 hover:bg-slate-750 transition-colors cursor-pointer">
                <div className="aspect-[3/4] bg-slate-700 rounded-lg flex items-center justify-center mb-3">
                  <IconComponent className="w-8 h-8 text-yellow-400" />
                </div>
                
                <h3 className="text-white font-semibold text-sm mb-1">{card.name}</h3>
                <p className="text-gray-400 text-xs mb-2">{card.suit}</p>
                
                <span className={`px-2 py-1 rounded-full text-xs font-medium ${getRarityColor(card.rarity)}`}>
                  {card.rarity}
                </span>
              </div>
            );
          })}
        </div>
      ) : (
        <div className="bg-slate-800 border border-slate-700 rounded-xl p-8 text-center">
          <div className="w-16 h-16 bg-slate-700 rounded-full flex items-center justify-center mx-auto mb-4">
            <Package className="w-8 h-8 text-gray-400" />
          </div>
          <p className="text-gray-400 mb-4">Your collection is empty</p>
          <button 
            onClick={openPack}
            className="text-purple-400 hover:text-purple-300 transition-colors font-medium"
          >
            Open your first pack
          </button>
        </div>
      )}
    </div>
  );
};

export default CollectionView;