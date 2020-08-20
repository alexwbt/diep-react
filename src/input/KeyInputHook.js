import { useEffect, useReducer } from 'react';

const useKeyInput = (keys, toggle = false) => {
    const [keyDown, setKeyDown] = useReducer((state, action) => {
        if (!keys.includes(action.key)) return state;
        switch (action.type) {
            case 'keydown':
                if (toggle) return action.ctrlKey ? state.map((down, i) => action.key === keys[i] ? !down : down) : state;
                return state.map((down, i) => down ? down : action.key === keys[i]); 
            case 'keyup':
                if (toggle) return state;
                else return state.map((down, i) => !down ? down : action.key !== keys[i]);
            default: return state;
        }
    }, keys.map(() => toggle));

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
