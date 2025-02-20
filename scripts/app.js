import { createGrid } from './grid.js';
import { updateRecentColors } from './recentColors.js';
import { setupEventListeners } from './eventHandlers.js';

document.addEventListener('DOMContentLoaded', () => {
    createGrid(16); // Default size
    updateRecentColors();
    setupEventListeners();
});
