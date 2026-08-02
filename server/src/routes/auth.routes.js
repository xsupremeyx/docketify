import { Router } from "express";
import { validateRegister, validateLogin } from "../validators/auth.validators.js";
import { validationError } from "../middleware/validationError.js";
import { requireAuth } from "../middleware/requireAuth.js";
import { registerUser, loginUser, getMe } from "../controllers/auth.controller.js";

const router = Router();

// Public Routes
router.post("/register", validateRegister, validationError, registerUser);
router.post("/login", validateLogin, validationError, loginUser);

// Protected Routes (require Bearer Token & checks GDPR deletion status)
router.get("/me", requireAuth, getMe);

export default router;