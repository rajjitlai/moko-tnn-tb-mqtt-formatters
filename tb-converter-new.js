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

// If payload is passed as string, decode it to JSON
var data = decodeToJson(payload);

// Initialize the array to collect processed scan data
var processedScanData = [];

// Loop through scan_data array
for (var i = 0; i < data.scan_data.length; i++) {
    var beacon = data.scan_data[i];

    processedScanData.push({
        mac: beacon.mac,
        battery_voltage: beacon.battery_voltage,
        batt_vol: beacon.batt_vol,
        temperature: beacon.temperature,
        humility: beacon.humility,
        rssi: beacon.rssi,
        adv_interval: beacon.adv_interval,
        tx_power: beacon.tx_power,
        ranging_data: beacon.ranging_data,
        beacon_type: beacon.beacon_type,
        type_code: beacon.type_code,
        timezone: beacon.timezone,
        current_time: beacon.current_time,
        timestamp: beacon.timestamp
    });
}

// Return full telemetry object for ThingsBoard
return {
    beacon_number: data.beacon_number,
    packet_sequence: data.packet_sequence,
    port: data.port,
    time: data.time,
    timestamp: data.timestamp,
    scan_data: processedScanData
};