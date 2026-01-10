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

  async openChatHistory(): Promise<void> {
    // TODO: Frontend should add data-testid="chat-history-button" to the dash button
    await this.chatHistoryButton.hover();
    await this.page.waitForTimeout(200);
    await this.chatHistoryButton.click();
    await this.page.waitForTimeout(500); // Wait for history panel animation
  }

  async clickChatHistoryItemToActivate(messageText: string): Promise<void> {
    // Click on chat history item to "activate" it (enables the three-dot menu)
    // TODO: Frontend should add data-testid to chat history items for more reliable selection
    // Chat history items are divs with inline-flex class, not buttons
    const historyItem = this.page.locator(`text=${messageText}`).first();
    await historyItem.hover();
    await this.page.waitForTimeout(200);
    await historyItem.click();
    await this.page.waitForTimeout(1000); // Wait for chat to load and history panel to close
  }

  async clickThreeDotMenuForChat(messageText: string): Promise<void> {
    // After activating the chat, open history again and click the three-dot menu
    await this.openChatHistory();
    await this.page.waitForTimeout(2000); // Wait for panel to open and three-dot to appear
    
    // TODO: Frontend should add data-testid="chat-options-menu" to the three-dot button
    // The three-dot menu button has aria-haspopup="menu" attribute
    const menuButton = this.page.locator('button[aria-haspopup="menu"]').first();
    await menuButton.hover();
    await this.page.waitForTimeout(200);
    await menuButton.click();
    await this.page.waitForTimeout(2000); // Wait for dropdown menu to appear
  }

  async clickDeleteChatOption(): Promise<void> {
    // TODO: Frontend should add data-testid="delete-chat-option" to the delete option
    // Click on "Delete chat" option in the dropdown menu
    // Try multiple selectors to find the delete option
    const possibleSelectors = [
      '[role="menuitem"]:has-text("Delete chat")',
      '[role="menu"] div:has-text("Delete chat")',
      'text=/Delete chat/i'
    ];
    
    for (const selector of possibleSelectors) {
      const option = this.page.locator(selector).first();
      const count = await option.count();
      if (count > 0 && await option.isVisible().catch(() => false)) {
        await option.hover({ force: true });
        await this.page.waitForTimeout(200);
        await option.click({ force: true });
        await this.page.waitForTimeout(2000);
        return;
      }
    }
    
    throw new Error('Could not find Delete chat option in dropdown menu');
  }

  async confirmDeleteChat(): Promise<void> {
    // TODO: Frontend should add data-testid="confirm-delete-chat" to the DELETE CHAT button
    // Click the red "DELETE CHAT" button in the confirmation modal
    const deleteButton = this.page.locator('button:has-text("DELETE CHAT"), button:has-text("Delete chat")').first();
    await deleteButton.hover();
    await this.page.waitForTimeout(200);
    await deleteButton.click();
    await this.page.waitForTimeout(1000); // Wait for deletion to complete and toast to appear
  }

  async verifyChatDeletedToast(): Promise<boolean> {
    // TODO: Frontend should add data-testid="chat-deleted-toast" to the success toast
    // Verify "CHAT DELETED" toast appears at bottom left
    const toast = this.page.locator('text=/CHAT DELETED/i').first();
    return await toast.isVisible();
  }

  async verifyChatNotInHistory(messageText: string): Promise<boolean> {
    // Verify the chat is no longer in the history list
    await this.openChatHistory();
    await this.page.waitForTimeout(500);
    
    const historyItem = this.page.locator('[role="button"]').filter({ hasText: messageText }).first();
    const count = await historyItem.count();
    return count === 0;
  }
}
