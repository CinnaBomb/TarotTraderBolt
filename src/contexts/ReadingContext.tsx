import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { supabase } from '../lib/supabase';
import { useAuth } from './AuthContext';

export interface Card {
  id: string;
  name: string;
  suit: string;
  meaning: string;
  card_type: string;
  reversed?: boolean;
  position?: 'past' | 'present' | 'future';
}

export interface Reading {
  id: string;
  title: string;
  type: string;
  cards: Card[];
  cards_drawn: Card[];
  status: 'in-progress' | 'completed';
  createdAt: Date;
  interpretation?: string;
}

interface ReadingContextType {
  currentReading: Reading | null;
  readings: Reading[];
  startNewReading: (type: string, title: string) => Promise<void>;
  continueReading: () => void;
  drawCard: (position: 'past' | 'present' | 'future') => Promise<void>;
  completeReading: () => Promise<void>;
  isReadingModalOpen: boolean;
  setIsReadingModalOpen: (open: boolean) => void;
  loadReadings: () => Promise<void>;
  setCurrentReading: (reading: Reading | null) => void;
  deleteReading: (readingId: string) => Promise<void>;
  openReading: (reading: Reading) => void;
}

const ReadingContext = createContext<ReadingContextType | undefined>(undefined);

export const useReading = () => {
  const context = useContext(ReadingContext);
  if (context === undefined) {
    throw new Error('useReading must be used within a ReadingProvider');
  }
  return context;
};

interface ReadingProviderProps {
  children: ReactNode;
}

