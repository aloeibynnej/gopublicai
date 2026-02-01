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
  // Fixed wait for AI response (matches pattern in snapshot-analysis-cards, snapshot-delete-chat)
  await page.waitForTimeout(20_000);

  await page.reload();

  await healthMonitorPage.isReady();
  await chatComponent.clickChatHistoryItemByText(`Hello World ${unixTimestamp}`);
  await expect(page.locator('text=Hello World ' + unixTimestamp)).toBeVisible({ timeout: 15_000 });

  await chatComponent.clickNewChat();
  await chatComponent.waitForChatResponse();

  await chatComponent.closeChat();
  await expect(page.locator('text=Hello World ' + unixTimestamp)).not.toBeVisible();
});
