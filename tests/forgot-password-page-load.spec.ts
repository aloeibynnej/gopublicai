import { test, expect } from '@playwright/test';
import { ForgotPasswordPage } from '../pom/pages';

test.describe('Forgot Password Page - Availability and Form Load', () => {
  // Use unauthenticated context - no storageState
  test.use({ storageState: { cookies: [], origins: [] } });

  test('should load forgot password page and display all form elements @smoke', async ({ page }) => {
    const forgotPasswordPage = new ForgotPasswordPage(page);

    await forgotPasswordPage.goto();
    await forgotPasswordPage.isReady();

    expect(page.url()).toContain('/forgot-password');

    const logoVisible = await forgotPasswordPage.isLogoVisible();
    expect(logoVisible).toBe(true);

    const headingVisible = await forgotPasswordPage.isHeadingVisible();
    expect(headingVisible).toBe(true);
    const headingText = await forgotPasswordPage.getHeadingText();
    expect(headingText).toBe('Forgot Password');

    const descriptionVisible = await forgotPasswordPage.isDescriptionVisible();
    expect(descriptionVisible).toBe(true);

    const emailInputVisible = await forgotPasswordPage.isEmailInputVisible();
    expect(emailInputVisible).toBe(true);

    const resetButtonVisible = await forgotPasswordPage.isResetButtonVisible();
    expect(resetButtonVisible).toBe(true);

    const backToLoginVisible = await forgotPasswordPage.isBackToLoginLinkVisible();
    expect(backToLoginVisible).toBe(true);
  });

  test('should navigate back to login page when clicking back to login link @smoke', async ({ page }) => {
    const forgotPasswordPage = new ForgotPasswordPage(page);

    await forgotPasswordPage.goto();
    await forgotPasswordPage.isReady();

    await forgotPasswordPage.clickBackToLogin();

    await page.waitForURL('**/login', { timeout: 5000 });

    expect(page.url()).toContain('/login');
  });
});
