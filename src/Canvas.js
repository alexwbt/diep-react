import React, { useEffect, useRef } from 'react';
import Game from './game';
import useKeyInput from './KeyInputHook';

const game = new Game();

const Canvas = () => {
    const canvas = useRef(null);
    const keyDown = useKeyInput(['w', 'a', 's', 'd']);

    useEffect(() => {
    }, [keyDown]);

    useEffect(() => {
        game.setCanvas(canvas.current);
    }, [canvas]);

    return (
        <div>
            <canvas ref={canvas}></canvas>
        </div>
    );
};

export default Canvas;
