/**
 * errorHandler — Centralized Express error-handling middleware.
 *
 * SOLID — Single Responsibility Principle:
 *   Translates thrown errors into structured HTTP responses.
 *   No business logic, no data access.
 *
 * Must be the LAST middleware registered in server.js (4-argument signature).
 *
 * Error shape expected from service/repository layers:
 *   err.statusCode — optional explicit HTTP code (400, 404, etc.)
 *   err.errors     — optional array of validation messages
 */
function errorHandler(err, req, res, next) { // eslint-disable-line no-unused-vars
  // Log to server console for debugging
  console.error(`[ERROR] ${req.method} ${req.originalUrl} — ${err.message}`);
  if (process.env.NODE_ENV !== 'production') {
    console.error(err.stack);
  }

  // Determine HTTP status code
  const statusCode = err.statusCode || 500;

  const body = {
    success: false,
    message: err.message || 'An unexpected error occurred.',
  };

  // Include validation error list if available
  if (err.errors && Array.isArray(err.errors)) {
    body.errors = err.errors;
  }

  // In development, expose the stack trace
  if (process.env.NODE_ENV !== 'production' && statusCode === 500) {
    body.stack = err.stack;
  }

  res.status(statusCode).json(body);
}

module.exports = errorHandler;
