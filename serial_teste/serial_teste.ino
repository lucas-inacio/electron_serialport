const int DATA_SIZE = 3;

void setup() {
  Serial.begin(9600, SERIAL_8N1);
  delay(50);
  randomSeed(analogRead(A1));
}


float last = 0;
void loop() {
  last += 0.1;
  float valores[DATA_SIZE] = { 0.0 };
//  for (int i = 0; i < DATA_SIZE; ++i) {
//    valores[i] = sin(last);
//  }
  valores[0] = 1 + sin(last);
  valores[1] = 1 + cos(last);
  valores[2] = 2 + 2 * sin(last + 0.3);

  for (int i = 0; i < DATA_SIZE; ++i) {
    byte* valor = (byte*)&valores[i];
    for (int j = 0; j < sizeof(float); ++j)
      Serial.write(valor[j]);
  }
//  int number = random(1024);
//  Serial.write(number & 0xFF);
//  Serial.write((number >> 8) & 0xFF);
  //Serial.write(0);
  //Serial.write(1);
  delay(100);
}
