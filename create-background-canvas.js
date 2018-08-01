define(function () {
    'use strict';

    const heightMargin = 4;

    const makeCanvas = (left, top, width, height) => {
        let canvas = document.createElement('canvas');
        canvas.style.position = 'absolute';
        canvas.height = height;
        canvas.width = width;
        canvas.style.left = left + 'px';
        canvas.style.top = top + 'px';

        return canvas;
    };

    const isPositioned = node => node.style.position !== '' && node.style.position !== 'static';

    const positionElement = node => {
        if (!isPositioned(node)) {
            node.style.position = 'relative';
        }
    };

    /**
     * Create a new canvas element and position it behind the given target element.
     */
    return targetElement => {
        positionElement(targetElement.parentNode);

        const {offsetWidth, offsetHeight, scrollWidth, scrollHeight, offsetLeft, offsetTop} = targetElement;
        const width = scrollWidth;
        const height = scrollHeight + heightMargin;

        const canvas = makeCanvas(offsetLeft, offsetTop, width, height);
        
        canvas.style.zIndex = targetElement.style.zIndex - 1;
        targetElement.after(canvas);
        
        return canvas;
    };
});
