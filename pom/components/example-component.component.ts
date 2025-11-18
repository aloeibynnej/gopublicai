import { Locator, Page } from '@playwright/test';

/**
 * ExampleComponent represents a reusable UI component in the Page Object Model
 * This pattern allows for better organization and reuse of component selectors and actions
 */
export class ExampleComponent {
  // Private properties for component elements
  private readonly container: Locator;
  private readonly title: Locator;
  private readonly submitButton: Locator;
  private readonly inputField: Locator;

  /**
   * Constructor for the ExampleComponent
   * @param page - The Playwright Page object
   * @param rootSelector - The root selector for this component (optional, defaults to a common selector)
   */
  constructor(
    private readonly page: Page,
    rootSelector: string = '[data-testid="example-component"]'
  ) {
    // Initialize component elements
    this.container = page.locator(rootSelector);
    this.title = this.container.locator('h2');
    this.submitButton = this.container.locator('button[type="submit"]');
    this.inputField = this.container.locator('input[name="example-input"]');
  }

  /**
   * Checks if the component is visible on the page
   * @returns Promise resolving to boolean indicating visibility
   */
  async isVisible(): Promise<boolean> {
    return await this.container.isVisible();
  }

  /**
   * Waits for the component to be loaded and visible
   */
  async waitForComponent(): Promise<void> {
    await this.container.waitFor({ state: 'visible' });
  }

  /**
   * Gets the title text of the component
   * @returns Promise resolving to the title text
   */
  async getTitleText(): Promise<string> {
    return (await this.title.textContent()) || '';
  }

  /**
   * Fills the input field with the provided value
   * @param value - The value to fill in the input field
   */
  async fillInput(value: string): Promise<void> {
    await this.inputField.fill(value);
  }

  /**
   * Clicks the submit button
   */
  async clickSubmit(): Promise<void> {
    await this.submitButton.click();
  }

  /**
   * Performs a complete form submission action
   * @param inputValue - The value to submit in the form
   */
  async submitForm(inputValue: string): Promise<void> {
    await this.waitForComponent();
    await this.fillInput(inputValue);
    await this.clickSubmit();
  }

  /**
   * Checks if the input field has validation error
   * @returns Promise resolving to boolean indicating if there's an error
   */
  async hasInputError(): Promise<boolean> {
    const errorClass = 'has-error';
    return await this.inputField.evaluate(
      (el, className) => el.classList.contains(className),
      errorClass
    );
  }
}
