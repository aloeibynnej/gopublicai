import { test, expect } from '@playwright/test';
import { SnapshotDesktopPage } from '../pom/pages';

test.describe('Snapshot Delete Chat', () => {
  test.setTimeout(120_000); // 2 minutes for chat operations and deletion

  // TODO: Chat history backend not implemented in Vercel environment yet
  // Skipping until "Failed to fetch chat history" is resolved
  test.skip('should delete a chat conversation from history @desktop', async ({ page }) => {
    await page.setViewportSize({ width: 1728, height: 1117 });

    const snapshotPage = new SnapshotDesktopPage(page);
    await snapshotPage.open();
    await snapshotPage.isReady();

    // Generate unique test message using Unix timestamp
    const timestamp = Date.now();
    const testMessage = `E2E Test Delete Chat ${timestamp}`;

    // Close chat if it's already open from previous session
    const isChatOpen = await snapshotPage.chatComponent.isVisible();
    if (isChatOpen) {
      await snapshotPage.chatComponent.closeChat();
      await page.waitForTimeout(1000); // Wait for chat close animation
    }

    // Wait for the "Ask Charlie..." input field to be visible and ready
    const chatInput = page.getByPlaceholder('Ask Charlie...');
    await chatInput.waitFor({ state: 'visible', timeout: 10000 });

    // Wait 5 seconds after input is visible before typing
    await page.waitForTimeout(5000);

    // Hover over input before clicking and typing
    await chatInput.hover();
    await page.waitForTimeout(200);
    await chatInput.click();
    await page.waitForTimeout(200);
    await chatInput.fill(testMessage);
    await chatInput.press('Enter');

    // Wait for chat window to automatically open and AI to start responding
    await page.waitForTimeout(8000); // Wait longer for chat to be created and saved

    // Navigate back to snapshot page (chat may have navigated to /chat)
    await snapshotPage.open();
    await snapshotPage.isReady();
    await page.waitForTimeout(3000); // Wait for page to stabilize and chat history to sync

    // === STEP 2: Open chat and then open chat history ===

    // Hover and click on the chat input to open chat overlay first
    const chatInputAgain = page.getByPlaceholder('Ask Charlie...');
    await chatInputAgain.hover();
    await page.waitForTimeout(200);
    await chatInputAgain.click();
    await page.waitForTimeout(1000); // Wait for chat overlay to open

    // Now open chat history
    await snapshotPage.chatComponent.openChatHistory();

    // Verify the test message appears in chat history
    // Chat history items are divs with the message text, not buttons with role
    const historyItem = page.locator('text=' + testMessage).first();
    await expect(historyItem).toBeVisible({ timeout: 10000 });

    // === STEP 3: Click on the chat history item to "activate" it ===
    await snapshotPage.chatComponent.clickChatHistoryItemToActivate(testMessage);

    // === STEP 4: Open chat history again and click three-dot menu ===

    // Open chat history again
    const chatInputForHistory = page.getByPlaceholder('Ask Charlie...');
    await chatInputForHistory.click();
    await page.waitForTimeout(1000);

    await snapshotPage.chatComponent.clickThreeDotMenuForChat(testMessage);

    // === STEP 5: Click "Delete chat" option ===
    await snapshotPage.chatComponent.clickDeleteChatOption();

    // Wait for confirmation modal to appear
    await page.waitForTimeout(3000);

    // Verify confirmation modal appears
    const deleteButton = page
      .locator('button:has-text("DELETE CHAT"), button:has-text("NEVERMIND")')
      .first();
    await expect(deleteButton).toBeVisible({ timeout: 10000 });

    // === STEP 6: Confirm deletion ===
    await snapshotPage.chatComponent.confirmDeleteChat();

    // === STEP 7: Verify "CHAT DELETED" toast appears ===
    const toastVisible = await snapshotPage.chatComponent.verifyChatDeletedToast();
    expect(toastVisible).toBe(true);

    // Wait for toast to disappear
    await page.waitForTimeout(2000);

    // === STEP 8: Final validation - verify chat is no longer in history ===
    const chatNotInHistory = await snapshotPage.chatComponent.verifyChatNotInHistory(testMessage);
    expect(chatNotInHistory).toBe(true);
  });
});
