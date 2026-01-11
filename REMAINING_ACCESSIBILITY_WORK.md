# Remaining Accessibility Work for E2E Tests

## Status: Partial Deployment ✅ 50% Complete

**Last Updated:** January 9, 2026  
**Test Environment:** `https://publicai-git-feature-graphql-integration-public-ai.vercel.app/`

---

## ✅ Completed (Deployed to Test Environment)

### 1. Main Content Area
- **Status:** ✅ DEPLOYED
- **Change:** Using semantic `<main>` element instead of `<div id="main-content">`
- **E2E Selector:** `page.getByRole('main')`
- **Impact:** Improved semantic HTML and accessibility

### 2. Markets Tabs
- **Status:** ✅ DEPLOYED
- **Change:** Tabs now have proper `role="tab"` attribute
- **E2E Selectors:**
  - `page.getByRole('tab', { name: 'US' })`
  - `page.getByRole('tab', { name: 'GLOBAL' })`
  - `page.getByRole('tab', { name: 'MACRO' })`
- **Impact:** Better accessibility for screen readers

---

## ❌ Not Yet Deployed (Needs Frontend Work)

### 3. Carousel Navigation Buttons (HIGH PRIORITY)
- **Status:** ❌ NOT DEPLOYED
- **Current:** Buttons without accessible names
- **Required:** Add `aria-label` attributes

**Frontend Changes Needed:**
```html
<!-- Current -->
<button>←</button>
<button>→</button>

<!-- Required -->
<button aria-label="Previous">←</button>
<button aria-label="Next">→</button>
```

**E2E Selectors (when deployed):**
```typescript
page.getByRole('button', { name: 'Previous' })
page.getByRole('button', { name: 'Next' })
```

**Current Fallback in E2E Tests:**
```typescript
page.getByRole('button', { name: 'Previous' }).or(page.locator('.embla__controls button')).first()
page.getByRole('button', { name: 'Next' }).or(page.locator('.embla__controls button')).last()
```

---

### 4. Analysis Cards (HIGH PRIORITY)
- **Status:** ❌ NOT DEPLOYED
- **Current:** Using `<div class="one-question-outer">`
- **Required:** Use semantic `<article>` or `<section>` with `aria-label`

**Frontend Changes Needed:**
```html
<!-- Current -->
<div class="one-question-outer">
  <h3>Investor Lens</h3>
  ...
</div>

<!-- Required -->
<article aria-label="Investor Lens">
  <h3>Investor Lens</h3>
  ...
</article>
```

**Cards to Update:**
- Investor Lens
- Peer Analysis
- Sector Analysis
- Stock Technicals
- MACRO

**E2E Selectors (when deployed):**
```typescript
page.getByRole('article', { name: 'Investor Lens' })
page.getByRole('article', { name: 'Peer Analysis' })
page.getByRole('article', { name: 'Sector Analysis' })
page.getByRole('article', { name: 'Stock Technicals' })
page.getByRole('article', { name: 'MACRO' })
```

**Current Fallback in E2E Tests:**
```typescript
page.getByRole('article', { name: 'Investor Lens' }).or(page.locator('.one-question-outer:has-text("Investor Lens")')).first()
// ... similar for other cards
```

---

## 📋 JIRA Ticket Template

### Title
**BUILD-XXXX: Add Remaining Accessibility Attributes for E2E Testing**

### Description
Complete the accessibility improvements for the Snapshot page by adding semantic HTML and ARIA attributes to carousel buttons and analysis cards.

**Background:**
- Initial accessibility work (BUILD-1362) deployed semantic `<main>` element and `role="tab"` for Markets tabs ✅
- Remaining work: Carousel buttons and analysis cards need accessibility attributes

**Scope:**
1. Add `aria-label="Previous"` and `aria-label="Next"` to carousel navigation buttons
2. Convert analysis cards from `<div class="one-question-outer">` to `<article aria-label="Card Name">`

### Acceptance Criteria
- [ ] Carousel left button has `aria-label="Previous"`
- [ ] Carousel right button has `aria-label="Next"`
- [ ] All 5 analysis cards wrapped in `<article>` tags with appropriate `aria-label`:
  - [ ] Investor Lens
  - [ ] Peer Analysis
  - [ ] Sector Analysis
  - [ ] Stock Technicals
  - [ ] MACRO
- [ ] E2E tests pass using semantic selectors (no fallbacks needed)
- [ ] Accessibility audit shows improved scores

### Technical Details

**Files to Modify:**
- Analysis carousel component (wherever carousel buttons are defined)
- Analysis card component (wherever `.one-question-outer` divs are created)

**Code Examples:**

Carousel buttons:
```html
<button aria-label="Previous" class="embla__button embla__button--prev">
  ←
</button>
<button aria-label="Next" class="embla__button embla__button--next">
  →
</button>
```

Analysis cards:
```html
<article aria-label="Investor Lens" class="one-question-outer">
  <h3>Investor Lens</h3>
  <!-- card content -->
</article>
```

### Testing
- Run E2E test: `npx playwright test tests/check-accessibility.spec.ts`
- Expected result: All 4 accessibility checks should show ✅ DEPLOYED
- Verify with screen reader (VoiceOver/NVDA)

### Related Work
- BUILD-1362: Initial accessibility improvements (completed)
- E2E test repo: Updated selectors with fallbacks in place

### Priority
**High** - Blocks full E2E test suite optimization and accessibility compliance

---

## 📊 Verification Command

Run this test to check deployment status:
```bash
npx playwright test tests/check-accessibility.spec.ts --project=chromium
```

**Expected Output (when complete):**
```
1. Main Content Area: ✅ NEW (semantic <main>)
2. Carousel Navigation Buttons: ✅ NEW (has aria-labels)
3. Analysis Cards: ✅ NEW (semantic <article>)
4. Markets Tabs: ✅ NEW (has role="tab")

=== Summary ===
✅ ALL accessibility changes are deployed!
```

---

## 📚 References
- [FRONTEND_REQUIREMENTS.md](./FRONTEND_REQUIREMENTS.md) - Complete accessibility requirements
- [SELECTOR_AUDIT.md](./SELECTOR_AUDIT.md) - Technical audit of all selectors
- [CODE_STYLE_GUIDE.md](./CODE_STYLE_GUIDE.md) - E2E testing patterns
- [Playwright Locators Best Practices](https://playwright.dev/docs/locators)
- [ARIA Roles Reference](https://developer.mozilla.org/en-US/docs/Web/Accessibility/ARIA/Roles)
