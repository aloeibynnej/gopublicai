import { test, expect } from '@playwright/test';
import { LoginPage, SnapshotDesktopPage } from '../pom/pages';
import { USERNAME, PASSWORD } from '../pom/constants';

test.describe('Login - Negative Test Cases', () => {
  // Use unauthenticated context - no storageState
  test.use({ storageState: { cookies: [], origins: [] } });

  test('should prevent submission with empty email field @smoke', async ({ page }) => {
    const loginPage = new LoginPage(page);
    const snapshotPage = new SnapshotDesktopPage(page);

    await loginPage.open();
    await loginPage.isReady();

    expect(page.url()).toContain('/login');

    await loginPage.fillPassword('WrongPassword123!');

    await loginPage.clickLogin();

    expect(page.url()).toContain('/login');

    expect(
      await loginPage.loginInput.evaluate((input: HTMLInputElement) => input.checkValidity())
    ).toBe(false);

    await page.waitForLoadState('networkidle');

    const isSnapshotVisible = await snapshotPage.mainMenu.isVisible();

    expect(isSnapshotVisible).toBe(false);
  });

  test('should prevent submission with empty password field @smoke', async ({ page }) => {
    const loginPage = new LoginPage(page);
    const snapshotPage = new SnapshotDesktopPage(page);

    await loginPage.open();
    await loginPage.isReady();

    expect(page.url()).toContain('/login');

    await loginPage.fillEmail('test@example.com');

    await loginPage.clickLogin();

    expect(page.url()).toContain('/login');

    expect(
      await loginPage.passwordInput.evaluate((input: HTMLInputElement) => input.checkValidity())
    ).toBe(false);

    await page.waitForLoadState('networkidle');

    const isSnapshotVisible = await snapshotPage.mainMenu.isVisible();

    expect(isSnapshotVisible).toBe(false);
  });

  test('should prevent submission with both fields empty @smoke', async ({ page }) => {
    const loginPage = new LoginPage(page);
    const snapshotPage = new SnapshotDesktopPage(page);

    await loginPage.open();
    await loginPage.isReady();

    expect(page.url()).toContain('/login');

    await loginPage.clickLogin();

    expect(page.url()).toContain('/login');

    expect(
      await loginPage.loginInput.evaluate((input: HTMLInputElement) => input.checkValidity())
    ).toBe(false);
    expect(
      await loginPage.passwordInput.evaluate((input: HTMLInputElement) => input.checkValidity())
    ).toBe(false);

    await page.waitForLoadState('networkidle');

    const isSnapshotVisible = await snapshotPage.mainMenu.isVisible();

    expect(isSnapshotVisible).toBe(false);
  });

  test('should show error for invalid email format @smoke', async ({ page }) => {
    const loginPage = new LoginPage(page);
    const snapshotPage = new SnapshotDesktopPage(page);

    await loginPage.open();
    await loginPage.isReady();

    expect(page.url()).toContain('/login');

    await loginPage.fillEmail('invalid-email');

    await loginPage.fillPassword('WrongPassword123!');

    await loginPage.clickLogin();
    expect(page.url()).toContain('/login');

    expect(
      await loginPage.loginInput.evaluate((input: HTMLInputElement) => input.checkValidity())
    ).toBe(false);

    await page.waitForLoadState('networkidle');

    const isSnapshotVisible = await snapshotPage.mainMenu.isVisible();

    expect(isSnapshotVisible).toBe(false);
  });

  test('should show error for invalid credentials @smoke', async ({ page }) => {
    const loginPage = new LoginPage(page);
    const snapshotPage = new SnapshotDesktopPage(page);

    await loginPage.open();
    await loginPage.isReady();

    expect(page.url()).toContain('/login');

    await loginPage.fillEmail('invalid@example.com');

    await loginPage.fillPassword('WrongPassword123!');

    await loginPage.clickLogin();

    expect(
      await loginPage.loginInput.evaluate((input: HTMLInputElement) => input.checkValidity())
    ).toBe(false);
    expect(
      await loginPage.passwordInput.evaluate((input: HTMLInputElement) => input.checkValidity())
    ).toBe(false);

    expect(await loginPage.flashAlertIsVisible()).toBe(true);

    await page.waitForLoadState('networkidle');

    const isSnapshotVisible = await snapshotPage.mainMenuComponent.isVisible();

    expect(isSnapshotVisible).toBe(false);
  });

  test('should handle email with leading space (trimmed automatically) @smoke', async ({ page }) => {
    const loginPage = new LoginPage(page);
    const snapshotPage = new SnapshotDesktopPage(page);

    await loginPage.open();
    await loginPage.isReady();

    expect(page.url()).toContain('/login');

    await loginPage.fillEmail(` ${USERNAME}`);

    const emailInput = page.getByPlaceholder('Email');
    const actualValue = await emailInput.inputValue();
    expect(actualValue).toBe(USERNAME);

    await loginPage.fillPassword(PASSWORD);

    await loginPage.clickLogin();
    expect(await loginPage.flashAlertIsVisible()).toBe(true);

    await page.waitForURL(url => !url.toString().includes('/login'), { timeout: 10000 });

    const isSnapshotVisible = await snapshotPage.mainMenuComponent.isVisible();

    expect(isSnapshotVisible).toBe(false);
  });

  test('should handle email with trailing space (trimmed automatically) @smoke', async ({ page }) => {
    const loginPage = new LoginPage(page);
    const snapshotPage = new SnapshotDesktopPage(page);

    await loginPage.open();
    await loginPage.isReady();

    expect(page.url()).toContain('/login');

    await loginPage.fillEmail(`${USERNAME} `);

    const emailInput = page.getByPlaceholder('Email');
    const actualValue = await emailInput.inputValue();
    expect(actualValue).toBe(USERNAME);

    await loginPage.fillPassword(PASSWORD);

    await loginPage.clickLogin();

    expect(await loginPage.flashAlertIsVisible()).toBe(true);

    await page.waitForLoadState('networkidle');

    expect(page.url()).not.toContain('/login');

    const isSnapshotVisible = await snapshotPage.mainMenuComponent.isVisible();

    expect(isSnapshotVisible).toBe(false);
  });
});
