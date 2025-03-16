const passport = require("passport");
const LocalStrategy = require("passport-local").Strategy;
const GoogleStrategy = require("passport-google-oauth20").Strategy;
const bcrypt = require("bcryptjs")
const User = require("../models/User");

//configure localstrtegy
passport.use(
  new LocalStrategy(
    {usernameField: "email"},
  async(email,password,done)=>{
    try{
      // If no user is found, return false with amessage
      const user = await User.findOne({email});
      if(!user){
        return done(null,false,{message:"Incorrect email."});
      }
      //compare the provided password with stored hashed password
      const isMatch = await bcrypt.compare(password,user.password);
      if(!isMatch)
      { //if password don't match,return false
        return done(null,false,{ message: "Incorrect password."});
      }
      //if user exists and password matches,return the user object
      return done(null,user);
    }catch(err){
      //pass any errors to Passport
      return done(err);
    }
  }
  )
)
passport.use(new GoogleStrategy({
    clientID: process.env.GOOGLE_CLIENT_ID,  //Google OAuth Client ID
    clientSecret: process.env.GOOGLE_CLIENT_SECRET, //Google OAuth Client Secret
    callbackURL: "/auth/google/callback",
  },
  async (accessToken, refreshToken, profile, done) => {
    try {
      // Find or create the user based on Google profile
      let user = await User.findOne({ googleId: profile.id });
      if (user) {
        done(null, user);
        }
         // Create new user if doesn't exist. Email and name come from profile.
         user = await User.create({
          googleId: profile.id,
          email: profile.emails[0].value,
          name: profile.displayName,
      });  
      return done(null, user);  
    } catch (error) {
      done(error, null);
    }
  }
));

// Optionally, serialize/deserialize users if using sessions.
// If you're using JWT instead, you may not need these:
// passport.serializeUser is a function that tells Passport what user data should be stored in the session (here, just user.id).
passport.serializeUser((user, done) => 
  {
    done(null, user.id)
  });

//deserializer ensure that the  authenticated user's information is available on every request after they log in.

passport.deserializeUser(async (id, done) => {
  try {
    const user = await User.findById(id);
    done(null, user);
  } catch (error) {
    done(error, null);
  }
});

module.exports = passport;
