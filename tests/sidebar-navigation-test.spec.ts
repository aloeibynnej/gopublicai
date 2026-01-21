import { test, expect } from '@playwright/test';
import {
  HealthMonitorDesktopPage,
  HealthMonitorMobilePage,
  SnapshotDesktopPage,
  SnapshotMobilePage,
} from '../pom/pages';

test.setTimeout(60_000);

test('sidebar navigation to snapshot page @desktop ', async ({ page }) => {
  const healthDesktopMonitorPage = new HealthMonitorDesktopPage(page);
  const snapshotDesktopPage = new SnapshotDesktopPage(page);

  await healthDesktopMonitorPage.open();
  await healthDesktopMonitorPage.isReady();

  const mainMenuComponent = healthDesktopMonitorPage.mainMenu;

  await mainMenuComponent.clickSnapshot();

  await snapshotDesktopPage.isReady();
  await expect(snapshotDesktopPage.isOnSnapshotPage()).toBeTruthy();
});

test('sidebar navigation to snapshot page @mobile ', async ({ page }) => {
  const healthMobileMonitorPage = new HealthMonitorMobilePage(page);
  const snapshotMobilePage = new SnapshotMobilePage(page);

  await healthMobileMonitorPage.open();
  await healthMobileMonitorPage.isReady();

  await healthMobileMonitorPage.clickMenuButton();

  await snapshotMobilePage.open();

  await snapshotMobilePage.isReady();
  expect(snapshotMobilePage.isOnSnapshotPage()).toBeTruthy();
});
