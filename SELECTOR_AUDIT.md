# E2E Selector Audit - Role-Based Pattern Required

**Last Updated:** January 9, 2026  
**Status:** 🟡 Partial Deployment (50% Complete)

## Overview
All page objects must use role-based selectors (getByRole, getByLabel, getByText) as the primary approach. Class-based and CSS selectors should only be used as a last resort when semantic HTML is not available.

## ✅ Deployed Changes (January 2026)

### Main Content Area - COMPLETED ✅
**Status:** Deployed to test environment  
**Change:** Now using semantic `<main>` element  
**E2E Selector:** `page.getByRole('main').or(page.locator('#main-content'))`

### Markets Tabs - COMPLETED ✅
**Status:** Deployed to test environment  
**Change:** Tabs now have proper `role="tab"` attribute  
**E2E Selectors:**
```typescript
page.getByRole('tab', { name: 'US' })
page.getByRole('tab', { name: 'GLOBAL' })
page.getByRole('tab', { name: 'MACRO' })
```

---

## ❌ Remaining Work - Priority: Add Remaining Accessibility Attributes

### snapshot.page.ts - PARTIAL UPDATES

#### Analysis Cards (Lines 51-59)
**Status:** ❌ NOT YET DEPLOYED  
**Current:** Using `.one-question-outer` class with `:has-text()` fallback
```typescript
this.investorLensCard = page.locator('.one-question-outer:has-text("Investor Lens")').first();
this.peerAnalysisCard = page.locator('.one-question-outer:has-text("Peer Analysis")').first();
this.sectorAnalysisCard = page.locator('.one-question-outer:has-text("Sector Analysis")').first();
this.stockTechnicalsCard = page.locator('.one-question-outer:has-text("Stock Technicals")').first();
this.macroCard = page.locator('.one-question-outer').filter({ hasText: 'MACRO' }).first();
```

**Recommended:**
- **Option 1 (Best):** Frontend adds proper semantic HTML
  ```typescript
  this.investorLensCard = page.getByRole('article', { name: 'Investor Lens' });
  this.peerAnalysisCard = page.getByRole('article', { name: 'Peer Analysis' });
  ```
  **Frontend TODO:** Wrap cards in `<article>` or `<section>` with `aria-label`

- **Option 2 (Fallback):** Frontend adds data-testid
  ```typescript
  this.investorLensCard = page.getByTestId('analysis-card-investor-lens');
  this.peerAnalysisCard = page.getByTestId('analysis-card-peer-analysis');
  ```
  **Frontend TODO:** Add `data-testid="analysis-card-investor-lens"` etc.

#### Carousel Navigation (Lines 66-70)
**Status:** ❌ NOT YET DEPLOYED  
**Current:** Using `.embla__controls button` fallback
```typescript
this.leftArrowButton = page.locator('button[aria-label*="previous" i], button[aria-label*="prev" i], button[data-testid*="carousel-prev"], button[data-testid*="prev-button"], .embla__controls button').first();
this.rightArrowButton = page.locator('button[aria-label*="next" i], button[data-testid*="carousel-next"], button[data-testid*="next-button"], .embla__controls button').last();
```

**Recommended:**
```typescript
this.leftArrowButton = page.getByRole('button', { name: 'Previous' });
this.rightArrowButton = page.getByRole('button', { name: 'Next' });
```
**Frontend TODO:** Add `aria-label="Previous"` and `aria-label="Next"` to carousel buttons

#### Markets Tabs (Lines 82-85)
**Status:** ✅ DEPLOYED  
**Current:** Using definitive `role="tab"` selectors
```typescript
this.usTab = page.getByRole('tab', { name: 'US' });
this.globalTab = page.getByRole('tab', { name: 'GLOBAL' });
this.macroTab = page.getByRole('tab', { name: 'MACRO' });
```

#### Headings (Lines 70, 76, 83, 92)
**Current:** Using text locators with regex
```typescript
this.marketsHeading = page.locator('text=/^MARKETS$/i').first();
this.peerComparisonHeading = page.locator('text=/[A-Z]{1,5}\\s+VS\\s+PEERS/i').first();
this.yourPeersHeading = page.locator('text=/^YOUR PEERS$/i').first();
this.marketContextHeading = page.locator('text=/^MARKET CONTEXT$/i').first();
```

**Recommended:**
```typescript
this.marketsHeading = page.getByRole('heading', { name: 'MARKETS' });
this.peerComparisonHeading = page.getByRole('heading', { name: /VS PEERS/i });
this.yourPeersHeading = page.getByRole('heading', { name: 'YOUR PEERS' });
this.marketContextHeading = page.getByRole('heading', { name: 'MARKET CONTEXT' });
```
**Frontend TODO:** Ensure these are proper heading elements (`<h1>`, `<h2>`, etc.)

#### Stock Ticker (Line 132)
**Current:** Regex text locator
```typescript
this.stockTicker = page.locator('text=/^[A-Z]{1,5}$/').first();
```

**Recommended:**
```typescript
this.stockTicker = page.getByLabel('Stock ticker');
// OR
this.stockTicker = page.getByTestId('stock-ticker');
```
**Frontend TODO:** Add `aria-label="Stock ticker"` or `data-testid="stock-ticker"`

#### Time Period Buttons (Lines 104-109)
**Current:** Not visible in grep, need to check
**Recommended:**
```typescript
this.timePeriod1DButton = page.getByRole('button', { name: '1D' });
this.timePeriod1MButton = page.getByRole('button', { name: '1M' });
```
**Frontend TODO:** Ensure buttons have proper accessible names

#### Main Content (Line 49-50)
**Status:** ✅ DEPLOYED  
**Current:** Using definitive semantic `<main>` selector
```typescript
this.mainContent = page.getByRole('main');
```

---

### health-monitor.page.ts - NEEDS REVIEW

Need to audit this file for non-role-based selectors.

---

### chat.page.ts - NEEDS REVIEW

Need to audit this file for non-role-based selectors.

---

## Implementation Priority

### High Priority (Blocking Tests)
1. Carousel navigation buttons - need aria-labels
2. Analysis cards - need semantic HTML or data-testids
3. Markets tabs - ensure proper role="tab"

### Medium Priority (Tests Work But Not Ideal)
1. Headings - convert to semantic heading elements
2. Stock ticker - add aria-label or data-testid
3. Main content - use semantic `<main>` element

### Low Priority (Nice to Have)
1. Time period buttons - ensure accessible names
2. TradingView iframe elements - limited control

---

## Pattern to Follow

### ✅ GOOD - Role-Based Selectors
```typescript
page.getByRole('button', { name: 'Submit' })
page.getByRole('heading', { name: 'Dashboard' })
page.getByRole('tab', { name: 'Overview' })
page.getByLabel('Email address')
page.getByText('Welcome back')
```

### ⚠️ ACCEPTABLE - data-testid (when semantic HTML not available)
```typescript
page.getByTestId('user-profile-card')
page.getByTestId('analysis-carousel')
```

### ❌ AVOID - Class/CSS Selectors
```typescript
page.locator('.one-question-outer')
page.locator('#main-content')
page.locator('button[aria-label*="previous" i]')
```

---

## Next Steps

1. Create frontend tickets for adding semantic HTML and aria-labels
2. Update page objects to use role-based selectors
3. Add data-testid fallbacks where semantic HTML is not feasible
4. Document all changes in this file
