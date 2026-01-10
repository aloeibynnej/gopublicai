# Frontend Requirements for E2E Test Selectors

## 🎯 **Priority: Role-Based Selectors First**

**Role-based selectors are the FIRST CHOICE** for E2E tests. The frontend must implement proper semantic HTML and ARIA attributes to support `getByRole()` selectors.

---

## 📋 **Required Frontend Changes**

### **HIGH PRIORITY - Blocking E2E Tests**

#### 1. Main Content Area
**Current:** `<div id="main-content">`
**Required:** Use semantic `<main>` element
```html
<!-- Change from: -->
<div id="main-content">

<!-- To: -->
<main>
```
**E2E Selector:** `page.getByRole('main')`

---

#### 2. Carousel Navigation Buttons
**Current:** Buttons without accessible names
**Required:** Add `aria-label` attributes
```html
<button aria-label="Previous">←</button>
<button aria-label="Next">→</button>
```
**E2E Selectors:**
- `page.getByRole('button', { name: 'Previous' })`
- `page.getByRole('button', { name: 'Next' })`

---

#### 3. Analysis Cards
**Current:** `<div class="one-question-outer">`
**Required:** Use semantic `<article>` or `<section>` with `aria-label`
```html
<!-- Change from: -->
<div class="one-question-outer">
  <h3>Investor Lens</h3>
  ...
</div>

<!-- To: -->
<article aria-label="Investor Lens">
  <h3>Investor Lens</h3>
  ...
</article>
```
**E2E Selectors:**
- `page.getByRole('article', { name: 'Investor Lens' })`
- `page.getByRole('article', { name: 'Peer Analysis' })`
- `page.getByRole('article', { name: 'Sector Analysis' })`
- `page.getByRole('article', { name: 'Stock Technicals' })`
- `page.getByRole('article', { name: 'MACRO' })`

---

#### 4. Markets Tabs
**Current:** May not have proper `role="tab"`
**Required:** Ensure proper tab role and accessible names
```html
<div role="tablist">
  <button role="tab" aria-label="US Markets">US</button>
  <button role="tab" aria-label="Global Markets">GLOBAL</button>
  <button role="tab" aria-label="Macro Markets">MACRO</button>
</div>
```
**E2E Selectors:**
- `page.getByRole('tab', { name: 'US' })`
- `page.getByRole('tab', { name: 'GLOBAL' })`
- `page.getByRole('tab', { name: 'MACRO' })`

---

### **MEDIUM PRIORITY - Improve Test Reliability**

#### 5. Chat Trigger Button
**Current:** No consistent selector (varies by implementation)
**Required:** Add `data-testid` or proper `aria-label` for deterministic selection
```html
<!-- Option 1: data-testid (RECOMMENDED) -->
<button data-testid="chat-trigger-button" aria-label="Open chat">
  Charlie
</button>

<!-- Option 2: Consistent aria-label -->
<button aria-label="Open Charlie chat assistant">
  Charlie
</button>
```
**E2E Selector:** 
- `page.getByTestId('chat-trigger-button')` (preferred)
- `page.getByRole('button', { name: 'Open chat' })`

**Why this matters:** Currently tests must try multiple fallback selectors, making behavior non-deterministic. A single reliable selector improves test stability and maintainability.

---

#### 6. Section Headings
**Current:** May be `<div>` or `<span>` with text
**Required:** Use proper heading elements (`<h1>` - `<h6>`)
```html
<!-- Change from: -->
<div class="section-title">MARKETS</div>

<!-- To: -->
<h2>MARKETS</h2>
```
**E2E Selectors:**
- `page.getByRole('heading', { name: 'MARKETS' })`
- `page.getByRole('heading', { name: /VS PEERS/i })`
- `page.getByRole('heading', { name: 'YOUR PEERS' })`
- `page.getByRole('heading', { name: 'MARKET CONTEXT' })`

---

#### 7. Stock Ticker
**Current:** Plain text element
**Required:** Add `aria-label` or wrap in semantic element
```html
<!-- Option 1: aria-label -->
<span aria-label="Stock ticker">AAPL</span>

<!-- Option 2: data-testid (if semantic not feasible) -->
<span data-testid="stock-ticker">AAPL</span>
```
**E2E Selector:** `page.getByLabel('Stock ticker')`

---

#### 8. Greeting Message
**Current:** Plain text paragraph
**Required:** Add `aria-label` for identification
```html
<p aria-label="Greeting message">Good morning, Derick. Your...</p>
```
**E2E Selector:** `page.getByLabel('Greeting message')`

---

### **LOW PRIORITY - Nice to Have**

#### 9. Time Period Buttons (TradingView iframe)
**Note:** These are in TradingView iframe - limited control
**If possible:** Ensure buttons have accessible names
```html
<button aria-label="1 Day">1D</button>
<button aria-label="1 Month">1M</button>
```

---

## 🚫 **What NOT to Do**

### ❌ Avoid Class-Based Selectors
```typescript
// BAD - fragile, breaks when CSS changes
page.locator('.one-question-outer')
page.locator('.embla__controls button')
```

### ❌ Avoid ID Selectors (unless semantic alternative impossible)
```typescript
// BAD - not semantic
page.locator('#main-content')
```

### ❌ Avoid Complex CSS Selectors
```typescript
// BAD - hard to maintain
page.locator('button[aria-label*="previous" i], button[data-testid*="carousel-prev"]')
```

---

## ✅ **What TO Do**

### ✅ Use Role-Based Selectors (FIRST CHOICE)
```typescript
// GOOD - semantic, resilient
page.getByRole('button', { name: 'Submit' })
page.getByRole('heading', { name: 'Dashboard' })
page.getByRole('tab', { name: 'Overview' })
page.getByRole('main')
```

### ✅ Use Label-Based Selectors
```typescript
// GOOD - accessible
page.getByLabel('Email address')
page.getByLabel('Stock ticker')
```

### ✅ Use Text Selectors (for content)
```typescript
// GOOD - for static text
page.getByText('Welcome back')
```

### ✅ Use data-testid (LAST RESORT - only when semantic HTML not feasible)
```typescript
// ACCEPTABLE - when role-based not possible
page.getByTestId('user-profile-card')
```

---

## 📝 **Implementation Checklist**

- [ ] Replace `<div id="main-content">` with `<main>`
- [ ] Add `aria-label="Previous"` and `aria-label="Next"` to carousel buttons
- [ ] Wrap analysis cards in `<article>` with `aria-label`
- [ ] Ensure Markets tabs have `role="tab"`
- [ ] Add `data-testid="chat-trigger-button"` to chat trigger button for deterministic selection
- [ ] Convert section titles to proper heading elements (`<h1>` - `<h6>`)
- [ ] Add `aria-label="Stock ticker"` to ticker element
- [ ] Add `aria-label="Greeting message"` to greeting paragraph
- [ ] Review all interactive elements for proper ARIA roles

---

## 🔍 **Testing After Implementation**

Once frontend implements these changes, E2E tests should:
1. Remove `.or()` fallbacks from selectors
2. Use pure role-based selectors
3. Be more resilient to CSS/class changes
4. Improve accessibility for screen readers

---

## 📚 **Resources**

- [Playwright Locators Best Practices](https://playwright.dev/docs/locators)
- [ARIA Roles Reference](https://developer.mozilla.org/en-US/docs/Web/Accessibility/ARIA/Roles)
- [Semantic HTML Guide](https://developer.mozilla.org/en-US/docs/Glossary/Semantics)
