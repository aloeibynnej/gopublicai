import { test, expect } from '@playwright/test';
import { SnapshotDesktopPage } from '../pom/pages';

test.describe('Snapshot Your Peers Section', () => {
  test.setTimeout(60_000);

  test('should display YOUR PEERS section and open chat with clicked news item text @desktop', async ({ page }) => {
    const snapshotPage = new SnapshotDesktopPage(page);
    
    console.log('\n=== Testing YOUR PEERS section on snapshot page ===');

    await snapshotPage.open();
    console.log('✓ Navigated to snapshot page');

    console.log('\n=== Verifying YOUR PEERS section ===');
    
    const yourPeersVisible = await snapshotPage.isYourPeersHeadingVisible();
    expect(yourPeersVisible).toBe(true);
    console.log('✓ YOUR PEERS heading is visible');

    const newsItemCount = await snapshotPage.getPeerNewsItems();
    console.log(`✓ Found ${newsItemCount} peer news items`);
    expect(newsItemCount).toBeGreaterThan(0);

    console.log('\n=== Testing peer news item click and chat interaction ===');
    
    // Test first peer news item
    console.log('Testing first peer news item...');
    
    // Capture the text before clicking
    const firstItemText = await snapshotPage.getPeerNewsItemText(0);
    console.log(`✓ Captured first news item text: "${firstItemText}"`);
    expect(firstItemText).not.toBeNull();
    expect(firstItemText?.length).toBeGreaterThan(0);

    // Click the item (this also captures and returns the text)
    const capturedText = await snapshotPage.clickPeerNewsItem(0);
    console.log(`✓ Clicked first peer news item`);
    expect(capturedText).toBe(firstItemText);

    // Verify chat opens with the captured text as the question
    const chatQuestionMatches = await snapshotPage.verifyChatQuestionMatches(capturedText!);
    expect(chatQuestionMatches).toBe(true);
    console.log(`✓ Chat opened with question matching clicked news item: "${capturedText}"`);

    // Close chat for next test
    await snapshotPage.chat.closeChat();
    await page.waitForTimeout(1000);
    console.log('✓ Closed chat');

    console.log('\n=== Testing second peer news item (if available) ===');
    
    if (newsItemCount > 1) {
      // Test second peer news item
      const secondItemText = await snapshotPage.getPeerNewsItemText(1);
      console.log(`✓ Captured second news item text: "${secondItemText}"`);
      
      const secondCapturedText = await snapshotPage.clickPeerNewsItem(1);
      console.log(`✓ Clicked second peer news item`);
      
      const secondChatQuestionMatches = await snapshotPage.verifyChatQuestionMatches(secondCapturedText!);
      expect(secondChatQuestionMatches).toBe(true);
      console.log(`✓ Chat opened with question matching second news item: "${secondCapturedText}"`);
      
      await snapshotPage.chat.closeChat();
      await page.waitForTimeout(1000);
      console.log('✓ Closed chat');
    } else {
      console.log('⚠ Only one peer news item available, skipping second item test');
    }

    console.log('\n=== YOUR PEERS section test completed successfully ===');
  });
});
