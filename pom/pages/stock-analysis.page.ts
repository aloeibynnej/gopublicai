import { Page, Locator } from '@playwright/test';
import { IPage } from '../interfaces';
import { BASE_URL } from '../constants';
import { MainMenuComponent } from '../components';

export class StockAnalysisPage implements IPage {
  readonly page: Page;
  readonly mainLocator = '#main-content';
  readonly mainMenuComponent: MainMenuComponent;

  constructor(page: Page) {
    this.page = page;
    this.mainMenuComponent = new MainMenuComponent(page);
  }

  getUrl(): string {
    return `${BASE_URL}/stats`;
  }

  async isReady(): Promise<void> {
    await this.page.locator(this.mainLocator).waitFor({ state: 'visible' });
  }

  async open(): Promise<void> {
    await this.page.goto(this.getUrl());
    await this.isReady();
  }
}
