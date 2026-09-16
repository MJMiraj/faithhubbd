import { NextResponse } from 'next/server';
import { db } from '@/lib/db';
import mariadb from 'mariadb';

export const dynamic = 'force-dynamic';

export async function GET() {
  const result: any = {};
  
  try {
    const users = await db.user.findMany({ take: 1 });
    result.prisma = 'Success: ' + users.length;
  } catch (err: any) {
    result.prismaError = {
      message: err?.message,
      name: err?.name,
      stack: err?.stack
    };
  }

  try {
    const dbUrl = new URL(process.env.DATABASE_URL || 'mysql://localhost:3306/db');
    const pool = mariadb.createPool({
      host: dbUrl.hostname,
      port: Number(dbUrl.port) || 3306,
      user: dbUrl.username,
      password: dbUrl.password,
      database: dbUrl.pathname.replace('/', ''),
      ssl: { rejectUnauthorized: false },
      connectionLimit: 1,
      connectTimeout: 5000
    });
    
    const conn = await pool.getConnection();
    const rows = await conn.query('SELECT 1 as val');
    result.rawDriver = 'Success: ' + JSON.stringify(rows);
    conn.release();
    pool.end();
  } catch (err: any) {
    result.rawDriverError = {
      message: err?.message,
      name: err?.name,
      code: err?.code
    };
  }
  
  result.env = {
    hasDatabaseUrl: !!process.env.DATABASE_URL,
    dbUrlLength: process.env.DATABASE_URL?.length,
  };

  return NextResponse.json(result);
}
