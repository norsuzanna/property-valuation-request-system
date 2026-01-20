# Valuation Request System - Frontend Track

## Candidate
Nor Suzanna Binti Razali

## Time Spent
3 hours

## Tech Stack
- **React** - UI library
- **TypeScript** - Type safety
- **Vite** - Build tool and dev server
- **Vitest** - Testing framework
- **React Testing Library** - Component testing
- **@testing-library/user-event** - User interaction simulation

## How to Run

### Prerequisites
- Node.js 18+ and npm (or yarn/pnpm)
- Git

### Installation

```bash
# Clone the repository
git clone git@github.com:norsuzanna/property-valuation-request-system.git
cd valuation-request-system

# Install dependencies
npm install
```

### Running the Application

```bash
# Start development server
npm run dev

# Application will be available at http://localhost:5173
```

### Running Tests

```bash
# Run all tests
npm test

# Run tests in watch mode
npm run test:watch

# Run tests with coverage
npm run test:coverage
```

### Building for Production

```bash
# Create production build
npm run build

# Preview production build
npm run preview
```

## Project Structure

```
src/
├── components/
│   ├── __tests__/
│   │   └── RequestForm.test.tsx      # Form component tests
│   ├── RequestForm.tsx                # Create/edit request modal
│   └── FilterBar.tsx                  # Filter controls component
├── services/
│   ├── __tests__/
│   │   └── api.test.ts               # API service tests
│   └── api.ts                        # Mock API service layer
├── types/
│   └── request.types.ts              # TypeScript interfaces
├── hooks/
│   └── useDebounce.ts                # Custom debounce hook
├── utils/
│   └── validation.ts                 # Form validation logic
├── App.tsx                           # Main application component
└── main.tsx                          # Application entry point
```

## Features Implemented

### ✅ Core Requirements

1. **Request List Page** (`/`)
   - Table display with all required fields
   - 4 filter options (exceeds 2+ requirement):
     - Property Type dropdown
     - Status dropdown
     - State dropdown
     - Address search with 300ms debouncing
   - Loading and error states
   - Success feedback notifications
   - Create new request button
   - Protected route (requires authentication)

2. **Create Request Form** (Modal)
   - All required fields with proper types
   - Client-side validation:
     - Required field validation
     - Address max 500 characters
     - Purpose max 200 characters
     - Estimated value must be > 0
     - State must be selected
   - Real-time validation feedback
   - Loading state during submission
   - Error handling from API
   - Form reset after successful submission

3. **Simple Authentication** ✨
   - Login form with email/password
   - Token stored in localStorage
   - Protected route logic (redirects to login if not authenticated)
   - Logout functionality
   - User display in header
   - Session persistence (stays logged in on refresh)
   - Demo mode (accepts any email/password)

3. **TypeScript Implementation**
   - Comprehensive interfaces for all data types
   - Fully typed component props
   - Type-safe API responses
   - No `any` types used (except event handlers)
   - Strict type checking enabled

4. **API Integration**
   - Service layer architecture (`api.ts`)
   - Mock API with realistic delays
   - Error handling and retry logic
   - Proper async/await patterns

5. **State Management**
   - React hooks (useState, useEffect, useCallback)
   - Custom useDebounce hook for search
   - Proper loading states (isLoading, isSubmitting)
   - Error state management with user messages
   - Success notification system

6. **Testing**
   - RequestForm component tests (validation logic)
   - API service unit tests (mock implementations)
   - User interaction testing
   - Test coverage for critical paths

### ✨ Bonus Features Implemented

- **Complete Authentication System** - Login, logout, session persistence
- **Protected Routes** - Automatic redirect to login when not authenticated
- **Debounced search** - 300ms delay prevents excessive filtering
- **Custom reusable components** - FilterBar, RequestForm, LoginForm
- **Loading feedback** - Granular loading states for all async operations
- **Success notifications** - Auto-dismiss after 3 seconds
- **Currency formatting** - Malaysian Ringgit (RM) display
- **Date formatting** - Localized date display
- **Status color coding** - Visual status indicators
- **Responsive considerations** - Mobile-friendly table overflow
- **User context display** - Welcome message with user name

## Architecture Decisions

### 1. Component Structure
I chose a **component-based architecture** with clear separation of concerns. The `RequestForm`, `FilterBar`, and `LoginForm` are isolated, reusable components that can be easily tested and maintained independently. This follows React best practices and makes the codebase scalable.

### 2. Mock API Layer
Rather than hardcoding data in components, I created a **service layer** (`api.ts`) that simulates a real backend with:
- Realistic async delays
- Proper error handling
- Type-safe responses
- Authentication flow
- Token management
- Easy migration to real API (just swap the implementation)

This approach makes testing easier and provides a clear contract between frontend and backend.

### 3. Authentication Implementation
I implemented **localStorage-based authentication** because:
- Simple and effective for SPA applications
- Persists across browser refreshes
- Easy to integrate with JWT tokens
- Demonstrates understanding of protected routes
- In production, would add: token expiration, refresh tokens, secure httpOnly cookies

The authentication flow protects all routes and automatically redirects unauthenticated users to login.

