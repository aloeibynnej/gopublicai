import { test, expect } from '@playwright/test';
import { SnapshotDesktopPage } from '../pom/pages';

test.describe('Snapshot Analysis Cards', () => {
  test.setTimeout(300_000); // 5 minutes for 4 cards with AI response waits

  // TODO: Chat history backend not implemented in Vercel environment yet
  // Skipping until "Failed to fetch chat history" is resolved
  test.skip('should click all 4 analysis cards and receive AI responses @desktop', async ({
    page,
  }) => {
    await page.setViewportSize({ width: 1728, height: 1117 });

    const snapshotPage = new SnapshotDesktopPage(page);
    await snapshotPage.open();
    await snapshotPage.isReady();

    // Close chat if it's already open from previous session
    const isChatOpen = await snapshotPage.chatComponent.isVisible();
    if (isChatOpen) {
      await snapshotPage.chatComponent.closeChat();
      await page.waitForTimeout(1000); // Wait for chat close animation
    }

    // === INVESTOR LENS CARD ===
    await expect(snapshotPage.investorLensCard).toBeVisible();
    await snapshotPage.clickAnalysisCard('investor');

    // Wait for chat to open and validate the question appears
    await page.waitForTimeout(3000); // Wait for chat open animation
    await snapshotPage.waitForChatQuestion(/(retail investors|hedge funds) perceive/i);

    // Wait for AI to generate response
    await page.waitForTimeout(12000); // AI response generation time

    // Close chat and refresh for clean state
    await snapshotPage.closeChatAndRefresh();

    // === PEER ANALYSIS CARD ===
    await expect(snapshotPage.peerAnalysisCard).toBeVisible();
    await snapshotPage.clickAnalysisCard('peer');

    await page.waitForTimeout(3000); // Wait for chat open animation
    await snapshotPage.waitForChatQuestion(/Which peers are performing better than/i);

    await page.waitForTimeout(12000); // AI response generation time

    await snapshotPage.closeChatAndRefresh();

    // === SECTOR ANALYSIS CARD ===
    await expect(snapshotPage.sectorAnalysisCard).toBeVisible();
    await snapshotPage.clickAnalysisCard('sector');

    await page.waitForTimeout(3000); // Wait for chat open animation
    await snapshotPage.waitForChatQuestion(
      /(underperforming|outperforming).*(sector|materials sector)/i
    );

    await page.waitForTimeout(12000); // AI response generation time

    await snapshotPage.closeChatAndRefresh();

    // === STOCK TECHNICALS CARD ===
    await expect(snapshotPage.stockTechnicalsCard).toBeVisible();
    await snapshotPage.clickAnalysisCard('technicals');

    await page.waitForTimeout(3000); // Wait for chat open animation
    await snapshotPage.waitForChatQuestion(/(volume|price) unusually low/i);

    await page.waitForTimeout(12000); // AI response generation time

    // Close chat (no refresh needed for last card)
    await snapshotPage.chatComponent.closeChat();
    await page.waitForTimeout(1000); // Wait for chat close animation
  });
});
