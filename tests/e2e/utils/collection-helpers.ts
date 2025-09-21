import { Page } from '@playwright/test';

/**
 * Collection management utilities for E2E tests
 */
export class CollectionHelpers {
  constructor(private page: Page) {}

  /**
   * Navigate to collection view
   */
  async goToCollection(): Promise<void> {
    const bottomNav = this.page.locator('nav').last();
    await bottomNav.getByRole('button', { name: 'Collection' }).click();
    await this.page.waitForTimeout(1000);
    console.log('Navigated to collection view');
  }

  /**
   * Open a card pack
   */
  async openPack(packType: string = 'Standard'): Promise<void> {
    const packButton = this.page.getByRole('button', { name: new RegExp(packType, 'i') });
    if (await packButton.isVisible()) {
      await packButton.click();
      await this.page.waitForTimeout(1000);
      console.log(`Opened ${packType} pack`);
    }
  }

  /**
   * Check collection stats
   */
  async getCollectionStats(): Promise<{ totalCards: number; statsDisplayed: boolean }> {
    const statsText = await this.page.locator('text=/\\d+\\s*cards?/i').textContent();
    const totalCards = statsText ? parseInt(statsText.match(/\d+/)?.[0] || '0') : 0;
    const statsDisplayed = await this.page.locator('text=/collection|stats|cards/i').count() > 0;
    
    console.log(`Collection stats - Total cards: ${totalCards}, Stats displayed: ${statsDisplayed}`);
    return { totalCards, statsDisplayed };
  }

  /**
   * View all cards in collection
   */
  async viewAllCards(): Promise<void> {
    const viewAllButton = this.page.getByRole('button', { name: /view all|see all|browse/i });
    if (await viewAllButton.isVisible()) {
      await viewAllButton.click();
      await this.page.waitForTimeout(1000);
      console.log('Viewing all cards in collection');
    }
  }
}