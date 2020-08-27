
export const showConnection = show => dispatch => {
    dispatch({ type: 'CONNECTION_SET_SHOW', show });
};

export const setConnectionName = name => dispatch => {
    dispatch({ type: 'CONNECTION_SET_NAME', name });
};

export const setConnectionServer = server => dispatch => {
    dispatch({ type: 'CONNECTION_SET_SERVER', server });
};
