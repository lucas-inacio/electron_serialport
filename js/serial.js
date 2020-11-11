const DATA_COUNT = 3;
const DATA_SIZE = 4;

const SerialPort = require('serialport');
const ByteLength = require('@serialport/parser-byte-length');
// const port = new SerialPort('COM3');

// const labels = ['linha1', 'linha2', 'linha3'];
// const parser = port.pipe(new ByteLength({length: DATA_COUNT * DATA_SIZE}));
// parser.on('data', buf => {
//     for (let offset = 0, j = 0; offset < DATA_COUNT * DATA_SIZE && j < labels.length; offset += DATA_SIZE, ++j) {
//         curve.addPoints(labels[j], [buf.readFloatLE(offset)]);
//     }
// });


const DATA_TYPE_MAP = {
    'float': [4, Buffer.prototype.readFloatLE],
    'uint8': [1, Buffer.prototype.readUInt8],
    'uint16': [2, Buffer.prototype.readUInt16LE],
    'uint32': [4, Buffer.prototype.readUInt32LE],
};

class Serial {
    constructor(dataType, dataCount) {
        this.options = {
            autoOpen: true,
            baudRate: 9600,
            dataBits: 8,
            stopBits: 1,
            parity: 'none'
        }
        this.port = null;
        this.parser = null;
        this.onDataCallback = null;

        this.dataCount = dataCount || 1;
        [ this.byteLength, this.dataReadMethod ] = this.selectReadMethod(dataType || 'float');
    }

    setDataLayout(dataType, dataCount) {
        this.dataCount = dataCount;
        [ this.byteLength, this.dataReadMethod ] = this.selectReadMethod(dataType);
    }

    selectReadMethod(dataType) {
        return DATA_TYPE_MAP[dataType];
    }

    config(options) {
        // Sobrescreve this.options com options
        this.options = { ...this.options, ...options };
    }

    open(portName, options) {
        this.port = new SerialPort(portName, options || this.options);
        // this.port = new SerialPort(portName);
        this.parser = this.port.pipe(new ByteLength({ length: this.dataCount * this.byteLength }));
        this.parser.on('data', buf => {
            let data = [];
            for (let offset = 0; offset < this.byteLength * this.dataCount; offset += this.byteLength) {
                data.push(this.dataReadMethod.call(buf, offset));
            }
            this.onDataCallback(data);
        });
    }

    close() {
        if (this.port.isOpen) this.port.close();
    }

    // func deve ser do tipo func([])
    onData(func) {
        this.onDataCallback = func;
    }

}

function ListPorts() {
    return SerialPort.list();
}