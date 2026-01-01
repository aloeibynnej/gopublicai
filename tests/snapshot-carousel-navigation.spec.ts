import { test, expect } from '@playwright/test';
import { SnapshotPage } from '../pom/pages';

test.describe('Snapshot Carousel Navigation', () => {
  test('should navigate through carousel positions using arrow buttons @desktop', async ({ page }) => {
    test.setTimeout(120_000);
    
    await page.setViewportSize({ width: 1728, height: 1117 });
    
    const snapshotPage = new SnapshotPage(page);
    await snapshotPage.open();
    await snapshotPage.isReady();

    // Scroll to the analysis cards section
    await snapshotPage.investorLensCard.scrollIntoViewIfNeeded();
    await page.waitForTimeout(1000);

    // === POSITION 1: LEFT (Default) ===
    console.log('\n=== Testing LEFT position (default) ===');
    
    // Verify initial cards are visible (first 4 cards)
    await expect(snapshotPage.investorLensCard).toBeVisible();
    await expect(snapshotPage.peerAnalysisCard).toBeVisible();
    await expect(snapshotPage.sectorAnalysisCard).toBeVisible();
    await expect(snapshotPage.stockTechnicalsCard).toBeVisible();
    
    // Get initial carousel transform to validate sliding
    const carouselContainer = page.locator('.embla__container').first();
    const initialTransform = await carouselContainer.evaluate(el => 
      window.getComputedStyle(el).transform
    );
    console.log('Initial carousel transform:', initialTransform);
    
    console.log('LEFT position validated - first 4 cards visible');
    
    // Take screenshot of LEFT position
    await page.screenshot({ path: 'carousel-left.png' });

    // === POSITION 2: MIDDLE ===
    console.log('\n=== Clicking RIGHT arrow to move to MIDDLE position ===');
    
    await snapshotPage.clickRightArrow();
    // Wait for carousel animation to complete (cards move fast, slider indicator catches up)
    await page.waitForTimeout(2500);
    
    // Validate carousel slid by checking transform changed
    const middleTransform = await carouselContainer.evaluate(el => 
      window.getComputedStyle(el).transform
    );
    console.log('Carousel transform after 1st click:', middleTransform);
    expect(middleTransform).not.toBe(initialTransform);
    console.log('✓ Carousel slid to MIDDLE - transform changed');
    
    // Take screenshot of MIDDLE position
    await page.screenshot({ path: 'carousel-middle.png' });

    // === POSITION 3: RIGHT ===
    console.log('\n=== Clicking RIGHT arrow again to move to RIGHT position ===');
    
    await snapshotPage.clickRightArrow();
    // Wait for carousel animation to complete (cards move fast, slider indicator catches up)
    await page.waitForTimeout(2500);
    
    // Validate carousel slid further by checking transform changed again
    const rightTransform = await carouselContainer.evaluate(el => 
      window.getComputedStyle(el).transform
    );
    console.log('Carousel transform after 2nd click:', rightTransform);
    expect(rightTransform).not.toBe(middleTransform);
    expect(rightTransform).not.toBe(initialTransform);
    console.log('✓ Carousel slid to RIGHT - transform changed further');
    
    // Wait until MACRO card becomes visible (proves we reached the rightmost position)
    console.log('Waiting for MACRO card to become visible...');
    await snapshotPage.macroCard.waitFor({ state: 'visible', timeout: 5000 });
    console.log('MACRO card is now visible');
    
    // Take screenshot of RIGHT position
    await page.screenshot({ path: 'carousel-right.png' });
    
    // Verify carousel is at the rightmost position - MACRO is visible
    await expect(snapshotPage.macroCard).toBeVisible();

    // === NAVIGATE BACK: RIGHT -> MIDDLE ===
    console.log('\n=== Clicking LEFT arrow to move back to MIDDLE position ===');
    
    await snapshotPage.clickLeftArrow();
    // Wait for carousel animation to complete
    await page.waitForTimeout(2500);
    
    // Validate carousel slid back by checking transform changed
    const backToMiddleTransform = await carouselContainer.evaluate(el => 
      window.getComputedStyle(el).transform
    );
    console.log('Carousel transform after left click:', backToMiddleTransform);
    expect(backToMiddleTransform).not.toBe(rightTransform);
    console.log('✓ Carousel slid back to MIDDLE - transform changed');
    
    // Take screenshot
    await page.screenshot({ path: 'carousel-back-to-middle.png' });

    // === NAVIGATE BACK: MIDDLE -> LEFT ===
    console.log('\n=== Clicking LEFT arrow again to move back to LEFT position ===');
    
    await snapshotPage.clickLeftArrow();
    // Wait for carousel animation to complete
    await page.waitForTimeout(2500);
    
    // Validate carousel returned to original position
    const backToLeftTransform = await carouselContainer.evaluate(el => 
      window.getComputedStyle(el).transform
    );
    console.log('Carousel transform back at LEFT:', backToLeftTransform);
    expect(backToLeftTransform).toBe(initialTransform);
    console.log('✓ Carousel returned to LEFT - transform back to original');
    
    // Take screenshot
    await page.screenshot({ path: 'carousel-back-to-left.png' });
    
    // Verify we're back at the starting LEFT position with Investor Lens visible again
    await expect(snapshotPage.investorLensCard).toBeVisible();
    
    console.log('\n=== Carousel navigation test completed successfully ===');
  });
});
