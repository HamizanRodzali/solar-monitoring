#include <ESP8266WiFi.h>
#include <PubSubClient.h>
#include <ArduinoJson.h>
#include "DHT.h"

const char* ssid = "MY Wi-Fi";
const char* password =  "Shuhaizal19";
const char* mqtt_server = "driver.cloudmqtt.com";
const int   mqtt_port = 18685;
const char* mqtt_user = "spvjjkqq";
const char* mqtt_pass = "hc_7fOQmGQaE";

#define DHTTYPE DHT22   // DHT 11
#define dht_dpin D6      //GPIO-0 D3 pin of nodemcu
WiFiClient espClient;
PubSubClient client(espClient);

int sensorPin = A0;
int sensorValue1 = 0;
int sensorValue2 = 0;
int sensorValue3 = 0;
int sensorValue4 = 0;
int light = 0;
#define S0 D0
#define S1 D1
#define S2 D2
#define S3 D3
DHT dht(dht_dpin, DHTTYPE);
long now = millis();
long lastMeasure = 0;

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
    if (client.connect("ESP8266Ultrasonic", mqtt_user, mqtt_pass)) {
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

void setup() {
  // Debug console
  Serial.begin(115200);
  setup_wifi();
  pinMode(S0, OUTPUT);
  pinMode(S1, OUTPUT);
  pinMode(S2, OUTPUT);
  pinMode(S3, OUTPUT);
  pinMode(LED_BUILTIN, OUTPUT);
  dht.begin();
  client.setServer(mqtt_server, mqtt_port);
  client.setCallback(callback);
  client.setKeepAlive(300);
  delay(10);
}

void loop() {
  // Reconnecting.......
  if (!client.connected()) {
    reconnect();
  }
  if (!client.loop()) {
    client.connect("ESP8266lights", mqtt_user, mqtt_pass);
  }

  now = millis();
  if (now - lastMeasure > 10000) {
    lastMeasure = now;
    int light = 0;
    //digitalWrite(ON_OFF, HIGH);
    float lm35 = 0.0; // lm35 sensor
    float h = 0.0; //Humidity level
    float t = 0.0; //Temperature in celcius
    float f = 0.0; //Temperature in fahrenheit

    int i = 0;
    h = dht.readHumidity();    //Read humidity level
    t = dht.readTemperature(); //Read temperature in celcius
    // f = (h * 1.8) + 32;        //Temperature converted to Fahrenheit

    digitalWrite(S0, LOW);
    digitalWrite(S1, LOW);
    digitalWrite(S2, LOW);
    digitalWrite(S3, LOW);
    // Serial.print("Sensor LM35 ");
    sensorValue1 = (analogRead(sensorPin)); delay(1);
    float millivolts = (sensorValue1/1024.0) * 3300;
    float celsius = millivolts/10;
    float fahrenheit = ((celsius * 9)/5 + 32);
    lm35 = celsius;
    // -------------------------------------------------
    digitalWrite(S0, HIGH);
    digitalWrite(S1, LOW);
    digitalWrite(S2, LOW);
    digitalWrite(S3, LOW);
    //  Serial.print("Light ");
    sensorValue2 = (analogRead(sensorPin)); delay(1);
    light = map(sensorValue2, 0, 1024, 0, 100);;
    // -------------------------------------------------
    digitalWrite(S0, LOW);
    digitalWrite(S1, HIGH);
    digitalWrite(S2, LOW);
    digitalWrite(S3, LOW);
    // Serial.print("VT ");
    int vt_read = analogRead(sensorPin); delay(1);
    float voltage = vt_read * (3.3 / 1024.0) * 3.3;
    // light = map(sensorValue3, 0, 1023, 10, 0);
    // ---------------------------------------------------
    digitalWrite(S0, HIGH);
    digitalWrite(S1, HIGH);
    digitalWrite(S2, LOW);
    digitalWrite(S3, LOW);
    // Serial.print("VT ");
    int at_read = analogRead(sensorPin); delay(1);
    float current = (at_read * (3.3 / 1024.0)) * 1000;
    // ---------------------------------------------------

    delay(10);

    // Send JSON to mqtt broker
    StaticJsonBuffer<300> JSONbuffer;
    JsonObject& root = JSONbuffer.createObject();

    root["macAddress"] = WiFi.macAddress();
    JsonObject& data = root.createNestedObject("data");
    data["light"] = light;
    data["current"] = current;
    data["voltage"] = voltage;
    data["LM35"] = lm35;
    data["humd"] = h;
    data["temp"] = t;

    char JSONmessageBuffer[200];
    root.printTo(JSONmessageBuffer, sizeof(JSONmessageBuffer));
    Serial.println("Sending message to MQTT topic..");
    //  Serial.println(JSONmessageBuffer);
    root.printTo(Serial);

    if (client.publish("esp/solar", JSONmessageBuffer) == true) {
      digitalWrite(LED_BUILTIN, HIGH);
      Serial.println("Success sending message");
    } else {
      Serial.println("Error sending message");
    }

    Serial.println("-------------");
  }


  //  delay(10000);

}
