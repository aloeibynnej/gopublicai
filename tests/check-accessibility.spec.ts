import { test, expect } from '@playwright/test';
import { SnapshotDesktopPage } from '../pom/pages';

test.describe('Check Accessibility Changes', () => {
  test.setTimeout(60_000);

  test.use({ storageState: './.auth/authState.json' });

  test('Check if accessibility changes are deployed @desktop', async ({ page }) => {
    const snapshotPage = new SnapshotDesktopPage(page);
    
    console.log('\n=== Loading Snapshot Page ===');
    await snapshotPage.open();
    await snapshotPage.isReady();
    console.log('✓ Page loaded');

    console.log('\n=== Checking for Accessibility Changes ===');

    // Check 1: Main content area
    const mainElement = await page.locator('main').count();
    const mainContentDiv = await page.locator('#main-content').count();
    console.log(`\n1. Main Content Area:`);
    console.log(`   - <main> elements found: ${mainElement}`);
    console.log(`   - <div id="main-content"> found: ${mainContentDiv}`);
    console.log(`   - Status: ${mainElement > 0 ? '✅ NEW (semantic <main>)' : '❌ OLD (<div id="main-content">)'}`);

    // Check 2: Carousel buttons with aria-labels
    const prevButton = await page.locator('button[aria-label="Previous"]').count();
    const nextButton = await page.locator('button[aria-label="Next"]').count();
    console.log(`\n2. Carousel Navigation Buttons:`);
    console.log(`   - Previous button with aria-label: ${prevButton}`);
    console.log(`   - Next button with aria-label: ${nextButton}`);
    console.log(`   - Status: ${prevButton > 0 && nextButton > 0 ? '✅ NEW (has aria-labels)' : '❌ OLD (no aria-labels)'}`);

    // Check 3: Analysis cards as articles
    const articleCards = await page.locator('article[aria-label]').count();
    const divCards = await page.locator('.one-question-outer').count();
    console.log(`\n3. Analysis Cards:`);
    console.log(`   - <article> with aria-label: ${articleCards}`);
    console.log(`   - <div class="one-question-outer">: ${divCards}`);
    console.log(`   - Status: ${articleCards > 0 ? '✅ NEW (semantic <article>)' : '❌ OLD (<div> with class)'}`);

    // Check 4: Markets tabs with role="tab"
    const tabElements = await page.locator('[role="tab"]').count();
    console.log(`\n4. Markets Tabs:`);
    console.log(`   - Elements with role="tab": ${tabElements}`);
    console.log(`   - Status: ${tabElements >= 3 ? '✅ NEW (has role="tab")' : '❌ OLD (no role attribute)'}`);

    console.log('\n=== Summary ===');
    const allChangesDeployed = mainElement > 0 && prevButton > 0 && nextButton > 0 && articleCards > 0 && tabElements >= 3;
    if (allChangesDeployed) {
      console.log('✅ ALL accessibility changes are deployed!');
    } else {
      console.log('❌ Accessibility changes are NOT yet deployed to this environment');
    }

    console.log('\n=== Test Complete ===');
  });
});
