import { Page } from '@playwright/test';

export class ChatPage {
  readonly page: Page;

  constructor(page: Page) {
    this.page = page;
  }

  async open(): Promise<void> {
    await this.page.goto('https://staging.gopublic.ai/chat');
    await this.page.waitForTimeout(2000);
  }

  async findTestMessages(): Promise<number> {
    const testMessages = this.page.locator('text=/E2E Test Delete Chat \\d+/i');
    return await testMessages.count();
  }

  async clickFirstTestMessage(): Promise<string | null> {
    const testMessages = this.page.locator('text=/E2E Test Delete Chat \\d+/i');
    const firstMessage = testMessages.first();
    const messageText = await firstMessage.textContent();
    
    if (messageText) {
      await firstMessage.hover();
      await this.page.waitForTimeout(200);
      await firstMessage.click();
      await this.page.waitForTimeout(1000);
    }
    
    return messageText;
  }

  async clickThreeDotMenu(): Promise<void> {
    // TODO: Frontend should add data-testid="chat-row-menu-button"
    const menuButton = this.page.locator('button[aria-haspopup="menu"]').first();
    await menuButton.hover();
    await this.page.waitForTimeout(200);
    await menuButton.click();
    await this.page.waitForTimeout(2000);
  }

  async clickDeleteChatOption(): Promise<void> {
    // TODO: Frontend should add data-testid="delete-chat-menu-item"
    // The delete option is in a radix dropdown menu with role="menuitem"
    const deleteChatOption = this.page.locator('[role="menuitem"]').filter({ hasText: 'Delete chat' }).first();
    await deleteChatOption.hover({ force: true });
    await this.page.waitForTimeout(200);
    await deleteChatOption.click({ force: true });
    await this.page.waitForTimeout(3000);
  }

  async confirmDeletion(): Promise<boolean> {
    // TODO: Frontend should add data-testid="confirm-delete-button"
    const deleteButton = this.page.locator('button:has-text("DELETE CHAT")').first();
    const isVisible = await deleteButton.isVisible({ timeout: 10000 }).catch(() => false);
    
    if (isVisible) {
      await deleteButton.hover();
      await this.page.waitForTimeout(200);
      await deleteButton.click();
      await this.page.waitForTimeout(2000);
      return true;
    }
    
    return false;
  }

  async deleteFirstTestMessage(): Promise<boolean> {
    const messageText = await this.clickFirstTestMessage();
    
    if (!messageText) {
      return false;
    }

    console.log(`Deleting: "${messageText}"`);
    
    await this.clickThreeDotMenu();
    console.log('✓ Three-dot menu opened');
    
    await this.clickDeleteChatOption();
    console.log('✓ Delete chat clicked');
    
    const confirmed = await this.confirmDeletion();
    
    if (confirmed) {
      console.log('✓ Deletion confirmed');
      await this.page.waitForTimeout(2000);
      return true;
    } else {
      console.log('⚠ Confirmation modal did not appear');
      return false;
    }
  }
}
