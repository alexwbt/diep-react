
const initialState = {
    show: true,
    players: []
};

const leaderBoardReducer = (state = initialState, action) => {
    switch (action.type) {
        case 'LEADER_BOARD_SET_SHOW':
            return {
                ...state,
                show: action.show
            };
        case 'LEADER_BOARD_SET_PLAYERS':
            return {
                ...state,
                players: action.players
            };
        case 'LEADER_BOARD_CLEAR':
            return {
                ...state,
                players: []
            };
        default: return state;
    }
};

export default leaderBoardReducer;
