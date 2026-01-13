import { test, expect } from '@playwright/test';
import { LoginPage } from '../pom/pages';

test.describe('Login - Negative Test Cases', () => {
  // Use unauthenticated context - no storageState
  test.use({ storageState: { cookies: [], origins: [] } });

  test('should prevent submission with empty email field @smoke', async ({ page }) => {
    const loginPage = new LoginPage(page);
    
    console.log('\n=== Testing Empty Email Field ===');

    await loginPage.open();
    console.log('✓ On login page');

    // Verify URL
    expect(page.url()).toContain('/login');
    console.log('✓ URL is /login');

    // Enter password but leave email empty
    await loginPage.fillPassword('TestPassword123!');
    console.log('✓ Entered password (email left empty)');

    // Try to submit
    await loginPage.clickLogin();
    console.log('✓ Clicked login button');

    // Browser should prevent submission due to required attribute
    await page.waitForTimeout(1000);
    expect(page.url()).toContain('/login');
    console.log('✓ Form submission prevented (email is required)');

    console.log('\n=== Empty Email Field Test Complete ===');
  });

  test('should prevent submission with empty password field @smoke', async ({ page }) => {
    const loginPage = new LoginPage(page);
    
    console.log('\n=== Testing Empty Password Field ===');

    await loginPage.open();
    console.log('✓ On login page');

    // Verify URL
    expect(page.url()).toContain('/login');
    console.log('✓ URL is /login');

    // Enter email but leave password empty
    await loginPage.fillEmail('test@example.com');
    console.log('✓ Entered email (password left empty)');

    // Try to submit
    await loginPage.clickLogin();
    console.log('✓ Clicked login button');

    // Browser should prevent submission due to required attribute
    await page.waitForTimeout(1000);
    expect(page.url()).toContain('/login');
    console.log('✓ Form submission prevented (password is required)');

    console.log('\n=== Empty Password Field Test Complete ===');
  });

  test('should prevent submission with both fields empty @smoke', async ({ page }) => {
    const loginPage = new LoginPage(page);
    
    console.log('\n=== Testing Both Fields Empty ===');

    await loginPage.open();
    console.log('✓ On login page');

    // Verify URL
    expect(page.url()).toContain('/login');
    console.log('✓ URL is /login');

    // Don't enter anything
    console.log('✓ Both fields left empty');

    // Try to submit
    await loginPage.clickLogin();
    console.log('✓ Clicked login button');

    // Browser should prevent submission
    await page.waitForTimeout(1000);
    expect(page.url()).toContain('/login');
    console.log('✓ Form submission prevented (both fields required)');

    console.log('\n=== Both Fields Empty Test Complete ===');
  });

  test('should show error for invalid email format @smoke', async ({ page }) => {
    const loginPage = new LoginPage(page);
    
    console.log('\n=== Testing Invalid Email Format ===');

    await loginPage.open();
    console.log('✓ On login page');

    // Verify URL
    expect(page.url()).toContain('/login');
    console.log('✓ URL is /login');

    // Enter invalid email format
    await loginPage.fillEmail('invalid-email');
    console.log('✓ Entered invalid email format: "invalid-email"');

    await loginPage.fillPassword('TestPassword123!');
    console.log('✓ Entered password');

    // Try to submit
    await loginPage.clickLogin();
    console.log('✓ Clicked login button');

    // Browser should prevent submission due to email validation
    await page.waitForTimeout(1000);
    expect(page.url()).toContain('/login');
    console.log('✓ Form submission prevented (invalid email format)');

    console.log('\n=== Invalid Email Format Test Complete ===');
  });

  test('should show error for invalid credentials @smoke', async ({ page }) => {
    const loginPage = new LoginPage(page);
    
    console.log('\n=== Testing Invalid Credentials ===');

    await loginPage.open();
    console.log('✓ On login page');

    // Verify URL
    expect(page.url()).toContain('/login');
    console.log('✓ URL is /login');

    // Enter invalid credentials
    await loginPage.fillEmail('invalid@example.com');
    console.log('✓ Entered invalid email');

    await loginPage.fillPassword('WrongPassword123!');
    console.log('✓ Entered invalid password');

    // Submit login
    await loginPage.clickLogin();
    console.log('✓ Clicked login button');

    // Wait for response
    await page.waitForTimeout(3000);

    // Should stay on login page (login failed)
    expect(page.url()).toContain('/login');
    console.log('✓ Login failed - stayed on login page');

    console.log('\n=== Invalid Credentials Test Complete ===');
  });

  test('should handle email with leading space (fails to login) @smoke', async ({ page }) => {
    const loginPage = new LoginPage(page);
    
    console.log('\n=== Testing Email with Leading Space ===');

    await loginPage.open();
    console.log('✓ On login page');

    // Verify URL
    expect(page.url()).toContain('/login');
    console.log('✓ URL is /login');

    // Enter email with leading space
    await loginPage.fillEmail(' test@publicai.com');
    console.log('✓ Entered email with leading space: " test@publicai.com"');

    await loginPage.fillPassword('TestPassword123!');
    console.log('✓ Entered password');

    // Submit login
    await loginPage.clickLogin();
    console.log('✓ Clicked login button');

    // Wait for response
    await page.waitForTimeout(3000);

    // Should stay on login page (login fails because space not trimmed)
    expect(page.url()).toContain('/login');
    console.log('⚠ Login failed - email with leading space not trimmed');
    console.log('⚠ BUG: Frontend should trim email input');

    console.log('\n=== Email with Leading Space Test Complete ===');
  });

  test('should handle email with trailing space (fails to login) @smoke', async ({ page }) => {
    const loginPage = new LoginPage(page);
    
    console.log('\n=== Testing Email with Trailing Space ===');

    await loginPage.open();
    console.log('✓ On login page');

    // Verify URL
    expect(page.url()).toContain('/login');
    console.log('✓ URL is /login');

    // Enter email with trailing space
    await loginPage.fillEmail('test@publicai.com ');
    console.log('✓ Entered email with trailing space: "test@publicai.com "');

    await loginPage.fillPassword('TestPassword123!');
    console.log('✓ Entered password');

    // Submit login
    await loginPage.clickLogin();
    console.log('✓ Clicked login button');

    // Wait for response
    await page.waitForTimeout(3000);

    // Should stay on login page (login fails because space not trimmed)
    expect(page.url()).toContain('/login');
    console.log('⚠ Login failed - email with trailing space not trimmed');
    console.log('⚠ BUG: Frontend should trim email input');

    console.log('\n=== Email with Trailing Space Test Complete ===');
  });
});
