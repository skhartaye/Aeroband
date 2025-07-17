# Arduino R4 WiFi BLE Integration Guide

This guide explains how to use your Arduino R4 WiFi with the Aeroband IoT Dashboard for real-time sensor monitoring.

## 🚀 Arduino R4 WiFi Features

### **Hardware Specifications**
- **Processor**: Renesas RA4M1 (48MHz ARM Cortex-M4)
- **Memory**: 256KB SRAM, 1MB Flash
- **Connectivity**: WiFi + Bluetooth Low Energy (BLE)
- **GPIO**: 14 digital pins, 6 analog pins
- **Special Features**: RTC, Crypto engine, USB-C

### **BLE Capabilities**
- **Bluetooth 5.0** with BLE support
- **ArduinoBLE library** for easy BLE development
- **Multiple service support** for complex applications
- **Low power consumption** for battery operation

## 📱 Dashboard Compatibility

### **Supported Data Formats**
Your Arduino R4 code sends data in this JSON format:
```json
{
  "temperature": 25.5,
  "humidity": 45.2,
  "pressure": 1013.25,
  "gas_resistance": 12.5,
  "ammonia": 45.0,
  "pm1_0": 5,
  "pm2_5": 12,
  "pm10": 25
}
```

### **Sensor Data Mapping**
- **Temperature**: `temperature` (20-35°C range)
- **Humidity**: `humidity` (30-70% range)
- **Pressure**: `pressure` (950-1050 hPa range)
- **Air Quality**: `ammonia` (0-100 PPM range)
- **Gas Resistance**: `gas_resistance` (5-50 kΩ range)
- **Particulate Matter**: `pm1_0`, `pm2_5`, `pm10` (μg/m³)

## 🔧 Setup Instructions

