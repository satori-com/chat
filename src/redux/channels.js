import { OrderedMap, Record } from 'immutable';
import lsCache from 'ls-cache';
import rtm from '../libs/rtm';

/* ------------- Types and Action Creators ------------- */

export const actionCreators = {
  CREATE_CHAT_CHANNEL: 'CREATE_CHAT_CHANNEL',
  CHAT_CHANNEL_NONEXISTANT: 'CHAT_CHANNEL_NONEXISTANT',
  START_CHANNEL: 'START_CHANNEL',
  SUBSCRIBE_CHAT_CHANNEL: 'SUBSCRIBE_CHAT_CHANNEL',
  SUBSCRIBE_CHAT_CHANNEL_SUCCESS: 'SUBSCRIBE_CHAT_CHANNEL_SUCCESS',
  UPDATE_CHAT_CHANNEL: 'UPDATE_CHAT_CHANNEL',
  UPDATE_MESSAGE: 'UPDATE_MESSAGE',
};

const SUBSCRIPTION_TIMEOUT_DURATION = 3000;

export function subscribeChatChannel(channelName) {
  return (dispatch, getState) => {
    const subscription = rtm.subscribe(channelName).channel;

    // once the subscription (with history) is ready
    // if no messages have been received by the end of SUBSCRIPTION_TIMEOUT_DURATION,
    // assume there are no messages and thus this channel does not exist
    subscription.on('enter-subscribed', () => {
      dispatch({
        type: actionCreators.SUBSCRIBE_CHAT_CHANNEL_SUCCESS,
        payload: { channelName },
      });

      setTimeout(() => {
        if (getState().channels.getIn([channelName, 'subscriptionStatus']) === 'waiting') {
          rtm.unsubscribe(channelName);

          dispatch({
            type: actionCreators.CHAT_CHANNEL_NONEXISTANT,
            payload: { channelName },
          });
        }
      }, SUBSCRIPTION_TIMEOUT_DURATION)
    });

    dispatch({
      type: 'SUBSCRIBE_CHAT_CHANNEL',
      payload: { channelName },
    });
  };
}

export function updateMessage(channelName, message, user, options) {
  const { id, text, createdAt } = message;
  const { name, avatar, geolocation, FIPS, County } = user;
  return {
    type: actionCreators.UPDATE_MESSAGE,
    channelName,
    message: {
      id,
      text,
      user: {
        name,
        avatar,
        FIPS,
        County,
      },
      createdAt,
    },
    geolocation,
    options,
  };
}

export function createChatChannel(payload) {
  return Object.assign({ type: actionCreators.CREATE_CHAT_CHANNEL }, payload);
}

export function startChat(channelName, duration) {
  return (dispatch) => {
    dispatch({
      type: actionCreators.START_CHANNEL,
      payload: { channelName },
    });

    rtm.publish('channel-manager', {
      type: 'start_channel',
      metadata: {
        duration,
        channelName,
      },
    });
  };
}

/* ------------- Initial State ------------- */

const Channel = new Record({
  subscriptionStatus: 'unsubscribed', // unsubscribed | waiting | subscribed
  name: null,
  topic: null,
  status: null,
  duration: null,
  expiration: null,
  history: OrderedMap(),
});

/* ------------- Reducer ------------- */

export default function channelReducer(state = OrderedMap(), action) {
  switch (action.type) {
    case actionCreators.SUBSCRIBE_CHAT_CHANNEL:
      const hasChannel = state.has(action.payload.channelName);

      return hasChannel
        ? state
        : state.set(action.payload.channelName, new Channel({
          subscriptionStatus: 'unsubscribed', // unsubscribed | waiting | subscribed
          history: OrderedMap(),
        }));
    case actionCreators.SUBSCRIBE_CHAT_CHANNEL_SUCCESS:
      return state.setIn([action.payload.channelName, 'subscriptionStatus'], 'waiting');

    case actionCreators.CHAT_CHANNEL_NONEXISTANT:
      return state.setIn([action.payload.channelName, 'subscriptionStatus'], 'unsubscribed')
        .setIn([action.payload.channelName, 'status'], 'nonexistent');

    case actionCreators.CREATE_CHAT_CHANNEL:

      const newChatChannel = new Channel({
        subscriptionStatus: 'unsubscribed',
        name: action.channelName,
        topic: action.topic,
        duration: action.duration,
        status: action.status,
      });

      const chat = state.set(action.channelName, newChatChannel);

      lsCache.set('chats', chat.toJS());

      return chat;

    case actionCreators.UPDATE_CHAT_CHANNEL:
      if (!state.has(action.channelName)) {
        return state;
      }

      return state.update(action.channelName, (channelState) => {
        return channelState.mergeDeep({
          name: action.channelName,
          status: action.status,
          topic: action.topic,
          expiration: action.expiration || channelState.get('expiration'),
          duration: action.duration || channelState.get('duration'),
          subscriptionStatus: 'subscribed',
        });
      });

    case actionCreators.UPDATE_MESSAGE:
      // if message comes from an unknown channel, then create the channel
      if (!state.has(action.channelName)) {
        const channel = new Channel({
          name: action.channelName,
          topic: action.metadata && action.metadata.topic,
          expiration: action.metadata && action.metadata.expiration,
        });
        state = state.set(action.channelName, channel);
      }

      return state.updateIn([action.channelName, 'history', action.message.id], (v) => {
        return Object.assign({}, v, action.message);
      }).updateIn([action.channelName, 'history'], h => h.takeLast(100));

    case actionCreators.START_CHANNEL:
      return state.updateIn([action.payload.channelName, 'status'], () => 'starting');

    default:
      return state;
  }
}
