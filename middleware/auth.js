// Middleware to protect routes that require a logged-in (OAuth-authenticated) user
function isLoggedIn(req, res, next) {
  if (req.isAuthenticated && req.isAuthenticated()) {
    return next();
  }

  return res.status(401).json({
    error: "You must be logged in via GitHub OAuth to perform this action."
  });
}

module.exports = { isLoggedIn };
