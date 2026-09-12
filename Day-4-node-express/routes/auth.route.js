// routes/auth.route.js
const express = require("express");
const { register, login } = require("../controller/auth.controller.js");
const { isAuthn } = require("../middlewares/isAuthn.js");
const { isAuthorized } = require("../middlewares/isAuthorized.js");

const authRouter = express.Router();

// Public Routes
authRouter.post("/register", register);
authRouter.post("/login", login);

// Authenticated Route (Any logged in user)
authRouter.get("/me", isAuthn, async (req, res) => {
  return res.status(200).json({
    message: "Protected route works successfully ✅",
    user: req.user,
  });
});

// Authorized Route (Admin only)
authRouter.get("/admin", isAuthn, isAuthorized(["admin"]), async (req, res) => {
  return res.status(200).json({
    message: "Admin authorized route works successfully 👑",
    user: req.user,
  });
});

module.exports = { authRouter };
