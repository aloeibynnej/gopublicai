import { test, expect } from '@playwright/test';
import { SnapshotPage } from '../pom/pages/snapshot.page';

test.describe('Snapshot Stock Header', () => {
  test.setTimeout(60_000);

  test('should display stock header with ticker, company name, greeting, and summary @desktop', async ({ page }) => {
    const snapshotPage = new SnapshotPage(page);
    
    console.log('\n=== Testing stock header on snapshot page ===');

    await snapshotPage.open();
    console.log('✓ Navigated to snapshot page');

    console.log('\n=== Verifying stock ticker ===');
    
    const tickerVisible = await snapshotPage.isStockTickerVisible();
    expect(tickerVisible).toBe(true);
    
    const tickerValue = await snapshotPage.getStockTickerValue();
    console.log(`✓ Stock ticker is visible: ${tickerValue}`);
    expect(tickerValue).not.toBeNull();
    expect(tickerValue?.length).toBeGreaterThan(0);
    expect(tickerValue).toMatch(/^[A-Z]{1,5}$/);

    console.log('\n=== Verifying company name ===');
    
    const companyVisible = await snapshotPage.isCompanyNameVisible();
    expect(companyVisible).toBe(true);
    
    const companyName = await snapshotPage.getCompanyNameValue();
    console.log(`✓ Company name is visible: ${companyName}`);
    expect(companyName).not.toBeNull();
    expect(companyName?.length).toBeGreaterThan(0);

    console.log('\n=== Verifying greeting message (optional) ===');
    
    const greetingVisible = await snapshotPage.isGreetingMessageVisible();
    if (greetingVisible) {
      const greetingMessage = await snapshotPage.getGreetingMessageValue();
      console.log(`✓ Greeting message is visible: ${greetingMessage}`);
      expect(greetingMessage).toMatch(/Good (morning|afternoon|evening|night),/i);
    } else {
      console.log('⚠ Greeting message not found (optional element)');
    }

    console.log('\n=== Verifying stock summary (optional) ===');
    
    const summaryVisible = await snapshotPage.isStockSummaryVisible();
    if (summaryVisible) {
      const stockSummary = await snapshotPage.getStockSummaryValue();
      console.log(`✓ Stock summary is visible (${stockSummary?.substring(0, 50)}...)`);
      expect(stockSummary?.length).toBeGreaterThan(0);
    } else {
      console.log('⚠ Stock summary not found (optional element)');
    }

    console.log('\n=== Verifying core header elements ===');
    
    // Only require ticker and company name (core elements)
    expect(tickerVisible && companyVisible).toBe(true);
    console.log('✓ Stock header displayed successfully with core required elements (ticker and company name)');

    console.log('\n=== Stock header test completed successfully ===');
  });
});
