var nconf = require('nconf');
var bodyParser = require('body-parser');
var dataUriToBuffer = require('data-uri-to-buffer');
var express = require('express');
var app = express();
var getPhrase = require("./lib/getPhrase");
// var fs = require("fs");

var Canvas = require("canvas");
var Image = Canvas.Image;


nconf.argv().env().file({ file: 'local.json'});

app.use(bodyParser.json({ limit: '2mb' }));
app.use(express.static(__dirname + '/public'));

app.get('/', function(req, res) {
  res.sendFile( __dirname + '/index.html');
});

function setFont(size, face) {
  return size + "px " + face;
};

function sizeTextToFit(ctx, text, img, options) {

  var size = options.start || img.width / 2;
  var face = options.face || "Impact";
  var pad = options.pad || 60;

  console.log("font size", size);

  ctx.font = setFont(size, face);

  var info = ctx.measureText(text);

  // console.log(info.width, img.width - pad, size);

  while (info.width >= (img.width - pad)) {
    size -= 5;
    ctx.font = setFont(size, face);
    info = ctx.measureText(text);
  }

  return { size: size, width: info.width };

}

function createMemeContext(canvas, options) {

  var ctx = canvas.getContext('2d');

  ctx.textAlign = options.align || 'left';
  ctx.textBaseline = options.baseline || 'bottom';
  ctx.fillStyle = options.color || "#ffffff";

  return ctx;

}


app.post('/service', function(req, res) {

  var imgBuff = dataUriToBuffer(req.body.content.data);
  var img = new Image();
  img.src = imgBuff;

  getPhrase(10, 3, function (error, phrase) {

    if (error) return console.log(error);

    var text = phrase.toUpperCase();
    console.log("Text to add:", text);

    var canvas = new Canvas(img.width, img.height);
    var ctx = createMemeContext(canvas, {
      align: "left",
      baseline: "bottom",
      color: "#ffffff"
    });

    var textInfo = sizeTextToFit(ctx, text, img, {
      pad: 60,
      face: "Impact"
    });

    ctx.drawImage(img, 0, 0, img.width, img.height);
    ctx.fillText(text, (img.width - textInfo.width) / 2, img.height - 20);

    var dataUri = canvas.toDataURL();
    req.body.content.data = dataUri;
    req.body.content.type = imgBuff.type;
    res.json(req.body);

  });

});

var port = nconf.get('port');
app.listen(port);
console.log('server running on port: ', port);
