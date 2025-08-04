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
      profiles: {
        Row: {
          id: string;
          name: string;
          email: string;
          created_at: string;
          updated_at: string;
        };
        Insert: {
          id: string;
          name: string;
          email: string;
          created_at?: string;
          updated_at?: string;
        };
        Update: {
          id?: string;
          name?: string;
          email?: string;
          created_at?: string;
          updated_at?: string;
        };
      };
      cards: {
        Row: {
          id: string;
          name: string;
          suit: string;
          meaning: string;
          card_type: string;
          created_at: string;
        };
        Insert: {
          id?: string;
          name: string;
          suit: string;
          meaning: string;
          card_type?: string;
          created_at?: string;
        };
        Update: {
          id?: string;
          name?: string;
          suit?: string;
          meaning?: string;
          card_type?: string;
          created_at?: string;
        };
      };
      user_cards: {
        Row: {
          id: string;
          user_id: string;
          card_id: string;
          rarity: string;
          obtained_at: string;
        };
        Insert: {
          id?: string;
          user_id: string;
          card_id: string;
          rarity?: string;
          obtained_at?: string;
        };
        Update: {
          id?: string;
          user_id?: string;
          card_id?: string;
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
          created_at: string;
          updated_at: string;
        };
        Insert: {
          id?: string;
          user_id: string;
          title: string;
          type: string;
          status?: string;
          interpretation?: string | null;
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
          created_at?: string;
          updated_at?: string;
        };
      };
      reading_cards: {
        Row: {
          id: string;
          reading_id: string;
          card_id: string;
          position: string;
          reversed: boolean;
          drawn_at: string;
        };
        Insert: {
          id?: string;
          reading_id: string;
          card_id: string;
          position: string;
          reversed?: boolean;
          drawn_at?: string;
        };
        Update: {
          id?: string;
          reading_id?: string;
          card_id?: string;
          position?: string;
          reversed?: boolean;
          drawn_at?: string;
        };
      };
    };
  };
}