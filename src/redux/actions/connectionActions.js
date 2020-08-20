
export const showConnection = show => dispatch => {
    dispatch({ type: 'CONNECTION_SET_SHOW', show });
};

export const setName = name => dispatch => {
    dispatch({ type: 'CONNECTION_SET_NAME', name });
};

export const setServer = server => dispatch => {
    dispatch({ type: 'CONNECTION_SET_SERVER', server });
};
