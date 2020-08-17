import React, { useEffect, useRef, useState } from 'react';
import Game from './game';
import Tank, { createTankInfo } from './game/object/Tank';
import useKeyInput from './KeyInputHook';
import useMouseInput from './MouseInputHook';
import Toaster from './toast';

const game = new Game();
game.playerId = game.spawn(new Tank(createTankInfo({ x: 10, weaponType: 'twinCannon' })));
game.spawnObstacles();

const Canvas = () => {
    const canvas = useRef(null);
    const keyDown = useKeyInput(['w', 'a', 's', 'd']);
    const [mouse, mouseDown] = useMouseInput();
    const [toasts, setToasts] = useState([]);

    useEffect(() => game.setCanvas(canvas.current), [canvas]);
    useEffect(() => game.setKeyDown(keyDown), [keyDown]);
    useEffect(() => game.setMouse(mouse), [mouse]);
    useEffect(() => game.fire(mouseDown), [mouseDown]);

    useEffect(() => {
        setToasts(t => t.concat([Math.random()]));
        setTimeout(() => setToasts(t => t.slice(1)), 5000);
    }, [keyDown, setToasts]);

    return (
        <div>
            <canvas ref={canvas} />
            <Toaster toasts={toasts}/>
        </div>
    );
};

export default Canvas;
