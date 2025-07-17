import { SensorData, ChartConfig } from './types/sensor';
import Chart from 'chart.js/auto';
import zoomPlugin from 'chartjs-plugin-zoom';
Chart.register(zoomPlugin);

export class Dashboard {
  private temperatureChart: Chart | null = null;
  private humidityChart: Chart | null = null;
  private airQualityChart: Chart | null = null;
  private dataPoints: SensorData[] = [];
  private maxDataPoints = 1000; // Maximum data points to store (prevent memory issues)
  private minDataPoints = 10; // Minimum data points to display on charts
  private currentInterval: string = 'all'; // 'all', '5min', '1hour', '1day', '1week'
  private timeIntervals = {
    '5min': 5 * 60 * 1000,
    '1hour': 60 * 60 * 1000,
    '1day': 24 * 60 * 60 * 1000,
    '1week': 7 * 24 * 60 * 60 * 1000,
    'all': 0
  };
  
  // Data Aggregation property
  private currentAggregationMode: string = 'realtime'; // 'realtime', 'average', 'peak', 'trend', 'daily-aqi'
  
  // View Mode property
  private currentViewMode: string = 'technical'; // 'technical', 'realtime'
  
  // Daily AQI tracking
  private dailyAQIData: { [date: string]: number[] } = {};
  private lastNotificationTime: number = 0;
  private notificationThrottleMs: number = 3000; // 3 seconds between notifications

  // In Dashboard class
  private hasReceivedRealData = false;

  initialize(): void {
    this.createCharts();
    this.setupEventListeners();
    this.setupIntervalSelector();
    this.updateLastUpdate();
    this.showWaitingState();
    
    // Initialize view modes and aggregation (without recreating charts)
    this.updateAggregationMode();
    
    // Initialize view mode UI
    this.updateViewModeUI();
    
    // Request notification permissions
    this.requestNotificationPermission();
    this.updateNotificationStatus();
  }

  private destroyCharts(): void {
    if (this.temperatureChart) {
      this.temperatureChart.destroy();
      this.temperatureChart = null;
    }
    if (this.humidityChart) {
      this.humidityChart.destroy();
      this.humidityChart = null;
    }
    if (this.airQualityChart) {
      this.airQualityChart.destroy();
      this.airQualityChart = null;
    }
  }

  private createCharts(): void {
    // Destroy existing charts first
    this.destroyCharts();
    
    const commonOptions: ChartConfig = {
      responsive: true,
      maintainAspectRatio: false,
      plugins: {
        legend: {
          display: false
        },
        tooltip: {
          mode: 'index' as const,
          intersect: false,
          backgroundColor: 'rgba(0, 0, 0, 0.8)',
          titleColor: '#FFFFFF',
          bodyColor: '#FFFFFF'
        }
      },
      scales: {
        x: {
          display: true,
          grid: {
            color: 'rgba(156, 163, 175, 0.1)'
          },
          ticks: {
            color: '#6B7280'
          }
        },
        y: {
          display: true,
          grid: {
            color: 'rgba(156, 163, 175, 0.1)'
          },
          ticks: {
            color: '#6B7280'
          }
        }
      }
    };

    // Temperature Chart
    const tempCtx = document.getElementById('temperature-chart') as HTMLCanvasElement;
    if (tempCtx) {
      this.temperatureChart = new Chart(tempCtx, {
        type: 'line',
        data: {
          labels: [],
          datasets: [{
            label: 'Temperature',
            data: [],
            borderColor: '#EF4444',
            backgroundColor: 'rgba(239, 68, 68, 0.15)',
            borderWidth: 3,
            fill: true,
            tension: 0.4,
            pointRadius: 0,
            pointHoverRadius: 6,
            pointHoverBackgroundColor: '#EF4444',
            pointHoverBorderColor: '#FFFFFF',
            pointHoverBorderWidth: 2
          }]
        },
        options: {
          ...commonOptions,
          plugins: {
            ...commonOptions.plugins,
            tooltip: {
              ...commonOptions.plugins.tooltip,
              mode: 'index' as const
            },
            zoom: {
              pan: {
                enabled: true,
                mode: 'x',
                modifierKey: undefined
              },
              zoom: {
                wheel: { enabled: true },
                pinch: { enabled: true },
                mode: 'x',
              },
              limits: {
                x: { minRange: 5 }
              }
            }
          }
        }
      });
    }

    // Humidity Chart
    const humidityCtx = document.getElementById('humidity-chart') as HTMLCanvasElement;
    if (humidityCtx) {
      this.humidityChart = new Chart(humidityCtx, {
        type: 'line',
        data: {
          labels: [],
          datasets: [{
            label: 'Humidity',
            data: [],
            borderColor: '#3B82F6',
            backgroundColor: 'rgba(59, 130, 246, 0.15)',
            borderWidth: 3,
            fill: true,
            tension: 0.4,
            pointRadius: 0,
            pointHoverRadius: 6,
            pointHoverBackgroundColor: '#3B82F6',
            pointHoverBorderColor: '#FFFFFF',
            pointHoverBorderWidth: 2
          }]
        },
        options: {
          ...commonOptions,
          plugins: {
            ...commonOptions.plugins,
            tooltip: {
              ...commonOptions.plugins.tooltip,
              mode: 'index' as const
            },
            zoom: {
              pan: {
                enabled: true,
                mode: 'x',
                modifierKey: undefined
              },
              zoom: {
                wheel: { enabled: true },
                pinch: { enabled: true },
                mode: 'x',
              },
              limits: {
                x: { minRange: 5 }
              }
            }
          }
        }
      });
    }

    // Air Quality Chart
    const airQualityCtx = document.getElementById('air-quality-chart') as HTMLCanvasElement;
    if (airQualityCtx) {
      this.airQualityChart = new Chart(airQualityCtx, {
        type: 'line',
        data: {
          labels: [],
          datasets: [{
            label: 'Air Quality',
            data: [],
            borderColor: '#10B981',
            backgroundColor: 'rgba(16, 185, 129, 0.15)',
            borderWidth: 3,
            fill: true,
            tension: 0.4,
            pointRadius: 0,
            pointHoverRadius: 6,
            pointHoverBackgroundColor: '#10B981',
            pointHoverBorderColor: '#FFFFFF',
            pointHoverBorderWidth: 2
          }]
        },
        options: {
          ...commonOptions,
          plugins: {
            ...commonOptions.plugins,
            tooltip: {
              ...commonOptions.plugins.tooltip,
              mode: 'index' as const
            },
            zoom: {
              pan: {
                enabled: true,
                mode: 'x',
                modifierKey: undefined
              },
              zoom: {
                wheel: { enabled: true },
                pinch: { enabled: true },
                mode: 'x',
              },
              limits: {
                x: { minRange: 5 }
              }
            }
          }
        }
      });
    }
  }

  private setupEventListeners(): void {
    // Export data functionality
    const exportBtn = document.getElementById('export-data');
    if (exportBtn) {
      exportBtn.addEventListener('click', () => {
        this.exportData();
      });
    }

    // Clear data functionality
    const clearBtn = document.getElementById('clear-data');
    if (clearBtn) {
      clearBtn.addEventListener('click', () => {
        this.clearData();
      });
    }

    // Test data points counter (for debugging)
    const testBtn = document.getElementById('test-data-counter');
    if (testBtn) {
      testBtn.addEventListener('click', () => {
        this.testDataCounter();
      });
    }

    // Test air quality alerts (for debugging)
    const testAirQualityBtn = document.getElementById('test-air-quality-alerts');
    if (testAirQualityBtn) {
      testAirQualityBtn.addEventListener('click', () => {
        this.testAirQualityAlerts();
      });
    }
    
    // Notification status button
    const notificationStatusBtn = document.getElementById('notification-status');
    if (notificationStatusBtn) {
      notificationStatusBtn.addEventListener('click', () => {
        this.toggleNotificationPermission();
      });
    }

    // Reset zoom functionality
    const resetZoomBtn = document.getElementById('reset-zoom');
    if (resetZoomBtn) {
      resetZoomBtn.addEventListener('click', () => {
        this.resetZoom();
      });
    }

    // Data aggregation functionality
    const aggregationSelector = document.getElementById('data-aggregation') as HTMLSelectElement;
    if (aggregationSelector) {
      aggregationSelector.addEventListener('change', (e) => {
        const target = e.target as HTMLSelectElement;
        this.currentAggregationMode = target.value;
        this.updateAggregationMode();
      });
    }

    // Clear alerts functionality
    const clearAlertsBtn = document.getElementById('clear-alerts');
    if (clearAlertsBtn) {
      clearAlertsBtn.addEventListener('click', () => {
        this.clearAllAlerts();
      });
    }

    // Theme toggle
    const themeToggle = document.getElementById('theme-toggle');
    if (themeToggle) {
      themeToggle.addEventListener('click', () => this.updateTheme());
    }

    // View Mode Selectors
    const technicalBtn = document.getElementById('view-mode-technical');
    const realtimeBtn = document.getElementById('view-mode-compact');
    const viewModeSelect = document.getElementById('view-mode-select') as HTMLSelectElement;

    if (technicalBtn) {
      technicalBtn.addEventListener('click', () => this.setViewMode('technical'));
    }
    if (realtimeBtn) {
      realtimeBtn.addEventListener('click', () => this.setViewMode('realtime'));
    }
    if (viewModeSelect) {
      viewModeSelect.addEventListener('change', (e) => {
        const target = e.target as HTMLSelectElement;
        this.setViewMode(target.value);
      });
    }
  }

