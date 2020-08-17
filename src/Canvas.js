import React, { useEffect, useRef } from 'react';
import Game from './game';
import GameObject, { createObjectInfo } from './game/object';
import RegularPolygon from './game/object/RegularPolygon';
import Tank, { createTankInfo } from './game/object/Tank';
import useKeyInput from './KeyInputHook';
import useMouseInput from './MouseInputHook';

const game = new Game();

const Canvas = () => {
    const canvas = useRef(null);
    const keyDown = useKeyInput(['w', 'a', 's', 'd']);
    const mouse = useMouseInput(() => game.fire(true), () => game.fire(false));

    useEffect(() => {
        game.setKeyDown(keyDown);
    }, [keyDown]);

    useEffect(() => {
        game.setMouse(mouse);
    }, [mouse]);

    useEffect(() => {
        game.setCanvas(canvas.current);
        game.spawn(new GameObject(createObjectInfo()));
        const player = new Tank(createTankInfo({ x: 10 }));
        player.playerId = 0;
        game.spawn(player);
        game.spawn(new RegularPolygon(createObjectInfo({ x: 50 }), 5));
        game.scale = 3;
        game.spawnObstacles();
    }, [canvas]);

    return (
        <div>
            <canvas ref={canvas}></canvas>
        </div>
    );
};

export default Canvas;
