import './main.css';
import { Dashboard } from './dashboard';
import { SensorAlerts } from './sensorAlerts';
import { BLEService } from './services/bleService';
import { DeviceDiscovery } from './services/deviceDiscovery';
import { DatabaseService } from './services/databaseService';

class IoTDashboard {
  private dashboard: Dashboard;
  private sensorAlerts: SensorAlerts;
  private bleService: BLEService;
  private deviceDiscovery: DeviceDiscovery;
  private databaseService: DatabaseService | null = null;
  private isConnected = false;
  private isInitialized = false;
  private touchStartY = 0;
  private touchEndY = 0;

  constructor() {
    this.dashboard = new Dashboard();
    this.sensorAlerts = new SensorAlerts();
    this.bleService = new BLEService();
    this.deviceDiscovery = new DeviceDiscovery(this.bleService);
    
    this.initializeApp();
  }

  private async initializeApp() {
    try {
      // Show loading state
      this.showLoading('Initializing dashboard...');
      
      console.log('Starting dashboard initialization...');
      
      // Initialize dashboard
      try {
        console.log('Initializing dashboard component...');
        this.dashboard.initialize();
        console.log('Dashboard component initialized successfully');
        // Ensure view mode buttons and select trigger setViewMode
        const technicalBtn = document.getElementById('view-mode-technical');
        const realtimeBtn = document.getElementById('view-mode-compact');
        const viewModeSelect = document.getElementById('view-mode-select') as HTMLSelectElement;
        if (technicalBtn) {
          technicalBtn.addEventListener('click', () => this.dashboard.setViewMode('technical'));
        }
        if (realtimeBtn) {
          realtimeBtn.addEventListener('click', () => this.dashboard.setViewMode('realtime'));
        }
        if (viewModeSelect) {
          viewModeSelect.addEventListener('change', (e) => {
            const target = e.target as HTMLSelectElement;
            let value = target.value;
            if (value === 'compact') value = 'realtime';
            this.dashboard.setViewMode(value);
          });
        }
      } catch (error) {
        console.error('Dashboard initialization failed:', error);
        throw new Error(`Dashboard initialization failed: ${error}`);
      }
      
      // Initialize alerts
      try {
        console.log('Initializing sensor alerts...');
        this.sensorAlerts.initialize();
        console.log('Sensor alerts initialized successfully');
      } catch (error) {
        console.error('Sensor alerts initialization failed:', error);
        // Don't throw here, alerts are optional
      }
      
      // Initialize database if connection string is provided
      try {
        await this.initializeDatabase();
      } catch (error) {
        console.error('Database initialization failed:', error);
        // Don't throw here, database is optional
      }
      
      // Setup BLE connection and device discovery
      try {
        console.log('Setting up BLE connection...');
        this.setupBLEConnection();
        console.log('BLE connection setup completed');
      } catch (error) {
        console.error('BLE connection setup failed:', error);
        // Don't throw here, BLE is optional
      }
      
      try {
        console.log('Setting up device discovery...');
        this.setupDeviceDiscovery();
        console.log('Device discovery setup completed');
      } catch (error) {
        console.error('Device discovery setup failed:', error);
        // Don't throw here, device discovery is optional
      }
      
      // Setup responsive handlers
      try {
        console.log('Setting up responsive handlers...');
        this.setupResponsiveHandlers();
        console.log('Responsive handlers setup completed');
      } catch (error) {
        console.error('Responsive handlers setup failed:', error);
        // Don't throw here, responsive features are optional
      }
      
      // Setup enhanced interactions
      try {
        console.log('Setting up enhanced interactions...');
        this.setupEnhancedInteractions();
        console.log('Enhanced interactions setup completed');
      } catch (error) {
        console.error('Enhanced interactions setup failed:', error);
        // Don't throw here, enhanced features are optional
      }
      
      // Setup cleanup handlers
      try {
        console.log('Setting up cleanup handlers...');
        this.setupCleanupHandlers();
        console.log('Cleanup handlers setup completed');
      } catch (error) {
        console.error('Cleanup handlers setup failed:', error);
        // Don't throw here, cleanup features are optional
      }
      
      // Hide loading and show success
      this.hideLoading();
      // this.showSuccessMessage('Dashboard ready!'); // Removed to prevent notification on reload
      
      this.isInitialized = true;
      console.log('Dashboard initialization completed successfully');
      
    } catch (error) {
      console.error('Failed to initialize app:', error);
      this.hideLoading();
      this.showErrorMessage(`Failed to initialize dashboard: ${error.message}`);
    }
  }

