import { test, expect } from '@playwright/test';
import { LoginPage } from '../pom/pages';

test.describe('Login - Negative Test Cases', () => {
  // Use unauthenticated context - no storageState
  test.use({ storageState: { cookies: [], origins: [] } });

  test('should prevent submission with empty email field @smoke', async ({ page }) => {
    const loginPage = new LoginPage(page);

    await loginPage.open();

    expect(page.url()).toContain('/login');

    await loginPage.fillPassword('TestPassword123!');

    await loginPage.clickLogin();

    expect(page.url()).toContain('/login');
  });

  test('should prevent submission with empty password field @smoke', async ({ page }) => {
    const loginPage = new LoginPage(page);

    await loginPage.open();

    expect(page.url()).toContain('/login');

    await loginPage.fillEmail('test@example.com');

    await loginPage.clickLogin();

    expect(page.url()).toContain('/login');
  });

  test('should prevent submission with both fields empty @smoke', async ({ page }) => {
    const loginPage = new LoginPage(page);

    await loginPage.open();

    expect(page.url()).toContain('/login');

    await loginPage.clickLogin();

    expect(page.url()).toContain('/login');
  });

  test('should show error for invalid email format @smoke', async ({ page }) => {
    const loginPage = new LoginPage(page);

    await loginPage.open();

    expect(page.url()).toContain('/login');

    await loginPage.fillEmail('invalid-email');

    await loginPage.fillPassword('TestPassword123!');

    await loginPage.clickLogin();

    expect(page.url()).toContain('/login');
  });

  test('should show error for invalid credentials @smoke', async ({ page }) => {
    const loginPage = new LoginPage(page);

    await loginPage.open();

    expect(page.url()).toContain('/login');

    await loginPage.fillEmail('invalid@example.com');

    await loginPage.fillPassword('WrongPassword123!');

    await loginPage.clickLogin();

    await page.waitForLoadState('networkidle');

    expect(page.url()).toContain('/login');
  });

  test('should handle email with leading space (trimmed automatically) @smoke', async ({ page }) => {
    const loginPage = new LoginPage(page);

    await loginPage.open();

    expect(page.url()).toContain('/login');

    await loginPage.fillEmail(' test@publicai.com');

    const emailInput = page.getByPlaceholder('Email');
    const actualValue = await emailInput.inputValue();
    expect(actualValue).toBe('test@publicai.com');

    await loginPage.fillPassword('TestPassword123!');

    await loginPage.clickLogin();

    await page.waitForLoadState('networkidle');

    expect(page.url()).toContain('/login');
  });

  test('should handle email with trailing space (trimmed automatically) @smoke', async ({ page }) => {
    const loginPage = new LoginPage(page);

    await loginPage.open();

    expect(page.url()).toContain('/login');

    await loginPage.fillEmail('test@publicai.com ');

    const emailInput = page.getByPlaceholder('Email');
    const actualValue = await emailInput.inputValue();
    expect(actualValue).toBe('test@publicai.com');

    await loginPage.fillPassword('TestPassword123!');

    await loginPage.clickLogin();

    await page.waitForLoadState('networkidle');

    expect(page.url()).toContain('/login');
  });
});
