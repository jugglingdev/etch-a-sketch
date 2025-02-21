import dom from './dom.js';
import { handleRecentColors } from './recentColors.js';
import { floodFill, rgbToHsl } from './utils.js';
import { saveState } from './history.js';

let currentTool = 'brush';
let currentColor = 'hsl(0, 0%, 20%)';
let colorMode = 'color';

const tools = {
    brush: ['paintbrush', 'color'],
    bucket: ['paintBucket', 'color'],
    rainbow: ['paintbrush', 'rainbow'],
    lighten: ['paintbrush', 'lighten'],
    darken: ['paintbrush', 'darken'],
    eraser: ['paintbrush', 'eraser'],
};

const BRUSH_CURSOR_STYLE =
    'url(https://jugglingdev.github.io/etch-a-sketch/images/icons/paintbrush-cursor.png) 6 26, auto';
const BUCKET_CURSOR_STYLE =
    'url(https://jugglingdev.github.io/etch-a-sketch/images/icons/paint-bucket-cursor.png) 6 26, auto';

export function setCurrentTool(tool) {
    currentTool = tool;
    makeButtonActive(tool);
    updateCursor(currentTool);
}

export function setColorMode(mode) {
    colorMode = mode;
    if (colorMode === 'color') {
        makeButtonActive(currentTool);
    } else {
        makeButtonActive(mode);
        currentTool = 'brush';
    }
    updateCursor(currentTool);
}

function updateCursor(tool) {
    let toolType = tools[tool][0];
    if (toolType === 'paintbrush') {
        dom.grid.style.cursor = BRUSH_CURSOR_STYLE;
    } else if (toolType === 'paintBucket') {
        dom.grid.style.cursor = BUCKET_CURSOR_STYLE;
    }
}

export function setCurrentColor(color) {
    currentColor = color;
    dom.colorPicker.value = color;
}

function makeButtonActive(newMode) {
    Object.values(tools)
        .flat()
        .forEach((id) =>
            document.getElementById(id)?.classList.remove('active')
        );

    if (tools[newMode]) {
        tools[newMode].forEach((id) =>
            document.getElementById(id)?.classList.add('active')
        );
    }

    if (newMode === 'brush' || newMode === 'bucket') {
        dom.color.classList.add('active');
    } else {
        dom.color.classList.remove('active');
    }
}

export function sketch(e) {
    if (e.type === 'mouseover' && !window.mouseDown) return;
    saveState();

    const toolType = tools[currentTool][0]; // 'paintbrush' or 'paintBucket'
    if (toolType === 'paintbrush') {
        applyPaintbrushMode(e.target, colorMode);
    } else if (toolType === 'paintBucket') {
        applyBucketFill(e.target);
    }
}

function applyPaintbrushMode(target, mode) {
    if (mode === 'color') {
        target.style.backgroundColor = currentColor;
        handleRecentColors(currentColor);
    } else if (mode === 'rainbow') {
        let randomHue = Math.floor(Math.random() * 361);
        target.style.backgroundColor = `hsl(${randomHue}, 100%, 50%)`;
    } else if (mode === 'eraser') {
        target.style.backgroundColor = 'rgb(255, 255, 255)';
    } else if (mode === 'lighten' || mode === 'darken') {
        let gridItemColor = window.getComputedStyle(target).backgroundColor;
        let gridItemColorRGB = gridItemColor.match(/\d+/g).map(Number);
        rgbToHsl(target, gridItemColorRGB, colorMode);
    }
}

function applyBucketFill(target) {
    floodFill(target, currentColor);
    handleRecentColors(currentColor);
}
