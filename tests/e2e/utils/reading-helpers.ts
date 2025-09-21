import { Page, expect } from '@playwright/test';

/**
 * Reading workflow utilities for E2E tests
 */
export class ReadingHelpers {
  constructor(private page: Page) {}

  /**
   * Start a new reading from any view
   */
  async startNewReading(spreadType: 'single' | 'three-card' | 'celtic-cross' = 'three-card'): Promise<void> {
    // Try from current view first
    const newReadingButton = this.page.getByText('New Reading').first();
    if (await newReadingButton.isVisible()) {
      await newReadingButton.click();
    } else {
      // Navigate to readings view
      const bottomNav = this.page.locator('nav').last();
      await bottomNav.getByRole('button', { name: 'Readings' }).click();
      await this.page.waitForTimeout(1000);
      
      const readingsNewButton = this.page.getByRole('button', { name: 'New Reading' });
      await readingsNewButton.click();
    }
    
    await this.page.waitForTimeout(1000);
    
    // Select spread type if options are available
    const spreadButton = this.page.getByText(spreadType, { exact: false });
    if (await spreadButton.isVisible()) {
      await spreadButton.click();
      await this.page.waitForTimeout(500);
    }
    
    console.log(`Started new ${spreadType} reading`);
  }

  /**
   * Draw cards for a reading
   */
  async drawCards(numberOfCards: number = 3): Promise<void> {
    for (let i = 0; i < numberOfCards; i++) {
      // Look for draw button or card slot
      const drawButton = this.page.getByRole('button', { name: /draw|select|choose/i }).first();
      if (await drawButton.isVisible()) {
        await drawButton.click();
        await this.page.waitForTimeout(500);
      }
    }
    console.log(`Drew ${numberOfCards} cards`);
  }

  /**
   * Complete a reading
   */
  async completeReading(): Promise<void> {
    // Look for completion buttons with more specific selectors
    const completeButtons = [
      'button:has-text("Complete Reading")',
      'button:has-text("Finish Reading")', 
      'button:has-text("Done")',
      'button:has-text("Save Reading")',
      'button:has-text("Close Reading")'
    ];

    for (const selector of completeButtons) {
      const button = this.page.locator(selector);
      if (await button.isVisible({ timeout: 1000 })) {
        await button.click();
        await this.page.waitForTimeout(1000);
        console.log('Reading completed');
        return;
      }
    }
    
    // Try more generic close/complete buttons as fallback
    const genericButtons = this.page.getByRole('button', { name: /complete|finish|done|close reading/i });
    const buttonCount = await genericButtons.count();
    
    if (buttonCount > 0) {
      // Click the first matching button
      await genericButtons.first().click();
      await this.page.waitForTimeout(1000);
      console.log('Reading completed via generic button');
      return;
    }
    
    console.log('No completion button found, reading may auto-complete');
  }

  /**
   * Delete a reading
   */
  async deleteReading(readingIdentifier?: string): Promise<void> {
    // Look for delete button or menu
    const deleteButton = this.page.getByRole('button', { name: /delete|remove/i }).first();
    if (await deleteButton.isVisible()) {
      await deleteButton.click();
      
      // Confirm deletion if confirmation dialog appears
      const confirmButton = this.page.getByRole('button', { name: /confirm|yes|delete/i });
      if (await confirmButton.isVisible({ timeout: 2000 })) {
        await confirmButton.click();
      }
      
      await this.page.waitForTimeout(1000);
      console.log('Reading deleted');
    }
  }

  /**
   * Check if reading modal is open
   */
  async isReadingModalOpen(): Promise<boolean> {
    const modal = this.page.locator('[role="dialog"], .modal, [data-testid*="modal"]');
    return await modal.isVisible();
  }

  /**
   * Close reading modal
   */
  async closeReadingModal(): Promise<void> {
    const closeButton = this.page.getByRole('button', { name: /close|×/i }).first();
    if (await closeButton.isVisible()) {
      await closeButton.click();
      await this.page.waitForTimeout(500);
    }
  }
}