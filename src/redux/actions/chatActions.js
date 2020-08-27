
export const showChat = show => dispatch => {
    dispatch({ type: 'CHAT_SET_SHOW', show });
};

export const addChat = (message, options) => dispatch => {
    const chat = {
        message,
        color: 'gray',
        duration: 1000 * 60,
        textColor: 'white',
        fontWeight: 'normal',
        ...options
    };
    dispatch({ type: 'CHAT_ADD', chat  });
    setTimeout(() => {
        dispatch({ type: 'CHAT_REMOVE', chat });
    }, chat.duration);
};
