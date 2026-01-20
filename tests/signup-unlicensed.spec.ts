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

  test('should display unlicensed toast when submitting non-whitelisted email @desktop', async ({
    page,
  }) => {
    const signupPage = new SignupPage(page);

    await signupPage.open();
    await signupPage.isReady();

    const testEmail = `test.unlicensed.${Date.now()}@example.com`;
    const testPassword = 'TestPassword123!';

    await signupPage.signup(testEmail, testPassword);

    const isToastVisible = await signupPage.isFlashAlertVisible();
    expect(isToastVisible).toBe(true);

    const toastText = await signupPage.getFlashAlertText();
    expect(toastText).toContain(
      "It seems that you don't have an active license. We will contact you shortly with the next steps."
    );
  });

  test('should navigate to login page when clicking Log in link @desktop', async ({ page }) => {
    const signupPage = new SignupPage(page);
    const loginPage = new LoginPage(page);

    await signupPage.open();
    await signupPage.isReady();

    await signupPage.clickLoginLink();
    await page.waitForLoadState('networkidle');

    await loginPage.isReady();
  });
});
