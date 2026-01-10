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
    console.log(`\n=== Testing chat deletion with message: "${testMessage}" ===`);

    // Close chat if it's already open from previous session
    const isChatOpen = await snapshotPage.chat.isVisible();
    if (isChatOpen) {
      await snapshotPage.chat.closeChat();
      await page.waitForTimeout(1000); // Wait for chat close animation
    }

    // === STEP 1: Wait for page to fully load ===
    console.log('\n=== Step 1: Waiting for page to fully load ===');
    
    // Wait for the "Ask Charlie..." input field to be visible and ready
    const chatInput = page.getByPlaceholder('Ask Charlie...');
    await chatInput.waitFor({ state: 'visible', timeout: 10000 });
    console.log('✓ "Ask Charlie..." input is visible');
    
    // Wait 5 seconds after input is visible before typing
    await page.waitForTimeout(5000);
    console.log('✓ Page fully loaded and stabilized');
    
    console.log('\n=== Sending test message to create chat ===');
    // Hover over input before clicking and typing
    await chatInput.hover();
    await page.waitForTimeout(200);
    await chatInput.click();
    await page.waitForTimeout(200);
    await chatInput.fill(testMessage);
    await chatInput.press('Enter');
    
    // Wait for chat window to automatically open and AI to start responding
    await page.waitForTimeout(8000); // Wait longer for chat to be created and saved
    console.log('✓ Test message sent and chat opened');
    
    // Navigate back to snapshot page (chat may have navigated to /chat)
    console.log('\n=== Navigating back to snapshot page ===');
    await snapshotPage.open();
    await snapshotPage.isReady();
    await page.waitForTimeout(3000); // Wait for page to stabilize and chat history to sync
    console.log('✓ Back on snapshot page');

    // === STEP 2: Open chat and then open chat history ===
    console.log('\n=== Step 2: Opening chat to access history ===');
    
    // Hover and click on the chat input to open chat overlay first
    const chatInputAgain = page.getByPlaceholder('Ask Charlie...');
    await chatInputAgain.hover();
    await page.waitForTimeout(200);
    await chatInputAgain.click();
    await page.waitForTimeout(1000); // Wait for chat overlay to open
    
    // Now open chat history
    console.log('\n=== Opening chat history panel ===');
    await snapshotPage.chat.openChatHistory();
    
    // Verify the test message appears in chat history
    // Chat history items are divs with the message text, not buttons with role
    const historyItem = page.locator('text=' + testMessage).first();
    await expect(historyItem).toBeVisible({ timeout: 10000 });
    console.log('✓ Test message found in chat history');

    // === STEP 3: Click on the chat history item to "activate" it ===
    console.log('\n=== Step 3: Activating chat by clicking on history item ===');
    await snapshotPage.chat.clickChatHistoryItemToActivate(testMessage);
    console.log('✓ Chat activated (history panel closed, chat loaded)');

    // === STEP 4: Open chat history again and click three-dot menu ===
    console.log('\n=== Step 4: Opening three-dot menu for chat ===');
    
    // Open chat history again
    const chatInputForHistory = page.getByPlaceholder('Ask Charlie...');
    await chatInputForHistory.click();
    await page.waitForTimeout(1000);
    
    await snapshotPage.chat.clickThreeDotMenuForChat(testMessage);
    console.log('✓ Three-dot menu opened');

    // === STEP 5: Click "Delete chat" option ===
    console.log('\n=== Step 5: Clicking "Delete chat" option ===');
    await snapshotPage.chat.clickDeleteChatOption();
    console.log('✓ Delete chat option clicked');

    // Wait for confirmation modal to appear
    await page.waitForTimeout(3000);
    
    // Verify confirmation modal appears
    const deleteButton = page.locator('button:has-text("DELETE CHAT"), button:has-text("NEVERMIND")').first();
    await expect(deleteButton).toBeVisible({ timeout: 10000 });
    console.log('✓ Confirmation modal appeared');

    // === STEP 6: Confirm deletion ===
    console.log('\n=== Step 6: Confirming chat deletion ===');
    await snapshotPage.chat.confirmDeleteChat();
    console.log('✓ Delete confirmed');

    // === STEP 7: Verify "CHAT DELETED" toast appears ===
    console.log('\n=== Step 7: Verifying deletion success toast ===');
    const toastVisible = await snapshotPage.chat.verifyChatDeletedToast();
    expect(toastVisible).toBe(true);
    console.log('✓ "CHAT DELETED" toast appeared');

    // Wait for toast to disappear
    await page.waitForTimeout(2000);

    // === STEP 8: Final validation - verify chat is no longer in history ===
    console.log('\n=== Step 8: Final validation - verifying chat is deleted from history ===');
    const chatNotInHistory = await snapshotPage.chat.verifyChatNotInHistory(testMessage);
    expect(chatNotInHistory).toBe(true);
    console.log('✓ Chat successfully deleted from history');

    console.log('\n=== Chat deletion test completed successfully ===');
  });
});
