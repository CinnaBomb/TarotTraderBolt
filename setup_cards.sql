-- Check if cards exist and insert if needed
DO $$
BEGIN
  -- Check if we have any cards
  IF NOT EXISTS (SELECT 1 FROM tarot_cards LIMIT 1) THEN
    -- Insert sample tarot cards
    INSERT INTO tarot_cards (name, suit, meaning, card_type, rarity, description) VALUES
    -- Major Arcana
    ('The Fool', 'Major Arcana', 'New beginnings, innocence, spontaneity', 'major', 'legendary', 'The Fool represents new beginnings, having faith in the future, being inexperienced, not knowing what to expect.'),
    ('The Magician', 'Major Arcana', 'Manifestation, resourcefulness, power', 'major', 'legendary', 'The Magician is about taking action and having the resources to do so. He represents someone who can make things happen.'),
    ('The High Priestess', 'Major Arcana', 'Intuition, sacred knowledge, divine feminine', 'major', 'legendary', 'The High Priestess represents intuition, sacred knowledge, and the divine feminine.'),
    ('The Empress', 'Major Arcana', 'Femininity, beauty, nature, abundance', 'major', 'legendary', 'The Empress represents femininity, beauty, nature, and abundance. She is the mother figure of the Tarot.'),
    ('The Emperor', 'Major Arcana', 'Authority, establishment, structure, father figure', 'major', 'legendary', 'The Emperor represents authority, structure, control, and fatherhood.'),
    ('The Hierophant', 'Major Arcana', 'Spiritual wisdom, religious beliefs, conformity', 'major', 'legendary', 'The Hierophant represents spiritual wisdom, religious beliefs, and conformity to social expectations.'),
    ('The Lovers', 'Major Arcana', 'Love, harmony, relationships, values alignment', 'major', 'legendary', 'The Lovers represents love, harmony, relationships, and the alignment of values.'),
    ('The Chariot', 'Major Arcana', 'Control, will power, success, determination', 'major', 'legendary', 'The Chariot represents control, willpower, success, and determination to overcome obstacles.'),
    ('Strength', 'Major Arcana', 'Inner strength, bravery, compassion, focus', 'major', 'legendary', 'Strength represents inner strength, bravery, compassion, and focus in the face of adversity.'),
    ('The Hermit', 'Major Arcana', 'Soul searching, introspection, inner guidance', 'major', 'legendary', 'The Hermit represents soul searching, introspection, and seeking inner guidance.'),
    ('Wheel of Fortune', 'Major Arcana', 'Good luck, karma, life cycles, destiny', 'major', 'legendary', 'The Wheel of Fortune represents good luck, karma, life cycles, and the turning of fate.'),
    ('Justice', 'Major Arcana', 'Justice, fairness, truth, cause and effect', 'major', 'legendary', 'Justice represents justice, fairness, truth, and the law of cause and effect.'),
    ('The Hanged Man', 'Major Arcana', 'Suspension, restriction, letting go', 'major', 'legendary', 'The Hanged Man represents suspension, restriction, and the need to let go and surrender.'),
    ('Death', 'Major Arcana', 'Endings, beginnings, change, transformation', 'major', 'legendary', 'Death represents endings, beginnings, change, and transformation. It rarely means literal death.'),
    ('Temperance', 'Major Arcana', 'Balance, moderation, patience, purpose', 'major', 'legendary', 'Temperance represents balance, moderation, patience, and finding the middle path.'),
    ('The Devil', 'Major Arcana', 'Bondage, addiction, sexuality, materialism', 'major', 'legendary', 'The Devil represents bondage, addiction, sexuality, and being trapped by material desires.'),
    ('The Tower', 'Major Arcana', 'Sudden change, upheaval, chaos, revelation', 'major', 'legendary', 'The Tower represents sudden change, upheaval, chaos, and shocking revelations.'),
    ('The Star', 'Major Arcana', 'Hope, faith, purpose, renewal, spirituality', 'major', 'legendary', 'The Star represents hope, faith, purpose, renewal, and spiritual guidance.'),
    ('The Moon', 'Major Arcana', 'Illusion, fear, anxiety, subconscious, intuition', 'major', 'legendary', 'The Moon represents illusion, fear, anxiety, and the subconscious mind.'),
    ('The Sun', 'Major Arcana', 'Happiness, success, optimism, vitality', 'major', 'legendary', 'The Sun represents happiness, success, optimism, vitality, and joy.'),
    ('Judgement', 'Major Arcana', 'Judgement, rebirth, inner calling, absolution', 'major', 'legendary', 'Judgement represents judgement, rebirth, inner calling, and absolution.'),
    ('The World', 'Major Arcana', 'Completion, accomplishment, travel, completion', 'major', 'legendary', 'The World represents completion, accomplishment, and the successful end of a cycle.'),

    -- Sample Minor Arcana - Wands
    ('Ace of Wands', 'Wands', 'Inspiration, new opportunities, growth', 'minor', 'rare', 'The Ace of Wands represents inspiration, new opportunities, and creative growth.'),
    ('Two of Wands', 'Wands', 'Future planning, making decisions, leaving comfort zone', 'minor', 'common', 'The Two of Wands represents future planning, personal power, and making decisions.'),
    ('Three of Wands', 'Wands', 'Expansion, foresight, overseas opportunities', 'minor', 'common', 'The Three of Wands represents expansion, foresight, and long-term planning.'),
    ('Ten of Wands', 'Wands', 'Burden, extra responsibility, hard work', 'minor', 'uncommon', 'The Ten of Wands represents burden, responsibility, and being overloaded with duties.'),

    -- Sample Minor Arcana - Cups
    ('Ace of Cups', 'Cups', 'Love, new relationships, compassion, creativity', 'minor', 'rare', 'The Ace of Cups represents new love, emotional beginnings, and spiritual abundance.'),
    ('Two of Cups', 'Cups', 'Unified love, partnership, mutual attraction', 'minor', 'common', 'The Two of Cups represents unified love, partnership, and mutual attraction.'),
    ('Three of Cups', 'Cups', 'Celebration, friendship, creativity, community', 'minor', 'common', 'The Three of Cups represents celebration, friendship, and creative collaboration.'),
    ('Ten of Cups', 'Cups', 'Divine love, blissful relationships, harmony', 'minor', 'uncommon', 'The Ten of Cups represents emotional fulfillment, happiness, and harmony.'),

    -- Sample Minor Arcana - Swords
    ('Ace of Swords', 'Swords', 'Breakthrough, clarity, sharp mind', 'minor', 'rare', 'The Ace of Swords represents breakthrough, new ideas, and mental clarity.'),
    ('Two of Swords', 'Swords', 'Difficult decisions, weighing options, indecision', 'minor', 'common', 'The Two of Swords represents difficult decisions, being at a crossroads, and indecision.'),
    ('Three of Swords', 'Swords', 'Heartbreak, emotional pain, sorrow', 'minor', 'common', 'The Three of Swords represents heartbreak, emotional pain, and sorrow.'),
    ('Ten of Swords', 'Swords', 'Painful endings, deep wounds, betrayal', 'minor', 'uncommon', 'The Ten of Swords represents painful endings, betrayal, and rock bottom moments.'),

    -- Sample Minor Arcana - Pentacles
    ('Ace of Pentacles', 'Pentacles', 'Manifestation, new financial opportunity, prosperity', 'minor', 'rare', 'The Ace of Pentacles represents new financial opportunities and material manifestation.'),
    ('Two of Pentacles', 'Pentacles', 'Multiple priorities, time management, prioritization', 'minor', 'common', 'The Two of Pentacles represents juggling priorities and finding balance.'),
    ('Three of Pentacles', 'Pentacles', 'Collaboration, learning, implementation', 'minor', 'common', 'The Three of Pentacles represents teamwork, collaboration, and shared goals.'),
    ('Ten of Pentacles', 'Pentacles', 'Wealth, financial security, family', 'minor', 'uncommon', 'The Ten of Pentacles represents wealth, financial security, and family legacy.');

    RAISE NOTICE 'Inserted % tarot cards', (SELECT COUNT(*) FROM tarot_cards);
  ELSE
    RAISE NOTICE 'Cards already exist. Current count: %', (SELECT COUNT(*) FROM tarot_cards);
  END IF;
END $$;
