const DATA_COUNT = 3;
const DATA_SIZE = 4;

const SerialPort = require('serialport');
const ByteLength = require('@serialport/parser-byte-length');
const port = new SerialPort('COM3');

const labels = ['linha1', 'linha2', 'linha3'];
const parser = port.pipe(new ByteLength({length: DATA_COUNT * DATA_SIZE}));
parser.on('data', buf => {
    for (let offset = 0, j = 0; offset < DATA_COUNT * DATA_SIZE && j < labels.length; offset += DATA_SIZE, ++j) {
        curve.addPoints(labels[j], [buf.readFloatLE(offset)]);
    }
});