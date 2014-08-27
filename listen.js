var fs          = require("fs");
var shasum      = require("sha1");
var redis       = require("redis");
var client      = redis.createClient();
var meatreader  = require("./lib/readmeats");
var validations = require("./validations");

client.on("error", function (err) {
  console.error("Error " + err);
});

validations.exclude = validations.exclude.map(function (v) {
  return new RegExp(v);
});

function save(message, info) {

  var key = shasum(info.fingerprint + message);
  client.set(key, message) && console.log("entered", message);

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

  // valid ? console.log("yes", message) : console.log("no", message);
  return valid;

};

// fs.readFile("./validations.json", function (err, validations) {

  meatreader.connect();

  meatreader.on({
    data: function(message, info) {
      validate(message) && save(message, info);
    }
  });

// });


