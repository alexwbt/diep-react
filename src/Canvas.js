import React, { useEffect, useRef } from 'react';
import Game from './game';
import Tank, { createTankInfo } from './game/object/Tank';
import useKeyInput from './KeyInputHook';
import useMouseInput from './MouseInputHook';

const game = new Game();
const player = new Tank(createTankInfo({ x: 10 }));
player.playerId = 0;
game.spawn(player);
game.spawnObstacles();

const Canvas = () => {
    const canvas = useRef(null);
    const keyDown = useKeyInput(['w', 'a', 's', 'd']);
    const mouse = useMouseInput(() => game.fire(true), () => game.fire(false));

    useEffect(() => game.setCanvas(canvas.current), [canvas]);
    useEffect(() => game.setKeyDown(keyDown), [keyDown]);
    useEffect(() => game.setMouse(mouse), [mouse]);

    return <canvas ref={canvas}></canvas>;
};

export default Canvas;
