var express=require('express');
var	bodyParser=require("body-parser");
var app=express();
var server=require('http').createServer(app);
var io=require('socket.io').listen(server);
users=[];
connections=[];

app.use('/public',express.static('public'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({extended:true}));
app.set('view engine','jade');
server.listen(8080);
console.log('Server running...');

app.get('/',function(req,res){
  res.render('index');
});

io.sockets.on('connection',function(socket){

  connections.push(socket);
  console.log('Connected: %s usuarios conectados',connections.length);

  socket.on('disconnect',function(data){
    users.splice(users.indexOf(socket.username),1);
    updateUsernames();
    connections.splice(connections.indexOf(socket),1);
    console.log('Disconnected: %s usuarios conectados',connections.length);
  });

  socket.on('send message',function(data){
    io.sockets.emit('new message',{msg:data,user:socket.username});
  });

  socket.on('new user',function(data,callback){
    callback(true);
    socket.username=data;
    users.push(socket.username);
    updateUsernames();
  });

  socket.on('user image',function(image,data){
    io.sockets.emit('addimage',{msg:data,user:socket.username},image);
  });

  function updateUsernames(){
    io.sockets.emit('get users',users);
  }

});
