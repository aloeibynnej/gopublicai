import { test, expect } from '@playwright/test';
import { SnapshotPage } from '../pom/pages/snapshot.page';

test.describe('Snapshot VS PEERS Section', () => {
  test.setTimeout(60_000);

  test('should display peer comparison data with dynamic peer companies @desktop', async ({ page }) => {
    const snapshotPage = new SnapshotPage(page);
    
    console.log('\n=== Testing VS PEERS section ===');

    await snapshotPage.open();
    await snapshotPage.isReady();
    console.log('✓ Navigated to snapshot page');

    // Wait for page to load
    await page.waitForTimeout(3000);

    // ===== VERIFY PEER COMPARISON HEADING =====
    console.log('\n=== Testing Peer Comparison Heading ===');
    
    const peerComparisonVisible = await snapshotPage.isPeerComparisonHeadingVisible();
    expect(peerComparisonVisible).toBe(true);
    console.log('✓ Peer comparison heading visible (e.g., "AAPL VS PEERS", "PLTR VS PEERS")');

    // ===== VERIFY USER'S STOCK TICKER DISPLAYS =====
    console.log('\n=== Testing User\'s Stock Ticker ===');
    
    // Get the heading text to extract the ticker
    const headingText = await page.locator('text=/[A-Z]{1,5}\\s+VS\\s+PEERS/i').first().textContent();
    expect(headingText).toBeTruthy();
    
    // Extract ticker from heading (e.g., "AAPL VS PEERS" -> "AAPL")
    const tickerMatch = headingText?.match(/^([A-Z]{1,5})\s+VS\s+PEERS/i);
    expect(tickerMatch).toBeTruthy();
    
    const userTicker = tickerMatch?.[1];
    expect(userTicker).toBeTruthy();
    console.log(`✓ User's stock ticker displayed: ${userTicker}`);

    // ===== VERIFY PEER COMPANIES DISPLAY =====
    console.log('\n=== Testing Peer Companies Data ===');
    
    // Check for peer info containers (each peer company has one)
    const peerContainers = page.locator('div.peers-info-container');
    const peerCount = await peerContainers.count();
    expect(peerCount).toBeGreaterThan(0);
    console.log(`✓ ${peerCount} peer companies displayed`);

    // ===== VERIFY DATA COLUMNS =====
    console.log('\n=== Testing Data Columns ===');
    
    // Check for MKT CAP column header
    const mktCapVisible = await page.locator('text=/MKT\\s+CAP/i').first().isVisible();
    expect(mktCapVisible).toBe(true);
    console.log('✓ MKT CAP column visible');

    // Check for %CHG column header
    const chgVisible = await page.locator('text=/%CHG/i').first().isVisible();
    expect(chgVisible).toBe(true);
    console.log('✓ %CHG column visible');

    // Check for %VOL column header
    const volVisible = await page.locator('text=/%VOL/i').first().isVisible();
    expect(volVisible).toBe(true);
    console.log('✓ %VOL column visible');

    // ===== VERIFY TIMESTAMP =====
    console.log('\n=== Testing Timestamp ===');
    
    const timestampVisible = await page.locator('text=/JUST NOW/i').first().isVisible();
    expect(timestampVisible).toBe(true);
    console.log('✓ Timestamp displayed (JUST NOW)');

    // ===== VERIFY AT LEAST ONE TICKER SYMBOL =====
    console.log('\n=== Testing Ticker Symbols ===');
    
    const tickerSymbols = page.locator('div.text.ticker.text-white');
    const tickerCount = await tickerSymbols.count();
    expect(tickerCount).toBeGreaterThan(0);
    console.log(`✓ ${tickerCount} ticker symbols displayed`);

    console.log('\n=== VS PEERS section verified successfully ===');
    console.log('Note: Peer companies are dynamic based on user\'s stock preference');
  });
});
