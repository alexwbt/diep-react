import React, { useEffect, useRef } from 'react';
import Game from './game';
import Tank, { createTankInfo } from './game/object/Tank';
import useKeyInput from './KeyInputHook';
import useMouseInput from './MouseInputHook';

const game = new Game();
game.playerId = game.spawn(new Tank(createTankInfo({ x: 10, weaponType: 'twinCannon' })));
game.spawnObstacles();

const Canvas = () => {
    const canvas = useRef(null);
    const keyDown = useKeyInput(['w', 'a', 's', 'd']);
    const [mouse, mouseDown] = useMouseInput();

    useEffect(() => game.setCanvas(canvas.current), [canvas]);
    useEffect(() => game.setKeyDown(keyDown), [keyDown]);
    useEffect(() => game.setMouse(mouse), [mouse]);
    useEffect(() => game.fire(mouseDown), [mouseDown]);

    return <canvas ref={canvas}></canvas>;
};

export default Canvas;
