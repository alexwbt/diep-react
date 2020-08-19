import { useEffect, useState } from 'react';

const useMouseInput = (mouseWheelCallback) => {
    const [position, setPosition] = useState({ x: NaN, y: NaN });
    const [mouseDown, setMouseDown] = useState(false);

    useEffect(() => {
        const moveHandler = e => setPosition({ x: e.x, y: e.y });
        const mouseDownHandler = e => setMouseDown(true);
        const mouseUpHandler = e => setMouseDown(false);
        window.addEventListener('mousemove', moveHandler);
        window.addEventListener('mousedown', mouseDownHandler);
        window.addEventListener('mouseup', mouseUpHandler);
        window.addEventListener('mousewheel', mouseWheelCallback);
        return () => {
            window.removeEventListener('mousemove', moveHandler);
            window.removeEventListener('mousedown', mouseDownHandler);
            window.removeEventListener('mouseup', mouseUpHandler);
            window.removeEventListener('mousewheel', mouseWheelCallback);
        };
    }, [mouseWheelCallback]);

    return [position, mouseDown];
};

export default useMouseInput;
