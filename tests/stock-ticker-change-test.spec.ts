import { test, expect } from '@playwright/test';
import { SnapshotDesktopPage, SnapshotMobilePage } from '../pom/pages';

test.describe('stock ticker change module @desktop', () => {
  test.setTimeout(60_000);

  test('should render ticker switcher on Snapshot page', async ({ page }) => {
    const snapshotPage = new SnapshotDesktopPage(page);
    await snapshotPage.open();
    await snapshotPage.isReady();
    await snapshotPage.mainMenu.clickTickerSwitcher();

    const ticketSwitcherComponent = snapshotPage.mainMenu.tickerSwitcher;

    await expect(ticketSwitcherComponent.isVisible()).toBeTruthy();
  });

  test('should allow user to interact with ticker switcher', async ({ page }) => {
    const snapshotPage = new SnapshotDesktopPage(page);
    await snapshotPage.open();
    await snapshotPage.isReady();
    const ticketSwitcherComponent = snapshotPage.mainMenu.tickerSwitcher;

    await snapshotPage.mainMenu.waitForComponent();
    await snapshotPage.mainMenu.clickTickerSwitcher();
    await ticketSwitcherComponent.searchTicker('PLTR');
    await expect(page.getByText('Changing Company...')).toBeVisible();
    await snapshotPage.isReady();
    expect(await snapshotPage.isCompanyNameVisible()).toBeTruthy();

    await snapshotPage.mainMenu.waitForComponent();
    await snapshotPage.mainMenu.clickTickerSwitcher();
    await ticketSwitcherComponent.searchTicker('NVDA');
    await expect(page.getByText('Changing Company...')).toBeVisible();
    await snapshotPage.isReady();
    expect(await snapshotPage.isCompanyNameVisible()).toBeTruthy();

    await snapshotPage.mainMenu.waitForComponent();
    await snapshotPage.mainMenu.clickTickerSwitcher();
    await ticketSwitcherComponent.searchTicker('TSLA');
    await expect(page.getByText('Changing Company...')).toBeVisible();
    await snapshotPage.isReady();
    expect(await snapshotPage.isCompanyNameVisible()).toBeTruthy();
  });
});

test.describe('stock ticker change module @mobile', () => {
  test.setTimeout(60_000);

  test('should render ticker switcher on Snapshot page @mobile', async ({ page }) => {
    const snapshotPage = new SnapshotMobilePage(page);
    await snapshotPage.open();
    await snapshotPage.isReady();
    await snapshotPage.clickMenuButton();

    const mainMenuComponent = snapshotPage.mainMenu;
    await mainMenuComponent.clickTickerSwitcherMobile();
    const ticketSwitcherComponent = mainMenuComponent.tickerSwitcher;

    await expect(ticketSwitcherComponent.isVisible()).toBeTruthy();
  });

  test('should allow user to interact with ticker switcher @mobile', async ({ page }) => {
    const snapshotPage = new SnapshotMobilePage(page);
    await snapshotPage.open();
    await snapshotPage.isReady();
    const ticketSwitcherComponent = snapshotPage.mainMenu.tickerSwitcher;

    await snapshotPage.clickMenuButton();
    await snapshotPage.mainMenu.clickTickerSwitcherMobile();
    await ticketSwitcherComponent.searchTicker('PLTR');
    await expect(page.getByText('Changing Company...')).toBeVisible();
    await snapshotPage.isReady();
    expect(await snapshotPage.companyName.isVisible()).toBeTruthy();
    await page.waitForTimeout(2000);

    await snapshotPage.clickMenuButton();
    await snapshotPage.mainMenu.clickTickerSwitcherMobile();
    await ticketSwitcherComponent.searchTicker('NVDA');
    await expect(page.getByText('Changing Company...')).toBeVisible();
    await snapshotPage.isReady();
    expect(await snapshotPage.companyName.isVisible()).toBeTruthy();
    await page.waitForTimeout(2000);

    await snapshotPage.clickMenuButton();
    await snapshotPage.mainMenu.clickTickerSwitcherMobile();
    await ticketSwitcherComponent.searchTicker('TSLA');
    await expect(page.getByText('Changing Company...')).toBeVisible();
    await snapshotPage.isReady();
    expect(await snapshotPage.companyName.isVisible()).toBeTruthy();
  });
});
