import { createDbClient } from '../models/db'
import * as dotenv from 'dotenv'
import { Pool } from 'pg'
import * as fs from 'fs'
import * as path from 'path'

// Load environment variables
dotenv.config()

/**
 * Roll back the most recent migration
 * 
 * This script rolls back the most recent migration by:
 * 1. Reading the drizzle migration history table
 * 2. Finding the most recent migration
 * 3. Executing the down SQL for that migration
 * 4. Removing the migration from the history table
 */
async function rollbackMigration() {
  if (!process.env.DATABASE_URL) {
    console.error('DATABASE_URL environment variable is required')
    process.exit(1)
  }

  console.log('Rolling back the most recent migration...')
  
  try {
    // Create a direct connection to PostgreSQL for raw queries
    const pool = new Pool({ connectionString: process.env.DATABASE_URL })
    
    // Get the most recent migration from the drizzle migration history table
    const result = await pool.query(`
      SELECT * FROM drizzle_migrations 
      ORDER BY id DESC 
      LIMIT 1
    `)
    
    if (result.rows.length === 0) {
      console.log('No migrations to roll back')
      await pool.end()
      return
    }
    
    const latestMigration = result.rows[0]
    console.log(`Rolling back migration: ${latestMigration.name}`)
    
    // Find the migration file
    const migrationsDir = path.join(process.cwd(), 'src', 'migrations')
    const migrationFiles = fs.readdirSync(migrationsDir)
    
    // Look for the down SQL file for this migration
    const downSqlFile = migrationFiles.find(file => 
      file.includes(latestMigration.name) && file.endsWith('down.sql')
    )
    
    if (!downSqlFile) {
      console.error(`Could not find down SQL file for migration: ${latestMigration.name}`)
      await pool.end()
      process.exit(1)
    }
    
    // Read and execute the down SQL
    const downSql = fs.readFileSync(path.join(migrationsDir, downSqlFile), 'utf8')
    await pool.query(downSql)
    
    // Remove the migration from the history table
    await pool.query(`
      DELETE FROM drizzle_migrations 
      WHERE id = $1
    `, [latestMigration.id])
    
    console.log('Migration rolled back successfully')
    await pool.end()
    process.exit(0)
  } catch (error) {
    console.error('Rollback failed:', error)
    process.exit(1)
  }
}

rollbackMigration()

