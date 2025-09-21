import { Page } from '@playwright/test';

/**
 * Common assertion utilities for E2E tests
 */
export class AssertionHelpers {
  constructor(private page: Page) {}

  /**
   * Check if elements with specific text patterns exist
   */
  async countTextReferences(patterns: string[]): Promise<{ [key: string]: number }> {
    const results: { [key: string]: number } = {};
    
    for (const pattern of patterns) {
      const count = await this.page.locator(`text=/${pattern}/i`).count();
      results[pattern] = count;
      if (count > 0) {
        console.log(`Found "${pattern}": ${count} instances`);
      }
    }
    
    return results;
  }

  /**
   * Check for specific UI sections
   */
  async checkSections(sectionNames: string[]): Promise<{ [key: string]: boolean }> {
    const results: { [key: string]: boolean } = {};
    
    for (const section of sectionNames) {
      const count = await this.page.locator(`text=/${section}/i`).count();
      const found = count > 0;
      results[section] = found;
      console.log(`"${section}" section found: ${found}`);
    }
    
    return results;
  }

  /**
   * Count elements by selector patterns
   */
  async countElements(selectors: { [key: string]: string }): Promise<{ [key: string]: number }> {
    const results: { [key: string]: number } = {};
    
    for (const [name, selector] of Object.entries(selectors)) {
      const count = await this.page.locator(selector).count();
      results[name] = count;
      console.log(`${name}: ${count}`);
    }
    
    return results;
  }

  /**
   * Wait for elements to appear and validate
   */
  async waitForElements(selectors: string[], timeout: number = 5000): Promise<boolean[]> {
    const results: boolean[] = [];
    
    for (const selector of selectors) {
      try {
        await this.page.waitForSelector(selector, { timeout });
        results.push(true);
      } catch {
        results.push(false);
      }
    }
    
    return results;
  }

  /**
   * Check responsive layout elements
   */
  async checkResponsiveLayout(): Promise<{
    layoutContainers: number;
    responsiveClasses: number;
    interactiveElements: number;
  }> {
    const results = await this.countElements({
      'Layout containers': 'div[class*="grid"], div[class*="flex"], div[class*="container"]',
      'Responsive classes': '[class*="sm:"], [class*="md:"], [class*="lg:"], [class*="responsive"]',
      'Interactive elements': 'button, [role="button"], input, select, textarea'
    });

    return {
      layoutContainers: results['Layout containers'],
      responsiveClasses: results['Responsive classes'],
      interactiveElements: results['Interactive elements']
    };
  }

  /**
   * Log test results in a structured way
   */
  logResults(testName: string, results: any): void {
    console.log(`\n=== ${testName} Results ===`);
    for (const [key, value] of Object.entries(results)) {
      console.log(`${key}: ${value}`);
    }
    console.log('========================\n');
  }
}