  private async initializeDatabase(): Promise<void> {
    // Get database connection string from environment or config
    const connectionString = this.getDatabaseConnectionString();
    
    if (connectionString) {
      try {
        console.log('Initializing database connection...');
        this.databaseService = new DatabaseService({ connectionString });
        await this.databaseService.initialize();
        console.log('Database initialized successfully');
        this.showSuccessMessage('Database connected!');
      } catch (error) {
        console.error('Database initialization failed:', error);
        this.showErrorMessage('Database connection failed - data will be stored locally only');
      }
    } else {
      console.log('No database connection string provided - data will be stored locally only');
    }
  }

  private getDatabaseConnectionString(): string | null {
    // Check for config only (process.env is not available in browser)
    const configConnectionString = (window as any).__NEON_DATABASE_URL__;
    
    return configConnectionString || null;
  }

  private setupBLEConnection() {
    const connectBtn = document.getElementById('ble-connect') as HTMLButtonElement;
    const statusIndicator = document.getElementById('ble-status') as HTMLElement;
    
    if (connectBtn) {
      connectBtn.addEventListener('click', async () => {
        // Check if already connected
        if (this.isConnected) {
          try {
            console.log('Disconnecting from BLE device...');
            await this.bleService.disconnect();
            this.isConnected = false;
            
            // Update button state back to connect
            connectBtn.innerHTML = `
              <svg class="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 6v6m0 0v6m0-6h6m-6 0H6"></path>
              </svg>
              Connect BLE
            `;
            connectBtn.classList.remove('from-red-500', 'to-red-600', 'hover:from-red-600', 'hover:to-red-700');
            connectBtn.classList.add('from-blue-500', 'to-blue-600', 'hover:from-blue-600', 'hover:to-blue-700');
            connectBtn.disabled = false;
            
            // Update status indicator
            if (statusIndicator) {
              statusIndicator.innerHTML = `
                <span class="w-2 h-2 bg-gray-400 rounded-full mr-2"></span>
                Disconnected
              `;
              statusIndicator.className = 'inline-flex items-center px-3 py-1 rounded-full text-sm font-medium bg-gray-100 text-gray-800 dark:bg-gray-700 dark:text-gray-200';
            }
            
            this.showSuccessMessage('Disconnected from device');
            
          } catch (error) {
            console.error('BLE disconnect failed:', error);
            this.showErrorMessage('Failed to disconnect');
          }
          return;
        }
        
        // Connect logic
        try {
          // Show loading state
          this.showLoading('Connecting to device...');
          connectBtn.disabled = true;
          connectBtn.innerHTML = `
            <div class="spinner mr-2"></div>
            Connecting...
          `;
          
          await this.bleService.connect();
          this.isConnected = true;
          
          // Update button state
          connectBtn.innerHTML = `
            <svg class="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12"></path>
            </svg>
            Disconnect
          `;
          connectBtn.classList.remove('from-blue-500', 'to-blue-600', 'hover:from-blue-600', 'hover:to-blue-700');
          connectBtn.classList.add('from-red-500', 'to-red-600', 'hover:from-red-600', 'hover:to-red-700');
          connectBtn.disabled = false;
          
          // Update status indicator
          if (statusIndicator) {
            statusIndicator.innerHTML = `
              <span class="w-2 h-2 bg-green-400 rounded-full mr-2"></span>
              Connected
            `;
            statusIndicator.className = 'inline-flex items-center px-3 py-1 rounded-full text-sm font-medium bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-200';
          }
          
          // Start receiving real sensor data
          console.log('Setting up data callback for BLE service...');
          this.bleService.onDataReceived(async (data) => {
            console.log('Main app received sensor data from BLE service:', data);
            
            // Update dashboard
            this.dashboard.updateSensorData(data);
            
            // Check alerts
            this.sensorAlerts.checkAlerts(data);
            
            // Save to database if available
            if (this.databaseService && this.databaseService.isDatabaseConnected()) {
              try {
                await this.databaseService.saveSensorData(data);
                console.log('Data saved to database successfully');
              } catch (error) {
                console.error('Failed to save data to database:', error);
              }
            }
          });
          console.log('Data callback registered successfully');
          
          this.hideLoading();
          this.showSuccessMessage('Successfully connected to device!');
          
        } catch (error) {
          console.error('BLE connection failed:', error);
          connectBtn.innerHTML = `
            <svg class="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 6v6m0 0v6m0-6h6m-6 0H6"></path>
            </svg>
            Connect BLE
          `;
          connectBtn.disabled = false;
          
          if (statusIndicator) {
            statusIndicator.innerHTML = `
              <span class="w-2 h-2 bg-red-400 rounded-full mr-2"></span>
              Failed
            `;
            statusIndicator.className = 'inline-flex items-center px-3 py-1 rounded-full text-sm font-medium bg-red-100 text-red-800 dark:bg-red-900/30 dark:text-red-200';
          }
          
          this.hideLoading();
          this.showErrorMessage('Connection failed. Please try again.');
        }
      });
    }
  }

