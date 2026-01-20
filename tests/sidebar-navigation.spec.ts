import { test, expect } from '@playwright/test';
import { SnapshotDesktopPage } from '../pom/pages';
import { USERNAME } from '../pom/constants';

test.describe('Sidebar Navigation - Global Navigation Flow', () => {
  test.setTimeout(60_000);

  test('should display sidebar with navigation links @desktop', async ({ page }) => {
    const snapshotPage = new SnapshotDesktopPage(page);
    await snapshotPage.open();
    await snapshotPage.isReady();

    await snapshotPage.mainMenuComponent.clickSnapshot();

    await snapshotPage.mainMenuComponent.isVisible();

    const userEmail = page.getByText(USERNAME).first();
    await expect(userEmail).toBeVisible({ timeout: 5000 });

    await expect(snapshotPage.mainMenuComponent.logoutLink).toBeVisible();
  });
  //TODO: isNeeded?

  // test('should display multiple navigation options in sidebar @desktop', async ({ page }) => {
  //   const snapshotPage = new SnapshotDesktopPage(page);
  //   await snapshotPage.open();
  //   await snapshotPage.isReady();
  //   await page.waitForTimeout(3000);

  //   // Open sidebar
  //   await page.mouse.move(30, 300);
  //   await page.waitForTimeout(1500);

  //   // Verify user profile is visible
  //   const userEmail = page.getByText(USERNAME).first();
  //   await expect(userEmail).toBeVisible({ timeout: 5000 });

  //   // Verify multiple navigation links exist
  //   const allLinks = page.locator('nav a, aside a, [role="navigation"] a');
  //   const linkCount = await allLinks.count();
  //   expect(linkCount).toBeGreaterThan(1);

  //   // Verify logout link is accessible
  //   const logoutLink = page
  //     .getByRole('link', { name: /logout/i })
  //     .or(page.getByText(/logout/i))
  //     .first();
  //   await expect(logoutLink).toBeVisible({ timeout: 5000 });
  // });
});
