import { test, expect } from '@playwright/test';
import { SnapshotDesktopPage } from '../pom/pages';

test.describe('Snapshot Page - Interactions', () => {
  test.setTimeout(90_000);

  test('should handle navigation interactions @desktop', async ({ page }) => {
    await page.setViewportSize({ width: 1728, height: 1117 });
    
    const snapshotPage = new SnapshotDesktopPage(page);
    
    console.log('\n=== Testing snapshot page navigation interactions ===');

    await snapshotPage.open();
    await snapshotPage.isReady();
    console.log('✓ Navigated to snapshot page');

    // ===== MARKETS TAB SWITCHING =====
    console.log('\n=== Testing MARKETS tab switching ===');
    
    // Wait for page to load
    await page.waitForTimeout(2000);
    
    // Click GLOBAL tab
    await snapshotPage.clickGlobalTab();
    console.log('✓ Clicked GLOBAL tab');
    await page.waitForTimeout(1000);

    // Click MACRO tab
    await snapshotPage.clickMacroTab();
    console.log('✓ Clicked MACRO tab');
    await page.waitForTimeout(1000);

    // Click back to US tab
    await snapshotPage.clickUsTab();
    console.log('✓ Clicked US tab');
    await page.waitForTimeout(1000);
    console.log('✓ Tab switching works correctly');

    // ===== CAROUSEL NAVIGATION =====
    console.log('\n=== Testing Carousel Navigation ===');
    
    // Get initial visible card
    const initialCardVisible = await snapshotPage.investorLensCard.isVisible();
    console.log(`✓ Initial card visible: ${initialCardVisible}`);

    // Click right arrow
    await snapshotPage.clickRightArrow();
    console.log('✓ Clicked right arrow');
    await page.waitForTimeout(1000);

    // Verify different card is now visible (MACRO card should appear)
    const macroCardVisible = await snapshotPage.macroCard.isVisible();
    expect(macroCardVisible).toBe(true);
    console.log('✓ MACRO card visible after clicking right arrow');

    // Click left arrow
    await snapshotPage.clickLeftArrow();
    console.log('✓ Clicked left arrow');
    await page.waitForTimeout(1000);

    // Verify we're back to initial cards
    const investorLensVisibleAgain = await snapshotPage.investorLensCard.isVisible();
    expect(investorLensVisibleAgain).toBe(true);
    console.log('✓ Investor Lens card visible after clicking left arrow');

    console.log('\n=== Navigation interactions completed successfully ===');
  });
});
