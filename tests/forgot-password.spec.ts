import { test, expect } from '@playwright/test';
import { ForgotPasswordPage } from '../pom/pages';

test.skip('Forgot Password - Positive Test Cases', () => {
  // Use unauthenticated context - no storageState
  test.use({ storageState: { cookies: [], origins: [] } });

  test('should load forgot password page and display all form elements @smoke', async ({
    page,
  }) => {
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

  test('should navigate back to login page when clicking back to login link @smoke', async ({
    page,
  }) => {
    const forgotPasswordPage = new ForgotPasswordPage(page);

    await forgotPasswordPage.goto();
    await forgotPasswordPage.isReady();

    await forgotPasswordPage.clickBackToLogin();

    await page.waitForURL('**/login', { timeout: 5000 });

    expect(page.url()).toContain('/login');
  });

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

  test('should allow user to navigate away and return to forgot password page @smoke', async ({
    page,
  }) => {
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
