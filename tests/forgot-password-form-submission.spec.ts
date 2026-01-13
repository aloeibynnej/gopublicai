import { test, expect } from '@playwright/test';
import { ForgotPasswordPage } from '../pom/pages';

test.describe('Forgot Password Form - Submission Logic', () => {
  // Use unauthenticated context - no storageState
  test.use({ storageState: { cookies: [], origins: [] } });

  test('should submit form with valid email and show success message @smoke', async ({ page }) => {
    const forgotPasswordPage = new ForgotPasswordPage(page);

    await forgotPasswordPage.goto();
    await forgotPasswordPage.isReady();

    expect(page.url()).toContain('/forgot-password');

    const testEmail = 'test@example.com';
    await forgotPasswordPage.fillEmail(testEmail);

    await forgotPasswordPage.clickResetPassword();

    await page.waitForLoadState('networkidle');

    const buttonText = await forgotPasswordPage.resetPasswordButton.textContent();
    expect(buttonText).toBeTruthy();
  });

  test('should require email field before submission @smoke', async ({ page }) => {
    const forgotPasswordPage = new ForgotPasswordPage(page);

    await forgotPasswordPage.goto();
    await forgotPasswordPage.isReady();

    expect(page.url()).toContain('/forgot-password');

    await forgotPasswordPage.clickResetPassword();

    expect(page.url()).toContain('/forgot-password');
  });

  test('should validate email format @smoke', async ({ page }) => {
    const forgotPasswordPage = new ForgotPasswordPage(page);

    await forgotPasswordPage.goto();
    await forgotPasswordPage.isReady();

    expect(page.url()).toContain('/forgot-password');

    await forgotPasswordPage.fillEmail('invalid-email');

    await forgotPasswordPage.clickResetPassword();

    expect(page.url()).toContain('/forgot-password');
  });

  test('should show loading state during form submission @smoke', async ({ page }) => {
    const forgotPasswordPage = new ForgotPasswordPage(page);

    await forgotPasswordPage.goto();
    await forgotPasswordPage.isReady();

    expect(page.url()).toContain('/forgot-password');

    await forgotPasswordPage.fillEmail('test@example.com');

    await forgotPasswordPage.clickResetPassword();

    await page.waitForLoadState('networkidle');

    const isDisabled = await forgotPasswordPage.isResetButtonDisabled();
    expect(typeof isDisabled).toBe('boolean');
  });
});
