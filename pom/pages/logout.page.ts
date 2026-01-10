import { Page } from '@playwright/test';
import { IPage } from '../interfaces';
import { BASE_URL } from '../constants';

export class LogoutPage implements IPage {
  readonly page: Page;

  private readonly headingText = 'Successfully Logged Out';
  private readonly messageText = 'You have been successfully logged out of Public.ai';
  private readonly loginButtonText = 'LOG IN AGAIN';

  constructor(page: Page) {
    this.page = page;
  }

  getUrl(): string {
    const basePath = 'logout-success';

    return `${BASE_URL}${basePath}`;
  }

  async isReady(): Promise<void> {
    await this.page.getByRole('heading', { name: this.headingText }).waitFor({ state: 'visible' });
    await this.page.getByText(this.messageText).waitFor({ state: 'visible' });
    await this.page
      .getByRole('button', { name: this.loginButtonText })
      .waitFor({ state: 'visible' });
  }

  async open(): Promise<void> {
    await this.page.goto(this.getUrl());
    await this.isReady();
  }

  async clickLoginAgain(): Promise<void> {
    await this.page.getByRole('button', { name: this.loginButtonText }).click();
  }

  async getHeading(): Promise<string> {
    return await this.page.getByRole('heading', { name: this.headingText }).textContent() || '';
  }

  async getMessage(): Promise<string> {
    return await this.page.getByText(this.messageText).textContent() || '';
  }
}
