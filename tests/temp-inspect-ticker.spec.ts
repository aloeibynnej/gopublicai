import { test } from '@playwright/test';
import { SnapshotDesktopPage } from '../pom/pages';

test.skip('inspect ticker switcher DOM @desktop', async ({ page }) => {
  const snapshotPage = new SnapshotDesktopPage(page);
  await snapshotPage.open();

  const html = await page.content();
  console.log('=== PAGE HTML ===');
  console.log(html);

  await page.pause();
});
