import { test, expect } from '@playwright/test';
import { HealthMonitorPage } from '../pom/pages/health-monitor.page';

test.setTimeout(60_000);

test('chat window can be opened @desktop', async ({ page }) => {
  const unixTimestamp = Date.now();
  const healthMonitorPage = new HealthMonitorPage(page);

  await healthMonitorPage.open();
  await healthMonitorPage.isReady();

  await healthMonitorPage.chat.sendMessage(`Hello World ${unixTimestamp}`);
  await healthMonitorPage.chat.reasoningText.waitFor({ state: 'visible' });

  await healthMonitorPage.chat.waitForChatResponse();
  await page.reload();
  await healthMonitorPage.isReady();
  await healthMonitorPage.chat.clickChatHistoryItemByText(`Hello World ${unixTimestamp}`);

  await expect(page.locator('text=Hello World ' + unixTimestamp)).toBeVisible();
});
