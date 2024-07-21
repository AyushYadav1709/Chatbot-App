const express = require("express");
const { body } = require("express-validator");

const User = require("../models/user");
const authController = require("../controller/auth");

const router = express.Router();

router.post(
  "/signup",
  [
    body("email")
      .isEmail()
      .trim()
      .custom(async (value, { req }) => {
        const userDoc = await User.findOne({ email: value });
        if (userDoc) {
          return Promise.reject("Email already exists.");
        }
      }),
    body("password").isStrongPassword().withMessage("Password is not strong."),
  ],
  authController.postSignup
);

router.post("/login", authController.postLogin);

module.exports = router;
