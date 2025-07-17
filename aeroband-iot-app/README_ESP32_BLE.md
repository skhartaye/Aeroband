# ESP32 Bluetooth LE Integration Guide

This guide explains how to use the enhanced ESP32 Bluetooth Low Energy (BLE) functionality with your Aeroband IoT Dashboard.

## 🚀 Enhanced Features

### 1. **Device Discovery**
- **Scan for ESP32 devices** broadcasting their Bluetooth names
- **Automatic device detection** using multiple naming patterns
- **Visual device list** with connection buttons
- **Real-time status updates**

### 2. **Flexible Connection**
- **Multiple service UUID support** for different ESP32 configurations
- **Automatic characteristic detection** for sensor data
- **Fallback mechanisms** for various ESP32 setups
- **Connection status indicators**

### 3. **Data Format Support**
- **JSON format** (primary)
- **CSV format** (comma-separated values)
- **Space-separated format**
- **Automatic format detection**

## 📱 Dashboard Features

### Device Discovery UI
- **Scan Devices** button to discover nearby ESP32 devices
- **Device list** showing available ESP32 sensors
- **One-click connection** to any discovered device
- **Connection status** with device name display

### Enhanced BLE Service
- **Multiple ESP32 naming patterns** supported:
  - `ESP32`
  - `Aeroband`
  - `ESP_`
  - `BLE_`
  - `Sensor`
  - `IoT`
  - `Device`

- **Multiple service UUIDs** supported:
  - `4fafc201-1fb5-459e-8fcc-c5c9c331914b` (Custom)
  - `0000ffe0-0000-1000-8000-00805f9b34fb` (Common ESP32)
  - `0000ffe1-0000-1000-8000-00805f9b34fb` (Common characteristic)

## 🔧 ESP32 Setup

### 1. **Install Required Libraries**
```cpp
// In Arduino IDE, install these libraries:
// - BLE Device (built-in with ESP32 board)
// - Adafruit BME280 Library (optional, for real sensor data)
// - Wire (built-in)
```

### 2. **Upload the Example Code**
1. Open `ESP32_BLE_Example.ino` in Arduino IDE
2. Select your ESP32 board
3. Upload the code

### 3. **Hardware Setup (Optional)**
For real sensor data, connect a BME280 sensor:
```
ESP32    BME280
3.3V  -> VCC
GND   -> GND
GPIO21 -> SDA
GPIO22 -> SCL
```

### 4. **Customize Device Name**
```cpp
// Change this line in the code:
#define DEVICE_NAME "Your_ESP32_Device_Name"
```

## 🌐 Dashboard Usage

### 1. **Start the Dashboard**
```bash
npm run dev
```

### 2. **Discover Devices**
1. Click **"Scan Devices"** button
2. Wait for device discovery (up to 15 seconds)
3. View discovered ESP32 devices in the list

### 3. **Connect to Device**
1. Click **"Connect"** next to your desired device
2. Wait for connection confirmation
3. View real-time sensor data

### 4. **Monitor Data**
- **Real-time charts** update automatically
- **Sensor alerts** trigger based on thresholds
- **Connection status** shows device name

## 📊 Data Formats

### JSON Format (Recommended)
```json
{
  "temperature": 22.5,
  "humidity": 45.2,
  "pressure": 1013.25,
  "altitude": 100.0,
  "airQuality": 450,
  "timestamp": 1234567890
}
```

### CSV Format
```
22.5,45.2,1013.25,100.0,450
```

### Space-Separated Format
```
22.5 45.2 1013.25 100.0 450
```

## 🔍 Troubleshooting

### Device Not Found?
1. **Check device name** - Make sure it matches supported patterns
2. **Verify Bluetooth** - Ensure ESP32 is advertising
3. **Check browser** - Use Chrome/Edge with Web Bluetooth support
4. **HTTPS required** - Dashboard must run on HTTPS for BLE

### Connection Failed?
1. **Check service UUID** - Verify it matches the dashboard
2. **Verify characteristic** - Ensure sensor data characteristic exists
3. **Check data format** - Ensure data is in supported format
4. **Restart ESP32** - Sometimes helps with connection issues

### Data Not Updating?
1. **Check connection status** - Ensure device is connected
2. **Verify data format** - Check console for parsing errors
3. **Check transmission interval** - ESP32 sends data every 1 second
4. **Monitor Serial output** - Check ESP32 serial monitor

## 🛠️ Customization

### Adding New Device Names
Edit `ESP32_NAME_PATTERNS` in `src/services/bleService.ts`:
```typescript
private readonly ESP32_NAME_PATTERNS = [
  'ESP32',
  'Aeroband',
  'ESP_',
  'BLE_',
  'Sensor',
  'IoT',
  'Device',
  'YourCustomName'  // Add your custom pattern
];
```

### Adding New Service UUIDs
Edit `ESP32_SERVICE_UUIDS` in `src/services/bleService.ts`:
```typescript
private readonly ESP32_SERVICE_UUIDS = [
  '4fafc201-1fb5-459e-8fcc-c5c9c331914b',
  '0000ffe0-0000-1000-8000-00805f9b34fb',
  '0000ffe1-0000-1000-8000-00805f9b34fb',
  'your-custom-uuid'  // Add your custom UUID
];
```

### Custom Data Parsing
Modify `parseAlternativeFormats()` in `src/services/bleService.ts` to handle your custom data format.

## 🔒 Security Notes

- **Web Bluetooth API** requires HTTPS
- **User permission** required for BLE access
- **Device pairing** handled by browser
- **No persistent connections** - reconnects automatically

## 📱 Browser Compatibility

- **Chrome** 56+ (Desktop & Android)
- **Edge** 79+
- **Opera** 43+
- **Safari** (Not supported)
- **Firefox** (Not supported)

## 🎯 Best Practices

1. **Use descriptive device names** for easy identification
2. **Implement error handling** in ESP32 code
3. **Add data validation** before transmission
4. **Use appropriate transmission intervals** (1-5 seconds)
5. **Monitor connection status** and reconnect if needed
6. **Test with multiple devices** to ensure compatibility

## 🚀 Next Steps

1. **Deploy your ESP32** with the example code
2. **Test device discovery** with the dashboard
3. **Customize sensor data** for your specific needs
4. **Add more sensors** to your ESP32 setup
5. **Implement data logging** and analytics
6. **Add mobile app** support for on-the-go monitoring

---

**Happy IoT Development! 🎉** 