import express from 'express';
import passport from 'passport';

const router = express.Router();

// @desc    Auth with Google
// @route   GET /auth/google
router.get('/google', passport.authenticate('google', { scope: ['profile', 'email'] }));

// @desc    Google auth callback
// @route   GET /auth/google/callback
router.get(
  '/google/callback',
  passport.authenticate('google', {
    failureRedirect: `${process.env.FRONTEND_URL || 'http://localhost:3000'}/login-failed`,
  }),
  (req, res) => {
    const baseUrl = process.env.FRONTEND_URL || 'http://localhost:3000';
    
    // Create a simple token (in production, use proper JWT)
    const userToken = Buffer.from(JSON.stringify({
      id: req.user.id,
      email: req.user.email,
      timestamp: Date.now()
    })).toString('base64');
    
    // Store user in session for server-side use
    req.session.userId = req.user.id;
    
    // For cross-domain authentication, we'll include user data and token in the URL
    const userData = encodeURIComponent(JSON.stringify({
      id: req.user.id,
      displayName: req.user.displayName,
      email: req.user.email,
      image: req.user.image,
      token: userToken
    }));
    
    const redirectUrl = `${baseUrl}/dashboard?user=${userData}`;
    res.redirect(redirectUrl);
  }
);

// @desc    Logout user
// @route   GET /auth/logout
router.get('/logout', (req, res, next) => {
  req.logout((err) => {
    if (err) {
      return next(err);
    }
    // On successful logout, you can redirect or send a success message
    res.redirect(`${process.env.FRONTEND_URL || 'http://localhost:3000'}/`);
  });
});

// @desc    Get current user data
// @route   GET /auth/user
// This route is useful for the frontend to check if a user is logged in
router.get('/user', (req, res) => {
    if (req.isAuthenticated()) {
        res.json(req.user); // Send back the user data if they are authenticated
    } else {
        res.status(401).json({ message: 'Not authorized' }); // Send an error if not
    }
});


export default router;