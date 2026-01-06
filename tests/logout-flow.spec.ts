import { test, expect } from '@playwright/test';
import { DashboardPage } from '../pom/pages';

test.describe('Logout Flow', () => {
  test.setTimeout(60_000);

  test.use({ storageState: './.auth/authState.json' });

  test('should logout successfully from sidebar navigation @desktop', async ({ page }) => {
    const dashboardPage = new DashboardPage(page);

    console.log('\n=== Testing Logout Flow ===');
    
    await dashboardPage.open();
    await dashboardPage.isReady();
    console.log('✓ Dashboard page loaded');

    // Wait for page to fully load
    await page.waitForTimeout(5000);

    // Hover over the left edge of the page to open the sidebar drawer
    console.log('Hovering over left edge to open sidebar drawer...');
    await page.mouse.move(30, 400);
    await page.waitForTimeout(1000);
    console.log('✓ Sidebar drawer should be opened');

    // Look for the user profile element with "DE" text at bottom left of sidebar
    console.log('Looking for user profile element (DE)...');
    const userProfileElement = page.getByText('DE', { exact: true }).first();
    await userProfileElement.waitFor({ state: 'visible', timeout: 5000 });
    await userProfileElement.hover();
    await page.waitForTimeout(500);
    console.log('✓ Hovered over user profile element (DE)');

    // Click on logout link that appears
    console.log('Looking for logout link...');
    const logoutLink = page.getByRole('link', { name: /logout/i }).or(page.getByText(/logout/i, { exact: false })).first();
    await logoutLink.waitFor({ state: 'visible', timeout: 5000 });
    await logoutLink.hover();
    await page.waitForTimeout(200);
    await logoutLink.click();
    console.log('✓ Clicked logout link');

    // Wait for navigation to logout success page
    await page.waitForTimeout(3000);
    
    // Verify we're on the logout success page
    await expect(page.getByRole('heading', { name: /Successfully Logged Out/i })).toBeVisible({ timeout: 10000 });
    console.log('✓ Logout success page heading visible');

    await expect(page.getByText(/You have been successfully logged out of Public.ai/i)).toBeVisible();
    console.log('✓ Logout success message visible');

    await expect(page.getByRole('button', { name: /LOG IN AGAIN/i })).toBeVisible();
    console.log('✓ "LOG IN AGAIN" button visible');

    console.log('\n=== Logout Flow test completed successfully ===');
  });

  test('should navigate back to login from logout success page @desktop', async ({ page }) => {
    const dashboardPage = new DashboardPage(page);

    console.log('\n=== Testing Navigation from Logout Success Page ===');
    
    await dashboardPage.open();
    await dashboardPage.isReady();
    await page.waitForTimeout(5000);

    // Hover over left edge to open sidebar drawer
    await page.mouse.move(30, 400);
    await page.waitForTimeout(1000);

    const userProfileElement = page.getByText('DE', { exact: true }).first();
    await userProfileElement.waitFor({ state: 'visible', timeout: 5000 });
    await userProfileElement.hover();
    await page.waitForTimeout(500);

    const logoutLink = page.getByRole('link', { name: /logout/i }).or(page.getByText(/logout/i, { exact: false })).first();
    await logoutLink.waitFor({ state: 'visible', timeout: 5000 });
    await logoutLink.hover();
    await page.waitForTimeout(200);
    await logoutLink.click();
    await page.waitForTimeout(3000);

    console.log('✓ Navigated to logout success page');

    // Click LOG IN AGAIN button
    const loginAgainButton = page.getByRole('button', { name: /LOG IN AGAIN/i });
    await loginAgainButton.click();
    console.log('✓ Clicked "LOG IN AGAIN" button');

    // Verify we're on the login page
    await page.waitForURL('**/login', { timeout: 10000 });
    expect(page.url()).toContain('/login');
    console.log('✓ Navigated to login page');

    await expect(page.getByRole('heading', { name: /Welcome to Public.ai/i })).toBeVisible();
    console.log('✓ Login page heading visible');

    console.log('\n=== Navigation from Logout Success Page test completed successfully ===');
  });
});
