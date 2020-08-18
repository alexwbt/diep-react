import React, { useCallback, useState } from 'react';
import styled from 'styled-components';

const SetNameContainer = styled.div`
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

const SetNameInput = styled.input`
    font: 30px consolas;
    background-color: white;
    border-radius: 10px;
    padding: 3px;
    text-align: center;

    :focus {
        outline: none;
    }
`;

const SetNameLabel = styled.h1`
    font: 30px consolas;
    text-align: center;
`;

const SetName = ({ onSubmit, show }) => {
    const [name, setName] = useState('');
    const changeHandler = useCallback((e) => setName(e.target.value), []);
    const keyHandler = useCallback((e) => e.key === "Enter" && name && onSubmit(name), [onSubmit, name]);
    return show && (
        <SetNameContainer>
            <SetNameLabel>Enter your name</SetNameLabel>
            <SetNameInput value={name} onChange={changeHandler} onKeyDown={keyHandler} maxLength={10} />
        </SetNameContainer>
    );
};

export default SetName;
