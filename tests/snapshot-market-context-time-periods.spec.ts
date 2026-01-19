import { test, expect } from '@playwright/test';
import { SnapshotDesktopPage } from '../pom/pages';

test.describe('Snapshot Market Context - Time Period Switching', () => {
  test.setTimeout(60_000);

  // We should not test third party widgets
  test.skip('should switch time periods and update percentage text @desktop', async ({ page }) => {
    const snapshotPage = new SnapshotDesktopPage(page);

    await snapshotPage.open();
    await snapshotPage.isReady();

    await snapshotPage.clickTimePeriod1D();

    const oneDayVisible = await snapshotPage.verifyTimePeriodLabelContains('1 day');
    expect(oneDayVisible).toBe(true);

    const percentage1D = await snapshotPage.getPercentageChangeText();
    await expect(percentage1D).toMatch(/[+-]?\d+[,.]?\d*\.?\d+%/);

    await snapshotPage.clickTimePeriod1M();

    const pastMonthVisible = await snapshotPage.verifyTimePeriodLabelContains('Past month');
    await expect(pastMonthVisible).toBe(true);

    const percentage1M = await snapshotPage.getPercentageChangeText();
    await expect(percentage1M).toMatch(/[+-]?\d+[,.]?\d*\.?\d+%/);
    await expect(percentage1M).not.toEqual(percentage1D);

    await snapshotPage.clickTimePeriod3M();

    const pastQuarterVisible = await snapshotPage.verifyTimePeriodLabelContains('Past quarter');
    expect(pastQuarterVisible).toBe(true);

    const percentage3M = await snapshotPage.getPercentageChangeText();
    expect(percentage3M).toMatch(/[+-]?\d+[,.]?\d*\.?\d+%/);
    expect(percentage3M).not.toEqual(percentage1M);

    await snapshotPage.clickTimePeriod1Y();

    const pastYearVisible = await snapshotPage.verifyTimePeriodLabelContains('Past year');
    expect(pastYearVisible).toBe(true);

    const percentage1Y = await snapshotPage.getPercentageChangeText();
    expect(percentage1Y).toMatch(/[+-]?\d+[,.]?\d*\.?\d+%/);
    expect(percentage1Y).not.toEqual(percentage3M);

    await snapshotPage.clickTimePeriod5Y();

    const pastFiveYearsVisible =
      await snapshotPage.verifyTimePeriodLabelContains('Past five years');
    expect(pastFiveYearsVisible).toBe(true);

    const percentage5Y = await snapshotPage.getPercentageChangeText();
    expect(percentage5Y).toMatch(/[+-]?\d+[,.]?\d*\.?\d+%/);
    expect(percentage5Y).not.toEqual(percentage1Y);

    await snapshotPage.clickTimePeriodAll();

    const allTimeVisible = await snapshotPage.verifyTimePeriodLabelContains('All time');
    expect(allTimeVisible).toBe(true);

    const percentageAll = await snapshotPage.getPercentageChangeText();
    expect(percentageAll).toMatch(/[+-]?\d+[,.]?\d*\.?\d+%/);
    expect(percentageAll).not.toEqual(percentage5Y);
  });
});
