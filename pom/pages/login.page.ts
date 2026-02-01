import { Locator, Page } from '@playwright/test';
import { IPage } from '../interfaces';
import { BASE_URL } from '../constants';

export class LoginPage implements IPage {
  readonly page: Page;

  private readonly headingText = 'Welcome to Public.ai';
  private readonly emailPlaceholder = 'Email';
  private readonly passwordPlaceholder = 'Password';
  private readonly forgotPasswordText = 'Forgot your password?';
  private readonly loginButtonText = 'LOG IN';
  readonly loginInput: Locator;
  readonly passwordInput: Locator;
  readonly flashAlert: Locator;
  readonly loginButton: Locator;
  readonly forgotPasswordLink: Locator;

  constructor(page: Page) {
    this.page = page;
    this.loginInput = this.page.getByPlaceholder(this.emailPlaceholder);
    this.passwordInput = this.page.getByPlaceholder(this.passwordPlaceholder);
    this.flashAlert = this.page.locator('div.flash.alert');
    this.loginButton = this.page.getByRole('button', { name: 'LOG IN' });
    this.forgotPasswordLink = this.page.getByRole('link', { name: 'Forgot your password?' });
  }

  getUrl(): string {
    const basePath = '/login';
    return `${BASE_URL}${basePath}`;
  }

  async isReady(): Promise<void> {
    await this.page.getByRole('heading', { name: this.headingText }).waitFor({ state: 'visible' });
    await this.page.getByPlaceholder(this.emailPlaceholder).waitFor({ state: 'visible' });
    await this.page.getByPlaceholder(this.passwordPlaceholder).waitFor({ state: 'visible' });
    await this.page
      .getByRole('button', { name: this.loginButtonText })
      .waitFor({ state: 'visible' });
  }

  async isVisible(): Promise<boolean> {
    await this.page.getByRole('heading', { name: this.headingText }).isVisible();
    await this.page.getByPlaceholder(this.emailPlaceholder).isVisible();
    await this.page.getByPlaceholder(this.passwordPlaceholder).isVisible();
    await this.page.getByRole('button', { name: this.loginButtonText }).isVisible();
    await this.page.getByRole('link', { name: this.forgotPasswordText }).isVisible();
    return true;
  }

  async open(): Promise<void> {
    await this.page.goto(this.getUrl(), { waitUntil: 'domcontentloaded' });
  }

  async fillEmail(email: string): Promise<void> {
    await this.page.getByPlaceholder(this.emailPlaceholder).fill(email);
  }

  async fillPassword(password: string): Promise<void> {
    await this.page.getByPlaceholder(this.passwordPlaceholder).fill(password);
  }

  async clickLogin(): Promise<void> {
    await this.page.getByRole('button', { name: this.loginButtonText }).click();
  }

  async clickForgotPassword(): Promise<void> {
    await this.page.getByRole('link', { name: this.forgotPasswordText }).click();
  }

  async login(email: string, password: string): Promise<void> {
    await this.fillEmail(email);
    await this.fillPassword(password);
    await this.clickLogin();
  }

  async flashAlertIsVisible(): Promise<boolean> {
    return this.flashAlert.isVisible();
  }
}
