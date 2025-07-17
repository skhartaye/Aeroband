import { SensorData } from './types/sensor';

export interface Alert {
  id: string;
  type: 'warning' | 'critical';
  message: string;
  timestamp: Date;
  sensor: string;
  value: number;
}

export class SensorAlerts {
  private alerts: Alert[] = [];
  private maxAlerts = 10;
  private alertSound: HTMLAudioElement | null = null;
  private warningSound: HTMLAudioElement | null = null;

  initialize(): void {
    this.setupAudio();
    this.updateAlertsDisplay();
  }

  private setupAudio(): void {
    this.alertSound = document.getElementById('alert-sound') as HTMLAudioElement;
    this.warningSound = document.getElementById('warning-sound') as HTMLAudioElement;
  }

  checkAlerts(data: SensorData): void {
    const newAlerts: Alert[] = [];

    // Temperature alerts
    if (data.temperature > 30) {
      newAlerts.push({
        id: `temp-${Date.now()}`,
        type: 'critical',
        message: `High temperature detected: ${data.temperature.toFixed(1)}°C`,
        timestamp: new Date(),
        sensor: 'Temperature',
        value: data.temperature
      });
    } else if (data.temperature > 25) {
      newAlerts.push({
        id: `temp-${Date.now()}`,
        type: 'warning',
        message: `Elevated temperature: ${data.temperature.toFixed(1)}°C`,
        timestamp: new Date(),
        sensor: 'Temperature',
        value: data.temperature
      });
    }

    // Humidity alerts
    if (data.humidity > 80) {
      newAlerts.push({
        id: `humidity-${Date.now()}`,
        type: 'critical',
        message: `High humidity detected: ${data.humidity.toFixed(1)}%`,
        timestamp: new Date(),
        sensor: 'Humidity',
        value: data.humidity
      });
    } else if (data.humidity > 70) {
      newAlerts.push({
        id: `humidity-${Date.now()}`,
        type: 'warning',
        message: `Elevated humidity: ${data.humidity.toFixed(1)}%`,
        timestamp: new Date(),
        sensor: 'Humidity',
        value: data.humidity
      });
    }

    // Air quality alerts
    if (data.airQuality > 1000) {
      newAlerts.push({
        id: `air-${Date.now()}`,
        type: 'critical',
        message: `Poor air quality detected: ${data.airQuality.toFixed(0)} ppm`,
        timestamp: new Date(),
        sensor: 'Air Quality',
        value: data.airQuality
      });
    } else if (data.airQuality > 500) {
      newAlerts.push({
        id: `air-${Date.now()}`,
        type: 'warning',
        message: `Moderate air quality: ${data.airQuality.toFixed(0)} ppm`,
        timestamp: new Date(),
        sensor: 'Air Quality',
        value: data.airQuality
      });
    }

    // Add new alerts
    this.alerts.unshift(...newAlerts);

    // Keep only the latest alerts
    if (this.alerts.length > this.maxAlerts) {
      this.alerts = this.alerts.slice(0, this.maxAlerts);
    }

    // Play sounds for new alerts
    newAlerts.forEach(alert => {
      this.playAlertSound(alert.type);
    });

    // Show toast notifications for new alerts
    newAlerts.forEach(alert => {
      showToast(alert.message, alert.type);
    });

    // Update display
    this.updateAlertsDisplay();
  }

  private playAlertSound(type: 'warning' | 'critical'): void {
    try {
      if (type === 'critical' && this.alertSound) {
        this.alertSound.currentTime = 0;
        this.alertSound.play().catch(console.error);
      } else if (type === 'warning' && this.warningSound) {
        this.warningSound.currentTime = 0;
        this.warningSound.play().catch(console.error);
      }
    } catch (error) {
      console.error('Error playing alert sound:', error);
    }
  }

  private updateAlertsDisplay(): void {
    const container = document.getElementById('alerts-container');
    if (!container) return;

    if (this.alerts.length === 0) {
      container.innerHTML = `
        <div class="text-center py-8">
          <div class="w-16 h-16 mx-auto mb-4 bg-gray-100 dark:bg-gray-700 rounded-full flex items-center justify-center">
            <svg class="w-8 h-8 text-gray-400 dark:text-gray-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="1.5" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"></path>
            </svg>
          </div>
          <p class="text-sm text-gray-500 dark:text-gray-400 font-medium">No alerts at the moment</p>
          <p class="text-xs text-gray-400 dark:text-gray-500 mt-1">System is running normally</p>
        </div>
      `;
      return;
    }

    const alertsHTML = this.alerts.map((alert, index) => this.createAlertHTML(alert, index)).join('');
    container.innerHTML = alertsHTML;

    // Add event listeners to dismiss buttons
    this.alerts.forEach(alert => {
      const dismissBtn = document.getElementById(`dismiss-${alert.id}`);
      if (dismissBtn) {
        dismissBtn.addEventListener('click', () => {
          this.dismissAlert(alert.id);
        });
      }
    });

    // Add animation classes
    const alertElements = container.querySelectorAll('.alert-item');
    alertElements.forEach((element, index) => {
      setTimeout(() => {
        element.classList.add('animate-fade-in-up');
      }, index * 100);
    });
  }

