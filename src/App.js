import React from 'react';
import { Provider } from 'react-redux';
import Canvas from './components/Canvas';
import Chat from './components/Chat';
import Connection from './components/Connection';
import Spawn from './components/Spawn';
import rootReducer from './redux/reducers/rootReducer';
import Toaster from './components/Toast';
import { showConnection } from './redux/actions/connectionActions';
import {createStore} from 'redux';
import {useEffect} from 'react';
import { showToast } from './redux/actions/toastActions';
import { showChat } from './redux/actions/chatActions';

const store = createStore(rootReducer);

const App = () => {

    useEffect(() => {
        showConnection(true)(store.dispatch);
        showToast(true)(store.dispatch);
        showChat(true)(store.dispatch);
    }, []);

    return (
        <React.StrictMode>
            <Provider store={store}>
                <Canvas />
                <Toaster />
                <Chat />
                <Connection />
                <Spawn />
            </Provider>
        </React.StrictMode>
    );
};

export default App;
