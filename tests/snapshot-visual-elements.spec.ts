import { test, expect } from '@playwright/test';
import { SnapshotDesktopPage } from '../pom/pages';

test.describe('Snapshot Page - Visual Elements', () => {
  test.setTimeout(60_000);

  test('should display all visual elements on page load @desktop', async ({ page }) => {
    const snapshotPage = new SnapshotDesktopPage(page);

    await snapshotPage.open();
    await snapshotPage.isReady();

    await page.waitForLoadState('load');

    const companyVisible = await snapshotPage.isCompanyNameVisible();
    expect(companyVisible).toBe(true);
    const companyName = await snapshotPage.getCompanyNameValue();

    const selectedTicker = await snapshotPage.mainMenu.tickerSwitcher.nameTicker();
    expect(selectedTicker).toContain(companyName);

    const investorLensVisible = await snapshotPage.investorLensCard.isVisible();
    expect(investorLensVisible).toBe(true);

    const peerAnalysisVisible = await snapshotPage.peerAnalysisCard.isVisible();
    expect(peerAnalysisVisible).toBe(true);

    const sectorAnalysisVisible = await snapshotPage.sectorAnalysisCard.isVisible();
    expect(sectorAnalysisVisible).toBe(true);

    const stockTechnicalsVisible = await snapshotPage.stockTechnicalsCard.isVisible();
    expect(stockTechnicalsVisible).toBe(true);

    const leftArrowVisible = await snapshotPage.leftArrowButton.isVisible();
    expect(leftArrowVisible).toBe(true);

    const rightArrowVisible = await snapshotPage.rightArrowButton.isVisible();
    expect(rightArrowVisible).toBe(true);

    const marketsVisible = await snapshotPage.isMarketsHeadingVisible();
    expect(marketsVisible).toBe(true);

    const peerComparisonVisible = await snapshotPage.isPeerComparisonHeadingVisible();
    expect(peerComparisonVisible).toBe(true);

    const yourPeersVisible = await snapshotPage.isYourPeersHeadingVisible();
    expect(yourPeersVisible).toBe(true);

    const newsItemCount = await snapshotPage.getPeerNewsItems();
    expect(newsItemCount).toBeGreaterThan(0);

    // LOAD PREVIOUS NEWS button is conditionally shown (when more news is available)
    // Skip assertion - not always visible on initial page load

    const chatVisible = await snapshotPage.chatComponent.isChatInputEnabled();
    expect(chatVisible).toBe(true);
  });
});
