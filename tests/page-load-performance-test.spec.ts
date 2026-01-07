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

    const loadTime = Date.now() - startTime;

    expect(loadTime).toBeLessThan(MAX_LOAD_TIME_MS);
    console.log(`Login page loaded in ${loadTime}ms`);
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

    const loadTime = Date.now() - startTime;

    expect(loadTime).toBeLessThan(MAX_LOAD_TIME_MS);
    console.log(`Snapshot page loaded in ${loadTime}ms`);
  });

  test('should load health monitor page with all critical elements within 30 seconds', async ({
    page,
  }) => {
    const healthMonitorPage = new HealthMonitorDesktopPage(page);
    const startTime = Date.now();

    await healthMonitorPage.open();

    const loadTime = Date.now() - startTime;

    expect(loadTime).toBeLessThan(MAX_LOAD_TIME_MS);
    console.log(`Health Monitor page loaded in ${loadTime}ms`);
  });

  test('should verify no loading spinners remain after page load', async ({ page }) => {
    const snapshotPage = new SnapshotDesktopPage(page);

    await snapshotPage.open();

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

    const loadTime = Date.now() - startTime;

    expect(loadTime).toBeLessThan(MAX_LOAD_TIME_MS);
    console.log(`Login page loaded in ${loadTime}ms (mobile)`);
  });
});

test.describe('page load performance - authenticated pages @mobile', () => {
  const MAX_LOAD_TIME_MS = 30000;

  test('should load snapshot page with all critical elements within 30 seconds', async ({
    page,
  }) => {
    const snapshotPage = new SnapshotMobilePage(page);
    const startTime = Date.now();

    await snapshotPage.open();

    const loadTime = Date.now() - startTime;

    expect(loadTime).toBeLessThan(MAX_LOAD_TIME_MS);
    console.log(`Snapshot page loaded in ${loadTime}ms (mobile)`);
  });

  test('should load health monitor page with all critical elements within 30 seconds', async ({
    page,
  }) => {
    const healthMonitorPage = new HealthMonitorMobilePage(page);
    const startTime = Date.now();

    await healthMonitorPage.open();

    const loadTime = Date.now() - startTime;

    expect(loadTime).toBeLessThan(MAX_LOAD_TIME_MS);
    console.log(`Health Monitor page loaded in ${loadTime}ms (mobile)`);
  });

  test('should verify no loading spinners remain after page load', async ({ page }) => {
    const snapshotPage = new SnapshotMobilePage(page);

    await snapshotPage.open();

    const loadingSpinners = page.locator(
      '[data-testid*="loading"], [class*="loading"], [class*="spinner"]'
    );
    const spinnerCount = await loadingSpinners.count();

    if (spinnerCount > 0) {
      await expect(loadingSpinners.first()).toBeHidden({ timeout: MAX_LOAD_TIME_MS });
    }
  });
});
