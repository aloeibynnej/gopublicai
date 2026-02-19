import { test, expect } from '@playwright/test';
import { SnapshotDesktopPage } from '../pom/pages';

test.describe('Snapshot VS PEERS Section', () => {
  test.setTimeout(60_000);

  test('should display peer comparison data with dynamic peer companies @desktop', async ({
    page,
  }) => {
    const snapshotPage = new SnapshotDesktopPage(page);

    await snapshotPage.open();
    await snapshotPage.isReady();

    // Wait for page to load
    await page.waitForLoadState('networkidle');

    // ===== VERIFY PEER COMPARISON HEADING =====

    const peerComparisonVisible = await snapshotPage.isPeerComparisonHeadingVisible();
    expect(peerComparisonVisible).toBe(true);

    // ===== VERIFY USER'S STOCK TICKER DISPLAYS =====

    // Get the heading text to extract the ticker
    const headingText = await page
      .locator('text=/[A-Z]{1,5}\\s+VS\\s+PEERS/i')
      .first()
      .textContent();
    expect(headingText).toBeTruthy();

    // Extract ticker from heading (e.g., "AAPL VS PEERS" -> "AAPL")
    const tickerMatch = headingText?.match(/^([A-Z]{1,5})\s+VS\s+PEERS/i);
    expect(tickerMatch).toBeTruthy();

    const userTicker = tickerMatch?.[1];
    expect(userTicker).toBeTruthy();

    // ===== VERIFY PEER COMPANIES DISPLAY =====

    // Check for peer info containers (each peer company has one)
    const peerContainers = page.locator('div.peers-info-container');
    const peerCount = await peerContainers.count();
    expect(peerCount).toBeGreaterThan(0);

    // ===== VERIFY DATA COLUMNS =====

    // Check for MKT CAP column header
    const mktCapVisible = await page.locator('text=/MKT\\s+CAP/i').first().isVisible();
    expect(mktCapVisible).toBe(true);

    // Check for %CHG column header
    const chgVisible = await page.locator('text=/%CHG/i').first().isVisible();
    expect(chgVisible).toBe(true);

    // Check for %VOL column header
    const volVisible = await page.locator('text=/%VOL/i').first().isVisible();
    expect(volVisible).toBe(true);

    // ===== VERIFY TIMESTAMP =====

    const timestampVisible = await page.locator('text=/JUST NOW/i').first().isVisible();
    expect(timestampVisible).toBe(true);

    // ===== VERIFY AT LEAST ONE TICKER SYMBOL =====

    const tickerSymbols = page.locator('div.text.ticker.text-white');
    const tickerCount = await tickerSymbols.count();
    expect(tickerCount).toBeGreaterThan(0);
  });
});
