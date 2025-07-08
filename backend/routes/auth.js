require("dotenv").config();
const express = require("express");
const passport = require("../config/google");
const authController = require("../controllers/authController")
const jwt = require("jsonwebtoken");
const router = express.Router();

router.get("/google", passport.authenticate("google", { scope: ["profile", "email"] }));
router.get("/google/callback",
  passport.authenticate("google", { failureRedirect: "/" }),
  (req, res) => {
    const user = req.user;
    if (!user) {
      return res.redirect("http://localhost:3000?error=NoUser");
    }
    const token = jwt.sign({ 
      id: user._id, 
      email: user.email, 
      name: user.name, 
      avatar: user.avatar 
    }, process.env.JWT_SECRET, 
    { 
      expiresIn: process.env.JWT_EXPIRE
    }  
    );
    res.redirect(`http://localhost:3000?token=${token}`);
  }
);

router.post("/register", authController.register);
router.post("/login", authController.login);

module.exports = router;