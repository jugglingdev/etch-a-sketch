import dom from './dom.js';
import { handleRecentColors } from './recentColors.js';
import { floodFill, rgbToHsl } from './utils.js';
import { saveState } from './history.js';

let mouseDown = false;
let isDrawing = false;
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

export function setMouseDown(boolean) {
    mouseDown = boolean;
}

export function startSketch(e) {
    if (mouseDown) {
        isDrawing = true;
    }
    sketch(e);
}

dom.body.addEventListener('mouseup', () => {
    console.log('isDrawing: ', isDrawing);
    if (isDrawing) {
        endSketch();
        isDrawing = false;
    }
});

export function endSketch() {
    if (isDrawing) {
        saveState();
    }
}

function sketch(e) {
    // Limit sketch() to work with mousedown && mouseover; not hover alone
    if (e.type === 'mouseover' && !mouseDown) return;

    const toolType = tools[currentTool][0]; // 'paintbrush' or 'paintBucket'
    if (toolType === 'paintbrush') {
        switch (colorMode) {
            case 'color':
                applyColorMode(e.target);
                break;
            case 'rainbow':
                applyRainbowMode(e.target);
                break;
            case 'eraser':
                applyEraserMode(e.target);
                break;
            case 'lighten':
                applyLightenMode(e.target);
                break;
            case 'darken':
                applyDarkenMode(e.target);
                break;
            default:
                console.warn('Unknown mode:', colorMode);
        }
    } else if (toolType === 'paintBucket') {
        applyBucketFill(e.target);
    }
}

function applyColorMode(target) {
    target.style.backgroundColor = currentColor;
    handleRecentColors(currentColor);
}

function applyRainbowMode(target) {
    let randomHue = Math.floor(Math.random() * 361);
    target.style.backgroundColor = `hsl(${randomHue}, 100%, 50%)`;
}

function applyLightenMode(target) {
    let gridItemColor = window.getComputedStyle(target).backgroundColor;
    let gridItemColorRGB = gridItemColor.match(/\d+/g).map(Number);
    rgbToHsl(target, gridItemColorRGB, 'lighten');
}

function applyDarkenMode(target) {
    let gridItemColor = window.getComputedStyle(target).backgroundColor;
    let gridItemColorRGB = gridItemColor.match(/\d+/g).map(Number);
    rgbToHsl(target, gridItemColorRGB, 'darken');
}

function applyEraserMode(target) {
    target.style.backgroundColor = 'rgb(255, 255, 255)';
}

function applyBucketFill(target) {
    floodFill(target, currentColor);
    handleRecentColors(currentColor);
}
