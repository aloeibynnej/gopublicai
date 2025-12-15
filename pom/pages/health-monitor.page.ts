import { Page, Locator } from '@playwright/test';
import { IPage } from '../interfaces';
import { ChatComponent } from '../components';
import { BASE_URL } from '../constants';

export class HealthMonitorPage implements IPage {
  readonly page: Page;
  readonly chat: ChatComponent;

  private readonly pageHeading: Locator;
  private readonly rsiCard: Locator;
  private readonly macdCard: Locator;
  private readonly shortInterestCard: Locator;
  private readonly seeMoreButtons: Locator;
  private readonly mainContent: Locator;

  constructor(page: Page) {
    this.page = page;
    this.chat = new ChatComponent(page);

    this.pageHeading = page.getByRole('heading', { name: /health monitor/i });
    this.rsiCard = page.locator('text=RSI').locator('..').locator('..');
    this.macdCard = page.locator('text=MACD').locator('..').locator('..');
    this.shortInterestCard = page.locator('text=SHORT INTEREST').locator('..').locator('..');
    this.seeMoreButtons = page.getByRole('button', { name: /see more/i });
    this.mainContent = page.locator('#main-content');
  }

  getUrl(): string {
    return `${BASE_URL}/health-monitor`;
  }

  async isReady(): Promise<void> {
    await this.page.waitForLoadState('networkidle');
    await this.mainContent.isVisible();
  }

  async open(): Promise<void> {
    await this.page.goto(this.getUrl());
    await this.isReady();
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
