# TarotTrader 🌟

A modern, interactive Tarot reading application built with React and Supabase. Experience digital Tarot readings with a beautiful interface, cloud synchronization, and comprehensive user account management.

## Features ✨

- **Complete Authentication System**
  - Secure sign up and login
  - User profile management with dropdown menu
  - Logout functionality with session cleanup
  - Persistent authentication state

- **Multiple Spread Types**
  - Three Card Spread (Past, Present, Future)
  - Celtic Cross
  - More spreads coming soon!

- **Interactive Reading Experience**
  - Draw cards one at a time
  - Cards can appear upright or reversed
  - Beautiful card animations and transitions
  - Immersive user interface with custom background

- **User Account System**
  - Secure authentication with Supabase
  - Save readings to your profile
  - View reading history
  - Track completed and in-progress readings
  - User profile dropdown with settings and logout

## Technology Stack 🛠️

- **Frontend**
  - React 18
  - TypeScript
  - Tailwind CSS for styling
  - Vite for build tooling

- **Backend & Database**
  - Supabase for backend services
  - PostgreSQL database
  - Real-time updates
  - Secure user authentication

- **Testing**
  - Playwright for E2E testing
  - Comprehensive test coverage (28 tests)
  - Helper utility classes for maintainable tests
  - Automated authentication and reading flow tests

- **Design & UI**
  - Custom Tarot card designs
  - Responsive layout
  - Dark theme with purple accents
  - Lucide icons
  - User-friendly dropdown menus

## Getting Started 🚀

1. **Clone the Repository**
   ```bash
   git clone https://github.com/CinnaBomb/TarotTraderBolt.git
   cd TarotTraderBolt
   ```

2. **Install Dependencies**
   ```bash
   npm install
   ```

3. **Set Up Environment Variables**
   Create a `.env` file with your Supabase credentials:
   ```env
   VITE_SUPABASE_URL=your_supabase_url
   VITE_SUPABASE_ANON_KEY=your_supabase_anon_key
   ```

4. **Run the Development Server**
   ```bash
   npm run dev
   ```

5. **Set Up Testing (Optional)**
   Create a `.env.local` file for E2E testing:
   ```env
   TEST_USER_EMAIL=testuser@example.com
   TEST_USER_PASSWORD=testpassword123
   ```

## Testing 🧪

The project includes comprehensive E2E testing with Playwright:

- **Run All Tests**
  ```bash
  npm run test
  ```

- **Run Tests with UI**
  ```bash
  npm run test:ui
  ```

- **Run Specific Test Suite**
  ```bash
  npm run test tests/e2e/auth-refactored.spec.ts
  ```

**Test Coverage:**
- Authentication (login, logout, error handling)
- Reading creation and management
- Card collection system
- Navigation and user flows
- Profile management

All tests use helper utilities for maintainability and include detailed logging for debugging.

## How to Use 📖

1. **Create an Account**
   - Sign up with email and password
   - Log in to access your personal readings

2. **User Profile Management**
   - Click your profile button (shows your initial when logged in)
   - Access dropdown menu for settings and logout
   - Manage your account preferences

3. **Start a Reading**
   - Click "New Reading" from the home screen
   - Choose your preferred spread type
   - Follow the intuitive card drawing process

4. **Drawing Cards**
   - Click on each position to draw a card
   - Cards may appear upright or reversed
   - Each card comes with its traditional meaning

5. **View Your Readings**
   - Access your reading history
   - Continue incomplete readings
   - Review past interpretations

6. **Sign Out**
   - Click your profile button in the header
   - Select "Sign Out" from the dropdown menu
   - Session is securely cleared

Supported spread types:
- single_card
- three_card
- celtic_cross
- horseshoe
- custom

## Future Enhancements 🔮

- Additional spread types
- Social sharing features
- AI-powered interpretations
- Card collection system
- Community readings
- Custom spread creator
- Advanced user profile settings
- Reading export functionality
- Mobile app version

## Recent Updates 🆕

- ✅ Complete logout functionality with user dropdown menu
- ✅ Comprehensive E2E testing infrastructure
- ✅ Helper utility classes for maintainable tests
- ✅ Improved authentication flow with better UX
- ✅ 28 automated tests covering all major features

---

Built with ❤️ by CinnaBomb