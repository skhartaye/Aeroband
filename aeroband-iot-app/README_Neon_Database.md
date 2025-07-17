# Neon Database Integration

This guide explains how to set up Neon PostgreSQL database integration for storing sensor data.

## Prerequisites

1. **Neon Account**: Sign up at [neon.tech](https://neon.tech)
2. **Node.js**: Version 16 or higher
3. **PostgreSQL Client**: For database management

## Setup Steps

### 1. Create Neon Database

1. **Sign up/Login** to Neon
2. **Create a new project**
3. **Get your connection string** from the dashboard
4. **Note your database credentials**

### 2. Install Dependencies

```bash
npm install pg @types/pg
```

### 3. Configure Database Connection

#### Option A: Environment Variable (Recommended)

Create a `.env` file in your project root:

```env
NEON_DATABASE_URL=postgresql://username:password@host:port/database?sslmode=require
```

#### Option B: Configuration File

Create `config/database.local.ts`:

```typescript
export const databaseConfig = {
  connectionString: 'postgresql://username:password@host:port/database?sslmode=require',
  tableName: 'sensor_data',
  autoSave: true,
  batchSize: 100
};
```

### 4. Database Schema

The application will automatically create the following table:

```sql
CREATE TABLE sensor_data (
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
```

### 5. API Endpoints

The application uses these API endpoints for database operations:

- `POST /api/database/execute` - Execute SQL commands
- `POST /api/database/query` - Query data

### 6. Features

#### Automatic Data Storage
- Sensor data is automatically saved to Neon database
- Real-time data persistence
- No data loss during connection issues

#### Data Retrieval
- Load historical data from database
- Export data from database
- Data analytics and statistics

#### Database Statistics
- Total records count
- First and last record timestamps
- Data range information

## Usage

### 1. Start the Application

```bash
npm run dev
```

### 2. Connect to Sensor Device

1. **Click "Connect BLE"**
2. **Select your Arduino R4 device**
3. **Data will automatically save to Neon**

### 3. View Database Status

Check the browser console for database connection status:
- "Database connected!" - Success
- "Database connection failed" - Check configuration

### 4. Export Data from Database

The export functionality will include all data from the database, not just local data.

## Troubleshooting

### Connection Issues

1. **Check connection string format**
2. **Verify SSL settings** (Neon requires SSL)
3. **Check network connectivity**

### Database Errors

1. **Check table permissions**
2. **Verify database exists**
3. **Check connection string credentials**

### Performance Issues

1. **Reduce batch size** in config
2. **Enable connection pooling**
3. **Monitor database usage**

## Security Notes

1. **Never commit connection strings** to version control
2. **Use environment variables** for production
3. **Enable SSL** for all connections
4. **Regularly rotate credentials**

## Monitoring

### Database Metrics

Monitor these metrics in Neon dashboard:
- **Connection count**
- **Query performance**
- **Storage usage**
- **Error rates**

### Application Logs

Check browser console for:
- Database connection status
- Data save confirmations
- Error messages

## Backup Strategy

1. **Enable Neon backups** (automatic)
2. **Export data regularly** using the export feature
3. **Monitor backup status** in Neon dashboard

## Cost Optimization

1. **Use Neon's free tier** for development
2. **Monitor usage** to avoid overages
3. **Optimize queries** for better performance
4. **Archive old data** if needed

## Support

For issues with:
- **Neon Database**: Contact Neon support
- **Application**: Check console logs and error messages
- **Configuration**: Verify connection string format 