### 3. Custom Debounce Hook
I implemented a **reusable `useDebounce` hook** instead of using a library. This:
- Demonstrates understanding of React hooks
- Keeps bundle size small
- Provides exactly what's needed (no over-engineering)
- Shows ability to solve common problems from first principles

### 4. Validation Strategy
I separated validation logic into a pure function rather than coupling it to the form component. This makes it:
- Easily testable
- Reusable across multiple forms
- Simple to extend with new rules
- Clear single responsibility

## What I'd Improve Given More Time

### Short Term (4-8 hours)
1. **Edit functionality** - Currently only supports create, would add edit modal
2. **Pagination** - For large datasets, implement proper pagination
3. **Sorting** - Add column sorting (created date, value, etc.)
4. **Advanced filters** - Date range picker, value range slider
5. **Form persistence** - Save draft forms to localStorage
6. **Accessibility** - ARIA labels, keyboard navigation, focus management
7. **Error boundaries** - React error boundaries for graceful failure handling
8. **Token refresh** - Implement refresh token mechanism
9. **Remember me** - Optional persistent login

### Medium Term (1-2 days)
1. **Enhanced authentication** - Password reset, email verification, 2FA
2. **Request details page** - Dedicated page for viewing full request details
3. **File uploads** - Support for property documents/images
4. **Export functionality** - CSV/PDF export of filtered requests
5. **Audit trail** - Show request history and status changes
6. **Notifications** - Real-time updates using WebSockets
7. **Optimistic updates** - Instant UI feedback before API confirmation
8. **Role-based access** - Different permissions for different user types

### Long Term (1 week+)
1. **State management library** - Zustand or Redux for complex state
2. **React Query** - For better server state management and caching
3. **Form library** - React Hook Form for complex form scenarios
4. **Design system** - Component library (Radix UI or shadcn/ui)
5. **E2E testing** - Playwright or Cypress for integration tests
6. **Performance optimization** - Virtual scrolling, code splitting
7. **Analytics** - Track user behavior and performance metrics

## Assumptions Made

1. **Authentication**: Implemented simple token-based auth with localStorage. In production, would use:
   - HttpOnly cookies for XSS protection
   - Refresh token mechanism
   - Token expiration handling
   - OAuth2/OIDC for enterprise scenarios

2. **Demo Mode**: Accepted any email/password for demo purposes. Real implementation would validate against backend API.

3. **Data Validation**: Client-side validation mirrors backend rules. Assumed backend will also validate (never trust the client).

3. **State Reference Data**: Assumed Malaysian states are relatively static and can be loaded once on mount. Would add cache invalidation for production.

4. **Currency**: Assumed all values are in Malaysian Ringgit (RM). Would add multi-currency support if needed.

5. **Permissions**: Assumed all authenticated users can create requests. Would add role-based access control (RBAC) for production.

6. **Mock Data**: Used realistic Malaysian addresses and names. In production, would use actual API endpoints.

7. **Error Handling**: Assumed generic error messages are acceptable. Would implement proper error codes and i18n for production.

8. **Browser Support**: Targeted modern browsers (last 2 versions). Would add polyfills for broader support if required.

## Testing Strategy

### Unit Tests
- **Validation logic** - Pure functions are easy to test
- **API service** - Mock fetch calls, test error scenarios
- **Authentication flow** - Login, logout, token storage, session persistence
- **Custom hooks** - Test debounce timing and cleanup

### Component Tests
- **Form validation** - User input scenarios, error messages
- **Filter interactions** - Dropdown changes, search input
- **Loading states** - Async operations, loading indicators
- **Error states** - API failures, user feedback
- **Authentication UI** - Login form, error handling, logout

### Integration Tests (If More Time)
- **Full user flows** - Create request end-to-end
- **Filter combinations** - Multiple filters applied together
- **Error recovery** - Retry after failures

## Key Learnings & Highlights

1. **Type Safety Pays Off** - TypeScript caught several bugs during development that would have been runtime errors
2. **Authentication is Critical** - Even simple auth adds significant UX value and demonstrates security awareness
3. **Debouncing is Essential** - Without it, search would trigger on every keystroke causing performance issues
4. **Separation of Concerns** - Keeping validation, API, and UI logic separate made testing and debugging much easier
5. **Loading States Matter** - Users need feedback for every async operation, even fast ones
6. **Mock Data Quality** - Realistic mock data helps catch edge cases early
7. **localStorage Limitations** - Simple but not secure; production needs httpOnly cookies

## Performance Considerations

- **Debounced search** prevents unnecessary re-renders
- **useCallback** for filter handlers prevents child re-renders
- **Conditional rendering** for modals (not mounted when hidden)
- **Optimized filtering** using native array methods
- **No unnecessary state** - Derived values computed in render

## Accessibility Notes

While not a primary focus for this assignment, I included basic accessibility features:
- Semantic HTML elements
- Form labels properly associated
- Error messages clearly displayed
- Keyboard-accessible modal (ESC to close would be added)
- Color contrast for status badges

For production, would add:
- ARIA labels and roles
- Focus management and trapping
- Screen reader announcements
- Keyboard navigation
- High contrast mode support

---

**Note**: This is a technical assessment project demonstrating frontend development capabilities. The mock API simulates backend responses and would be replaced with actual API endpoints in production.