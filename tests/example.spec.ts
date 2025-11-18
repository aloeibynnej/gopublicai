import { test, expect } from '@playwright/test';
import { DashboardPage } from '../pom/pages/dashboard.page';

test('dashboard is accessible for logged in user', async ({ page }) => {
  const dashboardPage = new DashboardPage(page);

  await dashboardPage.open();
  await dashboardPage.isReady();

  await expect(page.locator('#main-content')).toBeVisible();
});