export const ReadingProvider: React.FC<ReadingProviderProps> = ({ children }) => {
  const { user } = useAuth();
  const [currentReading, setCurrentReading] = useState<Reading | null>(null);
  const [readings, setReadings] = useState<Reading[]>([]);
  const [isReadingModalOpen, setIsReadingModalOpen] = useState(false);

  useEffect(() => {
    if (user) {
      loadReadings();
    } else {
      setCurrentReading(null);
      setReadings([]);
    }
  }, [user]);

  const loadReadings = async () => {
    if (!user) return;

    try {
      // Load all readings (the database doesn't have reading_cards table, so we'll work with cards_drawn JSONB)
      const { data: readingsData, error: readingsError } = await supabase
        .from('readings')
        .select('*')
        .eq('user_id', user.id)
        .order('created_at', { ascending: false });

      if (readingsError) throw readingsError;

      // Load current in-progress reading
      const inProgressReading = readingsData?.find(r => r.status === 'in_progress');
      const completedReadings = readingsData?.filter(r => r.status === 'completed') || [];

      // Transform data
      const transformedReadings = completedReadings.map(transformReadingData);
      setReadings(transformedReadings);

      if (inProgressReading) {
        setCurrentReading(transformReadingData(inProgressReading));
      } else {
        setCurrentReading(null);
      }
    } catch (error) {
      console.error('Error loading readings:', error);
    }
  };

  const transformReadingData = (readingData: any): Reading => {
    // Parse cards_drawn from JSONB, ensuring it's an array
    let cards = [];
    try {
      if (readingData.cards_drawn) {
        cards = Array.isArray(readingData.cards_drawn) 
          ? readingData.cards_drawn 
          : JSON.parse(readingData.cards_drawn);
      }
    } catch (error) {
      console.error('Error parsing cards_drawn:', error);
      cards = [];
    }

    return {
      id: readingData.id,
      title: readingData.name,
      type: readingData.spread_type,
      cards: cards,
      cards_drawn: cards,
      status: readingData.status === 'in_progress' ? 'in-progress' : 'completed',
      createdAt: new Date(readingData.created_at),
      interpretation: readingData.interpretation,
    };
  };

  const startNewReading = async (type: string, title: string) => {
    if (!user) return;

    try {
      const { data, error } = await supabase
        .from('readings')
        .insert({
          user_id: user.id,
          name: title, // Use 'name' instead of 'title'
          spread_type: type, // Use 'spread_type' instead of 'type'
          status: 'in_progress', // Use 'in_progress' instead of 'in-progress'
        })
        .select()
        .single();

      if (error) throw error;

      const newReading: Reading = {
        id: data.id,
        title: data.name, // Map 'name' to 'title' for our interface
        type: data.spread_type, // Map 'spread_type' to 'type' for our interface
        cards: [],
        cards_drawn: [],
        status: 'in-progress', // Keep our interface consistent
        createdAt: new Date(data.created_at),
      };

      setCurrentReading(newReading);
      setIsReadingModalOpen(true);
    } catch (error) {
      console.error('Error starting new reading:', error);
    }
  };

  const continueReading = () => {
    if (currentReading) {
      setIsReadingModalOpen(true);
    }
  };

  const drawCard = async (position: 'past' | 'present' | 'future') => {
    if (!currentReading || !user) return;

    try {
      // Get the IDs of cards already drawn in this reading
      const drawnCardIds = currentReading.cards.map(card => card.id);

      // Get random card from database, excluding already drawn cards
      const { data: cards, error: cardsError } = await supabase
        .from('tarot_cards')
        .select('*')
        .not('id', 'in', `(${drawnCardIds.join(',')})`);

      if (cardsError) throw cardsError;
      if (!cards || cards.length === 0) {
        console.error('No more available cards to draw');
        return;
      }

      const randomCard = cards[Math.floor(Math.random() * cards.length)];
      const reversed = Math.random() < 0.3; // 30% chance of reversed

      // Update local state
      const cardWithPosition: Card = {
        ...randomCard,
        reversed,
        position,
      };

      const updatedCards = [...currentReading.cards, cardWithPosition];
      
      // Format the cards for database storage
      const cardsForDB = updatedCards.map(card => ({
        id: card.id,
        name: card.name,
        suit: card.suit,
        meaning: card.meaning,
        reversed: card.reversed,
        position: card.position
      }));

      // Update database with the new cards_drawn array
      const { error: updateError } = await supabase
        .from('readings')
        .update({ 
          cards_drawn: cardsForDB
        })
        .eq('id', currentReading.id)
        .select()
        .single();

      if (updateError) throw updateError;

      const updatedReading = {
        ...currentReading,
        cards: updatedCards,
        cards_drawn: updatedCards,
      };

      setCurrentReading(updatedReading);

      // Auto-complete reading when all 3 cards are drawn
      if (updatedCards.length === 3) {
        setTimeout(() => {
          generateAIInterpretation(updatedReading);
        }, 500);
      }
    } catch (error) {
      console.error('Error drawing card:', error);
    }
  };

  const generateAIInterpretation = async (reading: Reading) => {
    if (reading.cards.length !== 3 || !user) return;

    const [pastCard, presentCard, futureCard] = reading.cards;
    
    // For now, generate a simulated interpretation
    // This will be replaced with real AI in the next step
    const interpretation = `Your three-card reading reveals a powerful narrative:

**Past (${pastCard.name}${pastCard.reversed ? ' - Reversed' : ''})**: ${pastCard.meaning}${pastCard.reversed ? ' The reversed position suggests you may have struggled with or avoided these energies in your past.' : ' This foundation has shaped your current path.'}

**Present (${presentCard.name}${presentCard.reversed ? ' - Reversed' : ''})**: ${presentCard.meaning}${presentCard.reversed ? ' Currently, you may be experiencing blockages or need to approach this differently.' : ' This is where you find yourself now, with these energies actively influencing your life.'}

**Future (${futureCard.name}${futureCard.reversed ? ' - Reversed' : ''})**: ${futureCard.meaning}${futureCard.reversed ? ' Be mindful of potential challenges or the need to transform your approach to achieve this outcome.' : ' This represents the potential outcome if you continue on your current path.'}

The cards suggest a journey from ${pastCard.name.toLowerCase()} through ${presentCard.name.toLowerCase()} toward ${futureCard.name.toLowerCase()}. Trust in the wisdom these cards offer and consider how their messages resonate with your current life situation.`;

    try {
      // Update reading with interpretation
      const { error } = await supabase
        .from('readings')
        .update({ 
          interpretation,
          status: 'completed',
          completed_at: new Date().toISOString(),
        })
        .eq('id', reading.id);

      if (error) throw error;

      const updatedReading = {
        ...reading,
        status: 'completed' as const,
        interpretation,
      };

      setCurrentReading(updatedReading);
    } catch (error) {
      console.error('Error updating reading with interpretation:', error);
    }
  };

  const completeReading = async () => {
    if (!currentReading || !user) return;

    try {
      const { error } = await supabase
        .from('readings')
        .update({ 
          status: 'completed',
          completed_at: new Date().toISOString(),
        })
        .eq('id', currentReading.id);

      if (error) throw error;

      const completedReading = {
        ...currentReading,
        status: 'completed' as const,
      };

      setReadings(prev => [completedReading, ...prev]);
      setCurrentReading(null);
      await loadReadings(); // Refresh readings
    } catch (error) {
      console.error('Error completing reading:', error);
    }
  };

  const deleteReading = async (readingId: string) => {
    if (!user) return;

    try {
      const { error } = await supabase
        .from('readings')
        .delete()
        .eq('id', readingId);

      if (error) throw error;

      // Remove from local state
      setReadings(prev => prev.filter(r => r.id !== readingId));
      if (currentReading?.id === readingId) {
        setCurrentReading(null);
        setIsReadingModalOpen(false);
      }
    } catch (error) {
      console.error('Error deleting reading:', error);
    }
  };

  const openReading = (reading: Reading) => {
    setCurrentReading(reading);
    setIsReadingModalOpen(true);
  };

  return (
    <ReadingContext.Provider value={{
      currentReading,
      readings,
      startNewReading,
      continueReading,
      drawCard,
      completeReading,
      isReadingModalOpen,
      setIsReadingModalOpen,
      loadReadings,
      setCurrentReading,
      deleteReading,
      openReading,
    }}>
      {children}
    </ReadingContext.Provider>
  );
};