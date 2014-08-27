var markov = require("markov");
var m = markov(1);
var getMeats = require("./getNMeats");
var request = require("request");
var cheerio = require("cheerio");

module.exports.getPhrase = function (callback) {

  getMeats(8, function (error, meats) {

    if (error) return callback(error);

    m.seed(meats.join("\n"));
    var key = m.pick();

    console.log('key', key);

    callback(null, m.fill(key, 4).join(" "));

  });

};

module.exports.getWiki = function (callback) {

  request.get("http://en.wikipedia.org/wiki/Special:Random", function (err, resp, html) {
    // console.dir($(resp).find("#content"));
    var $ = cheerio.load(html);
    console.dir($("#content").text().replace("\n", ""));
  });

}

