import { test, expect } from '@playwright/test';
import { HealthMonitorPage } from '../pom/pages';

test.setTimeout(60_000);

test('chat window can be opened @desktop', async ({ page }) => {
  const unixTimestamp = Date.now();
  const healthMonitorPage = new HealthMonitorPage(page);

  await healthMonitorPage.open();
  await healthMonitorPage.isReady();

  const chatComponent = healthMonitorPage.chat;

  await chatComponent.sendMessage(`Hello World ${unixTimestamp}`);
  await chatComponent.reasoningText.waitFor({ state: 'visible' });

  await page.reload();

  await healthMonitorPage.isReady();
  await chatComponent.clickChatHistoryItemByText(`Hello World ${unixTimestamp}`);
  await expect(page.locator('text=Hello World ' + unixTimestamp)).toBeVisible();

  await chatComponent.clickNewChat();
  await chatComponent.waitForChatResponse();

  await chatComponent.closeChat();
  await expect(page.locator('text=Hello World ' + unixTimestamp)).not.toBeVisible();
});
