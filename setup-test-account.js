#!/usr/bin/env node

/**
 * Script to create a test user account for E2E testing
 * Uses credentials from .env.local or .env files
 */

import dotenv from 'dotenv';
import { createClient } from '@supabase/supabase-js';
import path from 'path';
import { fileURLToPath } from 'url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));

// Load environment variables - .env.local takes precedence
dotenv.config({ path: path.resolve(__dirname, '.env.local') });
dotenv.config({ path: path.resolve(__dirname, '.env') });

const supabaseUrl = process.env.VITE_SUPABASE_URL;
const supabaseAnonKey = process.env.VITE_SUPABASE_ANON_KEY;
const testEmail = process.env.TEST_USER_EMAIL;
const testPassword = process.env.TEST_USER_PASSWORD;

if (!supabaseUrl || !supabaseAnonKey) {
  console.error('❌ Missing Supabase configuration. Please check your environment variables.');
  console.error('Required: VITE_SUPABASE_URL, VITE_SUPABASE_ANON_KEY');
  process.exit(1);
}

if (!testEmail || !testPassword) {
  console.error('❌ Missing test user credentials. Please check your environment variables.');
  console.error('Required: TEST_USER_EMAIL, TEST_USER_PASSWORD');
  console.error('💡 Create a .env.local file with your test account credentials.');
  process.exit(1);
}

const supabase = createClient(supabaseUrl, supabaseAnonKey);

async function createTestUser() {
  console.log('🔄 Creating test user account...');
  console.log(`Email: ${testEmail}`);
  console.log(`Password: ${'*'.repeat(testPassword.length)}`);
  
  try {
    // Try to sign up the test user
    const { data, error } = await supabase.auth.signUp({
      email: testEmail,
      password: testPassword,
    });

    if (error) {
      if (error.message.includes('User already registered')) {
        console.log('ℹ️ Test user already exists, checking login...');
        
        // Try to sign in instead
        const { data: signInData, error: signInError } = await supabase.auth.signInWithPassword({
          email: testEmail,
          password: testPassword,
        });
        
        if (signInError) {
          console.error('❌ Failed to sign in with existing test user:', signInError.message);
          return false;
        } else {
          console.log('✅ Test user login successful!');
          console.log('User ID:', signInData.user?.id);
          return true;
        }
      } else {
        console.error('❌ Failed to create test user:', error.message);
        return false;
      }
    } else {
      console.log('✅ Test user created successfully!');
      console.log('User ID:', data.user?.id);
      
      if (data.user && !data.user.email_confirmed_at) {
        console.log('📧 Note: Email confirmation may be required depending on Supabase settings.');
      }
      
      return true;
    }
  } catch (err) {
    console.error('❌ Unexpected error:', err);
    return false;
  }
}

async function main() {
  console.log('🧪 Test User Account Setup');
  console.log('==========================');
  
  const success = await createTestUser();
  
  if (success) {
    console.log('\n✅ Setup complete! You can now run E2E tests.');
    console.log('Run tests with: npm run test');
  } else {
    console.log('\n❌ Setup failed. Please check the error messages above.');
    process.exit(1);
  }
}

main().catch(console.error);