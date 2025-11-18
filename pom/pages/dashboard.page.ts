import { Page } from '@playwright/test';
import { IPage } from '../interfaces';
import { BASE_URL } from '../constants';

export class DashboardPage implements IPage {
  readonly page: Page;

  private readonly mainLocator = '#main-content';
  private readonly investorLensQuestion = 'How do hedge funds perceive my stock?';
  private readonly peerAnalysisQuestion = 'Which peers are performing better than Microsoft today?';
  private readonly sectorAnalysisQuestion = 'Why is my stock outperforming my sector?';
  private readonly volumeQuestion = 'Why is my volume unusually low today?';
  private readonly priceQuestion = 'Why is my price down modestly today?';

  constructor(page: Page) {
    this.page = page;
  }

  getUrl(): string {
    return `${BASE_URL}/`;
  }

  async isReady(): Promise<void> {
    await this.page.locator(this.mainLocator).waitFor({ state: 'visible' });
  }

  async open(): Promise<void> {
    await this.page.goto(this.getUrl());
    await this.isReady();
  }

  async openInvestorLensCard(): Promise<void> {
    await this.page.getByText(this.investorLensQuestion, { exact: true }).click();
  }

  async openPeerAnalysisCard(): Promise<void> {
    await this.page.getByText(this.peerAnalysisQuestion, { exact: true }).click();
  }

  async openSectorAnalysisCard(): Promise<void> {
    await this.page.getByText(this.sectorAnalysisQuestion, { exact: true }).click();
  }

  async openVolumeQuestionCard(): Promise<void> {
    await this.page.getByText(this.volumeQuestion, { exact: true }).click();
  }

  async openPriceQuestionCard(): Promise<void> {
    await this.page.getByText(this.priceQuestion, { exact: true }).click();
  }
}
