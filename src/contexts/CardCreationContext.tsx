import React, { createContext, useContext, useState } from 'react';
import { supabase } from '../lib/supabase';
import { useAuth } from './AuthContext';

interface GeneratedCard {
  name: string;
  suit: string;
  meaning: string;
  description: string;
}

interface CardData {
  id: string;
  name: string;
  suit: string;
  meaning: string;
  card_type: string;
}

interface CardCreationContextType {
  isCreatingCard: boolean;
  setIsCreatingCard: (isCreating: boolean) => void;
  createCard: (prompt: string) => Promise<void>;
  isLoading: boolean;
}

const CardCreationContext = createContext<CardCreationContextType | undefined>(undefined);

export const useCardCreation = () => {
  const context = useContext(CardCreationContext);
  if (!context) {
    throw new Error('useCardCreation must be used within a CardCreationProvider');
  }
  return context;
};

export const CardCreationProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [isCreatingCard, setIsCreatingCard] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const { user } = useAuth();

  const createCard = async (prompt: string): Promise<void> => {
    if (!user) {
      alert('Please sign in to create cards');
      return;
    }
    
    if (!prompt.trim()) {
      alert('Please provide a description for your card');
      return;
    }
    
    setIsLoading(true);
    try {
      console.log('Starting card creation with prompt:', prompt);
      
      // Call OpenAI API to generate card details
      const response = await fetch('/api/generate-card', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ prompt }),
      });

      console.log('API Response status:', response.status);
      const responseText = await response.text();
      console.log('API Response text:', responseText);

      if (!response.ok) {
        throw new Error(`Failed to generate card: ${responseText}`);
      }

      let generatedCard: GeneratedCard;
      try {
        generatedCard = JSON.parse(responseText);
      } catch (e) {
        throw new Error('Invalid response from card generation API');
      }

      if (!generatedCard.name || !generatedCard.suit || !generatedCard.meaning) {
        throw new Error('Invalid card data received from API');
      }

      console.log('Generated card data:', generatedCard);

      // Insert the new card into the cards table
      const { data: cardData, error: cardError } = await supabase
        .from('cards')
        .insert([{
          name: generatedCard.name,
          suit: generatedCard.suit,
          meaning: generatedCard.meaning,
          card_type: 'custom'
        }])
        .select()
        .single();

      if (cardError) {
        console.error('Error inserting card:', cardError);
        throw new Error(`Failed to save card: ${cardError.message}`);
      }
      
      if (!cardData) {
        throw new Error('Failed to create card: No data returned');
      }

      console.log('Card created:', cardData);

      // Add the card to user's collection
      const { error: userCardError } = await supabase
        .from('user_cards')
        .insert([{
          user_id: user.id,
          card_id: cardData.id,
          rarity: 'rare'
        }]);

      if (userCardError) {
        console.error('Error linking card to user:', userCardError);
        throw new Error(`Failed to add card to collection: ${userCardError.message}`);
      }

      console.log('Card added to collection successfully');
      setIsCreatingCard(false);
    } catch (error) {
      console.error('Error in card creation process:', error);
      alert('Failed to create card: ' + (error instanceof Error ? error.message : 'Unknown error'));
      throw error; // Re-throw to maintain Promise rejection
    } finally {
      setIsLoading(false);
    }
  };  const contextValue: CardCreationContextType = {
    isCreatingCard,
    setIsCreatingCard,
    createCard,
    isLoading,
  };

  return (
    <CardCreationContext.Provider value={contextValue}>
      {children}
    </CardCreationContext.Provider>
  );
};