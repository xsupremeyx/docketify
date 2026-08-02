import { prisma } from '../lib/prisma.js';

async function logAudit({ userId = null, action, metadata = {}, ip = null }) {
  try {
    await prisma.auditLog.create({
      data: { userId, action, metadata, ip },
    });
  } catch (err) {
    console.error('Audit Log Error:', err.message);
  }
}

export { logAudit };