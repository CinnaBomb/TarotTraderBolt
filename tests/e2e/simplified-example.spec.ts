import { test, expect } from '@playwright/test';
import { 
  AuthHelpers, 
  NavigationHelpers, 
  ReadingHelpers, 
  AssertionHelpers,
  CollectionHelpers,
  TestSetup 
} from './utils';

test.describe('Simplified Reading Flow', () => {
  test.beforeEach(async ({ page }) => {
    await TestSetup.authenticateUser(page);
  });

  test('should complete reading workflow using helpers', async ({ page }) => {
    // Initialize helpers
    const nav = new NavigationHelpers(page);
    const reading = new ReadingHelpers(page);
    const assertions = new AssertionHelpers(page);

    // Start new reading
    await reading.startNewReading('three-card');
    
    // Verify reading modal opened
    expect(await reading.isReadingModalOpen()).toBe(true);
    
    // Draw cards
    await reading.drawCards(3);
    
    // Complete reading
    await reading.completeReading();
    
    // Navigate to readings view to verify
    await nav.navigateToView('Readings');
    
    // Check for reading completion indicators
    const readingIndicators = await assertions.countTextReferences([
      'reading', 'completed', 'three-card'
    ]);
    
    assertions.logResults('Reading Completion', readingIndicators);
    
    // Verify at least one reading exists
    expect(readingIndicators.reading).toBeGreaterThan(0);
  });

  test('should manage collection using helpers', async ({ page }) => {
    const collection = new CollectionHelpers(page);
    const assertions = new AssertionHelpers(page);

    // Navigate to collection
    await collection.goToCollection();
    
    // Get collection stats
    const stats = await collection.getCollectionStats();
    
    // Check for collection elements
    const collectionElements = await assertions.countTextReferences([
      'collection', 'cards', 'pack'
    ]);
    
    assertions.logResults('Collection Stats', {
      ...stats,
      ...collectionElements
    });
    
    // Verify collection view loaded
    expect(collectionElements.collection).toBeGreaterThan(0);
  });

  test('should verify responsive layout using helpers', async ({ page }) => {
    const assertions = new AssertionHelpers(page);
    
    // Check responsive layout
    const layout = await assertions.checkResponsiveLayout();
    
    assertions.logResults('Responsive Layout', layout);
    
    // Verify sufficient interactive elements
    expect(layout.interactiveElements).toBeGreaterThan(5);
    expect(layout.layoutContainers).toBeGreaterThan(5);
  });
});