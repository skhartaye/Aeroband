import { Pool } from 'pg';

// Database connection pool
let pool: Pool | null = null;

/**
 * Initialize database connection pool
 */
function getPool(connectionString: string): Pool {
  if (!pool) {
    pool = new Pool({
      connectionString,
      ssl: {
        rejectUnauthorized: false
      }
    });
  }
  return pool;
}

/**
 * Execute SQL query
 */
export async function executeQuery(sql: string, values: any[] = [], connectionString: string) {
  const client = getPool(connectionString);
  
  try {
    const result = await client.query(sql, values);
    return result;
  } catch (error) {
    console.error('Database query error:', error);
    throw error;
  }
}

/**
 * API endpoint for database operations
 */
export default async function handler(req: any, res: any) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  try {
    const { sql, values = [], connectionString } = req.body;

    if (!sql || !connectionString) {
      return res.status(400).json({ error: 'Missing required parameters' });
    }

    const result = await executeQuery(sql, values, connectionString);
    
    res.status(200).json({
      success: true,
      rows: result.rows,
      rowCount: result.rowCount
    });
  } catch (error) {
    console.error('API error:', error);
    res.status(500).json({ 
      error: 'Database operation failed',
      details: error instanceof Error ? error.message : 'Unknown error'
    });
  }
} 