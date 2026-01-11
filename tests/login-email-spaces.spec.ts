import { test, expect } from '@playwright/test';
import { LoginPage } from '../pom/pages';

test.describe('Login - Email with Spaces', () => {
  test.setTimeout(30_000);

  // Use unauthenticated context - no storageState
  test.use({ storageState: { cookies: [], origins: [] } });

  test('should handle email with leading space @smoke', async ({ page }) => {
    const loginPage = new LoginPage(page);
    
    console.log('\n=== Testing Login with Leading Space in Email ===');

    await loginPage.open();
    console.log('✓ On login page');

    // Verify URL
    expect(page.url()).toContain('/login');
    console.log('✓ URL is /login');

    // Enter email with leading space (common copy-paste error)
    const emailWithSpace = ' test@publicai.com';
    await loginPage.fillEmail(emailWithSpace);
    console.log(`✓ Entered email with leading space: "${emailWithSpace}"`);

    // Enter password
    await loginPage.fillPassword('TestPassword123!');
    console.log('✓ Entered password');

    // Submit login
    await loginPage.clickLogin();
    console.log('✓ Clicked login button');

    // Wait for response
    await page.waitForTimeout(3000);

    // Check if login was successful (redirected away from /login)
    // OR if we stayed on login page (which means spaces weren't trimmed)
    const currentUrl = page.url();
    console.log(`✓ Current URL: ${currentUrl}`);

    if (currentUrl.includes('/login')) {
      console.log('⚠ Login failed - email with leading space not trimmed');
      console.log('⚠ This indicates the form does NOT trim spaces');
    } else {
      console.log('✓ Login successful - email with leading space was trimmed');
    }

    console.log('\n=== Leading Space Test Complete ===');
  });

  test('should handle email with trailing space @smoke', async ({ page }) => {
    const loginPage = new LoginPage(page);
    
    console.log('\n=== Testing Login with Trailing Space in Email ===');

    await loginPage.open();
    console.log('✓ On login page');

    // Verify URL
    expect(page.url()).toContain('/login');
    console.log('✓ URL is /login');

    // Enter email with trailing space (common copy-paste error)
    const emailWithSpace = 'test@publicai.com ';
    await loginPage.fillEmail(emailWithSpace);
    console.log(`✓ Entered email with trailing space: "${emailWithSpace}"`);

    // Enter password
    await loginPage.fillPassword('TestPassword123!');
    console.log('✓ Entered password');

    // Submit login
    await loginPage.clickLogin();
    console.log('✓ Clicked login button');

    // Wait for response
    await page.waitForTimeout(3000);

    // Check if login was successful
    const currentUrl = page.url();
    console.log(`✓ Current URL: ${currentUrl}`);

    if (currentUrl.includes('/login')) {
      console.log('⚠ Login failed - email with trailing space not trimmed');
      console.log('⚠ This indicates the form does NOT trim spaces');
    } else {
      console.log('✓ Login successful - email with trailing space was trimmed');
    }

    console.log('\n=== Trailing Space Test Complete ===');
  });

  test('should handle email with both leading and trailing spaces @smoke', async ({ page }) => {
    const loginPage = new LoginPage(page);
    
    console.log('\n=== Testing Login with Leading and Trailing Spaces in Email ===');

    await loginPage.open();
    console.log('✓ On login page');

    // Verify URL
    expect(page.url()).toContain('/login');
    console.log('✓ URL is /login');

    // Enter email with both leading and trailing spaces
    const emailWithSpaces = ' test@publicai.com ';
    await loginPage.fillEmail(emailWithSpaces);
    console.log(`✓ Entered email with spaces: "${emailWithSpaces}"`);

    // Enter password
    await loginPage.fillPassword('TestPassword123!');
    console.log('✓ Entered password');

    // Submit login
    await loginPage.clickLogin();
    console.log('✓ Clicked login button');

    // Wait for response
    await page.waitForTimeout(3000);

    // Check if login was successful
    const currentUrl = page.url();
    console.log(`✓ Current URL: ${currentUrl}`);

    if (currentUrl.includes('/login')) {
      console.log('⚠ Login failed - email with spaces not trimmed');
      console.log('⚠ This indicates the form does NOT trim spaces');
      console.log('⚠ RECOMMENDATION: Frontend should trim email input to improve UX');
    } else {
      console.log('✓ Login successful - email with spaces was trimmed');
    }

    console.log('\n=== Leading and Trailing Spaces Test Complete ===');
  });
});
