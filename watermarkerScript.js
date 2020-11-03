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

const getImgWidth = (img) => img.width * 0.25;
const getImgHeight = (img) => img.height * 0.25;

const TEXT_SIZE = 30;
onload = function () {
    const canvas = document.getElementById('canvas');
    canvas.height = 700;
    canvas.width = 450;
    const ctx = canvas.getContext('2d');

    let divDraggable = false;
    let divX = 0, divY = 0;
    let watermarkX = canvas.width / 2, watermarkY = canvas.height / 2;

    const watermarkText = document.getElementById('watermarkText');
    const opSlider = document.getElementById('opacitySlider');
    const colorPicker = document.getElementById('colorPicker');
    const colorPickerDiv = document.getElementById('colorPickerDiv');
    const draggableDiv = document.getElementById("movingHandles");
    const watermarkImage = new Image();
    watermarkImage.src = "/public/images/brofist.png";

    const watermarkCanvas = document.createElement('canvas');
    watermarkCanvas.height = canvas.height;
    watermarkCanvas.width = canvas.width;

    const watermarkCtx = watermarkCanvas.getContext('2d');
    watermarkCtx.globalAlpha = opSlider.value;

    watermarkCtx.font = "bold " + TEXT_SIZE + "px Arial";
    watermarkCtx.fillStyle = colorPicker.value;
    watermarkCtx.textBaseline = "middle";
    watermarkCtx.textAlign = "center";
    watermarkCtx.fillText(watermarkText.value.trim(), watermarkX, watermarkY);

    drawBackgroundImage(canvas, ctx, watermarkCanvas);

    const a = document.getElementById('downloadLink')
    a.addEventListener('click', function () {
        a.download = 'watermarked-' + Date.now()
        a.href = canvas.toDataURL('image/jpeg');
    }, false)

    watermarkText.addEventListener('keyup', (e) => {
        watermarkCtx.clearRect(0, 0, watermarkCanvas.width, watermarkCanvas.height);
        watermarkCtx.fillText(e.target.value.trim(), watermarkX, watermarkY);

        drawBackgroundImage(canvas, ctx, watermarkCanvas);
    });

    opSlider.addEventListener('input', (e) => {
        watermarkCtx.clearRect(0, 0, watermarkCanvas.width, watermarkCanvas.height);
        watermarkCtx.globalAlpha = e.target.value;

        if (selectedChoice == "text")
            watermarkCtx.fillText(watermarkText.value.trim(), watermarkX, watermarkY);
        else
            watermarkCtx.drawImage(watermarkImage, watermarkX - (getImgWidth(watermarkImage)/2), watermarkY - (getImgHeight(watermarkImage)/2), getImgWidth(watermarkImage), getImgHeight(watermarkImage));

        drawBackgroundImage(canvas, ctx, watermarkCanvas);
    });

    colorPicker.addEventListener('input', (e) => {
        watermarkCtx.clearRect(0, 0, watermarkCanvas.width, watermarkCanvas.height);
        watermarkCtx.fillStyle = e.target.value;
        watermarkCtx.fillText(watermarkText.value.trim(), watermarkX, watermarkY);

        drawBackgroundImage(canvas, ctx, watermarkCanvas);
    });

    const input = document.querySelector("input[type='file']")
    input.addEventListener('change', function () {
        watermarkImage.src = URL.createObjectURL(this.files[0]);

        watermarkImage.onload = () => {
            watermarkCtx.clearRect(0, 0, watermarkCanvas.width, watermarkCanvas.height);
            watermarkCtx.drawImage(watermarkImage, watermarkX - (getImgWidth(watermarkImage)/2), watermarkY - (getImgHeight(watermarkImage)/2), getImgWidth(watermarkImage), getImgHeight(watermarkImage));
            drawBackgroundImage(canvas, ctx, watermarkCanvas);
        }
    });

    const choiceDiv = document.querySelector("#watermarkChoice");

    // Text choice
    choiceDiv.children[0].addEventListener("click", (e) => {
        toggleChoice("text", e.target, choiceDiv.children[1]);

        colorPickerDiv.style.display = "block";

        watermarkCtx.clearRect(0, 0, watermarkCanvas.width, watermarkCanvas.height);
        watermarkCtx.fillText(watermarkText.value.trim(), watermarkX, watermarkY);
        drawBackgroundImage(canvas, ctx, watermarkCanvas);
    });

    // Image choice
    choiceDiv.children[1].addEventListener("click", (e) => {
        toggleChoice("image", e.target, choiceDiv.children[0]);

        colorPickerDiv.style.display = "none";

        watermarkCtx.clearRect(0, 0, watermarkCanvas.width, watermarkCanvas.height);
        watermarkCtx.drawImage(watermarkImage, watermarkX - (getImgWidth(watermarkImage)/2), watermarkY - (getImgHeight(watermarkImage)/2), getImgWidth(watermarkImage), getImgHeight(watermarkImage));
        drawBackgroundImage(canvas, ctx, watermarkCanvas);
    });

    // Draggable handles
    draggableDiv.addEventListener("mousedown", (e) => {
        divDraggable = true;
    });
    draggableDiv.addEventListener("mouseout", (e) => {
        divDraggable = false;
    });
    draggableDiv.addEventListener("mouseup", (e) => {
        divDraggable = false;
    });
    draggableDiv.addEventListener("mousemove", (e) => {
        const canvasBB = canvas.getBoundingClientRect();
        const divBB = e.target.getBoundingClientRect();
        if (divDraggable) {
            divX += e.movementX;
            if ((divX + divBB.width / 2) > canvasBB.width / 2)
                divX -= (divX + divBB.width / 2) - (canvas.width / 2);
            else if ((divX - divBB.width / 2) < 0 && (divX - divBB.width / 2) < (-1 * (canvas.width / 2)))
                divX -= (divX - divBB.width / 2) + (canvas.width / 2);

            divY += e.movementY;
            if ((divY + divBB.height / 2) > canvasBB.height / 2)
                divY -= (divY + divBB.height / 2) - (canvas.height / 2);
            else if ((divY - divBB.height / 2) < 0 && (divY - divBB.height / 2) < (-1 * (canvas.height / 2)))
                divY -= (divY - divBB.height / 2) + (canvas.height / 2);

            e.target.style.transform = `translate(${divX}px, ${divY}px)`;
            watermarkCtx.clearRect(0, 0, canvas.width, canvas.height);
            watermarkX = canvas.width / 2 + divX, watermarkY = canvas.height / 2 + divY
            if (selectedChoice == "text")
                watermarkCtx.fillText(watermarkText.value.trim(), watermarkX, watermarkY);
            else
                watermarkCtx.drawImage(watermarkImage, watermarkX - (getImgWidth(watermarkImage)/2), watermarkY - (getImgHeight(watermarkImage)/2), getImgWidth(watermarkImage), getImgHeight(watermarkImage));

            drawBackgroundImage(canvas, ctx, watermarkCanvas)
        }
    });
}