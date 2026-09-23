// Centralized error-handling middleware (must have 4 args for Express to recognise it)
// eslint-disable-next-line no-unused-vars
module.exports = (err, _req, res, _next) => {
  console.error(err);

  if (err.name === 'ValidationError') {
    return res.status(400).json({ error: err.message });
  }

  res.status(500).json({ error: 'internal server error' });
};
