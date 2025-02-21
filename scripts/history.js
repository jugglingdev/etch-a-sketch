import dom from './dom.js';
import { startSketch } from './modes.js';

let undoStack = [];
let redoStack = [];
const MAX_HISTORY_SIZE = 100;

export function saveState() {
    if (undoStack.length >= MAX_HISTORY_SIZE) {
        undoStack.shift();
    }
    undoStack.push(dom.grid.innerHTML);
}

export function undo() {
    if (undoStack.length > 1) {
        redoStack.push(undoStack.pop());
        dom.grid.innerHTML = undoStack[undoStack.length - 1];
        restoreEventListeners();
    }
}

export function redo() {
    if (redoStack.length) {
        undoStack.push(dom.grid.innerHTML);
        dom.grid.innerHTML = redoStack.pop();
        restoreEventListeners();
    }
}

function restoreEventListeners() {
    document.querySelectorAll('.grid-item').forEach((gridItem) => {
        gridItem.addEventListener('mousedown', startSketch);
        gridItem.addEventListener('mouseover', startSketch);
    });
}

// Keyboard Shortcuts
document.addEventListener('keydown', (event) => {
    if ((event.ctrlKey || event.metaKey) && event.key === 'z') {
        undo();
    } else if ((event.ctrlKey || event.metaKey) && event.key === 'y') {
        redo();
    }
});