  private setupIntervalSelector(): void {
    const intervalSelector = document.getElementById('time-interval') as HTMLSelectElement;
    if (intervalSelector) {
      intervalSelector.addEventListener('change', (e) => {
        const target = e.target as HTMLSelectElement;
        this.currentInterval = target.value;
        this.updateCharts();
        this.updateSystemStatus();
      });
    }
  }





  private updateAggregationMode(): void {
    const filteredData = this.getFilteredData();
    if (filteredData.length === 0) return;

    let displayData: SensorData;
    
    switch (this.currentAggregationMode) {
      case 'average':
        displayData = this.calculateAverageData(filteredData);
        break;
      case 'peak':
        displayData = this.calculatePeakData(filteredData);
        break;
      case 'trend':
        displayData = this.calculateTrendData(filteredData);
        break;
      case 'daily-aqi':
        displayData = this.calculateDailyAQI(filteredData);
        break;
      default: // 'realtime'
        displayData = filteredData[filteredData.length - 1];
        break;
    }
    
    this.updateDisplayValues(displayData);
    this.updateCharts();
    }

  private calculateAverageData(data: SensorData[]): SensorData {
    const avg = data.reduce((acc, curr) => ({
      temperature: acc.temperature + curr.temperature,
      humidity: acc.humidity + curr.humidity,
      pressure: acc.pressure + curr.pressure,
      airQuality: (acc.airQuality || 0) + (curr.airQuality || curr.ammonia || 0),
      altitude: (acc.altitude || 0) + (curr.altitude || 0)
    }), {
      temperature: 0,
      humidity: 0,
      pressure: 0,
      airQuality: 0,
      altitude: 0
    });

    const avgAirQuality = (avg.airQuality || 0) / data.length;
    const avgAltitude = (avg.altitude || 0) / data.length;
    
    return {
      temperature: avg.temperature / data.length,
      humidity: avg.humidity / data.length,
      pressure: avg.pressure / data.length,
      airQuality: avgAirQuality,
      altitude: avgAltitude,
      timestamp: new Date().toISOString()
    };
  }

  private calculatePeakData(data: SensorData[]): SensorData {
    const max = data.reduce((acc, curr) => ({
      temperature: Math.max(acc.temperature, curr.temperature),
      humidity: Math.max(acc.humidity, curr.humidity),
      pressure: Math.max(acc.pressure, curr.pressure),
      airQuality: Math.max(acc.airQuality || -Infinity, curr.airQuality || curr.ammonia || -Infinity),
      altitude: Math.max(acc.altitude || -Infinity, curr.altitude || -Infinity)
    }), {
      temperature: -Infinity,
      humidity: -Infinity,
      pressure: -Infinity,
      airQuality: -Infinity,
      altitude: -Infinity
    });

    const min = data.reduce((acc, curr) => ({
      temperature: Math.min(acc.temperature, curr.temperature),
      humidity: Math.min(acc.humidity, curr.humidity),
      pressure: Math.min(acc.pressure, curr.pressure),
      airQuality: Math.min(acc.airQuality || Infinity, curr.airQuality || curr.ammonia || Infinity),
      altitude: Math.min(acc.altitude || Infinity, curr.altitude || Infinity)
    }), {
      temperature: Infinity,
      humidity: Infinity,
      pressure: Infinity,
      airQuality: Infinity,
      altitude: Infinity
    });

    const maxAirQuality = (max.airQuality !== undefined && max.airQuality !== -Infinity) ? max.airQuality : 0;
    const minAirQuality = (min.airQuality !== undefined && min.airQuality !== Infinity) ? min.airQuality : 0;
    const maxAltitude = (max.altitude !== undefined && max.altitude !== -Infinity) ? max.altitude : 0;
    const minAltitude = (min.altitude !== undefined && min.altitude !== Infinity) ? min.altitude : 0;
    
    const avgAirQuality = (maxAirQuality + minAirQuality) / 2;
    const avgAltitude = (maxAltitude + minAltitude) / 2;

    return {
      temperature: (max.temperature + min.temperature) / 2,
      humidity: (max.humidity + min.humidity) / 2,
      pressure: (max.pressure + min.pressure) / 2,
      airQuality: avgAirQuality,
      altitude: avgAltitude,
      timestamp: new Date().toISOString()
    };
  }

  private calculateTrendData(data: SensorData[]): SensorData {
    if (data.length < 2) return data[0];
    
    const latest = data[data.length - 1];
    const previous = data[data.length - 2];
    
    // Calculate trend indicators (simple difference)
    const trend = {
      temperature: latest.temperature - previous.temperature,
      humidity: latest.humidity - previous.humidity,
      pressure: (latest.pressure || 0) - (previous.pressure || 0),
      airQuality: (latest.airQuality || latest.ammonia || 0) - (previous.airQuality || previous.ammonia || 0),
      altitude: (latest.altitude || 0) - (previous.altitude || 0)
    };

    // Return latest data with trend information
    return {
      ...latest,
      trend // Add trend info to the data
    };
  }

  private calculateDailyAQI(data: SensorData[]): SensorData {
    if (data.length === 0) {
      return {
        temperature: 0,
        humidity: 0,
        pressure: 0,
        airQuality: 0,
        timestamp: new Date().toISOString()
      };
    }

    // Group data by date
    const today = new Date().toISOString().split('T')[0];
    const todayData = data.filter(d => {
      const dataDate = new Date(d.timestamp!).toISOString().split('T')[0];
      return dataDate === today;
    });

    if (todayData.length === 0) {
      // If no data for today, use the latest available data
      const latest = data[data.length - 1];
      return {
        temperature: latest.temperature,
        humidity: latest.humidity,
        pressure: latest.pressure,
        airQuality: latest.airQuality || latest.ammonia || 0,
        altitude: latest.altitude || 0,
        timestamp: new Date().toISOString()
      };
    }

    // Calculate daily averages
    const dailyAvg = this.calculateAverageData(todayData);
    
    // Calculate AQI category and score
    const aqiScore = this.calculateAQIScore(dailyAvg.airQuality || 0);
    
    return {
      ...dailyAvg,
      aqiScore,
      aqiCategory: this.getAQICategory(aqiScore),
      timestamp: new Date().toISOString()
    };
  }

  private calculateAQIScore(airQuality: number): number {
    // Convert air quality reading to AQI score (0-500)
    // This is a simplified calculation - you may want to adjust based on your sensor
    if (airQuality <= 50) {
      return Math.round((airQuality / 50) * 50); // Good (0-50)
    } else if (airQuality <= 100) {
      return Math.round(50 + ((airQuality - 50) / 50) * 50); // Moderate (51-100)
    } else if (airQuality <= 150) {
      return Math.round(100 + ((airQuality - 100) / 50) * 50); // Unhealthy for Sensitive Groups (101-150)
    } else if (airQuality <= 200) {
      return Math.round(150 + ((airQuality - 150) / 50) * 50); // Unhealthy (151-200)
    } else if (airQuality <= 300) {
      return Math.round(200 + ((airQuality - 200) / 100) * 100); // Very Unhealthy (201-300)
    } else {
      return Math.round(300 + ((airQuality - 300) / 200) * 200); // Hazardous (301-500)
    }
  }

  private getAQICategory(aqiScore: number): string {
    if (aqiScore <= 50) return 'Good';
    if (aqiScore <= 100) return 'Moderate';
    if (aqiScore <= 150) return 'Unhealthy for Sensitive Groups';
    if (aqiScore <= 200) return 'Unhealthy';
    if (aqiScore <= 300) return 'Very Unhealthy';
    return 'Hazardous';
    }



  private getFilteredData(): SensorData[] {
    // Always return the latest up to 10 data points for display
    if (this.dataPoints.length <= this.minDataPoints) {
      return this.dataPoints;
    }
    return this.dataPoints.slice(-this.minDataPoints);
  }

