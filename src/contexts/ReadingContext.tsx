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
      // Load completed readings
      const { data: readingsData, error: readingsError } = await supabase
        .from('readings')
        .select(`
          *,
          reading_cards (
            *,
            cards (*)
          )
        `)
        .eq('user_id', user.id)
        .order('created_at', { ascending: false });

      if (readingsError) throw readingsError;

      // Load current in-progress reading
      const inProgressReading = readingsData?.find(r => r.status === 'in-progress');
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
    const cards = readingData.reading_cards?.map((rc: any) => ({
      ...rc.cards,
      reversed: rc.reversed,
      position: rc.position,
    })) || [];

    return {
      id: readingData.id,
      title: readingData.title,
      type: readingData.type,
      cards,
      cards_drawn: cards,
      status: readingData.status,
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
          title,
          type,
          status: 'in-progress',
        })
        .select()
        .single();

      if (error) throw error;

      const newReading: Reading = {
        id: data.id,
        title: data.title,
        type: data.type,
        cards: [],
        cards_drawn: [],
        status: 'in-progress',
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
      // Get random card from database
      const { data: cards, error: cardsError } = await supabase
        .from('cards')
        .select('*');

      if (cardsError) throw cardsError;
      if (!cards || cards.length === 0) return;

      const randomCard = cards[Math.floor(Math.random() * cards.length)];
      const reversed = Math.random() < 0.3; // 30% chance of reversed

      // Insert reading card
      const { error: insertError } = await supabase
        .from('reading_cards')
        .insert({
          reading_id: currentReading.id,
          card_id: randomCard.id,
          position,
          reversed,
        });

      if (insertError) throw insertError;

      // Update local state
      const cardWithPosition: Card = {
        ...randomCard,
        reversed,
        position,
      };

      const updatedReading = {
        ...currentReading,
        cards: [...currentReading.cards, cardWithPosition],
        cards_drawn: [...currentReading.cards_drawn, cardWithPosition],
      };

      setCurrentReading(updatedReading);

      // Auto-complete reading when all 3 cards are drawn
      if (updatedReading.cards.length === 3) {
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
          updated_at: new Date().toISOString(),
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
          updated_at: new Date().toISOString(),
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
    }}>
      {children}
    </ReadingContext.Provider>
  );
};