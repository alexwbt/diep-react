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
import useSocket from './socket/SocketHook';

const FixedCanvas = styled.canvas`
    position: fixed;
`;

const game = new Game();
const player = new Tank(createTankInfo({ x: 10, weaponType: 'twinCannon' }));
player.objectId = 0;
game.playerId = 0;
game.spawn(player);
game.spawnObstacles();

const Canvas = () => {
    const canvas = useRef(null);
    const keyDown = useKeyInput(['w', 'a', 's', 'd']);
    const [mouse, mouseDown] = useMouseInput();
    const [toasts, addToast] = useToast();
    const [chats, appendMessage] = useChat();
    const [socket, connect] = useSocket();

    useEffect(() => game.setCanvas(canvas.current), [canvas]);
    useEffect(() => game.setKeyDown(keyDown), [keyDown]);
    useEffect(() => game.setMouse(mouse), [mouse]);
    useEffect(() => game.fire(mouseDown), [mouseDown]);
    useEffect(() => { game.socket = socket }, [socket]);

    useEffect(() => {
        if (!socket) {
            connect('192.168.19.162:5000');
            return;
        }

        socket.on('update', data => {
            game.setData(data);
        });

        socket.on('gameAlert', data => {
            addToast({ message: data, options: { color: 'skyblue', duration: 10000 } });
        });

        socket.on('chat', data => {
            appendMessage({ message: data });
        });

        socket.on('playerId', data => {
            game.playerId = data;
            console.log(data);
        });

        socket.on('connect', () => {
            addToast({ message: 'Connected to server', options: { color: '#5d5' } });

            socket.emit('setName', 'test');
        });
    }, [socket, connect, addToast, appendMessage]);

    const chatEnter = useCallback(message => {
        socket.emit('chat', message);
    }, [socket]);

    return (
        <div>
            <FixedCanvas ref={canvas} />
            <Toaster toasts={toasts} />
            <Chat chats={chats} onEnter={chatEnter} />
        </div>
    );
};

export default Canvas;
