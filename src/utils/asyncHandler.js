// Forwards async errors to Express error middleware (Express 4)
export default (fn) => (req, res, next) =>
  Promise.resolve(fn(req, res, next)).catch(next);

// function that sends any errors that occur in async route handlers to the Express error handling middleware.