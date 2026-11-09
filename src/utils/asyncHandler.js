// Forwards async errors to Express error middleware (Express 4)
export default (fn) => (req, res, next) =>
  Promise.resolve(fn(req, res, next)).catch(next);
