"use strict";

$(function () {
  //make connection
  var socket = io.connect('http://localhost:5000'); //buttons and inputs

  var message = $("#message");
  var send_message = $("#send_message");
  var chatroom = $("#chatroom");
  var feedback = $("#feedback");
  var usersList = $("#users-list");
  var nickName = $("#nickname-input"); //Emit message
  // If send message btn is clicked

  send_message.click(function () {
    socket.emit('new_message', {
      message: message.val()
    });
  }); // Or if the enter key is pressed

  message.keypress(function (e) {
    var keycode = e.keyCode ? e.keyCode : e.which;

    if (keycode == '13') {
      socket.emit('new_message', {
        message: message.val()
      });
    }
  }); //Listen on new_message

  socket.on("new_message", function (data) {
    feedback.html('');
    message.val(''); //append the new message on the chatroom

    chatroom.append("\n                        <div>\n                            <div class=\"box3 sb14\">\n                              <p style='color:".concat(data.color, "' class=\"chat-text user-nickname\">").concat(data.username, "</p>\n                              <p class=\"chat-text\" style=\"color: rgba(0,0,0,0.87)\">").concat(data.message, "</p>\n                            </div>\n                        </div>\n                        "));
    keepTheChatRoomToTheBottom();
  }); //Emit a username

  nickName.keypress(function (e) {
    var keycode = e.keyCode ? e.keyCode : e.which;

    if (keycode == '13') {
      socket.emit('change_username', {
        nickName: nickName.val()
      });
      socket.on('get users', function (data) {
        var html = '';

        for (var i = 0; i < data.length; i++) {
          html += "<li class=\"list-item\" style=\"color: ".concat(data[i].color, "\">").concat(data[i].username, "</li>");
        }

        usersList.html(html);
      });
    }
  }); //Emit typing

  message.on("keypress", function (e) {
    var keycode = e.keyCode ? e.keyCode : e.which;

    if (keycode != '13') {
      socket.emit('typing');
    }
  }); //Listen on typing

  socket.on('typing', function (data) {
    feedback.html("<p><i>" + data.username + " is typing a message..." + "</i></p>");
  });
}); // function thats keeps the chatbox stick to the bottom

var keepTheChatRoomToTheBottom = function keepTheChatRoomToTheBottom() {
  var chatroom = document.getElementById('chatroom');
  chatroom.scrollTop = chatroom.scrollHeight - chatroom.clientHeight;
};
//# sourceMappingURL=chat.dev.js.map
