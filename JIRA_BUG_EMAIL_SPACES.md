# JIRA Bug Report: Login Form Does Not Trim Email Spaces

## Bug Summary
Login form fails to authenticate users when email address contains leading or trailing spaces, causing login failures for valid credentials.

## Priority
**Medium-High** - Affects user experience and causes support issues

## Issue Type
Bug

## Description
The login form does not trim leading or trailing spaces from the email input field. This causes authentication failures when users copy-paste their email address with accidental spaces, which is a common user error.

### Current Behavior
- User enters email with leading space: " test@example.com"
- User enters email with trailing space: "test@example.com "
- Login fails even with correct password
- No error message indicates the space is the issue
- User is confused and may contact support

### Expected Behavior
- Email input should automatically trim leading and trailing spaces
- User should be able to login successfully with valid credentials
- Consistent with forgot password form behavior (which already trims spaces)

## Steps to Reproduce
1. Navigate to login page
2. Copy an email address from another source (often includes trailing space)
3. Paste into email field: "test@example.com " (note trailing space)
4. Enter correct password
5. Click "LOG IN"
6. **Result:** Login fails

## Impact
- **User Frustration:** Users cannot login with valid credentials
- **Support Burden:** Users contact support thinking their account is broken
- **Inconsistent UX:** Forgot password form trims spaces, but login doesn't
- **Common Issue:** Copy-paste from email clients often includes spaces

## Evidence
E2E tests confirm the issue:
- `tests/login-negative-cases.spec.ts` - Lines 157-189, 191-223
- All space-related tests show login failures
- Forgot password form (for comparison) successfully trims spaces

## Affected Components
- Login form (`/login` page)
- Email input field
- Form submission handler

## Recommended Fix
Add `.trim()` to email input value before authentication:

```typescript
// Current (problematic)
const email = formData.get('email') as string;

// Recommended
const email = (formData.get('email') as string).trim();
```

Or add client-side trimming on the input field:
```typescript
<input
  type="email"
  name="email"
  onBlur={(e) => e.target.value = e.target.value.trim()}
/>
```

## Related Work
- Forgot password form already implements space trimming correctly
- Should apply same pattern to login form for consistency

## Testing
After fix, verify:
1. Login with " test@example.com " (spaces) succeeds
2. Login with "test@example.com" (no spaces) still succeeds
3. No regression in normal login flow

## Browser Compatibility
Issue affects all browsers (Chrome, Firefox, Safari, Edge)

## Acceptance Criteria
- [ ] Email input trims leading spaces
- [ ] Email input trims trailing spaces
- [ ] Login succeeds with valid credentials regardless of spaces
- [ ] Consistent behavior with forgot password form
- [ ] E2E tests pass after fix

---

## Additional Context
This is a common UX issue that affects real users. Many email clients and password managers add trailing spaces when copying email addresses. The forgot password form already handles this correctly by trimming spaces, so this fix would bring consistency to the user experience.

**Severity:** Medium-High (affects user authentication)
**Frequency:** Common (copy-paste is frequent user behavior)
**Workaround:** User must manually remove spaces (not obvious to users)
