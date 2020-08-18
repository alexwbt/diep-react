import { useCallback, useState } from 'react';

const useToast = () => {
    const [toasts, setToasts] = useState([]);

    const addToast = useCallback(({ message, options }) => {
        const toast = {
            message,
            color: '#444',
            duration: 5000,
            textColor: 'white',
            fontWeight: 'normal',
            ...options
        };
        setToasts(t => t.concat(toast));
        setTimeout(() => setToasts(t => t.filter(e => e !== toast)), toast.duration);
    }, []);

    return [toasts, addToast];
};

export default useToast;
