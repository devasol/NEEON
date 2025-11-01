const passport = require("passport");
const GoogleStrategy = require("passport-google-oauth20").Strategy;
const User = require("./../models/userModel");


passport.use(
  new GoogleStrategy(
    {
      clientID: process.env.GOOGLE_CLIENT_ID,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET,
      callbackURL: "/auth/google/callback", 
      passReqToCallback: true 
    },
    async (req, accessToken, refreshToken, profile, done) => {
      try {
        console.log('Google OAuth profile received:', profile.id); 
        
        
        const email = profile.emails && profile.emails[0] ? profile.emails[0].value : null;
        
        if (!email) {
          console.error('No email provided by Google OAuth');
          return done(new Error('Email is required for registration'), null);
        }
        
        console.log('Email from Google OAuth:', email); 
        
        
        let user = await User.findOne({ 
          $or: [
            { email: email },
            { googleId: profile.id }
          ]
        });

        if (user) {
          console.log('User already exists, updating googleId if missing'); 
          
          if (!user.googleId) {
            user.googleId = profile.id;
            await user.save();
          }
          return done(null, user);
        } else {
          console.log('Creating new user for Google OAuth'); 
          
          const username = email.split("@")[0]; 
          const randomPassword = Math.random().toString(36).slice(-12); 
          
          const newUser = await User.create({
            fullName: profile.displayName || (profile.name && (profile.name.givenName + ' ' + profile.name.familyName)) || 'Google User',
            email: email,
            username: username,
            password: randomPassword, 
            passwordConfirm: randomPassword, 
            role: "user", 
            googleId: profile.id, 
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


passport.serializeUser((user, done) => {
  done(null, user._id);
});


passport.deserializeUser(async (id, done) => {
  try {
    const user = await User.findById(id);
    done(null, user);
  } catch (err) {
    done(err, null);
  }
});

module.exports = passport;