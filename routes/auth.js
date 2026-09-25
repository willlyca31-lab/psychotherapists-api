const express = require("express");
const passport = require("passport");

const router = express.Router();

// GET /auth/github - start the GitHub OAuth flow
router.get("/github", passport.authenticate("github"));

// GET /auth/github/callback - GitHub redirects back here after login
router.get(
  "/github/callback",
  passport.authenticate("github", { failureRedirect: "/auth/failure" }),
  function (req, res) {
    // Successful authentication
    res.status(200).json({
      message: "Logged in successfully.",
      user: {
        id: req.user.id,
        username: req.user.username,
        displayName: req.user.displayName
      }
    });
  }
);

// GET /auth/failure - shown if GitHub login fails
router.get("/failure", (req, res) => {
  res.status(401).json({
    error: "GitHub authentication failed."
  });
});

// GET /auth/logout - log the current user out
router.get("/logout", (req, res, next) => {
  req.logout((error) => {
    if (error) {
      return next(error);
    }

    res.status(200).json({
      message: "Logged out successfully."
    });
  });
});

// GET /auth/status - check whether a user is currently logged in
router.get("/status", (req, res) => {
  if (req.isAuthenticated && req.isAuthenticated()) {
    return res.status(200).json({
      loggedIn: true,
      user: {
        id: req.user.id,
        username: req.user.username,
        displayName: req.user.displayName
      }
    });
  }

  res.status(200).json({ loggedIn: false });
});

module.exports = router;
