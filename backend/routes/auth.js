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
    failureRedirect: 'http://localhost:3000/login-failed', // Or your frontend's login page
  }),
  (req, res) => {
    // On successful authentication, redirect to the frontend dashboard.
    res.redirect('http://localhost:3000/dashboard'); // IMPORTANT: Make sure this is a route in your React app
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
    res.redirect('http://localhost:3000/'); // Redirect to the frontend homepage
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