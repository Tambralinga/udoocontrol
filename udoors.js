var	udoo = require('udoo')
, SerialPort = require('serialport').SerialPort;
var portName = "/dev/ttymxc3";
var serialPort= new SerialPort(portName, {
        baudrate: 9600,
         dataBits: 8,
         parity: 'none',
         stopBits: 1,
         flowControl: false
});
udoo.reset();
var led10=udoo.outputPin(10);
var led11=udoo.outputPin(11);
var led12=udoo.outputPin(12);
led10.set(0);
led11.set(0);
led12.set(0);
setTimeout(function () {
serialPort.write(0 + 'P');
},500);