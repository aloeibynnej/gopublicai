import { test } from '@playwright/test';
import { ChatPage } from '../pom/pages/chat.page';

test.describe('Cleanup Test Chats', () => {
  test('should delete all E2E Test Delete Chat messages from history @desktop', async ({ page }) => {
    test.setTimeout(300000); // 5 minutes timeout for cleanup
    const chatPage = new ChatPage(page);
    
    console.log('\n=== Starting cleanup of E2E test chat messages ===');

    let deletedCount = 0;
    let maxIterations = 50;
    let iteration = 0;

    while (iteration < maxIterations) {
      iteration++;
      console.log(`\n--- Iteration ${iteration} ---`);

      await chatPage.open();

      const count = await chatPage.findTestMessages();

      if (count === 0) {
        console.log('✓ No more E2E test messages found. Cleanup complete!');
        break;
      }

      console.log(`Found ${count} E2E test message(s) to delete`);

      const deleted = await chatPage.deleteFirstTestMessage();
      
      if (deleted) {
        deletedCount++;
      }
    }

    if (iteration >= maxIterations) {
      console.log(`\n⚠ Reached maximum iterations (${maxIterations}). Stopping cleanup.`);
    }

    console.log(`\n=== Cleanup complete! Deleted ${deletedCount} test message(s) ===`);
  });
});