  private createAlertHTML(alert: Alert, index: number): string {
    const timeAgo = this.getTimeAgo(alert.timestamp);
    const alertClasses = alert.type === 'critical' 
      ? 'border-red-200 bg-red-50 dark:border-red-800/50 dark:bg-red-900/20' 
      : 'border-yellow-200 bg-yellow-50 dark:border-yellow-800/50 dark:bg-yellow-900/20';
    
    const iconClasses = alert.type === 'critical' 
      ? 'text-red-500' 
      : 'text-yellow-500';

    const iconBgClasses = alert.type === 'critical'
      ? 'bg-red-100 dark:bg-red-900/30'
      : 'bg-yellow-100 dark:bg-yellow-900/30';

    const pulseClass = alert.type === 'critical' ? 'animate-pulse' : '';

    return `
      <div id="alert-${alert.id}" class="alert-item p-4 rounded-xl border ${alertClasses} transition-all duration-300 hover:shadow-lg transform hover:scale-105 ${pulseClass}" style="animation-delay: ${index * 0.1}s;">
        <div class="flex items-start space-x-3">
          <div class="flex-shrink-0">
            <div class="w-10 h-10 ${iconBgClasses} rounded-full flex items-center justify-center">
              <svg class="w-5 h-5 ${iconClasses}" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                ${alert.type === 'critical' 
                  ? '<path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.964-.833-2.732 0L3.732 16.5c-.77.833.192 2.5 1.732 2.5z"></path>'
                  : '<path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.964-.833-2.732 0L3.732 16.5c-.77.833.192 2.5 1.732 2.5z"></path>'
                }
              </svg>
            </div>
          </div>
          <div class="flex-1 min-w-0">
            <div class="flex items-center justify-between">
              <p class="text-sm font-semibold text-gray-900 dark:text-white">
                ${alert.message}
              </p>
              <button id="dismiss-${alert.id}" class="flex-shrink-0 ml-2 p-1 rounded-full text-gray-400 hover:text-gray-600 dark:hover:text-gray-300 transition-colors focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 dark:focus:ring-offset-gray-800" aria-label="Dismiss alert">
                <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12"></path>
                </svg>
              </button>
            </div>
            <div class="flex items-center justify-between mt-2">
              <div class="flex items-center space-x-2">
                <span class="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium ${alert.type === 'critical' ? 'bg-red-100 text-red-800 dark:bg-red-900/30 dark:text-red-200' : 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900/30 dark:text-yellow-200'}">
                  ${alert.sensor}
                </span>
                <span class="text-xs text-gray-500 dark:text-gray-400">
                  ${alert.value.toFixed(alert.sensor === 'Air Quality' ? 0 : 1)}${alert.sensor === 'Temperature' ? '°C' : alert.sensor === 'Humidity' ? '%' : ' ppm'}
                </span>
              </div>
              <span class="text-xs text-gray-400 dark:text-gray-500 font-medium">
                ${timeAgo}
              </span>
            </div>
          </div>
        </div>
      </div>
    `;
  }

  private getTimeAgo(timestamp: Date): string {
    const now = new Date();
    const diffInSeconds = Math.floor((now.getTime() - timestamp.getTime()) / 1000);

    if (diffInSeconds < 60) {
      return 'Just now';
    } else if (diffInSeconds < 3600) {
      const minutes = Math.floor(diffInSeconds / 60);
      return `${minutes}m ago`;
    } else {
      const hours = Math.floor(diffInSeconds / 3600);
      return `${hours}h ago`;
    }
  }

  private dismissAlert(alertId: string): void {
    const alertElement = document.getElementById(`alert-${alertId}`);
    if (alertElement) {
      // Add exit animation
      alertElement.style.transform = 'translateX(100%)';
      alertElement.style.opacity = '0';
      
      setTimeout(() => {
        this.alerts = this.alerts.filter(alert => alert.id !== alertId);
        this.updateAlertsDisplay();
      }, 300);
    }
  }

  clearAllAlerts(): void {
    const container = document.getElementById('alerts-container');
    if (container) {
      // Add fade out animation
      const alertElements = container.querySelectorAll('.alert-item');
      alertElements.forEach((element, index) => {
        setTimeout(() => {
          (element as HTMLElement).style.transform = 'translateX(100%)';
          (element as HTMLElement).style.opacity = '0';
        }, index * 50);
      });
      
      setTimeout(() => {
        this.alerts = [];
        this.updateAlertsDisplay();
      }, alertElements.length * 50 + 300);
    }
  }

  getActiveAlerts(): Alert[] {
    return [...this.alerts];
  }

  getCriticalAlerts(): Alert[] {
    return this.alerts.filter(alert => alert.type === 'critical');
  }

  getWarningAlerts(): Alert[] {
    return this.alerts.filter(alert => alert.type === 'warning');
  }

  getAlertCount(): number {
    return this.alerts.length;
  }

  getCriticalAlertCount(): number {
    return this.getCriticalAlerts().length;
  }

  getWarningAlertCount(): number {
    return this.getWarningAlerts().length;
  }

  // Method to check if there are any active alerts
  hasActiveAlerts(): boolean {
    return this.alerts.length > 0;
  }

  // Method to get the most recent alert
  getLatestAlert(): Alert | null {
    return this.alerts.length > 0 ? this.alerts[0] : null;
  }
} 

// Add toast notification function
function showToast(message: string, type: 'warning' | 'critical' = 'warning') {
  const container = document.getElementById('toast-container');
  if (!container) return;
  const toast = document.createElement('div');
  toast.className = `px-4 py-2 rounded-lg shadow-lg font-semibold animate-fade-in-up transition-all duration-300 ${type === 'critical' ? 'bg-red-500 text-white' : 'bg-yellow-400 text-gray-900'}`;
  toast.textContent = message;
  container.appendChild(toast);
  setTimeout(() => {
    toast.classList.add('opacity-0');
    setTimeout(() => toast.remove(), 500);
  }, 4000);
} 