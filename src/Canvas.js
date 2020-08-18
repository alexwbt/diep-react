import React, { useEffect, useRef, useCallback } from 'react';
import styled from 'styled-components';
import Chat from './chat';
import useChat from './chat/ChatHook';
import Game from './game';
import Tank, { createTankInfo } from './game/object/Tank';
import useKeyInput from './input/KeyInputHook';
import useMouseInput from './input/MouseInputHook';
import Toaster from './toast';
import useToast from './toast/ToastHook';

const FixedCanvas = styled.canvas`
    position: fixed;
`;

const game = new Game();
game.playerId = game.spawn(new Tank(createTankInfo({ x: 10, weaponType: 'twinCannon' })));
game.spawnObstacles();

const Canvas = () => {
    const canvas = useRef(null);
    const keyDown = useKeyInput(['w', 'a', 's', 'd']);
    const [mouse, mouseDown] = useMouseInput();
    const [toasts, /*addToast*/] = useToast();
    const [chats, appendMessage] = useChat();

    useEffect(() => game.setCanvas(canvas.current), [canvas]);
    useEffect(() => game.setKeyDown(keyDown), [keyDown]);
    useEffect(() => game.setMouse(mouse), [mouse]);
    useEffect(() => game.fire(mouseDown), [mouseDown]);

    // useEffect(() => addToast({ message: 'test' }), [keyDown, addToast]);

    const chatEnter = useCallback(message => {
        appendMessage({ message });
    }, [appendMessage]);

    return (
        <div>
            <FixedCanvas ref={canvas} />
            <Toaster toasts={toasts} />
            <Chat chats={chats} onEnter={chatEnter} />
        </div>
    );
};

export default Canvas;
