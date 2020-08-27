import React from 'react';
import { Provider } from 'react-redux';
import Canvas from './components/Canvas';
import Chat from './components/Chat';
import Connection from './components/Connection';
import Spawn from './components/Spawn';
import rootReducer from './redux/reducers/rootReducer';
import Toaster from './components/Toast';
import { createStore, applyMiddleware } from 'redux';
import thunk from 'redux-thunk';
import LeaderBoard from './components/LeaderBoard';

const store = createStore(rootReducer, applyMiddleware(thunk));

const App = () => {

    return (
        <React.StrictMode>
            <Provider store={store}>
                <Canvas />
                <Toaster />
                <Chat />
                <Connection />
                <Spawn />
                <LeaderBoard />
            </Provider>
        </React.StrictMode>
    );
};

export default App;
