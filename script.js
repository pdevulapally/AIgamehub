// script.js
document.addEventListener('DOMContentLoaded', function() {
    const canvas = document.getElementById('drawingCanvas');
    const ctx = canvas.getContext('2d');
    const colorPicker = document.getElementById('colorPicker');
    const clearCanvasButton = document.getElementById('clearCanvas');
    const toggleModeButton = document.getElementById('toggleMode');
    const image = new Image();
    image.src = 'Images/1.jpg'; // Update this path to your image
    let drawing = false;
    let mode = 'coloring'; // Default mode

    // Adjust canvas size to fit the container
    function resizeCanvas() {
        const canvasContainer = canvas.parentElement;
        canvas.width = canvasContainer.offsetWidth;
        canvas.height = canvasContainer.offsetHeight;
        if (mode === 'coloring') {
            ctx.drawImage(image, 0, 0, canvas.width, canvas.height);
        }
    }

    window.addEventListener('resize', resizeCanvas);
    image.onload = () => resizeCanvas();

    function startDrawing(event) {
        drawing = true;
        if (mode === 'drawing') {
            draw(event);
        }
    }

    function endDrawing() {
        drawing = false;
        ctx.beginPath();
    }

    function draw(event) {
        if (!drawing) return;

        const rect = canvas.getBoundingClientRect();
        const x = event.clientX - rect.left;
        const y = event.clientY - rect.top;

        ctx.lineWidth = 5;
        ctx.lineCap = 'round';
        ctx.strokeStyle = colorPicker.value;

        ctx.lineTo(x, y);
        ctx.stroke();
        ctx.beginPath();
        ctx.moveTo(x, y);
    }

    canvas.addEventListener('mousedown', startDrawing);
    canvas.addEventListener('mouseup', endDrawing);
    canvas.addEventListener('mousemove', draw);

    clearCanvasButton.addEventListener('click', function() {
        ctx.clearRect(0, 0, canvas.width, canvas.height);
        if (mode === 'coloring') {
            ctx.drawImage(image, 0, 0, canvas.width, canvas.height);
        }
    });

    toggleModeButton.addEventListener('click', function() {
        if (mode === 'drawing') {
            mode = 'coloring';
            toggleModeButton.textContent = 'Switch to Free Drawing';
            ctx.clearRect(0, 0, canvas.width, canvas.height);
            ctx.drawImage(image, 0, 0, canvas.width, canvas.height);
        } else {
            mode = 'drawing';
            toggleModeButton.textContent = 'Switch to Coloring';
            ctx.clearRect(0, 0, canvas.width, canvas.height);
        }
    });

    // Burger menu functionality
    const burger = document.querySelector('.burger');
    const nav = document.querySelector('nav ul');

    burger.addEventListener('click', () => {
        nav.classList.toggle('show');
        burger.classList.toggle('toggle');
    });

    // Color fill functionality
    function floodFill(x, y, fillColor) {
        const imageData = ctx.getImageData(0, 0, canvas.width, canvas.height);
        const data = imageData.data;
        const targetColor = getColorAtPixel(data, x, y);

        function getColorAtPixel(data, x, y) {
            const index = (y * canvas.width + x) * 4;
            return [data[index], data[index + 1], data[index + 2], data[index + 3]];
        }

        function matchColor(a, b) {
            return a[0] === b[0] && a[1] === b[1] && a[2] === b[2] && a[3] === b[3];
        }

        function setColorAtPixel(data, x, y, color) {
            const index = (y * canvas.width + x) * 4;
            data[index] = color[0];
            data[index + 1] = color[1];
            data[index + 2] = color[2];
            data[index + 3] = color[3];
        }

        if (matchColor(targetColor, fillColor)) return;

        const stack = [[x, y]];
        while (stack.length) {
            const [curX, curY] = stack.pop();
            const currentColor = getColorAtPixel(data, curX, curY);
            if (matchColor(currentColor, targetColor)) {
                setColorAtPixel(data, curX, curY, fillColor);
                stack.push([curX + 1, curY]);
                stack.push([curX - 1, curY]);
                stack.push([curX, curY + 1]);
                stack.push([curX, curY - 1]);
            }
        }
        ctx.putImageData(imageData, 0, 0);
    }

    canvas.addEventListener('click', function(event) {
        if (mode === 'coloring') {
            const rect = canvas.getBoundingClientRect();
            const x = event.clientX - rect.left;
            const y = event.clientY - rect.top;
            const fillColor = hexToRgbA(colorPicker.value);

            floodFill(Math.floor(x), Math.floor(y), fillColor);
        }
    });

    function hexToRgbA(hex) {
        let c;
        if (/^#([A-Fa-f0-9]{3}){1,2}$/.test(hex)) {
            c = hex.substring(1).split('');
            if (c.length === 3) {
                c = [c[0], c[0], c[1], c[1], c[2], c[2]];
            }
            c = '0x' + c.join('');
            return [(c >> 16) & 255, (c >> 8) & 255, c & 255, 255];
        }
        throw new Error('Bad Hex');
    }
});
