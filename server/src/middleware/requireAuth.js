import { verifyToken } from "../utils/jwt.js";
import { prisma } from "../lib/prisma.js";

async function requireAuth(req, res, next) {
  try {
    const authHeader = req.headers.authorization;
    if (!authHeader || !authHeader.startsWith("Bearer ")) {
      return res.status(401).json({
        errors: [{ field: "authorization", message: "Authentication required" }],
      });
    }

    const token = authHeader.split(" ")[1];
    const decoded = verifyToken(token);
    if (!decoded || !decoded.id) {
      return res.status(401).json({
        errors: [{ field: "authorization", message: "Invalid or expired token" }],
      });
    }

    // GDPR compliance check: ensure account wasn't soft-deleted or purged
    const user = await prisma.user.findUnique({
      where: { id: decoded.id },
      select: { id: true, email: true, name: true, deletedAt: true, purgedAt: true },
    });

    if (!user || user.deletedAt !== null || user.purgedAt !== null) {
      return res.status(401).json({
        errors: [{ field: "authorization", message: "Account not found or has been deleted" }],
      });
    }

    req.user = user;
    next();
  } catch (error) {
    return res.status(401).json({
      errors: [{ field: "authorization", message: "Invalid or expired token" }],
    });
  }
}

export { requireAuth };