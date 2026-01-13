import { test, expect } from '@playwright/test';
import { ForgotPasswordPage } from '../pom/pages';

test.describe('Password Reset Flow - Valid Email', () => {
  // Use unauthenticated context - no storageState
  test.use({ storageState: { cookies: [], origins: [] } });

  test('should complete password reset request flow with valid email @smoke', async ({ page }) => {
    const forgotPasswordPage = new ForgotPasswordPage(page);

    await forgotPasswordPage.goto();
    await forgotPasswordPage.isReady();

    expect(page.url()).toContain('/forgot-password');

    const emailInputVisible = await forgotPasswordPage.isEmailInputVisible();
    expect(emailInputVisible).toBe(true);

    const resetButtonVisible = await forgotPasswordPage.isResetButtonVisible();
    expect(resetButtonVisible).toBe(true);

    const validEmail = 'user@example.com';
    await forgotPasswordPage.fillEmail(validEmail);

    await forgotPasswordPage.clickResetPassword();

    await page.waitForLoadState('networkidle');

    expect(page.url()).toContain('/forgot-password');
  });

  test('should handle multiple password reset requests @smoke', async ({ page }) => {
    const forgotPasswordPage = new ForgotPasswordPage(page);

    await forgotPasswordPage.goto();
    await forgotPasswordPage.isReady();

    expect(page.url()).toContain('/forgot-password');

    await forgotPasswordPage.submitForm('user1@example.com');
    await page.waitForLoadState('networkidle');

    await forgotPasswordPage.emailInput.clear();
    await forgotPasswordPage.submitForm('user2@example.com');
    await page.waitForLoadState('networkidle');

    expect(page.url()).toContain('/forgot-password');
  });

  test('should allow user to navigate away and return to forgot password page @smoke', async ({ page }) => {
    const forgotPasswordPage = new ForgotPasswordPage(page);

    await forgotPasswordPage.goto();
    await forgotPasswordPage.isReady();

    expect(page.url()).toContain('/forgot-password');

    await forgotPasswordPage.clickBackToLogin();
    await page.waitForURL('**/login', { timeout: 5000 });

    await forgotPasswordPage.goto();
    await forgotPasswordPage.isReady();

    const emailInputVisible = await forgotPasswordPage.isEmailInputVisible();
    expect(emailInputVisible).toBe(true);
  });
});
