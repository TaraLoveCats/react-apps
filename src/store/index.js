import rootReducer from './reducers'
import { createStore, applyMiddleware } from 'redux';
import createSagaMiddleware from 'redux-saga'
// import logger from 'redux-logger';
import thunk from 'redux-thunk';
import { sagaMonitor } from './actions'

const sagaMiddleware = createSagaMiddleware()
const store = createStore(
    rootReducer,
    applyMiddleware(
        thunk, 
        // logger, 
        sagaMiddleware
    )
);
sagaMiddleware.run(sagaMonitor);

export default store;