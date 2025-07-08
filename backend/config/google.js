module.exports = {
  clientID: process.env.GOOGLE_CLIENT_ID,
  clientSecret: process.env.GOOGLE_CLIENT_SECRET,
  callbackURL: "http://localhost:4000/api/auth/google/callback"
};

const passport = require("passport");
const GoogleStrategy = require("passport-google-oauth20").Strategy;
const googleConfig = require("../config/google");
const User = require("../models/User");

passport.use(new GoogleStrategy(
  googleConfig,
  async function(accessToken, refreshToken, profile, done) {
    try {
      const email = profile.emails && profile.emails[0] && profile.emails[0].value;
      let user = await User.findOne({ googleId: profile.id });
      if (!user) {
        user = await User.create({
          googleId: profile.id,
          email: email,
          name: profile.displayName,
          avatar: profile.photos && profile.photos[0] && profile.photos[0].value
        });
      }
      return done(null, user);
    } catch (err) {
      return done(err, null);
    }
  }
));

passport.serializeUser((user, done) => {
  done(null, user);
});
passport.deserializeUser((user, done) => {
  done(null, user);
});

module.exports = passport;