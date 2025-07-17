import { SensorData } from '../types/sensor';

export interface BLEDevice {
  id: string;
  name: string | null;
  rssi?: number;
  isConnected: boolean;
}

export class BLEService {
  private device: BluetoothDevice | null = null;
  private server: BluetoothRemoteGATTServer | null = null;
  private service: BluetoothRemoteGATTService | null = null;
  private characteristic: BluetoothRemoteGATTCharacteristic | null = null;
  private dataCallback: ((data: SensorData) => void) | null = null;
  private deviceCallback: ((devices: BLEDevice[]) => void) | null = null;
  private isScanning = false;

  // Arduino R4 and ESP32 common service UUIDs and naming patterns
  private readonly DEVICE_SERVICE_UUIDS = [
    '19b10000-e8f2-537e-4f6c-d104768a1214', // Arduino R4 service UUID (lowercase)
    '4fafc201-1fb5-459e-8fcc-c5c9c331914b', // Your custom service UUID
    '0000ffe0-0000-1000-8000-00805f9b34fb', // Common ESP32 service UUID
    '0000ffe1-0000-1000-8000-00805f9b34fb', // Common ESP32 characteristic UUID
  ];

  private readonly DEVICE_NAME_PATTERNS = [
    'AerobandSensor',  // Arduino R4 pattern
    'ESP32',
    'Aeroband',
    'ESP_',
    'BLE_',
    'Sensor',
    'IoT',
    'Device',
    'UNO_R4',  // Arduino R4 pattern
    'Arduino',
    'R4'
  ];

  /**
   * Scan for available ESP32 devices
   */
  async scanForDevices(): Promise<BLEDevice[]> {
    if (!navigator.bluetooth) {
      throw new Error('Bluetooth not supported in this browser');
    }

    const devices: BLEDevice[] = [];

    try {
      // Request device with broader filters to discover ESP32 devices
      const device = await navigator.bluetooth.requestDevice({
        filters: [
          // Filter by service UUIDs
          ...this.DEVICE_SERVICE_UUIDS.map(uuid => ({ services: [uuid] })),
          // Filter by name prefixes
          ...this.DEVICE_NAME_PATTERNS.map(prefix => ({ namePrefix: prefix })),
          // Accept all devices for discovery
          {}
        ],
        optionalServices: this.DEVICE_SERVICE_UUIDS
      });

      // Add the discovered device to our list
      if (device) {
        devices.push({
          id: device.id,
          name: device.name,
          isConnected: device.gatt?.connected || false
        });
      }

      return devices;
    } catch (error) {
      console.error('Error scanning for devices:', error);
      return devices;
    }
  }

  /**
   * Connect to a specific ESP32 device by name or ID
   */
  async connectToDevice(deviceName?: string, deviceId?: string): Promise<void> {
    try {
      console.log('Starting BLE connection process...');
      
      // Check if Bluetooth is available
      if (!navigator.bluetooth) {
        throw new Error('Bluetooth not supported in this browser');
      }

      console.log('Bluetooth API available, building filters...');

      // Build filters based on provided parameters
      const filters: BluetoothRequestDeviceFilter[] = [];

      if (deviceName) {
        // If specific device name is provided, use it
        filters.push({ name: deviceName });
        console.log('Using specific device name filter:', deviceName);
      } else if (deviceId) {
        // If device ID is provided, we'll need to handle this differently
        // as Web Bluetooth API doesn't support direct ID filtering
        filters.push({});
        console.log('Using device ID filter (will need manual selection):', deviceId);
      } else {
        // Default filters for ESP32 and Arduino R4 devices
        filters.push(
          ...this.DEVICE_SERVICE_UUIDS.map(uuid => ({ services: [uuid] })),
          ...this.DEVICE_NAME_PATTERNS.map(prefix => ({ namePrefix: prefix }))
        );
        console.log('Using default filters for ESP32/Arduino R4 devices');
      }

      console.log('Requesting device with filters:', filters);

      // Request device
      this.device = await navigator.bluetooth.requestDevice({
        filters,
        optionalServices: this.DEVICE_SERVICE_UUIDS
      });

      console.log('Device selected:', this.device.name);
      console.log('Device ID:', this.device.id);

      // Connect to GATT server
      console.log('Connecting to GATT server...');
      this.server = await this.device.gatt?.connect();
      if (!this.server) {
        throw new Error('Failed to connect to GATT server');
      }
      console.log('GATT server connected successfully');

      // Try to find the service using different UUIDs
      console.log('Searching for device service...');
      this.service = await this.findService();
      if (!this.service) {
        throw new Error('Device service not found. Please check your device configuration.');
      }
      console.log('Device service found:', this.service.uuid);

      // Try to find the characteristic for sensor data
      console.log('Searching for sensor data characteristic...');
      this.characteristic = await this.findCharacteristic();
      if (!this.characteristic) {
        throw new Error('Sensor data characteristic not found. Please check your device configuration.');
      }
      console.log('Sensor data characteristic found:', this.characteristic.uuid);

      // Start notifications
      console.log('Starting notifications...');
      await this.characteristic.startNotifications();
      this.characteristic.addEventListener('characteristicvaluechanged', (event) => {
        console.log('Characteristic value changed event received');
        this.handleDataReceived(event);
      });

      console.log('BLE connection established successfully');

    } catch (error) {
      console.error('BLE connection error:', error);
      throw error;
    }
  }

