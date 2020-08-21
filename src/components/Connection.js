import React, { Fragment, useCallback, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import styled from 'styled-components';
import { showConnection } from '../redux/actions/connectionActions';
import { socketConnect, socketDisconnect } from '../redux/actions/socketActions';
import { addToast } from '../redux/actions/toastActions';
import { socketEmit } from '../redux/actions/socketActions';

const ConnectionContainer = styled.div`
    position: fixed;
    left: 50%;
    top: 50%;
    transform: translate(-50%, -50%);
    padding: 20px;
    background-color: white;
    border-radius: 10px;

    -webkit-box-shadow: 0px 0px 50px -4px rgba(0,0,0,0.45);
    -moz-box-shadow: 0px 0px 50px -4px rgba(0,0,0,0.45);
    box-shadow: 0px 0px 50px -4px rgba(0,0,0,0.45);
`;

const Input = styled.input`
    font: 30px consolas;
    background-color: white;
    border-radius: 10px;
    padding: 3px;
    text-align: center;

    :focus {
        outline: none;
    }
`;

const ConnectionLabel = styled.div`
    margin: 10px;
    font: ${props => props.size || 30}px consolas;
    text-align: center;
`;

const ConnectionButton = styled.button`
    font: 20px consolas;
    border: none;
    border-radius: 10px;
    background-color: ${props => props.color};
    color: white;
    margin: 5px;
    padding: 3px 8px;
    position: fixed;
    right: 0;
    bottom: 0;
    cursor: pointer;
    :focus {
        outline: none;
    }
`;

const Connection = () => {
    const [name, setName] = useState('');
    const [gameServer, setGameServer] = useState('13.251.227.221');

    const { show, connected } = useSelector(state => ({ show: state.connection.show, connected: state.socket?.connected }));
    const dispatch = useDispatch();

    const nameChangeHandler = useCallback((e) => setName(e.target.value), []);
    const gameServerChangeHandler = useCallback((e) => setGameServer(e.target.value), []);

    const keyHandler = useCallback((e) => {
        if (e.key === "Enter" && name && gameServer) {
            dispatch(addToast('Trying to connected to ' + gameServer));
            dispatch(socketConnect(gameServer));
            dispatch(socketEmit('setName', name));
            dispatch(socketEmit('initialUpdate'));
            dispatch(showConnection(false));
        }
    }, [name, gameServer, dispatch]);

    const onClickConnect = useCallback(() => {
        dispatch(showConnection(!show));
    }, [show, dispatch]);

    const onClickDisconnect = useCallback(() => {
        dispatch(socketDisconnect());
    }, [dispatch]);

    return (
        <Fragment>
            {
                show && <ConnectionContainer>
                    <ConnectionLabel>Enter your name</ConnectionLabel>
                    <Input value={name} onChange={nameChangeHandler} onKeyDown={keyHandler} maxLength={10} placeholder="name" />
                    <ConnectionLabel>Connecting to</ConnectionLabel>
                    <Input value={gameServer} onChange={gameServerChangeHandler} onKeyDown={keyHandler} placeholder="game server" />
                </ConnectionContainer>
            }
            {
                connected && <ConnectionButton color={'#cc5555'} onClick={onClickDisconnect}>Disconnect</ConnectionButton>
            }
            {
                !connected && <ConnectionButton color={'#55cc99'} onClick={onClickConnect}>Connect</ConnectionButton>
            }
        </Fragment>
    );
};

export default Connection;
