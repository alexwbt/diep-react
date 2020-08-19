import React, { useEffect, useRef, useCallback, useState } from 'react';
import styled from 'styled-components';
import Chat from './chat';
import useChat from './chat/ChatHook';
import Game from './game';
import Tank from './game/object/Tank';
import useKeyInput from './input/KeyInputHook';
import useMouseInput from './input/MouseInputHook';
import Toaster from './toast';
import useToast from './toast/ToastHook';
import io from 'socket.io-client';
import SetName from './SetName';

const FixedCanvas = styled.canvas`
    position: fixed;
`;

const game = new Game();
const player = new Tank({ x: 10, weaponType: 'twinCannon' });
player.objectId = 0;
game.playerId = 0;
game.spawn(player);
game.spawnWeaponBalls();
game.spawnObstacles();

const Canvas = () => {
    const canvas = useRef(null);
    const keyDown = useKeyInput(['w', 'a', 's', 'd']);
    const keyToggle = useKeyInput(['c', 'v'], true);
    const [mouse, mouseDown] = useMouseInput(useCallback(e => {
        game.view = Math.min(700, Math.max(20, game.view + e.deltaY));
    }, []));
    const [toasts, addToast] = useToast();
    const [chats, appendMessage] = useChat();
    const [socket, setSocket] = useState(null);
    const [showSetName, setShowSetName] = useState(false);

    useEffect(() => game.setCanvas(canvas.current), [canvas]);
    useEffect(() => game.setKeyDown(keyDown), [keyDown]);
    useEffect(() => game.setMouse(mouse), [mouse]);
    useEffect(() => game.fire(mouseDown), [mouseDown]);
    useEffect(() => { game.socket = socket }, [socket]);

    useEffect(() => {
        if (!socket) {
            addToast({ message: 'Connecting to ' + process.env.REACT_APP_GAME_SERVER });
            setSocket(io(process.env.REACT_APP_GAME_SERVER, {
                upgrade: true
            }))
            return;
        }
        socket.on('gameAlert', data => addToast({ message: data }));
        socket.on('chat', data => appendMessage({ message: data }));
        socket.on('playerId', data => { game.playerId = data; });
        socket.on('update', data => game.setData(data));
        socket.on('disconnect', () => addToast({ message: 'Disconnected from server', options: { color: '#d55' } }));

        socket.on('connected', () => {
            addToast({ message: 'Connected to server', options: { color: '#5d5' } });
            setShowSetName(true);
        });
        socket.on('gameEvent', ({ event, data }) => {
            switch (event) {
                case 'killAlert':
                    addToast({ message: `${data.killed}${data.killedBy ? ` was killed by ${data.killedBy}` : ' died'}` });
                    if (game.player && data.killedId === game.playerId) setShowSetName(true);
                    break;
                default:
            }
        });
    }, [socket, setSocket, setShowSetName, addToast, appendMessage]);

    const chatEnter = useCallback(message => socket.emit('chat', message), [socket]);
    const onSubmitName = useCallback(name => {
        socket.emit('setName', name);
        setShowSetName(false);
    }, [socket]);

    return (
        <div>
            <FixedCanvas ref={canvas} />
            <Toaster toasts={toasts} show={keyToggle[1]} />
            <Chat chats={chats} onEnter={chatEnter} show={keyToggle[0]} />
            <SetName onSubmit={onSubmitName} show={showSetName} />
        </div>
    );
};

export default Canvas;
