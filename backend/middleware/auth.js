// backend/middleware/auth.js
export function ensureAuth(req, res, next) {
  console.log('Auth check - isAuthenticated:', req.isAuthenticated()); // Debug
  console.log('Auth check - headers:', req.headers.authorization); // Debug
  console.log('Auth check - URL:', req.originalUrl); // Debug
  console.log('Auth check - Method:', req.method); // Debug
  
  // Check for session-based auth first
  if (req.isAuthenticated()) {
    console.log('Session auth successful for user:', req.user.id); // Debug
    return next();
  }
  
  // Check for token-based auth
  const authHeader = req.headers.authorization;
  if (authHeader && authHeader.startsWith('Bearer ')) {
    try {
      const token = authHeader.substring(7);
      console.log('Token received:', token.substring(0, 20) + '...'); // Debug (partial token)
      
      const userData = JSON.parse(Buffer.from(token, 'base64').toString());
      console.log('Decoded user data:', userData); // Debug
      
      // Simple validation - only require id and timestamp
      if (userData.id && userData.timestamp) {
        // Token is less than 24 hours old  
        const tokenAge = Date.now() - userData.timestamp;
        console.log('Token age (hours):', tokenAge / (1000 * 60 * 60)); // Debug
        
        if (tokenAge < 24 * 60 * 60 * 1000) {
          // Set req.user to match the expected format
          req.user = {
            id: userData.id,
            email: userData.email || 'unknown@email.com',
            _id: userData.id // Some routes might use _id
          };
          console.log('Token auth successful for user:', userData.id); // Debug
          return next();
        } else {
          console.log('Token expired - age:', tokenAge / (1000 * 60 * 60), 'hours'); // Debug
          return res.status(401).json({ message: 'Token expired, please log in again' });
        }
      } else {
        console.log('Invalid token data - missing required fields:', { 
          hasId: !!userData.id, 
          hasTimestamp: !!userData.timestamp 
        }); // Debug
        return res.status(401).json({ message: 'Invalid token format' });
      }
    } catch (error) {
      console.log('Token validation failed:', error.message);
      return res.status(401).json({ message: 'Invalid token' });
    }
  }
  
  console.log('Auth failed - no valid authentication found'); // Debug
  // If user is not logged in, send an unauthorized error
  res.status(401).json({ message: 'Please log in to view this resource' });
}