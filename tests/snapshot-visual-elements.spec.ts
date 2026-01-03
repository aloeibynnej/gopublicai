import { test, expect } from '@playwright/test';
import { SnapshotPage } from '../pom/pages/snapshot.page';

test.describe('Snapshot Page - Visual Elements', () => {
  test.setTimeout(60_000);

  test('should display all visual elements on page load @desktop', async ({ page }) => {
    const snapshotPage = new SnapshotPage(page);
    
    console.log('\n=== Testing snapshot page visual elements ===');

    await snapshotPage.open();
    console.log('✓ Navigated to snapshot page');

    // ===== STOCK HEADER =====
    console.log('\n=== Verifying Stock Header ===');
    
    const tickerVisible = await snapshotPage.isStockTickerVisible();
    expect(tickerVisible).toBe(true);
    const tickerValue = await snapshotPage.getStockTickerValue();
    console.log(`✓ Stock ticker: ${tickerValue}`);
    expect(tickerValue).toMatch(/^[A-Z]{1,5}$/);

    const companyVisible = await snapshotPage.isCompanyNameVisible();
    expect(companyVisible).toBe(true);
    const companyName = await snapshotPage.getCompanyNameValue();
    console.log(`✓ Company name: ${companyName}`);

    // ===== MARKET CONTEXT CHART =====
    console.log('\n=== Verifying Market Context Chart ===');
    
    const marketContextVisible = await snapshotPage.isMarketContextHeadingVisible();
    expect(marketContextVisible).toBe(true);
    console.log('✓ MARKET CONTEXT heading visible');

    const stockPriceVisible = await snapshotPage.isStockPriceVisible();
    expect(stockPriceVisible).toBe(true);
    const stockPriceValue = await snapshotPage.getStockPriceValue();
    console.log(`✓ Stock price: ${stockPriceValue}`);

    const usdVisible = await snapshotPage.isUsdLabelVisible();
    expect(usdVisible).toBe(true);
    console.log('✓ USD label visible');

    const pastMonthVisible = await snapshotPage.isPastMonthLabelVisible();
    expect(pastMonthVisible).toBe(true);
    console.log('✓ Past month label visible (default time period)');

    // ===== ANALYSIS CARDS =====
    console.log('\n=== Verifying Analysis Cards ===');
    
    const investorLensVisible = await snapshotPage.investorLensCard.isVisible();
    expect(investorLensVisible).toBe(true);
    console.log('✓ Investor Lens card visible');

    const peerAnalysisVisible = await snapshotPage.peerAnalysisCard.isVisible();
    expect(peerAnalysisVisible).toBe(true);
    console.log('✓ Peer Analysis card visible');

    const sectorAnalysisVisible = await snapshotPage.sectorAnalysisCard.isVisible();
    expect(sectorAnalysisVisible).toBe(true);
    console.log('✓ Sector Analysis card visible');

    const stockTechnicalsVisible = await snapshotPage.stockTechnicalsCard.isVisible();
    expect(stockTechnicalsVisible).toBe(true);
    console.log('✓ Stock Technicals card visible');

    // ===== CAROUSEL NAVIGATION =====
    console.log('\n=== Verifying Carousel Navigation ===');
    
    const leftArrowVisible = await snapshotPage.leftArrowButton.isVisible();
    expect(leftArrowVisible).toBe(true);
    console.log('✓ Left arrow button visible');

    const rightArrowVisible = await snapshotPage.rightArrowButton.isVisible();
    expect(rightArrowVisible).toBe(true);
    console.log('✓ Right arrow button visible');

    // ===== RIGHT SIDE NAVIGATION =====
    console.log('\n=== Verifying Right Side Navigation ===');
    
    const marketsVisible = await snapshotPage.isMarketsHeadingVisible();
    expect(marketsVisible).toBe(true);
    console.log('✓ MARKETS section visible');

    const peerComparisonVisible = await snapshotPage.isPeerComparisonHeadingVisible();
    expect(peerComparisonVisible).toBe(true);
    console.log('✓ VS PEERS section visible');

    // ===== YOUR PEERS SECTION =====
    console.log('\n=== Verifying YOUR PEERS Section ===');
    
    const yourPeersVisible = await snapshotPage.isYourPeersHeadingVisible();
    expect(yourPeersVisible).toBe(true);
    console.log('✓ YOUR PEERS heading visible');

    const newsItemCount = await snapshotPage.getPeerNewsItems();
    console.log(`✓ Found ${newsItemCount} peer news items`);
    expect(newsItemCount).toBeGreaterThan(0);

    console.log('\n=== All visual elements validated successfully ===');
  });
});
