---
trigger: always_on
---

# Rule for Locator Selection in Page Object Model (Playwright)

When generating locators based on the provided HTML, do not use CSS classes as selectors unless absolutely necessary. Instead, prefer stable and meaningful attributes such as `data-testid`, `aria-label`, `placeholder`, visible `text`, `role`, or `name`. IDs may be used only if they appear to be stable and not auto-generated.

If a reliable and readable locator cannot be constructed from the existing HTML, add a comment above the locator code suggesting how the frontend could be improved — for example, by adding a data-testid or an aria-label to the element.

```
// TODO: Consider adding a data-testid or aria-label to improve locator reliability
```

This ensures that all locators are both resilient to code changes and easy for developers to maintain and understand.

# Rule for Page Object Model (Playwright)

Each page object model should implement pom/interfaces/Page.ts

It is important that all Page Object Models are in the pom/pages directory
