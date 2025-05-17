const passport = require("passport");
const LocalStrategy = require("passport-local").Strategy;
const GoogleStrategy = require("passport-google-oauth20").Strategy;
const bcrypt = require("bcryptjs");
const User = require("../models/User");

// Local Strategy remains the same
passport.use(new LocalStrategy(
  { usernameField: "email" },
  async (email, password, done) => {
    try {
      const user = await User.findOne({ email });
      if (!user) {
        return done(null, false, { message: "Incorrect email." });
      }
      const isMatch = await bcrypt.compare(password, user.password);
      if (!isMatch) {
        return done(null, false, { message: "Incorrect password." });
      }
      return done(null, user);
    } catch (err) {
      return done(err);
    }
  }
));

// Fixed Google Strategy
passport.use(new GoogleStrategy({
    clientID: process.env.GOOGLE_CLIENT_ID,
    clientSecret: process.env.GOOGLE_CLIENT_SECRET,
    callbackURL: "http://localhost:5000/auth/google/callback", // Add full URL
    userProfileURL: "https://www.googleapis.com/oauth2/v3/userinfo" // Add this line
  },
  async (accessToken, refreshToken, profile, done) => {
    try {
      // Check if user exists
      let user = await User.findOne({ 
        $or: [
          { googleId: profile.id },
          { email: profile.emails[0].value }
        ]
      });

      if (user) {
        // Update existing user's Google ID if they signed up with email first
        if (!user.googleId) {
          user.googleId = profile.id;
          await user.save();
        }
        return done(null, user);
      }

      // Create new user
      user = await User.create({
        googleId: profile.id,
        email: profile.emails[0].value,
        name: profile.displayName,
        password: await bcrypt.hash(Math.random().toString(36), 10) // Random password for Google users
      });

      return done(null, user);
    } catch (error) {
      console.error('Google Strategy Error:', error);
      return done(error, null);
    }
  }
));

// Improved serialization
passport.serializeUser((user, done) => {
  done(null, user.id);
});

// Improved deserialization with error handling
passport.deserializeUser(async (id, done) => {
  try {
    const user = await User.findById(id).select('-password'); // Exclude password
    if (!user) {
      return done(null, false);
    }
    done(null, user);
  } catch (error) {
    console.error('Deserialize Error:', error);
    done(error, null);
  }
});

module.exports = passport;
