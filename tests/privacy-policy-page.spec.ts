import { test, expect } from '@playwright/test';
import { PrivacyPolicyPage } from '../pom/pages';

test.describe('Privacy Policy Page and Content Visibility', () => {
  test('should load privacy policy page successfully @smoke', async ({ page }) => {
    const privacyPolicyPage = new PrivacyPolicyPage(page);

    const response = await page.goto(privacyPolicyPage.getUrl());
    expect(response?.status()).toBe(200);

    await privacyPolicyPage.isReady();
  });

  test('should verify privacy policy page is reachable @smoke', async ({ page }) => {
    const privacyPolicyPage = new PrivacyPolicyPage(page);

    const isReachable = await privacyPolicyPage.isPageReachable();
    expect(isReachable).toBe(true);

    const response = await page.goto(privacyPolicyPage.getUrl());
    expect(response?.status()).toBeLessThan(400);
  });

  test('should display page title @smoke', async ({ page }) => {
    const privacyPolicyPage = new PrivacyPolicyPage(page);

    await privacyPolicyPage.open();

    const pageTitle = await privacyPolicyPage.getPageTitle();
    expect(pageTitle).toBeTruthy();
    expect(pageTitle.length).toBeGreaterThan(0);
  });

  test('should display legal content correctly @smoke', async ({ page }) => {
    const privacyPolicyPage = new PrivacyPolicyPage(page);

    await privacyPolicyPage.open();

    const hasContent = await privacyPolicyPage.hasContentVisible();
    expect(hasContent).toBe(true);

    const hasLegalContent = await privacyPolicyPage.hasLegalContent();
    expect(hasLegalContent).toBe(true);
  });
});
