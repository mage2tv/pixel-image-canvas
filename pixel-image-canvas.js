define(function () {
    'use strict';

    const imageCanvasContext = img => {
        const canvas = document.createElement('canvas');
        canvas.height = img.naturalHeight;
        canvas.width = img.naturalWidth;
        const ctx = canvas.getContext('2d');
        ctx.drawImage(img, 0, 0);
        return ctx;
    };

    const averageColors = pixels => {
        const rgba = [0, 0, 0, 0];
        let count = 0;
        for (let i = 0; i < pixels.length; i += 4) {
            count++;
            rgba[0] += pixels[i];
            rgba[1] += pixels[i + 1];
            rgba[2] += pixels[i + 2];
            rgba[3] += pixels[i + 3];
        }
        return count === 0 ? undefined : rgba.map(x => Math.floor(x / count));
    };
    
    const extractColorsFromImage = (img, cols, rows) => {
        const ctx = imageCanvasContext(img);
        const cellW = Math.max(Math.floor(img.naturalWidth / cols), 1);
        const cellH = Math.max(Math.floor(img.naturalHeight / rows), 1);

        const colors = [];
        for (let y = 0; y < rows; y++) {
            for (let x = 0; x < cols; x++) {
                let pixels = ctx.getImageData(x * cellW, y * cellH, cellW, cellH).data;
                colors[y] || (colors[y] = []);
                colors[y][x] = averageColors(pixels);
            }
        }
        return colors;
    };

    /**
     * Expects a canvas DOM element and a 2 dimensional array with rows of colors.
     * Renders rectangles with the given colors across the canvas.
     */
    const rasterCanvas = (canvas, colors) => {
        const rows = colors.length;
        const cols = colors[0].length;
        const cellW = Math.max(Math.floor(canvas.offsetWidth / cols), 1);
        const cellH = Math.max(Math.floor(canvas.offsetHeight / rows), 1);
        const ctx = canvas.getContext('2d');
        for (let y = 0; y < rows; y++) {
            for (let x = 0; x < cols; x++) {
                const color = colors[y] && colors[y][x] || [0, 0, 0, 0];
                ctx.fillStyle = 'rgb(' + color.join(',') + ')';
                ctx.fillRect(x * cellW, y * cellH, cellW, cellH);
            }
        }
    };
    
    const loadImageColors = (src, cols, rows) => {
        return new Promise(resolve => {
            const img = new Image();
            img.addEventListener('load', e => resolve(extractColorsFromImage(e.target, cols, rows)));
            img.src = src;
        });
    };

    /**
     * Load the given image from src and pixelate it onto the given canvas DOM element.
     * The pixel size is dictated by the canvas size and how many cols and rows to use. 
     */
    return (canvas, src, cols, rows) => {
        loadImageColors(src, Math.max(cols, 1), Math.max(rows, 1))
            .then(colors => rasterCanvas(canvas, colors));
    }
});
