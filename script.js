const BOTTOM_PADDING = 120;
const TEXT_PADDING = 15;
const LINE_HEIGHT = 25;

function getRandomInt(min, max) {
    min = Math.ceil(min);
    max = Math.floor(max);
    return Math.floor(Math.random() * (max - min)) + min; //The maximum is exclusive and the minimum is inclusive
}

function drawBackgroundImage(canvas, ctx, textCanvas) {
    ctx.clearRect(0, 0, canvas.width, canvas.height);

    ctx.fillStyle = 'white';
    ctx.fillRect(0, 0, canvas.width, canvas.height);

    ctx.drawImage(document.getElementById('memeimage'), 0, 0, canvas.width, canvas.height - BOTTOM_PADDING);
    ctx.drawImage(textCanvas, TEXT_PADDING, canvas.height - (BOTTOM_PADDING - TEXT_PADDING));

    ctx.strokeStyle = 'white';
    ctx.lineWidth = 4;
    ctx.strokeRect(0, 0, canvas.width, canvas.height);
}

function getRandomImageSize(min, max, width, height) {
    const ratio = width / height;  // Used for aspect ratio
    width = getRandomInt(min, max);
    height = width / ratio;
    return { width, height };
}

function drawSalt(src, canvas, ctx) {
    // Create an image object. (Not part of the dom)
    const image = new Image();
    image.src = src;
    image.crossOrigin = "anonymous";

    const newCanvas = document.createElement('canvas');
    const newCanvCtx = newCanvas.getContext('2d');

    // After the image has loaded, draw it to the canvas
    image.onload = function () {
        for (let i = 0; i < 12; i++) {
            const randomX = getRandomInt(10, (canvas.width / 2) - 38);
            const randomY = getRandomInt(canvas.height - BOTTOM_PADDING - 300, canvas.height - (BOTTOM_PADDING + TEXT_PADDING + 38));
            const dimensions = getRandomImageSize(25, 70, image.width, image.height);

            newCanvas.height = dimensions.height + 5;
            newCanvas.width = dimensions.width + 5;
            newCanvCtx.shadowColor = 'rgba(0, 0, 0, 0.5)';
            newCanvCtx.shadowBlur = '2';
            newCanvCtx.shadowOffsetX = 2;
            newCanvCtx.shadowOffsetY = 2;
            newCanvCtx.drawImage(image, 0, 0, dimensions.width, dimensions.height)

            ctx.drawImage(newCanvas, randomX, randomY);
        }
    }
    return image;
}

updateSalt = (file, saltImage) => {
    saltImage.src = URL.createObjectURL(file);
}

onload = function () {
    const canvas = document.getElementById('canvas');
    canvas.height = 700; // 20 is the margin given to '<section>' in css
    canvas.width = 600;
    const ctx = canvas.getContext('2d');

    const bottomText = document.getElementById('bottomText');

    const textCanvas = document.createElement('canvas');
    textCanvas.height = BOTTOM_PADDING - (2 * TEXT_PADDING - 10);
    textCanvas.width = canvas.width - (2 * TEXT_PADDING);

    const textCtx = textCanvas.getContext('2d');

    textCtx.strokeStyle = "gray";
    textCtx.lineWidth = "2px";

    textCtx.font = "bold 25px Arial";
    textCtx.fillStyle = "black";
    textCtx.textBaseline = "top";
    textCtx.fillText(bottomText.value, 0, 0);

    drawBackgroundImage(canvas, ctx, textCanvas);

    const saltImage = drawSalt('https://image.flaticon.com/icons/png/512/2746/2746582.png', canvas, ctx);

    const input = document.querySelector("input[type='file']")
    input.addEventListener('change', function () {
        drawBackgroundImage(canvas, ctx, textCanvas);
        updateSalt(this.files[0], saltImage);
    });

    const a = document.getElementById('downloadLink')
    a.addEventListener('click', function () {
        a.download = 'salt-bae-' + Date.now()
        a.href = canvas.toDataURL('image/jpeg');
    }, false)

    const saltOptions = document.getElementById('saltOptions');
    saltOptions.addEventListener('click', (e) => {
        drawBackgroundImage(canvas, ctx, textCanvas);
        saltImage.src = e.target.src
    })

    bottomText.addEventListener('keyup', (e) => {
        textCtx.clearRect(0, 0, textCanvas.width, textCanvas.height);

        ctx.clearRect(TEXT_PADDING, canvas.height - (BOTTOM_PADDING - TEXT_PADDING), textCanvas.width, textCanvas.height);
        ctx.fillRect(TEXT_PADDING, canvas.height - (BOTTOM_PADDING - TEXT_PADDING), textCanvas.width, textCanvas.height);

        const text = e.target.value.split('\n');

        let y = -1 * LINE_HEIGHT;
        text.forEach((line, index) => {
            textCtx.fillText(line, 0, y + LINE_HEIGHT);
            y += LINE_HEIGHT;
        });

        
        ctx.drawImage(textCanvas, TEXT_PADDING, canvas.height - (BOTTOM_PADDING - TEXT_PADDING)); 
    });
};