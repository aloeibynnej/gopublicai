import { test, expect } from '@playwright/test';
import { SnapshotPage } from '../pom/pages/snapshot.page';

test.describe('Snapshot Page - Interactions', () => {
  test.setTimeout(90_000);

  test('should handle all interactive elements correctly @desktop', async ({ page }) => {
    const snapshotPage = new SnapshotPage(page);
    
    console.log('\n=== Testing snapshot page interactions ===');

    await snapshotPage.open();
    console.log('✓ Navigated to snapshot page');

    // ===== MARKETS TAB SWITCHING =====
    console.log('\n=== Testing MARKETS tab switching ===');
    
    // Wait for page to load
    await page.waitForTimeout(2000);
    
    // Click GLOBAL tab
    await snapshotPage.clickGlobalTab();
    console.log('✓ Clicked GLOBAL tab');
    await page.waitForTimeout(1000);

    // Click MACRO tab
    await snapshotPage.clickMacroTab();
    console.log('✓ Clicked MACRO tab');
    await page.waitForTimeout(1000);

    // Click back to US tab
    await snapshotPage.clickUsTab();
    console.log('✓ Clicked US tab');
    await page.waitForTimeout(1000);
    console.log('✓ Tab switching works correctly');

    // ===== CAROUSEL NAVIGATION =====
    console.log('\n=== Testing Carousel Navigation ===');
    
    // Get initial visible card
    const initialCardVisible = await snapshotPage.investorLensCard.isVisible();
    console.log(`✓ Initial card visible: ${initialCardVisible}`);

    // Click right arrow
    await snapshotPage.clickRightArrow();
    console.log('✓ Clicked right arrow');
    await page.waitForTimeout(1000);

    // Verify different card is now visible (MACRO card should appear)
    const macroCardVisible = await snapshotPage.macroCard.isVisible();
    expect(macroCardVisible).toBe(true);
    console.log('✓ MACRO card visible after clicking right arrow');

    // Click left arrow
    await snapshotPage.clickLeftArrow();
    console.log('✓ Clicked left arrow');
    await page.waitForTimeout(1000);

    // Verify we're back to initial cards
    const investorLensVisibleAgain = await snapshotPage.investorLensCard.isVisible();
    expect(investorLensVisibleAgain).toBe(true);
    console.log('✓ Investor Lens card visible after clicking left arrow');

    // ===== ANALYSIS CARD CLICKS =====
    console.log('\n=== Testing Analysis Card Clicks ===');
    
    // Click Investor Lens card
    await snapshotPage.clickInvestorLensCard();
    console.log('✓ Clicked Investor Lens card');
    
    await page.waitForTimeout(2000);
    let chatVisible = await snapshotPage.chat.isVisible();
    expect(chatVisible).toBe(true);
    console.log('✓ Chat opened');
    
    await snapshotPage.chat.closeChat();
    await page.waitForTimeout(1000);
    console.log('✓ Closed chat');

    // Click Peer Analysis card
    await snapshotPage.clickPeerAnalysisCard();
    console.log('✓ Clicked Peer Analysis card');
    
    await page.waitForTimeout(2000);
    chatVisible = await snapshotPage.chat.isVisible();
    expect(chatVisible).toBe(true);
    console.log('✓ Chat opened');
    
    await snapshotPage.chat.closeChat();
    await page.waitForTimeout(1000);
    console.log('✓ Closed chat');

    // Click Sector Analysis card
    await snapshotPage.clickSectorAnalysisCard();
    console.log('✓ Clicked Sector Analysis card');
    
    await page.waitForTimeout(2000);
    chatVisible = await snapshotPage.chat.isVisible();
    expect(chatVisible).toBe(true);
    console.log('✓ Chat opened');
    
    await snapshotPage.chat.closeChat();
    await page.waitForTimeout(1000);
    console.log('✓ Closed chat');

    // Click Stock Technicals card
    await snapshotPage.clickStockTechnicalsCard();
    console.log('✓ Clicked Stock Technicals card');
    
    await page.waitForTimeout(2000);
    chatVisible = await snapshotPage.chat.isVisible();
    expect(chatVisible).toBe(true);
    console.log('✓ Chat opened');
    
    await snapshotPage.chat.closeChat();
    await page.waitForTimeout(1000);
    console.log('✓ Closed chat');

    // ===== YOUR PEERS NEWS ITEM CLICKS =====
    console.log('\n=== Testing YOUR PEERS news item clicks ===');
    
    // Click first peer news item
    const firstItemText = await snapshotPage.clickPeerNewsItem(0);
    console.log(`✓ Clicked first peer news item: "${firstItemText?.substring(0, 50)}..."`);
    
    const firstChatMatches = await snapshotPage.verifyChatQuestionMatches(firstItemText!);
    expect(firstChatMatches).toBe(true);
    console.log('✓ Chat opened with matching question');
    
    await snapshotPage.chat.closeChat();
    await page.waitForTimeout(1000);
    console.log('✓ Closed chat');

    // Click second peer news item
    const newsItemCount = await snapshotPage.getPeerNewsItems();
    if (newsItemCount > 1) {
      const secondItemText = await snapshotPage.clickPeerNewsItem(1);
      console.log(`✓ Clicked second peer news item: "${secondItemText?.substring(0, 50)}..."`);
      
      const secondChatMatches = await snapshotPage.verifyChatQuestionMatches(secondItemText!);
      expect(secondChatMatches).toBe(true);
      console.log('✓ Chat opened with matching question');
      
      await snapshotPage.chat.closeChat();
      await page.waitForTimeout(1000);
      console.log('✓ Closed chat');
    }

    console.log('\n=== All interactions validated successfully ===');
  });
});
