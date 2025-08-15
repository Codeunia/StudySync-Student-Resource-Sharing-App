// backend/middleware/auth.js
export function ensureAuth(req, res, next) {
  // Check for session-based auth first
  if (req.isAuthenticated()) {
    return next();
  }
  
  // Check for token-based auth
  const authHeader = req.headers.authorization;
  if (authHeader && authHeader.startsWith('Bearer ')) {
    try {
      const token = authHeader.substring(7);
      const userData = JSON.parse(Buffer.from(token, 'base64').toString());
      
      // Simple validation (in production, use proper JWT verification)
      if (userData.id && userData.email && userData.timestamp) {
        // Token is less than 24 hours old
        if (Date.now() - userData.timestamp < 24 * 60 * 60 * 1000) {
          // Set req.user to match the expected format
          req.user = {
            id: userData.id,
            email: userData.email,
            _id: userData.id // Some routes might use _id
          };
          return next();
        }
      }
    } catch (error) {
      console.log('Token validation failed:', error.message);
    }
  }
  
  // If user is not logged in, send an unauthorized error
  res.status(401).json({ message: 'Please log in to view this resource' });
}