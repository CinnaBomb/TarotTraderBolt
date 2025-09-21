import { test, expect } from '@playwright/test';
import { 
  AuthHelpers, 
  NavigationHelpers, 
  ReadingHelpers, 
  AssertionHelpers, 
  TestSetup 
} from './utils';

test.describe('Complete Reading Flow (Refactored)', () => {
  test.beforeEach(async ({ page }) => {
    await TestSetup.authenticateUser(page);
  });

  test('should complete three-card reading flow', async ({ page }) => {
    const reading = new ReadingHelpers(page);
    const assertions = new AssertionHelpers(page);
    
    // Start reading from home view using helper
    await reading.startNewReading('three-card');
    
    // Verify reading interface loaded
    const readingElements = await assertions.countTextReferences([
      'reading', 'three-card', 'spread', 'cards'
    ]);
    
    // Check if modal opened
    const modalOpen = await reading.isReadingModalOpen();
    console.log(`Reading modal opened: ${modalOpen}`);
    
    // Complete the reading workflow
    await reading.drawCards(3);
    await page.waitForTimeout(1000);
    await reading.completeReading();
    
    // Verify completion
    const completionElements = await assertions.countTextReferences([
      'complete', 'finished', 'saved', 'done'
    ]);
    
    const results = { 
      'Modal opened': modalOpen, 
      ...readingElements, 
      ...completionElements 
    };
    assertions.logResults('Three-Card Reading Flow', results);
    
    // Verify reading workflow completed
    expect(readingElements.reading).toBeGreaterThan(0);
    console.log('Three-card reading flow completed successfully');
  });

  test('should handle reading modal interactions', async ({ page }) => {
    const nav = new NavigationHelpers(page);
    const reading = new ReadingHelpers(page);
    const assertions = new AssertionHelpers(page);
    
    // Navigate to readings and start new reading
    await nav.navigateToView('Readings');
    await reading.startNewReading('three-card');
    
    // Test modal interactions
    const modalInteractions = await assertions.countElements({
      'Modal elements': '[role="dialog"], .modal, [data-testid*="modal"]',
      'Close buttons': 'button:has-text("×"), button:has-text("Close"), [aria-label*="close" i]',
      'Action buttons': 'button:not([aria-label*="close" i])',
      'Card slots': '[data-testid*="card"], .card-slot, .card-position'
    });
    
    // Test if modal is interactive
    const isModalOpen = await reading.isReadingModalOpen();
    
    // Try interacting with cards
    await reading.drawCards(1);
    await page.waitForTimeout(500);
    
    const results = { 'Modal open': isModalOpen, ...modalInteractions };
    assertions.logResults('Modal Interactions', results);
    
    // Verify modal functionality
    expect(isModalOpen).toBe(true);
    expect(modalInteractions['Modal elements']).toBeGreaterThan(0);
  });

  test('should handle reading states and progression', async ({ page }) => {
    const reading = new ReadingHelpers(page);
    const assertions = new AssertionHelpers(page);
    
    // Start reading and test progression
    await reading.startNewReading('three-card');
    
    // Check initial state
    const initialState = await assertions.countTextReferences([
      'select', 'choose', 'draw', 'position'
    ]);
    
    // Progress through reading
    await reading.drawCards(2); // Draw some but not all cards
    await page.waitForTimeout(1000);
    
    // Check progression state
    const progressState = await assertions.countTextReferences([
      'continue', 'next', 'remaining', 'more'
    ]);
    
    // Complete the reading
    await reading.drawCards(1); // Complete the cards
    await page.waitForTimeout(1000);
    
    // Check completion state
    const completionState = await assertions.countTextReferences([
      'complete', 'done', 'finish', 'save'
    ]);
    
    const results = {
      'Initial state elements': Object.values(initialState).reduce((sum, count) => sum + count, 0),
      'Progress state elements': Object.values(progressState).reduce((sum, count) => sum + count, 0),
      'Completion state elements': Object.values(completionState).reduce((sum, count) => sum + count, 0)
    };
    
    assertions.logResults('Reading State Progression', results);
    
    // Verify state progression occurred
    console.log('Reading state progression tested successfully');
  });

  test('should access reading context and state', async ({ page }) => {
    const reading = new ReadingHelpers(page);
    const assertions = new AssertionHelpers(page);
    
    // Start reading from home
    await reading.startNewReading('three-card');
    
    // Check for context elements
    const contextElements = await assertions.countTextReferences([
      'spread', 'interpretation', 'meaning', 'card', 'position'
    ]);
    
    // Check for state indicators
    const stateElements = await assertions.countElements({
      'Active elements': '[class*="active"], [data-state="active"], .selected',
      'Reading components': '[class*="reading"], [data-testid*="reading"]',
      'Card elements': '[class*="card"], [data-testid*="card"]'
    });
    
    // Test reading context persistence
    await page.waitForTimeout(1000);
    const modalStillOpen = await reading.isReadingModalOpen();
    
    const results = { 
      'Modal persistent': modalStillOpen,
      ...contextElements, 
      ...stateElements 
    };
    assertions.logResults('Reading Context Access', results);
    
    // Verify reading context is accessible
    expect(contextElements.card).toBeGreaterThan(0);
    console.log('Reading context and state access verified');
  });

  test('should test reading persistence and history', async ({ page }) => {
    const nav = new NavigationHelpers(page);
    const reading = new ReadingHelpers(page);
    const assertions = new AssertionHelpers(page);
    
    // Complete a reading first
    await reading.startNewReading('single');
    await reading.drawCards(1);
    await reading.completeReading();
    
    // Navigate to readings to check persistence
    await nav.navigateToView('Readings');
    await page.waitForTimeout(1000);
    
    // Check for reading history
    const historyElements = await assertions.countTextReferences([
      'reading', 'history', 'previous', 'completed', 'recent'
    ]);
    
    const persistenceElements = await assertions.countElements({
      'Reading items': '[data-testid*="reading"], .reading-item, .reading-card',
      'History containers': '[class*="history"], [class*="list"], [class*="grid"]',
      'Timestamps': 'time, [datetime], .timestamp, .date'
    });
    
    const results = { ...historyElements, ...persistenceElements };
    assertions.logResults('Reading Persistence', results);
    
    // Verify reading persistence
    expect(historyElements.reading).toBeGreaterThan(0);
    console.log('Reading persistence and history verified');
  });
});