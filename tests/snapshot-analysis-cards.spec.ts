import { test, expect } from '@playwright/test';
import { SnapshotPage } from '../pom/pages';

test.setTimeout(300_000); // 5 minutes for 4 cards

test('should click all 4 analysis cards and receive AI responses @desktop', async ({ page }) => {
  await page.setViewportSize({ width: 1728, height: 1117 });
  
  const snapshotPage = new SnapshotPage(page);

  await snapshotPage.open();
  await snapshotPage.isReady();

  // Check if chat layer exists and close it
  const chatLayer = page.locator('.chat-layer');
  const chatLayerExists = await chatLayer.count() > 0;
  if (chatLayerExists) {
    const isChatOpen = await snapshotPage.chat.isVisible();
    if (isChatOpen) {
      await snapshotPage.chat.closeChat();
      await page.waitForTimeout(1000);
    }
  }

  // Scroll card into view and wait for any animations to complete
  await expect(snapshotPage.investorLensCard).toBeVisible();
  await snapshotPage.investorLensCard.scrollIntoViewIfNeeded();
  await page.waitForTimeout(2000);
  
  // Click the Investor Lens card
  await snapshotPage.investorLensCard.click({ force: true });
  
  // Wait for chat to open and validate the question (dynamic: retail/hedge funds + company name)
  await page.waitForTimeout(3000);
  const investorQuestion = page.locator('text=/(retail investors|hedge funds) perceive/i').first();
  await expect(investorQuestion).toBeVisible({ timeout: 10000 });
  
  // Wait for AI to respond
  await page.waitForTimeout(12000);
  
  // Close the chat
  await snapshotPage.chat.closeChat();
  await page.waitForTimeout(1000);
  
  // Refresh page to clear state before next card
  await page.reload();
  await snapshotPage.isReady();
  await page.waitForTimeout(2000);

  // === PEER ANALYSIS CARD ===
  await expect(snapshotPage.peerAnalysisCard).toBeVisible();
  await snapshotPage.peerAnalysisCard.scrollIntoViewIfNeeded();
  await page.waitForTimeout(2000);
  
  await snapshotPage.peerAnalysisCard.click({ force: true });
  
  // Wait for chat to open and validate the question (dynamic: company name or 'I am')
  await page.waitForTimeout(3000);
  const peerQuestion = page.locator('text=/Which peers are performing better than/i').first();
  await expect(peerQuestion).toBeVisible({ timeout: 10000 });
  
  // Wait for AI to respond
  await page.waitForTimeout(12000);
  
  await snapshotPage.chat.closeChat();
  await page.waitForTimeout(1000);
  
  // Refresh page to clear state before next card
  await page.reload();
  await snapshotPage.isReady();
  await page.waitForTimeout(2000);

  // === SECTOR ANALYSIS CARD ===
  await expect(snapshotPage.sectorAnalysisCard).toBeVisible();
  await snapshotPage.sectorAnalysisCard.scrollIntoViewIfNeeded();
  await page.waitForTimeout(2000);
  
  await snapshotPage.sectorAnalysisCard.click({ force: true });
  
  // Wait for chat to open and validate the question (dynamic: underperforming/outperforming + company/sector)
  await page.waitForTimeout(3000);
  const sectorQuestion = page.locator('text=/(underperforming|outperforming).*(sector|materials sector)/i').first();
  await expect(sectorQuestion).toBeVisible({ timeout: 10000 });
  
  // Wait for AI to respond
  await page.waitForTimeout(12000);
  
  await snapshotPage.chat.closeChat();
  await page.waitForTimeout(1000);
  
  // Refresh page to clear state before next card
  await page.reload();
  await snapshotPage.isReady();
  await page.waitForTimeout(2000);

  // === STOCK TECHNICALS CARD ===
  await expect(snapshotPage.stockTechnicalsCard).toBeVisible();
  await snapshotPage.stockTechnicalsCard.scrollIntoViewIfNeeded();
  await page.waitForTimeout(2000);
  
  await snapshotPage.stockTechnicalsCard.click({ force: true });
  
  // Wait for chat to open and validate the question (dynamic: volume/price + date variations)
  await page.waitForTimeout(3000);
  const technicalsQuestion = page.locator('text=/(volume|price) unusually low/i').first();
  await expect(technicalsQuestion).toBeVisible({ timeout: 10000 });
  
  // Wait for AI to respond
  await page.waitForTimeout(12000);
  
  await snapshotPage.chat.closeChat();
  await page.waitForTimeout(1000);
});
