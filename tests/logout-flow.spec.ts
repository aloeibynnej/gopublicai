import { test, expect } from '@playwright/test';
import { OAuthLoginPage, SnapshotDesktopPage } from '../pom/pages';
import { PASSWORD, USERNAME } from 'pom/constants';

test.describe('Logout Flow', () => {
  test.setTimeout(60_000);
  test.use({ storageState: { cookies: [], origins: [] } });

  test('should logout successfully from sidebar navigation @desktop', async ({ page }) => {
    const loginPage = new OAuthLoginPage(page);
    const snapshotPage = new SnapshotDesktopPage(page);

    await loginPage.open();
    await loginPage.isReady();

    // We use different user to logout to avoid issues with session
    await loginPage.login(USERNAME, PASSWORD);

    // Wait for redirect to snapshot page after successful login
    await page.waitForURL(url => !url.toString().includes('/login'), { timeout: 30000 });

    await snapshotPage.isReady();

    const cookiesBeforeLogout = await page.context().cookies();
    const sessionCookieBeforeLogout = cookiesBeforeLogout.find(
      c => c.name === '__Secure-authjs.session-token'
    );
    expect(sessionCookieBeforeLogout).toBeDefined();

    await page.waitForLoadState('load');

    await snapshotPage.mainMenu.clickLogo();
    await snapshotPage.mainMenu.logout();

    // After logout, verify redirect to login page
    await page.waitForURL(url => url.toString().includes('/login'), { timeout: 10000 });
    await expect(page.getByRole('heading', { name: /Welcome to Public\.ai/i })).toBeVisible();
  });
});
