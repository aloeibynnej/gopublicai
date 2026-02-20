import { Page, Locator } from '@playwright/test';
import { IPage } from '../interfaces';
import { PLATFORM_URL } from '../constants';

export class SignupPage implements IPage {
  readonly page: Page;

  private readonly headingText = /Create account/i;
  private readonly flashAlertText =
    "It seems that you don't have an active license. We will contact you shortly with the next steps.";

  readonly emailInput: Locator;
  readonly passwordInput: Locator;
  readonly createAccountButton: Locator;
  readonly loginLink: Locator;

  constructor(page: Page) {
    this.page = page;
    this.emailInput = this.page.getByPlaceholder('Email');
    this.passwordInput = this.page.getByPlaceholder('Password');
    this.createAccountButton = this.page.getByRole('button', { name: /CREATE ACCOUNT/i });
    this.loginLink = this.page.getByRole('link', { name: /Log in/i });
  }

  getUrl(): string {
    const basePath = '/signup';
    return `${PLATFORM_URL}${basePath}`;
  }

  async isReady(): Promise<void> {
    await this.page.getByRole('heading', { name: this.headingText }).waitFor({ state: 'visible' });
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

  async waitForFlashAlert(timeout = 15000): Promise<boolean> {
    // Wait for signup request to complete and error message to appear (toast, alert, or inline)
    const licenseMessage = this.page.getByText(/license|contact you|don't have an active/i);
    return await licenseMessage.first().isVisible({ timeout }).catch(() => false);
  }

  async isFlashAlertVisible(): Promise<boolean> {
    const licenseMessage = this.page.getByText(/license|contact you|don't have an active/i);
    return await licenseMessage.first().isVisible().catch(() => false);
  }

  async getFlashAlertText(): Promise<string> {
    const licenseMessage = this.page.getByText(/license|contact you|don't have an active/i);
    return (await licenseMessage.first().textContent().catch(() => null)) || '';
  }
}
