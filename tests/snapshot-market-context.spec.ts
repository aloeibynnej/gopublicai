import { test, expect } from '@playwright/test';
import { SnapshotPage } from '../pom/pages/snapshot.page';

test.describe('Snapshot Market Context Chart', () => {
  test.setTimeout(60_000);

  test('should display Market Context chart with stock price, USD, and Past month @desktop', async ({ page }) => {
    const snapshotPage = new SnapshotPage(page);
    
    console.log('\n=== Testing Market Context chart on snapshot page ===');

    await snapshotPage.open();
    console.log('✓ Navigated to snapshot page');

    console.log('\n=== Verifying Market Context chart loads ===');
    
    const marketContextVisible = await snapshotPage.isMarketContextHeadingVisible();
    expect(marketContextVisible).toBe(true);
    console.log('✓ MARKET CONTEXT heading is visible');

    const stockPriceVisible = await snapshotPage.isStockPriceVisible();
    expect(stockPriceVisible).toBe(true);
    
    const stockPriceValue = await snapshotPage.getStockPriceValue();
    console.log(`✓ Stock price is visible: ${stockPriceValue}`);
    expect(stockPriceValue).not.toBeNull();
    expect(stockPriceValue?.length).toBeGreaterThan(0);

    const usdVisible = await snapshotPage.isUsdLabelVisible();
    expect(usdVisible).toBe(true);
    console.log('✓ USD label is visible');

    const pastMonthVisible = await snapshotPage.isPastMonthLabelVisible();
    expect(pastMonthVisible).toBe(true);
    console.log('✓ "Past month" label is visible (default time period)');

    console.log('\n=== Verifying all chart elements together ===');
    
    const chartLoads = await snapshotPage.verifyMarketContextChartLoads();
    expect(chartLoads).toBe(true);
    console.log('✓ Market Context chart loaded successfully with all required elements');

    console.log('\n=== Market Context chart test completed successfully ===');
  });
});
