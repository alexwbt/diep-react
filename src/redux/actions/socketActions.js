
export const socketConnect = (server, listeners) => dispatch => {
    dispatch({ type: 'SOCKET_CONNECT', server, listeners });
};

export const socketEmit = (name, data) => dispatch => {
    dispatch({ type: 'SOCKET_EMIT', name, data });
};
