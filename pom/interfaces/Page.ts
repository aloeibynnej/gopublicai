/**
 * Interface for all page objects in the Page Object Model
 * Each page class should implement these methods
 */
export interface IPage {
  /**
   * Returns the URL for the page
   */
  getUrl(id?: string): string;

  /**
   * Checks if the page is ready (loaded and key elements are visible)
   */
  isReady(): Promise<void>;

  /**
   * Opens the page in the browser
   */
  open(id?: string): Promise<void>;
}
