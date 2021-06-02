import { body } from "express-validator";

export const signUpCredentials = [
  body("username").trim().notEmpty().withMessage("You must supply a username"),
  body("email").trim().isEmail().withMessage("Email must be valid"),
  body("password")
    .trim()
    .isLength({ min: 4, max: 20 })
    .withMessage("Password must be between 4 and 20 characters"),
];

export const signInCredentials = [
  body("email").isEmail().withMessage("Email must be valid"),
  body("password").notEmpty().trim().withMessage("You must supply a password"),
];
