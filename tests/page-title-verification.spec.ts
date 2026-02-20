import { test, expect } from '@playwright/test';
import { LoginPage, DashboardPage, HealthMonitorPage } from '../pom/pages';

test.describe('Global Page Title Verification - Unauthenticated', () => {
  test.use({ storageState: { cookies: [], origins: [] } });

  test('should display correct page title on login page @smoke', async ({ page }) => {
    const loginPage = new LoginPage(page);
    await loginPage.open();
    await loginPage.isReady();

    const pageTitle = await page.title();
    expect(pageTitle).toBeTruthy();
    expect(pageTitle.length).toBeGreaterThan(0);
    expect(pageTitle).toBe('PublicAI');
  });
});

test.describe('Global Page Title Verification - Authenticated', () => {

  test('should display correct page title on dashboard/snapshot page @smoke', async ({ page }) => {
    const dashboardPage = new DashboardPage(page);
    await dashboardPage.open();
    await dashboardPage.isReady();

    const pageTitle = await page.title();
    expect(pageTitle).toBeTruthy();
    expect(pageTitle.length).toBeGreaterThan(0);
    expect(pageTitle).toBe('PublicAI');
  });

  test('should display correct page title on health monitor page @smoke', async ({ page }) => {
    const healthMonitorPage = new HealthMonitorPage(page);
    await healthMonitorPage.open();
    await healthMonitorPage.isReady();

    const pageTitle = await page.title();
    expect(pageTitle).toBeTruthy();
    expect(pageTitle.length).toBeGreaterThan(0);
    expect(pageTitle).toBe('PublicAI');
  });

  test('should have non-empty page title on all routes @smoke', async ({ page }) => {
    const dashboardPage = new DashboardPage(page);
    await dashboardPage.open();
    await dashboardPage.isReady();

    const dashboardTitle = await page.title();
    expect(dashboardTitle).toBeTruthy();
    expect(dashboardTitle.length).toBeGreaterThan(0);

    const healthMonitorPage = new HealthMonitorPage(page);
    await healthMonitorPage.open();
    await healthMonitorPage.isReady();

    const healthMonitorTitle = await page.title();
    expect(healthMonitorTitle).toBeTruthy();
    expect(healthMonitorTitle.length).toBeGreaterThan(0);
  });
});
