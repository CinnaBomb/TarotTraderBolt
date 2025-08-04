/*
  # Tarot Trading App Database Schema

  1. New Tables
    - `profiles`
      - `id` (uuid, references auth.users)
      - `name` (text)
      - `email` (text)
      - `created_at` (timestamp)
      - `updated_at` (timestamp)
    
    - `cards`
      - `id` (uuid, primary key)
      - `name` (text)
      - `suit` (text)
      - `meaning` (text)
      - `card_type` (text) - major/minor arcana
      - `created_at` (timestamp)
    
    - `user_cards`
      - `id` (uuid, primary key)
      - `user_id` (uuid, references profiles)
      - `card_id` (uuid, references cards)
      - `rarity` (text)
      - `obtained_at` (timestamp)
    
    - `readings`
      - `id` (uuid, primary key)
      - `user_id` (uuid, references profiles)
      - `title` (text)
      - `type` (text)
      - `status` (text) - in-progress/completed
      - `interpretation` (text, nullable)
      - `created_at` (timestamp)
      - `updated_at` (timestamp)
    
    - `reading_cards`
      - `id` (uuid, primary key)
      - `reading_id` (uuid, references readings)
      - `card_id` (uuid, references cards)
      - `position` (text) - past/present/future
      - `reversed` (boolean)
      - `drawn_at` (timestamp)

  2. Security
    - Enable RLS on all tables
    - Add policies for authenticated users to manage their own data
    - Profiles are publicly readable but only updatable by owner
*/

