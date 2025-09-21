import { chromium } from 'playwright';

(async () => {
  const browser = await chromium.launch({ headless: true });
  const page = await browser.newPage();
  
  try {
    console.log('Navigating to http://localhost:5173/...');
    await page.goto('http://localhost:5173/', { waitUntil: 'networkidle' });
    
    console.log('Page title:', await page.title());
    
    // Listen for console logs from the page
    page.on('console', msg => {
      console.log('PAGE LOG:', msg.text());
    });
    
    // Fill in invalid credentials
    console.log('Filling invalid credentials...');
    await page.fill('[data-testid="email-input"]', 'invalid@email.com');
    await page.fill('[data-testid="password-input"]', 'wrongpassword');
    
    // Click submit
    console.log('Clicking submit...');
    await page.click('[data-testid="submit-button"]');
    
    // Check immediately after submit
    await page.waitForTimeout(500);
    console.log('=== 500ms after submit ===');
    let errorWithAria = await page.locator('[aria-label="Authentication error message"]').count();
    let debugInfo = await page.locator('text=Error State:').textContent().catch(() => 'Not found');
    console.log('Error container count:', errorWithAria);
    console.log('Debug info:', debugInfo);
    
    // Wait longer and check again
    await page.waitForTimeout(2000);
    console.log('=== 2.5s after submit ===');
    errorWithAria = await page.locator('[aria-label="Authentication error message"]').count();
    debugInfo = await page.locator('text=Error State:').textContent().catch(() => 'Not found');
    console.log('Error container count:', errorWithAria);
    console.log('Debug info:', debugInfo);
    
    // Wait even longer
    await page.waitForTimeout(2500);
    console.log('=== 5s after submit ===');
    
    // Look for error messages with different selectors
    console.log('Looking for error messages...');
    
    // Check for red background elements (error styling)
    const redElements = await page.locator('.bg-red-500').all();
    console.log('Red background elements:', redElements.length);
    
    for (let i = 0; i < redElements.length; i++) {
      const text = await redElements[i].textContent();
      console.log(`Red element ${i}: "${text}"`);
    }
    
    // Check debug info section which shows the error state
    const finalDebugInfo = await page.locator('text=Error State:').textContent();
    console.log('Final debug info found:', finalDebugInfo);
    
    // Check for the new aria-label
    const finalErrorWithAria = await page.locator('[aria-label="Authentication error message"]').count();
    console.log('Final error container with aria-label count:', finalErrorWithAria);
    
    // Check for the data-testid
    const errorWithTestId = await page.locator('[data-testid="auth-error-message"]').count();
    console.log('Error container with test-id count:', errorWithTestId);
    
    // Check if the submit button shows loading state
    const submitButton = await page.locator('[data-testid="submit-button"]');
    const buttonText = await submitButton.textContent();
    console.log('Submit button text:', buttonText);
    
  } catch (error) {
    console.error('Error:', error);
  } finally {
    await browser.close();
  }
})();