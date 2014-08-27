var markov  = require("markov");
var m       = markov(1);
var redis   = require("redis");
var client  = redis.createClient();

var msgs = [];

client.on("error", function (err) {
  console.error("Error " + err);
});

function getRandom(callback) {
  client.RANDOMKEY([], function (err, resp) {
    if (err) return callback(err);
    client.get(resp, callback);
  });
}

function getPhrase(poolSize, phraseSize, callback) {

  for (var i=0; i<poolSize; i++) {

    getRandom(function (err, message) {

      if (err) return callback(err);

      msgs.push(message);

      if (msgs.length === poolSize) {
        m.seed(msgs.join("\n"));
        var start = m.pick();

        callback(null, m.fill(start, phraseSize).join(" "));

        client.quit();
      }

    });

  }

}

module.exports = getPhrase;
