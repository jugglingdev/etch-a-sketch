import dom from './dom.js';
import { setColorMode, setCurrentColor, setCurrentTool } from './modes.js';
import {
    updateGridSizeValue,
    changeGridSize,
    resetGrid,
    toggleGridLines,
} from './grid.js';
import { downloadSketch } from './utils.js';
import { setMouseDown } from './modes.js';

export function setupEventListeners() {
    dom.body.addEventListener('mousedown', () => setMouseDown(true));
    dom.body.addEventListener('mouseup', () => setMouseDown(false));

    dom.paintbrush.addEventListener('click', () => setCurrentTool('brush'));
    dom.paintBucket.addEventListener('click', () => setCurrentTool('bucket'));
    dom.colorPicker.addEventListener('input', (e) => {
        setCurrentColor(e.target.value);
        setColorMode('color');
    });

    dom.color.addEventListener('click', () => setColorMode('color'));
    dom.rainbow.addEventListener('click', () => setColorMode('rainbow'));
    dom.lighten.addEventListener('click', () => setColorMode('lighten'));
    dom.darken.addEventListener('click', () => setColorMode('darken'));
    dom.eraser.addEventListener('click', () => setColorMode('eraser'));
    dom.clear.addEventListener('click', () => resetGrid());

    dom.gridLines.addEventListener('click', () => toggleGridLines());
    dom.gridSizer.addEventListener('mousemove', (e) =>
        updateGridSizeValue(e.target.value)
    );
    dom.gridSizer.addEventListener('change', (e) =>
        changeGridSize(e.target.value)
    );

    dom.downloadButton.addEventListener('click', () => downloadSketch());
}
