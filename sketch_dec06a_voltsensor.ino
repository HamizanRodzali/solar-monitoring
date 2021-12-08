#include "DHT.h"
#include "ACS712.h"
#include "LM35.h"
#define DHTPIN 16
#define DHTTYPE DHT22

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

DHT dht(DHTPIN, DHTTYPE);
//ACS712  ACS(currentPin, 5.0, 1023, 100);
ACS712 current(ACS712_05B, currentPin);
LM35 lm35(LM35PIN);

void setup()
{
  Serial.begin(9600);
  dht.begin();
  //  ACS.autoMidPoint();
  current.calibrate();
}

void loop()
{
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

  //  Serial.println(String(lightVal) + "," + String(currentValue) + "," + String(vIN) + "," + String(temperature) + "," + String(humi) + "," + String(temp));
  Serial.println("Light sensor: " + String(lightVal));
  Serial.println("Current sensor: " + String(mA));
  Serial.println("Voltage sensor: " + String(vOUT));
  Serial.println("LM35: " + String(lm35.cel()));
  Serial.println("Humidity: " + String(humi));
  Serial.println("Temp: " + String(temp));
  Serial.println("---------------------------------------------");
  delay(5000);

}
