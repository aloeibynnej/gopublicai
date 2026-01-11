import { test, expect } from '@playwright/test';
import { LoginPage } from '../pom/pages';

test.describe('Login Page - Page Load and Elements', () => {
  test.setTimeout(30_000);

  // Use unauthenticated context - no storageState
  test.use({ storageState: { cookies: [], origins: [] } });

  test('should load login page and display all form elements @smoke', async ({ page }) => {
    const loginPage = new LoginPage(page);
    
    console.log('\n=== Testing Login Page Load ===');

    await loginPage.open();
    console.log('✓ Navigated to login page');

    // Verify URL
    expect(page.url()).toContain('/login');
    console.log('✓ URL is /login');

    // Verify heading
    const heading = page.getByRole('heading', { name: 'Welcome to Public.ai' });
    await expect(heading).toBeVisible();
    console.log('✓ Page heading: "Welcome to Public.ai"');

    // Verify email input
    const emailInput = page.getByPlaceholder('Email');
    await expect(emailInput).toBeVisible();
    console.log('✓ Email input field visible');

    // Verify password input
    const passwordInput = page.getByPlaceholder('Password');
    await expect(passwordInput).toBeVisible();
    console.log('✓ Password input field visible');

    // Verify login button
    const loginButton = page.getByRole('button', { name: 'LOG IN' });
    await expect(loginButton).toBeVisible();
    console.log('✓ "LOG IN" button visible');

    // Verify forgot password link
    const forgotPasswordLink = page.getByRole('link', { name: 'Forgot your password?' });
    await expect(forgotPasswordLink).toBeVisible();
    console.log('✓ "Forgot your password?" link visible');

    console.log('\n=== Login Page Load Test Complete ===');
  });

  test('should navigate to forgot password page when clicking forgot password link @smoke', async ({ page }) => {
    const loginPage = new LoginPage(page);
    
    console.log('\n=== Testing Forgot Password Navigation ===');

    await loginPage.open();
    console.log('✓ On login page');

    await loginPage.clickForgotPassword();
    console.log('✓ Clicked "Forgot your password?" link');

    // Wait for navigation to forgot password page
    await page.waitForTimeout(2000);
    console.log('✓ Navigated to forgot password page');

    expect(page.url()).toContain('/forgot-password');
    console.log('\n=== Forgot Password Navigation Test Complete ===');
  });
});
