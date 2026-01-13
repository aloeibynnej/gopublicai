import { test, expect } from '@playwright/test';
import { LoginPage } from '../pom/pages';

test.describe('Login Page - Page Load and Elements', () => {

  // Use unauthenticated context - no storageState
  test.use({ storageState: { cookies: [], origins: [] } });

  test('should load login page and display all form elements @smoke', async ({ page }) => {
    const loginPage = new LoginPage(page);

    await loginPage.open();

    expect(page.url()).toContain('/login');

    const heading = page.getByRole('heading', { name: 'Welcome to Public.ai' });
    await expect(heading).toBeVisible();

    const emailInput = page.getByPlaceholder('Email');
    await expect(emailInput).toBeVisible();

    const passwordInput = page.getByPlaceholder('Password');
    await expect(passwordInput).toBeVisible();

    const loginButton = page.getByRole('button', { name: 'LOG IN' });
    await expect(loginButton).toBeVisible();

    const forgotPasswordLink = page.getByRole('link', { name: 'Forgot your password?' });
    await expect(forgotPasswordLink).toBeVisible();
  });
});
