import React, { useEffect, useRef } from 'react';
import Game from './game';
import useKeyInput from './KeyInputHook';
import GameObject, { createObjectInfo } from './game/object';

const game = new Game();

const Canvas = () => {
    const canvas = useRef(null);
    const keyDown = useKeyInput(['w', 'a', 's', 'd']);

    useEffect(() => {
    }, [keyDown]);

    useEffect(() => {
        game.setCanvas(canvas.current);
        game.spawn(new GameObject(createObjectInfo()));
        game.spawn(new GameObject(createObjectInfo({ x: 10 })));
    }, [canvas]);

    return (
        <div>
            <canvas ref={canvas}></canvas>
        </div>
    );
};

export default Canvas;
