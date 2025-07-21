require("dotenv").config();
const express = require("express");
const passport = require("../config/google");
const authController = require("../controllers/authController")
const authMiddleware = require("../middleware/auth");
const jwt = require("jsonwebtoken");
const router = express.Router();

router.get("/google", (req, res, next) => {
  const { tableId } = req.query;
  req.session.tableId = tableId;
  passport.authenticate("google", { scope: ["profile", "email"] })(req, res, next);
});

router.get("/google/callback",
  passport.authenticate("google", { failureRedirect: "/" }),
  (req, res) => {
    const user = req.user;
    const tableId = req.session.tableId || "";

    if (!user) {
      return res.redirect(`${process.env.CLIENT_URL}?error=NoUser`);
    }

    const token = jwt.sign(
      {
        id: user._id,
        email: user.email,
        name: user.name,
        role: user.role,
        avatar: user.avatar,
      },
      process.env.JWT_SECRET,
      { expiresIn: process.env.JWT_EXPIRE }
    );

    res.redirect(`${process.env.CLIENT_URL}/login?token=${token}&tableId=${tableId}`);
  }
);

router.post("/register", authController.register);
router.post("/login", authController.login);
router.get('/profile', authMiddleware, authController.getProfile);


module.exports = router;