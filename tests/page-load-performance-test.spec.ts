import { test, expect } from '@playwright/test';
import {
  LoginPage,
  SnapshotDesktopPage,
  SnapshotMobilePage,
  HealthMonitorDesktopPage,
  HealthMonitorMobilePage,
} from '../pom/pages';

test.describe('page load performance - login page @desktop', () => {
  test.use({ storageState: { cookies: [], origins: [] } });
  const MAX_LOAD_TIME_MS = 30000;

  test('should load login page with all critical elements within 30 seconds', async ({ page }) => {
    const loginPage = new LoginPage(page);
    const startTime = Date.now();

    await loginPage.open();
    await loginPage.isReady();

    const loadTime = Date.now() - startTime;

    expect(loadTime).toBeLessThan(MAX_LOAD_TIME_MS);
  });
});

test.describe('page load performance - authenticated pages @desktop', () => {
  const MAX_LOAD_TIME_MS = 30000;

  test('should load snapshot page with all critical elements within 30 seconds', async ({
    page,
  }) => {
    const snapshotPage = new SnapshotDesktopPage(page);
    const startTime = Date.now();

    await snapshotPage.open();
    await snapshotPage.isReady();

    const loadTime = Date.now() - startTime;

    expect(loadTime).toBeLessThan(MAX_LOAD_TIME_MS);
  });

  test('should load health monitor page with all critical elements within 30 seconds', async ({
    page,
  }) => {
    const healthMonitorPage = new HealthMonitorDesktopPage(page);
    const startTime = Date.now();

    await healthMonitorPage.open();
    await healthMonitorPage.isReady();

    const loadTime = Date.now() - startTime;

    expect(loadTime).toBeLessThan(MAX_LOAD_TIME_MS);
  });

  test('should verify no loading spinners remain after page load', async ({ page }) => {
    const snapshotPage = new SnapshotDesktopPage(page);

    await snapshotPage.open();
    await snapshotPage.isReady();

    const loadingSpinners = page.locator(
      '[data-testid*="loading"], [class*="loading"], [class*="spinner"]'
    );
    const spinnerCount = await loadingSpinners.count();

    if (spinnerCount > 0) {
      await expect(loadingSpinners.first()).toBeHidden({ timeout: MAX_LOAD_TIME_MS });
    }
  });
});

test.describe('page load performance - login page @mobile', () => {
  test.use({ storageState: { cookies: [], origins: [] } });
  const MAX_LOAD_TIME_MS = 30000;

  test('should load login page with all critical elements within 30 seconds', async ({ page }) => {
    const loginPage = new LoginPage(page);
    const startTime = Date.now();

    await loginPage.open();
    await loginPage.isReady();

    const loadTime = Date.now() - startTime;

    expect(loadTime).toBeLessThan(MAX_LOAD_TIME_MS);
  });
});

test.describe('page load performance - authenticated pages @mobile', () => {
  const MAX_LOAD_TIME_MS = 30000;

  test('should load snapshot page with all critical elements within 30 seconds', async ({
    page,
  }) => {
    const snapshotMobilePage = new SnapshotMobilePage(page);
    const startTime = Date.now();

    await snapshotMobilePage.open();
    await snapshotMobilePage.isReady();

    const loadTime = Date.now() - startTime;

    expect(loadTime).toBeLessThan(MAX_LOAD_TIME_MS);
  });

  test('should load health monitor page with all critical elements within 30 seconds', async ({
    page,
  }) => {
    const healthMonitorMobilePage = new HealthMonitorMobilePage(page);
    const startTime = Date.now();

    await healthMonitorMobilePage.open();
    await healthMonitorMobilePage.isReady();

    const loadTime = Date.now() - startTime;

    expect(loadTime).toBeLessThan(MAX_LOAD_TIME_MS);
  });

  test('should verify no loading spinners remain after page load', async ({ page }) => {
    const snapshotMobilePage = new SnapshotMobilePage(page);

    await snapshotMobilePage.open();
    await snapshotMobilePage.isReady();

    const loadingSpinners = page.locator(
      '[data-testid*="loading"], [class*="loading"], [class*="spinner"]'
    );
    const spinnerCount = await loadingSpinners.count();

    if (spinnerCount > 0) {
      await expect(loadingSpinners.first()).toBeHidden({ timeout: MAX_LOAD_TIME_MS });
    }
  });
});
