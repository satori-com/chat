import RTM from 'satori-rtm-sdk';
import { updatePresence, PRESENCE_INTERVAL } from '../redux/presence';
import { updateUserGeolocation } from '../redux/user';
import jsonp from 'jsonp';
import config from '../etc/config';

const CHANNEL_OPTS = {
  history: {
    age: config.historyMaxAge,
  },
};

class RTMContainer {
  constructor(appkey, endpoint, role, roleSecret) {
    const roleSecretProvider = RTM.roleSecretAuthProvider(role, roleSecret);
    this.client = new RTM(endpoint, appkey, {
      authProvider: roleSecretProvider,
    });
    this.client.start();
  }

  // subscribes to channel data and sets the data callback and error handlers
  subscribe(name, opts, callback) {
    const oldSub = this.client.getSubscription(name);
    if (oldSub) {
      return oldSub;
    }
    const channel = this.client.subscribe(name, RTM.SubscriptionMode.RELIABLE, opts);
    channel.on('rtm/subscription/data', ({ body: { messages } }) => {
      messages.forEach(message => callback(message));
    });
    return channel;
  }

  unsubscribe(name) {
    this.client.unsubscribe(name);
  }

  publish(name, msg) {
    this.client.publish(name, msg);
  }
}

class RTMActions {
  constructor() {
    this.rtm = new RTMContainer(config.appkey, config.endpoint, config.role, config.roleSecret);
  }

  publish(channelName, message) {
    this.rtm.publish(channelName, message);
  }

  subscribe(channelName, cb) {
    const contentChannelName = this.chatChannelName(channelName);
    const presenceChannelName = this.presenceChannelName(channelName);
    const ondata = (data) => {
      if (data.type) {
        this.store.dispatch(data);
      }

      if (cb && typeof cb === 'function') {
        cb(data);
      }
    };
    const channelSubScription = this.rtm.subscribe(contentChannelName, CHANNEL_OPTS, ondata);
    const presenceSubScription = this.rtm.subscribe(presenceChannelName, CHANNEL_OPTS, ondata);

    return {
      channel: channelSubScription,
      presence: presenceSubScription,
    };
  }

  unsubscribe(channelName) {
    this.rtm.unsubscribe(this.chatChannelName(channelName));
    this.rtm.unsubscribe(this.presenceChannelName(channelName));
  }

  initSubscriptions(store) {
    this.store = store;
    this._initPresenceChannel(store);
  }

  _initPresenceChannel(store) {
    // report presence with fixed interval to the reserved channel
    this._presenceCycle(store);
    setInterval(this._presenceCycle.bind(this, store), PRESENCE_INTERVAL);
  }

  _getFipsCode(store, geoLocation) {
    const fips  = store.getState().me.get('FIPS');

    if (!fips) {
      const latitude = geoLocation.latitude;
      const longitude = geoLocation.longitude;

      const locationDataUrl = `https://data.fcc.gov/api/block/find?latitude=${latitude}&longitude=${longitude}&showall=true&format=jsonp`;
      jsonp(locationDataUrl, (err, data) => {
        if (data && data.County) {
          store.dispatch({ type: 'SET_FIPS_CODE', payload: data.County })
        }
      });
    }
  }

  _presenceCycle(store) {
    if (navigator.geolocation && config.useGeolocation) {
      navigator.geolocation.getCurrentPosition((position) => {
        const geolocation = {
          latitude: position.coords.latitude,
          longitude: position.coords.longitude,
        };

        if (geolocation) {
          this._getFipsCode(store, geolocation)
        }

        store.dispatch(updateUserGeolocation(geolocation));
        this._publishPresence(store);
      }, () => this._publishPresence(store));
    } else {
      this._publishPresence(store);
    }
  }

  _publishPresence(store) {
    const user = store.getState().me.toJS();
    if (user.activeRoom) {
      this.rtm.publish('channel-manager', {
        type: 'update_presence',
        metadata: {
          channelName: user.activeRoom,
        },
        payload: updatePresence(user),
      });
    }
  }

  chatChannelName(channelName) {
    return `chat.${channelName}`;
  }

  presenceChannelName(channelName) {
    return `chat.presence.${channelName}`;
  }
}

const _RTMActions = new RTMActions();

export default _RTMActions;
