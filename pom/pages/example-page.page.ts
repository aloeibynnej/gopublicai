import { Page } from '@playwright/test';
import { IPage } from '../interfaces';
import { ExampleComponent } from '../components/example-component.component';
import { BASE_URL } from '../constants';

/**
 * ExamplePage represents a page in the application using the Page Object Model pattern
 * It implements the IPage interface and uses the ExampleComponent
 */
export class ExamplePage implements IPage {
  // Page components
  readonly page: Page;
  private readonly exampleComponent: ExampleComponent;

  // Page-specific selectors
  private readonly pageContainer = '[data-testid="example-page"]';
  private readonly pageTitle = 'h1';
  private readonly pageContent = '.content';

  /**
   * Constructor for the ExamplePage
   * @param page - The Playwright Page object
   */
  constructor(page: Page) {
    this.page = page;
    // Initialize components used on this page
    this.exampleComponent = new ExampleComponent(page);
  }

  /**
   * Returns the URL for this page
   * @param id - Optional ID parameter for dynamic pages
   * @returns The complete URL for this page
   */
  getUrl(id?: string): string {
    const basePath = '/example';
    return id ? `${BASE_URL}${basePath}/${id}` : `${BASE_URL}${basePath}`;
  }

  /**
   * Checks if the page is ready (loaded and key elements are visible)
   */
  async isReady(): Promise<void> {
    // Wait for the main container to be visible
    await this.page.locator(this.pageContainer).waitFor({ state: 'visible' });

    // Wait for the page title to be visible
    await this.page.locator(this.pageTitle).waitFor({ state: 'visible' });

    // Wait for the example component to be visible
    await this.exampleComponent.waitForComponent();
  }

  /**
   * Opens the page in the browser
   * @param id - Optional ID parameter for dynamic pages
   */
  async open(id?: string): Promise<void> {
    await this.page.goto(this.getUrl(id));
    await this.isReady();
  }

  /**
   * Gets the page title text
   * @returns Promise resolving to the page title text
   */
  async getPageTitle(): Promise<string> {
    return (await this.page.locator(this.pageTitle).textContent()) || '';
  }

  /**
   * Gets the page content text
   * @returns Promise resolving to the page content text
   */
  async getPageContent(): Promise<string> {
    return (await this.page.locator(this.pageContent).textContent()) || '';
  }

  /**
   * Example of a page-specific action that uses the component
   * @param inputValue - The value to submit in the form
   */
  async submitExampleForm(inputValue: string): Promise<void> {
    await this.exampleComponent.submitForm(inputValue);

    // Wait for some page-specific response after form submission
    await this.page.waitForSelector('.success-message', { state: 'visible' });
  }

  /**
   * Checks if the form submission was successful
   * @returns Promise resolving to boolean indicating success
   */
  async isSubmissionSuccessful(): Promise<boolean> {
    const successMessage = this.page.locator('.success-message');
    return await successMessage.isVisible();
  }
}
