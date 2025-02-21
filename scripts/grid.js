import dom from './dom.js';
import { startSketch } from './modes.js';
import { saveState } from './history.js';

// Grid Size functions
let currentGridSize;

export function createGrid(gridSize) {
    currentGridSize = gridSize;
    dom.grid.style.setProperty('--gridSize', currentGridSize);

    for (let i = 0; i < currentGridSize * currentGridSize; i++) {
        let gridItem = document.createElement('div');
        gridItem.classList.add('grid-item');
        gridItem.addEventListener('mousedown', startSketch);
        gridItem.addEventListener('mouseover', startSketch);
        dom.grid.appendChild(gridItem);
    }

    saveState();
    applyGridLines();
}

export function updateGridSizeValue(size) {
    dom.gridSize.innerHTML = `${size} X ${size}`;
}

export function changeGridSize(newSize) {
    currentGridSize = newSize;
    resetGrid();
}

export function resetGrid() {
    grid.innerHTML = '';
    createGrid(currentGridSize);
}

// Handle Grid Lines
export function toggleGridLines() {
    dom.gridLines.classList.toggle('active');
    applyGridLines();
}

function applyGridLines() {
    if (dom.gridLines.classList.contains('active')) {
        document
            .querySelectorAll('.grid-item')
            .forEach((el) => el.classList.add('grid-lines'));
    } else {
        document
            .querySelectorAll('.grid-item')
            .forEach((el) => el.classList.remove('grid-lines'));
    }
}
