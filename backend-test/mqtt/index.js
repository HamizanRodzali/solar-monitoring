'use-strict';

var Data = require('../model/data.model');
var mqtt = require('mqtt');
// var data = require('./data.model');
var socket = undefined;
var dataStream;

var options = {
    port: 18685,
    host: 'mqtt://driver.cloudmqtt.com',
    clientId: 'mqttjs_' + Math.random().toString(16).substr(2, 8),
    username: 'spvjjkqq',
    password: 'hc_7fOQmGQaE',
    keepAlive: 60,
    reconnectPeriod: 1000,
    protocolId: 'MQTT',
    protocolVersion: 4,
    clean: true,
    encoding: 'utf8'
}

var client = mqtt.connect('mqtt://driver.cloudmqtt.com', options);

client.on('connect', function () {
    console.log('Connected to Mosca at ');
    client.subscribe('api-engine');
    client.subscribe('esp/solar');
});

client.on('message', function (topic, message) {

    if (topic === 'esp/solar') {
        var data = message.toString();
        var data1 = JSON.parse(data);
        dataStream = data1;
        Data.create(data1, function (err, data) {
            if (err) return console.error(err);
            // if the record has been saved successfully, 
            // websockets will trigger a message to the web-app
            // console.log('Data Saved :', data.data);
        });
    } else {
        console.log('Unknown topic', topic);
    }

});

client.on('close', () => {
    console.log('mqtt server closed!');
});

client.on('error', (err) => {
    console.log(err);
});

exports.register = function (_socket) {
    socket = _socket;
}

function onSave(doc) {
    if (!socket) return; // if no client is connected
    // send data to only the intended device
    socket.emit('data:save:' + doc.macAddress, doc);
}


module.exports.onSave = onSave;
