module.exports.setFont = setFont;
module.exports.sizeTextToFit = sizeTextToFit;
module.exports.createMemeContext = createMemeContext;

function setFont(size, face) {
  return size + "px " + face;
};

function sizeTextToFit(ctx, text, img, options) {

  var half = img.width / 2;
  var size = (half && (half > 100)) ? half : 100;
  var face = options.face || "Impact";
  var pad = options.pad || 60;

  ctx.font = setFont(size, face);

  var info = ctx.measureText(text);

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
  ctx.strokeStyle = "#000000";
  ctx.lineWidth = 2;

  return ctx;

}
