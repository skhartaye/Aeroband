import { SensorData } from '../types/sensor';

export interface DatabaseConfig {
  connectionString: string;
  tableName?: string;
}

export class DatabaseService {
  private config: DatabaseConfig;
  private isConnected = false;

  constructor(config: DatabaseConfig) {
    this.config = config;
  }

  /**
   * Initialize database connection and create table if needed
   */
  async initialize(): Promise<void> {
    try {
      console.log('Initializing database connection...');
      
      // Test connection by creating the table
      await this.createTable();
      
      this.isConnected = true;
      console.log('Database connection established successfully');
    } catch (error) {
      console.error('Database initialization failed:', error);
      throw error;
    }
  }

  /**
   * Create the sensor data table if it doesn't exist
   */
  private async createTable(): Promise<void> {
    const createTableSQL = `
      CREATE TABLE IF NOT EXISTS sensor_data (
        id SERIAL PRIMARY KEY,
        timestamp TIMESTAMP NOT NULL,
        temperature DECIMAL(5,2),
        humidity DECIMAL(5,2),
        pressure DECIMAL(8,2),
        altitude DECIMAL(8,2),
        air_quality INTEGER,
        gas_resistance DECIMAL(12,2),
        ammonia DECIMAL(8,2),
        pm1_0 DECIMAL(8,2),
        pm2_5 DECIMAL(8,2),
        pm10 DECIMAL(8,2),
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      );
    `;

    try {
      const response = await fetch('/api/database/execute', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          sql: createTableSQL,
          connectionString: this.config.connectionString
        })
      });

      if (!response.ok) {
        throw new Error(`Database error: ${response.statusText}`);
      }

      console.log('Sensor data table created/verified successfully');
    } catch (error) {
      console.error('Failed to create table:', error);
      throw error;
    }
  }

  /**
   * Save sensor data to the database
   */
  async saveSensorData(data: SensorData): Promise<void> {
    if (!this.isConnected) {
      console.warn('Database not connected, skipping save');
      return;
    }

    try {
      const insertSQL = `
        INSERT INTO sensor_data (
          timestamp, temperature, humidity, pressure, altitude, 
          air_quality, gas_resistance, ammonia, pm1_0, pm2_5, pm10
        ) VALUES (
          $1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11
        )
      `;

      const values = [
        new Date(data.timestamp!).toISOString(),
        data.temperature,
        data.humidity,
        data.pressure || null,
        data.altitude || null,
        data.airQuality || null,
        data.gas_resistance || null,
        data.ammonia || null,
        data.pm1_0 || null,
        data.pm2_5 || null,
        data.pm10 || null
      ];

      const response = await fetch('/api/database/execute', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          sql: insertSQL,
          values: values,
          connectionString: this.config.connectionString
        })
      });

      if (!response.ok) {
        throw new Error(`Database error: ${response.statusText}`);
      }

      console.log('Sensor data saved to database successfully');
    } catch (error) {
      console.error('Failed to save sensor data:', error);
      throw error;
    }
  }

  /**
   * Retrieve sensor data from the database
   */
  async getSensorData(limit: number = 1000, offset: number = 0): Promise<SensorData[]> {
    try {
      const selectSQL = `
        SELECT 
          timestamp, temperature, humidity, pressure, altitude,
          air_quality, gas_resistance, ammonia, pm1_0, pm2_5, pm10
        FROM sensor_data 
        ORDER BY timestamp DESC 
        LIMIT $1 OFFSET $2
      `;

      const response = await fetch('/api/database/query', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          sql: selectSQL,
          values: [limit, offset],
          connectionString: this.config.connectionString
        })
      });

      if (!response.ok) {
        throw new Error(`Database error: ${response.statusText}`);
      }

      const result = await response.json();
      
      return result.rows.map((row: any) => ({
        temperature: row.temperature,
        humidity: row.humidity,
        pressure: row.pressure,
        altitude: row.altitude,
        airQuality: row.air_quality,
        gas_resistance: row.gas_resistance,
        ammonia: row.ammonia,
        pm1_0: row.pm1_0,
        pm2_5: row.pm2_5,
        pm10: row.pm10,
        timestamp: row.timestamp
      }));
    } catch (error) {
      console.error('Failed to retrieve sensor data:', error);
      throw error;
    }
  }

  /**
   * Get data statistics
   */
  async getDataStats(): Promise<{
    totalRecords: number;
    firstRecord: Date | null;
    lastRecord: Date | null;
  }> {
    try {
      const statsSQL = `
        SELECT 
          COUNT(*) as total_records,
          MIN(timestamp) as first_record,
          MAX(timestamp) as last_record
        FROM sensor_data
      `;

      const response = await fetch('/api/database/query', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          sql: statsSQL,
          connectionString: this.config.connectionString
        })
      });

      if (!response.ok) {
        throw new Error(`Database error: ${response.statusText}`);
      }

      const result = await response.json();
      const row = result.rows[0];

      return {
        totalRecords: parseInt(row.total_records),
        firstRecord: row.first_record ? new Date(row.first_record) : null,
        lastRecord: row.last_record ? new Date(row.last_record) : null
      };
    } catch (error) {
      console.error('Failed to get data stats:', error);
      throw error;
    }
  }

  /**
   * Check if database is connected
   */
  isDatabaseConnected(): boolean {
    return this.isConnected;
  }
} 