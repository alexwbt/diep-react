import { game } from '../../Game';
import { addChat } from "../../redux/actions/chatActions";
import { showConnection } from "../../redux/actions/connectionActions";
import { showSpawn, setMessage } from "../../redux/actions/spawnActions";
import { addToast } from "../../redux/actions/toastActions";
import { leaderBoardSetPlayers } from './leaderBoardActions';

let countdownInterval;

export const socketConnect = server => dispatch => {
    game.playerId = 0;
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
                name: 'playerRotate',
                callback: data => {
                    game.playerRotate.push(data);
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
                name: 'killAlert',
                callback: ({ killed, killedBy, killedId }) => {
                    if (killed === killedBy) dispatch(addToast(`${killed} committed suicide`));
                    else dispatch(addToast(`${killed}${killedBy ? ` was killed by ${killedBy}` : ' died'}`));
                    if (game.player && killedId === game.playerId) {
                        game.playerId = 0;
                        dispatch(setMessage('You died.'));
                        dispatch(showSpawn(true));
                    }
                }
            },
            {
                name: 'startCountdown',
                callback: (countdown) => {
                    dispatch(addToast(`Game is starting in ${countdown} seconds`));
                    if (countdownInterval) clearInterval(countdownInterval);
                    countdownInterval = setInterval(() => {
                        dispatch(addToast(--countdown, { duration: 1000 }));
                        if (countdown <= 0) {
                            clearInterval(countdownInterval);
                            dispatch(addToast(`Game started!! Good luck`));
                            dispatch(showSpawn(false));
                        }
                    }, 1000);
                }
            },
            {
                name: 'stopCountdown',
                callback: () => {
                    if (countdownInterval) {
                        clearInterval(countdownInterval);
                        dispatch(addToast('Countdown stopped. Not enough player'))
                    }
                }
            },
            {
                name: 'gameEnded',
                callback: ({ winner }) => {
                    dispatch(setMessage(winner ? winner + ' won!!!' : 'Game Ended'));
                    dispatch(showSpawn(true));
                    game.playerId = 0;
                }
            },
            {
                name: 'alivePlayers',
                callback: players => {
                    dispatch(leaderBoardSetPlayers(players));
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

export const socketReconnect = () => (dispatch, getState) => {
    const { name, server } = getState().connection;
    dispatch(socketDisconnect());
    setTimeout(() => dispatch(socketConnect(server)), 100);
    dispatch(socketEmit('setName', name));
    dispatch(socketEmit('initialUpdate'));
    dispatch(showConnection(false));
};
