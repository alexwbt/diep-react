import io from 'socket.io-client';
import { game } from '../../Game';

let emitList = [];

const socketReducer = (state = null, action) => {
    switch (action.type) {
        case 'SOCKET_CONNECT':
            if (state && state.connected)
                state.close();
            const socket = io(action.server, { upgrade: true, reconnection: false });
            socket.on('connect', () => {
                emitList.forEach(e => socket.emit(e.name, e.data));
                emitList = [];
            });
            for (const listener of action.listeners)
                socket.on(listener.name, listener.callback);
            game.socket = socket;
            return socket;
        case 'SOCKET_DISCONNECT':
            setTimeout(() => {
                state.close();
                game.init();
            }, 100);
            game.socket = false;
            return null;
        case 'SOCKET_EMIT':
            if (state && state.connected)
                state.emit(action.name, action.data);
            else emitList.push(action);
            return state;
        default: return state;
    }
};

export default socketReducer;
