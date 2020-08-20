import React, { useCallback, useRef, useState, useEffect } from 'react';
import styled, { keyframes } from 'styled-components';
import { useSelector, useDispatch } from 'react-redux';
import { socketEmit } from '../redux/actions/socketActions';

const ChatContainer = styled.div`
    position: fixed;
    bottom: 0;
    left: 0;
    opacity: 0.6;
    padding: 5px;
`;

const ChatInput = styled.input`
    font: 20px consolas;
    margin-top: 5px;
    width: 25vw;
    border: none;
    background-color: rgba(0, 0, 0, 0);
    border-bottom: 2px solid black;

    :focus {
        outline: none;
    }
`;

const ChatScroll = styled.div`
    overflow: auto;
    max-height: 50vh;

    ::-webkit-scrollbar { 
        display: none;
    }
`;

const upAnimation = keyframes`
    from {
        opacity: 0;
        transform: translateX(-100%);
    }
    to {
        opacity: 1;
        transform: 0;
    }
`;

const MessageWrapper = styled.div`
    margin: 5px;
    direction:ltr;
    animation: ${upAnimation} 0.2s linear;
`;

const Message = styled.div`
    display: inline-block;
    background-color: ${props => props.color};
    border-radius: 5px;
    padding: 2px 10px;

    font: 18px consolas;
    font-weight: ${props => props.fontWeight};
    color: ${props => props.textColor};
`;

const Chat = () => {
    const scroll = useRef(null);
    const [message, setMessage] = useState('');

    const { show, chats } = useSelector(state => state.chat);
    const dispatch = useDispatch();

    const changeHandle = useCallback(e => {
        setMessage(e.target.value);
    }, [setMessage]);

    const keyDownHandle = useCallback(e => {
        if (message && e.key === 'Enter') {
            socketEmit('chat', message)(dispatch);
            setMessage('');
        }
    }, [message, setMessage, dispatch]);

    useEffect(() => {
        if (show) scroll.current.scrollTop = scroll.current.scrollHeight;
    }, [chats, scroll, show]);

    return show && (
        <ChatContainer>
            <ChatScroll ref={scroll}>
                {
                    chats.map((chat, i) => (
                        <MessageWrapper key={i}>
                            <Message {...chat}>{chat.message}</Message>
                        </MessageWrapper>
                    ))
                }
            </ChatScroll>
            <ChatInput value={message} onChange={changeHandle} onKeyDown={keyDownHandle} />
        </ChatContainer>
    );
};

export default Chat;
