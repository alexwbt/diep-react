
const initialState = {
    show: true,
    toasts: []
};

const toastReducer = (state = initialState, action) => {
    switch (action.type) {
        case 'TOAST_SET_SHOW':
            return {
                ...state,
                show: action.show
            }
        case 'TOAST_ADD':
            return {
                ...state,
                toasts: state.toasts.concat(action.toast)
            };
        case 'TOAST_REMOVE':
            return {
                ...state,
                toasts: state.toasts.filter(t => t !== action.toast)
            };
        default: return state;
    }
};

export default toastReducer;
