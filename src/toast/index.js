import React, { useState } from 'react';
import styled, { keyframes } from 'styled-components';

const ToastContainer = styled.div`
    position: fixed;
    left: 50%;
    transform: translateX(-50%);
`;

const rotate = keyframes`
    from {
        transform: translateY(-100vh);
    }
    to {
        transform: 0;
    }
`;

const ToastWrapper = styled.div`
    margin: 5px;
    text-align: center;
    
    animation: ${rotate} 0.3s linear;
`;

const Toast = styled.div`
    display: inline-block;
    padding: 5px 15px;
    background-color: grey;
    border-radius: 5px;
    color: white;
    font: 18px consolas;
    opacity: 0.8;
`;

const Toaster = ({toasts}) => {
    return (
        <ToastContainer>
            {
                toasts.map((t, i) => (
                    <ToastWrapper key={i}>
                        <Toast>{t}</Toast>
                    </ToastWrapper>
                ))
            }
        </ToastContainer>
    );
};

export default Toaster;
