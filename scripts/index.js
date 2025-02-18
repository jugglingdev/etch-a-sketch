const grid = document.getElementById('grid');
const slider = document.getElementById('slider');
const gridSize = document.getElementById('gridSize');
gridSize.innerHTML = slider.value + ' X ' + slider.value;

const paintbrush = document.getElementById('paintbrush');
const paintBucket = document.getElementById('paintBucket');
const colorPicker = document.getElementById('colorPicker');
const recentColors = document.getElementById('recentColors');
const colorMode = document.getElementById('color');
const rainbowMode = document.getElementById('rainbow');
const lighten = document.getElementById('lighten');
const darken = document.getElementById('darken');
const eraser = document.getElementById('eraser');
const clear = document.getElementById('clear');
const gridLines = document.getElementById('gridLines');

paintbrush.onclick = () => {
    setCurrentMode('color');
};
paintBucket.onclick = () => {
    setCurrentMode('paintBucket');
};
colorPicker.oninput = (e) => {
    setCurrentColor(e.target.value);
};
colorMode.onclick = () => setCurrentMode('color');
rainbowMode.onclick = () => setCurrentMode('rainbow');
lighten.onclick = () => setCurrentMode('lighten');
darken.onclick = () => setCurrentMode('darken');
eraser.onclick = () => setCurrentMode('eraser');
clear.onclick = () => resetGrid();
gridLines.onclick = () => makeGridLinesBtnActive();
slider.onmousemove = (e) => updateSizeValue(e.target.value);
slider.onchange = (e) => changeSize(e.target.value);

// Limit sketch() to work with mousedown && mouseover; not hover alone

let mouseDown = false;
document.body.onmousedown = () => (mouseDown = true);
document.body.onmouseup = () => (mouseDown = false);

// Function for touch events

grid.addEventListener('touchmove', function (e) {
    let touch = e.touches[0];
    gridItem = document.elementFromPoint(touch.clientX, touch.clientY);
    sketch(e);
});

// Functions to Set Modes (color, rainbow, lighten, darken, eraser)

let currentMode = 'color';
let currentColor = 'hsl(0, 0%, 20%)';
let paintBucketActive = false;

function setCurrentMode(newMode) {
    makeButtonActive(newMode);
    currentMode = newMode;
    paintBucketActive = newMode === 'paintBucket';
}

function floodFill(startCell, newColor) {
    let gridItems = Array.from(document.querySelectorAll('.grid-item'));
    let columns = Math.sqrt(gridItems.length);

    let startColor = window.getComputedStyle(startCell).backgroundColor;
    if (startColor === newColor) return;

    let queue = [startCell];
    let visited = new Set();
    visited.add(startCell);

    function processQueue() {
        let nextBatch = [];
        while (queue.length) {
            let cell = queue.pop();
            let index = Array.from(gridItems).indexOf(cell);

            cell.style.backgroundColor = newColor;

            // Get neighboring cells (left, right, up, down)
            let neighbors = [];
            if (index % columns !== 0) neighbors.push(gridItems[index - 1]);
            if ((index + 1) % columns !== 0)
                neighbors.push(gridItems[index + 1]);
            if (index - columns >= 0)
                neighbors.push(gridItems[index - columns]);
            if (index + columns < gridItems.length)
                neighbors.push(gridItems[index + columns]);

            for (let neighbor of neighbors) {
                if (
                    neighbor &&
                    !visited.has(neighbor) &&
                    window.getComputedStyle(neighbor).backgroundColor ===
                        startColor
                ) {
                    queue.push(neighbor);
                    visited.add(neighbor);
                }
            }
        }
        queue = nextBatch;
        if (queue.length) {
            requestAnimationFrame(processQueue);
        }
    }
    requestAnimationFrame(processQueue);
}

function setCurrentColor(newColor) {
    currentColor = newColor;
    colorPicker.value = toHex(newColor);
    setCurrentMode('color');
}

function sketch(e) {
    if (e.type == 'mouseover' && !mouseDown) return;

    saveState();

    if (paintBucketActive) {
        floodFill(e.target, currentColor);
        return;
    }

    if (currentMode == 'color') {
        e.target.style.backgroundColor = currentColor;
        handleRecentColors(currentColor);
    } else if (currentMode == 'rainbow') {
        let randomHue = Math.floor(Math.random() * 361);
        e.target.style.backgroundColor = `hsl(${randomHue}, 100%, 50%)`;
    } else if (currentMode == 'eraser') {
        e.target.style.backgroundColor = 'rgb(255, 255, 255)';
    } else if (currentMode == 'lighten' || 'darken') {
        let gridItemColor = window.getComputedStyle(e.target).backgroundColor;
        let gridItemColorRGB = gridItemColor.match(/\d+/g).map(Number);
        rgbToHsl(e, gridItemColorRGB);
    }
}

