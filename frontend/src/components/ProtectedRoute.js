/**
 * Change History - ankush
 * Date: 2025-09-11 (IST)
 * Why: Convert to standard React JSX since project is React (not Oracle JET).
 * Notes:
 *  - Redirect unauthenticated users to /login
 */
/**
 * Wrapper to avoid JSX in .js (for Oracle JET audit)
 * The actual ProtectedRoute component is implemented in ProtectedRoute.jsx
 */
export { default } from './ProtectedRoute.jsx';
