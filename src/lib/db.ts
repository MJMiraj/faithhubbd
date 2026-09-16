import { PrismaClient } from "@prisma/client";
import { PrismaMariaDb } from "@prisma/adapter-mariadb";
import mariadb from "mariadb";


const globalForPrisma = globalThis as unknown as {
  prisma: PrismaClient | undefined;
};

export const db = new Proxy({} as PrismaClient, {
  get(target, prop) {
    if (!globalForPrisma.prisma) {
      const dbUrl = new URL(process.env.DATABASE_URL || "mysql://localhost:3306/db");
      const pool = mariadb.createPool({
        host: dbUrl.hostname,
        port: Number(dbUrl.port) || 3306,
        user: dbUrl.username,
        password: dbUrl.password,
        database: dbUrl.pathname.replace("/", ""),
        ssl: { rejectUnauthorized: false },
        connectionLimit: 3,
        connectTimeout: 30000,
        acquireTimeout: 30000,
      });
      const adapter = new PrismaMariaDb(pool);
      globalForPrisma.prisma = new PrismaClient({ adapter });
    }
    return (globalForPrisma.prisma as any)[prop];
  }
});

if (process.env.NODE_ENV !== "production") {
  // We don't assign Proxy to globalThis, the Proxy itself assigns the real instance to globalThis
}


