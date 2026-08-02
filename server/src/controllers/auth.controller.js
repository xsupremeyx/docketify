import bcrypt from "bcryptjs";

import { prisma } from "../lib/prisma.js";
import { signToken } from "../utils/jwt.js";
import { logAudit } from "../services/audit.service.js";

async function registerUser(req, res, next) {
    try {
        const { email, password, name } = req.body;

        const existingUser = await prisma.user.findUnique({ where: { email } });

        if (existingUser) {
            return res.status(400).json({
                errors: [{ field: "email", message: "Email is already registered" }],
            });
        }

        const salt = await bcrypt.genSalt(10);
        const passwordHash = await bcrypt.hash(password, salt);

        const newUser = await prisma.user.create({
            data: {
                email,
                passwordHash,
                name: name || null,
            },
            select: { id: true, email: true, name: true, createdAt: true },
        });

        await logAudit({ userId: newUser.id, action: "user.register", metadata: { method: "email" }, ip: req.ip || req.connection.remoteAddress });

        const token = signToken({ id: newUser.id });

        res.status(201).json({
            message: "User registered successfully",
            user: newUser,
            token,
        });
    }
    catch (err) {
        next(err);
    }
}


async function loginUser(req, res, next) {
    try {
        const { email, password } = req.body;

        const user = await prisma.user.findUnique({ where: { email } });

        if (!user || user.deletedAt !== null || user.purgedAt !== null) {
            return res.status(401).json({
                errors: [{ field: "credentials", message: "Invalid Credentials or account is deleted" }],
            });
        }

        if (!user.passwordHash) {
            return res.status(401).json({
                errors: [{ field: "credentials", message: "Please log in using OAuth (Google/Apple)" }],
            });
        }

        const isMatch = await bcrypt.compare(password, user.passwordHash);

        if (!isMatch) {
            return res.status(401).json({
                errors: [{ field: "credentials", message: "Invalid credentials" }],
            });
        }

        await logAudit({
            userId: user.id,
            action: "user.login",
            metadata: { method: "email" },
            ip: req.ip || req.connection.remoteAddress,
        });

        const token = signToken({ id: user.id });
        res.status(200).json({
            message: "Login successful",
            user: {
                id: user.id,
                email: user.email,
                name: user.name,
            },
            token,
        });
    }
    catch (error) {
        next(error);
    }
}

async function getMe(req, res, next) {
  try {
    res.status(200).json({ user: req.user });
  } catch (error) {
    next(error);
  }
}
export { registerUser, loginUser, getMe };