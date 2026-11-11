import { HttpInterceptorFn } from '@angular/common/http';

// Adds the login token to every request sent to the backend, so each service doesn't have to.
export const authInterceptor: HttpInterceptorFn = (req, next) => {
  const token = localStorage.getItem('token');
  if (!token) return next(req);
  return next(req.clone({ setHeaders: { Authorization: `Bearer ${token}` } }));
};

// Reads the username from a saved token, or returns '' if there is no valid, unexpired token.
export function getLoggedInUser(): string {
  const token = localStorage.getItem('token');
  if (!token) return '';

  try {
    // A jwt is "header.payload.signature"; the payload is base64url-encoded JSON.
    const base64 = token.split('.')[1]!.replace(/-/g, '+').replace(/_/g, '/');
    const payload = JSON.parse(atob(base64));
    if (typeof payload.exp === 'number' && payload.exp * 1000 < Date.now()) {
      localStorage.removeItem('token'); // expired, so the user needs to log in again
      return '';
    }
    return typeof payload.username === 'string' ? payload.username : '';
  } catch {
    localStorage.removeItem('token'); // malformed token
    return '';
  }
}

// Turns an HTTP error from the backend into a message to show the user.
export function errorMessage(err: { status?: number; error?: { message?: string } }): string {
  if (err.error?.message) return err.error.message;
  if (err.status === 0) return 'Could not reach the server. Is the backend running?';
  return 'Something went wrong. Please try again.';
}
