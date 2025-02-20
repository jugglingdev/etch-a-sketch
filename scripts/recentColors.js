import dom from './dom.js';
import { setColorMode, setCurrentColor } from './modes.js';

// Retrieve recent colors from local storage
let recentColorsArray = JSON.parse(localStorage.getItem('recentColors')) || [];

// Update UI if recent colors exist
if (recentColorsArray.length) {
    updateRecentColors();
}

// Handle adding a new color to recent colors
export function handleRecentColors(color) {
    let selectedColor = toHex(color);
    recentColorsArray = [
        selectedColor,
        ...recentColorsArray.filter((c) => c !== selectedColor),
    ];

    // Limit to 10 recent colors
    recentColorsArray = recentColorsArray.slice(0, 10);

    updateRecentColors();
}

// Update recent color swatches in the UI
export function updateRecentColors() {
    if (!dom.recentColors) return;

    dom.recentColors.innerHTML = '';
    recentColorsArray.forEach((color) => {
        let swatch = document.createElement('button');
        swatch.classList.add('color-swatch');
        swatch.style.backgroundColor = color;
        swatch.addEventListener('click', () => {
            setCurrentColor(color);
            setColorMode('color');
        });

        dom.recentColors.appendChild(swatch);
    });

    localStorage.setItem('recentColors', JSON.stringify(recentColorsArray));
}

// Convert a color to its hex representation
function toHex(color) {
    let ctx = document.createElement('canvas').getContext('2d');
    ctx.fillStyle = color;
    let computedColor = ctx.fillStyle; // Convert named colors & shorthand hex
    if (computedColor.startsWith('rgb')) {
        let rgb = computedColor.match(/\d+/g).map(Number);
        return `#${rgb.map((c) => c.toString(16).padStart(2, '0')).join('')}`;
    }
    return computedColor;
}
