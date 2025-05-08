import { drizzle } from 'drizzle-orm/node-postgres'
import { Pool } from 'pg'
import { defineNitroPlugin } from 'nitropack/runtime/plugin'

export default defineNitroPlugin((nitroApp) => {
  const config = useRuntimeConfig()
  
  if (!config.databaseUrl) {
    console.error('DATABASE_URL environment variable is required')
    process.exit(1)
  }

  // Create a PostgreSQL connection pool
  const pool = new Pool({
    connectionString: config.databaseUrl as string,
  })

  // Initialize Drizzle with the PostgreSQL pool
  const db = drizzle(pool)

  // Make the database connection available throughout the application
  nitroApp.hooks.hook('request', (event) => {
    event.context.db = db
  })

  // Close the database connection when the server is shutting down
  nitroApp.hooks.hook('close', async () => {
    await pool.end()
    console.log('Database connection closed')
  })

  console.log('Database plugin initialized')
})

