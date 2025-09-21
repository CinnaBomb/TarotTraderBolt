import { Page } from '@playwright/test';

/**
 * Navigation utilities for E2E tests
 */
export class NavigationHelpers {
  constructor(private page: Page) {}

  /**
   * Navigate using bottom navigation
   */
  async navigateToView(viewName: 'Home' | 'Readings' | 'Collection' | 'Trade' | 'Profile'): Promise<void> {
    const bottomNav = this.page.locator('nav').last();
    const navButton = bottomNav.getByRole('button', { name: viewName });
    await navButton.click();
    await this.page.waitForTimeout(1000);
    console.log(`Navigated to ${viewName} view`);
  }

  /**
   * Navigate to a specific view and wait for it to load
   */
  async navigateAndWait(viewName: 'Home' | 'Readings' | 'Collection' | 'Trade' | 'Profile', waitForSelector?: string): Promise<void> {
    await this.navigateToView(viewName);
    
    if (waitForSelector) {
      await this.page.waitForSelector(waitForSelector);
    } else {
      // Default wait for page load
      await this.page.waitForLoadState('networkidle');
    }
  }

  /**
   * Click on action card from home view
   */
  async clickActionCard(cardName: 'New Reading' | 'Create Card' | 'View Collection'): Promise<void> {
    const actionCard = this.page.getByText(cardName).first();
    await actionCard.click();
    await this.page.waitForTimeout(1000);
    console.log(`Clicked ${cardName} action card`);
  }

  /**
   * Navigate back to home
   */
  async goHome(): Promise<void> {
    await this.navigateToView('Home');
  }

  /**
   * Check if current view is active
   */
  async isOnView(viewName: string): Promise<boolean> {
    const url = this.page.url();
    return url.includes(viewName.toLowerCase()) || url === 'http://localhost:5173/';
  }
}