  private testDataCounter(): void {
    console.log('Testing data counter...');
    console.log('Current data points:', this.dataPoints.length);
    console.log('Maximum data points limited to 10');
    
    // Add multiple test data points to see the 10-point limit
    for (let i = 0; i < 15; i++) {
    const testData: SensorData = {
        temperature: 20 + Math.random() * 15, // 20-35°C
        humidity: 40 + Math.random() * 40, // 40-80%
        pressure: 1000 + Math.random() * 50, // 1000-1050 hPa
        altitude: 80 + Math.random() * 40, // 80-120m
        airQuality: 200 + Math.random() * 600, // 200-800 ppm
        timestamp: Date.now() - (15 - i) * 60000 // Last 15 minutes
    };
    
    this.updateSensorData(testData);
    }
    
    console.log('Added test data points, final count (should be max 10):', this.dataPoints.length);
  }

  private testAirQualityAlerts(): void {
    console.log('Testing comprehensive alerts...');
    
    // Test all alert ranges
    const testCases = [
      // Temperature tests
      { temp: 22, hum: 45, press: 1013, aq: 50, desc: 'Optimal conditions' },
      { temp: 18, hum: 45, press: 1013, aq: 50, desc: 'Temperature slightly low' },
      { temp: 28, hum: 45, press: 1013, aq: 50, desc: 'Temperature slightly high' },
      { temp: 32, hum: 45, press: 1013, aq: 50, desc: 'Temperature high' },
      { temp: 38, hum: 45, press: 1013, aq: 50, desc: 'Temperature critical' },
      { temp: 8, hum: 45, press: 1013, aq: 50, desc: 'Temperature critical low' },
      
      // Humidity tests
      { temp: 22, hum: 50, press: 1013, aq: 50, desc: 'Optimal humidity' },
      { temp: 22, hum: 35, press: 1013, aq: 50, desc: 'Humidity slightly low' },
      { temp: 22, hum: 65, press: 1013, aq: 50, desc: 'Humidity slightly high' },
      { temp: 22, hum: 75, press: 1013, aq: 50, desc: 'Humidity high' },
      { temp: 22, hum: 85, press: 1013, aq: 50, desc: 'Humidity critical' },
      { temp: 22, hum: 15, press: 1013, aq: 50, desc: 'Humidity critical low' },
      
      // Air Quality tests
      { temp: 22, hum: 45, press: 1013, aq: 30, desc: 'Excellent air quality' },
      { temp: 22, hum: 45, press: 1013, aq: 75, desc: 'Good air quality' },
      { temp: 22, hum: 45, press: 1013, aq: 125, desc: 'Moderate air quality' },
      { temp: 22, hum: 45, press: 1013, aq: 175, desc: 'Poor air quality' },
      { temp: 22, hum: 45, press: 1013, aq: 250, desc: 'Very poor air quality' },
      { temp: 22, hum: 45, press: 1013, aq: 350, desc: 'Hazardous air quality' },
      
      // Pressure tests
      { temp: 22, hum: 45, press: 1000, aq: 50, desc: 'Normal pressure' },
      { temp: 22, hum: 45, press: 1030, aq: 50, desc: 'High pressure' },
      { temp: 22, hum: 45, press: 1060, aq: 50, desc: 'Very high pressure' },
      { temp: 22, hum: 45, press: 970, aq: 50, desc: 'Low pressure' },
      { temp: 22, hum: 45, press: 940, aq: 50, desc: 'Very low pressure' }
    ];
    
    testCases.forEach((testCase, index) => {
      setTimeout(() => {
        const testData: SensorData = {
          temperature: testCase.temp,
          humidity: testCase.hum,
          pressure: testCase.press,
          airQuality: testCase.aq,
          timestamp: new Date().toISOString()
        };
        console.log(`Test ${index + 1}: ${testCase.desc}`);
        this.checkAndCreateAlerts(testData);
      }, index * 2000); // 2 second delay between tests
    });
    
    console.log('Comprehensive alert tests completed');
  }

  updateSensorData(data: SensorData): void {
    try {
      // Validate sensor data
      if (!this.validateSensorData(data)) {
        console.error('Invalid sensor data received:', data);
        return;
      }
    
    // Add timestamp if not present
    if (!data.timestamp) {
      data.timestamp = new Date().toISOString();
    }

    // Add to data points
    this.dataPoints.push(data);
    
      // Limit data points to prevent memory issues
      if (this.dataPoints.length > this.maxDataPoints) {
        const removedCount = this.dataPoints.length - this.maxDataPoints;
        this.dataPoints = this.dataPoints.slice(-this.maxDataPoints);
        console.log(`Removed ${removedCount} old data points, keeping ${this.dataPoints.length} points`);
      }

    // Update display values
    this.hasReceivedRealData = true;
    this.updateDisplayValues(data);
    
    // Update charts
    this.updateCharts();
    
    // Update system status
    this.updateSystemStatus();
    
    // Update last update time
    this.updateLastUpdate();
    
    // Update real-time card values if in real-time view
    if (this.currentViewMode === 'realtime') {
      const temp = document.getElementById('realtime-temperature-value');
      const hum = document.getElementById('realtime-humidity-value');
      const airq = document.getElementById('realtime-air-quality-value');
      if (temp) temp.textContent = data.temperature.toFixed(1);
      if (hum) hum.textContent = data.humidity.toFixed(1);
      if (airq) airq.textContent = (data.airQuality || data.ammonia || 0).toFixed(0);
      // Real-time secondary values
      const sys = document.getElementById('realtime-system-status');
      const pres = document.getElementById('realtime-pressure-value');
      const alt = document.getElementById('realtime-altitude-value');
      if (sys) sys.textContent = this.dataPoints.length > 0 ? 'Online' : 'Waiting';
      if (pres) pres.textContent = data.pressure?.toFixed(1) + ' hPa';
      if (alt) alt.textContent = (data.altitude || 0).toFixed(1) + ' m';
    }
    
    } catch (error) {
      console.error('Error updating sensor data:', error);
    }
  }

  private validateSensorData(data: SensorData): boolean {
    // Check for required fields
    if (typeof data.temperature !== 'number' || isNaN(data.temperature)) {
      console.error('Invalid temperature value:', data.temperature);
      return false;
    }
    
    if (typeof data.humidity !== 'number' || isNaN(data.humidity)) {
      console.error('Invalid humidity value:', data.humidity);
      return false;
    }
    
    if (typeof data.pressure !== 'number' || isNaN(data.pressure)) {
      console.error('Invalid pressure value:', data.pressure);
      return false;
    }
    
    // Check for reasonable value ranges
    if (data.temperature < -50 || data.temperature > 100) {
      console.error('Temperature out of reasonable range:', data.temperature);
      return false;
    }
    
    if (data.humidity < 0 || data.humidity > 100) {
      console.error('Humidity out of reasonable range:', data.humidity);
      return false;
    }
    
    if (data.pressure < 800 || data.pressure > 1200) {
      console.error('Pressure out of reasonable range:', data.pressure);
      return false;
    }
    
    return true;
  }

  private updateDisplayValues(data: SensorData): void {
    const tempValueTechnical = document.getElementById('temperature-value-technical');
    const humidityValueTechnical = document.getElementById('humidity-value-technical');
    const airQualityValueTechnical = document.getElementById('air-quality-value-technical');
    const tempValueRealtime = document.getElementById('temperature-value-realtime');
    const humidityValueRealtime = document.getElementById('humidity-value-realtime');
    const airQualityValueRealtime = document.getElementById('air-quality-value-realtime');
    const pressureValue = document.getElementById('pressure-value');
    const altitudeValue = document.getElementById('altitude-value');

    if (tempValueTechnical) {
      tempValueTechnical.textContent = data.temperature.toFixed(1);
    }
    if (humidityValueTechnical) {
      humidityValueTechnical.textContent = data.humidity.toFixed(1);
    }
    if (airQualityValueTechnical) {
      // Handle both airQuality and ammonia for Arduino R4
      const airQuality = data.airQuality || data.ammonia || 0;
      
      // If we have AQI data, show it
      if (data.aqiScore !== undefined && data.aqiCategory) {
        airQualityValueTechnical.textContent = `${data.aqiScore} (${data.aqiCategory})`;
        // Add color coding based on AQI category
        airQualityValueTechnical.className = this.getAQIColorClass(data.aqiScore);
      } else {
      airQualityValueTechnical.textContent = airQuality.toFixed(0);
        airQualityValueTechnical.className = ''; // Reset to default
      }
    }
    // --- Update real-time card values always ---
    if (tempValueRealtime) {
      tempValueRealtime.textContent = data.temperature.toFixed(1);
    }
    if (humidityValueRealtime) {
      humidityValueRealtime.textContent = data.humidity.toFixed(1);
    }
    if (airQualityValueRealtime) {
      airQualityValueRealtime.textContent = (data.airQuality || data.ammonia || 0).toFixed(0);
    }
    if (pressureValue) {
      pressureValue.textContent =  `${data.pressure.toFixed(1)} `;
    }
    if (altitudeValue) {
      // Handle optional altitude field
      const altitude = data.altitude || 0;
      altitudeValue.textContent = `${altitude.toFixed(1)} m`;
    }

    // Only check alerts if real data has been received
    if (this.hasReceivedRealData) {
      this.checkAndCreateAlerts(data);
    }
  }

