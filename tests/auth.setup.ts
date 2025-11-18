// auth.setup.ts
import { test as setup } from '@playwright/test';
import fs from 'fs';
import { USERNAME, PASSWORD } from '../pom/constants';
import { LoginPage } from '../pom/pages/login.page';
import { DashboardPage } from '../pom/pages/dashboard.page';

const authStatePath = './.auth/authState.json';

setup('login and save state', async ({ page }) => {
  if (fs.existsSync(authStatePath)) {
    return;
  }

  const loginPage = new LoginPage(page);
  const dashboardPage = new DashboardPage(page);

  await loginPage.open();
  await loginPage.login(USERNAME, PASSWORD);

  await dashboardPage.isReady();

  await new Promise(resolve => setTimeout(resolve, 2000));

  await page.context().storageState({ path: authStatePath });
});
