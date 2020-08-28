import React from 'react';
import styled from 'styled-components';
import { useSelector } from 'react-redux';

const Container = styled.div`
    position: fixed;
    right: 0;
    top: 0;
    padding: 10px;
    font: 20px consolas;
    text-align: center;
`;

const Head = styled.div`
    border-bottom: 2px solid black;
    padding: 0 10px;
`;

const LeaderBoard = () => {
    const { show, players } = useSelector(state => state.leaderBoard);
    return show && (
        <Container>
            <Head>Alive Players</Head>
            {
                players.map((player, i) => <div key={i}>{player.name}</div>)
            }
        </Container>
    );
};

export default LeaderBoard;