  private getAQIColorClass(aqiScore: number): string {
    if (aqiScore <= 50) return 'text-green-600 dark:text-green-400 font-bold';
    if (aqiScore <= 100) return 'text-yellow-600 dark:text-yellow-400 font-bold';
    if (aqiScore <= 150) return 'text-orange-600 dark:text-orange-400 font-bold';
    if (aqiScore <= 200) return 'text-red-600 dark:text-red-400 font-bold';
    if (aqiScore <= 300) return 'text-purple-600 dark:text-purple-400 font-bold';
    return 'text-red-800 dark:text-red-300 font-bold';
  }

  private checkAndCreateAlerts(data: SensorData): void {
    const alerts: Array<{type: 'good' | 'warning' | 'hazardous', sensor: string, message: string, value: number}> = [];
    
    // Temperature alerts with comprehensive ranges
    if (data.temperature >= 20 && data.temperature <= 25) {
      alerts.push({
        type: 'good',
        sensor: 'Temperature',
        message: 'Optimal temperature',
        value: data.temperature
      });
    } else if (data.temperature >= 15 && data.temperature < 20) {
      alerts.push({
        type: 'warning',
        sensor: 'Temperature',
        message: 'Temperature slightly low',
        value: data.temperature
      });
    } else if (data.temperature > 25 && data.temperature <= 30) {
      alerts.push({
        type: 'warning',
        sensor: 'Temperature',
        message: 'Temperature slightly high',
        value: data.temperature
      });
    } else if (data.temperature > 30 && data.temperature <= 35) {
      alerts.push({
        type: 'hazardous',
        sensor: 'Temperature',
        message: 'Temperature high',
        value: data.temperature
      });
    } else if (data.temperature > 35) {
      alerts.push({
        type: 'hazardous',
        sensor: 'Temperature',
        message: 'Temperature critical',
        value: data.temperature
      });
    } else if (data.temperature >= 10 && data.temperature < 15) {
      alerts.push({
        type: 'hazardous',
        sensor: 'Temperature',
        message: 'Temperature low',
        value: data.temperature
      });
    } else if (data.temperature < 10) {
      alerts.push({
        type: 'hazardous',
        sensor: 'Temperature',
        message: 'Temperature critical low',
        value: data.temperature
      });
    }
    
    // Humidity alerts with comprehensive ranges
    if (data.humidity >= 40 && data.humidity <= 60) {
      alerts.push({
        type: 'good',
        sensor: 'Humidity',
        message: 'Optimal humidity',
        value: data.humidity
      });
    } else if (data.humidity >= 30 && data.humidity < 40) {
      alerts.push({
        type: 'warning',
        sensor: 'Humidity',
        message: 'Humidity slightly low',
        value: data.humidity
      });
    } else if (data.humidity > 60 && data.humidity <= 70) {
      alerts.push({
        type: 'warning',
        sensor: 'Humidity',
        message: 'Humidity slightly high',
        value: data.humidity
      });
    } else if (data.humidity > 70 && data.humidity <= 80) {
      alerts.push({
        type: 'hazardous',
        sensor: 'Humidity',
        message: 'Humidity high',
        value: data.humidity
      });
    } else if (data.humidity > 80) {
      alerts.push({
        type: 'hazardous',
        sensor: 'Humidity',
        message: 'Humidity critical',
        value: data.humidity
      });
    } else if (data.humidity >= 20 && data.humidity < 30) {
      alerts.push({
        type: 'hazardous',
        sensor: 'Humidity',
        message: 'Humidity low',
        value: data.humidity
      });
    } else if (data.humidity < 20) {
      alerts.push({
        type: 'hazardous',
        sensor: 'Humidity',
        message: 'Humidity critical low',
        value: data.humidity
      });
    }
    
    // Air Quality alerts with comprehensive ranges
    const airQuality = data.airQuality || data.ammonia || 0;
    
    if (airQuality <= 50) {
      alerts.push({
        type: 'good',
        sensor: 'Air Quality',
        message: 'Excellent air quality',
        value: airQuality
      });
    } else if (airQuality > 50 && airQuality <= 100) {
      alerts.push({
        type: 'good',
        sensor: 'Air Quality',
        message: 'Good air quality',
        value: airQuality
      });
    } else if (airQuality > 100 && airQuality <= 150) {
      alerts.push({
        type: 'warning',
        sensor: 'Air Quality',
        message: 'Moderate air quality',
        value: airQuality
      });
    } else if (airQuality > 150 && airQuality <= 200) {
      alerts.push({
        type: 'hazardous',
        sensor: 'Air Quality',
        message: 'Poor air quality',
        value: airQuality
      });
    } else if (airQuality > 200 && airQuality <= 300) {
      alerts.push({
        type: 'hazardous',
        sensor: 'Air Quality',
        message: 'Very poor air quality',
        value: airQuality
      });
    } else if (airQuality > 300) {
      alerts.push({
        type: 'hazardous',
        sensor: 'Air Quality',
        message: 'Hazardous air quality',
        value: airQuality
      });
    }
    
    // Pressure alerts (if available)
    if (data.pressure) {
      if (data.pressure >= 980 && data.pressure <= 1020) {
        alerts.push({
          type: 'good',
          sensor: 'Pressure',
          message: 'Normal pressure',
          value: data.pressure
        });
      } else if (data.pressure > 1020 && data.pressure <= 1050) {
        alerts.push({
          type: 'warning',
          sensor: 'Pressure',
          message: 'High pressure',
          value: data.pressure
        });
      } else if (data.pressure > 1050) {
        alerts.push({
          type: 'hazardous',
          sensor: 'Pressure',
          message: 'Very high pressure',
          value: data.pressure
        });
      } else if (data.pressure >= 950 && data.pressure < 980) {
        alerts.push({
          type: 'warning',
          sensor: 'Pressure',
          message: 'Low pressure',
          value: data.pressure
        });
      } else if (data.pressure < 950) {
        alerts.push({
          type: 'hazardous',
          sensor: 'Pressure',
          message: 'Very low pressure',
          value: data.pressure
        });
      }
    }
    
    // Create individual alert indicators
    alerts.forEach(alert => {
      this.createAlert(alert.type, alert.sensor, alert.message, alert.value);
    });
    
    // Show aggregated notification if there are alerts
    if (alerts.length > 0) {
      this.showAggregatedNotification(alerts);
    }
  }

  private createAlert(type: 'good' | 'warning' | 'hazardous', sensor: string, message: string, value: number): void {
    try {
      console.log('Creating alert:', type, sensor, message, value);
      // Use view-specific alert container IDs
      const viewSuffix = this.currentViewMode === 'technical' ? '-technical' : '-realtime';
      const sensorAlertMap: { [key: string]: string } = {
        'Temperature': `temperature-alert${viewSuffix}`,
        'Humidity': `humidity-alert${viewSuffix}`,
        'Air Quality': `air-quality-alert${viewSuffix}`,
        'Pressure': `pressure-alert${viewSuffix}`
      };
      const alertContainerId = sensorAlertMap[sensor];
      console.log('Alert container ID:', alertContainerId);
      if (!alertContainerId) {
        console.error('No alert container ID found for sensor:', sensor);
        return;
      }
      const alertContainer = document.getElementById(alertContainerId);
      console.log('Alert container found:', alertContainer);
      if (!alertContainer) {
        console.error('Alert container not found:', alertContainerId);
        return;
      }
      
      const alertElement = document.createElement('div');
      alertElement.className = `flex items-center space-x-1 px-2 py-1 rounded-lg border-l-2 transition-all duration-300 text-xs max-w-20 ${
        type === 'good' 
          ? 'bg-green-50 dark:bg-green-900/20 border-green-400 text-green-800 dark:text-green-200' 
          : type === 'warning'
          ? 'bg-yellow-50 dark:bg-yellow-900/20 border-yellow-400 text-yellow-800 dark:text-yellow-200'
          : 'bg-red-50 dark:bg-red-900/20 border-red-400 text-red-800 dark:text-red-200'
      }`;
      alertElement.setAttribute('data-alert', `${sensor}-${type}`);
      
      const icon = type === 'good' ? '✅' : type === 'warning' ? '⚠️' : '🚨';
      
      alertElement.innerHTML = `
        <div class="text-xs">${icon}</div>
        <div class="text-xs font-medium truncate">${type === 'good' ? 'Good' : type === 'warning' ? 'Warning' : 'Alert'}</div>
      `;
      
      // Clear any existing alerts for this sensor and add the new one
      alertContainer.innerHTML = '';
      alertContainer.appendChild(alertElement);
      
      // Auto-remove good alerts after 30 seconds, warning alerts after 1 minute, hazardous alerts after 2 minutes
      const removeTimeout = setTimeout(() => {
        if (alertElement.parentNode) {
          alertElement.style.opacity = '0.5';
          setTimeout(() => {
            if (alertElement.parentNode) {
              alertElement.remove();
            }
          }, 1000);
        }
      }, type === 'good' ? 30000 : type === 'warning' ? 60000 : 120000);
      
      // Store timeout reference for cleanup
      (alertElement as any)._removeTimeout = removeTimeout;
      
      // Play sound for warning and hazardous alerts
      if (type === 'warning' || type === 'hazardous') {
        this.playAlertSound();
      }
      
      // Note: Individual notifications are now handled by aggregated notifications
      // to reduce notification spam when multiple alerts occur simultaneously
      
    } catch (error) {
      console.error('Error creating alert:', error);
    }
  }

