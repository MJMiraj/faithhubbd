import { PrismaClient } from "@prisma/client";
import { PrismaMariaDb } from "@prisma/adapter-mariadb";
import mariadb from "mariadb";

function createPrismaClient() {
  const dbUrl = new URL(process.env.DATABASE_URL || "mysql://localhost:3306/db");
  const pool = mariadb.createPool({
    host: dbUrl.hostname,
    port: Number(dbUrl.port) || 3306,
    user: dbUrl.username,
    password: dbUrl.password,
    database: dbUrl.pathname.replace("/", ""),
    ssl: { rejectUnauthorized: false },
    connectionLimit: 2,
    connectTimeout: 30000,
    acquireTimeout: 30000,
  });
  const adapter = new PrismaMariaDb(pool);
  return new PrismaClient({ adapter });
}

const globalForPrisma = globalThis as unknown as {
  prisma: PrismaClient | undefined;
};

export const db =
  globalForPrisma.prisma ??
  createPrismaClient();

if (process.env.NODE_ENV !== "production") globalForPrisma.prisma = db;


