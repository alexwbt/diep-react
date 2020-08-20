
export const showSpawn = show => dispatch => {
    dispatch({ type: 'SPAWN_SET_SHOW', show });
};

export const setMessage = message => dispatch => {
    dispatch({ type: 'SPAWN_SET_MESSAGE', message });
};
