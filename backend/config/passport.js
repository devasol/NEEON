const passport = require("passport");
const GoogleStrategy = require("passport-google-oauth20").Strategy;
const User = require("./../models/userModel");

// Configure Google OAuth strategy
passport.use(
  new GoogleStrategy(
    {
      clientID: process.env.GOOGLE_CLIENT_ID,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET,
      callbackURL: "/auth/google/callback", // Use relative URL to match how app handles it
      passReqToCallback: true // Pass the request to the callback
    },
    async (req, accessToken, refreshToken, profile, done) => {
      try {
        console.log('Google OAuth profile received:', profile.id); // Debug log
        
        // Ensure the profile has email information
        const email = profile.emails && profile.emails[0] ? profile.emails[0].value : null;
        
        if (!email) {
          console.error('No email provided by Google OAuth');
          return done(new Error('Email is required for registration'), null);
        }
        
        console.log('Email from Google OAuth:', email); // Debug log
        
        // Check if user already exists in the database
        let user = await User.findOne({ 
          $or: [
            { email: email },
            { googleId: profile.id }
          ]
        });

        if (user) {
          console.log('User already exists, updating googleId if missing'); // Debug log
          // User already exists, check if googleId is missing and add it if needed
          if (!user.googleId) {
            user.googleId = profile.id;
            await user.save();
          }
          return done(null, user);
        } else {
          console.log('Creating new user for Google OAuth'); // Debug log
          // Create a new user
          const username = email.split("@")[0]; // Use email prefix as username
          const randomPassword = Math.random().toString(36).slice(-12); // Generate longer random password
          
          const newUser = await User.create({
            fullName: profile.displayName || (profile.name && (profile.name.givenName + ' ' + profile.name.familyName)) || 'Google User',
            email: email,
            username: username,
            password: randomPassword, // Generate random password
            passwordConfirm: randomPassword, // Generate random password confirm
            role: "user", // Default role for Google signups
            googleId: profile.id, // Store Google ID for future reference
          });

          return done(null, newUser);
        }
      } catch (err) {
        console.error('Error in Google OAuth strategy:', err);
        return done(err, null);
      }
    }
  )
);

// Serialize user into the sessions
passport.serializeUser((user, done) => {
  done(null, user._id);
});

// Deserialize user from the sessions
passport.deserializeUser(async (id, done) => {
  try {
    const user = await User.findById(id);
    done(null, user);
  } catch (err) {
    done(err, null);
  }
});

module.exports = passport;