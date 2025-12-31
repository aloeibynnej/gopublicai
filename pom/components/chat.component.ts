import { Locator, Page } from '@playwright/test';

export class ChatComponent {
  readonly container: Locator;
  private readonly newChatButton: Locator;
  private readonly chatInput: Locator;
  private readonly sendButton: Locator;
  private readonly chatHistoryItems: Locator;
  private readonly closeButton: Locator;
  private readonly chatTriggerButton: Locator;
  readonly reasoningText: Locator;
  readonly chatHistoryButton: Locator;
  readonly chatResponseText: Locator;

  constructor(
    private readonly page: Page,
    rootSelector: string = '[role="dialog"]'
  ) {
    // Using role="dialog" for semantic HTML - chat overlay should have proper ARIA role
    this.container = this.page.locator(rootSelector);
    this.newChatButton = this.container.locator('button:has-text("NEW CHAT"), [role="button"]:has-text("NEW CHAT")').first();
    this.chatInput = this.page.getByPlaceholder('Ask Charlie...');
    this.sendButton = this.page.locator('button[type="submit"]');
    this.chatHistoryItems = this.page.locator('[role="button"][aria-label^="Chat from"]');
    this.closeButton = this.page.getByRole('button', { name: 'Close chat' });
    this.chatTriggerButton = this.page.locator('button:has-text("Charlie"), button[aria-label*="Charlie"], button[data-testid*="chat-trigger"], [class*="chat"][class*="button"], [class*="fab"]').first();
    this.reasoningText = this.page.getByText('Reasoning').first();
    this.chatHistoryButton = this.page.getByRole('button', { name: 'Open chat history' });
    this.chatResponseText = this.page.getByText(/Good (morning|afternoon|evening|day|night),.*Your/i).first();
  }

  async isVisible(): Promise<boolean> {
    return await this.container.isVisible();
  }

  async waitForComponent(): Promise<void> {
    await this.container.waitFor({ state: 'visible' });
  }

  async openChat(): Promise<void> {
    const isVisible = await this.isVisible();
    if (!isVisible) {
      const possibleSelectors = [
        'button:has-text("Charlie")',
        'button[aria-label*="Charlie" i]',
        'button[aria-label*="chat" i]',
        'button[data-testid*="chat"]',
        '[class*="fixed"][class*="bottom"] button',
        '[class*="floating"] button',
        'button[class*="fab"]'
      ];
      
      for (const selector of possibleSelectors) {
        const button = this.page.locator(selector).first();
        const count = await button.count();
        if (count > 0 && await button.isVisible()) {
          await button.click();
          await this.page.waitForTimeout(1000);
          const nowVisible = await this.isVisible();
          if (nowVisible) {
            return;
          }
        }
      }
      
      throw new Error('Could not find chat trigger button. Please add a data-testid to the chat trigger button.');
    }
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
    await this.openChat();
    await this.chatHistoryButton.click();
    await this.page.locator(`[role="button"]`).filter({ hasText: text }).first().click();
  }

  async closeChat(): Promise<void> {
    // The close button is in the top-right corner of the chat overlay
    // Click at approximate coordinates where X button should be (based on 1728x1117 viewport)
    await this.page.mouse.click(1680, 80);
    await this.page.waitForTimeout(500);
  }

  async waitForChatResponse(): Promise<void> {
    await this.page.waitForTimeout(5_000);
    await this.chatResponseText.isVisible();
  }

  async isChatInputEnabled(): Promise<boolean> {
    return await this.chatInput.isEnabled();
  }

  async getChatInputPlaceholder(): Promise<string> {
    return (await this.chatInput.getAttribute('placeholder')) || '';
  }
}
