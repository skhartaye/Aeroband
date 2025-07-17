/*
 * ESP32 BLE Sensor Data Broadcast Example
 * Compatible with Aeroband IoT Dashboard
 * 
 * This example demonstrates how to:
 * 1. Set up BLE server with custom service UUID
 * 2. Broadcast sensor data in JSON format
 * 3. Handle connections from the web dashboard
 * 
 * Hardware Requirements:
 * - ESP32 development board
 * - BME280 sensor (optional, for real sensor data)
 * - Or use simulated sensor data
 */

#include <BLEDevice.h>
#include <BLEServer.h>
#include <BLEUtils.h>
#include <BLE2902.h>
#include <Wire.h>
#include <Adafruit_Sensor.h>
#include <Adafruit_BME280.h>

// BLE Service and Characteristic UUIDs (matching the dashboard)
#define SERVICE_UUID        "4fafc201-1fb5-459e-8fcc-c5c9c331914b"
#define CHARACTERISTIC_UUID "beb5483e-36e1-4688-b7f5-ea07361b26a8"

// Device name that will be broadcast
#define DEVICE_NAME "Aeroband_ESP32_Sensor"

// Pin definitions for BME280 (if using real sensor)
#define I2C_SDA 21
#define I2C_SCL 22

// BLE objects
BLEServer* pServer = NULL;
BLECharacteristic* pCharacteristic = NULL;
bool deviceConnected = false;
bool oldDeviceConnected = false;

// BME280 sensor object (optional)
Adafruit_BME280 bme;

// Data transmission interval
unsigned long lastDataTime = 0;
const unsigned long dataInterval = 1000; // 1 second

// Sensor data structure
struct SensorData {
  float temperature;
  float humidity;
  float pressure;
  float altitude;
  int airQuality;
  unsigned long timestamp;
};

// Callback class for BLE events
class MyServerCallbacks: public BLEServerCallbacks {
    void onConnect(BLEServer* pServer) {
      deviceConnected = true;
      Serial.println("Device connected!");
    };

    void onDisconnect(BLEServer* pServer) {
      deviceConnected = false;
      Serial.println("Device disconnected!");
      // Restart advertising to allow new connections
      pServer->getAdvertising()->start();
    }
};

// Callback class for characteristic events
class MyCallbacks: public BLECharacteristicCallbacks {
    void onWrite(BLECharacteristic *pCharacteristic) {
      std::string rxValue = pCharacteristic->getValue();
      if (rxValue.length() > 0) {
        Serial.println("Received Value: ");
        for (int i = 0; i < rxValue.length(); i++) {
          Serial.print(rxValue[i]);
        }
        Serial.println();
      }
    }
};

void setup() {
  Serial.begin(115200);
  Serial.println("Starting Aeroband ESP32 BLE Sensor...");

  // Initialize I2C for BME280
  Wire.begin(I2C_SDA, I2C_SCL);
  
  // Try to initialize BME280 sensor
  if (bme.begin(0x76)) {
    Serial.println("BME280 sensor found!");
  } else {
    Serial.println("BME280 not found, using simulated data");
  }

  // Create the BLE Device
  BLEDevice::init(DEVICE_NAME);
  Serial.println("BLE Device initialized: " + String(DEVICE_NAME));

  // Create the BLE Server
  pServer = BLEDevice::createServer();
  pServer->setCallbacks(new MyServerCallbacks());

  // Create the BLE Service
  BLEService *pService = pServer->createService(SERVICE_UUID);

  // Create a BLE Characteristic
  pCharacteristic = pService->createCharacteristic(
                      CHARACTERISTIC_UUID,
                      BLECharacteristic::PROPERTY_READ   |
                      BLECharacteristic::PROPERTY_WRITE  |
                      BLECharacteristic::PROPERTY_NOTIFY |
                      BLECharacteristic::PROPERTY_INDICATE
                    );

  pCharacteristic->setCallbacks(new MyCallbacks());

  // Create a BLE Descriptor
  pCharacteristic->addDescriptor(new BLE2902());

  // Start the service
  pService->start();

  // Start advertising
  BLEAdvertising *pAdvertising = BLEDevice::getAdvertising();
  pAdvertising->addServiceUUID(SERVICE_UUID);
  pAdvertising->setScanResponse(false);
  pAdvertising->setMinPreferred(0x0);  // set value to 0x00 to not advertise this parameter
  BLEDevice::startAdvertising();
  
  Serial.println("BLE advertising started!");
  Serial.println("Waiting for connections...");
}

void loop() {
  // Handle BLE connection state changes
  if (!deviceConnected && oldDeviceConnected) {
    delay(500); // give the bluetooth stack the chance to get things ready
    pServer->startAdvertising(); // restart advertising
    Serial.println("Start advertising");
    oldDeviceConnected = deviceConnected;
  }
  
  if (deviceConnected && !oldDeviceConnected) {
    oldDeviceConnected = deviceConnected;
  }

  // Send sensor data periodically when connected
  if (deviceConnected && (millis() - lastDataTime >= dataInterval)) {
    SensorData data = readSensorData();
    sendSensorData(data);
    lastDataTime = millis();
  }
}

SensorData readSensorData() {
  SensorData data;
  
  // Try to read from BME280 sensor
  if (bme.begin(0x76)) {
    data.temperature = bme.readTemperature();
    data.humidity = bme.readHumidity();
    data.pressure = bme.readPressure() / 100.0F; // Convert to hPa
    data.altitude = bme.readAltitude(1013.25); // Standard pressure
  } else {
    // Simulated sensor data
    data.temperature = 22.5 + random(-20, 20) / 10.0;
    data.humidity = 45.0 + random(-10, 10);
    data.pressure = 1013.25 + random(-50, 50) / 10.0;
    data.altitude = 100.0 + random(-20, 20);
  }
  
  // Simulate air quality sensor (CO2 equivalent)
  data.airQuality = 400 + random(-50, 100);
  data.timestamp = millis();
  
  return data;
}

void sendSensorData(SensorData data) {
  // Create JSON string
  String jsonData = "{";
  jsonData += "\"temperature\":" + String(data.temperature, 1) + ",";
  jsonData += "\"humidity\":" + String(data.humidity, 1) + ",";
  jsonData += "\"pressure\":" + String(data.pressure, 1) + ",";
  jsonData += "\"altitude\":" + String(data.altitude, 1) + ",";
  jsonData += "\"airQuality\":" + String(data.airQuality) + ",";
  jsonData += "\"timestamp\":" + String(data.timestamp);
  jsonData += "}";
  
  // Send data via BLE
  pCharacteristic->setValue(jsonData.c_str());
  pCharacteristic->notify();
  
  // Also print to Serial for debugging
  Serial.println("Sent: " + jsonData);
}

/*
 * Alternative data formats you can use:
 * 
 * 1. CSV format:
 * String csvData = String(data.temperature, 1) + "," + 
 *                  String(data.humidity, 1) + "," + 
 *                  String(data.pressure, 1) + "," + 
 *                  String(data.altitude, 1) + "," + 
 *                  String(data.airQuality);
 * 
 * 2. Space-separated format:
 * String spaceData = String(data.temperature, 1) + " " + 
 *                    String(data.humidity, 1) + " " + 
 *                    String(data.pressure, 1) + " " + 
 *                    String(data.altitude, 1) + " " + 
 *                    String(data.airQuality);
 * 
 * 3. Simple text format:
 * String textData = "T:" + String(data.temperature, 1) + 
 *                   " H:" + String(data.humidity, 1) + 
 *                   " P:" + String(data.pressure, 1);
 */ 