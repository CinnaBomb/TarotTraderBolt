import { createClient } from '@supabase/supabase-js';

const supabaseUrl = 'https://nquezqygzrmxxmlzrucd.supabase.co';
const supabaseKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Im5xdWV6cXlnenJteHhtbHpydWNkIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTM2ODY1NDMsImV4cCI6MjA2OTI2MjU0M30.0xmu8rveCd79kCz8g6O_bdLdvu5GVcycFyZ0a9l8Xqk';

const supabase = createClient(supabaseUrl, supabaseKey);

const tarotCards = [
  // Major Arcana
  { name: 'The Fool', suit: 'Major Arcana', meaning: 'New beginnings, innocence, spontaneity', card_type: 'major', rarity: 'legendary', description: 'The Fool represents new beginnings, having faith in the future, being inexperienced, not knowing what to expect.' },
  { name: 'The Magician', suit: 'Major Arcana', meaning: 'Manifestation, resourcefulness, power', card_type: 'major', rarity: 'legendary', description: 'The Magician is about taking action and having the resources to do so. He represents someone who can make things happen.' },
  { name: 'The High Priestess', suit: 'Major Arcana', meaning: 'Intuition, sacred knowledge, divine feminine', card_type: 'major', rarity: 'legendary', description: 'The High Priestess represents intuition, sacred knowledge, and the divine feminine.' },
  { name: 'The Empress', suit: 'Major Arcana', meaning: 'Femininity, beauty, nature, abundance', card_type: 'major', rarity: 'legendary', description: 'The Empress represents femininity, beauty, nature, and abundance. She is the mother figure of the Tarot.' },
  { name: 'The Emperor', suit: 'Major Arcana', meaning: 'Authority, establishment, structure, father figure', card_type: 'major', rarity: 'legendary', description: 'The Emperor represents authority, structure, control, and fatherhood.' },
  { name: 'The Hierophant', suit: 'Major Arcana', meaning: 'Spiritual wisdom, religious beliefs, conformity', card_type: 'major', rarity: 'legendary', description: 'The Hierophant represents spiritual wisdom, religious beliefs, and conformity to social expectations.' },
  { name: 'The Lovers', suit: 'Major Arcana', meaning: 'Love, harmony, relationships, values alignment', card_type: 'major', rarity: 'legendary', description: 'The Lovers represents love, harmony, relationships, and the alignment of values.' },
  { name: 'The Chariot', suit: 'Major Arcana', meaning: 'Control, will power, success, determination', card_type: 'major', rarity: 'legendary', description: 'The Chariot represents control, willpower, success, and determination to overcome obstacles.' },
  { name: 'Strength', suit: 'Major Arcana', meaning: 'Inner strength, bravery, compassion, focus', card_type: 'major', rarity: 'legendary', description: 'Strength represents inner strength, bravery, compassion, and focus in the face of adversity.' },
  { name: 'The Hermit', suit: 'Major Arcana', meaning: 'Soul searching, introspection, inner guidance', card_type: 'major', rarity: 'legendary', description: 'The Hermit represents soul searching, introspection, and seeking inner guidance.' },
  { name: 'Wheel of Fortune', suit: 'Major Arcana', meaning: 'Good luck, karma, life cycles, destiny', card_type: 'major', rarity: 'legendary', description: 'The Wheel of Fortune represents good luck, karma, life cycles, and the turning of fate.' },
  { name: 'Justice', suit: 'Major Arcana', meaning: 'Justice, fairness, truth, cause and effect', card_type: 'major', rarity: 'legendary', description: 'Justice represents justice, fairness, truth, and the law of cause and effect.' },
  { name: 'The Hanged Man', suit: 'Major Arcana', meaning: 'Suspension, restriction, letting go', card_type: 'major', rarity: 'legendary', description: 'The Hanged Man represents suspension, restriction, and the need to let go and surrender.' },
  { name: 'Death', suit: 'Major Arcana', meaning: 'Endings, beginnings, change, transformation', card_type: 'major', rarity: 'legendary', description: 'Death represents endings, beginnings, change, and transformation. It rarely means literal death.' },
  { name: 'Temperance', suit: 'Major Arcana', meaning: 'Balance, moderation, patience, purpose', card_type: 'major', rarity: 'legendary', description: 'Temperance represents balance, moderation, patience, and finding the middle path.' },
  { name: 'The Devil', suit: 'Major Arcana', meaning: 'Bondage, addiction, sexuality, materialism', card_type: 'major', rarity: 'legendary', description: 'The Devil represents bondage, addiction, sexuality, and being trapped by material desires.' },
  { name: 'The Tower', suit: 'Major Arcana', meaning: 'Sudden change, upheaval, chaos, revelation', card_type: 'major', rarity: 'legendary', description: 'The Tower represents sudden change, upheaval, chaos, and shocking revelations.' },
  { name: 'The Star', suit: 'Major Arcana', meaning: 'Hope, faith, purpose, renewal, spirituality', card_type: 'major', rarity: 'legendary', description: 'The Star represents hope, faith, purpose, renewal, and spiritual guidance.' },
  { name: 'The Moon', suit: 'Major Arcana', meaning: 'Illusion, fear, anxiety, subconscious, intuition', card_type: 'major', rarity: 'legendary', description: 'The Moon represents illusion, fear, anxiety, and the subconscious mind.' },
  { name: 'The Sun', suit: 'Major Arcana', meaning: 'Happiness, success, optimism, vitality', card_type: 'major', rarity: 'legendary', description: 'The Sun represents happiness, success, optimism, vitality, and joy.' },
  { name: 'Judgement', suit: 'Major Arcana', meaning: 'Judgement, rebirth, inner calling, absolution', card_type: 'major', rarity: 'legendary', description: 'Judgement represents judgement, rebirth, inner calling, and absolution.' },
  { name: 'The World', suit: 'Major Arcana', meaning: 'Completion, accomplishment, travel, completion', card_type: 'major', rarity: 'legendary', description: 'The World represents completion, accomplishment, and the successful end of a cycle.' },

  // Sample Minor Arcana - Wands
  { name: 'Ace of Wands', suit: 'Wands', meaning: 'Inspiration, new opportunities, growth', card_type: 'minor', rarity: 'rare', description: 'The Ace of Wands represents inspiration, new opportunities, and creative growth.' },
  { name: 'Two of Wands', suit: 'Wands', meaning: 'Future planning, making decisions, leaving comfort zone', card_type: 'minor', rarity: 'common', description: 'The Two of Wands represents future planning, personal power, and making decisions.' },
  { name: 'Three of Wands', suit: 'Wands', meaning: 'Expansion, foresight, overseas opportunities', card_type: 'minor', rarity: 'common', description: 'The Three of Wands represents expansion, foresight, and long-term planning.' },
  { name: 'Ten of Wands', suit: 'Wands', meaning: 'Burden, extra responsibility, hard work', card_type: 'minor', rarity: 'uncommon', description: 'The Ten of Wands represents burden, responsibility, and being overloaded with duties.' },

  // Sample Minor Arcana - Cups
  { name: 'Ace of Cups', suit: 'Cups', meaning: 'Love, new relationships, compassion, creativity', card_type: 'minor', rarity: 'rare', description: 'The Ace of Cups represents new love, emotional beginnings, and spiritual abundance.' },
  { name: 'Two of Cups', suit: 'Cups', meaning: 'Unified love, partnership, mutual attraction', card_type: 'minor', rarity: 'common', description: 'The Two of Cups represents unified love, partnership, and mutual attraction.' },
  { name: 'Three of Cups', suit: 'Cups', meaning: 'Celebration, friendship, creativity, community', card_type: 'minor', rarity: 'common', description: 'The Three of Cups represents celebration, friendship, and creative collaboration.' },
  { name: 'Ten of Cups', suit: 'Cups', meaning: 'Divine love, blissful relationships, harmony', card_type: 'minor', rarity: 'uncommon', description: 'The Ten of Cups represents emotional fulfillment, happiness, and harmony.' },

  // Sample Minor Arcana - Swords
  { name: 'Ace of Swords', suit: 'Swords', meaning: 'Breakthrough, clarity, sharp mind', card_type: 'minor', rarity: 'rare', description: 'The Ace of Swords represents breakthrough, new ideas, and mental clarity.' },
  { name: 'Two of Swords', suit: 'Swords', meaning: 'Difficult decisions, weighing options, indecision', card_type: 'minor', rarity: 'common', description: 'The Two of Swords represents difficult decisions, being at a crossroads, and indecision.' },
  { name: 'Three of Swords', suit: 'Swords', meaning: 'Heartbreak, emotional pain, sorrow', card_type: 'minor', rarity: 'common', description: 'The Three of Swords represents heartbreak, emotional pain, and sorrow.' },
  { name: 'Ten of Swords', suit: 'Swords', meaning: 'Painful endings, deep wounds, betrayal', card_type: 'minor', rarity: 'uncommon', description: 'The Ten of Swords represents painful endings, betrayal, and rock bottom moments.' },

  // Sample Minor Arcana - Pentacles
  { name: 'Ace of Pentacles', suit: 'Pentacles', meaning: 'Manifestation, new financial opportunity, prosperity', card_type: 'minor', rarity: 'rare', description: 'The Ace of Pentacles represents new financial opportunities and material manifestation.' },
  { name: 'Two of Pentacles', suit: 'Pentacles', meaning: 'Multiple priorities, time management, prioritization', card_type: 'minor', rarity: 'common', description: 'The Two of Pentacles represents juggling priorities and finding balance.' },
  { name: 'Three of Pentacles', suit: 'Pentacles', meaning: 'Collaboration, learning, implementation', card_type: 'minor', rarity: 'common', description: 'The Three of Pentacles represents teamwork, collaboration, and shared goals.' },
  { name: 'Ten of Pentacles', suit: 'Pentacles', meaning: 'Wealth, financial security, family', card_type: 'minor', rarity: 'uncommon', description: 'The Ten of Pentacles represents wealth, financial security, and family legacy.' }
];

async function setupTarotCards() {
  try {
    console.log('Checking if tarot cards exist...');
    
    // Check if cards already exist
    const { data: existingCards, error: checkError } = await supabase
      .from('tarot_cards')
      .select('id')
      .limit(1);

    if (checkError) {
      console.error('Error checking existing cards:', checkError);
      return;
    }

    if (existingCards && existingCards.length > 0) {
      console.log('Tarot cards already exist in the database');
      
      // Get count of existing cards
      const { count } = await supabase
        .from('tarot_cards')
        .select('*', { count: 'exact', head: true });
      
      console.log(`Current card count: ${count}`);
      return;
    }

    console.log('No cards found. Inserting tarot cards...');

    // Insert the cards
    const { data, error } = await supabase
      .from('tarot_cards')
      .insert(tarotCards)
      .select();

    if (error) {
      console.error('Error inserting cards:', error);
      return;
    }

    console.log(`✅ Successfully inserted ${data?.length || 0} tarot cards!`);

    // Verify insertion
    const { count } = await supabase
      .from('tarot_cards')
      .select('*', { count: 'exact', head: true });
    
    console.log(`Total cards in database: ${count}`);

  } catch (error) {
    console.error('Script error:', error);
  }
}

setupTarotCards();
