import { Page, Locator } from '@playwright/test';
import { IPage } from '../interfaces';
import { ChatComponent } from '../components';
import { BASE_URL } from '../constants';
import { MainMenuComponent } from '../components';

export class HealthMonitorPage implements IPage {
  readonly page: Page;

  constructor(page: Page) {
    this.page = page;
  }

  async open(): Promise<void> {
    await this.page.goto(this.getUrl());
  }

  async isReady(): Promise<void> {
    await this.page.waitForLoadState('networkidle');
  }

  getUrl(): string {
    return `${BASE_URL}/health-monitor`;
  }
}

export class HealthMonitorDesktopPage extends HealthMonitorPage {
  readonly chat: ChatComponent;
  readonly mainMenu: MainMenuComponent;

  private readonly pageHeading: Locator;
  private readonly rsiCard: Locator;
  private readonly macdCard: Locator;
  private readonly shortInterestCard: Locator;
  private readonly seeMoreButtons: Locator;
  private readonly mainContent: Locator;
  private readonly priceMomentumCard: Locator;

  constructor(page: Page) {
    super(page);

    this.chat = new ChatComponent(page);
    this.mainMenu = new MainMenuComponent(page);

    this.pageHeading = page.getByRole('heading', { name: /health monitor/i });
    this.rsiCard = page.locator('text=RSI').locator('..').locator('..');
    this.macdCard = page.locator('text=MACD').locator('..').locator('..');
    this.shortInterestCard = page.locator('text=SHORT INTEREST').locator('..').locator('..');
    this.seeMoreButtons = page.getByRole('button', { name: /see more/i });
    this.mainContent = page.locator('#main-content');
    this.priceMomentumCard = page.getByRole('heading', { name: 'Price Momentum', exact: true });
  }

  async isReady(): Promise<void> {
    if (this.page.isClosed()) {
      throw new Error('Page is already closed; cannot wait for isReady().');
    }
    try {
      // Use 'load' to avoid long waits; 'networkidle' can race with page close or never fire (e.g. long‑polling).
      await this.page.waitForLoadState('load');
    } catch (err) {
      if (this.page.isClosed()) {
        throw new Error(
          'Page was closed while waiting for load state (e.g. app navigated away or closed the window).'
        );
      }
      throw err;
    }
    await this.page.getByRole('heading', { name: 'Stock Technicals' }).isVisible();
    await this.priceMomentumCard.isVisible();
  }

  async getRSIValue(): Promise<string> {
    const rsiText = await this.rsiCard.locator('text=/\\d+\\.\\d+%/').textContent();
    return rsiText || '';
  }

  async getMACDValue(): Promise<string> {
    const macdText = await this.macdCard.locator('text=/-?\\d+\\.\\d+/').textContent();
    return macdText || '';
  }

  async getShortInterestValue(): Promise<string> {
    const shortInterestText = await this.shortInterestCard.locator('text=/[\\d,]+/').textContent();
    return shortInterestText || '';
  }

  async clickSeeMore(cardName: 'RSI' | 'MACD' | 'SHORT INTEREST'): Promise<void> {
    const card = this.page.locator(`text=${cardName}`).locator('..').locator('..');
    await card.getByRole('button', { name: /see more/i }).click();
  }

  async isCardExpanded(cardName: string): Promise<boolean> {
    const card = this.page.locator(`text=${cardName}`).locator('..').locator('..');
    const expandedContent = card.locator('[data-expanded="true"]');
    return await expandedContent.isVisible().catch(() => false);
  }

  async openChat(): Promise<void> {
    await this.chat.waitForComponent();
  }

  async sendChatMessage(message: string): Promise<void> {
    await this.chat.sendMessage(message);
  }

  async getChatHistoryCount(): Promise<number> {
    return await this.chat.getChatHistoryCount();
  }

  async selectChatFromHistory(index: number): Promise<void> {
    await this.chat.clickChatHistoryItem(index);
  }

  async startNewChat(): Promise<void> {
    await this.chat.clickNewChat();
  }
}

export class HealthMonitorMobilePage extends HealthMonitorPage {
  private readonly greetingMessage: Locator;
  private readonly stockTickerHeader: Locator;
  private readonly chatHistoryBackdrop: Locator;
  private readonly chatHistoryItems: Locator;
  private readonly screenSizeIndicator: Locator;
  private readonly menuButton: Locator;

  readonly mainMenu: MainMenuComponent;

  constructor(page: Page) {
    super(page);

    this.greetingMessage = page.locator('div.relative.text-2xl').first();
    this.stockTickerHeader = page.getByRole('button', { name: /STOCK TICKER GOALS/i });
    this.chatHistoryBackdrop = page.locator('[aria-label="Chat history backdrop"]');
    this.chatHistoryItems = page.locator('[role="button"][class="chat-header-button"]');
    this.screenSizeIndicator = page.locator('div.fixed.bottom-1.left-1.z-50');
    this.menuButton = page.getByRole('banner').getByRole('img');

    this.mainMenu = new MainMenuComponent(page);
  }

  async clickMenuButton(): Promise<void> {
    await this.menuButton.click();
  }

  async getGreetingText(): Promise<string> {
    return (await this.greetingMessage.textContent()) || '';
  }

  async isStockTickerHeaderVisible(): Promise<boolean> {
    return await this.stockTickerHeader.isVisible();
  }

  async clickStockTickerHeader(): Promise<void> {
    await this.stockTickerHeader.click();
  }

  async getChatHistoryItemsCount(): Promise<number> {
    return await this.chatHistoryItems.count();
  }

  async getChatHistoryItemText(index: number): Promise<string> {
    const item = this.chatHistoryItems.nth(index);
    const textElement = item.locator('span.text-xs.text-white');
    return (await textElement.textContent()) || '';
  }

  async clickChatHistoryItem(index: number): Promise<void> {
    await this.chatHistoryItems.nth(index).click();
  }

  async isChatHistoryBackdropVisible(): Promise<boolean> {
    return await this.chatHistoryBackdrop.isVisible();
  }

  async getCurrentScreenSize(): Promise<string> {
    const visibleSize = await this.screenSizeIndicator.locator('div:visible').textContent();
    return visibleSize || '';
  }
}
