import { test, expect } from '@playwright/test';
import { 
  AuthHelpers, 
  NavigationHelpers, 
  CollectionHelpers, 
  AssertionHelpers, 
  TestSetup 
} from './utils';

test.describe('Collection Management (Refactored)', () => {
  test.beforeEach(async ({ page }) => {
    await TestSetup.authenticateUser(page);
  });

  test('should navigate to collection view', async ({ page }) => {
    const collection = new CollectionHelpers(page);
    const assertions = new AssertionHelpers(page);
    
    // Navigate to collection using helper
    await collection.goToCollection();
    
    // Verify we're on collection view
    const collectionContent = await assertions.countTextReferences([
      'collection', 'cards', 'my collection'
    ]);
    
    const collectionUI = await assertions.countElements({
      'Collection headers': 'h1, h2, h3, [role="heading"]',
      'Navigation elements': 'nav button',
      'Interactive elements': 'button, [role="button"]'
    });
    
    const results = { ...collectionContent, ...collectionUI };
    assertions.logResults('Collection Navigation', results);
    
    // Verify collection view loaded
    expect(collectionContent.collection).toBeGreaterThan(0);
    expect(collectionUI['Navigation elements']).toBeGreaterThan(3);
  });

  test('should display collection stats', async ({ page }) => {
    const collection = new CollectionHelpers(page);
    const assertions = new AssertionHelpers(page);
    
    // Navigate to collection
    await collection.goToCollection();
    
    // Get collection stats using helper
    const stats = await collection.getCollectionStats();
    
    // Check for additional stat elements
    const statElements = await assertions.countTextReferences([
      'cards', 'collection', 'total', 'owned', 'stats'
    ]);
    
    const numericalStats = await assertions.countElements({
      'Numbers': 'text=/\\d+/',
      'Stat containers': '[class*="stat"], .stats, [data-testid*="stat"]'
    });
    
    const results = { 
      'Total Cards (from helper)': stats.totalCards,
      'Stats Displayed': stats.statsDisplayed,
      ...statElements, 
      ...numericalStats 
    };
    
    assertions.logResults('Collection Stats', results);
    
    // Verify stats are displayed
    expect(stats.statsDisplayed).toBe(true);
    expect(statElements.cards).toBeGreaterThan(0);
  });

  test('should show pack opening functionality', async ({ page }) => {
    const collection = new CollectionHelpers(page);
    const assertions = new AssertionHelpers(page);
    
    // Navigate to collection
    await collection.goToCollection();
    
    // Look for pack-related elements
    const packElements = await assertions.countTextReferences([
      'pack', 'open', 'buy', 'purchase', 'booster'
    ]);
    
    const packUI = await assertions.countElements({
      'Pack buttons': 'button:has-text("Pack"), button:has-text("Open"), button:has-text("Buy")',
      'Pack containers': '[class*="pack"], .pack, [data-testid*="pack"]',
      'Purchase elements': 'button:has-text("Purchase"), button:has-text("Buy")'
    });
    
    // Try to open a pack if available
    if (packUI['Pack buttons'] > 0) {
      await collection.openPack();
      await page.waitForTimeout(1000);
      console.log('Pack opening functionality tested');
    }
    
    const results = { ...packElements, ...packUI };
    assertions.logResults('Pack Functionality', results);
    
    // Verify pack-related functionality exists
    const totalPackElements = Object.values(packElements).reduce((sum, count) => sum + count, 0);
    expect(totalPackElements).toBeGreaterThan(0);
  });

  test('should handle empty collection state', async ({ page }) => {
    const collection = new CollectionHelpers(page);
    const assertions = new AssertionHelpers(page);
    
    // Navigate to collection
    await collection.goToCollection();
    
    // Check collection stats
    const stats = await collection.getCollectionStats();
    
    // Look for empty state or populated state indicators
    const stateElements = await assertions.countTextReferences([
      'empty', 'no cards', 'get started', 'first pack', 'welcome'
    ]);
    
    const emptyStateUI = await assertions.countElements({
      'Empty messages': '[class*="empty"], .no-cards, [data-testid*="empty"]',
      'Getting started elements': 'button:has-text("Get Started"), button:has-text("Start")',
      'Card elements': '.card, [data-testid*="card"], [class*="card"]'
    });
    
    const results = {
      'Total Cards': stats.totalCards,
      'Has Cards': stats.totalCards > 0,
      ...stateElements,
      ...emptyStateUI
    };
    
    assertions.logResults('Collection State', results);
    
    // Verify appropriate state is shown
    if (stats.totalCards === 0) {
      console.log('Empty collection state detected');
      // Should show empty state or getting started elements
      const hasEmptyStateIndicators = Object.values(stateElements).some(count => count > 0) ||
                                     emptyStateUI['Empty messages'] > 0 ||
                                     emptyStateUI['Getting started elements'] > 0;
      expect(hasEmptyStateIndicators || emptyStateUI['Card elements'] === 0).toBe(true);
    } else {
      console.log(`Collection has ${stats.totalCards} cards`);
      // Should show cards or collection content
      expect(stats.statsDisplayed).toBe(true);
    }
  });
});