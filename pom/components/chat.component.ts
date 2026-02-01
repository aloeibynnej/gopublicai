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
  readonly chatResponseText: Locator;

  constructor(
    private readonly page: Page,
    rootSelector: string = '[role="dialog"], .chat-popup'
  ) {
    // Chat popup is div.chat-popup; some apps also use role="dialog"
    this.container = this.page.locator(rootSelector).first();
    // New chat: div.chat-header-button containing span "New chat" (not a <button>); second header button
    this.newChatButton = this.container.locator('.chat-header-button').filter({ hasText: 'New chat' }).first();
    this.chatInput = this.page.getByPlaceholder('Ask Charlie...');
    this.sendButton = this.page.locator('button[type="submit"]');
    this.chatHistoryItems = this.page.locator('[role="button"][aria-label^="Chat from"]');
    // Close: third .chat-header-button (not history, not "New chat"); often icon-only
    this.closeButton = this.container
      .locator('.chat-header-button')
      .filter({ hasNot: this.page.locator('[aria-haspopup="dialog"]') })
      .filter({ hasNotText: 'New chat' })
      .first();
    this.reasoningText = this.page.getByRole('button', { name: 'Reasoning' }).first();
    // History control: the header button that opens history (has aria-haspopup="dialog"); single locator to avoid strict-mode violation
    this.chatHistoryButton = this.container.locator('.chat-header-button:has([aria-haspopup="dialog"])').first();
    this.chatResponseText = this.page.getByText('Good morning, Michal. Your').first();
  }

  async isVisible(): Promise<boolean> {
    return await this.container.isVisible();
  }

  async waitForComponent(): Promise<void> {
    await this.container.waitFor({ state: 'visible' });
  }

  async clickNewChat(timeoutMs = 15_000): Promise<void> {
    await this.newChatButton.waitFor({ state: 'visible', timeout: timeoutMs });
    await this.newChatButton.click({ timeout: timeoutMs });
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

  async clickChatHistoryItemByText(text: string, timeoutMs = 30_000): Promise<void> {
    await this.chatInput.waitFor({ state: 'visible', timeout: timeoutMs });
    await this.chatInput.click();
    // Give overlay time to open (animation / render)
    await this.page.waitForTimeout(2_000);

    await this.container.waitFor({ state: 'visible', timeout: timeoutMs });
    // History control can be disabled (data-state="closed"); wait visible then force click so we don't block on enabled
    await this.chatHistoryButton.waitFor({ state: 'visible', timeout: timeoutMs });
    await this.chatHistoryButton.click({ force: true, timeout: 5_000 });
    // Wait for history panel to open and list to load (may fetch from API)
    await this.page.waitForTimeout(3_000);
    // History item: try buttons first; fallback to any element in chat popup containing the text (e.g. div/li)
    const historyItemByAria = this.chatHistoryItems.filter({ hasText: text }).first();
    const historyItemByButton = this.page.getByRole('button').filter({ hasText: text }).first();
    const historyItemByText = this.container.getByText(text, { exact: false }).first();
    const historyItem = historyItemByAria.or(historyItemByButton).or(historyItemByText).first();
    await historyItem.waitFor({ state: 'visible', timeout: timeoutMs });
    await historyItem.click({ timeout: 10_000 });
  }

  async closeChat(timeoutMs = 15_000): Promise<void> {
    await this.closeButton.waitFor({ state: 'visible', timeout: timeoutMs });
    await this.closeButton.click({ timeout: timeoutMs });
  }

  async waitForChatResponse(): Promise<void> {
    await this.page.waitForTimeout(5_000);
    await this.chatResponseText.isVisible();
  }

  /**
   * Waits for the AI response to be ready after sending a message.
   * Resolves when any of: "Reasoning" button appears, chat response text is visible,
   * or the send button becomes enabled again (often disabled while the AI is responding).
   */
  async waitForResponseReady(timeoutMs = 60_000): Promise<void> {
    await Promise.race([
      this.reasoningText.waitFor({ state: 'visible', timeout: timeoutMs }),
      (async () => {
        await this.page.waitForTimeout(10_000);
        await this.chatResponseText.waitFor({ state: 'visible', timeout: timeoutMs - 10_000 });
      })(),
      (async () => {
        await this.page.waitForTimeout(8_000);
        // Wait for send button in chat dialog to be enabled (UI often disables it while generating)
        await this.page.waitForFunction(
          () => {
            const btn = document.querySelector('.chat-popup button[type="submit"], [role="dialog"] button[type="submit"]');
            return btn !== null && !(btn as HTMLButtonElement).disabled;
          },
          { timeout: timeoutMs - 8_000 }
        );
      })(),
    ]);
  }

  async isChatInputEnabled(): Promise<boolean> {
    return await this.chatInput.isEnabled();
  }

  async getChatInputPlaceholder(): Promise<string> {
    return (await this.chatInput.getAttribute('placeholder')) || '';
  }
}
