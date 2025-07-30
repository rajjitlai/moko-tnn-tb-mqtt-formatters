/** Decoder **/
// decode payload to string
var payloadStr = decodeToString(payload);
// decode payload to JSON
var data = decodeToJson(payload);

// Gateway device name mapping
var gatewayNameMap = {
    "lw00b-1870": "ble probe 1870",
    "lw003-f4ab": "ble probe f4ab",
    "2cb6":"ble probe 2cb6"
};

// Extract telemetry data for the gateway (battery, rssi, channel_rssi only)
var gatewayDeviceId = data.end_device_ids ? data.end_device_ids.device_id : 'unknown';
var gatewayName = gatewayNameMap[gatewayDeviceId] || gatewayDeviceId;

// Collect beacon MACs with their latest RSSI values
var beaconMacs = [];
var beaconRssiMap = {};
if (data && data.uplink_message && data.uplink_message.decoded_payload && data.uplink_message.decoded_payload.scan_data) {
    var scanData = data.uplink_message.decoded_payload.scan_data;
    var uniqueMacs = {};
    
    for (var i = 0; i < scanData.length; i++) {
        var entry = scanData[i];
        if (entry.mac && !uniqueMacs[entry.mac]) {
            uniqueMacs[entry.mac] = true;
            beaconMacs.push(entry.mac);
            beaconRssiMap[entry.mac] = entry.rssi; // Store latest RSSI for each MAC
        }
    }
}

var gatewayData = {
    deviceName: gatewayName,
    deviceType: 'AL_Gateway',
    telemetry: [{
        timestamp: Date.now(),
        device_id: gatewayDeviceId, // Add device ID
        battery: data.uplink_message && data.uplink_message.last_battery_percentage ? data.uplink_message.last_battery_percentage.value : null,
        rssi: data.uplink_message && data.uplink_message.rx_metadata && data.uplink_message.rx_metadata[0] ? data.uplink_message.rx_metadata[0].rssi : null,
        channel_rssi: data.uplink_message && data.uplink_message.rx_metadata && data.uplink_message.rx_metadata[0] ? data.uplink_message.rx_metadata[0].channel_rssi : null,
        beacon_mac: beaconMacs, // Add beacon MACs as telemetry
        beacon_rssi: beaconRssiMap, // Add MAC to RSSI mapping
        beacon_count: beaconMacs.length // Optional: add count of detected beacons
    }]
};

var beaconsData = [];
var beaconsMap = {};

// MAC address to device name mapping
var deviceNameMap = {
    "f56083df6169": "test beacon"
};

// Process beacon data (using MAC name mapping, decode RSSI, timestamp, and battery voltage)
if (data && data.uplink_message && data.uplink_message.decoded_payload && data.uplink_message.decoded_payload.scan_data) {
    var scanData = data.uplink_message.decoded_payload.scan_data;
    
    for (var i = 0; i < scanData.length; i++) {
        var entry = scanData[i];
        var beaconMac = entry.mac;
        var beaconName = deviceNameMap[beaconMac] || beaconMac;
        
        if (!beaconsMap[beaconMac]) {
            var beaconEntry = {
                deviceName: beaconName,
                deviceType: 'AL_Wristband',
                telemetry: []
            };
            beaconsMap[beaconMac] = beaconEntry;
            beaconsData.push(beaconEntry);
        }
        
        // Calculate battery percentage (3000mV = 100%)
        var batteryPercentage = (entry.batt_vol / 3000) * 100;
        batteryPercentage = Math.min(100, Math.max(0, batteryPercentage)); // Clamp between 0-100
        
        beaconsMap[beaconMac].telemetry.push({
            timestamp: entry.timestamp,
            rssi_beacon: entry.rssi,
            battery_voltage: entry.batt_vol,
            mac: entry.mac,
            batteryLevel: batteryPercentage
        });
    }
}

// Combine gateway data and beacons data into result array
var result = [gatewayData];
for (var j = 0; j < beaconsData.length; j++) {
    result.push(beaconsData[j]);
}

/** Helper functions **/
function decodeToString(payload) {
    return String.fromCharCode.apply(String, payload);
}

function decodeToJson(payload) {
    try {
        return JSON.parse(decodeToString(payload));
    } catch (e) {
        return null;
    }
}

return result;