  private setupDeviceDiscovery() {
    const scanBtn = document.getElementById('scan-devices') as HTMLButtonElement;
    const devicesList = document.getElementById('devices-list') as HTMLElement;
    
    if (scanBtn) {
      scanBtn.addEventListener('click', async () => {
        try {
          // Show loading state
          this.showLoading('Scanning for IoT devices...');
          scanBtn.disabled = true;
          scanBtn.innerHTML = `
            <div class="spinner mr-2"></div>
            Scanning...
          `;
          
          // Start device discovery
          const devices = await this.deviceDiscovery.startScan({
            scanTimeout: 15000, // 15 seconds
            maxDevices: 10
          });
          
          // Update devices list
          if (devicesList) {
            this.updateDevicesList(devices, devicesList);
          }
          
          // Reset button
          scanBtn.innerHTML = `
            <svg class="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"></path>
            </svg>
            Scan Devices
          `;
          scanBtn.disabled = false;
          
          this.hideLoading();
          this.showSuccessMessage(`Found ${devices.length} IoT devices!`);
          
        } catch (error) {
          console.error('Device discovery failed:', error);
          scanBtn.innerHTML = `
            <svg class="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"></path>
            </svg>
            Scan Devices
          `;
          scanBtn.disabled = false;
          
          this.hideLoading();
          this.showErrorMessage('Device discovery failed. Please try again.');
        }
      });
    }
  }

  private updateDevicesList(devices: any[], container: HTMLElement) {
    if (devices.length === 0) {
      container.innerHTML = `
        <div class="text-center py-4">
          <div class="w-8 h-8 mx-auto mb-2 bg-gray-100 dark:bg-gray-700 rounded-full flex items-center justify-center">
            <svg class="w-4 h-4 text-gray-400 dark:text-gray-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M8.111 16.404a5.5 5.5 0 017.778 0M12 20h.01m-7.08-7.071c3.904-3.905 10.236-3.905 14.141 0M1.394 9.393c5.857-5.857 15.355-5.857 21.213 0"></path>
            </svg>
          </div>
          <p class="text-sm text-gray-500 dark:text-gray-400 font-medium">No devices found</p>
          <p class="text-xs text-gray-400 dark:text-gray-500">Make sure your ESP32 is broadcasting</p>
        </div>
      `;
      return;
    }

    container.innerHTML = devices.map(device => `
      <div class="flex items-center justify-between p-3 bg-gray-50 dark:bg-gray-700/50 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors">
        <div class="flex items-center space-x-3">
          <div class="w-8 h-8 bg-blue-100 dark:bg-blue-900/30 rounded-lg flex items-center justify-center">
            <svg class="w-4 h-4 text-blue-600 dark:text-blue-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M8.111 16.404a5.5 5.5 0 017.778 0M12 20h.01m-7.08-7.071c3.904-3.905 10.236-3.905 14.141 0M1.394 9.393c5.857-5.857 15.355-5.857 21.213 0"></path>
            </svg>
          </div>
          <div>
            <p class="text-sm font-medium text-gray-900 dark:text-white">${device.name || 'Unknown Device'}</p>
            <p class="text-xs text-gray-500 dark:text-gray-400">${device.id}</p>
          </div>
        </div>
        <button 
          class="connect-device-btn px-3 py-1 text-xs font-medium text-white bg-gradient-to-r from-blue-500 to-blue-600 hover:from-blue-600 hover:to-blue-700 rounded-lg transition-all duration-200"
          data-device-name="${device.name}"
          data-device-id="${device.id}"
        >
          Connect
        </button>
      </div>
    `).join('');

    // Add event listeners to connect buttons
    container.querySelectorAll('.connect-device-btn').forEach(btn => {
      btn.addEventListener('click', async (e) => {
        const target = e.target as HTMLButtonElement;
        const deviceName = target.dataset.deviceName;
        const deviceId = target.dataset.deviceId;
        
        if (deviceName) {
          try {
            this.showLoading(`Connecting to ${deviceName}...`);
            const success = await this.deviceDiscovery.connectToDevice(deviceName);
            
            if (success) {
              this.isConnected = true;
              this.hideLoading();
              this.showSuccessMessage(`Connected to ${deviceName}!`);
              
              // Update connection status
              this.updateConnectionStatus(true, deviceName);
              
              // Start receiving data
              this.bleService.onDataReceived((data) => {
                this.dashboard.updateSensorData(data);
                this.sensorAlerts.checkAlerts(data);
              });
            } else {
              this.hideLoading();
              this.showErrorMessage(`Failed to connect to ${deviceName}`);
            }
          } catch (error) {
            console.error('Connection error:', error);
            this.hideLoading();
            this.showErrorMessage(`Connection failed: ${error}`);
          }
        }
      });
    });
  }

