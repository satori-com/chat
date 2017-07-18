import Immutable from 'immutable';
import { getTimestampNow } from '../libs/utils';

/* ------------- Types and Action Creators ------------- */

const UPDATE_PRESENCE = 'UPDATE_PRESENCE';

export function updatePresence(user) {
  const { name, avatar, activeRoom, isTyping, id } = user;
  return {
    type: UPDATE_PRESENCE,
    user: { name, avatar, activeRoom, id, isTyping },
  };
}

/* ------------- Initial State ------------- */

export const PRESENCE_INTERVAL = 300;

const emptyPresence = Immutable.fromJS({
  users: {},
  cleanedAt: getTimestampNow(),
});

/* ------------- Reducer ------------- */

export default function presenceReducer(state = emptyPresence, action) {
  switch (action.type) {
    case UPDATE_PRESENCE:
      const currentTs = getTimestampNow();
      const user = Object.assign({}, action.user, { refreshedAt: currentTs });
      let newState = state.setIn(['users', user.id], Immutable.fromJS(user));
      if (PRESENCE_INTERVAL < (currentTs - newState.get('cleanedAt'))) {
        newState = newState
          .set('cleanedAt', currentTs)
          .update('users', users => users.filter(u => (currentTs - u.get('refreshedAt')) < 50000));
      }
      return newState;
    default:
      return state;
  }
}
