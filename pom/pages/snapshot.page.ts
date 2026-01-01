import { Locator, Page } from '@playwright/test';
import { IPage } from '../interfaces';
import { ChatComponent, MainMenuComponent, TickerSwitcherComponent } from '../components';
import { BASE_URL } from '../constants';

class SnapshotPage implements IPage {
  readonly page: Page;
  readonly marketContextSection: Locator;
  readonly yourPeersSection: Locator;
  readonly capitalMarketScrollSection: Locator;
  readonly companyName: Locator;
  readonly investorLensCard: Locator;
  readonly peerAnalysisCard: Locator;
  readonly sectorAnalysisCard: Locator;
  readonly stockTechnicalsCard: Locator;
  readonly macroCard: Locator;
  readonly leftArrowButton: Locator;
  readonly rightArrowButton: Locator;

  private readonly mainContent: Locator;

  constructor(page: Page) {
    this.page = page;
    this.marketContextSection = page.getByText('Market Context');
    this.yourPeersSection = page.getByText('Your peers');
    this.capitalMarketScrollSection = page.getByText('Capital Market Scroll');
    this.companyName = page.locator('div.text-base.font-semibold.uppercase.font-pitchsans');
    this.mainContent = page.locator('#main-content');
    this.investorLensCard = page.locator('.one-question-outer:has-text("Investor Lens")').first();
    this.peerAnalysisCard = page.locator('.one-question-outer:has-text("Peer Analysis")').first();
    this.sectorAnalysisCard = page.locator('.one-question-outer:has-text("Sector Analysis")').first();
    this.stockTechnicalsCard = page.locator('.one-question-outer:has-text("Stock Technicals")').first();
    // MACRO card - ensure we only match the analysis card, not the sidebar navigation
    this.macroCard = page.locator('.one-question-outer').filter({ hasText: 'MACRO' }).first();
    
    // TODO: Frontend team should add data-testid attributes to carousel navigation arrows:
    // - Left arrow button: data-testid="carousel-prev-button" or data-testid="analysis-carousel-prev"
    // - Right arrow button: data-testid="carousel-next-button" or data-testid="analysis-carousel-next"
    // These buttons are in the .embla__controls section below the analysis cards carousel
    
    // Carousel navigation arrows - try multiple selector strategies (semantic > data-testid > structural)
    this.leftArrowButton = page.locator('button[aria-label*="previous" i], button[aria-label*="prev" i], button[data-testid*="carousel-prev"], button[data-testid*="prev-button"], .embla__controls button').first();
    this.rightArrowButton = page.locator('button[aria-label*="next" i], button[data-testid*="carousel-next"], button[data-testid*="next-button"], .embla__controls button').last();
  }
  
  getUrl(id?: string): string {
    return id ? `${BASE_URL}/snapshot/${id}` : `${BASE_URL}/snapshot`;
  }

  async isReady(): Promise<void> {
    await this.marketContextSection.waitFor({ state: 'visible' });
    await this.yourPeersSection.waitFor({ state: 'visible' });
    await this.capitalMarketScrollSection.waitFor({ state: 'visible' });
  }

  async open(id?: string): Promise<void> {
    await this.page.goto(this.getUrl(id));
    await this.isReady();
  }

  async clickInvestorLensCard(): Promise<void> {
    await this.investorLensCard.click();
  }

  async clickPeerAnalysisCard(): Promise<void> {
    await this.peerAnalysisCard.click();
  }

  async clickSectorAnalysisCard(): Promise<void> {
    await this.sectorAnalysisCard.click();
  }

  async isInvestorLensCardVisible(): Promise<boolean> {
    return await this.investorLensCard.isVisible();
  }

  async isPeerAnalysisCardVisible(): Promise<boolean> {
    return await this.peerAnalysisCard.isVisible();
  }

  async isSectorAnalysisCardVisible(): Promise<boolean> {
    return await this.sectorAnalysisCard.isVisible();
  }

  async clickStockTechnicalsCard(): Promise<void> {
    await this.stockTechnicalsCard.click();
  }

  async isStockTechnicalsCardVisible(): Promise<boolean> {
    return await this.stockTechnicalsCard.isVisible();
  }

  async clickLeftArrow(): Promise<void> {
    await this.leftArrowButton.click({ force: true });
  }

  async clickRightArrow(): Promise<void> {
    await this.rightArrowButton.click({ force: true });
  }
}

export class SnapshotDesktopPage extends SnapshotPage {
  readonly chat: ChatComponent;
  readonly mainMenu: MainMenuComponent;
  readonly tickerSwitcher: TickerSwitcherComponent;