  /**
   * Find the appropriate service UUID for the device
   */
  private async findService(): Promise<BluetoothRemoteGATTService | null> {
    for (const serviceUUID of this.DEVICE_SERVICE_UUIDS) {
      try {
        const service = await this.server!.getPrimaryService(serviceUUID);
        if (service) {
          console.log(`Found service with UUID: ${serviceUUID}`);
          return service;
        }
      } catch (error) {
        console.log(`Service UUID ${serviceUUID} not found, trying next...`);
      }
    }
    return null;
  }

  /**
   * Find the appropriate characteristic for sensor data
   */
  private async findCharacteristic(): Promise<BluetoothRemoteGATTCharacteristic | null> {
    if (!this.service) return null;

    const characteristicUUIDs = [
      '19b10001-e8f2-537e-4f6c-d104768a1214', // Arduino R4 characteristic UUID (lowercase)
      'beb5483e-36e1-4688-b7f5-ea07361b26a8', // Your custom characteristic UUID
      '0000ffe1-0000-1000-8000-00805f9b34fb', // Common ESP32 characteristic UUID
    ];

    for (const charUUID of characteristicUUIDs) {
      try {
        const characteristic = await this.service.getCharacteristic(charUUID);
        if (characteristic) {
          console.log(`Found characteristic with UUID: ${charUUID}`);
          return characteristic;
        }
      } catch (error) {
        console.log(`Characteristic UUID ${charUUID} not found, trying next...`);
      }
    }

    // If no specific characteristic found, try to get all characteristics
    try {
      const characteristics = await this.service.getCharacteristics();
      if (characteristics.length > 0) {
        console.log(`Using first available characteristic: ${characteristics[0].uuid}`);
        return characteristics[0];
      }
    } catch (error) {
      console.error('Error getting characteristics:', error);
    }

    return null;
  }

  /**
   * Legacy connect method for backward compatibility
   */
  async connect(): Promise<void> {
    return this.connectToDevice();
  }

  private handleDataReceived(event: Event): void {
    const target = event.target as BluetoothRemoteGATTCharacteristic;
    const value = target.value;
    
    if (!value) {
      console.log('No data received from characteristic');
      return;
    }

    try {
      // Convert the data view to string
      const decoder = new TextDecoder('utf-8');
      const dataString = decoder.decode(value);
      
      console.log('Received BLE data:', dataString);
      console.log('Data length:', dataString.length);
      console.log('Raw data view:', value);
      
      // Try to parse as JSON first
      try {
        const jsonData = JSON.parse(dataString);
        console.log('Successfully parsed JSON data:', jsonData);
        
        // Handle both full format and compact format
        let sensorData: SensorData;
        
        if (jsonData.temperature !== undefined || jsonData.t !== undefined) {
          // Full format (ESP32)
          sensorData = {
            temperature: jsonData.temperature || jsonData.t || 0,
            humidity: jsonData.humidity || jsonData.h || 0,
            pressure: jsonData.pressure || jsonData.p || 0,
            altitude: jsonData.altitude || jsonData.a || 0,
            airQuality: jsonData.airQuality || jsonData.q || 0,
            timestamp: Date.now() // Use current system time instead of Arduino millis()
          };
        } else {
          // Try to parse as Arduino R4 compact format
          sensorData = {
            temperature: jsonData.t || 0,
            humidity: jsonData.h || 0,
            pressure: jsonData.p || 0,
            altitude: jsonData.a || 0,
            airQuality: jsonData.q || 0,
            timestamp: Date.now() // Use current system time instead of Arduino millis()
          };
        }
        
        console.log('Processed sensor data:', sensorData);
        
        if (this.dataCallback) {
          console.log('Calling data callback with sensor data');
          this.dataCallback(sensorData);
        } else {
          console.warn('No data callback registered');
        }
      } catch (jsonError) {
        // If JSON parsing fails, try to parse as CSV or other formats
        console.log('JSON parsing failed, trying alternative formats...');
        console.log('JSON error:', jsonError);
        this.parseAlternativeFormats(dataString);
      }
      
    } catch (error) {
      console.error('Error parsing BLE data:', error);
    }
  }

