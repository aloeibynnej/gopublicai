import { test, expect } from '@playwright/test';
import { DashboardPage } from '../pom/pages';
import { USERNAME } from '../pom/constants';

test.describe('Sidebar Navigation - Global Navigation Flow', () => {
  test.setTimeout(60_000);

  test.use({ storageState: './.auth/authState.json' });

  test('should display sidebar with navigation links @desktop', async ({ page }) => {
    console.log('\n=== Testing Sidebar Navigation Links ===');
    
    const dashboardPage = new DashboardPage(page);
    await dashboardPage.open();
    await dashboardPage.isReady();
    await page.waitForTimeout(3000);
    
    // Open sidebar by hovering
    console.log('Opening sidebar...');
    await page.mouse.move(30, 300);
    await page.waitForTimeout(1500);
    console.log('✓ Sidebar opened');

    // Verify sidebar is visible by checking for user email
    const userEmail = page.getByText(USERNAME).first();
    await expect(userEmail).toBeVisible({ timeout: 5000 });
    console.log('✓ Sidebar content visible (user email found)');

    // Verify navigation links exist in sidebar
    const navLinks = page.locator('nav a, aside a, [role="navigation"] a');
    const linkCount = await navLinks.count();
    expect(linkCount).toBeGreaterThan(0);
    console.log(`✓ Found ${linkCount} navigation links in sidebar`);

    // Verify logout link exists (we know this works from previous test)
    const logoutLink = page.getByRole('link', { name: /logout/i }).or(page.getByText(/logout/i)).first();
    await expect(logoutLink).toBeVisible({ timeout: 5000 });
    console.log('✓ Logout link visible in sidebar');

    console.log('\n=== Sidebar Navigation Links test completed successfully ===');
  });

  test('should display multiple navigation options in sidebar @desktop', async ({ page }) => {
    console.log('\n=== Testing Sidebar Navigation Options ===');
    
    const dashboardPage = new DashboardPage(page);
    await dashboardPage.open();
    await dashboardPage.isReady();
    await page.waitForTimeout(3000);
    
    // Open sidebar
    console.log('Opening sidebar...');
    await page.mouse.move(30, 300);
    await page.waitForTimeout(1500);
    console.log('✓ Sidebar opened');

    // Verify user profile is visible
    const userEmail = page.getByText(USERNAME).first();
    await expect(userEmail).toBeVisible({ timeout: 5000 });
    console.log('✓ User profile visible in sidebar');

    // Verify multiple navigation links exist
    const allLinks = page.locator('nav a, aside a, [role="navigation"] a');
    const linkCount = await allLinks.count();
    expect(linkCount).toBeGreaterThan(1);
    console.log(`✓ Found ${linkCount} navigation links in sidebar`);

    // Verify logout link is accessible
    const logoutLink = page.getByRole('link', { name: /logout/i }).or(page.getByText(/logout/i)).first();
    await expect(logoutLink).toBeVisible({ timeout: 5000 });
    console.log('✓ Logout link accessible in sidebar');

    console.log('\n=== Sidebar Navigation Options test completed successfully ===');
  });
});
