import { body } from "express-validator";

const validateRegister = [
    body("email")
        .trim()
        .notEmpty()
        .withMessage("Email is required")
        .bail()
        .isEmail()
        .withMessage("Invalid email format")
        .bail(),
    
    body("password")
        .trim()
        .notEmpty()
        .withMessage("Password is required")
        .bail()
        .isLength({ min: 6 })
        .withMessage("Password must be at least 6 characters long")
        .bail(),
    
    body("name")
        .optional()
        .trim()
        .isLength({ max: 50 })
        .withMessage("Name must be under 50 characters"),

];

const validateLogin = [
  body("email")
    .trim()
    .notEmpty()
    .withMessage("Email is required")
    .bail()
    .isEmail()
    .withMessage("Must be a valid email address")
    .bail(),
  body("password")
    .notEmpty()
    .withMessage("Password is required")
    .bail(),
];

export { validateRegister, validateLogin };