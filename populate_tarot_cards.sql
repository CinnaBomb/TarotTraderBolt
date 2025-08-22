-- Check if tarot_cards table has data and insert sample cards if empty
DO $$
DECLARE
    card_count INTEGER;
BEGIN
    SELECT COUNT(*) INTO card_count FROM tarot_cards;
    
    IF card_count = 0 THEN
        -- Insert sample tarot cards
        INSERT INTO tarot_cards (name, suit, meaning, card_type, rarity, description) VALUES
        -- Major Arcana
        ('The Fool', 'Major Arcana', 'New beginnings, innocence, spontaneity', 'major', 'rare', 'The beginning of a journey, representing infinite possibilities and new adventures.'),
        ('The Magician', 'Major Arcana', 'Manifestation, resourcefulness, power', 'major', 'rare', 'The ability to manifest your desires through willpower and determination.'),
        ('The High Priestess', 'Major Arcana', 'Intuition, sacred knowledge, divine feminine', 'major', 'rare', 'Trust in your intuition and inner wisdom to guide you.'),
        ('The Empress', 'Major Arcana', 'Femininity, beauty, nature, abundance', 'major', 'rare', 'Nurturing energy and creative abundance in all aspects of life.'),
        ('The Emperor', 'Major Arcana', 'Authority, structure, control, father-figure', 'major', 'rare', 'Stability and authority through structure and discipline.'),
        
        -- Cups
        ('Ace of Cups', 'Cups', 'Love, new relationships, compassion', 'minor', 'common', 'The beginning of emotional fulfillment and spiritual connection.'),
        ('Two of Cups', 'Cups', 'Unity, partnership, connection', 'minor', 'common', 'Harmony and mutual attraction in relationships.'),
        ('Three of Cups', 'Cups', 'Celebration, friendship, creativity', 'minor', 'common', 'Joy and celebration with friends and community.'),
        ('King of Cups', 'Cups', 'Emotional balance, compassion, diplomacy', 'minor', 'uncommon', 'Mature emotional intelligence and compassionate leadership.'),
        ('Queen of Cups', 'Cups', 'Compassionate, caring, emotionally secure', 'minor', 'uncommon', 'Nurturing intuition and emotional depth.'),
        
        -- Wands
        ('Ace of Wands', 'Wands', 'Inspiration, new opportunities, growth', 'minor', 'common', 'A spark of creative energy and new potential.'),
        ('Two of Wands', 'Wands', 'Planning, making decisions, leaving comfort zone', 'minor', 'common', 'Planning for the future and considering your options.'),
        ('Three of Wands', 'Wands', 'Expansion, foresight, overseas opportunities', 'minor', 'common', 'Looking ahead to future possibilities and expansion.'),
        ('King of Wands', 'Wands', 'Natural-born leader, vision, entrepreneur', 'minor', 'uncommon', 'Bold leadership and entrepreneurial spirit.'),
        ('Queen of Wands', 'Wands', 'Courageous, determined, joy', 'minor', 'uncommon', 'Confident self-expression and passionate determination.'),
        
        -- Swords
        ('Ace of Swords', 'Swords', 'New ideas, mental clarity, breakthrough', 'minor', 'common', 'Mental clarity and breakthrough moments.'),
        ('Two of Swords', 'Swords', 'Difficult decisions, weighing options', 'minor', 'common', 'Being at a crossroads and needing to make a choice.'),
        ('Three of Swords', 'Swords', 'Heartbreak, emotional pain, sorrow', 'minor', 'common', 'Emotional pain that leads to growth and understanding.'),
        ('King of Swords', 'Swords', 'Mental clarity, intellectual power, authority', 'minor', 'uncommon', 'Intellectual authority and clear communication.'),
        ('Queen of Swords', 'Swords', 'Independent, unbiased judgement, clear boundaries', 'minor', 'uncommon', 'Independent thinking and honest communication.'),
        
        -- Pentacles
        ('Ace of Pentacles', 'Pentacles', 'Manifestation, new financial opportunity', 'minor', 'common', 'New opportunities for material and financial growth.'),
        ('Two of Pentacles', 'Pentacles', 'Multiple priorities, time management, adaptability', 'minor', 'common', 'Juggling multiple responsibilities with grace.'),
        ('Three of Pentacles', 'Pentacles', 'Teamwork, collaboration, learning', 'minor', 'common', 'Working together to achieve common goals.'),
        ('King of Pentacles', 'Pentacles', 'Financial security, discipline, abundance', 'minor', 'uncommon', 'Material success through hard work and discipline.'),
        ('Queen of Pentacles', 'Pentacles', 'Practical, homely, down-to-earth', 'minor', 'uncommon', 'Nurturing abundance and practical wisdom.');
        
        RAISE NOTICE 'Inserted % sample tarot cards', (SELECT COUNT(*) FROM tarot_cards);
    ELSE
        RAISE NOTICE 'Tarot cards table already has % cards', card_count;
    END IF;
END $$;
