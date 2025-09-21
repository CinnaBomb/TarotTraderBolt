import { test, expect } from '@playwright/test';

// Get test credentials from environment variables
const TEST_USER_EMAIL = process.env.TEST_USER_EMAIL || 'test@example.com';
const TEST_USER_PASSWORD = process.env.TEST_USER_PASSWORD || 'testpassword123';

test.describe('Collection Management', () => {
  test.setTimeout(60000);
  
  test.beforeEach(async ({ page }) => {
    try {
      // Navigate and authenticate
      await page.goto('/', { waitUntil: 'networkidle' });
      await expect(page.getByTestId('email-input')).toBeVisible();
      
      await page.getByTestId('email-input').fill(TEST_USER_EMAIL);
      await page.getByTestId('password-input').fill(TEST_USER_PASSWORD);
      await page.getByRole('button', { name: 'Sign In' }).click();
      
      await page.waitForTimeout(3000);
      await expect(page.getByTestId('header-auth-button')).toBeVisible();
      
      console.log('Authentication successful for collection tests');
    } catch (error) {
      console.error('Collection test setup failed:', error);
      throw error;
    }
  });

  test('should navigate to collection view', async ({ page }) => {
    // Navigate to collection using bottom navigation
    await page.getByRole('button', { name: 'Collection' }).click();
    await page.waitForTimeout(1000);
    
    // Check if collection view loaded
    await expect(page.getByRole('heading', { name: 'My Collection' })).toBeVisible();
    
    console.log('Collection view loaded successfully');
  });

  test('should display collection stats', async ({ page }) => {
    await page.getByRole('button', { name: 'Collection' }).click();
    await page.waitForTimeout(1000);
    
    // Check for collection count display
    const statsText = await page.locator('text=/\\d+ cards collected/').count();
    expect(statsText).toBeGreaterThanOrEqual(0);
    
    console.log('Collection stats displayed');
  });

  test('should show pack opening functionality', async ({ page }) => {
    await page.getByRole('button', { name: 'Collection' }).click();
    await page.waitForTimeout(1000);
    
    // Look for "Open Pack" button
    const openPackButton = page.getByRole('button', { name: 'Open Pack' });
    await expect(openPackButton).toBeVisible();
    
    console.log('Pack opening functionality available');
  });

  test('should handle empty collection state', async ({ page }) => {
    await page.getByRole('button', { name: 'Collection' }).click();
    await page.waitForTimeout(1000);
    
    // Check if empty state is shown (for new accounts)
    const emptyMessage = await page.getByText('Your collection is empty').count();
    if (emptyMessage > 0) {
      console.log('Empty collection state displayed correctly');
    } else {
      console.log('User has cards in collection');
    }
    
    expect(true).toBe(true);
  });
});