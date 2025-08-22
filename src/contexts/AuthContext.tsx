import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { supabase } from '../lib/supabase';
import type { User as SupabaseUser } from '@supabase/supabase-js';

interface User {
  id: string;
  email: string;
  name: string;
}

interface AuthContextType {
  user: User | null;
  signIn: (email: string, password: string) => Promise<void>;
  signUp: (email: string, password: string, name: string) => Promise<void>;
  signOut: () => Promise<void>;
  isLoading: boolean;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};

interface AuthProviderProps {
  children: ReactNode;
}

export const AuthProvider: React.FC<AuthProviderProps> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    console.log('AuthProvider useEffect: Starting auth initialization...');
    
    // Get initial session
    supabase.auth.getSession().then(({ data: { session }, error }) => {
      console.log('Initial session check:', { session: !!session, user: session?.user?.id, error });
      
      if (error) {
        console.error('Error getting initial session:', error);
        setIsLoading(false);
        return;
      }
      
      if (session?.user) {
        console.log('Initial session found, loading profile...');
        loadUserProfile(session.user);
      } else {
        console.log('No initial session found');
        setIsLoading(false);
      }
    });

    // Track if the component is mounted
    let isMounted = true;
    
    // Listen for auth changes
    const { data: { subscription } } = supabase.auth.onAuthStateChange(async (event, session) => {
      console.log('Auth state changed:', { event, session: !!session, user: session?.user?.id });
      
      if (!isMounted) {
        console.log('Component unmounted, skipping auth state change');
        return;
      }
      
      if (session?.user) {
        console.log('User session established, loading profile...');
        await loadUserProfile(session.user);
      } else {
        console.log('No user session, clearing user state');
        setUser(null);
        setIsLoading(false);
      }
    });

    return () => {
      console.log('AuthProvider cleanup: unsubscribing from auth changes');
      isMounted = false;
      subscription.unsubscribe();
    };
  }, []);

  const loadUserProfile = async (supabaseUser: SupabaseUser) => {
    let isCancelled = false;
    
    try {
      console.log('[Debug] Starting loadUserProfile:', {
        userId: supabaseUser.id,
        email: supabaseUser.email,
        timestamp: new Date().toISOString()
      });
      
      console.log('[Debug] Starting user_profiles query at', new Date().toISOString());

      const { data: profile, error } = await Promise.race([
        supabase
          .from('user_profiles')
          .select('*')
          .eq('id', supabaseUser.id)
          .single(),
        new Promise((_, reject) => 
          setTimeout(() => reject(new Error('Profile query timeout after 5 seconds')), 5000)
        ).then(() => ({ data: null, error: { code: 'TIMEOUT', message: 'Query timed out' } }))
      ]).catch(err => {
        console.error('[Debug] Query failed:', err.message);
        return { 
          data: null, 
          error: { 
            code: 'QUERY_ERROR',
            message: err instanceof Error ? err.message : 'Unknown error'
          }
        };
      });

      console.log('[Debug] Query completed at', new Date().toISOString(), 
        { hasProfile: !!profile, hasError: !!error });

      // Check if the operation was cancelled
      if (isCancelled) {
        console.log('Profile loading cancelled');
        return;
      }

      console.log('[Debug] Profile query completed at', new Date().toISOString());
      console.log('[Debug] Profile query result:', { 
        hasProfile: !!profile,
        hasError: !!error,
        errorCode: error?.code,
        errorMessage: error?.message,
        profileData: profile ? { id: profile.id, ...profile } : null
      });

      if (error && error.code === 'PGRST116') {
        // Profile doesn't exist, create one
        console.log('[Debug] PGRST116 received - Profile not found, attempting creation');
        
        console.log('[Debug] Starting profile creation at', new Date().toISOString());
        const { error: insertError } = await supabase
          .from('profiles')
          .insert({
            id: supabaseUser.id,
            name: supabaseUser.email?.split('@')[0] || 'User',
            email: supabaseUser.email || '',
          });

        if (insertError) {
          console.error('Error creating profile:', insertError);
          // Even if profile creation fails, we can still set the user with basic info
          setUser({
            id: supabaseUser.id,
            email: supabaseUser.email || '',
            name: supabaseUser.email?.split('@')[0] || 'User',
          });
        } else {
          console.log('Profile created successfully');
          setUser({
            id: supabaseUser.id,
            email: supabaseUser.email || '',
            name: supabaseUser.email?.split('@')[0] || 'User',
          });
        }
      } else if (error) {
        console.error('Error loading profile:', error);
        // Fallback: set user with basic auth info
        setUser({
          id: supabaseUser.id,
          email: supabaseUser.email || '',
          name: supabaseUser.email?.split('@')[0] || 'User',
        });
      } else if (profile) {
        console.log('Profile loaded successfully:', profile);
        setUser({
          id: profile.id,
          email: supabaseUser.email || '', // Email comes from auth, not profile
          name: profile.display_name,
        });
      } else {
        // No profile found, use basic info
        console.log('No profile found, using basic user info');
        setUser({
          id: supabaseUser.id,
          email: supabaseUser.email || '',
          name: supabaseUser.email?.split('@')[0] || 'User',
        });
      }
    } catch (error) {
      console.error('Error in loadUserProfile:', error);
      // Fallback: set user with basic auth info even if database fails
      setUser({
        id: supabaseUser.id,
        email: supabaseUser.email || '',
        name: supabaseUser.email?.split('@')[0] || 'User',
      });
    } finally {
      setIsLoading(false);
    }
  };

  const signUp = async (email: string, password: string, name: string) => {
    setIsLoading(true);
    try {
      console.log('Attempting to sign up user:', email);
      
      const { data, error } = await supabase.auth.signUp({
        email,
        password,
        options: {
          data: {
            display_name: name,
          },
        },
      });

      console.log('Sign up result:', { 
        user: data?.user?.id, 
        session: !!data?.session,
        error,
        emailConfirmationType: data?.user?.email_confirmed_at ? 'confirmed' : 'pending'
      });

      if (error) throw error;

      if (data.user) {
        // The trigger function handle_new_user() will automatically create the user_profiles entry
        console.log('User created, trigger will handle profile creation');
        
        // If there's no session, it means email confirmation is required
        if (!data.session) {
          console.log('No session returned - email confirmation required');
          setIsLoading(false);
          // Don't throw an error, let the UI handle the success message about email confirmation
          return;
        }
      }
      
      console.log('Sign up successful');
      
      // Important: Don't set loading to false here since onAuthStateChange will handle it
      // when the user session is established (only if session exists)
      if (!data.session) {
        setIsLoading(false);
      }
      
    } catch (error) {
      console.error('Error signing up:', error);
      setIsLoading(false);
      throw error;
    }
  };

  const signIn = async (email: string, password: string) => {
    setIsLoading(true);
    try {
      console.log('Attempting to sign in user:', email);
      
      const { data, error } = await supabase.auth.signInWithPassword({
        email,
        password,
      });

      console.log('Sign in result:', { data: data?.user?.id, error });

      if (error) throw error;
      
      // The onAuthStateChange listener will handle loading the profile
      console.log('Sign in successful, waiting for auth state change...');
      
    } catch (error) {
      console.error('Error signing in:', error);
      setIsLoading(false); // Make sure to set loading to false on error
      throw error;
    }
  };

  const signOut = async () => {
    setIsLoading(true);
    try {
      const { error } = await supabase.auth.signOut();
      if (error) throw error;
    } catch (error) {
      console.error('Error signing out:', error);
      throw error;
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <AuthContext.Provider value={{ user, signIn, signUp, signOut, isLoading }}>
      {children}
    </AuthContext.Provider>
  );
};