import { test, expect } from '@playwright/test';
import { SnapshotDesktopPage, SnapshotMobilePage } from '../pom/pages';

test.describe('stock ticker change module @desktop', () => {
  test('should render ticker switcher on Snapshot page', async ({ page }) => {
    const snapshotPage = new SnapshotDesktopPage(page);
    await snapshotPage.open();
    await snapshotPage.mainMenu.clickTickerSwitcher();

    const ticketSwitcherComponent = snapshotPage.mainMenu.tickerSwitcher;

    await expect(ticketSwitcherComponent.isVisible()).toBeTruthy();
  });

  test('should allow user to interact with ticker switcher', async ({ page }) => {
    const snapshotPage = new SnapshotDesktopPage(page);
    await snapshotPage.open();
    
    const ticketSwitcherComponent = snapshotPage.mainMenu.tickerSwitcher;

    // Test first ticker change: PLTR
    await snapshotPage.mainMenu.clickTickerSwitcher();
    await ticketSwitcherComponent.searchTicker('PLTR');
    await expect(page.getByText('Changing Company...')).toBeVisible();
    await snapshotPage.isReady();
    expect(await snapshotPage.isCompanyNameVisible()).toBeTruthy();
    await page.waitForTimeout(2000); // Wait for page to stabilize

    // Test second ticker change: NVDA
    await snapshotPage.mainMenu.clickTickerSwitcher();
    await ticketSwitcherComponent.searchTicker('NVDA');
    await expect(page.getByText('Changing Company...')).toBeVisible();
    await snapshotPage.isReady();
    expect(await snapshotPage.isCompanyNameVisible()).toBeTruthy();
    await page.waitForTimeout(2000); // Wait for page to stabilize

    // Test third ticker change: TSLA
    await snapshotPage.mainMenu.clickTickerSwitcher();
    await ticketSwitcherComponent.searchTicker('TSLA');
    await expect(page.getByText('Changing Company...')).toBeVisible();
    await snapshotPage.isReady();
    expect(await snapshotPage.isCompanyNameVisible()).toBeTruthy();
  });
});

test.describe('stock ticker change module @mobile', () => {
  test('should render ticker switcher on Snapshot page @mobile', async ({ page }) => {
    const snapshotPage = new SnapshotMobilePage(page);
    await snapshotPage.open();

    await snapshotPage.clickMenuButton();

    const mainMenuComponent = snapshotPage.mainMenu;
    await mainMenuComponent.clickTickerSwitcherMobile();
    const ticketSwitcherComponent = mainMenuComponent.tickerSwitcher;

    await expect(ticketSwitcherComponent.isVisible()).toBeTruthy();
  });

  test('should allow user to interact with ticker switcher @mobile', async ({ page }) => {
    const snapshotPage = new SnapshotMobilePage(page);
    await snapshotPage.open();
    
    const ticketSwitcherComponent = snapshotPage.mainMenu.tickerSwitcher;

    // Test first ticker change: PLTR
    await snapshotPage.clickMenuButton();
    await snapshotPage.mainMenu.clickTickerSwitcherMobile();
    await ticketSwitcherComponent.searchTicker('PLTR');
    await expect(page.getByText('Changing Company...')).toBeVisible();
    await snapshotPage.isReady();
    expect(await snapshotPage.companyName.isVisible()).toBeTruthy();
    await page.waitForTimeout(2000); // Wait for page to stabilize

    // Test second ticker change: NVDA
    await snapshotPage.clickMenuButton();
    await snapshotPage.mainMenu.clickTickerSwitcherMobile();
    await ticketSwitcherComponent.searchTicker('NVDA');
    await expect(page.getByText('Changing Company...')).toBeVisible();
    await snapshotPage.isReady();
    expect(await snapshotPage.companyName.isVisible()).toBeTruthy();
    await page.waitForTimeout(2000); // Wait for page to stabilize

    // Test third ticker change: TSLA
    await snapshotPage.clickMenuButton();
    await snapshotPage.mainMenu.clickTickerSwitcherMobile();
    await ticketSwitcherComponent.searchTicker('TSLA');
    await expect(page.getByText('Changing Company...')).toBeVisible();
    await snapshotPage.isReady();
    expect(await snapshotPage.companyName.isVisible()).toBeTruthy();
  });
});
