import { test, expect } from '@playwright/test';
import { LoginPage } from '../pom/pages';

test.describe('Login Page - Page Load and Elements', () => {
  // Use unauthenticated context - no storageState
  test.use({ storageState: { cookies: [], origins: [] } });

  test('should load login page and display all form elements @smoke', async ({ page }) => {
    const loginPage = new LoginPage(page);

    await loginPage.open();
    await loginPage.isReady();

    expect(page.url()).toContain('/login');

    expect(await loginPage.isVisible()).toBeTruthy();
  });
});