  /**
   * Parse data in alternative formats (CSV, plain text, etc.)
   */
  private parseAlternativeFormats(dataString: string): void {
    try {
      // Try CSV format: "temperature,humidity,pressure,altitude,airQuality"
      const values = dataString.split(',').map(v => parseFloat(v.trim()));
      
      if (values.length >= 5 && values.every(v => !isNaN(v))) {
        const sensorData: SensorData = {
          temperature: values[0],
          humidity: values[1],
          pressure: values[2],
          altitude: values[3],
          airQuality: values[4],
          timestamp: Date.now() // Use current system time
        };
        
        if (this.dataCallback) {
          this.dataCallback(sensorData);
        }
        return;
      }

      // Try space-separated format
      const spaceValues = dataString.split(/\s+/).map(v => parseFloat(v.trim()));
      if (spaceValues.length >= 5 && spaceValues.every(v => !isNaN(v))) {
        const sensorData: SensorData = {
          temperature: spaceValues[0],
          humidity: spaceValues[1],
          pressure: spaceValues[2],
          altitude: spaceValues[3],
          airQuality: spaceValues[4],
          timestamp: Date.now() // Use current system time
        };
        
        if (this.dataCallback) {
          this.dataCallback(sensorData);
        }
        return;
      }

      // Try Arduino R4 format with gas sensors
      if (dataString.includes('gas_resistance') || dataString.includes('ammonia') || dataString.includes('pm1_0')) {
        try {
          const arduinoData = JSON.parse(dataString);
          const sensorData: SensorData = {
            temperature: arduinoData.temperature || 0,
            humidity: arduinoData.humidity || 0,
            pressure: arduinoData.pressure || 0,
            gas_resistance: arduinoData.gas_resistance || 0,
            ammonia: arduinoData.ammonia || 0,
            pm1_0: arduinoData.pm1_0 || 0,
            pm2_5: arduinoData.pm2_5 || 0,
            pm10: arduinoData.pm10 || 0,
            timestamp: Date.now() // Use current system time
          };
          
          if (this.dataCallback) {
            this.dataCallback(sensorData);
          }
          return;
        } catch (error) {
          console.log('Failed to parse Arduino R4 JSON format:', error);
        }
      }

      console.log('Could not parse data in any known format:', dataString);
      
    } catch (error) {
      console.error('Error parsing alternative formats:', error);
    }
  }

  onDataReceived(callback: (data: SensorData) => void): void {
    this.dataCallback = callback;
  }

  onDevicesDiscovered(callback: (devices: BLEDevice[]) => void): void {
    this.deviceCallback = callback;
  }

  async disconnect(): Promise<void> {
    try {
      if (this.characteristic) {
        await this.characteristic.stopNotifications();
      }
      
      if (this.device?.gatt?.connected) {
        await this.device.gatt.disconnect();
      }
      
      this.device = null;
      this.server = null;
      this.service = null;
      this.characteristic = null;
      this.dataCallback = null;
      
      console.log('BLE disconnected');
    } catch (error) {
      console.error('Error disconnecting BLE:', error);
    }
  }

  isConnected(): boolean {
    return this.device?.gatt?.connected || false;
  }

  getDeviceName(): string | null {
    return this.device?.name || null;
  }

  getDeviceId(): string | null {
    return this.device?.id || null;
  }

  /**
   * Get detailed device information
   */
  getDeviceInfo(): BLEDevice | null {
    if (!this.device) return null;
    
    return {
      id: this.device.id,
      name: this.device.name,
      isConnected: this.isConnected()
    };
  }
} 