#include <WiFi.h>
#include <PubSubClient.h>
#include <ArduinoJson.h>
#include "DHT.h"
#include "ACS712.h"
#include "LM35.h"
#define DHTPIN 16
#define DHTTYPE DHT22

const char* ssid = "SHA-256";
const char* password =  "pass1234";
const char* mqtt_server = "192.168.30.244";
const int mqtt_port = 1883;
const char* mqttUser = "";
const char* mqttPassword = "";

// set sensor pin
const int lightPin = 36;
const int currentPin = 34;
const int voltPin = 39;
const int LM35PIN = 35;

// calculate volt sensor
int voltVal = 0;
float vOUT = 0.0;
float vIN = 0.0;
float R1 = 30000.0;
float R2 = 7500.0;

WiFiClient espClient;
PubSubClient client(espClient);

DHT dht(DHTPIN, DHTTYPE);
//ACS712  ACS(currentPin, 5.0, 1023, 100);
ACS712 current(ACS712_05B, currentPin);
LM35 lm35(LM35PIN);

// Setup wifi
void setup_wifi() {
  delay(10);
  // We start by connecting to a WiFi network
  Serial.println();
  Serial.print("Connecting to ");
  Serial.println(ssid);
  WiFi.begin(ssid, password);
  while (WiFi.status() != WL_CONNECTED) {
    delay(500);
    Serial.print(".");
  } 
  Serial.println("");
  Serial.print("WiFi connected - ESP IP address: ");
  Serial.println(WiFi.localIP());
} 

// MQTT callback
void callback(String topic, byte* message, unsigned int length) {
  Serial.print("Message arrived on topic: ");
  Serial.print(topic);
  Serial.print(". Message: ");
  String messageTemp;
  for (int i = 0; i < length; i++) {
    Serial.print((char)message[i]);
    messageTemp += (char)message[i];
  }
  Serial.println();
}

void reconnect() {
// Loop until we're reconnected
  while (!client.connected()) {
    Serial.print("Attempting MQTT connection...");
    // Attempt to connect
    if (client.connect("ESP8266Ultrasonic")) {
      Serial.println("connected");
    } 
    else {
      Serial.print("failed, rc=");
      Serial.print(client.state());
      Serial.println(" try again in 5 seconds");
      // Wait 5 seconds before retrying
      delay(5000);
    }
  }
} 

void setup()
{
  Serial.begin(115200);
  setup_wifi();
  client.setServer(mqtt_server, mqtt_port);
  client.setCallback(callback);
  dht.begin();
  //  ACS.autoMidPoint();
  current.calibrate();
}

void loop() {
  if (!client.connected()) {
    reconnect();
  }
  if (!client.loop()) {
    client.connect("ESP8266lights");
  }
  
  //  get light sensor value
  int lightVal = analogRead(lightPin);

  //  get current sensor value
  //  int mA = ACS.mA_DC();
  float mA = current.getCurrentDC();
  //  adcValue = analogRead(currentPin);
  //  adcVoltage = (adcValue / 1024.0) * 5000;
  //  currentValue = ((adcVoltage - offsetVoltage) / sensitivity);

  //  get voltage sensor value
  voltVal = analogRead(voltPin);
  vOUT = (voltVal * 5.5) / 1024.0;
  vIN = vOUT / (R2 / (R1 + R2));

  // get temperature and humidity sensor value
  float humi = dht.readHumidity();
  float temp = dht.readTemperature();

  // Send JSON to mqtt broker
  StaticJsonBuffer<300> JSONbuffer;
  JsonObject& root = JSONbuffer.createObject();

  root["macAddress"] = WiFi.macAddress();
  JsonObject& data = root.createNestedObject("data");  
  data["light"] = String(lightVal);
  data["current"] = String(mA);
  data["voltage"] = String(vOUT);
  data["LM35"] = String(lm35.cel());
  data["humd"] = String(humi);
  data["temp"] = String(temp);

  char JSONmessageBuffer[200];
  root.printTo(JSONmessageBuffer, sizeof(JSONmessageBuffer));
  Serial.println("Sending message to MQTT topic..");
  Serial.println(JSONmessageBuffer);

  if (client.publish("esp/test", JSONmessageBuffer) == true) {
    Serial.println("Success sending message");
  } else {
    Serial.println("Error sending message");
  }

   Serial.println("-------------");

  //  Serial.println(String(lightVal) + "," + String(currentValue) + "," + String(vIN) + "," + String(temperature) + "," + String(humi) + "," + String(temp));
//  Serial.println("Light sensor: " + String(lightVal));
//  Serial.println("Current sensor: " + String(mA));
//  Serial.println("Voltage sensor: " + String(vOUT));
//  Serial.println("LM35: " + String(lm35.cel()));
//  Serial.println("Humidity: " + String(humi));
//  Serial.println("Temp: " + String(temp));
//  Serial.println("---------------------------------------------");
  delay(5000);

}
