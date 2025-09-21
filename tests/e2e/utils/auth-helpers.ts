import { expect, Page } from '@playwright/test';

/**
 * Authentication utilities for E2E tests
 */
export class AuthHelpers {
  constructor(private page: Page) {}

  /**
   * Authenticate user with credentials from environment variables
   */
  async authenticate(): Promise<void> {
    await this.page.goto('/');
    
    // Check if already authenticated
    const userButton = this.page.getByTestId('header-auth-button');
    try {
      await expect(userButton).toBeVisible({ timeout: 2000 });
      console.log('Already authenticated');
      return;
    } catch {
      // Need to authenticate
    }

    // Get credentials from environment
    const email = process.env.TEST_USER_EMAIL;
    const password = process.env.TEST_USER_PASSWORD;
    
    if (!email || !password) {
      throw new Error('TEST_USER_EMAIL and TEST_USER_PASSWORD must be set in .env.local');
    }

    // Fill login form (appears directly when not authenticated)
    await this.page.getByPlaceholder('Email').fill(email);
    await this.page.getByPlaceholder('Password').fill(password);
    await this.page.getByRole('button', { name: 'Sign In' }).click();
    
    // Wait for successful authentication
    await expect(userButton).toBeVisible();
    console.log('Authentication successful');
  }

  /**
   * Check if user is currently authenticated
   */
  async isAuthenticated(): Promise<boolean> {
    const userButton = this.page.getByTestId('header-auth-button');
    try {
      await expect(userButton).toBeVisible({ timeout: 1000 });
      
      // Check if we see a user initial (authenticated) or User icon (not authenticated)
      const userInitial = userButton.locator('span');
      const userIcon = userButton.locator('svg');
      
      // If there's a span with text (user initial), user is authenticated
      try {
        await expect(userInitial).toBeVisible({ timeout: 500 });
        return true;
      } catch {
        // If there's an SVG icon, user is not authenticated
        try {
          await expect(userIcon).toBeVisible({ timeout: 500 });
          return false;
        } catch {
          // Default to false if we can't determine
          return false;
        }
      }
    } catch {
      return false;
    }
  }

  /**
   * Logout current user
   */
  async logout(): Promise<void> {
    const userButton = this.page.getByTestId('header-auth-button');
    await userButton.click();
    
    // Look for logout button or option - try multiple patterns
    const logoutSelectors = [
      'button:has-text("Logout")',
      'button:has-text("Sign Out")', 
      'button:has-text("Log Out")',
      '[role="menuitem"]:has-text("Logout")',
      '[role="menuitem"]:has-text("Sign Out")'
    ];
    
    let loggedOut = false;
    for (const selector of logoutSelectors) {
      const logoutButton = this.page.locator(selector);
      if (await logoutButton.isVisible({ timeout: 1000 })) {
        await logoutButton.click();
        loggedOut = true;
        break;
      }
    }
    
    if (!loggedOut) {
      console.log('No explicit logout button found, checking if already logged out');
    }
    
    // Wait a moment for logout to process
    await this.page.waitForTimeout(1000);
    
    // Check if login form appeared (indicates successful logout)
    try {
      await this.page.waitForSelector('input[placeholder*="Email" i], [data-testid="email-input"]', { timeout: 3000 });
      console.log('Logout successful - login form visible');
    } catch {
      console.log('Login form not visible after logout attempt');
    }
  }
}