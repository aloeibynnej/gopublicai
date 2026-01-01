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
  readonly marketsHeading: Locator;
  readonly usTab: Locator;
  readonly globalTab: Locator;
  readonly macroTab: Locator;
  readonly peerComparisonHeading: Locator;
  readonly yourPeersHeading: Locator;

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
    
    // TODO: Frontend should add data-testid attributes to right side navigation elements:
    // - Markets section: data-testid="markets-section"
    // - US tab: data-testid="markets-us-tab"
    // - GLOBAL tab: data-testid="markets-global-tab"
    // - MACRO tab: data-testid="markets-macro-tab"
    // - Peer comparison section: data-testid="peer-comparison-section"
    
    // Right side navigation - Markets section
    this.marketsHeading = page.locator('text=/^MARKETS$/i').first();
    this.usTab = page.locator('button:has-text("US"), [role="tab"]:has-text("US")').first();
    this.globalTab = page.locator('button:has-text("GLOBAL"), [role="tab"]:has-text("GLOBAL")').first();
    this.macroTab = page.locator('button:has-text("MACRO"), [role="tab"]:has-text("MACRO")').first();
    
    // Peer comparison section - use regex to match dynamic stock ticker
    this.peerComparisonHeading = page.locator('text=/[A-Z]{1,5}\\s+VS\\s+PEERS/i').first();
    
    // TODO: Frontend should add data-testid attributes to YOUR PEERS elements:
    // - Your Peers section: data-testid="your-peers-section"
    // - Peer news items: data-testid="peer-news-item"
    
    // YOUR PEERS section
    this.yourPeersHeading = page.locator('text=/^YOUR PEERS$/i').first();
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

  async clickAnalysisCard(cardName: 'investor' | 'peer' | 'sector' | 'technicals'): Promise<void> {
    const cardMap = {
      investor: this.investorLensCard,
      peer: this.peerAnalysisCard,
      sector: this.sectorAnalysisCard,
      technicals: this.stockTechnicalsCard
    };
    
    const card = cardMap[cardName];
    await card.scrollIntoViewIfNeeded();
    await this.page.waitForTimeout(2000); // Wait for any scroll animations
    await card.click({ force: true });
  }

  async waitForChatQuestion(questionPattern: RegExp, timeoutMs: number = 10000): Promise<void> {
    // TODO: Frontend should add data-testid to chat question elements for more reliable selection
    // Example: data-testid="chat-question" on the question text element
    const questionLocator = this.page.locator(`text=${questionPattern}`).first();
    await questionLocator.waitFor({ state: 'visible', timeout: timeoutMs });
  }

  async closeChatAndRefresh(): Promise<void> {
    await this.chat.closeChat();
    await this.page.waitForTimeout(1000); // Wait for chat close animation
    await this.page.reload();
    await this.isReady();
    await this.page.waitForTimeout(2000); // Wait for page to stabilize after reload
  }

  async isMarketsHeadingVisible(): Promise<boolean> {
    return await this.marketsHeading.isVisible();
  }

  async isPeerComparisonHeadingVisible(): Promise<boolean> {
    return await this.peerComparisonHeading.isVisible();
  }

  async verifyJustNowTimestamp(): Promise<boolean> {
    // Verify "JUST NOW" or "< 1 MIN AGO" timestamp appears
    const timestampLocator = this.page.locator('text=/JUST NOW|< \d+ MIN AGO/i').first();
    return await timestampLocator.isVisible({ timeout: 5000 }).catch(() => false);
  }

  async clickUsTab(): Promise<void> {
    await this.usTab.hover();
    await this.page.waitForTimeout(200);
    await this.usTab.click();
    await this.page.waitForTimeout(1000);
  }

  async clickGlobalTab(): Promise<void> {
    await this.globalTab.hover();
    await this.page.waitForTimeout(200);
    await this.globalTab.click();
    await this.page.waitForTimeout(1000);
  }

  async clickMacroTab(): Promise<void> {
    await this.macroTab.hover();
    await this.page.waitForTimeout(200);
    await this.macroTab.click();
    await this.page.waitForTimeout(1000);
  }

  async verifyUsMarketIndices(): Promise<boolean> {
    const indices = ['S&P 500', 'NASDAQ 100', 'RUSSELL 2000', 'DOW'];
    
    for (const index of indices) {
      const indexLocator = this.page.locator(`text=/^${index}$/i`).first();
      const isVisible = await indexLocator.isVisible({ timeout: 2000 }).catch(() => false);
      if (!isVisible) {
        return false;
      }
    }
    
    return true;
  }

  async verifyGlobalMarketIndices(): Promise<boolean> {
    const indices = ['NIKKEI 225', 'SHANGHAI', 'HANG SENG', 'FTSE 100', 'EUROSTOXX50'];
    
    for (const index of indices) {
      const indexLocator = this.page.locator(`text=/^${index}$/i`).first();
      const isVisible = await indexLocator.isVisible({ timeout: 2000 }).catch(() => false);
      if (!isVisible) {
        return false;
      }
    }
    
    return true;
  }

  async verifyMacroIndices(): Promise<boolean> {
    const indices = ['OIL', 'GOLD', 'BITCOIN', 'USD/YEN'];
    
    for (const index of indices) {
      const indexLocator = this.page.locator(`text=/^${index}$/i`).first();
      const isVisible = await indexLocator.isVisible({ timeout: 2000 }).catch(() => false);
      if (!isVisible) {
        return false;
      }
    }
    
    return true;
  }

  async isYourPeersHeadingVisible(): Promise<boolean> {
    return await this.yourPeersHeading.isVisible();
  }

  async getPeerNewsItems(): Promise<number> {
    // Scroll to YOUR PEERS section first (it's below the fold)
    await this.yourPeersHeading.scrollIntoViewIfNeeded();
    await this.page.waitForTimeout(1000);
    
    // Get all peer news items - based on screenshot, they appear to be divs with marcon-question-button class
    const items = this.page.locator('div[class*="marcon-question-button"]');
    return await items.count();
  }

  async getPeerNewsItemText(index: number = 0): Promise<string | null> {
    // Scroll to YOUR PEERS section first
    await this.yourPeersHeading.scrollIntoViewIfNeeded();
    await this.page.waitForTimeout(1000);
    
    // Get peer news items
    const items = this.page.locator('div[class*="marcon-question-button"]');
    const item = items.nth(index);
    
    // Get the text directly from the button
    return await item.textContent();
  }

  async clickPeerNewsItem(index: number = 0): Promise<string | null> {
    // Scroll to YOUR PEERS section first
    await this.yourPeersHeading.scrollIntoViewIfNeeded();
    await this.page.waitForTimeout(1000);
    
    // Get peer news items
    const items = this.page.locator('div[class*="marcon-question-button"]');
    const item = items.nth(index);
    
    // Capture the text directly from the button before clicking
    const itemText = await item.textContent();
    
    // Scroll item into view and click
    await item.scrollIntoViewIfNeeded();
    await item.hover({ force: true });
    await this.page.waitForTimeout(200);
    await item.click({ force: true });
    await this.page.waitForTimeout(2000);
    
    return itemText;
  }

  async verifyChatQuestionMatches(expectedText: string): Promise<boolean> {
    // Wait for chat to open and question to appear
    await this.page.waitForTimeout(2000);
    
    // The captured text might have extra formatting (ticker, date, etc.)
    // Extract just the main headline part (after the date)
    // Format is typically: "TICKER DATE HEADLINE"
    // Example: "AMZN30 DecAWS to invest $50B..."
    
    // Try to find the text as-is first
    let questionLocator = this.page.locator(`text="${expectedText}"`).first();
    let isVisible = await questionLocator.isVisible({ timeout: 2000 }).catch(() => false);
    
    if (isVisible) {
      return true;
    }
    
    // If not found, try to extract just the headline portion
    // Look for the headline text (usually starts after the date pattern)
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