  private updateConnectionStatus(connected: boolean, deviceName?: string) {
    const connectBtn = document.getElementById('ble-connect') as HTMLButtonElement;
    const statusIndicator = document.getElementById('ble-status') as HTMLElement;
    
    if (connected) {
      if (connectBtn) {
        connectBtn.innerHTML = `
          <svg class="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12"></path>
          </svg>
          Disconnect
        `;
        connectBtn.classList.remove('from-blue-500', 'to-blue-600', 'hover:from-blue-600', 'hover:to-blue-700');
        connectBtn.classList.add('from-red-500', 'to-red-600', 'hover:from-red-600', 'hover:to-red-700');
      }
      
      if (statusIndicator) {
        statusIndicator.innerHTML = `
          <span class="w-2 h-2 bg-green-400 rounded-full mr-2"></span>
          ${deviceName ? `Connected to ${deviceName}` : 'Connected'}
        `;
        statusIndicator.className = 'inline-flex items-center px-3 py-1 rounded-full text-sm font-medium bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-200';
      }
    } else {
      if (connectBtn) {
        connectBtn.innerHTML = `
          <svg class="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 6v6m0 0v6m0-6h6m-6 0H6"></path>
          </svg>
          Connect BLE
        `;
        connectBtn.classList.remove('from-red-500', 'to-red-600', 'hover:from-red-600', 'hover:to-red-700');
        connectBtn.classList.add('from-blue-500', 'to-blue-600', 'hover:from-blue-600', 'hover:to-blue-700');
      }
      
      if (statusIndicator) {
        statusIndicator.innerHTML = `
          <span class="w-2 h-2 bg-red-400 rounded-full mr-2"></span>
          Disconnected
        `;
        statusIndicator.className = 'inline-flex items-center px-3 py-1 rounded-full text-sm font-medium bg-red-100 text-red-800 dark:bg-red-900/30 dark:text-red-200';
      }
    }
  }



