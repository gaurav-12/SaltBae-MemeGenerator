drawBackgroundImage = (canvas, ctx, textCanvas) => {
    ctx.fillStyle = 'white';
    ctx.fillRect(0, 0, canvas.width, canvas.height);

    ctx.drawImage(document.getElementById('bgimage'), 0, 0, canvas.width, canvas.height);
    ctx.drawImage(textCanvas, 0, 0);

    ctx.strokeStyle = 'white';
    ctx.lineWidth = 4;
    ctx.strokeRect(0, 0, canvas.width, canvas.height);
}


const textSize = 30;
onload = function() {
    const canvas = document.getElementById('canvas');
    canvas.height = 700;
    canvas.width = 450;
    const ctx = canvas.getContext('2d');

    const watermarkText = document.getElementById('watermarkText');
    opSlider = document.getElementById('opacitySlider');
    colorPicker = document.getElementById('colorPicker');

    const textCanvas = document.createElement('canvas');
    textCanvas.height = canvas.height;
    textCanvas.width = canvas.width;

    const textCtx = textCanvas.getContext('2d');
    textCtx.globalAlpha = opSlider.value;

    textCtx.font = "bold " + textSize + "px Arial";
    textCtx.fillStyle = colorPicker.value;
    textCtx.textBaseline = "top";
    textCtx.textAlign = "center"
    textCtx.fillText(watermarkText.value, canvas.width/2, canvas.height/2);

    drawBackgroundImage(canvas, ctx, textCanvas);

    const a = document.getElementById('downloadLink')
    a.addEventListener('click', function () {
        a.download = 'watermarked-' + Date.now()
        a.href = canvas.toDataURL('image/jpeg');
    }, false)

    watermarkText.addEventListener('keyup', (e) => {
        textCtx.clearRect(0, 0, textCanvas.width, textCanvas.height);
        textCtx.fillText(e.target.value.trim(), canvas.width/2, canvas.height/2);

        drawBackgroundImage(canvas, ctx, textCanvas);
    });

    opSlider.addEventListener('input', (e) => {
        textCtx.clearRect(0, 0, textCanvas.width, textCanvas.height);
        textCtx.globalAlpha = e.target.value;
        textCtx.fillText(watermarkText.value, canvas.width/2, canvas.height/2);

        drawBackgroundImage(canvas, ctx, textCanvas);
    });

    colorPicker.addEventListener('input', (e) => {
        textCtx.clearRect(0, 0, textCanvas.width, textCanvas.height);
        textCtx.fillStyle = e.target.value;
        textCtx.fillText(watermarkText.value, canvas.width/2, canvas.height/2);

        drawBackgroundImage(canvas, ctx, textCanvas);
    });
}