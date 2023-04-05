let grid = document.getElementById('grid');
let slider = document.getElementById('slider');
let gridSize = document.getElementById('gridSize');
    gridSize.innerHTML = slider.value + ' X ' + slider.value;

const colorMode = document.getElementById('color');
const rainbowMode = document.getElementById('rainbow');
const lighten = document.getElementById('lighten');
const darken = document.getElementById('darken');
const eraser = document.getElementById('eraser');
const clear = document.getElementById('clear');
const gridLines = document.getElementById('gridLines');

gridLines.onclick = () => showGridLines();
slider.onmousemove = (e) => updateSizeValue(e.target.value);
slider.onchange = (e) => changeSize(e.target.value);


let currentSize = 16;

function setCurrentSize(newSize) {
    currentSize = newSize;
}

function changeSize(value) {
    setCurrentSize(value);
    updateSizeValue(value);
    resetGrid();
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

function makeGrid(gridSize) {
    grid.style.setProperty('--gridSize', gridSize);
    
    for (let i = 0; i < (gridSize * gridSize); i++) {
        let gridItem = document.createElement('div');
        gridItem.classList.add('grid-item');
        grid.appendChild(gridItem);
    };
}

function showGridLines() {
    let gridItem = document.getElementsByClassName('grid-item');
    gridItem.classList.add('grid-lines');
}

window.onload = () => {
    makeGrid(gridSize);
}
