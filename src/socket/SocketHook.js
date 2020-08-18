import { useState, useCallback } from 'react';
import io from 'socket.io-client';

const useSocket = () => {
    const [socket, setSocket] = useState(null);

    const connect = useCallback((url) => {
        setSocket(io(url));
    }, []);

    return [socket, connect];
};

export default useSocket;
