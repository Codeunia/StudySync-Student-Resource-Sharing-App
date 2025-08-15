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
    // Debug: Check what URL we're redirecting to
    const baseUrl = process.env.FRONTEND_URL || 'http://localhost:3000';
    console.log('User authenticated:', req.user);
    console.log('FRONTEND_URL env var:', process.env.FRONTEND_URL);
    
    // For cross-domain authentication, we'll include user data in the URL
    // This is a temporary solution - in production you'd use JWT tokens
    const userData = encodeURIComponent(JSON.stringify({
      id: req.user.id,
      name: req.user.name,
      email: req.user.email,
      image: req.user.image
    }));
    
    const redirectUrl = `${baseUrl}/dashboard?user=${userData}`;
    console.log('Redirecting to:', redirectUrl);
    
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