  private setupResponsiveHandlers() {
    // Handle mobile menu toggle
    const mobileMenuBtn = document.getElementById('mobile-menu-btn');
    const mobileMenu = document.getElementById('mobile-menu');
    
    if (mobileMenuBtn && mobileMenu) {
      mobileMenuBtn.addEventListener('click', () => {
        mobileMenu.classList.toggle('hidden');
        
        // Update button icon
        const icon = mobileMenuBtn.querySelector('svg');
        if (icon) {
          if (mobileMenu.classList.contains('hidden')) {
            icon.innerHTML = '<path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 6h16M4 12h16M4 18h16"></path>';
          } else {
            icon.innerHTML = '<path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12"></path>';
          }
        }
      });
    }

    // Handle window resize for responsive charts
    window.addEventListener('resize', () => {
      this.dashboard.handleResize();
    });

    // Handle theme toggle
    const themeToggle = document.getElementById('theme-toggle');
    const themeToggleMobile = document.getElementById('theme-toggle-mobile');
    const realtimeThemeToggle = document.getElementById('realtime-theme-toggle');
    const toggleTheme = () => {
      document.documentElement.classList.toggle('dark');
      this.dashboard.updateTheme();
      
      // Update theme toggle icon
      const icons = document.querySelectorAll('#theme-toggle svg, #theme-toggle-mobile svg');
      icons.forEach(icon => {
        if (document.documentElement.classList.contains('dark')) {
          icon.innerHTML = '<path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 3v1m0 16v1m9-9h-1M4 12H3m15.364 6.364l-.707-.707M6.343 6.343l-.707-.707m12.728 0l-.707.707M6.343 17.657l-.707.707M16 12a4 4 0 11-8 0 4 4 0 018 0z"></path>';
        } else {
          icon.innerHTML = '<path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M20.354 15.354A9 9 0 018.646 3.646 9 9 0 0012 21a9 9 0 006.354-5.646z"></path>';
        }
      });
    };
    
    if (themeToggle) {
      themeToggle.addEventListener('click', toggleTheme);
    }
    
    if (themeToggleMobile) {
      themeToggleMobile.addEventListener('click', toggleTheme);
    }
    if (realtimeThemeToggle) {
      realtimeThemeToggle.addEventListener('click', toggleTheme);
    }
  }

