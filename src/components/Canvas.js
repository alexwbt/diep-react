import React, { useRef, useEffect } from 'react';
import styled from 'styled-components';
import { game } from '../Game';
import { useDispatch } from 'react-redux';
import { socketEmit } from '../redux/actions/socketActions';

const FixedCanvas = styled.canvas`
    position: fixed;
`;

const Canvas = () => {
    const dispatch = useDispatch();

    const canvas = useRef(null);
    useEffect(() => game.setCanvas(canvas.current), [canvas]);

    // mouse input
    useEffect(() => {
        const moveHandler = e => game.setMouse({ x: e.x, y: e.y });
        const mouseDownHandler = () => game.fire(true);
        const mouseUpHandler = () => game.fire(false);
        const mouseWheelHandler = e => game.view = Math.min(game.playerId === 0 ? 4000 : 700, Math.max(20, game.view + e.deltaY));
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
        const controls = ['w', 'a', 's', 'd', 'shift'];
        const toggleKeys = new Set();
        const update = () => {
            game.setKeyDown(controls.map(k => set.has(k)));
            game.minimap.hide = toggleKeys.has('m');
        };
        const keyDownHandler = e => {
            const key = e.key.toLowerCase();
            if (!e.repeat) {
                set.add(key);
                if (e.ctrlKey) {
                    if (toggleKeys.has(key)) toggleKeys.delete(key);
                    else toggleKeys.add(key);
                }

                switch (key) {
                    case 'g':
                        if (game.player) {
                            game.player.throwGrenade(game);
                            dispatch(socketEmit('throwGrenade'));
                        }
                        break;
                    case ' ':
                        if (game.player) {
                            game.player.flash(game);
                            dispatch(socketEmit('flash'));
                        }
                        break;
                    default:
                }

                update();
            }
        };
        const keyUpHandler = e => {
            set.delete(e.key.toLowerCase());
            update();
        };
        window.addEventListener('keydown', keyDownHandler);
        window.addEventListener('keyup', keyUpHandler);
        return () => {
            window.removeEventListener('keydown', keyDownHandler);
            window.removeEventListener('keyup', keyUpHandler);
        };
    }, [dispatch]);

    return <FixedCanvas ref={canvas} />;
};

export default Canvas;
