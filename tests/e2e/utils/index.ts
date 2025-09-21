// Export all utility classes for easy importing
export { AuthHelpers } from './auth-helpers';
export { NavigationHelpers } from './navigation-helpers';
export { ReadingHelpers } from './reading-helpers';
export { AssertionHelpers } from './assertion-helpers';
export { CollectionHelpers } from './collection-helpers';

// Import for internal use
import { AuthHelpers } from './auth-helpers';
import { NavigationHelpers } from './navigation-helpers';
import { ReadingHelpers } from './reading-helpers';

// Common test patterns and fixtures
export const COMMON_SELECTORS = {
  modal: '[role="dialog"], .modal, [data-testid*="modal"]',
  loading: '[data-testid="loading"], .loading, .spinner',
  error: '[data-testid="error"], .error, [role="alert"]',
  button: 'button, [role="button"]',
  form: 'form, [role="form"]',
  navigation: 'nav, [role="navigation"]',
  main: 'main, [role="main"]'
};

export const TEST_TIMEOUTS = {
  short: 1000,
  medium: 5000,
  long: 10000,
  auth: 15000
};

export const USER_ACTIONS = {
  click: { timeout: 2000 },
  type: { delay: 50 },
  navigation: { timeout: 5000, waitUntil: 'networkidle' as const }
};

/**
 * Setup helpers for test initialization
 */
export class TestSetup {
  static async authenticateUser(page: any): Promise<void> {
    const auth = new AuthHelpers(page);
    await auth.authenticate();
  }

  static async navigateToView(page: any, view: string): Promise<void> {
    const nav = new NavigationHelpers(page);
    await nav.navigateToView(view as any);
  }

  static async startReading(page: any, type: string = 'three-card'): Promise<void> {
    const reading = new ReadingHelpers(page);
    await reading.startNewReading(type as any);
  }
}