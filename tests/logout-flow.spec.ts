import { test, expect } from '@playwright/test';
import { LogoutPage as LogoutSuccessPage, OAuthLoginPage, SnapshotDesktopPage } from '../pom/pages';
import { PASSWORD } from 'pom/constants';

test.describe('Logout Flow', () => {
  test.setTimeout(60_000);
  test.use({ storageState: { cookies: [], origins: [] } });

  test('should logout successfully from sidebar navigation @desktop', async ({ page }) => {
    const loginPage = new OAuthLoginPage(page);
    const snapshotPage = new SnapshotDesktopPage(page);
    const logoutSuccessPage = new LogoutSuccessPage(page);

    await loginPage.open();
    await loginPage.isReady();

    // We use different user to logout to avoid issues with session
    await loginPage.login('michal+user@gopublic.ai', PASSWORD);

    await snapshotPage.isReady();

    const cookiesBeforeLogout = await page.context().cookies();
    const sessionCookieBeforeLogout = cookiesBeforeLogout.find(
      c => c.name === '__Secure-authjs.session-token'
    );
    expect(sessionCookieBeforeLogout).toBeDefined();

    await page.waitForLoadState('networkidle');

    await snapshotPage.mainMenu.clickHealthMonitor();
    await snapshotPage.mainMenu.logout();

    await logoutSuccessPage.isReady();

    await page.waitForLoadState('networkidle');

    const localStorageSize = await page.evaluate(() => localStorage.length);
    expect(localStorageSize).toBe(0);

    await page.waitForTimeout(3_000);

    const cookiesAfterLogout = await page.context().cookies();
    const sessionCookieAfterLogout = cookiesAfterLogout.find(
      c => c.name === '__Secure-authjs.session-token'
    );
    expect(sessionCookieAfterLogout).toBeUndefined();

    await page.goBack();
    await expect(page.getByRole('heading', { name: /Successfully Logged Out/i })).toBeVisible({
      timeout: 10000,
    });
  });
});
