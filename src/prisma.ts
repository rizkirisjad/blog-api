import { PrismaClient } from "../prisma/generated/prisma";

export default new PrismaClient({ log: ["query", "info", "warn", "error"] });
