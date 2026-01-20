import { Page } from '@playwright/test';
import { IPage } from '../interfaces';
import { BASE_URL } from '../constants';
import { MainMenuComponent } from 'pom/components';

export class DashboardPage implements IPage {
  readonly page: Page;

  readonly mainLocator = '#main-content';

  readonly mainMenuComponent: MainMenuComponent;

  constructor(page: Page) {
    this.page = page;
    this.mainLocator = '#main-content';

    this.mainMenuComponent = new MainMenuComponent(page);
  }

  getUrl(): string {
    return `${BASE_URL}/`;
  }

  async isReady(): Promise<void> {
    await this.page.locator(this.mainLocator).waitFor({ state: 'visible' });
  }

  async open(): Promise<void> {
    await this.page.goto(this.getUrl());
    await this.isReady();
  }
}
