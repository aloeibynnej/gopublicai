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

  await healthDesktopMonitorPage.open();
  await healthDesktopMonitorPage.isReady();

  const mainMenuComponent = healthDesktopMonitorPage.mainMenu;

  await mainMenuComponent.clickSnapshot();
  const snapshotDesktopPage = new SnapshotDesktopPage(page);

  await snapshotDesktopPage.isReady();
  await expect(snapshotDesktopPage.isOnSnapshotPage()).toBeTruthy();
});

test('sidebar navigation to snapshot page @mobile ', async ({ page }) => {
  const healthMobileMonitorPage = new HealthMonitorMobilePage(page);

  await healthMobileMonitorPage.open();
  await healthMobileMonitorPage.isReady();

  await healthMobileMonitorPage.clickMenuButton();

  const snapshotMobilePage = new SnapshotMobilePage(page);

  await snapshotMobilePage.open();

  await snapshotMobilePage.isReady();
  expect(snapshotMobilePage.isOnSnapshotPage()).toBeTruthy();
});
