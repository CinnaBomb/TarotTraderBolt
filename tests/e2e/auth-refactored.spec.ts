import { test, expect } from '@playwright/test';
import { AuthHelpers, AssertionHelpers, COMMON_SELECTORS } from './utils';

test.describe('Authentication (Refactored)', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/');
  });

  test('should show login form when not authenticated', async ({ page }) => {
    const assertions = new AssertionHelpers(page);
    
    // Check if login modal/form is visible
    const loginModal = page.locator('[data-testid="auth-modal"]');
    await expect(loginModal).toBeVisible();
    
    // Check modal title
    const modalTitle = page.locator('[data-testid="auth-modal-title"]');
    await expect(modalTitle).toBeVisible();
    await expect(modalTitle).toHaveText('Welcome Back');
    
    // Verify form elements are present using helper
    const formElements = await assertions.countElements({
      'Email inputs': '[data-testid="email-input"]',
      'Password inputs': '[data-testid="password-input"]',
      'Submit buttons': '[data-testid="submit-button"]'
    });
    
    assertions.logResults('Login Form Elements', formElements);
    
    // Verify all required form elements exist
    expect(formElements['Email inputs']).toBeGreaterThan(0);
    expect(formElements['Password inputs']).toBeGreaterThan(0);
    expect(formElements['Submit buttons']).toBeGreaterThan(0);
  });

  test('should show error message with invalid credentials', async ({ page }) => {
    const auth = new AuthHelpers(page);
    const assertions = new AssertionHelpers(page);
    
    // Try to authenticate with invalid credentials
    await page.getByPlaceholder('Email').fill('invalid@example.com');
    await page.getByPlaceholder('Password').fill('wrongpassword');
    await page.getByRole('button', { name: 'Sign In' }).click();
    
    // Wait for error to appear
    await page.waitForTimeout(2000);
    
    // Check for error indicators
    const errorElements = await assertions.countTextReferences([
      'error', 'invalid', 'incorrect', 'failed', 'wrong'
    ]);
    
    assertions.logResults('Error Message Check', errorElements);
    
    // Should find at least one error indicator
    const totalErrors = Object.values(errorElements).reduce((sum, count) => sum + count, 0);
    expect(totalErrors).toBeGreaterThan(0);
    
    // Verify still not authenticated
    const isAuth = await auth.isAuthenticated();
    expect(isAuth).toBe(false);
  });

  test('should login successfully with valid credentials', async ({ page }) => {
    const auth = new AuthHelpers(page);
    const assertions = new AssertionHelpers(page);
    
    // Authenticate using helper
    await auth.authenticate();
    
    // Verify authentication was successful
    const isAuth = await auth.isAuthenticated();
    expect(isAuth).toBe(true);
    
    // Check for authenticated UI elements
    const authElements = await assertions.countElements({
      'User button': '[data-testid="header-auth-button"]',
      'Navigation elements': 'nav button, [role="navigation"] button'
    });
    
    assertions.logResults('Authenticated UI', authElements);
    
    // Verify authenticated elements are present
    expect(authElements['User button']).toBeGreaterThan(0);
    expect(authElements['Navigation elements']).toBeGreaterThan(3); // Should have multiple nav buttons
    
    // Check that login form is no longer visible
    const loginModal = page.locator('[data-testid="auth-modal"]');
    await expect(loginModal).not.toBeVisible();
  });

  test('should log out successfully', async ({ page }) => {
    const auth = new AuthHelpers(page);
    const assertions = new AssertionHelpers(page);
    
    console.log('Starting logout test...');
    
    // First authenticate with test user credentials
    await auth.authenticate();
    
    // Verify user is logged in
    const isAuth = await auth.isAuthenticated();
    expect(isAuth).toBe(true);
    console.log('✓ User logged in successfully');
    
    // Click the user profile button to open dropdown
    const userButton = page.locator('[data-testid="header-auth-button"]');
    await userButton.click();
    
    // Wait for dropdown menu to appear and click logout
    const logoutButton = page.locator('[data-testid="logout-button"]');
    await expect(logoutButton).toBeVisible();
    console.log('✓ User dropdown menu opened');
    
    // Click logout button
    await logoutButton.click();
    console.log('✓ Logout button clicked');
    
    // Wait for logout to complete and page to reload/update
    await page.waitForTimeout(3000);
    
    // Wait for navigation to complete - the page might reload after logout
    await page.waitForLoadState('networkidle');
    
    // Verify logout was successful by checking authentication status
    const isStillAuth = await auth.isAuthenticated();
    expect(isStillAuth).toBe(false);
    console.log('✓ User is no longer authenticated');
    
    // Verify we can see login UI elements again
    const emailInput = page.locator('input[placeholder*="Email" i], [data-testid="email-input"]');
    await expect(emailInput).toBeVisible({ timeout: 5000 });
    console.log('✓ Login form is visible after logout');
    
    console.log('✅ Logout test completed successfully');
  });
});