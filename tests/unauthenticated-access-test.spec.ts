import { test, expect } from '@playwright/test';
import {
  LoginPage,
  HealthMonitorDesktopPage,
  LogoutPage,
  SnapshotDesktopPage,
  HealthMonitorMobilePage,
  SnapshotMobilePage,
} from '../pom/pages';
import { BASE_URL } from '../pom/constants';

const protectedRoutes = [
  { path: '/', name: 'Snapshot' },
  // { path: '/health-monitor', name: 'Health Monitor' }, // BUILD-1359
];

test.describe('Unauthenticated user redirection (auth guard) @desktop', () => {
  test.use({ storageState: { cookies: [], origins: [] } });

  test('Unauthenticated Health Monitor Access', async ({ page }) => {
    const healthMonitorDesktopPage = new HealthMonitorDesktopPage(page);
    const logoutPage = new LogoutPage(page);

    await healthMonitorDesktopPage.open();
    await logoutPage.isReady();

    const heading = await logoutPage.getHeading();
    await expect(heading).toBeTruthy();
  });

  test('Unauthenticated Snapshot Access', async ({ page }) => {
    const snapshotDesktopPage = new SnapshotDesktopPage(page);
    const logoutPage = new LogoutPage(page);

    await snapshotDesktopPage.open();
    await page.waitForLoadState('networkidle');

    // main menu should not be visible
    const mainMenu = snapshotDesktopPage.mainMenu;
    const isMainMenuVisible = await mainMenu.isVisible();
    await expect(isMainMenuVisible).toBeFalsy();
  });
});

test.describe('Unauthenticated user redirection (auth guard) @mobile', () => {
  test.use({ storageState: { cookies: [], origins: [] } });

  test('Unauthenticated Health Monitor Access', async ({ page }) => {
    const healthMonitorMobilePage = new HealthMonitorMobilePage(page);
    const logoutPage = new LogoutPage(page);

    await healthMonitorMobilePage.open();
    await logoutPage.isReady();

    const heading = await logoutPage.getHeading();
    await expect(heading).toBeTruthy();
  });

  test('Unauthenticated Snapshot Access', async ({ page }) => {
    const snapshotMobilePage = new SnapshotMobilePage(page);
    const logoutPage = new LogoutPage(page);

    await snapshotMobilePage.open();
    await page.waitForLoadState('networkidle');

    // main menu should not be visible
    const mainMenu = snapshotMobilePage.mainMenu;
    const isMainMenuVisible = await mainMenu.isVisible();
    await expect(isMainMenuVisible).toBeFalsy();
  });
});
