import { Page, Locator } from '@playwright/test';
import { IPage } from '../interfaces';
import { PLATFORM_URL } from '../constants';

export class SignupPage implements IPage {
  readonly page: Page;

  private readonly headingText = 'Create Account';
  private readonly flashAlertText =
    "It seems that you don't have an active license. We will contact you shortly with the next steps.";

  readonly emailInput: Locator;
  readonly passwordInput: Locator;
  readonly createAccountButton: Locator;
  readonly loginLink: Locator;

  constructor(page: Page) {
    this.page = page;
    this.emailInput = this.page.locator('#user_account_email');
    this.passwordInput = this.page.locator('#user_account_password');
    this.createAccountButton = this.page.locator('input.btn-signup[type="submit"]');
    this.loginLink = this.page.locator('a.login-link');
  }

  getUrl(): string {
    const basePath = '/signup';

    // https://platform-stage.gopublic.ai/signup
    return `${PLATFORM_URL}${basePath}`;
  }

  async isReady(): Promise<void> {
    await this.page
      .locator('h1.welcome', { hasText: this.headingText })
      .waitFor({ state: 'visible' });
    await this.emailInput.waitFor({ state: 'visible' });
    await this.passwordInput.waitFor({ state: 'visible' });
    await this.createAccountButton.waitFor({ state: 'visible' });
  }

  async open(): Promise<void> {
    await this.page.goto(this.getUrl());
    await this.isReady();
  }

  async fillEmail(email: string): Promise<void> {
    await this.emailInput.fill(email);
  }

  async fillPassword(password: string): Promise<void> {
    await this.passwordInput.pressSequentially(password);
  }

  async clickCreateAccount(): Promise<void> {
    await this.createAccountButton.click();
  }

  async clickLoginLink(): Promise<void> {
    await this.loginLink.click();
  }

  async signup(email: string, password: string): Promise<void> {
    await this.fillEmail(email);
    await this.fillPassword(password);
    await this.clickCreateAccount();
  }

  async isFlashAlertVisible(): Promise<boolean> {
    return await this.page.getByText(this.flashAlertText).isVisible();
  }

  async getFlashAlertText(): Promise<string> {
    return (await this.page.getByText(this.flashAlertText).textContent()) || '';
  }
}
