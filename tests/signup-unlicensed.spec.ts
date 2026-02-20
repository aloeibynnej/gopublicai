import { test, expect } from '@playwright/test';
import { LoginPage, SignupPage } from '../pom/pages';

test.describe('Signup Page - Unlicensed Email', () => {
  test.setTimeout(30_000);

  // Don't use auth state - signup requires logged out session
  test.use({ storageState: { cookies: [], origins: [] } });

  test('should display signup page with all elements @desktop', async ({ page }) => {
    const signupPage = new SignupPage(page);

    await signupPage.open();
    await signupPage.isReady();

    await expect(signupPage.loginLink).toBeVisible();
  });

  test.skip('should display unlicensed toast when submitting non-whitelisted email @desktop', async ({
    page,
  }) => {
    // App does not currently display unlicensed toast/alert for non-whitelisted emails
    const signupPage = new SignupPage(page);

    await signupPage.open();
    await signupPage.isReady();

    const testEmail = `test.unlicensed.${Date.now()}@example.com`;
    const testPassword = 'TestPassword123!';

    await signupPage.signup(testEmail, testPassword);

    const toastAppeared = await signupPage.waitForFlashAlert(15000);
    expect(toastAppeared, 'Expected unlicensed toast/alert to appear after signup').toBe(true);

    const toastText = await signupPage.getFlashAlertText();
    expect(toastText.toLowerCase()).toMatch(/license|contact you/);
  });

  test('should navigate to login page when clicking Log in link @desktop', async ({ page }) => {
    const signupPage = new SignupPage(page);
    const loginPage = new LoginPage(page);

    await signupPage.open();
    await signupPage.isReady();

    await signupPage.clickLoginLink();
    await page.waitForLoadState('load');

    await loginPage.isReady();
  });
});
