import { drizzle } from 'drizzle-orm/node-postgres'
import { Pool } from 'pg'
import * as schema from './schema'

// This file provides a way to import the database client from anywhere in the application
// without having to recreate the connection

// For use outside of Nitro context (migrations, scripts, etc.)
export const createDbClient = (connectionString: string) => {
  const pool = new Pool({ connectionString })
  return drizzle(pool, { schema })
}

// For use within Nitro context (API routes, etc.)
export const useDb = () => {
  return useEvent().context.db
}

// Type definitions for the database
export type Database = ReturnType<typeof createDbClient>
export type DbSchema = typeof schema

