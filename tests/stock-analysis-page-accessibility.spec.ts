import { test, expect } from '@playwright/test';
import { StockAnalysisPage } from '../pom/pages';

// TODO: Stats menu link not available yet - page may be under development
test.describe('TC010: Stock Analysis Page Accessibility and Core', () => {
  test.setTimeout(60_000);

  test('should load Stock Analysis page directly via URL @smoke', async ({ page }) => {
    const stockAnalysisPage = new StockAnalysisPage(page);
    
    await stockAnalysisPage.open();
    
    const currentUrl = page.url();
    expect(currentUrl).toContain('/stats');
  });

  test('should verify Stock Analysis page has main menu component @smoke', async ({ page }) => {
    const stockAnalysisPage = new StockAnalysisPage(page);
    
    await stockAnalysisPage.open();

    const currentUrl = page.url();
    expect(currentUrl).toContain('/stats');
    
    const mainMenuVisible = await stockAnalysisPage.mainMenuComponent.isVisible();
    expect(mainMenuVisible).toBe(true);
  });
});
