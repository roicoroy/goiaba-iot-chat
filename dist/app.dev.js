"use strict";

var express = require('express');

var app = express();

var cors = require('cors');

var randomColor = require('randomcolor');

var uuid = require('uuid'); //Disable x-powered-by header


app.disable('x-powered-by'); //middlewares
// app.use(express.static('client'));
//routes

app.get('/', function (req, res) {
  res.sendFile(__dirname + '/client/index.html');
}); //Listen on port 5000

server = app.use(cors).listen(process.env.PORT || 5000, function () {
  console.log('server running' + process.env.PORT);
}); //socket.io instantiation

var io = require("socket.io")(server);

var users = [];
var connnections = []; //listen on every connection

io.on('connection', function (socket) {
  console.log('New user connected');
  connnections.push(socket); //initialize a random color for the socket

  var color = randomColor();
  socket.username = 'Anonymous';
  socket.color = color; //listen on change_username

  socket.on('change_username', function (data) {
    var id = uuid.v4(); // create a random id for the user

    socket.id = id;
    socket.username = data.nickName;
    users.push({
      id: id,
      username: socket.username,
      color: socket.color
    });
    updateUsernames();
  }); //update Usernames in the client

  var updateUsernames = function updateUsernames() {
    io.sockets.emit('get users', users);
  }; //listen on new_message


  socket.on('new_message', function (data) {
    //broadcast the new message
    io.sockets.emit('new_message', {
      message: data.message,
      username: socket.username,
      color: socket.color
    });
  }); //listen on typing

  socket.on('typing', function (data) {
    socket.broadcast.emit('typing', {
      username: socket.username
    });
  }); //Disconnect

  socket.on('disconnect', function (data) {
    if (!socket.username) return; //find the user and delete from the users list

    var user = undefined;

    for (var i = 0; i < users.length; i++) {
      if (users[i].id === socket.id) {
        user = users[i];
        break;
      }
    }

    users = users.filter(function (x) {
      return x !== user;
    }); //Update the users list

    updateUsernames();
    connnections.splice(connnections.indexOf(socket), 1);
  });
});
//# sourceMappingURL=app.dev.js.map
