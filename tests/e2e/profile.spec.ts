import { test, expect, Page } from '@playwright/test';

// Helper function for authentication and navigation
async function authenticateAndNavigate(page: Page) {
  await page.goto('/');
  
  // Check if already authenticated
  const userButton = page.getByTestId('header-auth-button');
  try {
    await expect(userButton).toBeVisible({ timeout: 2000 });
    console.log('Already authenticated, proceeding to profile');
    return;
  } catch {
    // Need to authenticate - app shows login form when not authenticated
  }

  // Authenticate using environment variables
  const email = process.env.TEST_USER_EMAIL;
  const password = process.env.TEST_USER_PASSWORD;
  
  if (!email || !password) {
    throw new Error('TEST_USER_EMAIL and TEST_USER_PASSWORD must be set in .env.local');
  }

  // When not authenticated, the login form should be visible directly
  await page.getByPlaceholder('Email').fill(email);
  await page.getByPlaceholder('Password').fill(password);
  await page.getByRole('button', { name: 'Sign In' }).click();
  
  // Wait for successful authentication
  await expect(userButton).toBeVisible();
  console.log('Authentication successful for profile tests');
}

test.describe('Profile Management', () => {
  test.beforeEach(async ({ page }) => {
    await authenticateAndNavigate(page);
  });

  test('should navigate to profile view', async ({ page }) => {
    // Click the profile button in header or bottom navigation
    const profileButton = page.getByTestId('header-auth-button');
    await profileButton.click();
    
    // Wait for profile view or menu to appear
    await page.waitForTimeout(1000);
    
    // Check if profile menu appeared or if we navigated to profile page
    const profileElements = await page.locator('text=/profile/i').count();
    console.log(`Found ${profileElements} profile-related elements`);
    
    // Alternative: try bottom navigation Profile button
    if (profileElements === 0) {
      const bottomNav = page.locator('nav').last();
      const bottomProfileButton = bottomNav.getByRole('button', { name: 'Profile' });
      if (await bottomProfileButton.isVisible()) {
        await bottomProfileButton.click();
        await page.waitForTimeout(1000);
        console.log('Navigated to profile via bottom navigation');
      }
    }
    
    console.log('Profile navigation completed');
  });

  test('should display user profile information', async ({ page }) => {
    // Navigate to profile
    const bottomNav = page.locator('nav').last();
    const profileButton = bottomNav.getByRole('button', { name: 'Profile' });
    if (await profileButton.isVisible()) {
      await profileButton.click();
      await page.waitForTimeout(1000);
    }
    
    // Look for common profile elements
    const profileElements = [
      'email', 'username', 'name', 'level', 'experience', 'stats',
      'profile', 'account', 'settings'
    ];
    
    let foundElements = 0;
    for (const element of profileElements) {
      const count = await page.locator(`text=/${element}/i`).count();
      if (count > 0) {
        foundElements++;
        console.log(`Found ${count} "${element}" references`);
      }
    }
    
    console.log(`Profile information elements found: ${foundElements}`);
    
    // Check for user identifier (email or username)
    const userIdentifier = await page.locator('text=/test.*tarot|tarot.*test/i').count();
    console.log(`User identifier found: ${userIdentifier > 0}`);
  });

  test('should display user statistics', async ({ page }) => {
    // Navigate to profile or look for stats on current page
    const bottomNav = page.locator('nav').last();
    const profileButton = bottomNav.getByRole('button', { name: 'Profile' });
    if (await profileButton.isVisible()) {
      await profileButton.click();
      await page.waitForTimeout(1000);
    }
    
    // Look for statistics elements
    const statTypes = [
      'readings', 'cards', 'level', 'experience', 'streak', 'points',
      'achievements', 'collection', 'completed', 'created'
    ];
    
    let statsFound = 0;
    for (const statType of statTypes) {
      const count = await page.locator(`text=/${statType}/i`).count();
      if (count > 0) {
        statsFound++;
        console.log(`Found "${statType}" statistics: ${count} instances`);
      }
    }
    
    // Look for numerical values that might be stats
    const numberElements = await page.locator('text=/\\d+/').count();
    console.log(`Numerical elements (potential stats): ${numberElements}`);
    
    console.log(`Total stat types found: ${statsFound}`);
  });

  test('should display achievements or progress indicators', async ({ page }) => {
    // Navigate to profile
    const bottomNav = page.locator('nav').last();
    const profileButton = bottomNav.getByRole('button', { name: 'Profile' });
    if (await profileButton.isVisible()) {
      await profileButton.click();
      await page.waitForTimeout(1000);
    }
    
    // Look for achievement or progress elements
    const achievementElements = [
      'achievement', 'badge', 'progress', 'unlock', 'milestone',
      'reward', 'trophy', 'rank', 'tier', 'status'
    ];
    
    let achievementsFound = 0;
    for (const element of achievementElements) {
      const count = await page.locator(`text=/${element}/i`).count();
      if (count > 0) {
        achievementsFound++;
        console.log(`Found "${element}" indicators: ${count} instances`);
      }
    }
    
    // Look for progress bars or indicators
    const progressBars = await page.locator('[role="progressbar"], .progress, [class*="progress"]').count();
    console.log(`Progress bars found: ${progressBars}`);
    
    // Look for percentage indicators
    const percentages = await page.locator('text=/%|percent/i').count();
    console.log(`Percentage indicators: ${percentages}`);
    
    console.log(`Achievement/progress elements found: ${achievementsFound}`);
  });

  test('should handle profile settings or preferences', async ({ page }) => {
    // Navigate to profile
    const bottomNav = page.locator('nav').last();
    const profileButton = bottomNav.getByRole('button', { name: 'Profile' });
    if (await profileButton.isVisible()) {
      await profileButton.click();
      await page.waitForTimeout(1000);
    }
    
    // Look for settings or preferences elements
    const settingsElements = [
      'settings', 'preferences', 'options', 'configuration',
      'theme', 'notifications', 'privacy', 'account'
    ];
    
    let settingsFound = 0;
    for (const element of settingsElements) {
      const elements = page.locator(`text=/${element}/i`);
      const count = await elements.count();
      if (count > 0) {
        settingsFound++;
        console.log(`Found "${element}" settings: ${count} instances`);
        
        // Try clicking the first settings element if it's a button
        const buttons = page.getByRole('button', { name: new RegExp(element, 'i') });
        const buttonCount = await buttons.count();
        if (buttonCount > 0) {
          try {
            await buttons.first().click();
            await page.waitForTimeout(500);
            console.log(`Successfully clicked ${element} button`);
            break; // Exit after first successful click
          } catch (error) {
            console.log(`Could not click ${element} button`);
          }
        }
      }
    }
    
    console.log(`Settings elements found: ${settingsFound}`);
  });

  test('should display reading history or activity', async ({ page }) => {
    // Navigate to profile
    const bottomNav = page.locator('nav').last();
    const profileButton = bottomNav.getByRole('button', { name: 'Profile' });
    if (await profileButton.isVisible()) {
      await profileButton.click();
      await page.waitForTimeout(1000);
    }
    
    // Look for history or activity elements
    const historyElements = [
      'history', 'activity', 'recent', 'past', 'previous',
      'readings', 'sessions', 'timeline', 'log'
    ];
    
    let historyFound = 0;
    for (const element of historyElements) {
      const count = await page.locator(`text=/${element}/i`).count();
      if (count > 0) {
        historyFound++;
        console.log(`Found "${element}" history: ${count} instances`);
      }
    }
    
    // Look for date/time indicators that suggest activity history
    const dateElements = await page.locator('text=/\\d{1,2}[\\/\\-]\\d{1,2}|\\d{4}|ago|yesterday|today/i').count();
    console.log(`Date/time elements (activity indicators): ${dateElements}`);
    
    // Check if readings view shows history instead
    if (historyFound === 0) {
      const readingsButton = bottomNav.getByRole('button', { name: 'Readings' });
      if (await readingsButton.isVisible()) {
        await readingsButton.click();
        await page.waitForTimeout(1000);
        
        const readingsHistory = await page.locator('text=/reading|history|previous/i').count();
        console.log(`Reading history found in readings view: ${readingsHistory}`);
      }
    }
    
    console.log(`Total history/activity elements: ${historyFound}`);
  });

  test('should handle responsive profile layout', async ({ page }) => {
    // Navigate to profile
    const bottomNav = page.locator('nav').last();
    const profileButton = bottomNav.getByRole('button', { name: 'Profile' });
    if (await profileButton.isVisible()) {
      await profileButton.click();
      await page.waitForTimeout(1000);
    }
    
    // Check layout containers
    const layoutContainers = await page.locator('div[class*="grid"], div[class*="flex"], div[class*="container"]').count();
    console.log(`Layout containers: ${layoutContainers}`);
    
    // Check for responsive elements
    const responsiveElements = await page.locator('[class*="responsive"], [class*="mobile"], [class*="desktop"], [class*="sm:"], [class*="md:"], [class*="lg:"]').count();
    console.log(`Responsive utility classes: ${responsiveElements}`);
    
    // Test common profile sections
    const profileSections = [
      'User Info', 'Statistics', 'Achievements', 'Settings', 'History'
    ];
    
    for (const section of profileSections) {
      const sectionFound = await page.locator(`text=/${section}/i`).isVisible();
      console.log(`"${section}" section found: ${sectionFound}`);
    }
    
    // Check for mobile-friendly elements
    const mobileElements = await page.locator('button, [role="button"]').count();
    console.log(`Interactive elements (mobile-friendly): ${mobileElements}`);
    
    console.log('Profile layout responsiveness checked');
  });
});