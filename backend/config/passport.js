import { Strategy as GoogleStrategy } from 'passport-google-oauth20';
import mongoose from 'mongoose';
import User from '../models/User.js'; // Make sure the path to your User model is correct

export function configurePassport(passport) {
  passport.use(
    new GoogleStrategy(
      {
        clientID: process.env.GOOGLE_CLIENT_ID,
        clientSecret: process.env.GOOGLE_CLIENT_SECRET,
        callbackURL: '/auth/google/callback', // This must match the redirect URI in your Google Cloud Console
        proxy: true, // Important for services like Heroku or other proxies
      },
      async (accessToken, refreshToken, profile, done) => {
        // 'profile' contains the user's information from Google
        const newUser = {
          googleId: profile.id,
          displayName: profile.displayName,
          firstName: profile.name.givenName,
          image: profile.photos[0].value,
        };

        try {
          // Check if the user already exists in our database
          let user = await User.findOne({ googleId: profile.id });
          if (user) {
            // If user is found, pass them to the next step
            done(null, user);
          } else {
            // If not, create a new user in our database
            user = await User.create(newUser);
            done(null, user);
          }
        } catch (err) {
          console.error('Error in Google Strategy:', err);
          done(err, null);
        }
      }
    )
  );



  // Serializes the user ID to the session
  // This is used to keep the user logged in across requests



  passport.serializeUser((user, done) => {
    done(null, user.id);
  });

  


  // Retrieves the user's details from the database using the ID from the session
  passport.deserializeUser(async (id, done) => {
    try {
        const user = await User.findById(id);
        done(null, user);
    } catch(err) {
        done(err, null);
    }
  });
}


