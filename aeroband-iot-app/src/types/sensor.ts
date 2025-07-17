export interface SensorData {
  temperature: number;
  humidity: number;
  pressure: number;
  altitude?: number;
  airQuality?: number;
  gas_resistance?: number;
  ammonia?: number;
  pm1_0?: number;
  pm2_5?: number;
  pm10?: number;
  timestamp?: string | number;
  trend?: {
    temperature: number;
    humidity: number;
    pressure: number;
    airQuality: number;
    altitude: number;
  };
  aqiScore?: number;
  aqiCategory?: string;
}

export interface ChartData {
  labels: string[];
  datasets: {
    label: string;
    data: number[];
    borderColor: string;
    backgroundColor: string;
    borderWidth: number;
    fill: boolean;
    tension: number;
  }[];
}

export interface SystemStatus {
  isConnected: boolean;
  lastUpdate: Date;
  dataPoints: number;
  alerts: number;
  criticalAlerts: number;
  warningAlerts: number;
}

export interface AlertThresholds {
  temperature: {
    warning: number;
    critical: number;
  };
  humidity: {
    warning: number;
    critical: number;
  };
  airQuality: {
    warning: number;
    critical: number;
  };
}

export interface ExportOptions {
  format: 'csv' | 'json' | 'excel';
  dateRange?: {
    start: Date;
    end: Date;
  };
  sensors?: string[];
}

export interface ChartConfig {
  responsive: boolean;
  maintainAspectRatio: boolean;
  plugins: {
    legend: {
      display: boolean;
    };
    tooltip: {
      mode: string;
      intersect: boolean;
      backgroundColor: string;
      titleColor: string;
      bodyColor: string;
    };
  };
  scales: {
    x: {
      display: boolean;
      grid: {
        color: string;
      };
      ticks: {
        color: string;
      };
    };
    y: {
      display: boolean;
      grid: {
        color: string;
      };
      ticks: {
        color: string;
      };
    };
  };
} 