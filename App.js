import React from 'react';
import {AppRegistry} from 'react-native';
import {Provider} from 'react-redux';
import {applyMiddleware, compose, createStore} from 'redux';
import thunkMiddleware from 'redux-thunk';
import {createLogger} from 'redux-logger';
import AppReducer from './src/reducers';
import StackNavigationApp from './src/navigators/AppNavigator';

// Apply middleware and log actions only in development mode
const loggerMiddleware = createLogger({predicate: (getState, action) => __DEV__});

function configureStore(initialState) {
    //const enhancer = compose(applyMiddleware(thunkMiddleware, loggerMiddleware));
    const enhancer = compose(applyMiddleware(thunkMiddleware));
    return createStore(AppReducer, initialState, enhancer);
}

const store = configureStore({});

class Vinetrail extends React.Component {
    render() {
        return (
            <Provider store={store}>
                <StackNavigationApp/>
            </Provider>
        );
    }
}

AppRegistry.registerComponent('vinetrail', () => Vinetrail);

export default Vinetrail;
