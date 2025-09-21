# Test Account Setup Guide

This guide explains how to set up secure test credentials for E2E testing.

## Quick Setup

1. **Copy the example file to create your local config:**
   ```bash
   cp .env.local.example .env.local
   ```

2. **Edit `.env.local` with your actual test account credentials:**
   ```bash
   # Example - replace with your actual test account details
   TEST_USER_EMAIL=your-test-email@example.com
   TEST_USER_PASSWORD=your-secure-test-password
   ```

3. **Create the test account:**
   ```bash
   node setup-test-account.js
   ```

4. **Run the E2E tests:**
   ```bash
   npm run test
   ```

## Security Notes

- ✅ `.env.local` is already in `.gitignore` - your credentials won't be committed
- ✅ The example file (`.env.local.example`) contains no real credentials
- ✅ All test files now reference environment variables instead of hardcoded values

## Manual Account Creation (Alternative)

If the script doesn't work due to database issues, you can create a test account manually:

1. Start the development server: `npm run dev`
2. Open the app in your browser
3. Click "Sign In" and then "Sign Up"
4. Create an account with the email/password you put in `.env.local`
5. Note any email confirmation requirements from Supabase

## Troubleshooting

### "Database error saving new user"
This indicates Supabase configuration issues. Try:
- Check your Supabase project settings
- Verify the database migrations have run
- Ensure auth is properly configured in Supabase dashboard

### "User already registered"
Good news! Your test account already exists. Just make sure the password in `.env.local` matches what you used to create it.

### Environment variables not loading
Make sure:
- File is named exactly `.env.local` (not `.env.local.txt`)
- File is in the project root directory
- No spaces around the `=` signs in the file

## Files Updated for Secure Credentials

The following files now use environment variables instead of hardcoded values:

- `tests/e2e/auth.spec.ts` - All test credentials from env vars
- `playwright.config.ts` - Loads `.env.local` then `.env` 
- `setup-test-account.js` - Account creation script using env vars
- `.env` - Contains default/example values with security notes
- `.env.local.example` - Template for your local credentials