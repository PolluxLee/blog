var app = require('express')();
var http = require('http').Server(app);
var path = require('path');
var io = require('socket.io')(http);
var port = 1221;

var count = 0;
var userlist = [];

app.get('/', function(req, res){
  res.sendFile(path.resolve(__dirname, '../client') + '/index.html');
});

io.on('connection', function(socket){
  console.log('a user connected');
  count++;
  io.emit('user', count);

  socket.on('disconnect', function(){
    count--;
    io.emit('user', count);
    console.log('user disconnected');
  });

  socket.on('msg', function(msg){
    console.log('server receive',JSON.stringify(msg))
    io.emit('msg', msg);
  });
});

http.listen(port, function(){
  console.log(`listening on *:${port}`);
});