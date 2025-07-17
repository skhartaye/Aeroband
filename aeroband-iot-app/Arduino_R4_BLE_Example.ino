/*
 * Arduino R4 WiFi BLE Sensor Data Broadcast Example
 * Compatible with Aeroband IoT Dashboard
 * 
 * This example demonstrates how to:
 * 1. Set up BLE server with ArduinoBLE library
 * 2. Broadcast sensor data in JSON format
 * 3. Handle connections from the web dashboard
 * 
 * Hardware Requirements:
 * - Arduino R4 WiFi
 * - Optional: BME280 sensor for real data
 * - Or use simulated sensor data
 */

#include <ArduinoBLE.h>

// BLE Service and Characteristic UUIDs (matching the dashboard)
BLEService sensorService("4fafc201-1fb5-459e-8fcc-c5c9c331914b");
BLECharacteristic sensorDataChar("beb5483e-36e1-4688-b7f5-ea07361b26a8", 
                                 BLERead | BLENotify, 350);

void setup() {
  Serial.begin(115200);
  while (!Serial);

  pinMode(LED_BUILTIN, OUTPUT);

  if (!BLE.begin()) {
    Serial.println("BLE failed to start.");
    while (1);
  }

  BLE.setLocalName("UNO_R4_Sensor");
  BLE.setAdvertisedService(sensorService);
  sensorService.addCharacteristic(sensorDataChar);
  BLE.addService(sensorService);

  sensorDataChar.writeValue("Waiting for sensor data...");

  BLE.advertise();
  Serial.println("BLE advertising started...");
  Serial.println("Device name: UNO_R4_Sensor");
  Serial.println("Waiting for connections...");
}

void loop() {
  BLEDevice central = BLE.central();

  if (central) {
    Serial.print("Connected to central: ");
    Serial.println(central.address());

    while (central.connected()) {
      digitalWrite(LED_BUILTIN, HIGH);

      // Simulated sensor values (you can replace with real sensor readings)
      float ammoniaPPM = random(0, 1000) / 10.0;
      float temperature = random(200, 350) / 10.0;
      float humidity = random(300, 700) / 10.0;
      float pressure = random(9500, 10500) / 10.0;
      float gas_resistance = random(5, 50);
      unsigned int pm1_0 = random(0, 50);
      unsigned int pm2_5 = random(0, 75);
      unsigned int pm10 = random(0, 100);

      // Prepare JSON payload
      char jsonData[350];
      snprintf(jsonData, sizeof(jsonData),
               "{\"temperature\":%.2f,\"humidity\":%.2f,\"pressure\":%.2f,\"gas_resistance\":%.2f,\"ammonia\":%.2f,\"pm1_0\":%u,\"pm2_5\":%u,\"pm10\":%u}",
               temperature, humidity, pressure, gas_resistance,
               ammoniaPPM, pm1_0, pm2_5, pm10);

      Serial.println(jsonData);

      sensorDataChar.writeValue(jsonData);
      delay(5000); // Send data every 5 seconds

      digitalWrite(LED_BUILTIN, LOW);
    }

    Serial.print("Disconnected from central: ");
    Serial.println(central.address());
  }
}

/*
 * Alternative data formats you can use:
 * 
 * 1. Standard format (compatible with ESP32):
 * snprintf(jsonData, sizeof(jsonData),
 *          "{\"temperature\":%.2f,\"humidity\":%.2f,\"pressure\":%.2f,\"altitude\":%.2f,\"airQuality\":%.0f}",
 *          temperature, humidity, pressure, altitude, ammoniaPPM);
 * 
 * 2. CSV format:
 * snprintf(jsonData, sizeof(jsonData),
 *          "%.2f,%.2f,%.2f,%.2f,%.2f,%u,%u,%u",
 *          temperature, humidity, pressure, gas_resistance, ammoniaPPM, pm1_0, pm2_5, pm10);
 * 
 * 3. Space-separated format:
 * snprintf(jsonData, sizeof(jsonData),
 *          "%.2f %.2f %.2f %.2f %.2f %u %u %u",
 *          temperature, humidity, pressure, gas_resistance, ammoniaPPM, pm1_0, pm2_5, pm10);
 */

/*
 * To add real sensors:
 * 
 * 1. BME280 Temperature/Humidity/Pressure Sensor:
 * #include <Wire.h>
 * #include <Adafruit_Sensor.h>
 * #include <Adafruit_BME280.h>
 * 
 * Adafruit_BME280 bme;
 * 
 * void setup() {
 *   Wire.begin();
 *   if (!bme.begin(0x76)) {
 *     Serial.println("BME280 not found!");
 *   }
 * }
 * 
 * // In loop():
 * float temperature = bme.readTemperature();
 * float humidity = bme.readHumidity();
 * float pressure = bme.readPressure() / 100.0F;
 * 
 * 2. MQ137 Ammonia Sensor:
 * // Connect to analog pin A0
 * float ammoniaPPM = analogRead(A0) * (5.0 / 1023.0) * 100; // Convert to PPM
 * 
 * 3. PMS5003 Particulate Matter Sensor:
 * // Use Serial1 for PMS5003
 * Serial1.begin(9600);
 * // Read PM data from Serial1
 */ 