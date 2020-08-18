import { useEffect, useReducer } from 'react';

const useKeyInput = keys => {
    const [keyDown, setKeyDown] = useReducer((state, action) => {
        switch (action.type) {
            case 'keydown': return state.map((down, i) => down ? down : action.key === keys[i]);
            case 'keyup': return state.map((down, i) => !down ? down : action.key !== keys[i]);
            default: return state;
        }
    }, keys.map(() => false));

    useEffect(() => {
        const inputHandler = e => !e.repeat && setKeyDown(e);
        window.addEventListener('keydown', inputHandler);
        window.addEventListener('keyup', inputHandler);
        return () => {
            window.removeEventListener('keydown', inputHandler);
            window.removeEventListener('keyup', inputHandler);
        };
    }, []);

    return keyDown;
};

export default useKeyInput;
