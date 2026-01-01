import { test, expect } from '@playwright/test';
import { SnapshotPage } from '../pom/pages/snapshot.page';

test.describe('Snapshot Right Side Navigation', () => {
  test.setTimeout(60_000);

  test('should display markets section with tabs and peer comparison @desktop', async ({ page }) => {
    const snapshotPage = new SnapshotPage(page);
    
    console.log('\n=== Testing right side navigation on snapshot page ===');

    await snapshotPage.open();
    console.log('✓ Navigated to snapshot page');

    console.log('\n=== Verifying Markets section ===');
    
    const marketsVisible = await snapshotPage.isMarketsHeadingVisible();
    expect(marketsVisible).toBe(true);
    console.log('✓ MARKETS heading is visible');

    const timestampVisible = await snapshotPage.verifyJustNowTimestamp();
    expect(timestampVisible).toBe(true);
    console.log('✓ Timestamp (JUST NOW or < X MIN AGO) is visible');

    console.log('\n=== Testing US tab (default active) ===');
    
    const usIndicesVisible = await snapshotPage.verifyUsMarketIndices();
    expect(usIndicesVisible).toBe(true);
    console.log('✓ US market indices visible: S&P 500, NASDAQ 100, RUSSELL 2000, DOW');

    console.log('\n=== Testing GLOBAL tab ===');
    
    await snapshotPage.clickGlobalTab();
    console.log('✓ Clicked GLOBAL tab');

    const globalIndicesVisible = await snapshotPage.verifyGlobalMarketIndices();
    expect(globalIndicesVisible).toBe(true);
    console.log('✓ GLOBAL market indices visible: NIKKEI 225, SHANGHAI, HANG SENG, FTSE 100, EUROSTOXX50');

    console.log('\n=== Testing MACRO tab ===');
    
    await snapshotPage.clickMacroTab();
    console.log('✓ Clicked MACRO tab');

    const macroIndicesVisible = await snapshotPage.verifyMacroIndices();
    expect(macroIndicesVisible).toBe(true);
    console.log('✓ MACRO indices visible: OIL, GOLD, BITCOIN, USD/YEN');

    console.log('\n=== Testing back to US tab ===');
    
    await snapshotPage.clickUsTab();
    console.log('✓ Clicked US tab');

    const usIndicesVisibleAgain = await snapshotPage.verifyUsMarketIndices();
    expect(usIndicesVisibleAgain).toBe(true);
    console.log('✓ US market indices visible again after switching back');

    console.log('\n=== Verifying Peer Comparison section ===');
    
    const peerComparisonVisible = await snapshotPage.isPeerComparisonHeadingVisible();
    expect(peerComparisonVisible).toBe(true);
    console.log('✓ Peer comparison heading visible (e.g., "AAPL VS PEERS")');

    const peerTimestampVisible = await snapshotPage.verifyJustNowTimestamp();
    expect(peerTimestampVisible).toBe(true);
    console.log('✓ Peer comparison timestamp visible');

    console.log('\n=== Right side navigation test completed successfully ===');
  });
});
