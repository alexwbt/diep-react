import React from 'react';
import styled, { keyframes } from 'styled-components';

const ToasterContainer = styled.div`
    position: fixed;
    left: 50%;
    transform: translateX(-50%);
`;

const dropDownAnimation = keyframes`
    from {
        opacity: 0;
        transform: translateY(-100%);
    }
    to {
        opacity: 1;
        transform: 0;
    }
`;

const ToastWrapper = styled.div`
    margin: 5px;
    text-align: center;
    animation: ${dropDownAnimation} 0.3s linear;
`;

const Toast = styled.div`
    display: inline-block;
    padding: 5px 15px;
    background-color: ${props => props.color};
    border-radius: 5px;
    opacity: 0.8;
    
    font: 18px consolas;
    font-weight: ${props => props.fontWeight};
    color: ${props => props.textColor};
`;

const Toaster = ({ toasts, show }) => show && (
    <ToasterContainer>
        {
            toasts.map((toast, i) => (
                <ToastWrapper key={i}>
                    <Toast {...toast}>{toast.message}</Toast>
                </ToastWrapper>
            ))
        }
    </ToasterContainer>
);

export default Toaster;