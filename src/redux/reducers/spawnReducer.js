
const initialState = {
    show: false,
    message: 'YOU DIED'
};

const spawnReducer = (state = initialState, action) => {
    switch (action.type) {
        case 'SPAWN_SET_MESSAGE':
            return {
                ...state,
                message: action.message
            };
        case 'SPAWN_SET_SHOW':
            return {
                ...state,
                show: action.show
            };
        default: return state;
    }
};

export default spawnReducer;