  private getSensorUnit(sensor: string): string {
    switch (sensor) {
      case 'Temperature': return '°C';
      case 'Humidity': return '%';
      case 'Air Quality': return 'ppm';
      case 'Pressure': return 'hPa';
      default: return '';
    }
  }

  private playAlertSound(): void {
    const alertSound = document.getElementById('alert-sound') as HTMLAudioElement;
    if (alertSound) {
      alertSound.volume = 0.3;
      alertSound.play().catch(e => console.log('Could not play alert sound:', e));
    }
  }

  private showNotification(type: 'good' | 'warning' | 'hazardous', sensor: string, message: string, value: number): void {
    try {
      // Create notification element
      const notification = document.createElement('div');
      notification.className = `fixed top-4 left-4 right-4 sm:left-auto sm:right-4 z-50 p-4 rounded-xl shadow-2xl transform transition-all duration-300 translate-x-full max-w-sm sm:max-w-md ${
        type === 'good' 
          ? 'bg-green-500 text-white border border-green-400' 
          : type === 'warning'
          ? 'bg-yellow-500 text-white border border-yellow-400'
          : 'bg-red-500 text-white border border-red-400'
      }`;
      const icon = type === 'good' ? '✅' : type === 'warning' ? '⚠️' : '🚨';
      const title = type === 'good' ? 'Good Condition' : type === 'warning' ? 'Warning' : 'Alert';
      notification.innerHTML = `
        <div class="flex items-start space-x-3">
          <div class="flex-shrink-0">
            <div class="text-2xl">${icon}</div>
          </div>
          <div class="flex-1 min-w-0">
            <div class="flex items-center justify-between">
              <h4 class="text-sm font-semibold">${title}</h4>
              <button class="notification-close-btn text-white hover:text-gray-200 transition-colors p-1 rounded">
                <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12"></path>
                </svg>
              </button>
            </div>
            <p class="text-sm font-medium mt-1">${sensor}</p>
            <p class="text-xs mt-1 opacity-90">${message}</p>
            <p class="text-xs mt-1 font-bold">Value: ${value}${this.getSensorUnit(sensor)}</p>
            <p class="text-xs mt-1 opacity-75">${new Date().toLocaleTimeString()}</p>
          </div>
        </div>
      `;
      // Add to page
      document.body.appendChild(notification);
      // Add close event listener
      const closeBtn = notification.querySelector('.notification-close-btn');
      if (closeBtn) {
        closeBtn.addEventListener('click', () => {
          notification.classList.add('translate-x-full');
          setTimeout(() => {
            if (notification.parentNode) {
              notification.parentNode.removeChild(notification);
            }
          }, 300);
        });
      }
      // Animate in
      setTimeout(() => {
        notification.classList.remove('translate-x-full');
      }, 100);
      // Auto-remove after timeout
      const timeout = type === 'good' ? 5000 : type === 'warning' ? 8000 : 10000;
      setTimeout(() => {
        notification.classList.add('translate-x-full');
        setTimeout(() => {
          if (notification.parentNode) {
            notification.parentNode.removeChild(notification);
          }
        }, 300);
      }, timeout);
    } catch (error) {
      console.error('Error showing notification:', error);
    }
  }

  private showAggregatedNotification(alerts: Array<{type: 'good' | 'warning' | 'hazardous', sensor: string, message: string, value: number}>): void {
    try {
      // Throttle notifications to prevent spam
      const now = Date.now();
      if (now - this.lastNotificationTime < this.notificationThrottleMs) {
        console.log('Notification throttled - too soon since last notification');
        return;
      }
      this.lastNotificationTime = now;
      // Group alerts by type
      const goodAlerts = alerts.filter(a => a.type === 'good');
      const warningAlerts = alerts.filter(a => a.type === 'warning');
      const hazardousAlerts = alerts.filter(a => a.type === 'hazardous');
      
      // Determine overall alert level (hazardous > warning > good)
      let overallType: 'good' | 'warning' | 'hazardous' = 'good';
      let overallMessage = '';
      
      if (hazardousAlerts.length > 0) {
        overallType = 'hazardous';
        overallMessage = `${hazardousAlerts.length} critical condition${hazardousAlerts.length > 1 ? 's' : ''}`;
      } else if (warningAlerts.length > 0) {
        overallType = 'warning';
        overallMessage = `${warningAlerts.length} warning${warningAlerts.length > 1 ? 's' : ''}`;
      } else if (goodAlerts.length > 0) {
        overallType = 'good';
        overallMessage = `${goodAlerts.length} good condition${goodAlerts.length > 1 ? 's' : ''}`;
      }
      
      // Create aggregated notification
      const notification = document.createElement('div');
      notification.className = `fixed top-4 left-4 right-4 sm:left-auto sm:right-4 z-50 p-4 rounded-xl shadow-2xl transform transition-all duration-300 translate-x-full max-w-sm sm:max-w-md ${
        overallType === 'good' 
          ? 'bg-green-500 text-white border border-green-400' 
          : overallType === 'warning'
          ? 'bg-yellow-500 text-white border border-yellow-400'
          : 'bg-red-500 text-white border border-red-400'
      }`;
      
      const icon = overallType === 'good' ? '✅' : overallType === 'warning' ? '⚠️' : '🚨';
      const title = overallType === 'good' ? 'System Status' : overallType === 'warning' ? 'System Warnings' : 'System Alerts';
      
      // Build detailed content
      let content = '';
      if (hazardousAlerts.length > 0) {
        content += `<div class="mb-2"><span class="font-semibold">🚨 Critical:</span> ${hazardousAlerts.map(a => `${a.sensor} (${a.value}${this.getSensorUnit(a.sensor)})`).join(', ')}</div>`;
      }
      if (warningAlerts.length > 0) {
        content += `<div class="mb-2"><span class="font-semibold">⚠️ Warnings:</span> ${warningAlerts.map(a => `${a.sensor} (${a.value}${this.getSensorUnit(a.sensor)})`).join(', ')}</div>`;
      }
      if (goodAlerts.length > 0) {
        content += `<div class="mb-2"><span class="font-semibold">✅ Good:</span> ${goodAlerts.map(a => `${a.sensor} (${a.value}${this.getSensorUnit(a.sensor)})`).join(', ')}</div>`;
      }
      
      notification.innerHTML = `
        <div class="flex items-start space-x-3">
          <div class="flex-shrink-0">
            <div class="text-2xl">${icon}</div>
          </div>
          <div class="flex-1 min-w-0">
            <div class="flex items-center justify-between">
              <h4 class="text-sm font-semibold">${title}</h4>
              <button class="notification-close-btn text-white hover:text-gray-200 transition-colors p-1 rounded">
                <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12"></path>
                </svg>
              </button>
            </div>
            <p class="text-sm font-medium mt-1">${overallMessage}</p>
            <div class="text-xs mt-2 space-y-1">
              ${content}
            </div>
            <p class="text-xs mt-2 opacity-75">${new Date().toLocaleTimeString()}</p>
          </div>
        </div>
      `;
      
      // Remove any existing notifications first
      const existingNotifications = document.querySelectorAll('.fixed.top-4.z-50');
      existingNotifications.forEach(notif => notif.remove());
      
      // Add to page
      document.body.appendChild(notification);
      
      // Add close event listener
      const closeBtn = notification.querySelector('.notification-close-btn');
      if (closeBtn) {
        closeBtn.addEventListener('click', () => {
          notification.classList.add('translate-x-full');
          setTimeout(() => {
            if (notification.parentNode) {
              notification.parentNode.removeChild(notification);
            }
          }, 300);
        });
      }
      // Animate in
      setTimeout(() => {
        notification.classList.remove('translate-x-full');
      }, 100);
      // Auto-remove after timeout
      const timeout = overallType === 'good' ? 6000 : overallType === 'warning' ? 8000 : 10000;
      setTimeout(() => {
        notification.classList.add('translate-x-full');
        setTimeout(() => {
          if (notification.parentNode) {
            notification.parentNode.removeChild(notification);
          }
        }, 300);
      }, timeout);
      
      // Show browser notification for aggregated alerts
      if (overallType === 'warning' || overallType === 'hazardous') {
        this.showAggregatedBrowserNotification(overallType, alerts);
      }
      
    } catch (error) {
      console.error('Error showing aggregated notification:', error);
    }
  }

