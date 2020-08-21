import React, { useRef, useEffect } from 'react';
import styled from 'styled-components';
import { game } from '../Game';

const FixedCanvas = styled.canvas`
    position: fixed;
`;

const Canvas = () => {
    const canvas = useRef(null);
    useEffect(() => game.setCanvas(canvas.current), [canvas]);

    // mouse input
    useEffect(() => {
        const moveHandler = e => game.setMouse({ x: e.x, y: e.y });
        const mouseDownHandler = () => game.fire(true);
        const mouseUpHandler = () => game.fire(false);
        const mouseWheelHandler = e => game.view = Math.min(700, Math.max(20, game.view + e.deltaY));
        window.addEventListener('mousemove', moveHandler);
        window.addEventListener('mousedown', mouseDownHandler);
        window.addEventListener('mouseup', mouseUpHandler);
        window.addEventListener('mousewheel', mouseWheelHandler);
        return () => {
            window.removeEventListener('mousemove', moveHandler);
            window.removeEventListener('mousedown', mouseDownHandler);
            window.removeEventListener('mouseup', mouseUpHandler);
            window.removeEventListener('mousewheel', mouseWheelHandler);
        };
    }, []);

    // key input
    useEffect(() => {
        const set = new Set();
        const controls = ['w', 'a', 's', 'd'];
        const update = () => game.setKeyDown(controls.map(k => set.has(k)));
        const keyDownHandler = e => {
            if (!e.repeat) {
                set.add(e.key);
                update();
            }
        };
        const keyUpHandler = e => {
            set.delete(e.key);
            update();
        };
        window.addEventListener('keydown', keyDownHandler);
        window.addEventListener('keyup', keyUpHandler);
        return () => {
            window.removeEventListener('keydown', keyDownHandler);
            window.removeEventListener('keyup', keyUpHandler);
        };
    }, []);

    return <FixedCanvas ref={canvas} />;
};

export default Canvas;
