const express = require("express");
const passport = require("passport");
const User = require("./../models/userModel");
const jwt = require("jsonwebtoken");
const router = express.Router();

// Google OAuth login route
router.get(
  "/google",
  (req, res, next) => {
    // Validate that Google credentials are properly set
    if (!process.env.GOOGLE_CLIENT_ID || !process.env.GOOGLE_CLIENT_SECRET) {
      console.error("Google OAuth credentials are not configured properly");
      return res.status(500).json({ 
        error: "Google OAuth is not configured properly. Missing credentials." 
      });
    }
    
    passport.authenticate("google", { 
      scope: ["profile", "email"],
      failureRedirect: `${process.env.FRONTEND_URL || "http://localhost:5173"}?error=google_auth_failed`
    })(req, res, next);
  }
);

// Google OAuth callback route
router.get(
  "/google/callback",
  (req, res, next) => {
    // Validate that Google credentials are properly set
    if (!process.env.GOOGLE_CLIENT_ID || !process.env.GOOGLE_CLIENT_SECRET) {
      console.error("Google OAuth credentials are not configured properly");
      return res.status(500).json({ 
        error: "Google OAuth is not configured properly. Missing credentials." 
      });
    }
    
    passport.authenticate("google", async (err, user, info) => {
      if (err) {
        console.error("Google OAuth error:", err);
        if (err.message.includes('ECONNREFUSED') || err.message.includes('ENOTFOUND')) {
          // Network error
          return res.redirect(`${process.env.FRONTEND_URL || "http://localhost:5173"}?error=network_error`);
        }
        return res.redirect(`${process.env.FRONTEND_URL || "http://localhost:5173"}?error=auth_error`);
      }
      if (!user) {
        console.error("Google OAuth failed:", info);
        return res.redirect(`${process.env.FRONTEND_URL || "http://localhost:5173"}?error=auth_failed`);
      }
      
      // Log the user in by establishing a session
      req.logIn(user, async (err) => {
        if (err) {
          console.error("Session login error:", err);
          return res.redirect(`${process.env.FRONTEND_URL || "http://localhost:5173"}?error=session_error`);
        }
        
        try {
          // Generate JWT token for the authenticated user
          const token = jwt.sign(
            { id: user._id, role: user.role },
            process.env.JWT_SECRET,
            {
              expiresIn: process.env.JWT_EXPIRES_IN,
            }
          );

          // Redirect to frontend with token in URL parameter
          res.redirect(`${process.env.FRONTEND_URL || "http://localhost:5173"}?token=${token}`);
        } catch (signErr) {
          console.error("JWT signing error:", signErr);
          res.redirect(`${process.env.FRONTEND_URL || "http://localhost:5173"}?error=token_error`);
        }
      });
    })(req, res, next);
  }
);

module.exports = router;