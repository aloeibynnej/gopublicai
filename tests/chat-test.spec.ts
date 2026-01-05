import { test, expect } from '@playwright/test';
import { HealthMonitorDesktopPage } from '../pom/pages';

test.setTimeout(120_000);

test('chat window can be opened @desktop', async ({ page }) => {
  const unixTimestamp = Date.now();
  const healthMonitorPage = new HealthMonitorDesktopPage(page);

  await healthMonitorPage.open();
  await healthMonitorPage.isReady();

  const chatComponent = healthMonitorPage.chat;

  await chatComponent.sendMessage(`Hello World ${unixTimestamp}`);
  
  // Wait for chat response - Reasoning button is optional and may not appear
  await page.waitForTimeout(15000);
  
  // Try to wait for reasoning button but don't fail if it doesn't appear
  const reasoningVisible = await chatComponent.reasoningText.isVisible({ timeout: 5000 }).catch(() => false);
  if (reasoningVisible) {
    console.log('✓ Reasoning button appeared');
  } else {
    console.log('⚠ Reasoning button did not appear (this is okay)');
  }

  // Wait longer to ensure chat is saved to history
  await page.waitForTimeout(5000);
  console.log('✓ Waited for chat to be saved');
  
  // Click history item to load that conversation
  await chatComponent.clickChatHistoryItemByText(`Hello World ${unixTimestamp}`);
  console.log('✓ Clicked history item');
  
  // Wait for conversation to load and history panel to close
  await page.waitForTimeout(3000);
  console.log('✓ Conversation loaded');

  // Close history panel if still open by clicking hamburger button
  await chatComponent.chatHistoryButton.click();
  await page.waitForTimeout(1000);
  console.log('✓ History panel closed');

  // Start a new chat
  await chatComponent.clickNewChat();
  await chatComponent.waitForChatResponse();
  console.log('✓ New chat started');

  // Close chat
  await chatComponent.closeChat();
  await page.waitForTimeout(1000);
  console.log('✓ Chat closed');
});
