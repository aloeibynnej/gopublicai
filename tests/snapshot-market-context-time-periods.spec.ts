import { test, expect } from '@playwright/test';
import { SnapshotPage } from '../pom/pages/snapshot.page';

test.describe('Snapshot Market Context - Time Period Switching', () => {
  test.setTimeout(90_000);

  test('should switch time periods and update percentage text @desktop', async ({ page }) => {
    const snapshotPage = new SnapshotPage(page);
    
    console.log('\n=== Testing Market Context time period switching ===');

    await snapshotPage.open();
    console.log('✓ Navigated to snapshot page');

    // Scroll to Market Context section
    await snapshotPage.isMarketContextHeadingVisible();
    console.log('✓ Market Context section visible');

    // ===== TEST 1D BUTTON =====
    console.log('\n=== Testing 1D (1 day) ===');
    
    await snapshotPage.clickTimePeriod1D();
    console.log('✓ Clicked 1D button');
    
    const oneDayVisible = await snapshotPage.verifyTimePeriodLabelContains('1 day');
    expect(oneDayVisible).toBe(true);
    console.log('✓ "1 day" label displayed');
    
    const percentage1D = await snapshotPage.getPercentageChangeText();
    console.log(`✓ Percentage change: ${percentage1D}`);
    expect(percentage1D).toMatch(/[+-]?\d+[,.]?\d*\.?\d+%/);

    // ===== TEST 1M BUTTON =====
    console.log('\n=== Testing 1M (Past month) ===');
    
    await snapshotPage.clickTimePeriod1M();
    console.log('✓ Clicked 1M button');
    
    const pastMonthVisible = await snapshotPage.verifyTimePeriodLabelContains('Past month');
    expect(pastMonthVisible).toBe(true);
    console.log('✓ "Past month" label displayed');
    
    const percentage1M = await snapshotPage.getPercentageChangeText();
    console.log(`✓ Percentage change: ${percentage1M}`);
    expect(percentage1M).toMatch(/[+-]?\d+[,.]?\d*\.?\d+%/);
    expect(percentage1M).not.toBe(percentage1D);
    console.log('✓ Percentage changed from 1D value');

    // ===== TEST 3M BUTTON =====
    console.log('\n=== Testing 3M (Past quarter) ===');
    
    await snapshotPage.clickTimePeriod3M();
    console.log('✓ Clicked 3M button');
    
    const pastQuarterVisible = await snapshotPage.verifyTimePeriodLabelContains('Past quarter');
    expect(pastQuarterVisible).toBe(true);
    console.log('✓ "Past quarter" label displayed');
    
    const percentage3M = await snapshotPage.getPercentageChangeText();
    console.log(`✓ Percentage change: ${percentage3M}`);
    expect(percentage3M).toMatch(/[+-]?\d+[,.]?\d*\.?\d+%/);
    expect(percentage3M).not.toBe(percentage1M);
    console.log('✓ Percentage changed from 1M value');

    // ===== TEST 1Y BUTTON =====
    console.log('\n=== Testing 1Y (Past year) ===');
    
    await snapshotPage.clickTimePeriod1Y();
    console.log('✓ Clicked 1Y button');
    
    const pastYearVisible = await snapshotPage.verifyTimePeriodLabelContains('Past year');
    expect(pastYearVisible).toBe(true);
    console.log('✓ "Past year" label displayed');
    
    const percentage1Y = await snapshotPage.getPercentageChangeText();
    console.log(`✓ Percentage change: ${percentage1Y}`);
    expect(percentage1Y).toMatch(/[+-]?\d+[,.]?\d*\.?\d+%/);
    expect(percentage1Y).not.toBe(percentage3M);
    console.log('✓ Percentage changed from 3M value');

    // ===== TEST 5Y BUTTON =====
    console.log('\n=== Testing 5Y (Past five years) ===');
    
    await snapshotPage.clickTimePeriod5Y();
    console.log('✓ Clicked 5Y button');
    
    const pastFiveYearsVisible = await snapshotPage.verifyTimePeriodLabelContains('Past five years');
    expect(pastFiveYearsVisible).toBe(true);
    console.log('✓ "Past five years" label displayed');
    
    const percentage5Y = await snapshotPage.getPercentageChangeText();
    console.log(`✓ Percentage change: ${percentage5Y}`);
    expect(percentage5Y).toMatch(/[+-]?\d+[,.]?\d*\.?\d+%/);
    expect(percentage5Y).not.toBe(percentage1Y);
    console.log('✓ Percentage changed from 1Y value');

    // ===== TEST ALL BUTTON =====
    console.log('\n=== Testing All (All time) ===');
    
    await snapshotPage.clickTimePeriodAll();
    console.log('✓ Clicked All button');
    
    const allTimeVisible = await snapshotPage.verifyTimePeriodLabelContains('All time');
    expect(allTimeVisible).toBe(true);
    console.log('✓ "All time" label displayed');
    
    const percentageAll = await snapshotPage.getPercentageChangeText();
    console.log(`✓ Percentage change: ${percentageAll}`);
    expect(percentageAll).toMatch(/[+-]?\d+[,.]?\d*\.?\d+%/);
    expect(percentageAll).not.toBe(percentage5Y);
    console.log('✓ Percentage changed from 5Y value');

    console.log('\n=== All time period buttons tested successfully ===');
    console.log('Summary:');
    console.log(`  1D:  ${percentage1D}`);
    console.log(`  1M:  ${percentage1M}`);
    console.log(`  3M:  ${percentage3M}`);
    console.log(`  1Y:  ${percentage1Y}`);
    console.log(`  5Y:  ${percentage5Y}`);
    console.log(`  All: ${percentageAll}`);
  });
});
