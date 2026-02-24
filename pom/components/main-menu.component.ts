import { Locator, Page } from '@playwright/test';
import { TickerSwitcherComponent } from './ticker-switcher.component';

export class MainMenuComponent {
  private readonly container: Locator;
  private readonly homeLink: Locator;
  private readonly chatLink: Locator;
  private readonly healthMonitorLink: Locator;
  private readonly statsLink: Locator;
  private readonly settingsLink: Locator;
  private readonly logoLink: Locator;
  private readonly snapshotLink: Locator;
  private readonly changeTickerButton: Locator;
  private readonly changeTickerButtonMobile: Locator;
  readonly logoutLink: Locator;

  readonly tickerSwitcher: TickerSwitcherComponent;

  constructor(private readonly page: Page) {
    this.container = this.page.locator('nav').first();
    this.logoLink = this.page.getByRole('img', { name: 'Public AI Logo' });
    this.homeLink = this.page.getByRole('link', { name: 'Home' });
    this.chatLink = this.page.getByRole('link', { name: 'Chat' });
    this.healthMonitorLink = this.page.getByRole('link', { name: 'Health Monitor' });
    this.statsLink = this.page.getByRole('link', { name: 'Stats' });
    this.settingsLink = this.page.getByRole('link', { name: 'Settings' });
    this.snapshotLink = this.page.getByRole('link', { name: 'Snapshot' });
    // Ticker switcher: use .mb-2 + Radix attributes (matches ticker-switcher.component.ts) to avoid
    // matching chat history button or "Stock Technicals" cards; works in desktop and mobile layouts
    const tickerButton = this.page
      .locator('.mb-2')
      .locator('button[aria-haspopup="dialog"][data-state]')
      .first();
    this.changeTickerButton = tickerButton;
    this.changeTickerButtonMobile = tickerButton;

    this.tickerSwitcher = new TickerSwitcherComponent(page);

    this.logoutLink = this.page
      .locator('div.underline.text-sm')
      .filter({ hasText: 'Logout' })
      .first();
  }

  async isVisible(): Promise<boolean> {
    return Promise.all([this.snapshotLink.isVisible(), this.logoLink.isVisible()]).then(values =>
      values.every(value => value)
    );
  }

  async logout(): Promise<void> {
    await this.logoutLink.click();
  }

  async waitForComponent(): Promise<void> {
    await this.container.waitFor({ state: 'visible' });
  }

  async clickHome(): Promise<void> {
    await this.homeLink.click();
  }

  async clickChat(): Promise<void> {
    await this.chatLink.click();
  }

  async clickHealthMonitor(): Promise<void> {
    await this.healthMonitorLink.click();
  }

  async clickStats(): Promise<void> {
    await this.statsLink.click();
  }

  async clickSettings(): Promise<void> {
    await this.settingsLink.click();
  }

  async clickLogo(): Promise<void> {
    await this.logoLink.click();
  }

  async clickSnapshot(): Promise<void> {
    await this.snapshotLink.click();
  }

  async isHomeLinkActive(): Promise<boolean> {
    const classList = await this.homeLink.getAttribute('class');
    return classList?.includes('active') || classList?.includes('bg-') || false;
  }

  async isChatLinkActive(): Promise<boolean> {
    const classList = await this.chatLink.getAttribute('class');
    return classList?.includes('active') || classList?.includes('bg-') || false;
  }

  async isHealthMonitorLinkActive(): Promise<boolean> {
    const classList = await this.healthMonitorLink.getAttribute('class');
    return classList?.includes('active') || classList?.includes('bg-') || false;
  }

  async isStatsLinkActive(): Promise<boolean> {
    const classList = await this.statsLink.getAttribute('class');
    return classList?.includes('active') || classList?.includes('bg-') || false;
  }

  async isSettingsLinkActive(): Promise<boolean> {
    const classList = await this.settingsLink.getAttribute('class');
    return classList?.includes('active') || classList?.includes('bg-') || false;
  }

  async clickTickerSwitcher(): Promise<void> {
    await this.snapshotLink.click();
    await this.changeTickerButton.click();
  }

  async clickTickerSwitcherMobile(): Promise<void> {
    await this.changeTickerButtonMobile.click();
  }

  async selectTicker(ticker: string): Promise<void> {
    await this.snapshotLink.click();
    await this.tickerSwitcher.selectTickerByText(ticker);
  }

  async getActiveMenuItem(): Promise<string | null> {
    const menuItems = [
      { name: 'Home', locator: this.homeLink },
      { name: 'Chat', locator: this.chatLink },
      { name: 'Health Monitor', locator: this.healthMonitorLink },
      { name: 'Stats', locator: this.statsLink },
      { name: 'Settings', locator: this.settingsLink },
      { name: 'Snapshot', locator: this.snapshotLink },
    ];

    for (const item of menuItems) {
      const classList = await item.locator.getAttribute('class');
      if (classList?.includes('active') || classList?.includes('bg-')) {
        return item.name;
      }
    }

    return null;
  }
}
