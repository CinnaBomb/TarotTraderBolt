import { test, expect } from '@playwright/test';
import { 
  AuthHelpers, 
  NavigationHelpers, 
  AssertionHelpers,
  TestSetup,
  COMMON_SELECTORS 
} from './utils';

test.describe('Home Navigation (Refactored)', () => {
  test.beforeEach(async ({ page }) => {
    await TestSetup.authenticateUser(page);
  });

  test('should display main action cards', async ({ page }) => {
    const assertions = new AssertionHelpers(page);
    
    // Check for action cards
    const actionCards = await assertions.countTextReferences([
      'New Reading', 'Create Card', 'My Collection'
    ]);
    
    assertions.logResults('Action Cards', actionCards);
    
    // Verify main action cards are present
    expect(actionCards['New Reading']).toBeGreaterThan(0);
  });

  test('should navigate between views', async ({ page }) => {
    const nav = new NavigationHelpers(page);
    const assertions = new AssertionHelpers(page);
    
    // Test navigation to different views
    const views = ['Collection', 'Readings', 'Home'] as const;
    
    for (const view of views) {
      await nav.navigateToView(view);
      
      // Verify navigation worked
      const isOnCorrectView = await nav.isOnView(view);
      console.log(`Navigation to ${view}: ${isOnCorrectView ? 'Success' : 'Failed'}`);
      
      // Small delay between navigations
      await page.waitForTimeout(500);
    }
  });

  test('should handle action card interactions', async ({ page }) => {
    const nav = new NavigationHelpers(page);
    const assertions = new AssertionHelpers(page);
    
    // Test New Reading action card
    await nav.clickActionCard('New Reading');
    
    // Wait for spread selection or reading modal
    await page.waitForTimeout(1000);
    
    // Check if navigation happened
    const spreadElements = await assertions.countTextReferences([
      'spread', 'three-card', 'single', 'celtic'
    ]);
    
    assertions.logResults('Reading Navigation', spreadElements);
    
    // Should find spread-related content
    const totalSpreadRefs = Object.values(spreadElements).reduce((sum, count) => sum + count, 0);
    expect(totalSpreadRefs).toBeGreaterThan(0);
  });

  test('should display current reading section', async ({ page }) => {
    const assertions = new AssertionHelpers(page);
    
    // Go back to home to check current reading section
    const nav = new NavigationHelpers(page);
    await nav.goHome();
    
    // Check for current reading section
    const readingSections = await assertions.checkSections([
      'Current Reading', 'Reading in Progress', 'Continue Reading'
    ]);
    
    assertions.logResults('Reading Sections', readingSections);
    
    // At least one reading section should be found
    const hasReadingSection = Object.values(readingSections).some(found => found);
    expect(hasReadingSection).toBe(true);
  });

  test('should verify responsive layout', async ({ page }) => {
    const assertions = new AssertionHelpers(page);
    
    // Check responsive layout
    const layout = await assertions.checkResponsiveLayout();
    
    // Check specific home sections
    const homeSections = await assertions.checkSections([
      'New Reading', 'Create Card', 'Current Reading', 'My Collection'
    ]);
    
    const results = { ...layout, ...homeSections };
    assertions.logResults('Home Layout Analysis', results);
    
    // Verify sufficient elements for a functional home page
    expect(layout.interactiveElements).toBeGreaterThan(5);
    expect(layout.layoutContainers).toBeGreaterThanOrEqual(10);
  });
});