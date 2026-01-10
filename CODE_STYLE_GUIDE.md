# E2E Test Suite - Code Style Guide

This document outlines the coding patterns and best practices for this Playwright E2E test suite. Follow these guidelines to ensure consistency and maintainability across all test files and page objects.

## Table of Contents
- [Page Object Model (POM) Patterns](#page-object-model-pom-patterns)
- [Locator Strategy](#locator-strategy)
- [Test Structure](#test-structure)
- [Validation Patterns](#validation-patterns)
- [Frontend Collaboration](#frontend-collaboration)

---

## Page Object Model (POM) Patterns

### File Organization
- **Pages**: `/pom/pages/*.page.ts` - Represent full pages (e.g., `snapshot.page.ts`, `health-monitor.page.ts`)
- **Components**: `/pom/components/*.component.ts` - Represent reusable UI components (e.g., `chat.component.ts`)
- **Tests**: `/tests/*.spec.ts` - Test files that use page objects

### Page Object Structure

```typescript
export class ExamplePage implements Page {
  readonly locator1: Locator;
  private readonly locator2: Locator;

  constructor(private readonly page: Page) {
    // Initialize all locators in constructor
    this.locator1 = page.locator('selector');
    this.locator2 = page.locator('selector');
  }

  getUrl(): string {
    return `${BASE_URL}/path`;
  }

  async isReady(): Promise<void> {
    await this.page.waitForLoadState('networkidle');
    await this.mainContent.isVisible();
  }

  // Action methods
  async clickSomething(): Promise<void> {
    await this.locator1.click();
  }
}
```

**Key Principles:**
- All page objects must implement the `Page` interface from `/pom/interfaces/Page.ts`
- Use `readonly` for public locators, `private readonly` for internal ones
- Initialize all locators in the constructor
- Provide `getUrl()` and `isReady()` methods
- Keep page objects in `/pom/pages/` directory

---

## Locator Strategy

### Priority Order (Most Preferred → Least Preferred)

1. **Semantic Selectors** (Best for accessibility and stability)
   - `getByRole()`, `getByLabel()`, `getByPlaceholder()`, `getByText()`
   - `aria-label`, `aria-labelledby`, `role` attributes
   
2. **Data Test IDs** (Recommended for elements without semantic meaning)
   - `data-testid` attributes
   - Example: `page.locator('[data-testid="submit-button"]')`

3. **Structural Selectors** (Use as last resort)
   - CSS classes, element structure
   - Should be combined with other selectors when possible

### Multi-Selector Fallback Pattern

**Always use multiple selector strategies** to make tests resilient to UI changes:

```typescript
// ✅ GOOD - Multiple fallback selectors
this.chatTriggerButton = page.locator(
  'button:has-text("Charlie"), ' +
  'button[aria-label*="Charlie" i], ' +
  'button[data-testid*="chat-trigger"], ' +
  '[class*="chat"][class*="button"]'
).first();

// ❌ BAD - Single fragile selector
this.chatTriggerButton = page.locator('.chat-fab-button').first();
```

**Pattern Breakdown:**
1. Try semantic selectors first (text, aria-label)
2. Fall back to `data-testid` if available
3. Use structural selectors as last resort
4. Use case-insensitive matching with `i` flag when appropriate
5. Chain with `.first()` or `.last()` to handle multiple matches

### Locator Best Practices

```typescript
// ✅ Use .first() or .last() to handle multiple matches
this.leftArrow = page.locator('button[aria-label*="prev" i]').first();
this.rightArrow = page.locator('button[aria-label*="next" i]').last();

// ✅ Use .filter() for more specific matching
this.macroCard = page.locator('.card').filter({ hasText: 'MACRO' }).first();

// ✅ Use :has() for parent-child relationships
this.investorCard = page.locator('.card:has-text("Investor Lens")').first();

// ❌ AVOID parent traversal with '..'
// This is fragile and breaks easily
this.button = page.locator('.container').locator('..').locator('button');

// ✅ BETTER - Direct selector or filter
this.button = page.locator('.container button').first();
```

### Handling Missing Elements

When elements are difficult to locate, provide helpful error messages:

```typescript
async openChat(): Promise<void> {
  const possibleSelectors = [
    'button:has-text("Charlie")',
    'button[aria-label*="chat" i]',
    'button[data-testid*="chat"]'
  ];
  
  for (const selector of possibleSelectors) {
    const button = this.page.locator(selector).first();
    if (await button.count() > 0 && await button.isVisible()) {
      await button.click();
      return;
    }
  }
  
  throw new Error(
    'Could not find chat trigger button. ' +
    'Please add data-testid="chat-trigger" to the chat button.'
  );
}
```

---

## Test Structure

### Test File Organization

```typescript
import { test, expect } from '@playwright/test';
import { PageName } from '../pom/pages';

test.describe('Feature Name', () => {
  test('should do something @desktop', async ({ page }) => {
    // 1. Setup
    await page.setViewportSize({ width: 1728, height: 1117 });
    const pageName = new PageName(page);
    await pageName.open();
    await pageName.isReady();

    // 2. Action
    await pageName.performAction();

    // 3. Assertion
    await expect(pageName.element).toBeVisible();
  });
});
```

### Test Naming Conventions

- Use descriptive test names: `should navigate carousel using arrow buttons`
- Add tags for test categorization: `@desktop`, `@mobile`, `@smoke`
- Group related tests in `test.describe()` blocks

### Timeouts and Waits

```typescript
// ✅ Use specific waits for animations
await page.waitForTimeout(2500); // Carousel animation
await element.waitFor({ state: 'visible', timeout: 5000 });

// ✅ Set test-specific timeouts when needed
test.setTimeout(120_000); // 2 minutes for complex interactions

// ❌ AVOID arbitrary long waits
await page.waitForTimeout(10000); // Too long, be specific
```

---

## Validation Patterns

### What to Validate

1. **Visual State Changes**
   - Element visibility: `await expect(element).toBeVisible()`
   - Element text content: `await expect(element).toHaveText('Expected')`
   - Element attributes: `await expect(element).toHaveAttribute('aria-expanded', 'true')`

2. **DOM State Changes**
   - CSS transforms for carousels/animations
   - Class changes for state transitions
   - Attribute changes for interactive elements

3. **Functional Outcomes**
   - Navigation occurred: URL changed
   - Data loaded: Content appeared
   - User action completed: Form submitted

### CSS Transform Validation (for Carousels/Animations)

When validating carousel or slider movement, check the CSS `transform` property:

```typescript
// Get initial transform
const carouselContainer = page.locator('.embla__container').first();
const initialTransform = await carouselContainer.evaluate(el => 
  window.getComputedStyle(el).transform
);

// Perform action
await page.click('.next-button');
await page.waitForTimeout(2500); // Wait for animation

// Validate transform changed
const newTransform = await carouselContainer.evaluate(el => 
  window.getComputedStyle(el).transform
);
expect(newTransform).not.toBe(initialTransform);
```

**Why?** DOM elements may remain visible even when scrolled out of view. Transform validation proves the carousel actually moved.

### Visibility Limitations

**Important:** `.isVisible()` checks if an element is in the DOM and has non-zero dimensions, but **does not** check if it's scrolled into view.

```typescript
// ❌ This may pass even when card is scrolled out of view
await expect(card).toBeVisible();

// ✅ Better - validate transform or scroll position
const transform = await container.evaluate(el => 
  window.getComputedStyle(el).transform
);
expect(transform).toBe('matrix(1, 0, 0, 1, -276, 0)');
```

---

## Frontend Collaboration

### Requesting Data Test IDs

When you encounter elements that are difficult to locate reliably, add TODO comments:

```typescript
// TODO: Frontend team should add data-testid attributes to carousel navigation:
// - Left arrow button: data-testid="carousel-prev-button"
// - Right arrow button: data-testid="carousel-next-button"
// These buttons are in the .embla__controls section below the analysis cards

this.leftArrow = page.locator(
  'button[aria-label*="prev" i], ' +
  'button[data-testid*="carousel-prev"], ' + // Will use this when added
  '.embla__controls button'
).first();
```

**TODO Comment Template:**
```typescript
// TODO: Frontend should add data-testid="element-name" to [describe element location]
// This will make the test more stable and maintainable
```

### Coordinate-Based Clicks (Last Resort)

Only use coordinate-based clicks when:
1. Element has no stable selectors
2. Element is visually positioned (e.g., close button in overlay)
3. You've documented why and added a TODO for better selectors

```typescript
async closeChat(): Promise<void> {
  // TODO: Add data-testid="chat-close-button" to the X button in chat overlay
  // Using coordinates as fallback until data-testid is available
  await this.page.mouse.click(1680, 80);
  await this.page.waitForTimeout(500);
}
```

---

## Common Patterns Reference

### Opening and Interacting with Modals/Overlays

```typescript
async openModal(): Promise<void> {
  const isVisible = await this.modal.isVisible();
  if (!isVisible) {
    await this.triggerButton.click();
    await this.modal.waitFor({ state: 'visible' });
  }
}

async closeModal(): Promise<void> {
  await this.closeButton.click();
  await this.modal.waitFor({ state: 'hidden' });
}
```

### Handling Dynamic Content

```typescript
// Wait for dynamic content to load
await this.page.waitForLoadState('networkidle');

// Wait for specific element
await this.dynamicElement.waitFor({ state: 'visible', timeout: 10000 });

// Use regex for dynamic text
this.greeting = page.getByText(/Good (morning|afternoon|evening),.*Your/i).first();
```

### Scrolling Elements into View

```typescript
// Scroll before interacting
await element.scrollIntoViewIfNeeded();
await element.click();

// Force click if element is covered
await element.click({ force: true });
```

---

## Summary

**Key Takeaways:**
1. ✅ Use multi-selector fallback pattern for all locators
2. ✅ Prefer semantic selectors > data-testid > structural selectors
3. ✅ Add TODO comments when requesting frontend changes
4. ✅ Validate state changes, not just visibility
5. ✅ Follow the Page Object Model pattern consistently
6. ✅ Avoid parent traversal (`..`) and fragile structural selectors
7. ✅ Provide helpful error messages when elements can't be found

**When in doubt, look at existing code:**
- Reference `/pom/components/chat.component.ts` for component patterns
- Reference `/pom/pages/health-monitor.page.ts` for page patterns
- Reference `/tests/chat-test.spec.ts` for test structure

---

*This guide is maintained by the E2E test team. Update it as new patterns emerge.*
