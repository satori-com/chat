import { applyMiddleware, createStore, compose } from 'redux';
import { routerMiddleware } from 'react-router-redux';
import thunk from 'redux-thunk';
import rootReducer from './rootReducer';

export default function configureStore({ initialState = {}, history }) {
  const devtoolEnhancer = process.env.NODE_ENV !== 'production' &&
  window.devToolsExtension ?
    window.devToolsExtension() :
    f => f;
  const middleWare = applyMiddleware(
    routerMiddleware(history),
    thunk,
  );

  return createStore(rootReducer, initialState, compose(middleWare, devtoolEnhancer));
}
