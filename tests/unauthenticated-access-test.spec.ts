import { test, expect } from '@playwright/test';
import {
  HealthMonitorDesktopPage,
  SnapshotDesktopPage,
  HealthMonitorMobilePage,
  SnapshotMobilePage,
} from '../pom/pages';

test.describe('Unauthenticated user redirection (auth guard) @desktop', () => {
  test.use({ storageState: { cookies: [], origins: [] } });

  test('Unauthenticated Health Monitor Access', async ({ page }) => {
    const healthMonitorDesktopPage = new HealthMonitorDesktopPage(page);

    await healthMonitorDesktopPage.open();
    await page.waitForLoadState('load');

    // User should be redirected away from health-monitor; main menu (protected content) not visible
    const mainMenu = healthMonitorDesktopPage.mainMenu;
    const isMainMenuVisible = await mainMenu.isVisible();
    await expect(isMainMenuVisible).toBeFalsy();
  });

  test('Unauthenticated Snapshot Access', async ({ page }) => {
    const snapshotDesktopPage = new SnapshotDesktopPage(page);

    await snapshotDesktopPage.open();
    await page.waitForLoadState('load');

    // main menu should not be visible (user redirected to login or content hidden)
    const mainMenu = snapshotDesktopPage.mainMenu;
    const isMainMenuVisible = await mainMenu.isVisible();
    await expect(isMainMenuVisible).toBeFalsy();
  });
});

test.describe('Unauthenticated user redirection (auth guard) @mobile', () => {
  test.use({ storageState: { cookies: [], origins: [] } });

  test('Unauthenticated Health Monitor Access', async ({ page }) => {
    const healthMonitorMobilePage = new HealthMonitorMobilePage(page);

    await healthMonitorMobilePage.open();
    await page.waitForLoadState('load');

    // User should be redirected away from health-monitor; main menu (protected content) not visible
    const mainMenu = healthMonitorMobilePage.mainMenu;
    const isMainMenuVisible = await mainMenu.isVisible();
    await expect(isMainMenuVisible).toBeFalsy();
  });

  test('Unauthenticated Snapshot Access', async ({ page }) => {
    const snapshotMobilePage = new SnapshotMobilePage(page);

    await snapshotMobilePage.open();
    await page.waitForLoadState('load');

    // main menu should not be visible (user redirected to login or content hidden)
    const mainMenu = snapshotMobilePage.mainMenu;
    const isMainMenuVisible = await mainMenu.isVisible();
    await expect(isMainMenuVisible).toBeFalsy();
  });
});
