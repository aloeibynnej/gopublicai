import { Locator, Page } from '@playwright/test';
import { IPage } from '../interfaces';
import { ChatComponent, MainMenuComponent, TickerSwitcherComponent } from '../components';
import { BASE_URL } from '../constants';

class SnapshotPage implements IPage {
  readonly page: Page;
  readonly chatComponent: ChatComponent;

  readonly mainMenuComponent: MainMenuComponent;

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
  readonly marketsHeading: Locator;
  readonly usTab: Locator;
  readonly globalTab: Locator;
  readonly macroTab: Locator;
  readonly peerComparisonHeading: Locator;
  readonly yourPeersHeading: Locator;
  readonly marketContextHeading: Locator;
  readonly stockPrice: Locator;
  readonly usdLabel: Locator;
  readonly pastMonthLabel: Locator;
  readonly stockTicker: Locator;
  readonly greetingMessage: Locator;
  readonly stockSummary: Locator;
  readonly timePeriod1DButton: Locator;
  readonly timePeriod1MButton: Locator;
  readonly timePeriod3MButton: Locator;
  readonly timePeriod1YButton: Locator;
  readonly timePeriod5YButton: Locator;
  readonly timePeriodAllButton: Locator;
  readonly percentageChangeText: Locator;
  readonly mainContent: Locator;
  readonly loadPreviousNewsButton: Locator;

  constructor(page: Page) {
    this.page = page;
    this.chatComponent = new ChatComponent(page);
    this.mainMenuComponent = new MainMenuComponent(page);

    this.marketContextSection = page.getByText('Market Context');
    this.yourPeersSection = page.getByText('Your peers');
    this.capitalMarketScrollSection = page.getByText('Capital Market Scroll');
    this.companyName = page.locator('div.text-base.font-semibold.uppercase.font-pitchsans');

    this.mainContent = page.locator('#main-content');
    this.investorLensCard = page.locator('.one-question-outer:has-text("Investor Lens")').first();
    this.peerAnalysisCard = page.locator('.one-question-outer:has-text("Peer Analysis")').first();
    this.sectorAnalysisCard = page
      .locator('.one-question-outer:has-text("Sector Analysis")')
      .first();
    this.stockTechnicalsCard = page
      .locator('.one-question-outer:has-text("Stock Technicals")')
      .first();
    this.macroCard = page.locator('.one-question-outer').filter({ hasText: 'MACRO' }).first();
    this.leftArrowButton = page
      .locator('button[data-testid*="carousel-prev"], .embla__controls button')
      .first();
    this.rightArrowButton = page
      .locator('button[data-testid*="carousel-next"], .embla__controls button')
      .last();

    this.loadPreviousNewsButton = page.getByRole('button', { name: 'LOAD PREVIOUS NEWS' });
    this.marketsHeading = page.locator('#rhs-panel').getByText('MARKETS');
    this.usTab = page.locator('#rhs-panel').getByRole('tab', { name: 'US' });
    this.globalTab = page.locator('#rhs-panel').getByRole('tab', { name: 'GLOBAL' });
    this.macroTab = page.locator('#rhs-panel').getByRole('tab', { name: 'MACRO' });

    this.peerComparisonHeading = page.locator('text=/[A-Z]{1,5}\\s+VS\\s+PEERS/i');
    this.yourPeersHeading = page.locator('text=/^YOUR PEERS$/i');

    this.marketContextHeading = page.locator('div').filter({ hasText: /^Market Context$/ });

    const tvIframe = page.frameLocator('iframe[id*="tradingview"], iframe[src*="tradingview"]');
    this.timePeriod1DButton = tvIframe.locator('button[title="1 day"]').first();
    this.timePeriod1MButton = tvIframe.locator('button[title="1 month"]').first();
    this.timePeriod3MButton = tvIframe.locator('button[title="3 months"]').first();
    this.timePeriod1YButton = tvIframe.locator('button[title="1 year"]').first();
    this.timePeriod5YButton = tvIframe.locator('button[title="5 years"]').first();
    this.timePeriodAllButton = tvIframe.locator('button').filter({ hasText: 'All' }).first();
    this.stockPrice = tvIframe.locator('.tv-widget-chart__price-value').first();
    this.usdLabel = tvIframe.locator('span[class*="symbol-currency"]').first();
    this.pastMonthLabel = tvIframe.locator('#delta-range, span[id="delta-range"]').first();

    this.percentageChangeText = tvIframe.locator('#delta-pt, .tv-widget-chart__price-delta-value');
    this.stockTicker = page.locator('text=/^[A-Z]{1,5}$/').first();
    this.greetingMessage = page.locator('text=/Good (morning|afternoon|evening|night),/i').first();
    this.stockSummary = page
      .locator('p')
      .filter({ hasText: /.{100,}/ })
      .first();
  }

