// auth.setup.ts
import { test as setup } from '@playwright/test';
import fs from 'fs';
import { USERNAME, PASSWORD } from '../pom/constants';
import { OAuthLoginPage } from '../pom/pages/oauth-login.page';
import { SnapshotDesktopPage } from '../pom/pages/snapshot.page';

const authStatePath = './.auth/authState.json';

setup('login and save state', async ({ page }) => {
  if (fs.existsSync(authStatePath)) {
    return;
  }

  const loginPage = new OAuthLoginPage(page);
  const snapshotPage = new SnapshotDesktopPage(page);

  await loginPage.open();
  await loginPage.isReady();
  await loginPage.login(USERNAME, PASSWORD);

  await snapshotPage.isReady();

  await new Promise(resolve => setTimeout(resolve, 2000));

  await page.context().storageState({ path: authStatePath });
});
