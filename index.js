const grid = document.getElementById('grid');
const slider = document.getElementById('slider');
const gridSize = document.getElementById('gridSize');
      gridSize.innerHTML = slider.value + ' X ' + slider.value;

const colorPicker = document.getElementById('colorPicker');
const colorMode = document.getElementById('color');
const rainbowMode = document.getElementById('rainbow');
const lighten = document.getElementById('lighten');
const darken = document.getElementById('darken');
const eraser = document.getElementById('eraser');
const clear = document.getElementById('clear');
const gridLines = document.getElementById('gridLines');

colorPicker.oninput = (e) => setCurrentColor(e.target.value);
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

grid.addEventListener('touchmove', function(e) {
    let touch = e.touches[0];
    gridItem = document.elementFromPoint(touch.clientX, touch.clientY);
    sketch(e);
})

// Functions to Set Modes (color, rainbow, lighten, darken, eraser)

let currentMode = 'color';
let currentColor = 'hsl(0, 0%, 20%)';

function setCurrentMode(newMode) {
    makeButtonActive(newMode);
    currentMode = newMode;
}

function setCurrentColor(newColor) {
    currentColor = newColor;
    setCurrentMode('color');
}

function sketch(e) {
    if (e.type == 'mouseover' && !mouseDown) return;

    saveState();

    if (currentMode == 'color') {
        e.target.style.backgroundColor = currentColor;
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
    r /= 255; g /= 255; b /= 255;
    let max = Math.max(r, g, b);
    let min = Math.min(r, g, b);
    let d = max - min;
    let h;

    if (d === 0) {
        h = 0;
    } else if (max === r) {
        h = (g - b) / d % 6;
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

// Active Button Functions

function makeButtonActive(newMode) {
    if (newMode == 'color') {
        rainbowMode.classList.remove('active');
        lighten.classList.remove('active');
        darken.classList.remove('active');
        eraser.classList.remove('active');
    } else if (newMode == 'rainbow') {
        colorMode.classList.remove('active');
        lighten.classList.remove('active');
        darken.classList.remove('active');
        eraser.classList.remove('active');
    } else if (newMode == 'lighten') {
        colorMode.classList.remove('active');
        rainbowMode.classList.remove('active');
        darken.classList.remove('active');
        eraser.classList.remove('active');
    } else if (newMode == 'darken') {
        colorMode.classList.remove('active');
        rainbowMode.classList.remove('active');
        lighten.classList.remove('active');
        eraser.classList.remove('active');
    } else if (newMode == 'eraser') {
        colorMode.classList.remove('active');
        rainbowMode.classList.remove('active');
        lighten.classList.remove('active');
        darken.classList.remove('active');
    }

    if (newMode == 'color') {
        colorMode.classList.add('active');
    } else if (newMode == 'rainbow') {
        rainbowMode.classList.add('active');
    } else if (newMode == 'lighten') {
        lighten.classList.add('active');
    } else if (newMode == 'darken') {
        darken.classList.add('active');
    } else if (newMode == 'eraser') {
        eraser.classList.add('active');
    }
}

// Grid Line Functions

function showHideGridLines() {
    if (gridLines.classList.contains('active')) {
        document.querySelectorAll('.grid-item').forEach(el => el.classList.add('grid-lines'));
    } else {
        document.querySelectorAll('.grid-item').forEach(el => el.classList.remove('grid-lines'));
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
    
    for (let i = 0; i < (currentSize * currentSize); i++) {
        let gridItem = document.createElement('div');
        gridItem.classList.add('grid-item');
        gridItem.addEventListener('mousedown', sketch);
        gridItem.addEventListener('mouseover', sketch);
        grid.appendChild(gridItem);
    };

    showHideGridLines();
}

window.onload = () => {
    makeGrid(currentSize);
    makeButtonActive(currentMode);
}

let undoStack = [];
let redoStack = [];
const MAX_HISTORY_SIZE = 100;

function saveState() {
    if (undoStack.length >= MAX_HISTORY_SIZE) {
        undoStack.shift();
    };
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
    document.querySelectorAll('.grid-item').forEach(gridItem => {
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