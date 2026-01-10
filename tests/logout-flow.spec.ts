import { test, expect } from '@playwright/test';
import { DashboardPage } from '../pom/pages';
import { USERNAME } from '../pom/constants';

test.describe('Logout Flow', () => {
  test.setTimeout(60_000);

  test.use({ storageState: './.auth/authState.json' });

  test('should logout successfully from sidebar navigation @desktop', async ({ page }) => {
    const dashboardPage = new DashboardPage(page);

    console.log('\n=== Testing Logout Flow ===');
    console.log(`Using email: ${USERNAME}`);
    
    await dashboardPage.open();
    await dashboardPage.isReady();
    console.log('✓ Dashboard page loaded');

    // Wait for page to fully load
    await page.waitForTimeout(5000);

    // Hover over the left edge of the page to open the sidebar drawer
    console.log('Hovering over left edge to open sidebar drawer...');
    await page.mouse.move(30, 400);
    await page.waitForTimeout(1500);
    console.log('✓ Sidebar drawer opened');

    // Look for the user's email address in the expanded sidebar (not the initials)
    console.log(`Looking for user email: ${USERNAME}...`);
    const userProfileElement = page.getByText(USERNAME).or(
      page.locator(`text="${USERNAME}"`)
    ).or(
      page.locator('[class*="user"], [class*="profile"], [class*="email"]').filter({ hasText: USERNAME })
    ).first();
    
    await userProfileElement.waitFor({ state: 'visible', timeout: 10000 });
    await userProfileElement.hover();
    await page.waitForTimeout(1000);
    console.log('✓ Hovered over user profile element');

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

    await expect(page.getByText(/You have been successfully logged out/i)).toBeVisible();
    console.log('✓ Logout success message visible');

    // Check for login button - try multiple text variations
    const loginButton = page.getByRole('button', { name: /LOG IN AGAIN/i }).or(
      page.getByRole('button', { name: /LOG IN/i })
    ).or(
      page.getByText(/LOG IN AGAIN/i)
    ).first();
    await expect(loginButton).toBeVisible();
    console.log('✓ Login button visible');

    console.log('\n=== Logout Flow test completed successfully ===');
  });

});
