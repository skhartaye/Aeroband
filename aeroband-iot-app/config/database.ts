export interface DatabaseConfig {
  connectionString: string;
  tableName: string;
  autoSave: boolean;
  batchSize: number;
}

export const defaultDatabaseConfig: DatabaseConfig = {
  connectionString: process.env.NEON_DATABASE_URL || '',
  tableName: 'sensor_data',
  autoSave: true,
  batchSize: 100
};

export function getDatabaseConfig(): DatabaseConfig {
  return {
    ...defaultDatabaseConfig,
    connectionString: process.env.NEON_DATABASE_URL || 
                     (window as any).__NEON_DATABASE_URL__ || 
                     defaultDatabaseConfig.connectionString
  };
} 