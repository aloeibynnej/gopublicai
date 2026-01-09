import { test, expect } from '@playwright/test';
import { SnapshotDesktopPage } from '../pom/pages';

// WIP: Test blocked by bug BUILD-1333
// Bug: MARKETS section tabs show no data when clicked
// https://teamgopublic.atlassian.net/browse/BUILD-1333
// The tabs (US, GLOBAL, MACRO) render but no market index data loads below the headers

test.describe('Snapshot Markets - Index Data Display', () => {
  test.setTimeout(60_000);

  test.skip('should display market indices for US, GLOBAL, and MACRO tabs @desktop', async ({ page }) => {
    const snapshotPage = new SnapshotDesktopPage(page);
    
    console.log('\n=== Testing MARKETS section index data ===');

    await snapshotPage.open();
    await snapshotPage.isReady();
    console.log('✓ Navigated to snapshot page');

    // Wait for page to load and scroll to markets section
    await page.waitForTimeout(3000);
    
    // Ensure markets section is visible
    const marketsVisible = await snapshotPage.isMarketsHeadingVisible();
    expect(marketsVisible).toBe(true);
    console.log('✓ MARKETS section visible');

    // ===== US TAB INDICES =====
    console.log('\n=== Testing US Market Indices ===');
    
    await snapshotPage.clickUsTab();
    console.log('✓ Clicked US tab');
    await page.waitForTimeout(2000);
    
    const usIndicesVisible = await snapshotPage.verifyUsMarketIndices();
    expect(usIndicesVisible).toBe(true);
    console.log('✓ US market indices displayed:');
    console.log('  - S&P 500');
    console.log('  - NASDAQ 100');
    console.log('  - RUSSELL 2000');
    console.log('  - DOW');

    // ===== GLOBAL TAB INDICES =====
    console.log('\n=== Testing GLOBAL Market Indices ===');
    
    await snapshotPage.clickGlobalTab();
    console.log('✓ Clicked GLOBAL tab');
    
    const globalIndicesVisible = await snapshotPage.verifyGlobalMarketIndices();
    expect(globalIndicesVisible).toBe(true);
    console.log('✓ Global market indices displayed:');
    console.log('  - NIKKEI 225');
    console.log('  - SHANGHAI');
    console.log('  - HANG SENG');
    console.log('  - FTSE 100');
    console.log('  - EUROSTOXX50');

    // ===== MACRO TAB INDICES =====
    console.log('\n=== Testing MACRO Indices ===');
    
    await snapshotPage.clickMacroTab();
    console.log('✓ Clicked MACRO tab');
    
    const macroIndicesVisible = await snapshotPage.verifyMacroIndices();
    expect(macroIndicesVisible).toBe(true);
    console.log('✓ Macro indices displayed:');
    console.log('  - OIL');
    console.log('  - GOLD');
    console.log('  - BITCOIN');
    console.log('  - USD/YEN');

    // ===== VERIFY TIMESTAMP =====
    console.log('\n=== Testing Timestamp Display ===');
    
    const timestampVisible = await snapshotPage.verifyJustNowTimestamp();
    expect(timestampVisible).toBe(true);
    console.log('✓ Timestamp displayed (JUST NOW or < X MIN AGO)');

    console.log('\n=== All market indices verified successfully ===');
  });
});
