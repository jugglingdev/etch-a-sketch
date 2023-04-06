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
gridLines.onclick = () => showHideGridLines();
slider.onmousemove = (e) => updateSizeValue(e.target.value);
slider.onchange = (e) => changeSize(e.target.value);

// Functions to Set Modes

let currentMode = 'color';
let currentColor = 'hsl(0, 0%, 20%)';

function setCurrentMode(newMode) {
    makeButtonActive(newMode);
    currentMode = newMode;
}

function setCurrentColor(newColor) {
    currentColor = newColor;
}

function sketch(e) {
    if (e.type == 'mouseover' && !'mousedown' ) return;
    if (currentMode == 'color') {
        e.target.style.backgroundColor = currentColor;
    } else if (currentMode == 'rainbow') {
        let randomHue = Math.floor(Math.random() * 361);
        e.target.style.backgroundColor = `hsl(${randomHue}, 100%, 50%)`;
    } else if (currentMode == 'lighten') {
        let gridItemColor = e.target.getPropertyValue('backgroundColor');
        let [hue, saturation, lightness] = gridItemColor.match(/\d+/g).map(Number);
        let newLightness = Math.max(0, Math.min(100, lightness + parseFloat(10)));
        e.target.style.backgroundColor = `hsl(${hue}, ${saturation}%, ${newLightness}%)`;
        console.log(gridItemColor);
    } else if (currentMode == 'darken') {
        let gridItemColor = e.target.getPropertyValue('backgroundColor');
        let [hue, saturation, lightness] = gridItemColor.match(/\d+/g).map(Number);
        let newDarkness = Math.max(0, Math.min(100, lightness + parseFloat(-10)));
        e.target.style.backgroundColor = `hsl(${hue}, ${saturation}%, ${newDarkness}%)`;
    } else if (currentMode == 'eraser') {
        e.target.style.backgroundColor = 'hsl(0, 0%, 100%)';
    }


    console.log(currentMode);
}



    // Show Grid Lines mode
    // Hide Grid Lines mode

// Active Button Functions

function makeButtonActive(newMode) {
    if (currentMode == 'color') {
        colorMode.classList.remove('.active');
    } else if (currentMode == 'rainbow') {
        rainbowMode.classList.remove('.active');
    } else if (currentMode == 'lighten') {
        lighten.classList.remove('.active');
    } else if (currentMode == 'darken') {
        darken.classList.remove('.active');
    } else if (currentMode == 'eraser') {
        eraser.classList.remove('.active');
    }

    if (newMode == 'color') {
        colorMode.classList.add('.active');
    } else if (newMode == 'rainbow') {
        rainbowMode.classList.add('.active');
    } else if (newMode == 'lighten') {
        lighten.classList.add('.active');
    } else if (newMode == 'darken') {
        darken.classList.add('.active');
    } else if (newMode == 'eraser') {
        eraser.classList.add('.active');
    }
}

    // Color, Rainbow, Lighten, Darken, or Eraser
    // Clear as single click
    // Grid Lines toggle on/off

// Color Functions

    // Color Picker
    // Rainbow
    // Lighten
    // Darken
    // Eraser
    // Clear??? (right now using function clearGrid())

// Grid Line Functions

function showHideGridLines() {
    document.querySelectorAll('.grid-item').forEach(
       el => el.classList.toggle('grid-lines')
    );
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
        gridItem.addEventListener('mouseover', sketch);
        gridItem.addEventListener('mousedown', sketch);
        grid.appendChild(gridItem);
    };
}



    

window.onload = () => {
    makeGrid(currentSize);
}


/*
https://www.joshwcomeau.com/ (buttons, shadows)

https://iro.js.org/

https://www.youtube.com/watch?v=eIw-Nou9L9E
*/