-- Create profiles table
CREATE TABLE IF NOT EXISTS profiles (
  id uuid PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  name text NOT NULL,
  email text NOT NULL,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

-- Create cards table (master card data)
CREATE TABLE IF NOT EXISTS cards (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  name text NOT NULL,
  suit text NOT NULL,
  meaning text NOT NULL,
  card_type text NOT NULL DEFAULT 'minor',
  created_at timestamptz DEFAULT now()
);

-- Create user_cards table (user's card collection)
CREATE TABLE IF NOT EXISTS user_cards (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid NOT NULL REFERENCES profiles(id) ON DELETE CASCADE,
  card_id uuid NOT NULL REFERENCES cards(id) ON DELETE CASCADE,
  rarity text NOT NULL DEFAULT 'common',
  obtained_at timestamptz DEFAULT now(),
  UNIQUE(user_id, card_id)
);

-- Create readings table
CREATE TABLE IF NOT EXISTS readings (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid NOT NULL REFERENCES profiles(id) ON DELETE CASCADE,
  title text NOT NULL,
  type text NOT NULL,
  status text NOT NULL DEFAULT 'in-progress',
  interpretation text,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

-- Create reading_cards table (cards drawn in readings)
CREATE TABLE IF NOT EXISTS reading_cards (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  reading_id uuid NOT NULL REFERENCES readings(id) ON DELETE CASCADE,
  card_id uuid NOT NULL REFERENCES cards(id) ON DELETE CASCADE,
  position text NOT NULL,
  reversed boolean DEFAULT false,
  drawn_at timestamptz DEFAULT now()
);

-- Enable RLS
ALTER TABLE profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE cards ENABLE ROW LEVEL SECURITY;
ALTER TABLE user_cards ENABLE ROW LEVEL SECURITY;
ALTER TABLE readings ENABLE ROW LEVEL SECURITY;
ALTER TABLE reading_cards ENABLE ROW LEVEL SECURITY;

-- Profiles policies
CREATE POLICY "Profiles are publicly readable"
  ON profiles
  FOR SELECT
  TO authenticated
  USING (true);

CREATE POLICY "Users can update own profile"
  ON profiles
  FOR UPDATE
  TO authenticated
  USING (auth.uid() = id);

CREATE POLICY "Users can insert own profile"
  ON profiles
  FOR INSERT
  TO authenticated
  WITH CHECK (auth.uid() = id);

-- Cards policies (master data - readable by all)
CREATE POLICY "Cards are readable by authenticated users"
  ON cards
  FOR SELECT
  TO authenticated
  USING (true);

-- User cards policies
CREATE POLICY "Users can view own cards"
  ON user_cards
  FOR SELECT
  TO authenticated
  USING (auth.uid() = user_id);

CREATE POLICY "Users can insert own cards"
  ON user_cards
  FOR INSERT
  TO authenticated
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update own cards"
  ON user_cards
  FOR UPDATE
  TO authenticated
  USING (auth.uid() = user_id);

-- Readings policies
CREATE POLICY "Users can view own readings"
  ON readings
  FOR SELECT
  TO authenticated
  USING (auth.uid() = user_id);

CREATE POLICY "Users can insert own readings"
  ON readings
  FOR INSERT
  TO authenticated
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update own readings"
  ON readings
  FOR UPDATE
  TO authenticated
  USING (auth.uid() = user_id);

-- Reading cards policies
CREATE POLICY "Users can view own reading cards"
  ON reading_cards
  FOR SELECT
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM readings 
      WHERE readings.id = reading_cards.reading_id 
      AND readings.user_id = auth.uid()
    )
  );

CREATE POLICY "Users can insert own reading cards"
  ON reading_cards
  FOR INSERT
  TO authenticated
  WITH CHECK (
    EXISTS (
      SELECT 1 FROM readings 
      WHERE readings.id = reading_cards.reading_id 
      AND readings.user_id = auth.uid()
    )
  );

-- Insert sample tarot cards
INSERT INTO cards (name, suit, meaning, card_type) VALUES
  ('The Fool', 'Major Arcana', 'New beginnings, innocence, spontaneity', 'major'),
  ('The Magician', 'Major Arcana', 'Manifestation, resourcefulness, power', 'major'),
  ('The High Priestess', 'Major Arcana', 'Intuition, sacred knowledge, divine feminine', 'major'),
  ('The Empress', 'Major Arcana', 'Femininity, beauty, nature, abundance', 'major'),
  ('The Emperor', 'Major Arcana', 'Authority, establishment, structure, father figure', 'major'),
  ('The Hierophant', 'Major Arcana', 'Spiritual wisdom, religious beliefs, conformity', 'major'),
  ('The Lovers', 'Major Arcana', 'Love, harmony, relationships, values alignment', 'major'),
  ('The Chariot', 'Major Arcana', 'Control, willpower, success, determination', 'major'),
  ('Strength', 'Major Arcana', 'Strength, courage, persuasion, influence', 'major'),
  ('The Hermit', 'Major Arcana', 'Soul searching, introspection, inner guidance', 'major'),
  ('Wheel of Fortune', 'Major Arcana', 'Good luck, karma, life cycles, destiny', 'major'),
  ('Justice', 'Major Arcana', 'Justice, fairness, truth, cause and effect', 'major'),
  ('The Hanged Man', 'Major Arcana', 'Suspension, restriction, letting go', 'major'),
  ('Death', 'Major Arcana', 'Endings, beginnings, change, transformation', 'major'),
  ('Temperance', 'Major Arcana', 'Balance, moderation, patience, purpose', 'major'),
  ('The Devil', 'Major Arcana', 'Bondage, addiction, sexuality, materialism', 'major'),
  ('The Tower', 'Major Arcana', 'Sudden change, upheaval, chaos, revelation', 'major'),
  ('The Star', 'Major Arcana', 'Hope, faith, purpose, renewal, spirituality', 'major'),
  ('The Moon', 'Major Arcana', 'Illusion, fear, anxiety, subconscious, intuition', 'major'),
  ('The Sun', 'Major Arcana', 'Positivity, fun, warmth, success, vitality', 'major'),
  ('Judgement', 'Major Arcana', 'Judgement, rebirth, inner calling, absolution', 'major'),
  ('The World', 'Major Arcana', 'Completion, accomplishment, travel, fulfillment', 'major'),
  ('Ace of Cups', 'Cups', 'Love, new relationships, compassion, creativity', 'minor'),
  ('Two of Cups', 'Cups', 'Unified love, partnership, mutual attraction', 'minor'),
  ('Three of Cups', 'Cups', 'Celebration, friendship, creativity, community', 'minor'),
  ('Four of Cups', 'Cups', 'Meditation, contemplation, apathy, reevaluation', 'minor'),
  ('Five of Cups', 'Cups', 'Regret, failure, disappointment, pessimism', 'minor'),
  ('King of Cups', 'Cups', 'Emotional balance, compassion, diplomacy', 'minor'),
  ('Queen of Cups', 'Cups', 'Compassion, calm, comfort, intuition', 'minor'),
  ('Knight of Cups', 'Cups', 'Creativity, romance, charm, imagination', 'minor'),
  ('Page of Cups', 'Cups', 'Creative opportunities, intuitive messages', 'minor'),
  ('Ace of Wands', 'Wands', 'Inspiration, creative spark, new initiative', 'minor'),
  ('Two of Wands', 'Wands', 'Future planning, making decisions, leaving comfort zone', 'minor'),
  ('Three of Wands', 'Wands', 'Expansion, foresight, overseas opportunities', 'minor'),
  ('King of Wands', 'Wands', 'Natural leader, vision, entrepreneur', 'minor'),
  ('Queen of Wands', 'Wands', 'Courage, confidence, independence, social butterfly', 'minor'),
  ('Knight of Wands', 'Wands', 'Energy, passion, adventure, impulsiveness', 'minor'),
  ('Page of Wands', 'Wands', 'Inspiration, ideas, discovery, limitless potential', 'minor'),
  ('Ace of Swords', 'Swords', 'Breakthrough, clarity, sharp mind', 'minor'),
  ('Two of Swords', 'Swords', 'Difficult decisions, weighing options, indecision', 'minor'),
  ('Three of Swords', 'Swords', 'Heartbreak, emotional pain, sorrow, grief', 'minor'),
  ('King of Swords', 'Swords', 'Mental clarity, intellectual power, authority', 'minor'),
  ('Queen of Swords', 'Swords', 'Independent, unbiased judgement, clear boundaries', 'minor'),
  ('Knight of Swords', 'Swords', 'Ambitious, action-oriented, driven to succeed', 'minor'),
  ('Page of Swords', 'Swords', 'New ideas, curiosity, thirst for knowledge', 'minor'),
  ('Ace of Pentacles', 'Pentacles', 'Manifestation, new financial opportunity', 'minor'),
  ('Two of Pentacles', 'Pentacles', 'Multiple priorities, time management, adaptability', 'minor'),
  ('Three of Pentacles', 'Pentacles', 'Collaboration, learning, implementation', 'minor'),
  ('King of Pentacles', 'Pentacles', 'Financial security, discipline, abundance', 'minor'),
  ('Queen of Pentacles', 'Pentacles', 'Nurturing, practical, providing financially', 'minor'),
  ('Knight of Pentacles', 'Pentacles', 'Hard work, productivity, routine, conservatism', 'minor'),
  ('Page of Pentacles', 'Pentacles', 'Learning, studying, new financial opportunity', 'minor')
ON CONFLICT (name, suit) DO NOTHING;