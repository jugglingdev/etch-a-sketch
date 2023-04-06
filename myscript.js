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

gridLines.onclick = () => showHideGridLines();
slider.onmousemove = (e) => updateSizeValue(e.target.value);
slider.onchange = (e) => changeSize(e.target.value);

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

        grid.appendChild(gridItem);

    };


 


}



    

window.onload = () => {
    makeGrid(currentSize);
}
