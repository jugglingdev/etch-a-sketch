import dom from './dom.js';
import { sketch } from './modes.js';

// Grid Size functions
let currentGridSize;

export function createGrid(gridSize) {
    currentGridSize = gridSize;
    dom.grid.style.setProperty('--gridSize', currentGridSize);

    for (let i = 0; i < currentGridSize * currentGridSize; i++) {
        let cell = document.createElement('div');
        cell.classList.add('grid-item');
        cell.addEventListener('mousedown', sketch);
        cell.addEventListener('mouseover', sketch);
        dom.grid.appendChild(cell);
    }

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
