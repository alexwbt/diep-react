
const initialState = {
    show: true,
    name: '',
    server: ''
};

const connectionReducer = (state = initialState, action) => {
    switch (action.type) {
        case 'CONNECTION_SET_NAME':
            return {
                ...state,
                name: action.name
            };
        case 'CONNECTION_SET_SERVER':
            return {
                ...state,
                server: action.server
            };
        case 'CONNECTION_SET_SHOW':
            return {
                ...state,
                show: action.show
            };
        default: return state;
    }
};

export default connectionReducer;
