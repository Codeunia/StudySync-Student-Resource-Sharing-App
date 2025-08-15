// backend/middleware/auth.js
export function ensureAuth(req, res, next) {
  if (req.isAuthenticated()) {
    return next(); // If user is logged in, continue to the requested route
  }
  // If user is not logged in, send an unauthorized error
  res.status(401).json({ message: 'Please log in to view this resource' });
}