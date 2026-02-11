import { Router } from "express";
import passport from "passport";
import {
  register,
  login,
  authStatus,
  logout,
  setup2FA,
  verify2FA,
  reset2FA,
} from "../controllers/authController.js";

const router = Router();

// Registration Route
router.post("/register", register);

// Login Route
router.post("/login", passport.authenticate("local"), login);

// Auth Status Route
router.get("/status", authStatus);

// Logout Route
router.post("/logout", logout);

// MFA ROUTES
// 2FA setup
router.post(
  "/2fa/setup",
  (req, res, next) => {
    if (req.isAuthenticated()) return next();
    else res.status(401).json({ message: "Unauthorised" });
  },
  setup2FA,
);

// verify Route
router.post(
  "/2fa/verify",
  (req, res, next) => {
    if (req.isAuthenticated()) return next();
    else res.status(401).json({ message: "Unauthorised" });
  },
  verify2FA,
);

// Reset Route
router.post(
  "/2fa/reset",
  (req, res, next) => {
    if (req.isAuthenticated()) return next();
    else res.status(401).json({ message: "Unauthorised" });
  },
  reset2FA,
);

export default router;
