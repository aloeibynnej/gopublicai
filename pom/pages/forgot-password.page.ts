import { Page, Locator } from '@playwright/test';
import { PLATFORM_URL } from 'pom/constants';

export class ForgotPasswordPage {
  readonly page: Page;
  readonly emailInput: Locator;
  readonly resetPasswordButton: Locator;
  readonly backToLoginLink: Locator;
  readonly pageHeading: Locator;
  readonly pageDescription: Locator;
  readonly logo: Locator;

  constructor(page: Page) {
    this.page = page;
    this.emailInput = page.locator('input[type="email"][name="email"]');
    this.resetPasswordButton = page.getByRole('button', { name: 'Reset Password' });
    this.backToLoginLink = page.getByRole('link', { name: 'Back to login' });
    this.pageHeading = page.getByRole('heading', { name: 'Forgot Password', level: 1 });
    this.pageDescription = page.locator(
      'text=Enter your email address and we will send you a link'
    );
    this.logo = page.locator('img[alt="Public AI Logo"]');
  }

  getUrl(): string {
    const basePath = '/forgot-password';
    return `${PLATFORM_URL}${basePath}`;
  }

  async goto() {
    await this.page.goto(this.getUrl());
  }

  async isReady() {
    await this.pageHeading.waitFor({ state: 'visible', timeout: 10000 });
    await this.emailInput.waitFor({ state: 'visible', timeout: 10000 });
  }

  async fillEmail(email: string) {
    await this.emailInput.fill(email);
  }

  async clickResetPassword() {
    await this.resetPasswordButton.click();
  }

  async clickBackToLogin() {
    await this.backToLoginLink.click();
  }

  async isLogoVisible(): Promise<boolean> {
    return await this.logo.isVisible();
  }

  async isHeadingVisible(): Promise<boolean> {
    return await this.pageHeading.isVisible();
  }

  async isDescriptionVisible(): Promise<boolean> {
    return await this.pageDescription.isVisible();
  }

  async isEmailInputVisible(): Promise<boolean> {
    return await this.emailInput.isVisible();
  }

  async isResetButtonVisible(): Promise<boolean> {
    return await this.resetPasswordButton.isVisible();
  }

  async isBackToLoginLinkVisible(): Promise<boolean> {
    return await this.backToLoginLink.isVisible();
  }

  async isResetButtonDisabled(): Promise<boolean> {
    return await this.resetPasswordButton.isDisabled();
  }

  async getHeadingText(): Promise<string | null> {
    return await this.pageHeading.textContent();
  }

  async submitForm(email: string) {
    await this.fillEmail(email);
    await this.clickResetPassword();
  }

  async waitForToastMessage(timeout: number = 3000): Promise<boolean> {
    // Wait for toast notification to appear (bottom left corner)
    await this.page.waitForTimeout(2000);

    // Look for toast message with success text
    const toastMessage = this.page.locator('text=/reset link has been sent|email exists/i').first();
    const toastVisible = await toastMessage.isVisible().catch(() => false);

    if (toastVisible) {
      return true;
    }

    // Check for any toast/notification element as fallback
    const anyToast = this.page.locator('[role="status"], [role="alert"], .sonner-toast').first();
    return await anyToast.isVisible().catch(() => false);
  }

  async getToastMessage(): Promise<string | null> {
    const toastMessage = this.page.locator('text=/reset link has been sent|email exists/i').first();
    const toastVisible = await toastMessage.isVisible().catch(() => false);

    if (toastVisible) {
      return await toastMessage.textContent();
    }
    return null;
  }

  async verifyUrl(): Promise<boolean> {
    return this.page.url().includes('/forgot-password');
  }

  async gotoAndVerify() {
    await this.goto();
    await this.isReady();
    const url = this.page.url();
    return url.includes('/forgot-password');
  }
}
