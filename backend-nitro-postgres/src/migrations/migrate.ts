import { migrate } from 'drizzle-orm/node-postgres/migrator'
import { createDbClient } from '../models/db'
import * as dotenv from 'dotenv'

// Load environment variables
dotenv.config()

/**
 * Run database migrations
 * 
 * This script applies all pending migrations to the database.
 * It should be run as part of the deployment process or when setting up a new environment.
 */
async function runMigrations() {
  if (!process.env.DATABASE_URL) {
    console.error('DATABASE_URL environment variable is required')
    process.exit(1)
  }

  console.log('Running migrations...')
  
  try {
    const db = createDbClient(process.env.DATABASE_URL)
    
    // Run migrations from the migrations folder
    await migrate(db, { migrationsFolder: './src/migrations' })
    
    console.log('Migrations completed successfully')
    process.exit(0)
  } catch (error) {
    console.error('Migration failed:', error)
    process.exit(1)
  }
}

runMigrations()

