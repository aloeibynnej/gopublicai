import { test, expect } from '@playwright/test';
import { SnapshotDesktopPage } from '../pom/pages';

test.describe('Snapshot Page - Interactions', () => {
  test.setTimeout(90_000);

  test('should handle navigation interactions @desktop', async ({ page }) => {
    const snapshotDesktopPage = new SnapshotDesktopPage(page);

    await snapshotDesktopPage.open();
    await snapshotDesktopPage.isReady();

    await snapshotDesktopPage.clickUsTab();
    await snapshotDesktopPage.verifyUsMarketIndices();

    await snapshotDesktopPage.clickGlobalTab();
    await snapshotDesktopPage.verifyGlobalMarketIndices();

    await snapshotDesktopPage.clickMacroTab();
    await snapshotDesktopPage.verifyMacroIndices();

    await snapshotDesktopPage.clickRightArrow();

    const macroCardVisible = await snapshotDesktopPage.macroCard.isVisible();
    expect(macroCardVisible).toBe(true);

    await snapshotDesktopPage.clickLeftArrow();

    const investorLensVisibleAgain = await snapshotDesktopPage.investorLensCard.isVisible();
    expect(investorLensVisibleAgain).toBe(true);
  });
});
