var io = require('socket.io-client');
var socket;

var defaults = {
  error: function (err) { console.error(err); },
  data: function (message, info) { console.log(message); }
}

module.exports.connect = function () {
  socket = io.connect("https://chat.meatspac.es");
};

module.exports.on = function (callbacks) {

  if (!socket.on) {
    callbacks.error && callbacks.error("You have to connect first");
    return;
  }

  callbacks.error = callbacks.error || defaults.error;
  callbacks.data = callbacks.data || defaults.data;

  socket.on('connect_error', function (data) {
    callbacks.error(data.error);
  });

  socket.on('message', function (data) {
    var msg = data.chat.value.message;
    callbacks.data(msg, data.chat.value);
  });

};


