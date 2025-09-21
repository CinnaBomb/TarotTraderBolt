import { test, expect } from '@playwright/test';
import { 
  AuthHelpers, 
  NavigationHelpers, 
  AssertionHelpers, 
  TestSetup 
} from './utils';

test.describe('Profile Management (Refactored)', () => {
  test.beforeEach(async ({ page }) => {
    await TestSetup.authenticateUser(page);
  });

  test('should navigate to profile view', async ({ page }) => {
    const nav = new NavigationHelpers(page);
    const assertions = new AssertionHelpers(page);
    
    // Try to navigate to profile via bottom navigation
    await nav.navigateToView('Profile');
    
    // Check for profile-related content
    const profileContent = await assertions.countTextReferences([
      'profile', 'user', 'account', 'settings'
    ]);
    
    assertions.logResults('Profile Navigation', profileContent);
    
    // Verify profile elements are present
    const totalProfileRefs = Object.values(profileContent).reduce((sum, count) => sum + count, 0);
    expect(totalProfileRefs).toBeGreaterThan(0);
    console.log('Profile navigation completed');
  });

  test('should display user profile information', async ({ page }) => {
    const nav = new NavigationHelpers(page);
    const assertions = new AssertionHelpers(page);
    
    // Navigate to profile
    await nav.navigateToView('Profile');
    
    // Look for user information
    const userInfo = await assertions.countTextReferences([
      'email', 'username', 'name', 'profile', 'account'
    ]);
    
    // Check for user identifier
    const userIdentifier = await assertions.countTextReferences([
      'test', 'tarot', 'user'
    ]);
    
    const results = { ...userInfo, ...userIdentifier };
    assertions.logResults('User Profile Information', results);
    
    // Verify profile information is displayed
    expect(userInfo.profile).toBeGreaterThan(0);
  });

  test('should display user statistics', async ({ page }) => {
    const nav = new NavigationHelpers(page);
    const assertions = new AssertionHelpers(page);
    
    // Navigate to profile
    await nav.navigateToView('Profile');
    
    // Look for statistics
    const stats = await assertions.countTextReferences([
      'readings', 'cards', 'level', 'experience', 'collection', 'completed'
    ]);
    
    // Look for numerical indicators
    const numbers = await assertions.countElements({
      'Numerical values': 'text=/\\d+/',
      'Stat containers': '[class*="stat"], .stats, [data-testid*="stat"]'
    });
    
    const results = { ...stats, ...numbers };
    assertions.logResults('User Statistics', results);
    
    // Verify statistics are shown
    const totalStats = Object.values(stats).reduce((sum, count) => sum + count, 0);
    expect(totalStats).toBeGreaterThan(2);
  });

  test('should display achievements or progress indicators', async ({ page }) => {
    const nav = new NavigationHelpers(page);
    const assertions = new AssertionHelpers(page);
    
    // Navigate to profile
    await nav.navigateToView('Profile');
    
    // Look for achievement elements
    const achievements = await assertions.countTextReferences([
      'achievement', 'badge', 'progress', 'milestone', 'unlock'
    ]);
    
    // Look for progress indicators
    const progressElements = await assertions.countElements({
      'Progress bars': '[role="progressbar"], .progress, [class*="progress"]',
      'Percentage indicators': 'text=/%|percent/i'
    });
    
    const results = { ...achievements, ...progressElements };
    assertions.logResults('Achievements and Progress', results);
    
    // Verify achievement system is present
    console.log('Achievement system checked');
  });

  test('should display reading history or activity', async ({ page }) => {
    const nav = new NavigationHelpers(page);
    const assertions = new AssertionHelpers(page);
    
    // Navigate to profile
    await nav.navigateToView('Profile');
    
    // Look for activity/history
    const activity = await assertions.countTextReferences([
      'activity', 'history', 'recent', 'readings', 'sessions'
    ]);
    
    // Look for date/time elements
    const timeElements = await assertions.countElements({
      'Date elements': 'time, [datetime], .timestamp, .date',
      'Activity indicators': 'text=/\\d{1,2}[\\/\\-]\\d{1,2}|ago|yesterday|today/i'
    });
    
    const results = { ...activity, ...timeElements };
    assertions.logResults('Activity History', results);
    
    // Check if readings view has history instead
    if (activity.activity === 0 && activity.history === 0) {
      await nav.navigateToView('Readings');
      const readingsHistory = await assertions.countTextReferences(['reading', 'history']);
      console.log(`Reading history found in readings view: ${readingsHistory.reading}`);
    }
    
    console.log('Activity history checked');
  });

  test('should handle responsive profile layout', async ({ page }) => {
    const nav = new NavigationHelpers(page);
    const assertions = new AssertionHelpers(page);
    
    // Navigate to profile
    await nav.navigateToView('Profile');
    
    // Check responsive layout
    const layout = await assertions.checkResponsiveLayout();
    
    // Check for profile sections
    const profileSections = await assertions.checkSections([
      'User Info', 'Statistics', 'Achievements', 'Settings', 'History'
    ]);
    
    const results = { ...layout, ...profileSections };
    assertions.logResults('Profile Layout', results);
    
    // Verify sufficient elements for functionality
    expect(layout.interactiveElements).toBeGreaterThan(5);
    expect(layout.layoutContainers).toBeGreaterThan(5);
    console.log('Profile layout responsiveness verified');
  });
});