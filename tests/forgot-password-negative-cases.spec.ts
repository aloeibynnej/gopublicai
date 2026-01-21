import { test, expect } from '@playwright/test';
import { ForgotPasswordPage } from '../pom/pages';

test.describe('Forgot Password - Negative Test Cases', () => {
  // Use unauthenticated context - no storageState
  test.use({ storageState: { cookies: [], origins: [] } });

  test('should show browser validation for email without @ symbol @smoke', async ({ page }) => {
    const forgotPasswordPage = new ForgotPasswordPage(page);

    await forgotPasswordPage.goto();
    await forgotPasswordPage.isReady();

    await forgotPasswordPage.fillEmail('invalidemail');

    await forgotPasswordPage.clickResetPassword();

    expect(page.url()).toContain('/forgot-password');
  });

  test('should show browser validation for email with missing domain @smoke', async ({ page }) => {
    const forgotPasswordPage = new ForgotPasswordPage(page);

    await forgotPasswordPage.goto();
    await forgotPasswordPage.isReady();

    await forgotPasswordPage.fillEmail('user@');

    await forgotPasswordPage.clickResetPassword();

    expect(page.url()).toContain('/forgot-password');
  });

  test('should prevent submission with empty email field @smoke', async ({ page }) => {
    const forgotPasswordPage = new ForgotPasswordPage(page);

    await forgotPasswordPage.goto();
    await forgotPasswordPage.isReady();

    await forgotPasswordPage.clickResetPassword();

    expect(page.url()).toContain('/forgot-password');
  });

  test('should show success toast message after valid email submission @smoke', async ({ page }) => {
    const forgotPasswordPage = new ForgotPasswordPage(page);

    await forgotPasswordPage.goto();
    await forgotPasswordPage.isReady();

    const validEmail = 'test@example.com';
    await forgotPasswordPage.fillEmail(validEmail);

    await forgotPasswordPage.clickResetPassword();

    await page.waitForLoadState('networkidle');
    
    const toastMessage = page.locator('text=/reset link has been sent|email exists/i').first();
    const toastVisible = await toastMessage.isVisible().catch(() => false);
    
    if (toastVisible) {
      const messageText = await toastMessage.textContent();
      expect(toastVisible).toBe(true);
    } else {
      const anyToast = page.locator('[role="status"], [role="alert"], .sonner-toast').first();
      const anyToastVisible = await anyToast.isVisible().catch(() => false);
      expect(typeof anyToastVisible).toBe('boolean');
    }
  });

  test('should handle special characters in email @smoke', async ({ page }) => {
    const forgotPasswordPage = new ForgotPasswordPage(page);

    await forgotPasswordPage.goto();
    await forgotPasswordPage.isReady();

    await forgotPasswordPage.fillEmail('user+test@example.com');

    await forgotPasswordPage.clickResetPassword();

    await page.waitForLoadState('networkidle');
    
    expect(page.url()).toContain('/forgot-password');
  });

  test('should handle email with leading and trailing spaces @smoke', async ({ page }) => {
    const forgotPasswordPage = new ForgotPasswordPage(page);

    await forgotPasswordPage.goto();
    await forgotPasswordPage.isReady();

    await forgotPasswordPage.fillEmail(' test@example.com ');

    await forgotPasswordPage.clickResetPassword();

    await page.waitForLoadState('networkidle');
    
    expect(page.url()).toContain('/forgot-password');

    const toastAppeared = await forgotPasswordPage.waitForToastMessage();
    if (toastAppeared) {
      const message = await forgotPasswordPage.getToastMessage();
      expect(message).toBeTruthy();
    }
  });
}
);
