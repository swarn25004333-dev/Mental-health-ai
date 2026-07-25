/**
 * formatError.js — Utility to extract human-readable error strings from API responses.
 *
 * Ensures that objects/arrays returned by FastAPI (e.g. 422 validation detail arrays)
 * are safely converted to strings before being rendered in React JSX, preventing React crashes.
 */

export const formatErrorMessage = (err, defaultMsg = 'An error occurred. Please try again.') => {
  if (!err) return defaultMsg;

  if (typeof err === 'string') return err;

  const data = err.response?.data;

  if (data) {
    // 1. FastAPI detail field (string, array of validation objects, or object)
    if (data.detail) {
      if (typeof data.detail === 'string') return data.detail;
      if (Array.isArray(data.detail)) {
        return data.detail
          .map((item) => (typeof item === 'string' ? item : item.msg || item.detail || JSON.stringify(item)))
          .join('; ');
      }
      if (typeof data.detail === 'object') {
        return data.detail.msg || data.detail.error || data.detail.message || JSON.stringify(data.detail);
      }
    }

    // 2. Custom backend error field (string or object)
    if (data.error) {
      if (typeof data.error === 'string') return data.error;
      if (typeof data.error === 'object') {
        return data.error.message || data.error.detail || JSON.stringify(data.error);
      }
    }

    // 3. Fallback to message field
    if (data.message && typeof data.message === 'string') {
      return data.message;
    }
  }

  // 4. Standard JS Error message
  if (err.message && typeof err.message === 'string') {
    return err.message;
  }

  return defaultMsg;
};

export default formatErrorMessage;