function rgbToHsl(e, [r, g, b]) {
    r /= 255;
    g /= 255;
    b /= 255;
    let max = Math.max(r, g, b);
    let min = Math.min(r, g, b);
    let d = max - min;
    let h;

    if (d === 0) {
        h = 0;
    } else if (max === r) {
        h = ((g - b) / d) % 6;
    } else if (max === g) {
        h = (b - r) / d + 2;
    } else if (max === b) {
        h = (r - g) / d + 4;
    }

    let l = (min + max) / 2;
    let s = d === 0 ? 0 : d / (1 - Math.abs(2 * l - 1));
    h *= 60;
    s *= 100;
    l *= 100;

    if (currentMode == 'lighten') {
        lightenColor(e, [h, s, l]);
    } else if (currentMode == 'darken') {
        darkenColor(e, [h, s, l]);
    }
    return [h, s, l];
}

function lightenColor(e, [h, s, l]) {
    let newLightness = Math.max(0, Math.min(100, l + 10));
    e.target.style.backgroundColor = `hsl(${h}, ${s}%, ${newLightness}%)`;
}

function darkenColor(e, [h, s, l]) {
    let newLightness = Math.max(0, Math.min(100, l - 10));
    e.target.style.backgroundColor = `hsl(${h}, ${s}%, ${newLightness}%)`;
}

// Store recent colors in local storage

let recentColorsArray = JSON.parse(localStorage.getItem('recentColors')) || [];

if (recentColorsArray.length) {
    updateRecentColors();
}

function handleRecentColors(color) {
    let selectedColor = color;
    recentColorsArray = [
        selectedColor,
        ...recentColorsArray.filter((color) => color !== selectedColor),
    ];

    // Limit recent colors to 10
    recentColorsArray = recentColorsArray.slice(0, 10);

    updateRecentColors();
}

function updateRecentColors() {
    recentColors.innerHTML = '';
    recentColorsArray.forEach((color) => {
        let swatch = document.createElement('button');
        swatch.classList.add('color-swatch');
        swatch.style.backgroundColor = color;
        swatch.addEventListener('click', () => {
            setCurrentColor(color);
        });

        recentColors.appendChild(swatch);
    });

    localStorage.setItem('recentColors', JSON.stringify(recentColorsArray));
}

function toHex(color) {
    let ctx = document.createElement('canvas').getContext('2d');
    ctx.fillStyle = color;
    let computedColor = ctx.fillStyle; // Convert named colors & shorthand hex
    if (computedColor.startsWith('rgb')) {
        let rgb = computedColor.match(/\d+/g).map(Number);
        return `#${rgb.map((c) => c.toString(16).padStart(2, '0')).join('')}`;
    }
    return computedColor;
}

// Active Button Functions

function makeButtonActive(newMode) {
    if (newMode == 'color') {
        grid.classList.remove('paint-bucket');
        paintBucket.classList.remove('active');
        rainbowMode.classList.remove('active');
        lighten.classList.remove('active');
        darken.classList.remove('active');
        eraser.classList.remove('active');
    } else if (newMode == 'rainbow') {
        grid.classList.remove('paint-bucket');
        paintBucket.classList.remove('active');
        colorMode.classList.remove('active');
        lighten.classList.remove('active');
        darken.classList.remove('active');
        eraser.classList.remove('active');
    } else if (newMode == 'lighten') {
        grid.classList.remove('paint-bucket');
        paintBucket.classList.remove('active');
        colorMode.classList.remove('active');
        rainbowMode.classList.remove('active');
        darken.classList.remove('active');
        eraser.classList.remove('active');
    } else if (newMode == 'darken') {
        grid.classList.remove('paint-bucket');
        paintBucket.classList.remove('active');
        colorMode.classList.remove('active');
        rainbowMode.classList.remove('active');
        lighten.classList.remove('active');
        eraser.classList.remove('active');
    } else if (newMode == 'eraser') {
        grid.classList.remove('paint-bucket');
        paintBucket.classList.remove('active');
        colorMode.classList.remove('active');
        rainbowMode.classList.remove('active');
        lighten.classList.remove('active');
        darken.classList.remove('active');
    } else if (newMode == 'paintBucket') {
        paintbrush.classList.remove('active');
        rainbowMode.classList.remove('active');
        lighten.classList.remove('active');
        darken.classList.remove('active');
        eraser.classList.remove('active');
    }

    if (newMode == 'color') {
        paintbrush.classList.add('active');
        colorMode.classList.add('active');
    } else if (newMode == 'rainbow') {
        paintbrush.classList.add('active');
        rainbowMode.classList.add('active');
    } else if (newMode == 'lighten') {
        paintbrush.classList.add('active');
        lighten.classList.add('active');
    } else if (newMode == 'darken') {
        paintbrush.classList.add('active');
        darken.classList.add('active');
    } else if (newMode == 'eraser') {
        paintbrush.classList.add('active');
        eraser.classList.add('active');
    } else if (newMode == 'paintBucket') {
        grid.classList.add('paint-bucket');
        paintBucket.classList.add('active');
        colorMode.classList.add('active');
    }
}

