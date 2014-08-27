var meatreader = require("./readmeats");

module.exports = function (n, callback) {

  var meats = [];
  var returned = false;

  setTimeout(function () {
    if (!returned) {
      returned = true;
      callback("Timeout, not enough data returned");
    }
  }, n * 1500);

  meatreader.connect();
  meatreader.on({
    error: function (error) { callback(error); },
    data: function (message) {

      if (message !== " " && !/^http/.test(message)) {
        meats.push(message);
      }

      if (!returned && meats.length > n) {
        returned = true;
        callback(null, meats);
      }

    }
  })
}
