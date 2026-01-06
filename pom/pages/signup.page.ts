import { Page } from '@playwright/test';
import { IPage } from '../interfaces';
import { BASE_URL } from '../constants';

export class SignupPage implements IPage {
  readonly page: Page;

  private readonly headingText = 'Create account';
  private readonly emailPlaceholder = 'Email';
  private readonly passwordPlaceholder = 'Password';
  private readonly createAccountButtonText = 'CREATE ACCOUNT';
  private readonly loginLinkText = 'Log in';
  private readonly unlicensedToastText = 'It seems that you do not have an active license';

  constructor(page: Page) {
    this.page = page;
  }

  getUrl(): string {
    const basePath = 'signup';

    return `${BASE_URL}${basePath}`;
  }

  async isReady(): Promise<void> {
    await this.page.getByRole('heading', { name: this.headingText }).waitFor({ state: 'visible' });
    await this.page.getByPlaceholder(this.emailPlaceholder).waitFor({ state: 'visible' });
    await this.page.getByPlaceholder(this.passwordPlaceholder).waitFor({ state: 'visible' });
    await this.page
      .getByRole('button', { name: this.createAccountButtonText })
      .waitFor({ state: 'visible' });
  }

  async open(): Promise<void> {
    await this.page.goto(this.getUrl());
    await this.isReady();
  }

  async fillEmail(email: string): Promise<void> {
    await this.page.getByPlaceholder(this.emailPlaceholder).fill(email);
  }

  async fillPassword(password: string): Promise<void> {
    await this.page.getByPlaceholder(this.passwordPlaceholder).pressSequentially(password);
  }

  async clickCreateAccount(): Promise<void> {
    await this.page.getByRole('button', { name: this.createAccountButtonText }).click();
  }

  async clickLoginLink(): Promise<void> {
    await this.page.getByRole('link', { name: this.loginLinkText }).click();
  }

  async signup(email: string, password: string): Promise<void> {
    await this.fillEmail(email);
    await this.fillPassword(password);
    await this.clickCreateAccount();
  }

  async isUnlicensedToastVisible(): Promise<boolean> {
    return await this.page.getByText(this.unlicensedToastText).isVisible({ timeout: 5000 });
  }

  async getUnlicensedToastText(): Promise<string> {
    return await this.page.getByText(this.unlicensedToastText).textContent() || '';
  }
}
