const drawBackgroundImage = (canvas, ctx, watermarkCanvas) => {
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    
    ctx.fillStyle = 'white';
    ctx.fillRect(0, 0, canvas.width, canvas.height);

    ctx.drawImage(document.getElementById('bgimage'), 0, 0, canvas.width, canvas.height);
    ctx.drawImage(watermarkCanvas, 0, 0);

    ctx.strokeStyle = 'white';
    ctx.lineWidth = 4;
    ctx.strokeRect(0, 0, canvas.width, canvas.height);
}

let selectedChoice = "text";
const watermarkImage = new Image();
watermarkImage.src = "/public/images/brofist.png";

const toggleChoice = (choice, thisChoice, otherChoice) => {
    if (choice == "text") {
        document.getElementById('upload-container').style.display = "none";
        document.getElementById('markerTextContainer').style.display = "block";
    }

    else {
        document.getElementById('upload-container').style.display = "flex";
        document.getElementById('markerTextContainer').style.display = "none";
    }

    selectedChoice = choice;
    thisChoice.className = "active";
    otherChoice.className = null;
}

const textSize = 30;
onload = function () {
    const canvas = document.getElementById('canvas');
    canvas.height = 700;
    canvas.width = 450;
    const ctx = canvas.getContext('2d');

    const watermarkText = document.getElementById('watermarkText');
    const opSlider = document.getElementById('opacitySlider');
    const colorPicker = document.getElementById('colorPicker');
    const colorPickerDiv = document.getElementById('colorPickerDiv');

    const watermarkCanvas = document.createElement('canvas');
    watermarkCanvas.height = canvas.height;
    watermarkCanvas.width = canvas.width;

    const watermarkCtx = watermarkCanvas.getContext('2d');
    watermarkCtx.globalAlpha = opSlider.value;

    watermarkCtx.font = "bold " + textSize + "px Arial";
    watermarkCtx.fillStyle = colorPicker.value;
    watermarkCtx.textBaseline = "top";
    watermarkCtx.fillText(watermarkText.value, 0, 0);

    drawBackgroundImage(canvas, ctx, watermarkCanvas);

    const a = document.getElementById('downloadLink')
    a.addEventListener('click', function () {
        a.download = 'watermarked-' + Date.now()
        a.href = canvas.toDataURL('image/jpeg');
    }, false)

    watermarkText.addEventListener('keyup', (e) => {
        watermarkCtx.clearRect(0, 0, watermarkCanvas.width, watermarkCanvas.height);
        watermarkCtx.fillText(e.target.value.trim(), 0, 0);

        drawBackgroundImage(canvas, ctx, watermarkCanvas);
    });

    opSlider.addEventListener('input', (e) => {
        watermarkCtx.clearRect(0, 0, watermarkCanvas.width, watermarkCanvas.height);
        watermarkCtx.globalAlpha = e.target.value;

        if (selectedChoice == "text")
            watermarkCtx.fillText(watermarkText.value, 0, 0);
        else
            watermarkCtx.drawImage(watermarkImage, 0, 0, watermarkImage.width * 0.25, watermarkImage.height * 0.25);

        drawBackgroundImage(canvas, ctx, watermarkCanvas);
    });

    colorPicker.addEventListener('input', (e) => {
        watermarkCtx.clearRect(0, 0, watermarkCanvas.width, watermarkCanvas.height);
        watermarkCtx.fillStyle = e.target.value;
        watermarkCtx.fillText(watermarkText.value, 0, 0);

        drawBackgroundImage(canvas, ctx, watermarkCanvas);
    });

    const input = document.querySelector("input[type='file']")
    input.addEventListener('change', function () {
        watermarkImage.src = URL.createObjectURL(this.files[0]);

        watermarkCtx.clearRect(0, 0, watermarkCanvas.width, watermarkCanvas.height);
        watermarkCtx.drawImage(watermarkImage, 0, 0, watermarkImage.width * 0.25, watermarkImage.height * 0.25);

        drawBackgroundImage(canvas, ctx, watermarkCanvas);
    });

    const choiceDiv = document.querySelector("#watermarkChoice");

    // Text choice
    choiceDiv.children[0].addEventListener("click", (e) => {
        toggleChoice("text", e.target, choiceDiv.children[1]);

        colorPickerDiv.style.display = "block";

        watermarkCtx.clearRect(0, 0, watermarkCanvas.width, watermarkCanvas.height);
        watermarkCtx.fillText(watermarkText.value.trim(), 0, 0);
        drawBackgroundImage(canvas, ctx, watermarkCanvas);
    });

    // Image choice
    choiceDiv.children[1].addEventListener("click", (e) => {
        toggleChoice("image", e.target, choiceDiv.children[0]);

        colorPickerDiv.style.display = "none";

        watermarkCtx.clearRect(0, 0, watermarkCanvas.width, watermarkCanvas.height);
        watermarkCtx.drawImage(watermarkImage, 0, 0, watermarkImage.width * 0.25, watermarkImage.height * 0.25);
        drawBackgroundImage(canvas, ctx, watermarkCanvas);
    });
}