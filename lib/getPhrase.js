var markov  = require("markov");
var m       = markov(1);
var redis   = require("redis");

function getRedisClient() {

  var client  = redis.createClient();

  client.on("error", function (err) {
    console.error("Redis client error " + err);
  });

  return client;
}

function getRandom(callback) {

  var client = getRedisClient();

  client.RANDOMKEY(function (err, resp) {
    if (err) return callback(err);
    client.get(resp, callback);
    client.quit();
  });

}

function getPhrase(poolSize, phraseSize, callback) {

  var msgs = [];

  for (var i=0; i<poolSize; i++) {

    getRandom(function (err, message) {

      if (err) return callback(err);

      msgs.push(message);

      if (msgs.length >= poolSize) {
        m.seed(msgs.join("\n"));
        var start = m.pick();
        callback(null, m.fill(start, phraseSize).join(" "));
      }

    });

  }

}

module.exports = getPhrase;
