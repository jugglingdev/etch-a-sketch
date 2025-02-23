import dom from './dom.js';
import { startSketch, setMouseDown } from './modes.js';

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
    if (undoStack.length == 1) return;
    if (undoStack.length > 0) {
        redoStack.push(undoStack.pop());
        dom.grid.innerHTML = undoStack[undoStack.length - 1];
        restoreEventListeners();
    }
}

export function redo() {
    if (redoStack.length) {
        undoStack.push(redoStack.pop());
        dom.grid.innerHTML = undoStack[undoStack.length - 1];
        restoreEventListeners();
    }
}

function restoreEventListeners() {
    document.querySelectorAll('.grid-item').forEach((gridItem) => {
        gridItem.addEventListener('mousedown', (e) => {
            setMouseDown(true);
            startSketch(e);
        });
        gridItem.addEventListener('mouseover', (e) => {
            startSketch(e);
        });
    });
}

// Keyboard Shortcuts
document.addEventListener('keydown', (event) => {
    if (
        // ctrl + y (Windows) or cmd + shift + z (Mac)
        (event.ctrlKey && event.key === 'y') ||
        (event.metaKey && event.shiftKey && event.key === 'z')
    ) {
        redo();
    } else if (
        // ctrl + z (Windows) or cmd + z (Mac)
        (event.ctrlKey || event.metaKey) &&
        event.key === 'z'
    ) {
        undo();
    }
});
