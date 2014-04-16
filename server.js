var express = require('express')
,   app = express()
,   server = require('http').createServer(app)
,   io = require('socket.io').listen(server, { log: false })
,   conf = require('./config.json')
,	udoo = require('udoo')
, 	SerialPort = require('serialport').SerialPort
,	sqlite3 = require('sqlite3').verbose()
,	db = new sqlite3.Database("udoo.db");

var l10st;
var l11st;
var l12st;
var p9st;
var led10=udoo.outputPin(10);
var led11=udoo.outputPin(11);
var led12=udoo.outputPin(12);
var start=0;
var portName = "/dev/ttymxc3";
var serialPort= new SerialPort(portName, {
        baudrate: 9600,
         dataBits: 8,
         parity: 'none',
         stopBits: 1,
         flowControl: false
});        
var receivedData = "";
var sendData = "";
IOSocket();
A0Value();
udoo.reset();

server.listen(conf.port);
app.configure(function(){
	app.use(express.static(__dirname + '/public'));
});

app.get('/', function (req, res) {
	res.sendfile(__dirname + '/public/index.html');
});


setTimeout(function () {
if(start==0)
{
db.each("SELECT sw_1,sw_2,sw_3,p_9 FROM Switches", function(err, row) {
 	led10.set(row.sw_1);
	led11.set(row.sw_2);
	led12.set(row.sw_3);
	serialPort.write(row.p_9 + 'P');	
	l10st=row.sw_1;
	l11st=row.sw_2;
	l12st=row.sw_3;
	p9st=row.p_9;
});
}
},500);

io.configure('production', function(){
	io.set('log level', 0);
	io.set('heartbeats', true);
});

function IOSocket() {
io.sockets.on('connection', function (socket) {
	socket.emit('fromserver1',  {sw1:l10st,sw2:l11st,sw3:l12st,p9:p9st,a0:sendData});
 	socket.emit('onconnection', {pollOneValue:sendData});
  	io.on('update', function(data) {
  	socket.emit('updateData',{pollOneValue:data});
  	});
    socket.on('fromclient',  function (data) {
	if (data.l10==true)
		{
		led10.setHigh();
		l10st=1;	
		}
	if (data.l10==false)
		{
		led10.setLow();
		l10st=0;
		}
	if (data.l11==true)
		{
		led11.setHigh();
		l11st=1;
		}
	if (data.l11==false)
		{
		led11.setLow();
		l11st=0;
		}
	if (data.l12==true)
		{
		led12.setHigh();
		l12st=1;
		}
	if (data.l12==false)
		{
		led12.setLow();
		l12st=0;
		}
	if (data.p9 >= 0)
	{
	serialPort.write(data.p9 + 'P');
	p9st=data.p9;
	}
	console.log(data);
	socket.broadcast.emit('fromserver2',  {sw1:l10st,sw2:l11st,sw3:l12st,p9:p9st});
	db.prepare("UPDATE Switches SET sw_1='"+ l10st +"', sw_2='"+ l11st +"', sw_3='" + l12st + "', p_9='" + p9st +"' WHERE 1").run().finalize();
	});
  });
}

function A0Value() {
    serialPort.on("open", function () {
      console.log('open serial communication');
        serialPort.on('data', function(data) {
             receivedData += data.toString();
          if (receivedData .indexOf('E') >= 0 && receivedData .indexOf('B') >= 0) {
           sendData = receivedData .substring(receivedData .indexOf('B') + 1, receivedData .indexOf('E'));
           receivedData = '';
    	
     	  io.emit('update', sendData);
         }
       });  
    });
}
console.log('Der Server läuft nun auf dem Port ' + conf.port);