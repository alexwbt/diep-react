import React from 'react';
import styled from 'styled-components';
import { useSelector } from 'react-redux';

const Container = styled.div`
    position: fixed;
    right: 0;
    top: 0;
    padding: 10px;
    font: 20px consolas;
`;

const Player = styled.div`
    
`;

const LeaderBoard = () => {
    const { show, players } = useSelector(state => state.leaderBoard);
    return show && (
        <Container>
            Alive Players
            {
                players.map((player, i) => <div>
                    <Player>{player.name}</Player>
                </div>)
            }
        </Container>
    );
};

export default LeaderBoard;
