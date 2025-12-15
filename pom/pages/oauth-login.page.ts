import { Page } from '@playwright/test';
import { IPage } from '../interfaces';
import { BASE_URL } from '../constants';

export class OAuthLoginPage implements IPage {
  readonly page: Page;

  private readonly headingText = 'Welcome to Public.ai';
  private readonly emailPlaceholder = 'Email';
  private readonly passwordPlaceholder = 'Password';
  private readonly forgotPasswordText = 'Forgot your password?';
  private readonly loginButtonText = 'LOG IN';

  constructor(page: Page) {
    this.page = page;
  }

  getUrl(): string {
    const basePath = 'login';

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
}
