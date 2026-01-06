import { test, expect } from '@playwright/test';
import { SignupPage } from '../pom/pages';

test.describe('Signup Page - Unlicensed Email', () => {
  test.setTimeout(30_000);

  test('should display signup page with all elements @desktop', async ({ page }) => {
    const signupPage = new SignupPage(page);

    console.log('\n=== Testing Signup Page Elements ===');
    
    await signupPage.open();
    await signupPage.isReady();
    console.log('✓ Signup page loaded');

    await expect(page.getByRole('heading', { name: 'Create account' })).toBeVisible();
    console.log('✓ Heading visible: "Create account"');

    await expect(page.getByPlaceholder('Email')).toBeVisible();
    console.log('✓ Email input field visible');

    await expect(page.getByPlaceholder('Password')).toBeVisible();
    console.log('✓ Password input field visible');

    await expect(page.getByRole('button', { name: 'CREATE ACCOUNT' })).toBeVisible();
    console.log('✓ "CREATE ACCOUNT" button visible');

    await expect(page.getByRole('link', { name: 'Log in' })).toBeVisible();
    console.log('✓ "Log in" link visible');

    console.log('\n=== Signup Page elements test completed successfully ===');
  });

  test('should display unlicensed toast when submitting non-whitelisted email @desktop', async ({ page }) => {
    const signupPage = new SignupPage(page);

    console.log('\n=== Testing Unlicensed Email Signup ===');
    
    await signupPage.open();
    await signupPage.isReady();
    console.log('✓ Signup page loaded');

    const testEmail = `test.unlicensed.${Date.now()}@example.com`;
    const testPassword = 'TestPassword123!';
    
    console.log(`Testing with email: ${testEmail}`);
    
    await signupPage.signup(testEmail, testPassword);
    console.log('✓ Submitted signup form with unlicensed email');

    await page.waitForTimeout(2000);

    const isToastVisible = await signupPage.isUnlicensedToastVisible();
    expect(isToastVisible).toBe(true);
    console.log('✓ Unlicensed toast is visible');

    const toastText = await signupPage.getUnlicensedToastText();
    expect(toastText).toContain('IT SEEMS THAT YOU DO NOT HAVE AN ACTIVE LICENSE');
    expect(toastText).toContain('WE WILL CONTACT YOU SHORTLY WITH THE NEXT STEPS');
    console.log('✓ Toast message verified: "IT SEEMS THAT YOU DO NOT HAVE AN ACTIVE LICENSE. WE WILL CONTACT YOU SHORTLY WITH THE NEXT STEPS."');

    const toastElement = page.getByText('IT SEEMS THAT YOU DO NOT HAVE AN ACTIVE LICENSE');
    const boundingBox = await toastElement.boundingBox();
    if (boundingBox) {
      expect(boundingBox.x).toBeLessThan(page.viewportSize()!.width / 2);
      expect(boundingBox.y).toBeGreaterThan(page.viewportSize()!.height / 2);
      console.log('✓ Toast appears at left bottom of screen');
    }

    console.log('\n=== Unlicensed Email Signup test completed successfully ===');
  });

  test('should navigate to login page when clicking Log in link @desktop', async ({ page }) => {
    const signupPage = new SignupPage(page);

    console.log('\n=== Testing Log in link navigation ===');
    
    await signupPage.open();
    await signupPage.isReady();
    console.log('✓ Signup page loaded');

    await signupPage.clickLoginLink();
    console.log('✓ Clicked "Log in" link');

    await page.waitForURL('**/login', { timeout: 10000 });
    expect(page.url()).toContain('/login');
    console.log('✓ Navigated to login page');

    await expect(page.getByRole('heading', { name: 'Welcome to Public.ai' })).toBeVisible();
    console.log('✓ Login page heading visible');

    console.log('\n=== Log in link navigation test completed successfully ===');
  });
});
