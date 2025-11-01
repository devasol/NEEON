const express = require("express");
const passport = require("passport");
const User = require("./../models/userModel");
const jwt = require("jsonwebtoken");
const router = express.Router();


router.get(
  "/google",
  (req, res, next) => {
    
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


router.get(
  "/google/callback",
  (req, res, next) => {
    
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
          
          return res.redirect(`${process.env.FRONTEND_URL || "http://localhost:5173"}?error=network_error`);
        }
        return res.redirect(`${process.env.FRONTEND_URL || "http://localhost:5173"}?error=auth_error`);
      }
      if (!user) {
        console.error("Google OAuth failed:", info);
        return res.redirect(`${process.env.FRONTEND_URL || "http://localhost:5173"}?error=auth_failed`);
      }
      
      
      req.logIn(user, async (err) => {
        if (err) {
          console.error("Session login error:", err);
          return res.redirect(`${process.env.FRONTEND_URL || "http://localhost:5173"}?error=session_error`);
        }
        
        try {
          
          const token = jwt.sign(
            { id: user._id, role: user.role },
            process.env.JWT_SECRET,
            {
              expiresIn: process.env.JWT_EXPIRES_IN,
            }
          );

          
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