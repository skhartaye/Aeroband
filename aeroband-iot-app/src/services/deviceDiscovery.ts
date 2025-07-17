import { BLEService, BLEDevice } from './bleService';

export interface DeviceDiscoveryOptions {
  autoConnect?: boolean;
  scanTimeout?: number;
  maxDevices?: number;
}

export class DeviceDiscovery {
  private bleService: BLEService;
  private discoveredDevices: BLEDevice[] = [];
  private isScanning = false;
  private scanTimeout: number = 10000; // 10 seconds
  private maxDevices: number = 10;

  constructor(bleService: BLEService) {
    this.bleService = bleService;
  }

  /**
   * Start scanning for ESP32 devices
   */
  async startScan(options: DeviceDiscoveryOptions = {}): Promise<BLEDevice[]> {
    if (this.isScanning) {
      console.log('Scan already in progress...');
      return this.discoveredDevices;
    }

    this.isScanning = true;
    this.scanTimeout = options.scanTimeout || this.scanTimeout;
    this.maxDevices = options.maxDevices || this.maxDevices;
    this.discoveredDevices = [];

    console.log('Starting ESP32 device discovery...');

    try {
      // Set up a timeout for the scan
      const scanPromise = this.performScan();
      const timeoutPromise = new Promise<BLEDevice[]>((_, reject) => {
        setTimeout(() => {
          reject(new Error('Scan timeout'));
        }, this.scanTimeout);
      });

      // Race between scan completion and timeout
      const devices = await Promise.race([scanPromise, timeoutPromise]);
      
      console.log(`Discovery completed. Found ${devices.length} devices.`);
      return devices;

    } catch (error) {
      console.error('Device discovery error:', error);
      return this.discoveredDevices;
    } finally {
      this.isScanning = false;
    }
  }

  /**
   * Perform the actual device scanning
   */
  private async performScan(): Promise<BLEDevice[]> {
    const devices: BLEDevice[] = [];
    let attempts = 0;
    const maxAttempts = 5;

    while (devices.length < this.maxDevices && attempts < maxAttempts) {
      try {
        const newDevices = await this.bleService.scanForDevices();
        
        // Add new devices that aren't already in our list
        for (const device of newDevices) {
          if (!devices.some(d => d.id === device.id)) {
            devices.push(device);
            console.log(`Discovered device: ${device.name} (${device.id})`);
            
            if (devices.length >= this.maxDevices) {
              break;
            }
          }
        }

        // Small delay between scan attempts
        await new Promise(resolve => setTimeout(resolve, 1000));
        attempts++;

      } catch (error) {
        console.log(`Scan attempt ${attempts + 1} failed:`, error);
        attempts++;
        await new Promise(resolve => setTimeout(resolve, 2000));
      }
    }

    this.discoveredDevices = devices;
    return devices;
  }

  /**
   * Stop the current scan
   */
  stopScan(): void {
    this.isScanning = false;
    console.log('Device discovery stopped.');
  }

  /**
   * Get the list of discovered devices
   */
  getDiscoveredDevices(): BLEDevice[] {
    return [...this.discoveredDevices];
  }

  /**
   * Clear the discovered devices list
   */
  clearDiscoveredDevices(): void {
    this.discoveredDevices = [];
  }

  /**
   * Check if currently scanning
   */
  isCurrentlyScanning(): boolean {
    return this.isScanning;
  }

  /**
   * Connect to a specific device by name
   */
  async connectToDevice(deviceName: string): Promise<boolean> {
    try {
      console.log(`Attempting to connect to device: ${deviceName}`);
      await this.bleService.connectToDevice(deviceName);
      console.log(`Successfully connected to ${deviceName}`);
      return true;
    } catch (error) {
      console.error(`Failed to connect to ${deviceName}:`, error);
      return false;
    }
  }

  /**
   * Connect to a specific device by ID
   */
  async connectToDeviceById(deviceId: string): Promise<boolean> {
    try {
      console.log(`Attempting to connect to device ID: ${deviceId}`);
      await this.bleService.connectToDevice(undefined, deviceId);
      console.log(`Successfully connected to device ID: ${deviceId}`);
      return true;
    } catch (error) {
      console.error(`Failed to connect to device ID ${deviceId}:`, error);
      return false;
    }
  }

  /**
   * Get device information for a connected device
   */
  getConnectedDeviceInfo(): BLEDevice | null {
    return this.bleService.getDeviceInfo();
  }

  /**
   * Check if any device is currently connected
   */
  isDeviceConnected(): boolean {
    return this.bleService.isConnected();
  }

  /**
   * Disconnect from the current device
   */
  async disconnect(): Promise<void> {
    await this.bleService.disconnect();
  }
} 