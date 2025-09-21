import { chromium } from 'playwright';

(async () => {
  const browser = await chromium.launch({ headless: true });
  const page = await browser.newPage();
  
  try {
    console.log('Navigating to http://localhost:5173/...');
    await page.goto('http://localhost:5173/', { waitUntil: 'networkidle' });
    
    // Listen for console logs
    page.on('console', msg => {
      console.log('PAGE LOG:', msg.text());
    });
    
    console.log('Testing registration flow...');
    
    // Click "Sign Up" to switch to registration mode
    await page.click('[data-testid="toggle-auth-mode-button"]');
    await page.waitForTimeout(1000);
    
    // Check if we're now in sign-up mode
    const modalTitle = await page.locator('[data-testid="auth-modal-title"]').textContent();
    console.log('Modal title after toggle:', modalTitle);
    
    // Fill in registration details
    await page.fill('[data-testid="name-input"]', 'E2E Test User');
    await page.fill('[data-testid="email-input"]', `test+${Date.now()}@example.com`); // Unique email
    await page.fill('[data-testid="password-input"]', 'testpassword123');
    
    // Submit registration
    console.log('Submitting registration...');
    await page.click('[data-testid="submit-button"]');
    
    // Wait for result
    await page.waitForTimeout(5000);
    
    // Check for success or error
    const successCount = await page.locator('[data-testid="auth-success-message"]').count();
    const errorCount = await page.locator('[data-testid="auth-error-message"]').count();
    
    console.log('Success message count:', successCount);
    console.log('Error message count:', errorCount);
    
    if (successCount > 0) {
      const successText = await page.locator('[data-testid="auth-success-message"]').textContent();
      console.log('Success message:', successText);
    }
    
    if (errorCount > 0) {
      const errorText = await page.locator('[data-testid="auth-error-message"]').textContent();
      console.log('Error message:', errorText);
    }
    
    // Take screenshot
    await page.screenshot({ path: 'registration-debug.png' });
    console.log('Screenshot saved as registration-debug.png');
    
  } catch (error) {
    console.error('Error:', error);
  } finally {
    await browser.close();
  }
})();