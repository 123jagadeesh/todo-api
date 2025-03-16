// backend/routes/authRoutes.js
const express = require("express");
const passport = require("passport");
const router = express.Router();

// Local Sign-In
router.post("/login", passport.authenticate("local"), (req, res) => {
  res.json({ message: "Logged in successfully", user: req.user });
});

// Local Sign-Up (manual registration)
const bcrypt = require("bcryptjs");
const User = require("../models/User");
router.post("/signup", async (req, res) => {
  const { email, password, name } = req.body;
  if (!email || !password) return res.status(400).json({ message: "Email and password required" });
  try {
    const existingUser = await User.findOne({ email });
    if (existingUser) return res.status(400).json({ message: "Email already exists" });
    const hashedPassword = await bcrypt.hash(password, 10);
    const user = await User.create({ email, password: hashedPassword, name });
    res.status(201).json({ message: "User created", user });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Google OAuth Route
router.get(
  "/google",
  passport.authenticate("google", { scope: ["profile", "email"] })
);

// Google OAuth Callback
router.get(
  "/google/callback",
  passport.authenticate("google", { failureRedirect: "/login" }),
  (req, res) => {
    // Successful authentication, redirect or send response.
    res.redirect("http://localhost:3000"); // Frontend URL, for example.
  }
);

// Log out
router.get("/logout", (req, res) => {
  req.logout(err => {
    if (err) return next(err);
    res.json({ message: "Logged out" });
  });
});

module.exports = router;
