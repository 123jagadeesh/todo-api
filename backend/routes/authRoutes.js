const express = require("express");
const passport = require("passport");
const router = express.Router();
const bcrypt = require("bcryptjs");
const User = require("../models/User");

// Local Sign-In with better error handling
router.post("/login", (req, res, next) => {
  passport.authenticate("local", (err, user, info) => {
    if (err) return next(err);
    if (!user) return res.status(401).json({ message: info.message || "Login failed" });
    
    req.logIn(user, (err) => {
      if (err) return next(err);
      res.json({ message: "Logged in successfully", user });
    });
  })(req, res, next);
});

// Local Sign-Up with improved validation
router.post("/signup", async (req, res) => {
  const { email, password, name } = req.body;
  try {
    if (!email || !password || !name) {
      return res.status(400).json({ message: "All fields are required" });
    }

    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res.status(400).json({ message: "Email already exists" });
    }

    const hashedPassword = await bcrypt.hash(password, 10);
    const user = await User.create({ email, password: hashedPassword, name });
    
    // Auto-login after signup
    req.logIn(user, (err) => {
      if (err) return next(err);
      res.status(201).json({ message: "User created and logged in", user });
    });
  } catch (error) {
    console.error("Signup error:", error);
    res.status(500).json({ message: "Error creating user" });
  }
});

// Get current user profile
router.get("/me", (req, res) => {
  if (!req.user) {
    return res.status(401).json({ message: "Not authenticated" });
  }
  res.json({ user: req.user });
});

// Google OAuth with error handling
router.get("/google",
  passport.authenticate("google", { 
    scope: ["profile", "email"],
    prompt: "select_account"
  })
);

router.get("/google/callback",
  passport.authenticate("google", { 
    failureRedirect: "http://localhost:3000",
    failureMessage: true
  }),
  (req, res) => {
    res.redirect("http://localhost:3000");
  }
);

// Improved logout handling
router.get("/logout", (req, res, next) => {
  req.logout((err) => {
    if (err) return next(err);
    req.session.destroy((err) => {
      if (err) return next(err);
      res.clearCookie('connect.sid');
      res.json({ message: "Logged out successfully" });
    });
  });
});

module.exports = router;
