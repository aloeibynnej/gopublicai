import { Locator, Page } from '@playwright/test';

export class TickerSwitcherComponent {
  readonly page: Page;
  private readonly tickerSwitcherButton: Locator;
  private readonly tickerDropdown: Locator;
  private readonly tickerSearchInput: Locator;
  private readonly tickerOptions: Locator;
  private readonly tickerMenu: Locator;
  //private readonly selectedTickerDisplay: Locator;

  constructor(page: Page) {
    this.page = page;
    this.tickerSwitcherButton = page.getByRole('option', { name: /ticker/i });
    this.tickerDropdown = page.locator('[cmdk-list=""]');
    this.tickerSearchInput = page.getByPlaceholder('Search companies...');
    this.tickerOptions = page.locator('[role="option"][aria-selected="true"]');
    this.tickerMenu = page
      .locator('.mb-2')
      .locator('button[aria-haspopup="dialog"][data-state]')
      .first();
  }

  async isVisible(): Promise<boolean> {
    return await this.tickerSwitcherButton.isVisible();
  }

  async nameTicker(): Promise<string> {
    return (await this.tickerMenu.textContent()) || '';
  }

  async isEnabled(): Promise<boolean> {
    return await this.tickerSwitcherButton.isEnabled();
  }

  async click(): Promise<void> {
    await this.tickerSwitcherButton.click();
  }

  async isDropdownOpen(): Promise<boolean> {
    return await this.tickerDropdown.isVisible();
  }

  async searchTicker(ticker: string): Promise<void> {
    await this.tickerSearchInput.fill(ticker);
    await this.tickerSearchInput.press('Enter');
  }

  async selectTickerByText(ticker: string): Promise<void> {
    await this.click();
    await this.tickerOptions.filter({ hasText: ticker }).first().click();
  }

  async getSelectedTicker(): Promise<string> {
    return (await this.tickerOptions.textContent()) || '';
  }

  async getTickerOptionsCount(): Promise<number> {
    return await this.tickerOptions.count();
  }

  async waitForComponent(): Promise<void> {
    await this.tickerSwitcherButton.waitFor({ state: 'visible' });
  }
}
