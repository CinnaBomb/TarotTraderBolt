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
    
    console.log('Page title:', await page.title());
    
    // Use the dev test button instead of manual login
    console.log('Clicking dev test authentication button...');
    await page.click('text=🧪 Test Authentication (Dev Only)');
    
    // Wait for authentication to complete
    await page.waitForTimeout(5000);
    
    // Take screenshot
    await page.screenshot({ path: 'login-debug.png' });
    console.log('Screenshot saved as login-debug.png');
    
    // Check for success indicators
    const successMessage = await page.locator('[data-testid="auth-success-message"]').count();
    console.log('Success message count:', successMessage);
    
    // Check for profile text
    const profileText = await page.locator('text=Profile').count();
    console.log('Profile text count:', profileText);
    
    // Check for header auth button (indicates main app loaded)
    const headerButton = await page.locator('[data-testid="header-auth-button"]').count();
    console.log('Header auth button count:', headerButton);
    
    // Check page title
    const newTitle = await page.title();
    console.log('Page title after login:', newTitle);
    
    // Check for any error messages
    const errorMessage = await page.locator('[data-testid="auth-error-message"]').count();
    console.log('Error message count:', errorMessage);
    
    // List all visible buttons
    const allButtons = await page.locator('button').all();
    console.log('All buttons found:', allButtons.length);
    
    for (let i = 0; i < Math.min(allButtons.length, 10); i++) {
      const button = allButtons[i];
      const text = await button.textContent();
      const testId = await button.getAttribute('data-testid');
      console.log(`Button ${i}: text="${text}", data-testid="${testId}"`);
    }
    
  } catch (error) {
    console.error('Error:', error);
  } finally {
    await browser.close();
  }
})();