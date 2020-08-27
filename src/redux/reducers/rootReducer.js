import { combineReducers } from 'redux';
import chat from './chatReducer';
import connection from './connectionReducer';
import leaderBoard from './leaderBoardReducer';
import socket from './socketReducer';
import spawn from './spawnReducer';
import toast from './toastReducer';

const rootReducer = combineReducers({
    socket,
    toast,
    chat,
    connection,
    spawn,
    leaderBoard
});

export default rootReducer;
