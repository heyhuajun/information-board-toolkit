import pg from 'pg'
import * as fs from 'fs'
import * as path from 'path'

const { Pool } = pg

async function initDatabase() {
  const databaseUrl = process.env.DATABASE_URL
  
  if (!databaseUrl) {
    console.error('DATABASE_URL environment variable is required')
    process.exit(1)
  }

  const pool = new Pool({ connectionString: databaseUrl })

  try {
    console.log('Connecting to database...')
    await pool.query('SELECT NOW()')
    console.log('Connected successfully')

    const sqlPath = path.join(__dirname, 'init-db.sql')
    const sql = fs.readFileSync(sqlPath, 'utf8')

    console.log('Running initialization script...')
    await pool.query(sql)
    console.log('Database initialized successfully!')

    const result = await pool.query(`
      SELECT table_name FROM information_schema.tables 
      WHERE table_schema = 'public' AND table_type = 'BASE TABLE'
    `)
    console.log('Tables created:', result.rows.map(r => r.table_name).join(', '))

  } catch (error) {
    console.error('Failed to initialize database:', error)
    process.exit(1)
  } finally {
    await pool.end()
  }
}

initDatabase()
