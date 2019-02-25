import React from 'react';
import ReactDOM from 'react-dom';
import { Provider } from 'react-redux'
import { createStore, combineReducers } from 'redux';
import registerServiceWorker from './registerServiceWorker';
import allMap from './reducers/reducer3'
import allData from "./reducers/reducerAllData";
import websocketConn from "./reducers/websocketConnection";
import App from './App';
import './scss/app.scss';

const store = createStore(combineReducers({ allMap, allData, websocketConn}), window.__REDUX_DEVTOOLS_EXTENSION__ && window.__REDUX_DEVTOOLS_EXTENSION__())//, [{text : "hello" , completed :false }])
export default store;

// store.dispatch(connect('ws://localhost:8080/v1/json/socket', true));
ReactDOM.render(<Provider store={store} ><App /></Provider>, document.getElementById('root'));
registerServiceWorker();
