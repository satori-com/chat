// Object.assign polyfill
(function () {
  if (typeof Object.assign != 'function') {
    Object.assign = function (target, varArgs) { // .length of function is 2
      'use strict';
      if (target == null) { // TypeError if undefined or null
        throw new TypeError('Cannot convert undefined or null to object');
      }

      var to = target;

      for (var index = 1; index < arguments.length; index++) {
        var nextSource = arguments[index];

        if (nextSource != null) { // Skip over if undefined or null
          for (var nextKey in nextSource) {
            to[nextKey] = nextSource[nextKey];
          }
        }
      }
      return to;
    };
  }
})();

function isShortId(id) {
  if (!id || typeof id !== 'string' || id.length < 6 ) {
    return false;
  }

  var characters = '0123456789abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ_-';
  var len = id.length;
  for (var i = 0; i < len; i++) {
    if (characters.indexOf(id[i]) === -1) {
      return false;
    }
  }
  return true;
}

function Satori() {
  this.client = rtm;
}

Satori.prototype.publish = function (channel, payload) {
  this.client.publish(channel, payload);
};

Satori.prototype.write = function (channel, payload) {
  this.client.write(channel, payload);
};

Satori.prototype.read = function (channel) {
  return this.client.read(channel);
};

var sat = new Satori();

function hourToMs(hour) {
  return hour * 60 * 60 * 1000;
}

function validateCreateMessage(message) {
  // Need guid support
  return (message.metadata.channelName && isShortId(message.metadata.channelName));
}

function getChannelName(channel) {
  return 'chat.' + channel;
}

function getKeyValueStoreName(channel) {
  return 'chat.kv.' + channel;
}

function getPresenceChannelName(channel) {
  return 'chat.presence.' + channel;
}

function setChannelState(channel, state) {
  var store = getKeyValueStoreName(channel);
  var val = sat.read(store);

  if (!val) {
    sat.write(store, state);
    setChannelState(channel, state);

    return;
  }

  var channelProperties = Object.assign({}, val, state);

  sat.write(store, channelProperties);

  sat.publish(getChannelName(channel),
    {
      type: 'UPDATE_CHAT_CHANNEL',
      channelName: channel,
      expiration: channelProperties.expiration,
      status: channelProperties.status,
      topic: channelProperties.topic,
    }
  );
}

function setChannelTimer(channel, duration) {
  console.info(channel, duration);
  var kv = getKeyValueStoreName(channel);

  var val = sat.read(kv);
  var durationInMs = hourToMs(val.duration);
  var expiration = Date.now() + durationInMs;

  setTimeout(function () {
    setChannelState(channel, { status: 'expired' });
  }, durationInMs);

  setChannelState(channel, { status: 'started', expiration: expiration });
}

function channelManager(subId, message) {
  if (!message.metadata) {
    return;
  }

  var channel = getChannelName(message.metadata.channelName);
  var kv = getKeyValueStoreName(message.metadata.channelName);
  var presence = getPresenceChannelName(message.metadata.channelName);

  switch (message.type) {
    case 'create_channel':
      if (validateCreateMessage(message)) {
        var channelData = {
          channelName: message.metadata.channelName,
          duration: message.metadata.duration,
          topic: message.metadata.topic || 'Untitled',
          status: 'created',
        };

        setChannelState(message.metadata.channelName, channelData);
      }

      return;

    case 'start_channel':
      return setChannelTimer(message.metadata.channelName);

    case 'stop_channel':
      return setChannelState(message.metadata.channelName, { status: 'stopped' });

    case 'expire_channel':
      return setChannelState(message.metadata.channelName, { status: 'expired' });

    case 'bot_message':
    case 'message':
      var val = sat.read(kv);
      var output = Object.assign({}, message.payload, {metadata: val});

      return sat.publish(
        channel, output);

    case 'update_presence':
      return sat.publish(
        presence,
        message.payload);

    default:
      return;
  }
}

function onMessage(subId, message) {
  channelManager(subId, message);
}
