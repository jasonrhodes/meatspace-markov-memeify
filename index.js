var nconf = require('nconf');
var bodyParser = require('body-parser');
var dataUriToBuffer = require('data-uri-to-buffer');
var express = require('express');
var app = express();
var getPhrase = require("./lib/getPhrase");
var memer = require("./lib/canvasMemer");

var Canvas = require("canvas");
var Image = Canvas.Image;

nconf.argv().env().file({ file: 'local.json'});

app.use(bodyParser.json({ limit: '1mb' }));
app.use(express.static(__dirname + '/public'));

app.get('/', function(req, res) {
  res.sendFile( __dirname + '/index.html');
});

app.post('/service', function(req, res) {

  var imgBuff = dataUriToBuffer(req.body.content.data);
  var img = new Image();
  img.src = imgBuff;

  getPhrase(10, 3, function (error, phrase) {

    // On error, pass through original image
    if (error) {
      console.log(error);
      req.body.meta = req.body.meta || {};
      req.body.meta.error = error;
      return res.json(req.body);
    }

    var text = phrase.toUpperCase();
    console.log("Text to add:", text);

    var canvas = new Canvas(img.width, img.height);
    var ctx = memer.createMemeContext(canvas, {
      align: "left",
      baseline: "bottom",
      color: "#ffffff"
    });

    var textInfo = memer.sizeTextToFit(ctx, text, img, {
      pad: 60,
      face: "Impact"
    });

    ctx.drawImage(img, 0, 0, img.width, img.height);
    ctx.fillText(text, (img.width - textInfo.width) / 2, img.height - 20);
    ctx.strokeText(text, (img.width - textInfo.width) / 2, img.height - 20);

    var dataUri = canvas.toDataURL();

    req.body.content.data = dataUri;
    req.body.content.type = imgBuff.type;
    res.json(req.body);

  });

});

var port = nconf.get('port');
app.listen(port);
console.log('server running on port: ', port);