    private showBrowserNotification(type: 'warning' | 'hazardous', sensor: string, message: string, value: number): void {
      try {
        // Check if browser notifications are supported
        if (!('Notification' in window)) {
          console.log('Browser notifications not supported');
          return;
        }
        
        // Check if permission is granted
        if (Notification.permission === 'granted') {
          const title = type === 'warning' ? '⚠️ Warning' : '🚨 Alert';
          const body = `${sensor}: ${message} (${value}${this.getSensorUnit(sensor)})`;
          
          new Notification(title, {
            body: body,
            icon: '/favicon.ico',
            badge: '/favicon.ico',
            tag: `${sensor}-${type}`,
            requireInteraction: type === 'hazardous',
            silent: false
          });
        } else if (Notification.permission === 'default') {
          // Request permission
          Notification.requestPermission().then(permission => {
            if (permission === 'granted') {
              this.showBrowserNotification(type, sensor, message, value);
            }
          });
        }
        
          } catch (error) {
      console.error('Error showing browser notification:', error);
    }
  }

  private showAggregatedBrowserNotification(type: 'warning' | 'hazardous', alerts: Array<{type: 'good' | 'warning' | 'hazardous', sensor: string, message: string, value: number}>): void {
    try {
      // Check if browser notifications are supported
      if (!('Notification' in window)) {
        console.log('Browser notifications not supported');
        return;
      }
      
      // Check if permission is granted
      if (Notification.permission === 'granted') {
        const title = type === 'warning' ? '⚠️ Multiple Warnings' : '🚨 Multiple Alerts';
        
        // Group alerts by type for cleaner message
        const warningAlerts = alerts.filter(a => a.type === 'warning');
        const hazardousAlerts = alerts.filter(a => a.type === 'hazardous');
        
        let body = '';
        if (hazardousAlerts.length > 0) {
          body += `Critical: ${hazardousAlerts.map(a => `${a.sensor} (${a.value}${this.getSensorUnit(a.sensor)})`).join(', ')}`;
        }
        if (warningAlerts.length > 0) {
          if (body) body += '\n';
          body += `Warnings: ${warningAlerts.map(a => `${a.sensor} (${a.value}${this.getSensorUnit(a.sensor)})`).join(', ')}`;
        }
        
        new Notification(title, {
          body: body,
          icon: '/favicon.ico',
          badge: '/favicon.ico',
          tag: `aggregated-${type}`,
          requireInteraction: type === 'hazardous',
          silent: false
        });
      } else if (Notification.permission === 'default') {
        // Request permission
        Notification.requestPermission().then(permission => {
          if (permission === 'granted') {
            this.showAggregatedBrowserNotification(type, alerts);
          }
        });
      }
      
    } catch (error) {
      console.error('Error showing aggregated browser notification:', error);
    }
  }

  private requestNotificationPermission(): void {
    try {
      // Check if browser notifications are supported
      if (!('Notification' in window)) {
        console.log('Browser notifications not supported');
        return;
      }
      
      // Request permission if not already granted
      if (Notification.permission === 'default') {
        Notification.requestPermission().then(permission => {
          if (permission === 'granted') {
            console.log('Notification permission granted');
            // Show a test notification
            new Notification('🔔 Notifications Enabled', {
              body: 'You will now receive alerts for sensor warnings and critical conditions.',
              icon: '/favicon.ico',
              silent: true
            });
          } else {
            console.log('Notification permission denied');
          }
        });
      }
      
    } catch (error) {
      console.error('Error requesting notification permission:', error);
    }
  }

  private toggleNotificationPermission(): void {
    try {
      // Check if browser notifications are supported
      if (!('Notification' in window)) {
        alert('Browser notifications are not supported in this browser.');
        return;
      }
      
      if (Notification.permission === 'granted') {
        // If already granted, show current status
        alert('Notifications are already enabled. You will receive alerts for warnings and critical conditions.');
      } else if (Notification.permission === 'denied') {
        // If denied, show instructions
        alert('Notifications are currently disabled. Please enable them in your browser settings to receive alerts.');
      } else {
        // Request permission
        Notification.requestPermission().then(permission => {
          if (permission === 'granted') {
            alert('Notifications enabled! You will now receive alerts for sensor warnings and critical conditions.');
            this.updateNotificationStatus();
          } else {
            alert('Notification permission denied. You can enable them later in your browser settings.');
          }
        });
      }
      
    } catch (error) {
      console.error('Error toggling notification permission:', error);
    }
  }

  private updateNotificationStatus(): void {
    const statusText = document.getElementById('notification-status-text');
    if (statusText) {
      if (Notification.permission === 'granted') {
        statusText.textContent = 'Notifications Enabled';
      } else if (Notification.permission === 'denied') {
        statusText.textContent = 'Notifications Disabled';
      } else {
        statusText.textContent = 'Enable Notifications';
      }
    }
  }

  private clearAllAlerts(): void {
    // Clear alerts from all sensor alert containers
    const alertContainers = ['temperature-alert', 'humidity-alert', 'air-quality-alert', 'pressure-alert'];
    
    alertContainers.forEach(containerId => {
      const container = document.getElementById(containerId);
      if (container) {
        container.innerHTML = '';
      }
    });
  }

  private updateCharts(): void {
    try {
    const filteredData = this.getFilteredData();
      
      if (filteredData.length === 0) {
        console.log('No data to display on charts');
        return;
      }
    
    const labels = filteredData.map((_, index) => {
      const time = new Date(filteredData[index].timestamp!);
      return time.toLocaleString('en-US', { 
        hour: '2-digit',
        minute: '2-digit',
        hour12: true
      });
    });

    const temperatureData = filteredData.map(d => d.temperature);
    const humidityData = filteredData.map(d => d.humidity);
    const airQualityData = filteredData.map(d => d.airQuality || d.ammonia || 0);

    // Update temperature chart
    if (this.temperatureChart) {
      this.temperatureChart.data.labels = labels;
      this.temperatureChart.data.datasets[0].data = temperatureData;
      this.temperatureChart.update('none');
    }

    // Update humidity chart
    if (this.humidityChart) {
      this.humidityChart.data.labels = labels;
      this.humidityChart.data.datasets[0].data = humidityData;
      this.humidityChart.update('none');
    }

    // Update air quality chart
    if (this.airQualityChart) {
      this.airQualityChart.data.labels = labels;
      this.airQualityChart.data.datasets[0].data = airQualityData;
      this.airQualityChart.update('none');
    }

      // Auto-scroll to latest data and ensure charts show the most recent data
      this.ensureLatestDataVisible();
      
    } catch (error) {
      console.error('Error updating charts:', error);
    }
  }

  private ensureLatestDataVisible(): void {
    // Auto-scroll to latest data
    const chartContainer = document.getElementById('temperature-chart')?.parentElement;
    if (chartContainer) {
      chartContainer.scrollLeft = chartContainer.scrollWidth;
    }
    
    // Ensure charts are focused on the latest data by resetting zoom if needed
    const filteredData = this.getFilteredData();
    if (filteredData.length > this.minDataPoints) {
      // If we have more than minDataPoints, ensure the chart shows the latest data
      // by resetting zoom to show the most recent data points
      setTimeout(() => {
        this.resetZoom();
      }, 100);
    }
  }

