// Paintbucket function
export function floodFill(startCell, newColor) {
    let gridItems = Array.from(document.querySelectorAll('.grid-item'));
    let columns = Math.sqrt(gridItems.length);
    let startColor = window.getComputedStyle(startCell).backgroundColor;

    if (startColor === newColor) return;

    let queue = [startCell];
    let visited = new Set(queue);

    while (queue.length) {
        let cell = queue.pop();
        let index = gridItems.indexOf(cell);
        cell.style.backgroundColor = newColor;

        let neighbors = [];
        if (index % columns !== 0) neighbors.push(gridItems[index - 1]);
        if ((index + 1) % columns !== 0) neighbors.push(gridItems[index + 1]);
        if (index - columns >= 0) neighbors.push(gridItems[index - columns]);
        if (index + columns < gridItems.length)
            neighbors.push(gridItems[index + columns]);

        for (let neighbor of neighbors) {
            if (
                !visited.has(neighbor) &&
                window.getComputedStyle(neighbor).backgroundColor === startColor
            ) {
                queue.push(neighbor);
                visited.add(neighbor);
            }
        }
    }
}

// Convert RGB to HSL for lighten and darken modes
export function rgbToHsl(target, [r, g, b], colorMode) {
    r /= 255;
    g /= 255;
    b /= 255;
    let max = Math.max(r, g, b);
    let min = Math.min(r, g, b);
    let d = max - min;
    let h;

    if (d === 0) {
        h = 0;
    } else if (max === r) {
        h = ((g - b) / d) % 6;
    } else if (max === g) {
        h = (b - r) / d + 2;
    } else if (max === b) {
        h = (r - g) / d + 4;
    }

    let l = (min + max) / 2;
    let s = d === 0 ? 0 : d / (1 - Math.abs(2 * l - 1));
    h *= 60;
    s *= 100;
    l *= 100;

    if (colorMode == 'lighten') {
        lightenColor(target, [h, s, l]);
    } else if (colorMode == 'darken') {
        darkenColor(target, [h, s, l]);
    }
    return [h, s, l];
}

function lightenColor(target, [h, s, l]) {
    let newLightness = Math.max(0, Math.min(100, l + 10));
    target.style.backgroundColor = `hsl(${h}, ${s}%, ${newLightness}%)`;
}

function darkenColor(target, [h, s, l]) {
    let newLightness = Math.max(0, Math.min(100, l - 10));
    target.style.backgroundColor = `hsl(${h}, ${s}%, ${newLightness}%)`;
}

// Download

export function downloadSketch() {
    const canvas = document.createElement('canvas');
    const ctx = canvas.getContext('2d');

    const gridItems = document.querySelectorAll('.grid-item');
    const gridSize = Math.sqrt(gridItems.length);
    const gridItemSize = gridItems[0].offsetWidth;

    canvas.width = gridSize * gridItemSize;
    canvas.height = gridSize * gridItemSize;

    gridItems.forEach((gridItem, index) => {
        const row = Math.floor(index / gridSize);
        const column = index % gridSize;
        const backgroundColor =
            window.getComputedStyle(gridItem).backgroundColor;

        ctx.fillStyle = backgroundColor;
        ctx.fillRect(
            column * gridItemSize,
            row * gridItemSize,
            gridItemSize,
            gridItemSize
        );
    });

    const link = document.createElement('a');
    link.download = 'sketch.png';
    link.href = canvas.toDataURL('image/png');
    link.click();
}
