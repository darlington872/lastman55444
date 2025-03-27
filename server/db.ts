import pg from 'pg';
import { drizzle } from 'drizzle-orm/node-postgres';
import * as schema from "@shared/schema";

const { Pool } = pg;

// Use the Replit database URL environment variable
const connectionString = process.env.DATABASE_URL;

if (!connectionString) {
  console.error("DATABASE_URL environment variable is not set. Database connections will fail.");
}

export const pool = new Pool({ connectionString });
export const db = drizzle(pool, { schema });
