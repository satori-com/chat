import { Map } from 'immutable';
import uuid from 'uuid';
import jsCookie from 'js-cookie';

/* ------------- Types and Action Creators ------------- */

export const CREATE_USER = 'CREATE_USER';
export const SET_FIPS_CODE = 'SET_FIPS_CODE';
export const UPDATE_USER_GEOLOCATION = 'UPDATE_USER_GEOLOCATION';
export const UPDATE_USER_ACTIVE_ROOM = 'UPDATE_USER_ACTIVE_ROOM';
export const UPDATE_USER_ACTIVITY = 'UPDATE_USER_ACTIVITY';
const COOKIE_PREFIX = 'satori-demo-user';

export function getUser() {
  let user = jsCookie.get(COOKIE_PREFIX);

  if (!user) {
    return {};
  }

  try {
    user = JSON.parse(user);
    if (!user.name || !user.id || !user.avatar) {
      setUser(null);
      return {};
    }

    return user;
  } catch (e) {
    return {};
  }
}

export function setUser(user) {
  jsCookie.set(COOKIE_PREFIX, user);
}

export function createUser({ avatar, name }) {

  setUser({ avatar, name, id: uuid() });

  return {
    type: CREATE_USER,
    avatar,
    name,
    id: uuid(),
  };
}

export function updateUserGeolocation(geolocation) {
  return {
    type: UPDATE_USER_GEOLOCATION,
    geolocation,
  };
}

export function updateUserActiveRoom(activeRoom) {
  return {
    type: UPDATE_USER_ACTIVE_ROOM,
    activeRoom,
  };
}

export function updateUserActivity(isTyping) {
  return {
    type: UPDATE_USER_ACTIVITY,
    isTyping,
  };
}

/* ------------- Initial State ------------- */
const emptyUser = Map(getUser());

/* ------------- Reducer ------------- */

export default function userReducer(state = emptyUser, action) {
  switch (action.type) {
    case CREATE_USER:
      const { avatar, name, id } = action;
      return state.merge({ avatar, name, id });

    case SET_FIPS_CODE:
      const { payload } = action;
      return state.merge({ County: payload.name, FIPS: payload.FIPS });

    case UPDATE_USER_GEOLOCATION:
      const { geolocation } = action;
      return state.merge({ geolocation });

    case UPDATE_USER_ACTIVE_ROOM:
      const { activeRoom } = action;
      return state.merge({ activeRoom });

    case UPDATE_USER_ACTIVITY:
      const { isTyping } = action;
      return state.merge({ isTyping });

    default:
      return state;
  }
}