  private updateSystemStatus(): void {
    const statusElement = document.getElementById('connection-status');
    const dataPointsElement = document.getElementById('data-points');
    const lastUpdateElement = document.getElementById('last-update');
    const bleStatus = document.getElementById('ble-status');
    const bleStatusMobile = document.getElementById('ble-status-mobile');
    const filteredData = this.getFilteredData();

    console.log('Updating system status, filtered data points count:', filteredData.length);

    if (statusElement) {
      if (this.dataPoints.length > 0) {
        statusElement.innerHTML = `
          <span class="w-1 h-1 bg-green-400 rounded-full mr-1"></span>
          Online
        `;
        statusElement.className = 'inline-flex items-center px-1.5 py-0.5 rounded-full text-xs font-semibold bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-200';
        console.log('Status set to Online');
      } else {
        statusElement.innerHTML = `
          <span class="w-1 h-1 bg-yellow-400 rounded-full mr-1"></span>
          Waiting
        `;
        statusElement.className = 'inline-flex items-center px-1.5 py-0.5 rounded-full text-xs font-semibold bg-yellow-100 text-yellow-800 dark:bg-yellow-900/30 dark:text-yellow-200';
        console.log('Status set to Waiting');
      }
    }

    if (dataPointsElement) {
      const newValue = filteredData.length.toString();
      dataPointsElement.textContent = newValue;
      console.log('Data points element updated to:', newValue);
      
      // Force a re-render by temporarily changing the content
      dataPointsElement.style.opacity = '0.8';
      setTimeout(() => {
        dataPointsElement.style.opacity = '1';
      }, 100);
    } else {
      console.error('Data points element not found!');
    }

    // Update desktop BLE status
    if (bleStatus) {
      if (this.dataPoints.length > 0) {
        bleStatus.innerHTML = `
          <span class="w-1.5 h-1.5 bg-green-400 rounded-full mr-1.5"></span>
          Connected
        `;
        bleStatus.className = 'inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-200';
      } else {
        bleStatus.innerHTML = `
          <span class="w-1.5 h-1.5 bg-gray-400 rounded-full mr-1.5"></span>
          Disconnected
        `;
        bleStatus.className = 'inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-gray-100 text-gray-800 dark:bg-gray-700 dark:text-gray-200';
      }
    }

    // Update mobile BLE status
    if (bleStatusMobile) {
      if (this.dataPoints.length > 0) {
        bleStatusMobile.innerHTML = `
          <span class="w-1.5 h-1.5 bg-green-400 rounded-full mr-1"></span>
          Connected
        `;
        bleStatusMobile.className = 'inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-200';
      } else {
        bleStatusMobile.innerHTML = `
          <span class="w-1.5 h-1.5 bg-gray-400 rounded-full mr-1"></span>
          Disconnected
        `;
        bleStatusMobile.className = 'inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-gray-100 text-gray-800 dark:bg-gray-700 dark:text-gray-200';
      }
    }

    if (lastUpdateElement) {
      if (filteredData.length > 0) {
        const lastData = filteredData[filteredData.length - 1];
        const lastUpdate = new Date(lastData.timestamp!);
        lastUpdateElement.textContent = lastUpdate.toLocaleString('en-US', { 
          month: '2-digit',
          day: '2-digit',
          hour: '2-digit', 
          minute: '2-digit',
          hour12: true
        });
        console.log('Last update time set to:', lastUpdateElement.textContent);
      } else {
        lastUpdateElement.textContent = '--';
        console.log('Last update time set to: --');
      }
    }
  }

  private updateLastUpdate(): void {
    const lastUpdateElement = document.getElementById('last-update');
    if (lastUpdateElement) {
      const now = new Date();
      lastUpdateElement.textContent = now.toLocaleTimeString('en-US', {
        hour: '2-digit',
        minute: '2-digit',
        hour12: true
      });
    }
  }

  private exportData(): void {
    try {
    if (this.dataPoints.length === 0) {
      alert('No data to export');
      return;
    }

    const csvContent = this.convertToCSV(this.dataPoints);
    const blob = new Blob([csvContent], { type: 'text/csv' });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `sensor-data-${new Date().toISOString().split('T')[0]}.csv`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    window.URL.revokeObjectURL(url);
      
    } catch (error) {
      console.error('Error exporting data:', error);
      alert('Failed to export data. Please try again.');
    }
  }

  private convertToCSV(data: SensorData[]): string {
    const headers = ['Timestamp', 'Temperature (°C)', 'Humidity (%)', 'Pressure (hPa)', 'Altitude (m)', 'Air Quality (ppm)'];
    const rows = data.map(d => [
      this.formatTimestamp(d.timestamp),
      d.temperature.toFixed(2),
      d.humidity.toFixed(2),
      (d.pressure || 0).toFixed(2),
      (d.altitude || 0).toFixed(2),
      (d.airQuality || 0).toFixed(0)
    ]);
    
    return [headers, ...rows].map(row => row.join(',')).join('\n');
  }

  private formatTimestamp(timestamp: string | number | undefined): string {
    if (!timestamp) return '--';
    
    const date = new Date(timestamp);
    return date.toLocaleString('en-US', {
      month: '2-digit',
      day: '2-digit',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
      hour12: false
    });
  }

  private clearData(): void {
    // Show a more detailed confirmation dialog
    const confirmed = confirm(
      '⚠️ Clear All Data?\n\n' +
      'This will permanently delete all sensor data and reset the dashboard.\n' +
      'This action cannot be undone.\n\n' +
      'Click OK to continue or Cancel to keep your data.'
    );
    
    if (confirmed) {
      // Clear the data
      this.dataPoints = [];
      this.updateCharts();
      this.updateSystemStatus();
      this.showWaitingState();
      
      // Show success message
      this.showClearSuccessMessage();
    }
  }

  private showClearSuccessMessage(): void {
    // Create a temporary success message
    const message = document.createElement('div');
    message.className = 'fixed top-4 right-4 z-50 p-4 rounded-xl shadow-2xl transform transition-all duration-300 translate-x-full bg-green-500 text-white';
    message.innerHTML = `
      <div class="flex items-center space-x-2">
        <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 13l4 4L19 7"></path>
        </svg>
        <span class="font-semibold">Data cleared successfully!</span>
      </div>
    `;
    
    document.body.appendChild(message);
    
    // Animate in
    setTimeout(() => {
      message.classList.remove('translate-x-full');
    }, 100);
    
    // Remove after 3 seconds
    setTimeout(() => {
      message.classList.add('translate-x-full');
      setTimeout(() => {
        document.body.removeChild(message);
      }, 300);
    }, 3000);
  }

  private showWaitingState(): void {
    this.updateDisplayValues({
      temperature: 0,
      humidity: 0,
      pressure: 0,
      timestamp: new Date().toISOString()
    });
    
    // Update status to show waiting for connection
    const statusElement = document.getElementById('connection-status');
    if (statusElement) {
      statusElement.innerHTML = `
        <span class="w-1 h-1 bg-yellow-400 rounded-full mr-1"></span>
        Waiting 
      `;
      statusElement.className = 'inline-flex items-center px-1.5 py-0.5 rounded-full text-xs font-semibold bg-yellow-100 text-yellow-800 dark:bg-yellow-900/30 dark:text-yellow-200';
    }
  }

  handleResize(): void {
    try {
      // Debounce resize events to prevent excessive chart recreation
      if (this.resizeTimeout) {
        clearTimeout(this.resizeTimeout);
      }
      
      this.resizeTimeout = setTimeout(() => {
    // Resize charts when window is resized
    if (this.temperatureChart) {
      this.temperatureChart.resize();
    }
    if (this.humidityChart) {
      this.humidityChart.resize();
    }
    if (this.airQualityChart) {
      this.airQualityChart.resize();
        }
      }, 250); // 250ms debounce
      
    } catch (error) {
      console.error('Error handling resize:', error);
    }
  }

  private resizeTimeout: NodeJS.Timeout | null = null;

  updateTheme(): void {
    // Update chart colors based on theme
    const isDark = document.documentElement.classList.contains('dark');
    const textColor = isDark ? '#F3F4F6' : '#374151';
    const gridColor = isDark ? 'rgba(156, 163, 175, 0.1)' : 'rgba(156, 163, 175, 0.1)';

    const charts = [this.temperatureChart, this.humidityChart, this.airQualityChart];
    charts.forEach(chart => {
      if (chart) {
        chart.options.scales!.x!.ticks!.color = textColor;
        chart.options.scales!.y!.ticks!.color = textColor;
        chart.options.scales!.x!.grid!.color = gridColor;
        chart.options.scales!.y!.grid!.color = gridColor;
        chart.update('none');
      }
    });
  }

  // Add a public method to reset zoom for all charts
  public resetZoom(): void {
    if (this.temperatureChart) this.temperatureChart.resetZoom();
    if (this.humidityChart) this.humidityChart.resetZoom();
    if (this.airQualityChart) this.airQualityChart.resetZoom();
  }

  private setViewMode(mode: string): void {
    this.currentViewMode = mode;
    this.updateViewModeUI();
    this.applyViewMode();
  }

