var fs          = require("fs");
var shasum      = require("sha1");
var redis       = require("redis");
var client      = redis.createClient();
var meatReader  = require("./lib/meatReader");
var validations = require("./validations");

client.on("error", function (err) {
  console.error("Error " + err);
});

validations.exclude = validations.exclude.map(function (v) {
  return new RegExp(v);
});

function save(message, info) {

  var ttl = 60 * 60 * 24;
  var key = shasum(info.fingerprint + message);
  client.set(key, message, "EX", ttl) && console.log("entered", message);

};

function validate(message) {

  var valid = true;

  for(var i=0; i < validations.exclude.length; i++) {
    var v = validations.exclude[i];
    if (v.test(message)) {
      valid = false;
      break;
    }
  }

  return valid;

};

meatReader.connect();

meatReader.on({
  data: function(message, info) {
    validate(message) && save(message, info);
  }
});
