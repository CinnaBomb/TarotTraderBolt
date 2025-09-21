# TarotTraderBolt Coding Guidelines

This guide provides essential context for AI agents working in the TarotTraderBolt codebase.

## Project Architecture

- **Frontend Stack**: React 18 + TypeScript + Vite + TailwindCSS
- **Backend**: Supabase (PostgreSQL + Auth)
- **Testing**: Playwright for E2E tests

### Key Components & Data Flow

1. **Authentication Flow**
   - `AuthContext.tsx` manages user session state
   - User data stored in `profiles` table
   - All data access requires authenticated user

2. **Core Features**
   - Reading creation/management (`ReadingContext.tsx`)
   - Card collection system (`user_cards` table)
   - Multiple spread types (single, three-card, celtic-cross)

3. **Data Model**
   ```sql
   profiles <- user_cards -> cards
   profiles <- readings <- reading_cards -> cards
   ```

## Development Workflows

1. **Local Development**
   ```bash
   npm install
   npm run dev
   ```

2. **Testing**
   ```bash
   npm run test        # Run all tests
   npm run test:ui     # Open Playwright UI
   npm run test:debug  # Debug specific tests
   ```

3. **Database Updates**
   - All schema changes go in `/supabase/migrations`
   - Follow existing migration naming pattern

## Project Conventions

1. **Component Organization**
   - Shared components in `/src/components`
   - Route-specific views in `/components/views`
   - Global state in `/src/contexts`

2. **Testing Patterns**
   - Page objects in E2E tests
   - Common setup in `beforeEach` hooks
   - Data-testid for test selectors
   - Explicit timeouts for async operations

3. **State Management**
   - Context API for global state
   - Props for component-local state
   - Supabase real-time subscriptions for updates

## Common Tasks

1. **Adding a New Spread Type**
   - Update spread types in `ReadingContext.tsx`
   - Create spread layout component
   - Add to spread selection menu
   - Update database schema if needed

2. **Working with Cards**
   - Card data stored in `cards` table
   - User collections in `user_cards`
   - Readings link cards via `reading_cards`

## Key Files

- `/src/contexts/ReadingContext.tsx` - Core reading logic
- `/src/components/ReadingModal.tsx` - Reading UI
- `/tests/e2e/readings.spec.ts` - Reading test patterns
- `/supabase/migrations/*` - Database schema

## Gotchas & Tips

1. Always wait for `networkidle` in tests due to real-time updates
2. Check auth state before accessing user data
3. Use data-testid for stable test selectors
4. Handle both new and existing readings in views