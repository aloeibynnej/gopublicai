import { Locator, Page } from '@playwright/test';

export class ChatComponent {
  private readonly container: Locator;
  private readonly newChatButton: Locator;
  private readonly chatInput: Locator;
  private readonly sendButton: Locator;
  private readonly chatHistoryItems: Locator;
  private readonly closeButton: Locator;
  readonly reasoningText: Locator;
  readonly chatHistoryButton: Locator;
  constructor(
    private readonly page: Page,
    rootSelector: string = '[role="dialog"]'
  ) {
    this.container = this.page.locator(rootSelector);
    this.newChatButton = this.page.getByRole('button', { name: /new chat/ });
    this.chatInput = this.page.getByPlaceholder('Ask Charlie...');
    this.sendButton = this.page.locator('button[type="submit"]');
    this.chatHistoryItems = this.page.locator('[role="button"][aria-label^="Chat from"]');
    this.closeButton = this.page.getByRole('button', { name: /close/ });
    this.reasoningText = this.page.getByRole('button', { name: 'Reasoning' });
    this.chatHistoryButton = this.page.getByRole('button', { name: 'Open chat history' });
  }

  async isVisible(): Promise<boolean> {
    return await this.container.isVisible();
  }

  async waitForComponent(): Promise<void> {
    await this.container.waitFor({ state: 'visible' });
  }

  async clickNewChat(): Promise<void> {
    await this.newChatButton.click();
  }

  async sendMessage(message: string): Promise<void> {
    await this.chatInput.fill(message);
    await this.sendButton.click();
  }

  async getChatHistoryCount(): Promise<number> {
    return await this.chatHistoryItems.count();
  }

  async getChatHistoryItemText(index: number): Promise<string> {
    const item = this.chatHistoryItems.nth(index);
    return (await item.textContent()) || '';
  }

  async clickChatHistoryItem(index: number): Promise<void> {
    await this.chatHistoryButton.click();
    await this.chatHistoryItems.nth(index).click();
    await this.container.waitFor({ state: 'visible' });
  }

  async clickChatHistoryItemByText(text: string): Promise<void> {
    await this.chatInput.click();
    await this.chatHistoryButton.click();
    await this.page.locator(`[role="button"]`).filter({ hasText: text }).first().click();
  }

  async closeChat(): Promise<void> {
    await this.closeButton.click();
  }

  async waitForChatResponse(): Promise<void> {
    await this.page.waitForTimeout(5_000);
  }

  async isChatInputEnabled(): Promise<boolean> {
    return await this.chatInput.isEnabled();
  }

  async getChatInputPlaceholder(): Promise<string> {
    return (await this.chatInput.getAttribute('placeholder')) || '';
  }
}