// Grid Line Functions

function showHideGridLines() {
    if (gridLines.classList.contains('active')) {
        document
            .querySelectorAll('.grid-item')
            .forEach((el) => el.classList.add('grid-lines'));
    } else {
        document
            .querySelectorAll('.grid-item')
            .forEach((el) => el.classList.remove('grid-lines'));
    }
}

function makeGridLinesBtnActive() {
    gridLines.classList.toggle('active');
    showHideGridLines();
}

// Grid Size Functions

let currentSize = 16;

function changeSize(value) {
    setCurrentSize(value);
    updateSizeValue(value);
    resetGrid();
}

function setCurrentSize(newSize) {
    currentSize = newSize;
}

function updateSizeValue(value) {
    gridSize.innerHTML = `${value} x ${value}`;
}

function resetGrid() {
    clearGrid();
    makeGrid(currentSize);
}

function clearGrid() {
    grid.innerHTML = '';
}

function makeGrid(currentSize) {
    grid.style.setProperty('--gridSize', currentSize);

    for (let i = 0; i < currentSize * currentSize; i++) {
        let gridItem = document.createElement('div');
        gridItem.classList.add('grid-item');
        gridItem.addEventListener('mousedown', sketch);
        gridItem.addEventListener('mouseover', sketch);
        grid.appendChild(gridItem);
    }

    showHideGridLines();
}

window.onload = () => {
    makeGrid(currentSize);
    makeButtonActive(currentMode);
};

let undoStack = [];
let redoStack = [];
const MAX_HISTORY_SIZE = 100;

function saveState() {
    if (undoStack.length >= MAX_HISTORY_SIZE) {
        undoStack.shift();
    }
    undoStack.push(grid.innerHTML);
}

function undo() {
    if (undoStack.length) {
        redoStack.push(grid.innerHTML);
        grid.innerHTML = undoStack.pop();
        restoreEventListeners();
    }
}

function redo() {
    if (redoStack.length) {
        undoStack.push(grid.innerHTML);
        grid.innerHTML = redoStack.pop();
        restoreEventListeners();
    }
}

function restoreEventListeners() {
    document.querySelectorAll('.grid-item').forEach((gridItem) => {
        gridItem.addEventListener('mousedown', sketch);
        gridItem.addEventListener('mouseover', sketch);
    });
}

document.addEventListener('keydown', (event) => {
    if ((event.ctrlKey || event.metaKey) && event.key === 'z') {
        undo();
    } else if ((event.ctrlKey || event.metaKey) && event.key === 'y') {
        redo();
    }
});

document
    .getElementById('downloadButton')
    .addEventListener('click', downloadSketch);

function downloadSketch() {
    const canvas = document.createElement('canvas');
    const ctx = canvas.getContext('2d');

    const gridItems = document.querySelectorAll('.grid-item');
    const gridSize = Math.sqrt(gridItems.length);
    const gridItemSize = gridItems[0].offsetWidth;

    canvas.width = gridSize * gridItemSize;
    canvas.height = gridSize * gridItemSize;

    gridItems.forEach((gridItem, index) => {
        const row = Math.floor(index / gridSize);
        const column = index % gridSize;
        const backgroundColor =
            window.getComputedStyle(gridItem).backgroundColor;

        ctx.fillStyle = backgroundColor;
        ctx.fillRect(
            column * gridItemSize,
            row * gridItemSize,
            gridItemSize,
            gridItemSize
        );
    });

    const link = document.createElement('a');
    link.download = 'sketch.png';
    link.href = canvas.toDataURL('image/png');
    link.click();
}
