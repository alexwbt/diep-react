import { game } from './Game';
import { addChat } from "./redux/actions/chatActions";
import { showConnection } from "./redux/actions/connectionActions";
import { showSpawn } from "./redux/actions/spawnActions";
import { addToast } from "./redux/actions/toastActions";

export const getListeners = dispatch => [
    {
        name: 'gameAlert',
        callback: data => {
            addToast(data)(dispatch);
        }
    },
    {
        name: 'chat',
        callback: data => {
            addChat(data)(dispatch);
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
            addToast('Connected to server', { color: '#5d5' })(dispatch);
        }
    },
    {
        name: 'connect_error',
        callback: () => {
            addToast('Unable to connect to server', { color: '#d55' })(dispatch);
            showConnection(true)(dispatch);
        }
    },
    {
        name: 'disconnect',
        callback: () => {
            addToast('Disconnected from server', { color: '#d55' })(dispatch);
            showConnection(true)(dispatch);
        }
    },
    {
        name: 'gameEvent',
        callback: ({ event, data }) => {
            switch (event) {
                case 'killAlert':
                    addToast(`${data.killed}${data.killedBy ? ` was killed by ${data.killedBy}` : ' died'}`)(dispatch);
                    if (game.player && data.killedId === game.playerId) showSpawn(true)(dispatch);
                    break;
                default:
            }
        }
    }
];
