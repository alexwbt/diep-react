import { game } from '../../Game';
import { addChat } from "../../redux/actions/chatActions";
import { showConnection } from "../../redux/actions/connectionActions";
import { showSpawn } from "../../redux/actions/spawnActions";
import { addToast } from "../../redux/actions/toastActions";

export const socketConnect = server => dispatch => {
    dispatch({
        type: 'SOCKET_CONNECT',
        server,
        listeners: [
            {
                name: 'gameAlert',
                callback: data => {
                    dispatch(addToast(data));
                }
            },
            {
                name: 'chat',
                callback: data => {
                    dispatch(addChat(data));
                }
            },
            {
                name: 'playerId',
                callback: data => {
                    game.playerId = data;
                }
            },
            {
                name: 'update',
                callback: data => {
                    game.setData(data);
                }
            },
            {
                name: 'connect',
                callback: () => {
                    dispatch(addToast('Connected to server', { color: '#5d5' }));
                }
            },
            {
                name: 'connect_error',
                callback: () => {
                    dispatch(addToast('Unable to connect to server', { color: '#d55' }));
                    dispatch(showConnection(true));
                }
            },
            {
                name: 'disconnect',
                callback: () => {
                    dispatch(addToast('Disconnected from server', { color: '#d55' }));
                    dispatch(showConnection(true));
                }
            },
            {
                name: 'gameEvent',
                callback: ({ event, data }) => {
                    switch (event) {
                        case 'killAlert':
                            dispatch(addToast(`${data.killed}${data.killedBy ? ` was killed by ${data.killedBy}` : ' died'}`));
                            if (game.player && data.killedId === game.playerId) dispatch(showSpawn(true));
                            break;
                        default:
                    }
                }
            }
        ]
    });
};

export const socketEmit = (name, data) => dispatch => {
    dispatch({ type: 'SOCKET_EMIT', name, data });
};

export const socketDisconnect = () => dispatch => {
    dispatch({ type: 'SOCKET_DISCONNECT' });
};
