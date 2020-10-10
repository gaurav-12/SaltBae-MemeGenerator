function getRandomInt(min, max) {
    min = Math.ceil(min);
    max = Math.floor(max);
    return Math.floor(Math.random() * (max - min)) + min; //The maximum is exclusive and the minimum is inclusive
}

function drawBackgroundImage(canvas, ctx) {
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    ctx.drawImage(document.getElementById('memeimage'), 0, 0, canvas.width, canvas.height);
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

    // After the image has loaded, draw it to the canvas
    image.onload = function () {
        for (let i = 0; i < 10; i++) {
            const randomX = getRandomInt(10, canvas.width / 2);
            const randomY = getRandomInt(canvas.height - 280, canvas.height);
            const dimensions = getRandomImageSize(25, 75, image.width, image.height);
            ctx.drawImage(image, randomX, randomY, dimensions.width, dimensions.height);
        }
    }
    return image;
}

updateSalt = (file, saltImage) => {
    saltImage.src = URL.createObjectURL(file);
}

onload = function () {
    const canvas = document.getElementById('canvas');
    canvas.height = window.innerHeight;
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