
const initialState = {
    show: true,
    chats: []
};

const chatReducer = (state = initialState, action) => {
    switch (action.type) {
        case 'CHAT_SET_SHOW':
            return {
                ...state,
                show: action.show
            }
        case 'CHAT_ADD':
            return {
                ...state,
                chats: state.chats.concat(action.chat)
            };
        case 'CHAT_CLEAR':
            return {
                ...state,
                chats: []
            };
        default: return state;
    }
};

export default chatReducer;
