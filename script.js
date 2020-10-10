function getRandomInt(min, max) {
    min = Math.ceil(min);
    max = Math.floor(max);
    return Math.floor(Math.random() * (max - min)) + min; //The maximum is exclusive and the minimum is inclusive
}

function drawBackgroundImage(canvas, ctx) {
    ctx.clearRect(0, 0, canvas.width, canvas.height);

    ctx.fillStyle = 'white';
    ctx.fillRect(0, 0, canvas.width, canvas.height);

    ctx.drawImage(document.getElementById('memeimage'), 0, 0, canvas.width, canvas.height - 100);

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
        for (let i = 0; i < 10; i++) {
            const randomX = getRandomInt(10, canvas.width / 2);
            const randomY = getRandomInt(canvas.height - 400, canvas.height - 120);
            const dimensions = getRandomImageSize(25, 75, image.width, image.height);

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
    canvas.height = window.innerHeight - 20; // 20 is the margin given to section in css
    const ctx = canvas.getContext('2d');
    drawBackgroundImage(canvas, ctx);

    const saltImage = drawSalt('https://image.flaticon.com/icons/png/512/2746/2746582.png', canvas, ctx);

    const input = document.querySelector("input[type='file']")
    input.addEventListener('change', function () {
        drawBackgroundImage(canvas, ctx);
        updateSalt(this.files[0], saltImage);
    });

    const a = document.getElementById('downloadLink')
    a.addEventListener('click', function () {
        a.download = 'salt-bae-' + Date.now()
        a.href = canvas.toDataURL('image/jpeg');
    }, false)

    const saltOptions = document.getElementById('saltOptions');
    saltOptions.addEventListener('click', (e) => {
        drawBackgroundImage(canvas, ctx);
        saltImage.src = e.target.src
    })
};