import { createClient } from '@supabase/supabase-js';

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY;

if (!supabaseUrl || !supabaseAnonKey) {
  throw new Error('Missing Supabase environment variables');
}

export const supabase = createClient(supabaseUrl, supabaseAnonKey);

// Database types
export interface Database {
  public: {
    Tables: {
      user_profiles: {
        Row: {
          id: string;
          username: string;
          display_name: string;
          avatar_url: string | null;
          bio: string;
          level: number;
          experience_points: number;
          total_cards: number;
          total_trades: number;
          created_at: string;
          updated_at: string;
        };
        Insert: {
          id: string;
          username: string;
          display_name: string;
          avatar_url?: string | null;
          bio?: string;
          level?: number;
          experience_points?: number;
          total_cards?: number;
          total_trades?: number;
          created_at?: string;
          updated_at?: string;
        };
        Update: {
          id?: string;
          username?: string;
          display_name?: string;
          avatar_url?: string | null;
          bio?: string;
          level?: number;
          experience_points?: number;
          total_cards?: number;
          total_trades?: number;
          created_at?: string;
          updated_at?: string;
        };
      };
      tarot_cards: {
        Row: {
          id: string;
          name: string;
          suit: string;
          meaning: string;
          card_type: string;
          rarity: string;
          image_url: string | null;
          description: string;
          created_at: string;
        };
        Insert: {
          id?: string;
          name: string;
          suit: string;
          meaning: string;
          card_type?: string;
          rarity?: string;
          image_url?: string | null;
          description?: string;
          created_at?: string;
        };
        Update: {
          id?: string;
          name?: string;
          suit?: string;
          meaning?: string;
          card_type?: string;
          rarity?: string;
          image_url?: string | null;
          description?: string;
          created_at?: string;
        };
      };
      user_cards: {
        Row: {
          id: string;
          user_id: string;
          card_id: string;
          quantity: number;
          rarity: string;
          obtained_at: string;
        };
        Insert: {
          id?: string;
          user_id: string;
          card_id: string;
          quantity?: number;
          rarity?: string;
          obtained_at?: string;
        };
        Update: {
          id?: string;
          user_id?: string;
          card_id?: string;
          quantity?: number;
          rarity?: string;
          obtained_at?: string;
        };
      };
      readings: {
        Row: {
          id: string;
          user_id: string;
          title: string;
          type: string;
          status: string;
          interpretation: string | null;
          card_positions: any;
          created_at: string;
          updated_at: string;
        };
        Insert: {
          id?: string;
          user_id: string;
          title: string;
          type?: string;
          status?: string;
          interpretation?: string | null;
          card_positions?: any;
          created_at?: string;
          updated_at?: string;
        };
        Update: {
          id?: string;
          user_id?: string;
          title?: string;
          type?: string;
          status?: string;
          interpretation?: string | null;
          card_positions?: any;
          created_at?: string;
          updated_at?: string;
        };
      };
    };
  };
}