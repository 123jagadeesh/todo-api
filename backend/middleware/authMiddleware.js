const ensureAuthenticated = (req, res, next) => {
  if (req.isAuthenticated()) {
    return next();
  }
  console.log("Session:", req.session);
  console.log("User:", req.user);
  res.status(401).json({ message: "Authentication required" });
};

module.exports = ensureAuthenticated;