  private setupEnhancedInteractions() {
    // Add hover effects to cards
    const cards = document.querySelectorAll('.bg-white\\/80, .dark\\:bg-gray-800\\/80');
    cards.forEach(card => {
      card.classList.add('card-hover-effect');
    });

    // Add button hover effects
    const buttons = document.querySelectorAll('button');
    buttons.forEach(button => {
      button.classList.add('btn-hover');
    });

    // Setup clear alerts functionality
    const clearAlertsBtn = document.getElementById('clear-alerts');
    if (clearAlertsBtn) {
      clearAlertsBtn.addEventListener('click', () => {
        this.sensorAlerts.clearAllAlerts();
        this.showSuccessMessage('All alerts cleared');
      });
    }

    // Add keyboard navigation
    document.addEventListener('keydown', (e) => {
      if (e.key === 'Escape') {
        // Close mobile menu if open
        const mobileMenu = document.getElementById('mobile-menu');
        if (mobileMenu && !mobileMenu.classList.contains('hidden')) {
          mobileMenu.classList.add('hidden');
        }
      }
    });

    // Add touch gestures for mobile
    document.addEventListener('touchstart', (e) => {
      this.touchStartY = e.changedTouches[0].screenY;
    });

    document.addEventListener('touchend', (e) => {
      this.touchEndY = e.changedTouches[0].screenY;
      this.handleSwipeGesture();
    });

    // Add smooth scrolling for anchor links
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
      anchor.addEventListener('click', function (e) {
        e.preventDefault();
        const target = document.querySelector(this.getAttribute('href')!);
        if (target) {
          target.scrollIntoView({
            behavior: 'smooth',
            block: 'start'
          });
        }
      });
    });
  }

  private handleSwipeGesture() {
    const swipeThreshold = 50;
    const swipeDistance = this.touchEndY - this.touchStartY;
    
    if (Math.abs(swipeDistance) > swipeThreshold) {
      if (swipeDistance > 0) {
        // Swipe down - could be used for refresh
        console.log('Swipe down detected');
      } else {
        // Swipe up - could be used for navigation
        console.log('Swipe up detected');
      }
    }
  }

  private showLoading(message: string = 'Loading...') {
    const overlay = document.getElementById('loading-overlay');
    const messageEl = overlay?.querySelector('span');
    
    if (overlay && messageEl) {
      messageEl.textContent = message;
      overlay.classList.remove('hidden');
    }
  }

  private hideLoading() {
    const overlay = document.getElementById('loading-overlay');
    if (overlay) {
      overlay.classList.add('hidden');
    }
  }

  private showSuccessMessage(message: string) {
    this.showToast(message, 'success');
  }

  private showErrorMessage(message: string) {
    this.showToast(message, 'error');
  }

  private showToast(message: string, type: 'success' | 'error' | 'warning' = 'success') {
    // Create toast element
    const toast = document.createElement('div');
    toast.className = `fixed top-4 right-4 z-50 p-4 rounded-xl shadow-2xl transform transition-all duration-300 translate-x-full`;
    
    const bgColor = type === 'success' ? 'bg-green-500' : type === 'error' ? 'bg-red-500' : 'bg-yellow-500';
    const textColor = 'text-white';
    
    toast.className += ` ${bgColor} ${textColor}`;
    
    toast.innerHTML = `
      <div class="flex items-center space-x-3">
        <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          ${type === 'success' ? '<path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 13l4 4L19 7"></path>' :
            type === 'error' ? '<path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12"></path>' :
            '<path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.964-.833-2.732 0L3.732 16.5c-.77.833.192 2.5 1.732 2.5z"></path>'}
        </svg>
        <span class="font-medium">${message}</span>
        <button class="ml-2 text-white hover:text-gray-200" onclick="this.parentElement.parentElement.remove()">
          <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12"></path>
          </svg>
        </button>
      </div>
    `;
    
    document.body.appendChild(toast);
    
    // Animate in
    setTimeout(() => {
      toast.classList.remove('translate-x-full');
    }, 100);
    
    // Auto remove after 5 seconds
    setTimeout(() => {
      toast.classList.add('translate-x-full');
      setTimeout(() => {
        if (toast.parentElement) {
          toast.remove();
        }
      }, 300);
    }, 5000);
  }

  // Public methods for external access
  public getConnectionStatus(): boolean {
    return this.isConnected;
  }

  public getInitializationStatus(): boolean {
    return this.isInitialized;
  }

  public refreshData(): void {
    if (this.isConnected) {
      this.showLoading('Refreshing data...');
      // Trigger BLE refresh
      setTimeout(() => {
        this.hideLoading();
        this.showSuccessMessage('Data refreshed');
      }, 1000);
    } else {
      this.showErrorMessage('Not connected to device');
    }
  }

  private setupCleanupHandlers(): void {
    // Handle page unload to clean up resources
    window.addEventListener('beforeunload', () => {
      try {
        // Dispose dashboard
        if (this.dashboard) {
          this.dashboard.dispose();
        }
        
        // Disconnect BLE if connected
        if (this.isConnected && this.bleService) {
          this.bleService.disconnect().catch(e => 
            console.error('Error disconnecting BLE on cleanup:', e)
          );
        }
        
        console.log('Cleanup completed');
      } catch (error) {
        console.error('Error during cleanup:', error);
      }
    });
  }
}

// Add this function to guarantee only the correct Actions card is visible
function updateActionsCardVisibility(viewMode: string) {
  document.body.classList.remove('technical-view', 'realtime-view');
  if (viewMode === 'technical') {
    document.body.classList.add('technical-view');
  } else {
    document.body.classList.add('realtime-view');
  }
}

// Patch into view mode switching logic
window.addEventListener('DOMContentLoaded', () => {
  const technicalBtn = document.getElementById('view-mode-technical');
  const realtimeBtn = document.getElementById('view-mode-compact');
  const viewModeSelect = document.getElementById('view-mode-select');
  if (technicalBtn) technicalBtn.addEventListener('click', () => updateActionsCardVisibility('technical'));
  if (realtimeBtn) realtimeBtn.addEventListener('click', () => updateActionsCardVisibility('realtime'));
  if (viewModeSelect) viewModeSelect.addEventListener('change', (e) => {
    const value = e.target.value === 'compact' ? 'realtime' : e.target.value;
    updateActionsCardVisibility(value);
  });
  // Set initial state
  updateActionsCardVisibility('technical');
});

window.addEventListener('resize', () => {
  // Re-apply the logic on resize/orientation change
  const isRealtime = document.body.classList.contains('realtime-view');
  updateActionsCardVisibility(isRealtime ? 'realtime' : 'technical');
});

// Initialize the application when DOM is loaded
document.addEventListener('DOMContentLoaded', () => {
  new IoTDashboard();
});

// Export for potential external use
(window as any).IoTDashboard = IoTDashboard; 