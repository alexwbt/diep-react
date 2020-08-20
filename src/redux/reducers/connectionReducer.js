
const initialState = {
    show: false,
    name: '',
    server: '13.251.227.221'
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