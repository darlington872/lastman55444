import pg from 'pg';
import { drizzle } from 'drizzle-orm/node-postgres';
import * as schema from "@shared/schema";

const { Pool } = pg;

// Use the provided CockroachDB connection string or the default from environment
const connectionString = process.env.DATABASE_URL || 
  "postgresql://demon:CK7n1R98DvUxYr-9uH15ng@foiled-parrot-5434.jxf.gcp-europe-west3.cockroachlabs.cloud:26257/defaultdb?sslmode=verify-full";

export const pool = new Pool({ connectionString });
export const db = drizzle(pool, { schema });
