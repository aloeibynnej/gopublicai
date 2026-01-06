import { test, expect } from '@playwright/test';
import { LogoutPage } from '../pom/pages';

test.describe('Logout Success Page', () => {
  test.setTimeout(30_000);

  test('should display logout success page with all elements @desktop', async ({ page }) => {
    const logoutPage = new LogoutPage(page);

    console.log('\n=== Testing Logout Success Page ===');
    
    await logoutPage.open();
    await logoutPage.isReady();
    console.log('✓ Logout success page loaded');

    const heading = await logoutPage.getHeading();
    expect(heading).toContain('Successfully Logged Out');
    console.log('✓ Heading verified: "Successfully Logged Out"');

    const message = await logoutPage.getMessage();
    expect(message).toContain('You have been successfully logged out of Public.ai');
    console.log('✓ Message verified: "You have been successfully logged out of Public.ai"');

    await expect(page.getByRole('button', { name: 'LOG IN AGAIN' })).toBeVisible();
    console.log('✓ "LOG IN AGAIN" button is visible');

    console.log('\n=== Logout Success Page test completed successfully ===');
  });

  test('should navigate to login page when clicking LOG IN AGAIN button @desktop', async ({ page }) => {
    const logoutPage = new LogoutPage(page);

    console.log('\n=== Testing LOG IN AGAIN navigation ===');
    
    await logoutPage.open();
    await logoutPage.isReady();
    console.log('✓ Logout success page loaded');

    await logoutPage.clickLoginAgain();
    console.log('✓ Clicked "LOG IN AGAIN" button');

    await page.waitForURL('**/login', { timeout: 10000 });
    expect(page.url()).toContain('/login');
    console.log('✓ Navigated to login page');

    await expect(page.getByRole('heading', { name: 'Welcome to Public.ai' })).toBeVisible();
    console.log('✓ Login page heading visible');

    console.log('\n=== LOG IN AGAIN navigation test completed successfully ===');
  });
});
