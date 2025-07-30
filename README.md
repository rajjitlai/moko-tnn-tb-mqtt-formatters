## 📡 MOKO → TTN → ThingsBoard (MQTT Formatters)

This repository contains JavaScript payload formatter scripts for integrating **MOKO BLE devices** through **The Things Network (TTN)** into **ThingsBoard** using MQTT or HTTP converters.

These formatters decode raw payloads received from gateways and transform them into structured telemetry suitable for ThingsBoard ingestion and visualization.

---

### 🧠 Objective

> **Master the foundational skill** in building end-to-end IoT solutions:
> **Payload decoding** from sensors → **Clean telemetry** to platforms.

---

### 📁 Repository Structure

```
/
├── README.md                                   ← You're here
├── tb-converter-new.js                         ← Decoder new for TB
├── tb-converyer-old.js                         ← Decoder old for TB
└── thethingsnetworklive-data-decoder.js        ← Payload decoder for TTN
```

---

### ⚙️ Use Case

* **Device**: MOKO BLE beacons or sensors
* **Network Server**: The Things Stack (TTN v3)
* **IoT Platform**: ThingsBoard CE/PE
* **Integration Path**: TTN Webhook → MQTT/HTTP → ThingsBoard Rule Engine
* **Decoder Usage**: Plug into **Uplink Payload Formatter** in TTN

---

### 🛠 How to Use

#### 🧾 In The Things Stack (TTN):

1. Navigate to **Payload Formatters** → **Uplink**.
2. Choose **JavaScript** formatter.
3. Paste the contents of `moko-beacon-decoder.js` or your custom decoder.
4. Save.

> TTN will now automatically decode uplinks and forward structured JSON to ThingsBoard or other destinations.

---

### 🧪 Sample Decoded Output

```json
{
  "deviceName": "f56083d46dh4",
  "deviceType": "BLE Beacon",
  "telemetry": {
    "battery_voltage": 2813,
    "temperature": 29.9,
    "humidity": 66.5,
    "rssi": -28,
    "timestamp": 1753862390
  }
}
```

This output can be parsed directly in **ThingsBoard converters** or passed via **Rule Engine nodes**.

---

### 🎯 Skills Practiced

* Low-level hex payload parsing
* Signed/unsigned bit conversion
* Dynamic telemetry generation
* Virtual device mapping via MAC
* Rule Engine routing in ThingsBoard

---

### 📦 Prerequisites

* Basic knowledge of:

  * JavaScript
  * MQTT / HTTP integrations
  * ThingsBoard Rule Engine
  * The Things Network Console

---

### ✅ Best Practices

* Use **MAC address** (`beacon.mac`) as virtual `deviceName`.
* Always check payload length before parsing.
* Normalize units (`mV`, `°C`, `%RH`) before sending.
* Attach timestamps if available in payload.

---

### 👨‍💻 Author

**Rajjit Laishram**
IoT Software Developer 