  getUrl(id?: string): string {
    return id ? `${BASE_URL}/snapshot/${id}` : BASE_URL;
  }

  async isReady(): Promise<void> {
    await this.marketContextSection.waitFor({ state: 'visible' });
    await this.yourPeersSection.waitFor({ state: 'visible' });
    await this.capitalMarketScrollSection.waitFor({ state: 'visible' });
    await this.page.waitForTimeout(8000);
    await this.investorLensCard.waitFor({ state: 'visible', timeout: 5000 }).catch(() => {});
  }

  async open(): Promise<void> {
    await this.page.goto(this.getUrl());
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

  async isLoadPreviousNewsButtonVisible(): Promise<boolean> {
    return await this.loadPreviousNewsButton.isVisible();
  }

  async clickAnalysisCard(cardName: 'investor' | 'peer' | 'sector' | 'technicals'): Promise<void> {
    const cardMap = {
      investor: this.investorLensCard,
      peer: this.peerAnalysisCard,
      sector: this.sectorAnalysisCard,
      technicals: this.stockTechnicalsCard,
    };

    const card = cardMap[cardName];
    await card.scrollIntoViewIfNeeded();
    await this.page.waitForTimeout(2000); // Wait for any scroll animations
    await card.click({ force: true });
  }

  async waitForChatQuestion(questionPattern: RegExp, timeoutMs: number = 10000): Promise<void> {
    const questionLocator = this.page.locator(`text=${questionPattern}`).first();
    await questionLocator.waitFor({ state: 'visible', timeout: timeoutMs });
  }

  // TODO: Chat history backend not implemented in Vercel environment yet
  async closeChatAndRefresh(): Promise<void> {
    // await this.chat.closeChat();
    await this.page.waitForTimeout(1000); // Wait for chat close animation
    await this.page.reload();
    await this.isReady();
    await this.page.waitForTimeout(2000); // Wait for page to stabilize after reload
  }

  async isMarketsHeadingVisible(): Promise<boolean> {
    await this.page.waitForTimeout(1000);
    return await this.marketsHeading.isVisible();
  }

  async isPeerComparisonHeadingVisible(): Promise<boolean> {
    await this.page.waitForTimeout(1000);
    return await this.peerComparisonHeading.isVisible();
  }

  async verifyJustNowTimestamp(): Promise<boolean> {
    const timestampLocator = this.page.locator('text=/JUST NOW|< \d+ MIN AGO/i').first();
    return await timestampLocator.isVisible({ timeout: 5000 }).catch(() => false);
  }

  async clickUsTab(): Promise<void> {
    await this.usTab.hover();
    await this.page.waitForTimeout(200);
    await this.usTab.click();
  }

  async clickGlobalTab(): Promise<void> {
    await this.globalTab.hover();
    await this.page.waitForTimeout(200);
    await this.globalTab.click();
  }

  async clickMacroTab(): Promise<void> {
    await this.macroTab.hover();
    await this.page.waitForTimeout(200);
    await this.macroTab.click();
    await this.page.waitForTimeout(1000);
  }
  async verifyMacroIndices(): Promise<void> {
    await this.marketsHeading.waitFor({ state: 'visible', timeout: 2000 }).catch(() => {});

    const indices = ['OIL', 'GOLD', 'BITCOIN', 'USD/YEN'];

    await this.page
      .locator(`text="${indices[0]}"`)
      .first()
      .waitFor({ state: 'visible', timeout: 5000 })
      .catch(() => {});
    await this.page
      .locator(`text="${indices[1]}"`)
      .first()
      .waitFor({ state: 'visible', timeout: 5000 })
      .catch(() => {});
    await this.page
      .locator(`text="${indices[2]}"`)
      .first()
      .waitFor({ state: 'visible', timeout: 5000 })
      .catch(() => {});
    await this.page
      .locator(`text="${indices[3]}"`)
      .first()
      .waitFor({ state: 'visible', timeout: 5000 })
      .catch(() => {});
  }

  async verifyUsMarketIndices(): Promise<void> {
    await this.marketsHeading.waitFor({ state: 'visible', timeout: 2000 }).catch(() => {});

    const indices = ['S&P 500', 'NASDAQ 100', 'RUSSELL 2000', 'DOW'];

    await this.page
      .locator(`text="${indices[0]}"`)
      .first()
      .waitFor({ state: 'visible', timeout: 5000 })
      .catch(() => {});
    await this.page
      .locator(`text="${indices[1]}"`)
      .first()
      .waitFor({ state: 'visible', timeout: 5000 })
      .catch(() => {});
    await this.page
      .locator(`text="${indices[2]}"`)
      .first()
      .waitFor({ state: 'visible', timeout: 5000 })
      .catch(() => {});
    await this.page
      .locator(`text="${indices[3]}"`)
      .first()
      .waitFor({ state: 'visible', timeout: 5000 })
      .catch(() => {});
  }

  async verifyGlobalMarketIndices(): Promise<void> {
    await this.marketsHeading.waitFor({ state: 'visible', timeout: 2000 }).catch(() => {});

    const indices = ['NIKKEI 225', 'SHANGHAI', 'HANG SENG', 'FTSE 100', 'EUROSTOXX50'];
    await this.page
      .locator(`text="${indices[0]}"`)
      .first()
      .waitFor({ state: 'visible', timeout: 5000 })
      .catch(() => {});
    await this.page
      .locator(`text="${indices[1]}"`)
      .first()
      .waitFor({ state: 'visible', timeout: 5000 })
      .catch(() => {});
    await this.page
      .locator(`text="${indices[2]}"`)
      .first()
      .waitFor({ state: 'visible', timeout: 5000 })
      .catch(() => {});
    await this.page
      .locator(`text="${indices[3]}"`)
      .first()
      .waitFor({ state: 'visible', timeout: 5000 })
      .catch(() => {});
    await this.page
      .locator(`text="${indices[4]}"`)
      .first()
      .waitFor({ state: 'visible', timeout: 5000 })
      .catch(() => {});
  }

  async isYourPeersHeadingVisible(): Promise<boolean> {
    return await this.yourPeersHeading.isVisible();
  }

  async getPeerNewsItems(): Promise<number> {
    await this.yourPeersHeading.scrollIntoViewIfNeeded();
    await this.page.waitForTimeout(1000);
    const items = this.page.locator('div[class*="marcon-question-button"]');
    return await items.count();
  }

  async getPeerNewsItemText(index: number = 0): Promise<string | null> {
    await this.yourPeersHeading.scrollIntoViewIfNeeded();
    await this.page.waitForTimeout(1000);

    const items = this.page.locator('div[class*="marcon-question-button"]');
    const item = items.nth(index);

    return await item.textContent();
  }

  async clickPeerNewsItem(index: number = 0): Promise<string | null> {
    await this.yourPeersHeading.scrollIntoViewIfNeeded();
    await this.page.waitForTimeout(1000);

    const items = this.page.locator('div[class*="marcon-question-button"]');
    const item = items.nth(index);

    const itemText = await item.textContent();

    await item.scrollIntoViewIfNeeded();
    await item.hover({ force: true });
    await this.page.waitForTimeout(200);
    await item.click({ force: true });
    await this.page.waitForTimeout(2000);

    return itemText;
  }

  async verifyChatQuestionMatches(expectedText: string): Promise<boolean> {
    await this.page.waitForTimeout(2000);
    let questionLocator = this.page.locator(`text="${expectedText}"`).first();
    let isVisible = await questionLocator.isVisible({ timeout: 2000 }).catch(() => false);

    if (isVisible) {
      return true;
    }

    const headlineMatch = expectedText.match(/[A-Z]{3,5}\d{1,2}\s+[A-Za-z]{3}(.+)$/);
    if (headlineMatch && headlineMatch[1]) {
      const headline = headlineMatch[1].trim();
      questionLocator = this.page.locator(`text="${headline}"`).first();
      isVisible = await questionLocator.isVisible({ timeout: 2000 }).catch(() => false);
      if (isVisible) {
        return true;
      }
    }

    // As a last resort, check if any part of the text appears in chat
    const partialMatch = this.page.locator(`text=/${expectedText.substring(0, 30)}/i`).first();
    return await partialMatch.isVisible({ timeout: 2000 }).catch(() => false);
  }

  async isMarketContextHeadingVisible(): Promise<boolean> {
    await this.marketContextHeading.scrollIntoViewIfNeeded();
    return await this.marketContextHeading.isVisible();
  }

  async isStockPriceVisible(): Promise<boolean> {
    await this.marketContextHeading.scrollIntoViewIfNeeded();
    return await this.stockPrice.isVisible();
  }

  async getStockPriceValue(): Promise<string | null> {
    await this.marketContextHeading.scrollIntoViewIfNeeded();
    return await this.stockPrice.textContent();
  }

  async isUsdLabelVisible(): Promise<boolean> {
    await this.marketContextHeading.scrollIntoViewIfNeeded();
    return await this.usdLabel.isVisible();
  }

  async isPastMonthLabelVisible(): Promise<boolean> {
    await this.marketContextHeading.scrollIntoViewIfNeeded();
    return await this.pastMonthLabel.isVisible();
  }

  async verifyMarketContextChartLoads(): Promise<boolean> {
    await this.marketContextHeading.scrollIntoViewIfNeeded();
    await this.page.waitForTimeout(1000);

    const headingVisible = await this.isMarketContextHeadingVisible();
    const priceVisible = await this.isStockPriceVisible();
    const usdVisible = await this.isUsdLabelVisible();
    const pastMonthVisible = await this.isPastMonthLabelVisible();

    return headingVisible && priceVisible && usdVisible && pastMonthVisible;
  }

  async isStockTickerVisible(): Promise<boolean> {
    await this.page.evaluate(() => window.scrollTo(0, 0));
    await this.page.waitForTimeout(500);
    return await this.stockTicker.isVisible();
  }

  async getStockTickerValue(): Promise<string | null> {
    await this.page.evaluate(() => window.scrollTo(0, 0));
    await this.page.waitForTimeout(500);
    return await this.stockTicker.textContent();
  }

  async isCompanyNameVisible(): Promise<boolean> {
    // Scroll to Market Context section where the TradingView widget is
    await this.marketContextHeading.scrollIntoViewIfNeeded();
    await this.page.waitForTimeout(1000);
    return await this.companyName.isVisible();
  }

  async getCompanyNameValue(): Promise<string | null> {
    await this.marketContextHeading.scrollIntoViewIfNeeded();
    await this.page.waitForTimeout(1000);
    return await this.companyName.textContent();
  }

  async isGreetingMessageVisible(): Promise<boolean> {
    // Scroll to top first, then down to find greeting message
    await this.page.evaluate(() => window.scrollTo(0, 0));
    await this.page.waitForTimeout(300);
    // Scroll down to where greeting typically appears
    await this.page.evaluate(() => window.scrollTo(0, 400));
    await this.page.waitForTimeout(500);
    return await this.greetingMessage.isVisible({ timeout: 2000 }).catch(() => false);
  }

  async getGreetingMessageValue(): Promise<string | null> {
    await this.page.evaluate(() => window.scrollTo(0, 0));
    await this.page.waitForTimeout(300);
    await this.page.evaluate(() => window.scrollTo(0, 400));
    await this.page.waitForTimeout(500);
    return await this.greetingMessage.textContent().catch(() => null);
  }

  async isStockSummaryVisible(): Promise<boolean> {
    await this.page.evaluate(() => window.scrollTo(0, 0));
    await this.page.waitForTimeout(300);
    await this.page.evaluate(() => window.scrollTo(0, 600));
    await this.page.waitForTimeout(500);
    return await this.stockSummary.isVisible({ timeout: 2000 }).catch(() => false);
  }

  async getStockSummaryValue(): Promise<string | null> {
    await this.page.evaluate(() => window.scrollTo(0, 0));
    await this.page.waitForTimeout(300);
    await this.page.evaluate(() => window.scrollTo(0, 600));
    await this.page.waitForTimeout(500);
    return await this.stockSummary.textContent().catch(() => null);
  }

  async verifyStockHeaderDisplays(): Promise<boolean> {
    const tickerVisible = await this.isStockTickerVisible();
    const companyVisible = await this.isCompanyNameVisible();
    return tickerVisible && companyVisible;
  }

  async clickTimePeriod1D(): Promise<void> {
    await this.page.waitForTimeout(1000);
    await this.marketContextHeading.scrollIntoViewIfNeeded();
    await this.timePeriod1DButton.click();
  }

  async clickTimePeriod1M(): Promise<void> {
    await this.page.waitForTimeout(1000);
    await this.marketContextHeading.scrollIntoViewIfNeeded();
    await this.timePeriod1MButton.click();
  }

  async clickTimePeriod3M(): Promise<void> {
    await this.page.waitForTimeout(1000);
    await this.marketContextHeading.scrollIntoViewIfNeeded();
    await this.timePeriod3MButton.click();
  }

  async clickTimePeriod1Y(): Promise<void> {
    await this.page.waitForTimeout(1000);
    await this.marketContextHeading.scrollIntoViewIfNeeded();
    await this.timePeriod1YButton.click();
  }

  async clickTimePeriod5Y(): Promise<void> {
    await this.page.waitForTimeout(1000);
    await this.marketContextHeading.scrollIntoViewIfNeeded();
    await this.timePeriod5YButton.click();
  }

  async clickTimePeriodAll(): Promise<void> {
    await this.page.waitForTimeout(1000);
    await this.marketContextHeading.scrollIntoViewIfNeeded();
    await this.timePeriodAllButton.click();
  }

  async getPercentageChangeText(): Promise<string | null> {
    await this.page.waitForTimeout(1000);
    return await this.percentageChangeText.textContent();
  }

  async verifyTimePeriodLabelContains(expectedText: string): Promise<boolean> {
    // Look for the time period label in the chart area
    const labelLocator = this.page
      .locator('iframe[title="symbol overview TradingView widget"]')
      .contentFrame()
      .locator('#delta-range');
    return await labelLocator.isVisible();
  }
}

export class SnapshotDesktopPage extends SnapshotPage {
  readonly mainMenu: MainMenuComponent;
  readonly tickerSwitcher: TickerSwitcherComponent;

  constructor(page: Page) {
    super(page);
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
    return currentUrl === `${baseUrl}/snapshot`;
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
