
export const showToast = show => dispatch => {
    dispatch({ type: 'TOAST_SET_SHOW', show });
};

export const addToast = (message, options) => dispatch => {
    const toast = {
        message,
        color: '#444',
        textColor: 'white',
        fontWeight: 'normal',
        duration: 5000,
        ...options
    };
    dispatch({ type: 'TOAST_ADD', toast });
    setTimeout(() => {
        dispatch({ type: 'TOAST_REMOVE', toast });
    }, toast.duration);
};
