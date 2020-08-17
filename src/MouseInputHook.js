import { useEffect, useState } from 'react';

const useMouseInput = (mouseDown, mouseUp) => {
    const [position, setPosition] = useState({ x: NaN, y: NaN });

    useEffect(() => {
        const moveHandler = e => setPosition({ x: e.x, y: e.y });
        window.addEventListener('mousemove', moveHandler);
        window.addEventListener('mousedown', mouseDown);
        window.addEventListener('mouseup', mouseUp);
        return () => {
            window.removeEventListener('mousemove', moveHandler);
            window.removeEventListener('mousedown', mouseDown);
            window.removeEventListener('mouseup', mouseUp);
        };
    }, [mouseDown, mouseUp]);

    return position;
};

export default useMouseInput;
