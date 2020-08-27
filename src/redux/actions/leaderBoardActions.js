
export const showLeaderBoard = show => dispatch => {
    dispatch({ type: 'LEADER_BOARD_SET_SHOW', show });
};

export const leaderBoardSetPlayers = players => dispatch => {
    dispatch({ type: 'LEADER_BOARD_SET_PLAYERS', players  });
};

export const clearLeaderBoard = () => dispatch => {
    dispatch({ type: 'LEADER_BOARD_CLEAR'  });
};