### 1. **Install Arduino IDE**
1. Download Arduino IDE 2.x from [arduino.cc](https://arduino.cc)
2. Install Arduino R4 WiFi board support
3. Install required libraries

### 2. **Install Required Libraries**
```cpp
// In Arduino IDE Library Manager, install:
// - ArduinoBLE (built-in with R4)
// - Adafruit BME280 Library (optional)
// - Wire (built-in)
```

### 3. **Upload the Code**
1. Open `Arduino_R4_BLE_Example.ino` in Arduino IDE
2. Select **"Arduino R4 WiFi"** board
3. Select correct port
4. Click **Upload**

### 4. **Verify Upload**
Check Serial Monitor (115200 baud) for:
```
BLE advertising started...
Device name: UNO_R4_Sensor
Waiting for connections...
```

## 🌐 Dashboard Connection

### 1. **Start Dashboard**
```bash
npm run dev
```

### 2. **Discover Device**
1. Click **"Scan Devices"** button
2. Look for **"UNO_R4_Sensor"** in device list
3. Click **"Connect"** next to your device

### 3. **Monitor Data**
- **Real-time charts** update every 5 seconds
- **Sensor values** display in cards
- **Connection status** shows device name

## 📊 Data Visualization

### **Dashboard Cards**
- **Temperature**: Real-time temperature readings
- **Humidity**: Current humidity percentage
- **Air Quality**: Ammonia levels (PPM)
- **Pressure**: Atmospheric pressure (hPa)
- **Gas Resistance**: Sensor resistance (kΩ)

### **Charts**
- **Temperature Chart**: Line graph with time axis
- **Humidity Chart**: Real-time humidity trends
- **Air Quality Chart**: Ammonia concentration over time

## 🔍 Troubleshooting

### **Device Not Found?**
1. **Check device name**: Should be "UNO_R4_Sensor"
2. **Verify BLE**: LED should blink when advertising
3. **Check Serial Monitor**: Should show "BLE advertising started"
4. **Restart Arduino**: Sometimes helps with BLE issues

### **Connection Failed?**
1. **Check service UUID**: `4fafc201-1fb5-459e-8fcc-c5c9c331914b`
2. **Verify characteristic**: `beb5483e-36e1-4688-b7f5-ea07361b26a8`
3. **Check data format**: Must be valid JSON
4. **Monitor Serial**: Check for connection messages

### **Data Not Updating?**
1. **Check connection**: LED should be ON when connected
2. **Verify data transmission**: Serial should show JSON data
3. **Check transmission interval**: 5 seconds by default
4. **Monitor Serial output**: Should show data every 5 seconds

## 🛠️ Customization

### **Change Device Name**
```cpp
// In setup():
BLE.setLocalName("Your_Custom_Name");
```

### **Modify Data Interval**
```cpp
// In loop():
delay(5000); // Change to desired interval (milliseconds)
```

### **Add Real Sensors**

#### **BME280 Temperature/Humidity/Pressure**
```cpp
#include <Wire.h>
#include <Adafruit_Sensor.h>
#include <Adafruit_BME280.h>

Adafruit_BME280 bme;

void setup() {
  Wire.begin();
  if (!bme.begin(0x76)) {
    Serial.println("BME280 not found!");
  }
}

// In loop():
float temperature = bme.readTemperature();
float humidity = bme.readHumidity();
float pressure = bme.readPressure() / 100.0F;
```

#### **MQ137 Ammonia Sensor**
```cpp
// Connect to analog pin A0
float ammoniaPPM = analogRead(A0) * (5.0 / 1023.0) * 100;
```

#### **PMS5003 Particulate Matter Sensor**
```cpp
// Use Serial1 for PMS5003
Serial1.begin(9600);
// Read PM data from Serial1
```

### **Custom Data Format**
```cpp
// Modify the JSON structure:
snprintf(jsonData, sizeof(jsonData),
         "{\"temperature\":%.2f,\"humidity\":%.2f,\"pressure\":%.2f,\"custom_field\":%.2f}",
         temperature, humidity, pressure, customValue);
```

## 🔒 Security & Best Practices

### **BLE Security**
- **Web Bluetooth API** requires HTTPS
- **User permission** required for BLE access
- **Device pairing** handled by browser
- **No persistent connections** - reconnects automatically

### **Data Validation**
```cpp
// Add validation before transmission
if (temperature >= -40 && temperature <= 85) {
  // Send data
} else {
  Serial.println("Invalid temperature reading");
}
```

### **Error Handling**
```cpp
// Add error handling for sensor readings
if (isnan(temperature)) {
  Serial.println("Failed to read temperature");
  temperature = 0; // Default value
}
```

## 📱 Browser Compatibility

- **Chrome** 56+ (Desktop & Android) ✅
- **Edge** 79+ ✅
- **Opera** 43+ ✅
- **Safari** (Not supported) ❌
- **Firefox** (Not supported) ❌

## 🎯 Performance Tips

1. **Optimize transmission interval**: 5-10 seconds recommended
2. **Use efficient JSON**: Minimize data size
3. **Add error handling**: Prevent crashes
4. **Monitor memory usage**: R4 has 256KB SRAM
5. **Use appropriate data types**: Float for precision, int for integers

## 🚀 Advanced Features

### **Multiple Sensors**
```cpp
// Add multiple sensor readings
float co2 = readCO2Sensor();
float tvoc = readTVOCSensor();
float light = readLightSensor();

// Include in JSON
snprintf(jsonData, sizeof(jsonData),
         "{\"temperature\":%.2f,\"co2\":%.2f,\"tvoc\":%.2f,\"light\":%.2f}",
         temperature, co2, tvoc, light);
```

### **Battery Monitoring**
```cpp
// Add battery level monitoring
float batteryLevel = (analogRead(A1) / 1023.0) * 100;
```

### **WiFi Integration**
```cpp
// Combine BLE with WiFi for cloud upload
#include <WiFiS3.h>
// Upload data to cloud while maintaining BLE connection
```

## 📈 Next Steps

1. **Add real sensors** to your Arduino R4
2. **Implement data logging** to SD card
3. **Add WiFi connectivity** for cloud upload
4. **Create mobile app** for on-the-go monitoring
5. **Implement alerts** based on sensor thresholds
6. **Add multiple devices** for network monitoring

---

**Happy IoT Development with Arduino R4! 🎉** 