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
        const downHandler = e => !e.repeat && setKeyDown(e);
        const upHandler = e => !e.repeat && setKeyDown(e);
        window.addEventListener('keydown', downHandler);
        window.addEventListener('keyup', upHandler);
        return () => {
            window.removeEventListener('keydown', downHandler);
            window.removeEventListener('keyup', upHandler);
        };
    }, []);

    return keyDown;
};

export default useKeyInput;