  constructor(page: Page) {
    super(page);
    this.chat = new ChatComponent(page);
    this.mainMenu = new MainMenuComponent(page);
    this.tickerSwitcher = new TickerSwitcherComponent(page);
  }

  async isMarketContextVisible(): Promise<boolean> {
    await this.marketContextSection.waitFor({ state: 'visible', timeout: 5000 }).catch(() => {});
    return await this.marketContextSection.isVisible();
  }

  async isYourPeersVisible(): Promise<boolean> {
    await this.yourPeersSection.waitFor({ state: 'visible', timeout: 5000 }).catch(() => {});
    return await this.yourPeersSection.isVisible();
  }

  async isCompanyNameVisible(): Promise<boolean> {
    await this.companyName.waitFor({ state: 'visible', timeout: 5000 }).catch(() => {});
    return await this.companyName.isVisible();
  }

  async isOnSnapshotPage(): Promise<boolean> {
    const currentUrl = this.page.url();
    const baseUrl = process.env.BASE_URL;
    return currentUrl === baseUrl;
  }

  async waitForCapitalMarketScrollToLoad(): Promise<void> {
    await this.capitalMarketScrollSection
      .waitFor({ state: 'visible', timeout: 5000 })
      .catch(() => {});
  }
}

export class SnapshotMobilePage extends SnapshotPage {
  private readonly menuButton: Locator;
  private readonly stockTickerBadge: Locator;
  private readonly statsNavigationArrow: Locator;
  private readonly priceValue: Locator;
  private readonly percentChangeValue: Locator;
  private readonly volumeValue: Locator;
  private readonly percentVolumeValue: Locator;

  readonly mainMenu: MainMenuComponent;
  readonly tickerSwitcher: TickerSwitcherComponent;

  constructor(page: Page) {
    super(page);

    this.menuButton = page.getByRole('banner').getByRole('img');
    this.stockTickerBadge = page.locator('div.justify-center.text-\\[12px\\].px-2.py-px');
    this.statsNavigationArrow = page.locator('a[href="/stats"] svg');
    this.priceValue = page
      .locator('div.font-semibold')
      .filter({ hasText: 'PRICE' })
      .locator('..')
      .locator('div.text-\\[\\#00C807\\]');
    this.percentChangeValue = page
      .locator('div.font-semibold')
      .filter({ hasText: '%CHG' })
      .locator('..')
      .locator('div');
    this.volumeValue = page
      .locator('div.font-semibold')
      .filter({ hasText: /^VOL$/ })
      .locator('..')
      .locator('div.tracking-\\[-1\\%\\]');
    this.percentVolumeValue = page
      .locator('div.font-semibold')
      .filter({ hasText: '%VOL' })
      .locator('..')
      .locator('div.tracking-\\[-1\\%\\]');

    this.mainMenu = new MainMenuComponent(page);
    this.tickerSwitcher = new TickerSwitcherComponent(page);
  }

  async clickMenuButton(): Promise<void> {
    await this.menuButton.click();
  }

  async getStockTickerText(): Promise<string> {
    return (await this.stockTickerBadge.textContent()) || '';
  }

  async clickStatsNavigationArrow(): Promise<void> {
    await this.statsNavigationArrow.click();
  }

  async getPriceValue(): Promise<string> {
    return (await this.priceValue.textContent()) || '';
  }

  async getPercentChangeValue(): Promise<string> {
    return (await this.percentChangeValue.nth(1).textContent()) || '';
  }

  async getVolumeValue(): Promise<string> {
    return (await this.volumeValue.first().textContent()) || '';
  }

  async getPercentVolumeValue(): Promise<string> {
    return (await this.percentVolumeValue.last().textContent()) || '';
  }

  async isMarketContextVisible(): Promise<boolean> {
    await this.marketContextSection.waitFor({ state: 'visible', timeout: 5000 }).catch(() => {});
    return await this.marketContextSection.isVisible();
  }

  async isYourPeersVisible(): Promise<boolean> {
    await this.yourPeersSection.waitFor({ state: 'visible', timeout: 5000 }).catch(() => {});
    return await this.yourPeersSection.isVisible();
  }

  async isCompanyNameVisible(): Promise<boolean> {
    await this.companyName.waitFor({ state: 'visible', timeout: 5000 }).catch(() => {});
    return await this.companyName.isVisible();
  }

  async isOnSnapshotPage(): Promise<boolean> {
    const currentUrl = this.page.url();
    const baseUrl = process.env.BASE_URL;
    return currentUrl === baseUrl;
  }
}
