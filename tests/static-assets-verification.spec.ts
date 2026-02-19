import { test, expect } from '@playwright/test';
import { LoginPage, DashboardPage, HealthMonitorPage } from '../pom/pages';

test.describe('Static Assets Integrity and Loading Verification - Unauthenticated', () => {
  test.use({ storageState: { cookies: [], origins: [] } });

  test('should load all static assets on login page @smoke', async ({ page }) => {
    const failedResources: string[] = [];

    page.on('response', response => {
      const url = response.url();
      const status = response.status();
      
      if (status >= 400 && (
        url.includes('.png') || 
        url.includes('.jpg') || 
        url.includes('.jpeg') || 
        url.includes('.svg') || 
        url.includes('.woff') || 
        url.includes('.woff2') || 
        url.includes('.ttf') || 
        url.includes('.ico')
      )) {
        failedResources.push(`${url} (${status})`);
      }
    });

    const loginPage = new LoginPage(page);
    await loginPage.open();
    await loginPage.isReady();

    expect(failedResources, `Failed to load ${failedResources.length} static assets: ${failedResources.join(', ')}`).toHaveLength(0);
  });
});

test.describe('Static Assets Integrity and Loading Verification - Authenticated', () => {

  test('should load all static assets on dashboard page @smoke', async ({ page }) => {
    const failedResources: string[] = [];

    page.on('response', response => {
      const url = response.url();
      const status = response.status();
      
      if (status >= 400 && (
        url.includes('.png') || 
        url.includes('.jpg') || 
        url.includes('.jpeg') || 
        url.includes('.svg') || 
        url.includes('.woff') || 
        url.includes('.woff2') || 
        url.includes('.ttf') || 
        url.includes('.ico')
      )) {
        failedResources.push(`${url} (${status})`);
      }
    });

    const dashboardPage = new DashboardPage(page);
    await dashboardPage.open();
    await dashboardPage.isReady();

    expect(failedResources, `Failed to load ${failedResources.length} static assets: ${failedResources.join(', ')}`).toHaveLength(0);
  });

  test('should load all static assets on health monitor page @smoke', async ({ page }) => {
    const failedResources: string[] = [];

    page.on('response', response => {
      const url = response.url();
      const status = response.status();
      
      if (status >= 400 && (
        url.includes('.png') || 
        url.includes('.jpg') || 
        url.includes('.jpeg') || 
        url.includes('.svg') || 
        url.includes('.woff') || 
        url.includes('.woff2') || 
        url.includes('.ttf') || 
        url.includes('.ico')
      )) {
        failedResources.push(`${url} (${status})`);
      }
    });

    const healthMonitorPage = new HealthMonitorPage(page);
    await healthMonitorPage.open();
    await healthMonitorPage.isReady();

    expect(failedResources, `Failed to load ${failedResources.length} static assets: ${failedResources.join(', ')}`).toHaveLength(0);
  });
});
