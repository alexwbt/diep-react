import { useState, useCallback } from 'react';

const useChat = () => {
    const [chats, setChats] = useState([]);

    const appendMessage = useCallback(({ message, options }) => {
        const chat = {
            message,
            color: 'gray',
            duration: 5000,
            textColor: 'white',
            fontWeight: 'normal',
            ...options
        };
        setChats(t => t.concat(chat));
    }, []);

    return [chats, appendMessage];
};

export default useChat;
