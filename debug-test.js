import { chromium } from 'playwright';

(async () => {
  const browser = await chromium.launch({ headless: true });
  const page = await browser.newPage();
  
  try {
    console.log('Navigating to http://localhost:5173/...');
    await page.goto('http://localhost:5173/', { waitUntil: 'networkidle' });
    
    console.log('Page title:', await page.title());
    
    // List all buttons with their attributes
    const allButtons = await page.locator('button').all();
    console.log('All buttons found:', allButtons.length);
    
    for (let i = 0; i < allButtons.length; i++) {
      const button = allButtons[i];
      const text = await button.textContent();
      const ariaLabel = await button.getAttribute('aria-label');
      const testId = await button.getAttribute('data-testid');
      console.log(`Button ${i}: text="${text}", aria-label="${ariaLabel}", data-testid="${testId}"`);
    }
    
  } catch (error) {
    console.error('Error:', error);
  } finally {
    await browser.close();
  }
})();