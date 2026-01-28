import { Page, Locator } from '@playwright/test';
import { IPage } from '../interfaces';
import { BASE_URL } from '../constants';

export class PrivacyPolicyPage implements IPage {
  readonly page: Page;
  readonly pageHeading: Locator;
  readonly pageContent: Locator;
  readonly mainContent: Locator;

  constructor(page: Page) {
    this.page = page;
    this.pageHeading = page.getByRole('heading', { name: /privacy policy/i });
    this.pageContent = page.locator('main, [role="main"], #main-content, .privacy-policy-content').first();
    this.mainContent = page.locator('body');
  }

  getUrl(): string {
    return `${BASE_URL}/privacy-policy`;
  }

  async isReady(): Promise<void> {
    await this.page.waitForLoadState('domcontentloaded');
  }

  async open(): Promise<void> {
    await this.page.goto(this.getUrl());
    await this.isReady();
  }

  async isPageReachable(): Promise<boolean> {
    try {
      const response = await this.page.goto(this.getUrl());
      return response !== null && response.status() < 400;
    } catch {
      return false;
    }
  }

  async hasLegalContent(): Promise<boolean> {
    const bodyText = await this.mainContent.textContent();
    return bodyText !== null && bodyText.length > 100;
  }

  async getPageTitle(): Promise<string> {
    return await this.page.title();
  }

  async isHeadingVisible(): Promise<boolean> {
    return await this.pageHeading.isVisible();
  }

  async hasContentVisible(): Promise<boolean> {
    return await this.pageContent.isVisible();
  }
}
