import React, { useCallback } from 'react';
import styled from 'styled-components';
import { useSelector, useDispatch } from 'react-redux';
import { socketEmit } from '../redux/actions/socketActions';
import { showSpawn } from '../redux/actions/spawnActions';

const SpawnContainer = styled.div`
    position: fixed;
    left: 50%;
    top: 50%;
    transform: translate(-50%, -50%);
    padding: 30px;
    background-color: white;
    border-radius: 10px;
    text-align: center;

    -webkit-box-shadow: 0px 0px 50px -4px rgba(0,0,0,0.45);
    -moz-box-shadow: 0px 0px 50px -4px rgba(0,0,0,0.45);
    box-shadow: 0px 0px 50px -4px rgba(0,0,0,0.45);
`;

const SpawnLabel = styled.h1`
    font: 30px consolas;
    margin-top: 0;
`;

const Button = styled.button`
    padding: 10px 20px;
    border: 0;
    border-radius: 10px;
    background-color: #0af;
    color: white;
    font: 30px consolas;
    cursor: pointer;

    :focus {
        outline: none;
    }
`;

const Spawn = () => {
    const { show, message } = useSelector(state => state.spawn);
    const dispatch = useDispatch();
    
    const onSpawn = useCallback(() => {
        socketEmit('spawnPlayer')(dispatch);
        showSpawn(false)(dispatch);
    }, [dispatch]);

    return show && (
        <SpawnContainer>
            <SpawnLabel>{message}</SpawnLabel>
            <Button onClick={onSpawn}>Spawn</Button>
        </SpawnContainer>
    );
};

export default Spawn;
