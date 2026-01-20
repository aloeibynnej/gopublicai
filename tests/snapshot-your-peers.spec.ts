import { test, expect } from '@playwright/test';
import { SnapshotDesktopPage } from '../pom/pages';

test.describe('Snapshot Your Peers Section', () => {
  test.setTimeout(60_000);

  // @TODO: Fix frontend
  test.skip('should display YOUR PEERS section and open chat with clicked news item text @desktop', async ({
    page,
  }) => {
    const snapshotPage = new SnapshotDesktopPage(page);

    await snapshotPage.open();
    await snapshotPage.isReady();

    const yourPeersVisible = await snapshotPage.isYourPeersHeadingVisible();
    expect(yourPeersVisible).toBe(true);

    const newsItemCount = await snapshotPage.getPeerNewsItems();
    expect(newsItemCount).toBeGreaterThan(0);

    // Capture the text before clicking
    const firstItemText = await snapshotPage.getPeerNewsItemText(0);
    expect(firstItemText).not.toBeNull();
    expect(firstItemText?.length).toBeGreaterThan(0);

    // Click the item (this also captures and returns the text)
    const capturedText = await snapshotPage.clickPeerNewsItem(0);
    expect(capturedText).toBe(firstItemText);

    // Verify chat opens with the captured text as the question
    const chatQuestionMatches = await snapshotPage.verifyChatQuestionMatches(capturedText!);
    expect(chatQuestionMatches).toBe(true);

    // Close chat for next test
    await snapshotPage.chatComponent.closeChat();
  });
});