  private updateViewModeUI(): void {
    const technicalBtn = document.getElementById('view-mode-technical');
    const realtimeBtn = document.getElementById('view-mode-compact');
    const viewModeSelect = document.getElementById('view-mode-select') as HTMLSelectElement;

    if (this.currentViewMode === 'technical') {
      // Update desktop buttons
      if (technicalBtn) {
        technicalBtn.className = 'view-mode-btn px-4 py-2 rounded-md text-sm font-medium transition-all duration-200 bg-blue-600 text-white shadow-sm';
      }
      if (realtimeBtn) {
        realtimeBtn.className = 'view-mode-btn px-4 py-2 rounded-md text-sm font-medium transition-all duration-200 text-gray-700 dark:text-gray-300 hover:text-gray-900 dark:hover:text-white';
      }
      // Update mobile dropdown
      if (viewModeSelect) {
        viewModeSelect.value = 'technical';
      }
    } else {
      // Update desktop buttons
      if (technicalBtn) {
        technicalBtn.className = 'view-mode-btn px-4 py-2 rounded-md text-sm font-medium transition-all duration-200 text-gray-700 dark:text-gray-300 hover:text-gray-900 dark:hover:text-white';
      }
      if (realtimeBtn) {
        realtimeBtn.className = 'view-mode-btn px-4 py-2 rounded-md text-sm font-medium transition-all duration-200 bg-blue-600 text-white shadow-sm';
      }
      // Update mobile dropdown
      if (viewModeSelect) {
        viewModeSelect.value = 'realtime';
      }
    }
  }

  private applyViewMode(): void {
    // Show/hide technical and real-time cards/rows
    const technicalCards = document.getElementById('technical-cards');
    const realtimeCards = document.getElementById('realtime-cards');
    const technicalSecondary = document.getElementById('technical-secondary-row');
    const realtimeSecondary = document.getElementById('realtime-secondary-row');
    const realtimeActions = document.getElementById('realtime-actions-row');
    const technicalActions = document.querySelector('.flex.justify-center'); // first actions row
    if (this.currentViewMode === 'technical') {
      if (technicalCards) technicalCards.style.display = '';
      if (realtimeCards) realtimeCards.style.display = 'none';
      if (technicalSecondary) technicalSecondary.style.display = '';
      if (realtimeSecondary) realtimeSecondary.style.display = 'none';
      if (technicalActions) (technicalActions as HTMLElement).style.display = '';
      if (realtimeActions) realtimeActions.style.display = 'none';
    } else {
      if (technicalCards) technicalCards.style.display = 'none';
      if (realtimeCards) realtimeCards.style.display = '';
      if (technicalSecondary) technicalSecondary.style.display = 'none';
      if (realtimeSecondary) realtimeSecondary.style.display = '';
      if (technicalActions) (technicalActions as HTMLElement).style.display = 'none';
      if (realtimeActions) realtimeActions.style.display = '';
      // Update real-time card values with latest data
      const latest = this.dataPoints.length > 0 ? this.dataPoints[this.dataPoints.length - 1] : null;
      if (latest) {
        const temp = document.getElementById('realtime-temperature-value');
        const hum = document.getElementById('realtime-humidity-value');
        const airq = document.getElementById('realtime-air-quality-value');
        if (temp) temp.textContent = latest.temperature.toFixed(1);
        if (hum) hum.textContent = latest.humidity.toFixed(1);
        if (airq) airq.textContent = (latest.airQuality || latest.ammonia || 0).toFixed(0);
        // Real-time secondary values
        const sys = document.getElementById('realtime-system-status');
        const pres = document.getElementById('realtime-pressure-value');
        const alt = document.getElementById('realtime-altitude-value');
        if (sys) sys.textContent = this.dataPoints.length > 0 ? 'Online' : 'Waiting';
        if (pres) pres.textContent = latest.pressure?.toFixed(1) + ' hPa';
        if (alt) alt.textContent = (latest.altitude || 0).toFixed(1) + ' m';
      }
      // Wire up real-time actions
      const exportBtn = document.getElementById('realtime-export-data');
      const clearBtn = document.getElementById('realtime-clear-data');
      if (exportBtn) exportBtn.onclick = () => this.exportData();
      if (clearBtn) clearBtn.onclick = () => this.clearData();
    }
    // Show/hide chart canvases based on view mode
    document.querySelectorAll('[id$="-chart"]').forEach(canvas => {
      (canvas as HTMLElement).style.display = this.currentViewMode === 'technical' ? '' : 'none';
    });

    // Show/hide environment, pressure, and altitude cards based on view mode
    const environmentCard = document.getElementById('environment-card');
    const pressureCard = document.getElementById('pressure-card');
    const altitudeCard = document.getElementById('altitude-card');
    if (this.currentViewMode === 'technical') {
      if (environmentCard) environmentCard.style.display = '';
      if (pressureCard) pressureCard.style.display = 'none';
      if (altitudeCard) altitudeCard.style.display = 'none';
    } else {
      if (environmentCard) environmentCard.style.display = 'none';
      if (pressureCard) pressureCard.style.display = '';
      if (altitudeCard) altitudeCard.style.display = '';
    }

    // System status and actions
    const systemStatusCard = (() => {
      const el = document.querySelector('[id="connection-status"]');
      return el ? (el.closest('.bg-gray-50') || el.closest('.dark\\:bg-gray-800')) : null;
    })();
    const actionsCard = (() => {
      const el = document.getElementById('export-data');
      return el ? (el.closest('.bg-gray-50') || el.closest('.dark\\:bg-gray-800')) : null;
    })();

    // All primary sensor cards
    const tempCard = (() => {
      const el = document.getElementById('temperature-value');
      return el ? (el.closest('.bg-gray-50') || el.closest('.dark\\:bg-gray-800')) : null;
    })();
    const humidityCard = (() => {
      const el = document.getElementById('humidity-value');
      return el ? (el.closest('.bg-gray-50') || el.closest('.dark\\:bg-gray-800')) : null;
    })();
    const airQualityCard = (() => {
      const el = document.getElementById('air-quality-value');
      return el ? (el.closest('.bg-gray-50') || el.closest('.dark\\:bg-gray-800')) : null;
    })();

    if (this.currentViewMode === 'technical') {
      // Show all cards
      [tempCard, humidityCard, airQualityCard, systemStatusCard, actionsCard].forEach(card => {
        if (card) (card as HTMLElement).style.display = '';
        if (card) (card as HTMLElement).classList.remove('compact-card');
      });
    } else {
      // Show only Miller's Law chunks
      [tempCard, humidityCard, airQualityCard].forEach(card => {
        if (card) (card as HTMLElement).style.display = '';
        if (card) (card as HTMLElement).classList.add('compact-card');
      });
      [pressureCard, altitudeCard, systemStatusCard, actionsCard].forEach(card => {
        if (card) (card as HTMLElement).style.display = '';
        if (card) (card as HTMLElement).classList.remove('compact-card');
      });
      // Hide any other cards if present
      document.querySelectorAll('.bg-gray-50, .dark\\:bg-gray-800').forEach(card => {
        if (![tempCard, humidityCard, airQualityCard, pressureCard, altitudeCard, systemStatusCard, actionsCard].includes(card)) {
          (card as HTMLElement).style.display = 'none';
        }
      });
    }
    // Navbar logo highlight for real-time view
    const navbarLogo = document.getElementById('navbar-logo');
    if (navbarLogo) {
      if (this.currentViewMode === 'realtime') {
        navbarLogo.classList.add('realtime-navbar');
      } else {
        navbarLogo.classList.remove('realtime-navbar');
      }
    }
    // Theme toggle highlight for real-time view
    const themeToggle = document.getElementById('theme-toggle');
    if (themeToggle) {
      if (this.currentViewMode === 'realtime') {
        themeToggle.classList.add('realtime-theme-toggle');
      } else {
        themeToggle.classList.remove('realtime-theme-toggle');
      }
    }
    if (this.currentViewMode === 'technical') {
      if (realtimeActions) realtimeActions.style.display = 'none';
    } else {
      if (realtimeActions) realtimeActions.style.display = '';
    }
  }

  // Cleanup method to properly dispose of resources
  public dispose(): void {
    try {
      // Clear resize timeout
      if (this.resizeTimeout) {
        clearTimeout(this.resizeTimeout);
        this.resizeTimeout = null;
      }
      
      // Destroy charts
      this.destroyCharts();
      
      // Clear data points
      this.dataPoints = [];
      
      // Clear daily AQI data
      this.dailyAQIData = {};
      
      console.log('Dashboard disposed successfully');
      
    } catch (error) {
      console.error('Error disposing dashboard:', error);
    }
  }
} 