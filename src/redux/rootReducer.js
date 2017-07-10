import { routerReducer as routing } from 'react-router-redux';
import { combineReducers } from 'redux';
import { reducer as formReducer } from 'redux-form'
import channels from './channels';
import user from './user';
import presence from './presence';

export default combineReducers(Object.assign({}, {
  me: user,
  routing,
  channels,
  presence,
  form: formReducer,
}));
