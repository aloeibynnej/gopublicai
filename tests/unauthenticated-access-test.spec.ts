import { test, expect } from '@playwright/test';
import { LoginPage } from '../pom/pages';
import { BASE_URL } from '../pom/constants';

const protectedRoutes = [
  { path: '/', name: 'Snapshot' },
  // { path: '/health-monitor', name: 'Health Monitor' }, // BUILD-1359
];

test.describe.skip('unauthenticated user redirection (auth guard) @desktop', () => {
  test.use({ storageState: { cookies: [], origins: [] } });

  protectedRoutes.forEach(({ path, name }) => {
    test(`should redirect to login page when accessing ${name} route without authentication`, async ({
      page,
    }) => {
      const loginPage = new LoginPage(page);

      await page.goto(`${BASE_URL}${path}`, { waitUntil: 'domcontentloaded' });

      await page.waitForURL(/.*\/login.*/, { timeout: 15000 });

      const currentUrl = page.url();
      expect(currentUrl).toContain('/login');

      await loginPage.isReady();
    });
  });
});

test.describe.skip('unauthenticated user redirection (auth guard) @mobile', () => {
  test.use({ storageState: { cookies: [], origins: [] } });

  protectedRoutes.forEach(({ path, name }) => {
    test(`should redirect to login page when accessing ${name} route without authentication`, async ({
      page,
    }) => {
      const loginPage = new LoginPage(page);

      await page.goto(`${BASE_URL}${path}`, { waitUntil: 'domcontentloaded' });

      await page.waitForURL(/.*\/login.*/, { timeout: 15000 });

      const currentUrl = page.url();
      expect(currentUrl).toContain('/login');

      await loginPage.isReady();
    });
  });
});
