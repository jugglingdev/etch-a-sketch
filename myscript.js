// Function to makeGrid

const sketchContainer = document.querySelector('.sketch-container');

function makeGrid(rows, cols) {
    sketchContainer.style.setProperty('--grid-rows', rows);
    sketchContainer.style.setProperty('--grid-cols', cols);
    for (let i = 0; i < rows * cols; i++) {
        let cell = document.createElement('div');
        cell.classList.add('cell');
        cell.classList.add('gridlines');
        sketchContainer.appendChild(cell);
    }
}

makeGrid(16, 16);

// Function to remove gridlines

//cell.classList.remove('gridlines');
//toggle gridlines on and off

//Functions to use color and rainbow buttons

const colorMode = document.getElementById('#color');
const rainbowMode = document.getElementById('#rainbow');
const lighten = document.getElementById('#lighten');
const darken = document.getElementById('#darken');
const eraser = document.getElementById('#eraser');
const clear = document.getElementById('#clear');

let color = cell.style.backgroundColor

function changeColor(newColor) {
    cell.style.backgroundColor = newColor;
}

colorMode.addEventListener('click', changeColor);





/*
https://www.joshwcomeau.com/ (buttons, shadows)

https://iro.js.org/
https://www.cssscript.com/swatch-color-picker/
downloaded swatchy color picker
https://www.youtube.com/watch?v=eIw-Nou9L9E
*/