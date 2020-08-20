import { combineReducers } from 'redux';
import socket from './socketReducer';
import toast from './toastReducer';
import chat from './chatReducer';
import connection from './connectionReducer';
import spawn from './spawnReducer';

const rootReducer = combineReducers({
    socket,
    toast,
    chat,
    connection,
    spawn
});

export default rootReducer;
