const passport = require("passport");
const GitHubStrategy = require("passport-github2").Strategy;

// Configure the GitHub OAuth strategy
passport.use(
  new GitHubStrategy(
    {
      clientID: process.env.GITHUB_CLIENT_ID,
      clientSecret: process.env.GITHUB_CLIENT_SECRET,
      callbackURL: process.env.GITHUB_CALLBACK_URL
    },
    function (accessToken, refreshToken, profile, done) {
      // We are only using GitHub to authenticate the user (OAuth for user
      // management), so the GitHub profile itself is treated as the user.
      // No extra collection or DB write is required for this to work.
      return done(null, profile);
    }
  )
);

// Store the whole profile in the session
passport.serializeUser(function (user, done) {
  done(null, user);
});

// Retrieve the user from the session
passport.deserializeUser(function (user, done) {
  done(null, user);
});

module.exports = passport;
