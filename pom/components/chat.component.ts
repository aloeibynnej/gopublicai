import { Locator, Page } from '@playwright/test';

export class ChatComponent {
  private readonly container: Locator;
  private readonly newChatButton: Locator;
  private readonly chatInput: Locator;
  private readonly sendButton: Locator;
  private readonly chatHistoryItems: Locator;
  private readonly closeButton: Locator;

  constructor(
    private readonly page: Page,
    rootSelector: string = '[role="dialog"]'
  ) {
    this.container = page.locator(rootSelector);
    this.newChatButton = this.container.getByRole('button', { name: /new chat/i });
    this.chatInput = this.container.getByPlaceholder('Ask Charlie...');
    this.sendButton = this.container.locator('button[type="submit"]');
    this.chatHistoryItems = this.container.locator('[role="button"][aria-label^="Chat from"]');
    this.closeButton = this.container.getByRole('button', { name: /close/i });
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
    await this.chatHistoryItems.nth(index).click();
  }

  async clickChatHistoryItemByText(text: string): Promise<void> {
    await this.container.getByRole('button', { name: new RegExp(text, 'i') }).click();
  }

  async closeChat(): Promise<void> {
    await this.closeButton.click();
  }

  async waitForChatResponse(): Promise<void> {
    await this.page.waitForTimeout(1000);
  }

  async isChatInputEnabled(): Promise<boolean> {
    return await this.chatInput.isEnabled();
  }

  async getChatInputPlaceholder(): Promise<string> {
    return (await this.chatInput.getAttribute('placeholder')) || '';
  }
}
