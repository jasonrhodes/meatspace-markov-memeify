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


app.post('/service', function(req, res) {

  var imgBuff = dataUriToBuffer(req.body.content.data);
  var img = new Image();
  img.src = imgBuff;

  getPhrase(10, 3, function (error, phrase) {

    if (error) return console.log(error);

    var text = phrase.toUpperCase();

    var canvas = new Canvas(img.width, img.height);
    var ctx = canvas.getContext('2d');
    ctx.textAlign = 'left';
    ctx.textBaseline = 'bottom';
    ctx.fillStyle = "#ffffff";

    var fontsize = img.width;
    ctx.font = fontsize + 'px Impact';
    var textInfo = ctx.measureText(text);

    while (textInfo.width >= (img.width - 60)) {
      fontsize -= 5;
      ctx.font = fontsize + 'px Impact';
      textInfo = ctx.measureText(text);
    }

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
